import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
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
    this.resetPasswordForm  =  this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  get formControls() { return this.resetPasswordForm.controls; }

  validate() {
    this.isSubmitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    const body = new HttpParams().set('password', this.resetPasswordForm.value.password);
    this.http.put<any>(`${environment.apiUrl}/cambiar-clave/${this.code}`, body, httpOptions).subscribe(
      (val) => {
        this.router.navigateByUrl('/login');
      },
      err => {
        this.formError = true;
        this.textError = err.message;
      });
  }

}
