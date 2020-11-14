import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  isSubmitted  =  false;
  formError = false;
  textError = '';
  code = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
    });

    this.changePasswordForm  =  this.formBuilder.group({
      email: [''],
      code: ['']
    });
  }

  get formControls() { return this.changePasswordForm.controls; }

  validate() {
    this.isSubmitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    if (this.changePasswordForm.value.email === '' && this.changePasswordForm.value.code === '') {
      this.formError = true;
      this.textError = 'Debes completar la información';
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    if (this.changePasswordForm.value.code === '') {
      const body = new HttpParams().set('email', this.changePasswordForm.value.email);
      this.http.post<any>(`${environment.apiUrl}/recordar-contrasena`, body, httpOptions).subscribe(
        (val) => {
          this.formError = false;
          this.router.navigateByUrl(`/change-password?code=${val.code}`);
        },
        err => {
          this.formError = true;
          this.textError = err.message;
        });
    } else {
      this.http.get<any>(`${environment.apiUrl}/recordar-contrasena/${this.code}`, httpOptions).subscribe(
        (val) => {
          if (this.changePasswordForm.value.code === val.code){
            this.formError = false;
            this.router.navigateByUrl(`/reset-password?code=${this.code}`);
          } else {
            this.formError = true;
            this.textError = 'El código no es válido';
          }
        },
        err => {
          this.formError = true;
          this.textError = err.message;
        });
    }
  }

}
