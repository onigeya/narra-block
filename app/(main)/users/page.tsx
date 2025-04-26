"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserDialog, User } from "@/components/user-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { UserTable } from "@/components/user-table";
import { useSearchParams } from "next/navigation";
import { useSystemStore } from "@/store/system-store";

export default function UsersPage() {
  const { setBreadcrumbs } = useSystemStore();
  
  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "用户管理", url: "/users" }
    ]);
  }, [setBreadcrumbs]);

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "id" | "createdAt" | "updatedAt" | "roles"> & { password: string }>({
    name: "",
    email: "",
    emailVerified: null,
    image: null,
    password: "",
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchUsers();
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("获取用户列表失败");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setUsers(data.users || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("获取用户列表失败:", error);
      toast.error("获取用户列表失败");
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        }),
      });

      if (!response.ok) {
        throw new Error("创建用户失败");
      }

      await fetchUsers();
      setNewUser({
        name: "",
        email: "",
        emailVerified: null,
        image: null,
        password: "",
      });
      setIsAddDialogOpen(false);
      toast.success("用户创建成功");
    } catch (error) {
      toast.error("创建用户失败");
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser.id,
          name: selectedUser.name,
          email: selectedUser.email,
          password: selectedUser.password || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("更新用户失败");
      }

      await fetchUsers();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast.success("用户更新成功");
    } catch (error) {
      toast.error("更新用户失败");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除用户失败");
      }

      await fetchUsers();
      toast.success("用户删除成功");
    } catch (error) {
      toast.error("删除用户失败");
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser({
      ...user,
      password: "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">用户管理</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>添加用户</Button>
      </div>

      <UserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        user={newUser}
        onUserChange={setNewUser}
        onSubmit={handleAddUser}
        title="添加新用户"
      />

      <UserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          emailVerified: selectedUser.emailVerified,
          image: selectedUser.image,
          password: "",
        } : {
          name: "",
          email: "",
          emailVerified: null,
          image: null,
          password: "",
        }}
        onUserChange={(user) => setSelectedUser({
          ...selectedUser!,
          ...user,
        })}
        onSubmit={handleEditUser}
        title="编辑用户"
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="确认删除"
        description={`确定要删除用户 ${userToDelete?.name || userToDelete?.email} 吗？此操作不可撤销。`}
        onConfirm={confirmDelete}
        confirmText="删除"
      />

      <UserTable 
        data={{ users, pagination }} 
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />
    </div>
  );
} 