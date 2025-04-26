import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { PermissionViewer } from "./permission-viewer";
import { Role } from "@/lib/db";

type RoleWithPermissions = Role & {
  permissions: string[];
};

interface RoleTableProps {
  data: {
    roles: RoleWithPermissions[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
  onEdit: (role: RoleWithPermissions) => void;
  onDelete: (role: RoleWithPermissions) => void;
}

export function RoleTable({ data, onEdit, onDelete }: RoleTableProps) {
  const { roles, pagination } = data;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>角色名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>权限</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <PermissionViewer value={role.permissions} readOnly />
              </TableCell>
              <TableCell>
                {format(new Date(role.createdAt), "yyyy-MM-dd HH:mm:ss", {
                  locale: zhCN,
                })}
              </TableCell>
              <TableCell>
                {format(new Date(role.updatedAt), "yyyy-MM-dd HH:mm:ss", {
                  locale: zhCN,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(role)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(role)}
                  >
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 