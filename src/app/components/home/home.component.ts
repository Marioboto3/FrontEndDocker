import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  userForm: FormGroup;
  userFormUpdate: FormGroup;
  users: User[];
  idSelectedUser: string;
  singleUser: User;

  validation_messages: any;

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z][^#&<>"~;$^%{}?]{1,20}$/)])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z][^#&<>"~;$^%{}?]{1,20}$/)])),
      pass: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z][^#&<>"~;$^%{}?]{1,20}$/)])),

    });
    this.userFormUpdate = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z][^#&<>"~;$^%{}?]{1,20}$/)])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z][^#&<>"~;$^%{}?]{1,20}$/)])),
      pass: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z][^#&<>"~;$^%{}?]{1,20}$/)])),

    });

  }

  ngOnInit() {
    this.validation_messages = {
      name: [
        { type: 'required', message: 'Name is required' },
        { type: 'pattern', message: 'Name must be valid. Cannnot contain any number' }
      ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', message: 'Email must be valid. Cannnot contain any number' }
      ],
      pass: [
        { type: 'required', message: 'Pass is required' },
        { type: 'pattern', message: 'Pass must be valid. Cannnot contain any number' }
      ]
    };
    console.log('Hola');
    this.getUsers();
  }
  deleteUser(id: string, i: number) {
    if (confirm('Are yo sure you want to delete it?')) {
      this.userService.deleteUser(id)
        .subscribe(res => {
            this.users.splice(i, 1);
          },
          err => {
            console.log(err);
          });
    }
  }
  detailsUser(id: string) {
      this.userService.getSingleUser(id)
        .subscribe( res => {
            console.log(res);
            this.singleUser = res as User;
          },
          err => {
            console.log(err);
          });
    }
  getUsers() {
    this.userService.getUsers()
      .subscribe(res => {
        console.log(res);
        this.users = res as User[];
      });
  }
  assignUserId(id: string) {
    this.idSelectedUser = id;
    console.log("id:",this.idSelectedUser);
    this.userFormUpdate.reset(this.userFormUpdate.value.name);
    this.userFormUpdate.reset(this.userFormUpdate.value.email);
    this.userFormUpdate.reset(this.userFormUpdate.value.pass);
  }

  addUser() {
    let user: User;
    user = new User();
    user.name = this.userForm.value.name;
    user.email = this.userForm.value.email;
    user.pass = this.userForm.value.pass;
    console.log(user);
    this.userService.postUser(user)
      .subscribe(
        res => {
          console.log(res);
          this.getUsers();
        },
        err => {
          console.log(err);
          this.handleError(err);
        });
  }
  updateUser(id:string) {
    let user: User;
    user = new User();
    user._id=id;
    user.name = this.userFormUpdate.value.name;
    user.email = this.userFormUpdate.value.email;
    user.pass = this.userFormUpdate.value.pass;
    this.userService.putUser(user)
      .subscribe(res => {
        console.log(res);
        this.getUsers();
      }, err => {
        this.handleError(err);
      });
  }
  private handleError(err: HttpErrorResponse) {
    if ( err.status === 500 ) {
      this.userForm.get('phoneWork').setErrors({error: true});
    }
  }

}
