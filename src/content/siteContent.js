import { uploadedCommercialCases } from "./uploadedCommercialCases";

const commercialCases = [
  {
    id: "8090-night",
    title: "8090奇妙夜",
    category: "商业晚会视觉",
    poster: "/assets/commercial/8090-night.webp",
    video: "/assets/commercial/8090-night.mp4",
    description: "围绕 8090 后怀旧主题，完成活动视觉、AI 画面生成与视频后期合成。",
    meta: ["活动视觉", "AIGC视频", "商业交付"]
  },
  {
    id: "ai-taiwan",
    title: "AI台湾",
    category: "地方文旅宣传",
    poster: "/assets/commercial/ai-taiwan.webp",
    video: "/assets/commercial/ai-taiwan.mp4",
    description: "以空中视角和云海叙事构建地方文旅传播画面。",
    meta: ["文旅宣传", "AI分镜", "视觉生成"]
  },
  {
    id: "suntory",
    title: "三得利酱",
    category: "品牌广告",
    poster: "/assets/commercial/suntory.webp",
    video: "/assets/commercial/suntory.mp4",
    description: "面向品牌短片的产品氛围、镜头节奏与画面质感测试。",
    meta: ["品牌广告", "产品视觉", "短片"]
  },
  {
    id: "future-prompt",
    title: "提示未来创作大赛",
    category: "活动宣传",
    poster: "/assets/commercial/future-prompt.webp",
    video: "/assets/commercial/future-prompt.mp4",
    description: "为 AIGC 创作赛事制作高识别度活动视觉与动态宣传内容。",
    meta: ["活动宣传", "赛事视觉", "AIGC"]
  },
  {
    id: "huoxiang",
    title: "藿香正气",
    category: "电商内容",
    poster: "/assets/commercial/huoxiang.webp",
    video: "/assets/commercial/huoxiang.mp4",
    description: "电商场景下的产品卖点视觉化，将产品功能转化为可播放短视频。",
    meta: ["电商内容", "产品短片", "视觉转译"]
  },
  {
    id: "ai-cooking",
    title: "AI烹饪",
    category: "生活方式视频",
    poster: "/assets/commercial/ai-cooking.webp",
    video: "/assets/commercial/ai-cooking.mp4",
    description: "围绕美食与生活方式内容，探索 AI 镜头生成与节奏剪辑。",
    meta: ["生活方式", "AI镜头", "短视频"]
  },
  {
    id: "ai-china",
    title: "AI中国",
    category: "主题视觉",
    poster: "/assets/commercial/ai-china.webp",
    video: "/assets/commercial/ai-china.mp4",
    description: "大型主题视觉生成练习，关注宏大场景、层次和空间纵深。",
    meta: ["主题视觉", "场景生成", "视觉设计"]
  },
  {
    id: "ai-meiling",
    title: "AI梅岭",
    category: "地方宣传",
    poster: "/assets/commercial/ai-meiling.webp",
    video: "/assets/commercial/ai-meiling.mp4",
    description: "结合地域景观与 AI 影像生成，完成地方宣传视觉试验。",
    meta: ["地方宣传", "AI影像", "文旅"]
  },
  {
    id: "ai-yangshimu",
    title: "AI羊狮慕",
    category: "景区宣传",
    poster: "/assets/commercial/ai-yangshimu.webp",
    video: "/assets/commercial/ai-yangshimu.mp4",
    description: "为景区宣传构建更具幻想感和传播性的 AI 视频画面。",
    meta: ["景区宣传", "AI视频", "视觉叙事"]
  },
  {
    id: "ai-zhijiang",
    title: "AI之江",
    category: "城市主题",
    poster: "/assets/commercial/ai-zhijiang.webp",
    video: "/assets/commercial/ai-zhijiang.mp4",
    description: "城市主题影像练习，测试大场景、字幕画面和节奏包装。",
    meta: ["城市视觉", "AIGC短片", "后期"]
  },
  {
    id: "poetic-china",
    title: "诗意中国",
    category: "文化视觉",
    poster: "/assets/commercial/poetic-china.webp",
    video: "/assets/commercial/poetic-china.mp4",
    description: "以东方审美与诗意画面为核心，制作文化类视觉短片。",
    meta: ["文化视觉", "东方审美", "AI生成"]
  },
  {
    id: "reading-day",
    title: "阅读日",
    category: "公益传播",
    poster: "/assets/commercial/reading-day.webp",
    video: "/assets/commercial/reading-day.mp4",
    description: "面向公益与节日传播的轻量视频内容制作。",
    meta: ["公益传播", "活动短片", "AI后期"]
  },
  {
    id: "guiyang",
    title: "贵阳文旅",
    category: "文旅宣传",
    poster: "/assets/commercial/guiyang.webp",
    video: "/assets/commercial/guiyang.mp4",
    description: "融合城市印象与文旅画面，探索 AI 在目的地传播中的表达。",
    meta: ["文旅", "城市宣传", "AI影像"]
  },
  {
    id: "pine",
    title: "松林视觉",
    category: "自然场景",
    poster: "/assets/commercial/pine.webp",
    video: "/assets/commercial/pine.mp4",
    description: "自然场景生成与动态氛围练习，沉淀可复用的镜头风格。",
    meta: ["自然场景", "镜头练习", "风格测试"]
  }
];

