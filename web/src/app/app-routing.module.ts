import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { AuthGuard } from "./_helpers/auth.guard";
import { Role } from "./_models/role";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Manager, Role.Editor],
      text: "Home",
      icon: "k-i-home",
      selected: true,
    },
  },
  {
    path: "user-management",
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Manager],
      text: "User Management",
      icon: "k-i-user",
    },
  },
  { path: "login", component: LoginComponent },
  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
