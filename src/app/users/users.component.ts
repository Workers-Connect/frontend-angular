import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../_services/user.service';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
}

interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'email', 'name', 'role', 'status', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor( public dialog: MatDialog, private userService: UserService ) { }

  ngOnInit(): void {
    this.userService.users.subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.userService.getAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(
    _id: string = null,
    name: string = null,
    email: string = null,
    password: string = null,
    role: string = null,
    status: boolean = null
  ): void {
    const dialogRef = this.dialog.open(DialogUserFormDialog, {
      width: '500px',
      data: {_id, name, email, password, role, status}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      _id = result;
    });
  }

  openDialogDelete(
    _id: string = null,
  ): void {
    const dialogRef = this.dialog.open(DialogUserDeleteDialog, {
      width: '500px',
      data: {_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      _id = result;
    });
  }

}

@Component({
  selector: 'app-users-dialog',
  templateUrl: 'dialog-user-form.html',
})
export class DialogUserFormDialog {

  title = 'Añadir usuario';
  userForm: FormGroup;
  isSubmitted  =  false;
  userError = false;
  hide = true;
  roles: Role[] = [
    {value: 'USER_ROLE', viewValue: 'Usuario'},
    {value: 'ADMIN_ROLE', viewValue: 'Administrador'},
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogUserFormDialog>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: UserData
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.userForm  =  this.formBuilder.group({
      _id: new FormControl({value: this.data._id, disabled: true}),
      name: [this.data.name, [Validators.required]],
      email: [this.data.email, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      role: [(this.data.role ? this.data.role : 'USER_ROLE'), [Validators.required]]
    });
    if (this.data._id !== null) {
      this.userForm.removeControl('password');
      this.title = 'Actualizar usuario';
    }
  }

  get formControls() { return this.userForm.controls; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(){
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const body = new HttpParams()
        .set('name', this.userForm.value.name)
        .set('email', this.userForm.value.email)
        .set('password', this.userForm.value.password)
        .set('role', this.userForm.value.role)
        .set('company', localStorage.getItem('company'));

    if (this.data._id !== null) {
      this.userService.update(this.data._id, body);
      this.onNoClick();
    }else{
      this.userService.create(body);
      this.onNoClick();
    }
  }
}

@Component({
  selector: 'app-users-delete-dialog',
  templateUrl: 'dialog-user-delete.html',
})
export class DialogUserDeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogUserDeleteDialog>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: UserData
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete(){
    this.userService.delete(this.data._id);
    this.onNoClick();
  }
}
