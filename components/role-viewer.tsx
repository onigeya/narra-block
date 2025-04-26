import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface RoleViewerProps {
  value: string[];
  onChange?: (value: string[]) => void;
  readOnly?: boolean;
}

export function RoleViewer({
  value,
  onChange,
  readOnly = false,
}: RoleViewerProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      if (!response.ok) {
        throw new Error("获取角色列表失败");
      }
      const data = await response.json();
      setRoles(data.roles);
    } catch (error) {
      console.error("获取角色列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedRoles = roles.filter((r) => value.includes(r.name));

  const handleRemove = (roleName: string) => {
    if (onChange) {
      onChange(value.filter((name) => name !== roleName));
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {selectedRoles.map((role) => (
        <div
          key={role.id}
          className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-gray-100"
        >
          <span>{role.description || role.name}</span>
          {!readOnly && onChange && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={() => handleRemove(role.name)}
              title={`移除角色 ${role.description || role.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
      {selectedRoles.length === 0 && (
        <div className="text-sm text-muted-foreground">暂无角色</div>
      )}
    </div>
  );
} 