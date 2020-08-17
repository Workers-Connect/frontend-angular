import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'email', 'name', 'role', 'status'];
  dataSource: MatTableDataSource<UserData>;
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: localStorage.getItem('ACCESS_TOKEN')
    })
  };

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor( private http: HttpClient ) { }

  ngOnInit(): void {
    this.getUsers().subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data['users']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getUsers(){
    return this.http.get(`${environment.apiUrl}/usuario`, this.httpOptions);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
