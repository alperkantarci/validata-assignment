import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { UserDialogComponent } from "../user-dialog/user-dialog.component";
import { UserService } from "../_services/user.service";
import { getRole } from "../_models/role";

@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  // @ViewChild("userDialog", { static: false }) userDialog: UserDialogComponent;
  @ViewChild("userDialog", { static: true, read: ViewContainerRef }) userDialog;
  componentRef: ComponentRef<UserDialogComponent>;

  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridData: any[];
  public gridView: any[];
  public mySelection: string[] = [];

  users;

  public confirmDialogOpened = false;
  public userInfoDialogOpened = false;

  constructor(
    private userService: UserService,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  ngOnInit() {
    this.userService.getAll().subscribe(
      (data) => {
        this.users = data;
        this.updateGrid(data);
      },
      (error) => {
        alert(error);
      }
    );
  }

  getRoleText(roleId) {
    return getRole(roleId);
  }

  updateGrid(data) {
    this.gridData = data;
    this.gridView = this.gridData;
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "firstName",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "lastName",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "email",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  public closeConfirmDialog(status) {
    if (this.mySelection.length > 0 && status === "yes") {
      this.userService.delete(this.mySelection).subscribe(
        (data) => {
          this.users = data;
          this.updateGrid(data);
        },
        (error) => {
          console.log({ error });
        }
      );
    }
    this.confirmDialogOpened = false;
  }

  public openConfirmDialog() {
    this.confirmDialogOpened = true;
  }

  refreshGridSelection(val) {
    this.mySelection = [];
    if (val) {
      this.updateGrid(val);
    }
  }

  public openUserEditDialog() {
    if (this.mySelection.length > 0) {
      this.userDialog.clear();
      const factory: ComponentFactory<UserDialogComponent> = this.resolver.resolveComponentFactory(
        UserDialogComponent
      );
      this.componentRef = this.userDialog.createComponent(factory);
      this.componentRef.instance.refreshUserGridSelection.subscribe((val) => {
        this.refreshGridSelection(val);
      });
      this.componentRef.instance.user = this.gridData.find(
        (user) => user.id === this.mySelection[0]
      );
      this.componentRef.instance.action = "Edit";
      this.componentRef.instance.openUserDialog();
    } else {
      alert("Please select a user!");
    }
  }

  public openUserCreateDialog() {
    this.userDialog.clear();
    const factory: ComponentFactory<UserDialogComponent> = this.resolver.resolveComponentFactory(
      UserDialogComponent
    );
    this.componentRef = this.userDialog.createComponent(factory);
    this.componentRef.instance.refreshUserGridSelection.subscribe((val) => {
      this.refreshGridSelection(val);
    });
    this.componentRef.instance.action = "Create";
    this.componentRef.instance.openUserDialog();
  }
}
