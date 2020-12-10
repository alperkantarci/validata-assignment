import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { User } from "../_models/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(user) {
    return this.http.post(`${environment.apiUrl}/users`, user);
  }

  update(user) {
    return this.http.patch(`${environment.apiUrl}/users`, user);
  }

  delete(selected) {
    return this.http.post(`${environment.apiUrl}/users/multi-delete`, selected);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
}
