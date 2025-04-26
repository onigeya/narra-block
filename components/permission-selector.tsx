import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface PermissionSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function PermissionSelector({ value, onChange }: PermissionSelectorProps) {
  const [open, setOpen] = useState(false);
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

  const handleSelect = (permissionName: string) => {
    if (value.includes(permissionName)) {
      onChange(value.filter((name) => name !== permissionName));
    } else {
      onChange([...value, permissionName]);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value.length > 0
            ? `已选择 ${value.length} 个权限`
            : "请选择权限..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索权限..." />
          <CommandEmpty>未找到权限</CommandEmpty>
          <CommandGroup>
            {permissions.map((permission) => (
              <CommandItem
                key={permission.id}
                value={permission.name}
                onSelect={() => handleSelect(permission.name)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(permission.name) ? "opacity-100" : "opacity-0"
                  )}
                />
                {permission.description || permission.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 