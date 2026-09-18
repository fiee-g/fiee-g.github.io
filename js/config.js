/* ============================================================
   个人网页 · 全局配置与内容
   👉 日常只需要修改这个文件，改完刷新浏览器即可看到效果。
   （内容已按简历初步填写，后续可继续润色）
   ============================================================ */

const SITE_CONFIG = {
  // 站点名称（浏览器标签页标题）
  siteName: "高境的个人主页",

  // 私密区密码指纹（密码：gj020325）
  // 想换密码：F12 打开控制台，粘贴运行：
  //   crypto.subtle.digest("SHA-256", new TextEncoder().encode("你的新密码"))
  //     .then(h => console.log([...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("")))
  // 把打印出的那串字符替换到 privatePasswordHash 的引号里即可。
  privatePasswordHash: "1c424973c3ca00bf821a30315518f3444e8d3319271358e69ffa16f7a84df945",

  // 登录后免输入密码的时长（小时）
  loginDurationHours: 24,
};

/* ==================== 公开页内容 ==================== */
const PUBLIC_CONTENT = {
  // 你的名字（显示在左侧栏）
  name: "高境",

  // 一句话介绍自己 / 身份标签
  title: "行政管理 · 人力资源管理研究生",

  // 照片：留空显示占位框；填 "images/me.jpg" 即显示照片
  photo: "",

  // 个人签名（显示在左侧栏，一句短的话）
  signature: "认真、细致、高效，把每件小事做到位。",

  // 自我介绍（右侧内容区顶部）
  intro: "事已至此先吃饭吧",

  // 下面各分区按顺序展示，直接替换文字即可
  sections: [
    {
      title: "关于我",
      items: [
        {
          type: "text",
          content: "行政管理专业本科毕业，现攻读人力资源管理方向研究生。熟悉人力资源开发与管理、行政法学、社会统计等专业知识，擅长活动组织策划与团队协作，能够独立处理突发情况。熟练运用 Office、Excel、SPSS 进行数据分析与报表制作，对数据敏感，能准确完成人事各类报表及相关数据统计。",
        },
      ],
    },
    {
      title: "数据一览",
      items: [
        {
          type: "stats",
          content: [
            { number: "3", label: "段实习经历" },
            { number: "2", label: "科研/比赛项目" },
            { number: "5+", label: "学生工作经历" },
            { number: "2", label: "教育阶段" },
          ],
        },
      ],
    },
    {
      title: "教育经历",
      items: [
        {
          type: "timeline",
          content: [
            { time: "2025.09 — 2028.07", title: "中共北京市委党校", desc: "人力资源管理 · 硕士研究生" },
            { time: "2021.09 — 2025.07", title: "中国政法大学", desc: "行政管理 · 本科" },
          ],
        },
      ],
    },
    {
      title: "实习经历",
      items: [
        {
          type: "timeline",
          content: [
            { time: "2025.04 — 2025.08", title: "欣欣相融教育科技（好未来学而思）", desc: "HR 实习生：简历筛选、候选人沟通、面试全流程协调与招聘需求对接。" },
            { time: "2023.11 — 2023.12", title: "北京字节跳动科技有限公司", desc: "HR 实习生：TikTok 国际电商招聘支持，简历筛选、候选人联系与面试安排。" },
            { time: "2023.07 — 2023.08", title: "乌鲁木齐市文旅局办公室（政策法规科）", desc: "实习生：办公室热线答疑、文件收发登记与公文写作，实现 0 投诉。" },
          ],
        },
      ],
    },
    {
      title: "学生工作",
      items: [
        {
          type: "timeline",
          content: [
            { time: "2025.09 — 至今", title: "研究生会 · 学术实践部部长", desc: "牵头策划模拟法庭活动；统筹学术会议；担任跨年晚会导播。" },
            { time: "2025.09 — 至今", title: "团支部 · 组织委员", desc: "组织主题团日活动；负责团员档案管理、团费收缴、组织关系转接等。" },
            { time: "2023.11 — 2025.06", title: "班级 · 副班长", desc: "协助班长管理班级、组织团建活动，获院优秀干部称号。" },
          ],
        },
      ],
    },
    {
      title: "项目经历",
      items: [
        {
          type: "cards",
          content: [
            {
              title: "大学生创新训练计划（国家级）",
              desc: "借助「朋辈辅导」实现辅导员对大学生的心理辅导——以中国政法大学为例。",
              link: "",
            },
            {
              title: "青年发展研究团学课题（重点项目）",
              desc: "同心「职」达：高校辅导员就业指导的路径探究——以中国政法大学为例，顺利结项。",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "技能",
      items: [
        {
          type: "skills",
          content: [
            { name: "Office 办公软件", level: 90 },
            { name: "Excel 数据分析", level: 85 },
            { name: "公文写作", level: 80 },
            { name: "活动组织策划", level: 85 },
            { name: "SPSS 数据分析", level: 70 },
          ],
        },
      ],
    },
    {
      title: "荣誉奖项",
      items: [
        { type: "tags", content: ["优秀干部", "优秀团员", "大学生创新训练计划（国家级）", "团学课题重点项目", "大学英语四级"] },
      ],
    },
  ],

  contact: {
    email: "gaojing020325@163.com",
    links: [],
  },
};

/* ==================== 私密页内容（仅自己可见） ==================== */
const PRIVATE_CONTENT = {
  greeting: "欢迎回来，高境。这是只属于你的空间。",
  notes: [
    { time: "2026-09-18", content: "已根据简历完成公开页内容的初步更新。" },
  ],
  todos: [
    { done: false, content: "上传个人照片" },
    { done: false, content: "确认并润色自我介绍与各段经历描述" },
    { done: false, content: "补充兴趣爱好等个性化内容" },
  ],
};
