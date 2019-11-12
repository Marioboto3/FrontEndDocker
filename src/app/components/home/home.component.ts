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
  users: User[];
  idSelectedUser: string;
  singleUser: User;

  validation_messages: any;

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z][a-zA-Z][^#&<>"~;$^%{}?]{1,20}$/)])),
    });

  }

  ngOnInit() {
    this.validation_messages = {
      name: [
        { type: 'required', message: 'Name is required' },
        { type: 'pattern', message: 'Name must be valid. Cannnot contain any number' }
      ],
      address: [
        { type: 'required', message: 'Address is required' }
      ],
      phoneHome: [
        { type: 'required', message: 'Phone Home is required' },
        { type: 'pattern', message: 'Number must be valid' },
        { type: 'error', message: 'Internal Server Error' }
      ],
      phoneWork: [
        { type: 'required', message: 'Phone Work is required' },
        { type: 'pattern', message: 'Number must be valid' },
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
  }

  updateStudent(id: string) {
    this.router.navigate(['/updatestudent', id]);
  }

  addNewStudent() {
    this.router.navigateByUrl('/addstudent');
  }

  addUser() {
    let user: User;
    user = new User();
    user.name = this.userForm.value.name;
    console.log(user);
    this.userService.postUser(user)
      .subscribe(
        res => {
          console.log(res);
          this.router.navigateByUrl('/home');
        },
        err => {
          console.log(err);
          this.handleError(err);
        });
  }

  private handleError(err: HttpErrorResponse) {
    if ( err.status === 500 ) {
      this.userForm.get('phoneWork').setErrors({error: true});
    }
  }

}
