export enum Role {
  Admin = "Admin",
  Manager = "Manager",
  Editor = "Editor",
}
interface RoleSpec {
  id: number;
}

export function getRoleSpec(role: string): RoleSpec {
  switch (role) {
    case "Admin":
      return { id: 1 };
    case "Manager":
      return { id: 2 };
    case "Editor":
      return { id: 3 };
  }
}

export function getRole(roleId: number): string {
  switch (roleId) {
    case 1:
      return "Admin";
    case 2:
      return "Manager";
    case 3:
      return "Editor";
  }
}
