import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelector } from "@/components/role-selector";
import { RoleViewer } from "@/components/role-viewer";
import { User } from "@/lib/db";

type UserWithRoles = Omit<User, "passwordHash"> & {
  roles: {
    role: {
      name: string;
    };
  }[];
  password: string | null;
};

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Omit<UserWithRoles, "id" | "createdAt" | "updatedAt" | "roles"> & { 
    password: string;
    roles: string[];
  };
  onUserChange: (user: Omit<UserWithRoles, "id" | "createdAt" | "updatedAt" | "roles"> & { 
    password: string;
    roles: string[];
  }) => void;
  onSubmit: () => void;
  title: string;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onUserChange,
  onSubmit,
  title,
}: UserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">姓名</Label>
            <Input 
              id="name"
              value={user.name || ""}
              onChange={(e) => onUserChange({...user, name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input 
              id="email"
              value={user.email}
              onChange={(e) => onUserChange({...user, email: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input 
              id="password"
              type="password"
              placeholder={title === "编辑用户" ? "留空表示不修改密码" : ""}
              value={user.password}
              onChange={(e) => onUserChange({...user, password: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label>角色</Label>
            <RoleSelector
              value={user.roles || []}
              onChange={(roles) => onUserChange({...user, roles})}
            />
            <RoleViewer
              value={user.roles || []}
              onChange={(roles) => onUserChange({...user, roles})}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onSubmit}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 