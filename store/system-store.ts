import { create } from 'zustand'
import { IconCamera, IconChartBar, IconDashboard, IconDatabase, IconFileAi, IconFileDescription, IconFileWord, IconFolder, IconHelp, IconInnerShadowTop, IconListDetails, IconReport, IconSearch, IconSettings, IconUsers } from "@tabler/icons-react"

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
  navClouds: NavItem[]
  navSecondary: NavItem[]
  documents: Document[]
}

const initialState: SystemState = {
  navMain: [
    {
      title: "仪表盘",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "生命周期",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "数据分析",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "项目管理",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "团队管理",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "采集管理",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "进行中的提案",
          url: "#",
        },
        {
          title: "已归档",
          url: "#",
        },
      ],
    },
    {
      title: "提案管理",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "进行中的提案",
          url: "#",
        },
        {
          title: "已归档",
          url: "#",
        },
      ],
    },
    {
      title: "提示词管理",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "进行中的提案",
          url: "#",
        },
        {
          title: "已归档",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "系统设置",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "帮助中心",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "搜索",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "数据资料库",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "报表中心",
      url: "#",
      icon: IconReport,
    },
    {
      name: "文档助手",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export const useSystemStore = create<SystemState>()((set) => ({
  ...initialState,
})) 