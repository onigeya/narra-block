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
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  onSuccess: () => void;
  title: string;
  mode: "create" | "edit";
  userId?: string;
}

export function UserDialog({
  open,
  onOpenChange,
  user: initialUser,
  onSuccess,
  title,
  mode,
  userId,
}: UserDialogProps) {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setUser(initialUser);
    }
  }, [open, initialUser]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const url = mode === "create" ? "/api/users" : `/api/users?id=${userId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password || undefined,
          roles: user.roles,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "操作失败");
      }

      toast.success(mode === "create" ? "用户创建成功" : "用户更新成功");
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
            <Label htmlFor="name">姓名</Label>
            <Input 
              id="name"
              value={user.name || ""}
              onChange={(e) => setUser({...user, name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input 
              id="email"
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input 
              id="password"
              type="password"
              placeholder={mode === "edit" ? "留空表示不修改密码" : ""}
              value={user.password}
              onChange={(e) => setUser({...user, password: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label>角色</Label>
            <RoleSelector
              value={user.roles || []}
              onChange={(roles) => setUser({...user, roles})}
            />
            <RoleViewer
              value={user.roles || []}
              onChange={(roles) => setUser({...user, roles})}
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