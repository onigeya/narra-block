import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

const data = [
  {
    "id": 1,
    "header": "封面页",
    "type": "封面页",
    "status": "处理中",
    "target": "18",
    "limit": "5",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 2,
    "header": "目录",
    "type": "目录",
    "status": "已完成",
    "target": "29",
    "limit": "24",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 3,
    "header": "执行摘要",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "10",
    "limit": "13",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 4,
    "header": "技术方案",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "27",
    "limit": "23",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 5,
    "header": "设计",
    "type": "叙述性内容",
    "status": "处理中",
    "target": "2",
    "limit": "16",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 6,
    "header": "能力说明",
    "type": "叙述性内容",
    "status": "处理中",
    "target": "20",
    "limit": "8",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 7,
    "header": "与现有系统集成",
    "type": "叙述性内容",
    "status": "处理中",
    "target": "19",
    "limit": "21",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 8,
    "header": "创新与优势",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "25",
    "limit": "26",
    "reviewer": "待分配审核人"
  },
  {
    "id": 9,
    "header": "EMR创新解决方案概述",
    "type": "技术内容",
    "status": "已完成",
    "target": "7",
    "limit": "23",
    "reviewer": "待分配审核人"
  },
  {
    "id": 10,
    "header": "高级算法与机器学习",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "30",
    "limit": "28",
    "reviewer": "待分配审核人"
  },
  {
    "id": 11,
    "header": "自适应通信协议",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "9",
    "limit": "31",
    "reviewer": "待分配审核人"
  },
  {
    "id": 12,
    "header": "相对于现有技术的优势",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "12",
    "limit": "0",
    "reviewer": "待分配审核人"
  },
  {
    "id": 13,
    "header": "过往业绩",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "22",
    "limit": "33",
    "reviewer": "待分配审核人"
  },
  {
    "id": 14,
    "header": "客户反馈与满意度",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "15",
    "limit": "34",
    "reviewer": "待分配审核人"
  },
  {
    "id": 15,
    "header": "实施挑战与解决方案",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "3",
    "limit": "35",
    "reviewer": "待分配审核人"
  },
  {
    "id": 16,
    "header": "安全措施与数据保护政策",
    "type": "叙述性内容",
    "status": "处理中",
    "target": "6",
    "limit": "36",
    "reviewer": "待分配审核人"
  },
  {
    "id": 17,
    "header": "可扩展性与未来保障",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "4",
    "limit": "37",
    "reviewer": "待分配审核人"
  },
  {
    "id": 18,
    "header": "成本效益分析",
    "type": "简明语言",
    "status": "已完成",
    "target": "14",
    "limit": "38",
    "reviewer": "待分配审核人"
  },
  {
    "id": 19,
    "header": "用户培训与入门体验",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "17",
    "limit": "39",
    "reviewer": "待分配审核人"
  },
  {
    "id": 20,
    "header": "未来发展路线图",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "11",
    "limit": "40",
    "reviewer": "待分配审核人"
  },
  {
    "id": 21,
    "header": "系统架构概述",
    "type": "技术内容",
    "status": "处理中",
    "target": "24",
    "limit": "18",
    "reviewer": "玛雅·约翰逊"
  },
  {
    "id": 22,
    "header": "风险管理计划",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "15",
    "limit": "22",
    "reviewer": "卡洛斯·罗德里格斯"
  },
  {
    "id": 23,
    "header": "合规文档",
    "type": "法律文件",
    "status": "处理中",
    "target": "31",
    "limit": "27",
    "reviewer": "莎拉·陈"
  },
  {
    "id": 24,
    "header": "API文档",
    "type": "技术内容",
    "status": "已完成",
    "target": "8",
    "limit": "12",
    "reviewer": "拉吉·帕特尔"
  },
  {
    "id": 25,
    "header": "用户界面原型",
    "type": "视觉设计",
    "status": "处理中",
    "target": "19",
    "limit": "25",
    "reviewer": "蕾拉·艾哈迈迪"
  },
  {
    "id": 26,
    "header": "数据库架构",
    "type": "技术内容",
    "status": "已完成",
    "target": "22",
    "limit": "20",
    "reviewer": "托马斯·威尔逊"
  },
  {
    "id": 27,
    "header": "测试方法",
    "type": "技术内容",
    "status": "处理中",
    "target": "17",
    "limit": "14",
    "reviewer": "待分配审核人"
  },
  {
    "id": 28,
    "header": "部署策略",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "26",
    "limit": "30",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 29,
    "header": "预算明细",
    "type": "财务文件",
    "status": "处理中",
    "target": "13",
    "limit": "16",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 30,
    "header": "市场分析",
    "type": "研究报告",
    "status": "已完成",
    "target": "29",
    "limit": "32",
    "reviewer": "索菲亚·马丁内斯"
  },
  {
    "id": 31,
    "header": "竞争对手对比",
    "type": "研究报告",
    "status": "处理中",
    "target": "21",
    "limit": "19",
    "reviewer": "待分配审核人"
  },
  {
    "id": 32,
    "header": "维护计划",
    "type": "技术内容",
    "status": "已完成",
    "target": "16",
    "limit": "23",
    "reviewer": "亚历克斯·汤普森"
  },
  {
    "id": 33,
    "header": "用户画像",
    "type": "研究报告",
    "status": "处理中",
    "target": "27",
    "limit": "24",
    "reviewer": "妮娜·帕特尔"
  },
  {
    "id": 34,
    "header": "可访问性合规",
    "type": "法律文件",
    "status": "已完成",
    "target": "18",
    "limit": "21",
    "reviewer": "待分配审核人"
  },
  {
    "id": 35,
    "header": "性能指标",
    "type": "技术内容",
    "status": "处理中",
    "target": "23",
    "limit": "26",
    "reviewer": "大卫·金"
  },
  {
    "id": 36,
    "header": "灾难恢复计划",
    "type": "技术内容",
    "status": "已完成",
    "target": "14",
    "limit": "17",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 37,
    "header": "第三方集成",
    "type": "技术内容",
    "status": "处理中",
    "target": "25",
    "limit": "28",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 38,
    "header": "用户反馈总结",
    "type": "研究报告",
    "status": "已完成",
    "target": "20",
    "limit": "15",
    "reviewer": "待分配审核人"
  },
  {
    "id": 39,
    "header": "本地化策略",
    "type": "叙述性内容",
    "status": "处理中",
    "target": "12",
    "limit": "19",
    "reviewer": "玛丽亚·加西亚"
  },
  {
    "id": 40,
    "header": "移动端兼容性",
    "type": "技术内容",
    "status": "已完成",
    "target": "28",
    "limit": "31",
    "reviewer": "詹姆斯·威尔逊"
  },
  {
    "id": 41,
    "header": "数据迁移计划",
    "type": "技术内容",
    "status": "处理中",
    "target": "19",
    "limit": "22",
    "reviewer": "待分配审核人"
  },
  {
    "id": 42,
    "header": "质量保证协议",
    "type": "技术内容",
    "status": "已完成",
    "target": "30",
    "limit": "33",
    "reviewer": "普里亚·辛格"
  },
  {
    "id": 43,
    "header": "利益相关者分析",
    "type": "研究报告",
    "status": "处理中",
    "target": "11",
    "limit": "14",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 44,
    "header": "环境影响评估",
    "type": "研究报告",
    "status": "已完成",
    "target": "24",
    "limit": "27",
    "reviewer": "待分配审核人"
  },
  {
    "id": 45,
    "header": "知识产权",
    "type": "法律文件",
    "status": "处理中",
    "target": "17",
    "limit": "20",
    "reviewer": "莎拉·约翰逊"
  },
  {
    "id": 46,
    "header": "客户支持框架",
    "type": "叙述性内容",
    "status": "已完成",
    "target": "22",
    "limit": "25",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 47,
    "header": "版本控制策略",
    "type": "技术内容",
    "status": "处理中",
    "target": "15",
    "limit": "18",
    "reviewer": "待分配审核人"
  },
  {
    "id": 48,
    "header": "持续集成流程",
    "type": "技术内容",
    "status": "已完成",
    "target": "26",
    "limit": "29",
    "reviewer": "迈克尔·陈"
  },
  {
    "id": 49,
    "header": "法规合规",
    "type": "法律文件",
    "status": "处理中",
    "target": "13",
    "limit": "16",
    "reviewer": "待分配审核人"
  },
  {
    "id": 50,
    "header": "用户认证系统",
    "type": "技术内容",
    "status": "已完成",
    "target": "28",
    "limit": "31",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 51,
    "header": "数据分析框架",
    "type": "技术内容",
    "status": "处理中",
    "target": "21",
    "limit": "24",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 52,
    "header": "云基础设施",
    "type": "技术内容",
    "status": "已完成",
    "target": "16",
    "limit": "19",
    "reviewer": "待分配审核人"
  },
  {
    "id": 53,
    "header": "网络安全措施",
    "type": "技术内容",
    "status": "处理中",
    "target": "29",
    "limit": "32",
    "reviewer": "丽莎·王"
  },
  {
    "id": 54,
    "header": "项目时间表",
    "type": "计划文件",
    "status": "已完成",
    "target": "14",
    "limit": "17",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 55,
    "header": "资源分配",
    "type": "计划文件",
    "status": "处理中",
    "target": "27",
    "limit": "30",
    "reviewer": "待分配审核人"
  },
  {
    "id": 56,
    "header": "团队结构与角色",
    "type": "计划文件",
    "status": "已完成",
    "target": "20",
    "limit": "23",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 57,
    "header": "沟通协议",
    "type": "计划文件",
    "status": "处理中",
    "target": "15",
    "limit": "18",
    "reviewer": "待分配审核人"
  },
  {
    "id": 58,
    "header": "成功指标",
    "type": "计划文件",
    "status": "已完成",
    "target": "30",
    "limit": "33",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 59,
    "header": "国际化支持",
    "type": "技术内容",
    "status": "处理中",
    "target": "23",
    "limit": "26",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 60,
    "header": "备份与恢复程序",
    "type": "技术内容",
    "status": "已完成",
    "target": "18",
    "limit": "21",
    "reviewer": "待分配审核人"
  },
  {
    "id": 61,
    "header": "监控与告警系统",
    "type": "技术内容",
    "status": "处理中",
    "target": "25",
    "limit": "28",
    "reviewer": "丹尼尔·帕克"
  },
  {
    "id": 62,
    "header": "代码审查指南",
    "type": "技术内容",
    "status": "已完成",
    "target": "12",
    "limit": "15",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 63,
    "header": "文档标准",
    "type": "技术内容",
    "status": "处理中",
    "target": "27",
    "limit": "30",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 64,
    "header": "发布管理流程",
    "type": "计划文件",
    "status": "已完成",
    "target": "22",
    "limit": "25",
    "reviewer": "待分配审核人"
  },
  {
    "id": 65,
    "header": "功能优先级矩阵",
    "type": "计划文件",
    "status": "处理中",
    "target": "19",
    "limit": "22",
    "reviewer": "艾玛·戴维斯"
  },
  {
    "id": 66,
    "header": "技术债务评估",
    "type": "技术内容",
    "status": "已完成",
    "target": "24",
    "limit": "27",
    "reviewer": "艾迪·莱克"
  },
  {
    "id": 67,
    "header": "容量规划",
    "type": "计划文件",
    "status": "处理中",
    "target": "21",
    "limit": "24",
    "reviewer": "贾米克·塔什普拉托夫"
  },
  {
    "id": 68,
    "header": "服务级别协议",
    "type": "法律文件",
    "status": "已完成",
    "target": "26",
    "limit": "29",
    "reviewer": "待分配审核人"
  }
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
}
