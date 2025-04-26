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
import { useState, useEffect } from "react";
import { toast } from "sonner";

type RoleWithPermissions = Role & {
  permissions: string[];
};

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Partial<RoleWithPermissions>;
  onSuccess: () => void;
  title: string;
  mode: "create" | "edit";
  roleId?: string;
}

export function RoleDialog({
  open,
  onOpenChange,
  role: initialRole,
  onSuccess,
  title,
  mode,
  roleId,
}: RoleDialogProps) {
  const [role, setRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setRole(initialRole);
    }
  }, [open, initialRole]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const url = mode === "create" ? "/api/roles" : `/api/roles?id=${roleId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "操作失败");
      }

      toast.success(mode === "create" ? "角色创建成功" : "角色更新成功");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "操作失败");
    } finally {
      setIsLoading(false);
    }
  };

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
                setRole({ ...role, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">描述</Label>
            <Input
              id="description"
              value={role.description || ""}
              onChange={(e) =>
                setRole({ ...role, description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>权限</Label>
            <PermissionSelector
              value={role.permissions || []}
              onChange={(permissions) =>
                setRole({ ...role, permissions })
              }
            />
            <PermissionViewer
              value={role.permissions || []}
              onChange={(permissions) =>
                setRole({ ...role, permissions })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "处理中..." : "保存"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 