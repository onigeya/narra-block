"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RoleDialog } from "@/components/role-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { RoleTable } from "@/components/role-table";
import { useSearchParams } from "next/navigation";
import { useSystemStore } from "@/store/system-store";
import { Role } from "@/lib/db";

type RoleWithPermissions = Role & {
  permissions: string[];
};

export default function RolesPage() {
  const { setBreadcrumbs } = useSystemStore();
  
  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "角色管理", url: "/roles" }
    ]);
  }, [setBreadcrumbs]);

  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleWithPermissions | null>(null);
  const [newRole, setNewRole] = useState<Partial<RoleWithPermissions>>({
    name: "",
    description: "",
    permissions: [],
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchRoles();
  }, [searchParams]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`/api/roles?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("获取角色列表失败");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRoles(data.roles || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("获取角色列表失败:", error);
      toast.error("获取角色列表失败");
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const response = await fetch(`/api/roles?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除角色失败");
      }

      await fetchRoles();
      toast.success("角色删除成功");
    } catch (error) {
      toast.error("删除角色失败");
    }
  };

  const openEditDialog = (role: RoleWithPermissions) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (role: RoleWithPermissions) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      handleDeleteRole(roleToDelete.id);
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">角色管理</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>添加角色</Button>
      </div>

      <RoleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        role={newRole}
        onSuccess={fetchRoles}
        title="添加新角色"
        mode="create"
      />

      <RoleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        role={selectedRole || {
          name: "",
          description: "",
          permissions: [],
        }}
        onSuccess={fetchRoles}
        title="编辑角色"
        mode="edit"
        roleId={selectedRole?.id}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="确认删除"
        description={`确定要删除角色 ${roleToDelete?.name} 吗？此操作不可撤销。`}
        onConfirm={confirmDelete}
        confirmText="删除"
      />

      <RoleTable 
        data={{ roles, pagination }} 
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />
    </div>
  );
} 