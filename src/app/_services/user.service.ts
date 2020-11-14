import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';



export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users = new BehaviorSubject<User[]>([]);
  private dataList: { users: User[] } = { users: [] };
  readonly users = this._users.asObservable();

  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: localStorage.getItem('ACCESS_TOKEN')
    })
  };

  constructor( private http: HttpClient, private snackBar: MatSnackBar ) { }

  getAll() {
    this.http.get(`${environment.apiUrl}/usuario`, this.httpOptions).subscribe(
      data => {
        this.dataList.users = data['users'];
        this._users.next(Object.assign({}, this.dataList).users);
      },
      error => console.log('No se han encontrado datos.')
    );
  }

  create(user: HttpParams) {
    this.http.post<User>(`${environment.apiUrl}/usuario/`, user, this.httpOptions).subscribe(
      data => {
        this.dataList.users.push(data['usuario']);
        this._users.next(Object.assign({}, this.dataList).users);
        this.snackBar.open('Confirmado', 'Usuario creado', {
          duration: 2000,
        });
      },
      error => {
        this.snackBar.open('Error', 'No se pudo crear el usuario', {
          duration: 2000,
        });
      });
  }

  update(idUser: string, user: HttpParams) {
    this.http.put<any>(`${environment.apiUrl}/usuario/${idUser}`, user, this.httpOptions).subscribe(
      (data) => {
        this.dataList.users.forEach((user, i) => {
          if (user._id === data['usuario']._id) { this.dataList.users[i] = data['usuario']; }
        });
        this._users.next(Object.assign({}, this.dataList).users);
        this.snackBar.open('Confirmado', 'Usuario editado', {
          duration: 2000,
        });
        return true;
      },
      error => {
        this.snackBar.open('Error', 'No se pudo editar el usuario', {
          duration: 2000,
        });
        return false;
      });
  }

  delete(idUser: string){
    this.http.delete<any>(`${environment.apiUrl}/usuario/${idUser}`, this.httpOptions).subscribe(
      (val) => {
        this.dataList.users.forEach((user, i) => {
          if (user._id === idUser) { this.dataList.users.splice(i, 1); }
        });
        this._users.next(Object.assign({}, this.dataList).users);
        this.snackBar.open('Confirmado', 'Usuario eliminado', {
          duration: 2000,
        });
      },
      err => {
        this.snackBar.open('Error', 'No se pudo eliminar el usuario', {
          duration: 2000,
        });
      });
  }

}
