"use client"

import { useSystemStore } from "@/store/system-store"
import { useEffect } from "react"

export default function LocationsPage() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "地点管理", url: "/locations" }
    ])
  }, [setBreadcrumbs])

  return (
    <div>
      <h1>地点管理</h1>
    </div>
  )
} 