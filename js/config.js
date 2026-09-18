/* ============================================================
   个人网页 · 全局配置与内容
   👉 日常只需要修改这个文件，改完刷新浏览器即可看到效果。
   下面内容均为“示例占位”，后续替换成你自己的真实信息即可。
   ============================================================ */

const SITE_CONFIG = {
  // 站点名称（浏览器标签页标题）
  siteName: "我的个人主页",

  // 私密区密码指纹（默认密码：123456）
  // 想换密码：F12 打开控制台，粘贴运行：
  //   crypto.subtle.digest("SHA-256", new TextEncoder().encode("你的新密码"))
  //     .then(h => console.log([...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("")))
  // 把打印出的那串字符替换到 privatePasswordHash 的引号里即可。
  privatePasswordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",

  // 登录后免输入密码的时长（小时）
  loginDurationHours: 24,
};

/* ==================== 公开页内容 ==================== */
const PUBLIC_CONTENT = {
  // 你的名字
  name: "你的名字",

  // 一句话介绍自己
  title: "一句话介绍自己",

  // 照片：留空显示占位框；填 "images/me.jpg" 即显示照片
  photo: "",

  // 自我介绍
  intro: "这里写自我介绍，后续再补充。",

  // 座右铭 / 喜欢的一句话（留空则不显示）
  quote: "（示例）把每一件简单的事做好，就是不简单。",

  // 下面各分区按顺序展示，均为示例占位，直接替换文字即可
  sections: [
    {
      title: "关于我",
      items: [
        { type: "text", content: "（待补充）关于我的介绍。" },
      ],
    },
    {
      title: "数据一览",
      items: [
        {
          type: "stats",
          content: [
            { number: "3+", label: "参与项目" },
            { number: "5", label: "荣誉奖项" },
            { number: "2", label: "学生工作" },
            { number: "4", label: "技能方向" },
          ],
        },
      ],
    },
    {
      title: "教育 & 经历",
      items: [
        {
          type: "timeline",
          content: [
            { time: "2021 — 至今", title: "中国政法大学", desc: "（示例）行政管理 / 公共管理方向 · 本科" },
            { time: "2023 — 2024", title: "学生工作", desc: "（示例）学术实践部 / 组织委员" },
            { time: "待补充", title: "（待补充）实习 / 项目", desc: "（待补充）说明" },
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
            { name: "写作与表达", level: 85 },
            { name: "数据分析", level: 70 },
            { name: "办公软件", level: 88 },
            { name: "（待补充）技能", level: 60 },
          ],
        },
      ],
    },
    {
      title: "荣誉奖项",
      items: [
        { type: "tags", content: ["优秀团员", "国创项目", "（待补充）奖项"] },
      ],
    },
    {
      title: "作品",
      items: [
        {
          type: "cards",
          content: [
            { title: "作品一", desc: "（待补充）作品简介", link: "" },
            { title: "作品二", desc: "（待补充）作品简介", link: "" },
          ],
        },
      ],
    },
    {
      title: "兴趣爱好",
      items: [
        { type: "tags", content: ["阅读", "摄影", "运动", "（待补充）"] },
      ],
    },
  ],

  contact: {
    email: "",
    links: [],
  },
};

/* ==================== 私密页内容（仅自己可见） ==================== */
const PRIVATE_CONTENT = {
  greeting: "欢迎回来，这是只属于你的空间。",
  notes: [
    { time: "2026-09-18", content: "示例：今天开始搭建个人网页。" },
  ],
  todos: [
    { done: false, content: "完善公开页的自我介绍" },
    { done: false, content: "补充真实经历和作品" },
    { done: false, content: "把默认密码 123456 换成自己的密码" },
  ],
};
