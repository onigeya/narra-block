"use client"

import { useSystemStore } from "@/store/system-store"
import { useEffect } from "react"

export default function SequencesPage() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs([
      { title: "仪表盘", url: "/" },
      { title: "叙事结构", url: "/narrative" },
      { title: "序列", url: "/narrative/sequences" }
    ])
  }, [setBreadcrumbs])

  return (
    <div>
      <h1>序列管理</h1>
    </div>
  )
} 