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

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface RoleSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const [open, setOpen] = useState(false);
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

  const handleSelect = (roleName: string) => {
    if (value.includes(roleName)) {
      onChange(value.filter((name) => name !== roleName));
    } else {
      onChange([...value, roleName]);
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
            ? `已选择 ${value.length} 个角色`
            : "请选择角色..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索角色..." />
          <CommandEmpty>未找到角色</CommandEmpty>
          <CommandGroup>
            {roles.map((role) => (
              <CommandItem
                key={role.id}
                value={role.name}
                onSelect={() => handleSelect(role.name)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(role.name) ? "opacity-100" : "opacity-0"
                  )}
                />
                {role.description || role.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 