import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  isSubmitted  =  false;
  userError = false;
  hide = true;

  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    Authorization: localStorage.getItem('ACCESS_TOKEN')
    })
  };

  constructor( private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private http: HttpClient, private router: Router ) { }

  ngOnInit(): void {
    this.userForm  =  this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    });
  }

  get formControls() { return this.userForm.controls; }

  submit(){
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const body = new HttpParams()
      .set('name', this.userForm.value.name)
      .set('email', this.userForm.value.email)
      .set('password', this.userForm.value.password)
      .set('company', localStorage.getItem('company'));

    this.http.post<any>(`${environment.apiUrl}/usuario/`, body, this.httpOptions).subscribe(
      (val) => {
        this._snackBar.open('Confirmado', 'Usuario creado', {
          duration: 2000,
        });
        this.router.navigateByUrl('/users');
      },
      err => {
        this._snackBar.open('Error', 'No se pudo crear el usuario', {
          duration: 2000,
        });
      });
  }

}
