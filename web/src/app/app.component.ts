import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./_models/user";
import { AuthenticationService } from "./_services/authentication.service";
import { getRoleSpec, Role } from "./_models/role";
import { routes } from "./app-routing.module";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {
  currentUser: User;

  public selected = "Home";
  public items;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // update selected drawer item based on route url
    this.authenticationService.currentUser.subscribe((x) => {
      this.currentUser = x;

      if (this.currentUser) {
        const filteredRoutes = routes
          .filter((route) => route.data && route.data.text)
          .filter((route) => {
            const roleCheck = (role) =>
              getRoleSpec(Role[role]).id === this.currentUser.roleId;
            return route.data.roles.some(roleCheck);
          })
          .map((route) => {
            return {
              ...route,
              text: route.data.text,
              icon: route.data.icon,
              selected: route.data.selected,
            };
          });
        this.items = Object.assign([], filteredRoutes);

        this.router.events.subscribe((event: any) => {
          if (event.snapshot && event.snapshot.data["roles"]) {
            let newItems = this.items.map((route) => {
              return {
                selected:
                  event.snapshot.routeConfig.path === route.path ? true : false,
                text: route.text,
                path: route.path,
                icon: route.icon,
              };
            });
            this.items = newItems;
          }
        });
      }
    });
  }

  ngAfterViewInit() {}

  ngOnInit(): void {}

  onSelect(event) {
    this.router.navigate([event.item.path]);
  }

  get isAdmin() {
    return (
      this.currentUser && this.currentUser.roleId === getRoleSpec(Role.Admin).id
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
