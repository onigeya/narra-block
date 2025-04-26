"use client"

import { useSystemStore } from "@/store/system-store"
import { useEffect } from "react"

export default function CluesPage() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "线索管理", url: "/clues" }
    ])
  }, [setBreadcrumbs])

  return (
    <div>
      <h1>线索管理</h1>
    </div>
  )
} 