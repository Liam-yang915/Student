export type Feature = {
  title: string;
  description: string;
};

export type Step = {
  title: string;
  description: string;
};

export const heroContent = {
  badge: "在线英语学习平台",
  title: "把英语学习变得更轻、更直接。",
  description:
    "学生端首页先聚焦最重要的事情，让家长和学生一眼看懂课程价值、学习方式和报名入口。",
  primaryAction: "立即预约试听",
  secondaryAction: "查看课程介绍",
};

export const features: Feature[] = [
  {
    title: "课程重点清楚",
    description: "把一对一、口语提升、考试辅导这些核心卖点直接讲清楚，不堆太多信息。",
  },
  {
    title: "页面结构简单",
    description: "用少量区块表达主要内容，后续你自己加模块、删模块都会更直观。",
  },
  {
    title: "更容易维护",
    description: "文案统一放在数据文件里，改标题、卡片和按钮时不用到处找。",
  },
];

export const steps: Step[] = [
  {
    title: "1. 了解课程",
    description: "先让用户快速知道你们教什么、适合谁、能解决什么问题。",
  },
  {
    title: "2. 预约试听",
    description: "用一个明确入口承接转化，不让用户在首页里迷路。",
  },
  {
    title: "3. 进入学习",
    description: "试听后再引导注册、选课、上课，把流程拆开会更清晰。",
  },
];

export const ctaContent = {
  title: "先把首页做轻，后面功能再一点点加。",
  description:
    "这版更适合作为学生端起点。等你后面接登录、课程列表、教师介绍，再继续往里扩展。",
  action: "开始搭建学生端",
};
