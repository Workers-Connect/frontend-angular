import { Injectable } from '@angular/core';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( ) { }

  signIn(userData: User, token: string){
    localStorage.setItem('ACCESS_TOKEN', token);
  }

  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public logout(){
    localStorage.removeItem('ACCESS_TOKEN');
  }
}