export const startupContent = {
  name: "DingHaiRan",
  cnName: "丁海蚺",
  role: "AIGC工程师",
  gateImage: "/assets/launch/opening-gate-a3.png",
  entryImage: "/assets/launch/entry-cube-a1.png",
  startupVideo: "/assets/startup/personal-startup.mp4",
  freezeAtSeconds: 9.15
};

export const portfolioSite = {
  brand: {
    initials: "DH",
    name: "DingHaiRan",
    cnName: "丁海蚺",
    role: "AIGC工程师"
  },
  nav: [
    { label: "首页", target: "hero" },
    { label: "经历", target: "experience" },
    { label: "项目", target: "projects" },
    { label: "优势", target: "advantages" },
    { label: "联系", target: "contact" }
  ],
  hero: {
    eyebrow: "AIGC ENGINEER / CREATIVE TECHNOLOGY",
    titleTop: "DingHaiRan",
    titleBottom: "AIGC Engineer",
    summary:
      "我把 AIGC 视觉、ComfyUI 工作流、Agent 自动化和商业视频生产链路整合成稳定可交付的内容系统。",
    backgroundVideo: "/assets/startup/personal-startup.mp4",
    visualImage: "/assets/launch/entry-cube-a1.png",
    primaryAction: { label: "查看项目", target: "projects" },
    secondaryAction: { label: "发送邮件", href: "mailto:1914271079@qq.com" },
    tags: ["杭州", "一月内到岗", "AI Agent", "ComfyUI Pipeline"],
    metrics: [
      { value: "65%+", label: "项目效率提升" },
      { value: "30+", label: "品牌/文旅案例" },
      { value: "7天", label: "短周期交付压缩" }
    ]
  },
  experience: {
    eyebrow: "PROFILE / EXPERIENCE",
    englishTitle: "ABOUT",
    title: "把创意生成，变成可交付的生产系统",
    portrait: "/assets/profile/personal-photo.jpg",
    intro:
      "我是丁海蚺，专注 AIGC 视觉工程、AI Agent 工作流、ComfyUI 工业化生产链路与模型评测。擅长把品牌需求、视觉创意、模型能力和业务流程组织成可复用、可量产、可协作的交付体系。",
    contacts: [
      { label: "电话", value: "13651863244" },
      { label: "邮箱", value: "1914271079@qq.com" },
      { label: "城市", value: "杭州" },
      { label: "方向", value: "AIGC视觉工程 / Agent产品" }
    ],
    timeline: [
      {
        period: "2025.06 - 至今",
        company: "阿里巴巴集团",
        role: "AIGC视觉工程师",
        detail:
          "参与 Design Agent 流程抽象与生产链路优化，梳理从需求沟通、提示词编写、模型生成、结果筛选到反馈优化的完整流程，建设可复用方法、模型评测和交付标准。"
      },
      {
        period: "2024.09 - 2025.06",
        company: "浙江富润数链科技有限公司",
        role: "AIGC视觉工程负责人",
        detail:
          "主导 AI 商业视频生产、品牌广告与文旅项目，搭建基于 Python 与 ComfyUI 的动态参数控制系统，提升多项目复用、批量生产和交付效率。"
      },
      {
        period: "2024.01 - 2024.09",
        company: "艾门韦思网络科技有限公司",
        role: "AIGC视觉工程师",
        detail:
          "参与央视重点项目、地方文旅、AI 剧集与短视频素材库建设，推动 Midjourney、ComfyUI 等工具进入商业内容团队，并进行企业内部培训。"
      },
      {
        period: "2023.09 - 2024.01",
        company: "蓝色光标集团",
        role: "AIGC设计师",
        detail:
          "负责 AIGC 海报、视频和广告素材生产，参与信用卡、汽车、体育赛事等项目的视觉生成与 LoRA 模型训练，协同研发、UI、交互和测试推进上线。"
      },
      {
        period: "2023.05 - 2023.09",
        company: "韩创网络科技有限公司",
        role: "AIGC内容运营",
        detail:
          "使用 Midjourney 与 Stable Diffusion 建设关键词库和模型库，进行批量出图、账号内容运营和团队培训，提高素材产出和内容迭代效率。"
      }
    ],
    stats: [
      { value: "3000+", label: "单项目素材产出" },
      { value: "80%", label: "制作周期缩短" },
      { value: "8000万", label: "传播级播放量案例" }
    ]
  },
  projects: {
    eyebrow: "SELECTED WORK",
    englishTitle: "PROJECTS",
    title: "精选项目",
    intro: "以商业落地和生产链路为核心，展示 AIGC 视频、Agent 流程、ComfyUI 工作流与视觉设计项目。",
    showcase: {
      number: "01",
      eyebrow: "COMMERCIAL VIDEO",
      title: "AIGC商业落地视频案例",
      description:
        "下方小卡片会持续向左流动，每张封面都绑定一个对应视频。点击任意卡片后，上方主舞台会切换到对应视频。",
      cases: [...commercialCases, ...uploadedCommercialCases],
      emptySlots: []
    },
    cards: [
      {
        number: "02",
        kind: "agent-commerce",
        category: "AGENT / PRODUCT",
        title: "Design Agent 生产链路",
        description:
          "围绕商品入镜、卖点解析、脚本生成、画面预览和广告成片，搭建 Agent 一站式创作工作台，让电商短视频从单点生成变成可复用的生产链路。",
        tags: ["Agent Workflow", "Commerce Video", "Prompt Engineering"],
        panels: [
          {
            title: "商品入镜",
            label: "Upload Product",
            image: "/assets/agent-commerce/platform-upload.png",
            text: "识别商品图、类目、比例和画面质量，自动生成可执行的拍摄与生成参数。"
          },
          {
            title: "生成工作台",
            label: "Render Console",
            image: "/assets/agent-commerce/platform-workbench.png",
            text: "把商品信息、卖点、平台风格和画幅参数统一到一个可复用的 Agent 控制台。"
          },
          {
            title: "广告预览",
            label: "Final Output",
            image: "/assets/agent-commerce/platform-preview.png",
            text: "生成 15 秒以内电商短视频，支持重新生成、下载和快速交付。"
          }
        ],
        videos: [
          {
            id: "agent-makeup-remover",
            title: "卸妆乳广告生成",
            category: "商品短视频",
            poster: "/assets/agent-commerce/makeup-remover-cover.png",
            video: "/assets/agent-commerce/makeup-remover.mp4",
            description: "从单张商品图进入广告成片流程，展示电商视频的快速生成与预览。"
          },
          {
            id: "agent-cup",
            title: "杯子产品短片",
            category: "产品入镜",
            poster: "/assets/agent-commerce/cup-cover.png",
            video: "/assets/agent-commerce/cup.mp4",
            description: "将商品特征、材质和使用场景转译为短视频镜头。"
          },
          {
            id: "agent-camel-milk",
            title: "驼奶粉广告成片",
            category: "广告成片",
            poster: "/assets/agent-commerce/camel-milk-cover.png",
            video: "/assets/agent-commerce/camel-milk.mp4",
            description: "面向食品饮品类目的卖点提炼、画面生成和商业包装。"
          }
        ]
      },
      {
        number: "03",
        kind: "comfy-gallery",
        category: "COMFYUI / MODEL",
        title: "ComfyUI与模型训练",
        description: "围绕节点流程、LoRA 数据集、模型效果评测和参数模板搭建生产链路。",
        tags: ["ComfyUI", "LoRA", "Model Evaluation"],
        videos: [
          {
            id: "ali-christmas-hug",
            title: "圣诞拥抱 01",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-christmas-hug-1.jpg",
            video: "/assets/comfy-gallery/videos/ali-christmas-hug-1.webm",
            description: "节日氛围、角色互动和短视频镜头节奏测试。"
          },
          {
            id: "ali-christmas-boyfriend",
            title: "圣诞拥抱 02",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-christmas-boyfriend.jpg",
            video: "/assets/comfy-gallery/videos/ali-christmas-boyfriend.webm",
            description: "人物动作与节日场景融合测试。"
          },
          {
            id: "ali-weibo-010",
            title: "微博红人之夜",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-weibo-night-010.jpg",
            video: "/assets/comfy-gallery/videos/ali-weibo-night-010.mp4",
            description: "活动现场视觉、人物氛围和镜头一致性测试。"
          },
          {
            id: "ali-weibo-02",
            title: "微博之夜 02",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-weibo-night-02.jpg",
            video: "/assets/comfy-gallery/videos/ali-weibo-night-02.mp4",
            description: "活动人物、光效氛围和商业视觉一致性测试。"
          },
          {
            id: "ali-weibo-03",
            title: "微博之夜 03",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-weibo-night-03.jpg",
            video: "/assets/comfy-gallery/videos/ali-weibo-night-03.mp4",
            description: "活动舞台感、人物镜头和动态合成测试。"
          },
          {
            id: "ali-weibo-man",
            title: "微博之夜男模",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-weibo-night-man.jpg",
            video: "/assets/comfy-gallery/videos/ali-weibo-night-man.mp4",
            description: "男性角色、红毯视觉和品牌活动气质测试。"
          },
          {
            id: "ali-game-ui-0610",
            title: "游戏界面 0610",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-game-ui-0610.jpg",
            video: "/assets/comfy-gallery/videos/ali-game-ui-0610.mp4",
            description: "游戏界面、动态 UI 和画面合成测试。"
          },
          {
            id: "ali-game-ui-0611",
            title: "游戏界面 0611",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-game-ui-0611.jpg",
            video: "/assets/comfy-gallery/videos/ali-game-ui-0611.mp4",
            description: "动态界面、节庆视觉和镜头节奏测试。"
          },
          {
            id: "ali-game-ui-b3",
            title: "游戏界面 B3",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-game-ui-b3.jpg",
            video: "/assets/comfy-gallery/videos/ali-game-ui-b3.mp4",
            description: "复杂 UI、角色画面和多元素合成测试。"
          },
          {
            id: "ali-palm-firework",
            title: "手心烟花 01",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-palm-firework-1.jpg",
            video: "/assets/comfy-gallery/videos/ali-palm-firework-1.mp4",
            description: "手部动作、粒子特效和镜头跟随测试。"
          },
          {
            id: "ali-palm-firework-2",
            title: "手心烟花 02",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-palm-firework-2.jpg",
            video: "/assets/comfy-gallery/videos/ali-palm-firework-2.mp4",
            description: "手部特效、光效爆发和短视频动势测试。"
          },
          {
            id: "ali-stranger-story",
            title: "陌生人故事",
            category: "阿里巴巴视频",
            poster: "/assets/comfy-gallery/posters/ali-stranger-story.jpg",
            video: "/assets/comfy-gallery/videos/ali-stranger-story.webm",
            description: "人物叙事、生活化镜头和情绪氛围测试。"
          }
        ],
        gallery: [
          { image: "/assets/comfy-gallery/images/comfy-01.webp", text: "ComfyUI Workflow" },
          { image: "/assets/comfy-gallery/images/comfy-02.webp", text: "Node System" },
          { image: "/assets/comfy-gallery/images/comfy-03.webp", text: "LoRA Dataset" },
          { image: "/assets/comfy-gallery/images/comfy-04.webp", text: "Model Eval" },
          { image: "/assets/comfy-gallery/images/comfy-05.webp", text: "Prompt Lab" },
          { image: "/assets/comfy-gallery/images/comfy-06.webp", text: "Batch Render" },
          { image: "/assets/comfy-gallery/images/ali-01.webp", text: "Alibaba 01" },
          { image: "/assets/comfy-gallery/images/ali-02.webp", text: "Alibaba 02" },
          { image: "/assets/comfy-gallery/images/ali-03.webp", text: "Alibaba 03" },
          { image: "/assets/comfy-gallery/images/ali-04.webp", text: "Alibaba 04" },
          { image: "/assets/comfy-gallery/images/ali-05.webp", text: "Alibaba 05" },
          { image: "/assets/comfy-gallery/images/ali-06.webp", text: "Alibaba 06" },
          { image: "/assets/comfy-gallery/images/ali-07.webp", text: "Alibaba 07" },
          { image: "/assets/comfy-gallery/images/ali-08.webp", text: "Alibaba 08" },
          { image: "/assets/comfy-gallery/images/ali-09.webp", text: "Alibaba 09" },
          { image: "/assets/comfy-gallery/images/ali-10.webp", text: "Alibaba 10" },
          { image: "/assets/comfy-gallery/images/ali-11.webp", text: "Alibaba 11" },
          { image: "/assets/comfy-gallery/images/ali-12.webp", text: "Alibaba 12" },
          { image: "/assets/comfy-gallery/images/ali-13.webp", text: "Alibaba 13" },
          { image: "/assets/comfy-gallery/images/ali-14.webp", text: "Alibaba 14" },
          { image: "/assets/comfy-gallery/images/ali-16.webp", text: "Alibaba 15" },
          { image: "/assets/comfy-gallery/images/ali-17.webp", text: "Alibaba 16" },
          { image: "/assets/comfy-gallery/images/ali-18.webp", text: "Alibaba 17" },
          { image: "/assets/comfy-gallery/images/ali-19.webp", text: "Alibaba 18" },
          { image: "/assets/comfy-gallery/images/ali-20.webp", text: "Alibaba 19" },
          { image: "/assets/comfy-gallery/images/ali-21.webp", text: "Alibaba 20" },
          { image: "/assets/comfy-gallery/images/ali-22.webp", text: "Alibaba 21" },
          { image: "/assets/comfy-gallery/images/ali-23.webp", text: "Alibaba 22" },
          { image: "/assets/comfy-gallery/images/ali-24.webp", text: "Alibaba 23" },
          { image: "/assets/comfy-gallery/images/ali-25.webp", text: "Alibaba 24" },
          { image: "/assets/comfy-gallery/images/ali-26.webp", text: "Alibaba 25" },
          { image: "/assets/comfy-gallery/images/ali-27.webp", text: "Alibaba 26" }
        ]
      }
    ]
  },
  advantages: {
    eyebrow: "CAPABILITY MAP",
    englishTitle: "ADVANTAGES",
    title: "个人优势",
    cards: [
      {
        title: "AIGC工程化",
        text: "熟悉 Stable Diffusion、Midjourney、ComfyUI、ChatGPT、Claude Code、Codex 等工具，能把创意产出流程化。"
      },
      {
        title: "商业视频落地",
        text: "能把品牌、电商、文旅与活动需求拆成分镜、素材、生成、后期和复盘链路，面向真实交付。"
      },
      {
        title: "模型评测与训练",
        text: "具备提示词工程、数据集构建、LoRA 训练、效果对比和质量规范制定经验。"
      },
      {
        title: "Agent产品思维",
        text: "运用 Agent 给团队协作、项目管理和内容生产提效，能搭建自动化工具。"
      }
    ]
  },
  contact: {
    eyebrow: "LET'S BUILD",
    englishTitle: "CONTACT",
    title: "让 AIGC 真正进入生产现场",
    text:
      "如果你需要 AIGC 视觉工程、商业视频生产链路、ComfyUI 工作流或 Agent 产品协作，可以直接联系我。",
    email: "1914271079@qq.com",
    phone: "13651863244",
    city: "杭州",
    buttonLabel: "发送邮件"
  }
};
