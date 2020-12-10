import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../_services/authentication.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}

  ngOnInit() {}

  getUser() {
    return `${this.authService.currentUserValue.firstName} ${this.authService.currentUserValue.lastName}`;
  }
}
