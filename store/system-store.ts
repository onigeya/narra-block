import { create } from 'zustand'
import { IconCamera, IconChartBar, IconDashboard, IconDatabase, IconFileAi, IconFileDescription, IconFileWord, IconFolder, IconHelp, IconInnerShadowTop, IconListDetails, IconReport, IconSearch, IconSettings, IconUsers, IconUserCog, IconBook, IconBook2, IconBookmark, IconMap, IconUser, IconKey } from "@tabler/icons-react"

interface NavItem {
  title: string
  url: string
  icon: any
  items?: {
    title: string
    url: string
  }[]
  isActive?: boolean
}

interface Document {
  name: string
  url: string
  icon: any
}

interface SystemState {
  navMain: NavItem[]
  navSecondary: NavItem[]
  breadcrumbs: {
    title: string
    url: string
  }[]
  setBreadcrumbs: (breadcrumbs: { title: string; url: string }[]) => void
}

const initialState: SystemState = {
  navMain: [
    {
      title: "仪表盘",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "叙事结构",
      url: "/narrative",
      icon: IconBook,
      items: [
        {
          title: "幕",
          url: "/narrative/acts"
        },
        {
          title: "序列",
          url: "/narrative/sequences"
        },
        {
          title: "场景",
          url: "/narrative/scenes"
        },
        {
          title: "节拍",
          url: "/narrative/beats"
        }
      ]
    },
    {
      title: "角色管理",
      url: "/characters",
      icon: IconUser,
    },
    {
      title: "地点管理",
      url: "/locations",
      icon: IconMap,
    },
    {
      title: "线索管理",
      url: "/clues",
      icon: IconKey,
    }
  ],
  navSecondary: [
    {
      title: "用户管理",
      url: "/users",
      icon: IconUsers,
    },
    {
      title: "角色管理",
      url: "/roles",
      icon: IconUserCog,
    },
    {
      title: "帮助中心",
      url: "#",
      icon: IconHelp,
    },
  ],
  breadcrumbs: [
    {
      title: "仪表盘",
      url: "/"
    }
  ],
  setBreadcrumbs: () => {}
}

export const useSystemStore = create<SystemState>()((set) => ({
  ...initialState,
  setBreadcrumbs: (breadcrumbs: { title: string; url: string }[]) => set({ breadcrumbs })
})) 