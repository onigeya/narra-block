import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionSelector } from "@/components/permission-selector";
import { PermissionViewer } from "@/components/permission-viewer";
import { Role } from "@/lib/db";

type RoleWithPermissions = Role & {
  permissions: string[];
};

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Partial<RoleWithPermissions>;
  onRoleChange: (role: Partial<RoleWithPermissions>) => void;
  onSubmit: () => void;
  title: string;
}

export function RoleDialog({
  open,
  onOpenChange,
  role,
  onRoleChange,
  onSubmit,
  title,
}: RoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">角色名称</Label>
            <Input
              id="name"
              value={role.name || ""}
              onChange={(e) =>
                onRoleChange({ ...role, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">描述</Label>
            <Input
              id="description"
              value={role.description || ""}
              onChange={(e) =>
                onRoleChange({ ...role, description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>权限</Label>
            <PermissionSelector
              value={role.permissions || []}
              onChange={(permissions) =>
                onRoleChange({ ...role, permissions })
              }
            />
            <PermissionViewer
              value={role.permissions || []}
              onChange={(permissions) =>
                onRoleChange({ ...role, permissions })
              }
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