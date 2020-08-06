import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authForm: FormGroup;
  isSubmitted  =  false;
  authError = false;

  constructor(private authService: AuthService,  private formBuilder: FormBuilder, private http: HttpClient, private router: Router ) { }

  ngOnInit() {
    this.authForm  =  this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });
  }

  get formControls() { return this.authForm.controls; }

  signIn(){
    this.isSubmitted = true;
    if (this.authForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    const body = new HttpParams()
      .set('email', this.authForm.value.email)
      .set('password', this.authForm.value.password);
    this.http.post<any>(`${environment.apiUrl}/login`, body, httpOptions).subscribe(
      (val) => {
        this.authService.signIn(val.user, val.token);
        this.router.navigateByUrl('/admin');
      },
      err => {
        this.authError = true;
      });
  }

}
