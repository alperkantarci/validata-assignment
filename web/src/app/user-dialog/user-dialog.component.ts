import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../_models/user";
import { UserService } from "../_services/user.service";

@Component({
  selector: "app-user-dialog",
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.css"],
})
export class UserDialogComponent implements OnInit {
  @Input() action: string;
  @Input() user: User;

  @Output() refreshUserGridSelection = new EventEmitter<any>();

  public userDialogOpened = false;

  userForm = new FormGroup({
    id: new FormControl(""),
    password: new FormControl("", Validators.required),
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    roleId: new FormControl("", Validators.required),
  });

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.user && this.action === "Edit") {
      const tempUser = Object.assign({}, this.user);
      tempUser.password = "xx";
      this.userForm.setValue(tempUser);
    }
  }

  public closeUserDialog(status) {
    if (status === "Edit" && this.userForm.valid) {
      // edit the user
      this.userService.update(this.userForm.value).subscribe(
        (data) => {
          this.refreshUserGridSelection.next(data);
        },
        (error) => {
          console.log({ error });
        }
      );
    } else if (status === "Create" && this.userForm.valid) {
      this.userService.create(this.userForm.value).subscribe(
        (data) => {
          this.refreshUserGridSelection.next(data);
        },
        (error) => {
          console.log({ error });
        }
      );
    }
    this.userDialogOpened = false;
    // refresh parent's grid view
    this.refreshUserGridSelection.next();
  }

  public openUserDialog() {
    this.userDialogOpened = true;
  }

  get firstName() {
    return this.userForm.get("firstName");
  }

  get lastName() {
    return this.userForm.get("lastName");
  }

  get roleId() {
    return this.userForm.get("roleId");
  }

  get email() {
    return this.userForm.get("email");
  }

  get password() {
    return this.userForm.get("password");
  }
}
