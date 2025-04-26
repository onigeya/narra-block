import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
  roles: {
    role: {
      name: string;
    };
  }[];
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Omit<User, "id" | "createdAt" | "updatedAt" | "roles"> & { password: string };
  onUserChange: (user: Omit<User, "id" | "createdAt" | "updatedAt" | "roles"> & { password: string }) => void;
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">姓名</label>
            <Input 
              className="col-span-3" 
              value={user.name || ""}
              onChange={(e) => onUserChange({...user, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">邮箱</label>
            <Input 
              className="col-span-3" 
              value={user.email}
              onChange={(e) => onUserChange({...user, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">密码</label>
            <Input 
              className="col-span-3" 
              type="password"
              placeholder={title === "编辑用户" ? "留空表示不修改密码" : ""}
              value={user.password}
              onChange={(e) => onUserChange({...user, password: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onSubmit}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 