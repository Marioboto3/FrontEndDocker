import {User} from '../models/user';
import {Environment} from './environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  environment: Environment;

  constructor(private http: HttpClient) {
    this.environment = new Environment();
  }

  getUsers() {
    return this.http.get(this.environment.urlStudent + '/all');
  }

  getSingleUser(id: string) {
    return this.http.get(this.environment.urlStudent + `/${id}`);
  }

  postUser(user: User) {
    return this.http.post(this.environment.urlStudent + '/', user);
  }

  putUser(user: User) {
    return this.http.put(this.environment.urlStudent + `/${user._id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(this.environment.urlStudent + `/${id}`);
  }
}
