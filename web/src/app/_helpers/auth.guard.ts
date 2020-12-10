import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../_services/authentication.service";
import { getRoleSpec, Role } from "../_models/role";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      // check if route is restricted by role
      if (next.data.roles) {
        const equalRole = (role) =>
          getRoleSpec(Role[role]).id === currentUser.roleId;
        const roleOK = next.data.roles.some(equalRole);
        if (!roleOK) {
          this.router.navigate(["/"]);
          return false;
        }
      }
      return true;
    }

    // not logged in so redirect to login page
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
  }
}
