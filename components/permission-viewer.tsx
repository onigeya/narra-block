import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface PermissionViewerProps {
  value: string[];
  onChange?: (value: string[]) => void;
  readOnly?: boolean;
}

export function PermissionViewer({
  value,
  onChange,
  readOnly = false,
}: PermissionViewerProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch("/api/permissions");
      if (!response.ok) {
        throw new Error("获取权限列表失败");
      }
      const data = await response.json();
      setPermissions(data.permissions);
    } catch (error) {
      console.error("获取权限列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPermissions = permissions.filter((p) => value.includes(p.name));

  const handleRemove = (permissionName: string) => {
    if (onChange) {
      onChange(value.filter((name) => name !== permissionName));
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {selectedPermissions.map((permission) => (
        <div
          key={permission.id}
          className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-gray-100"
        >
          <span>{permission.description || permission.name}</span>
          {!readOnly && onChange && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={() => handleRemove(permission.name)}
              title={`移除权限 ${permission.description || permission.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
      {selectedPermissions.length === 0 && (
        <div className="text-sm text-muted-foreground">暂无权限</div>
      )}
    </div>
  );
} 