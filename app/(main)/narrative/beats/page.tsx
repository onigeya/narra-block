"use client"

import { useSystemStore } from "@/store/system-store"
import { useEffect } from "react"

export default function BeatsPage() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "叙事结构", url: "/narrative" },
      { title: "节拍", url: "/narrative/beats" }
    ])
  }, [setBreadcrumbs])

  return (
    <div>
      <h1>节拍管理</h1>
    </div>
  )
} 