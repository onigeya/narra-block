"use client"

import { useSystemStore } from "@/store/system-store"
import { useEffect } from "react"

export default function CharactersPage() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "角色管理", url: "/characters" }
    ])
  }, [setBreadcrumbs])

  return (
    <div>
      <h1>角色管理</h1>
    </div>
  )
} 