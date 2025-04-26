"use client"

import { useSystemStore } from "@/store/system-store"
import { useEffect } from "react"

export default function ScenesPage() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "叙事结构", url: "/narrative" },
      { title: "场景", url: "/narrative/scenes" }
    ])
  }, [setBreadcrumbs])

  return (
    <div>
      <h1>场景管理</h1>
    </div>
  )
} 