"use client"

import { useSystemStore } from "@/store/system-store"
import { useEffect } from "react"

export default function ActsPage() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "叙事结构", url: "/narrative" },
      { title: "幕", url: "/narrative/acts" }
    ])
  }, [setBreadcrumbs])

  return (
    <div>
      <h1>幕管理</h1>
    </div>
  )
} 