// Region data with paths and centers
export interface RegionData {
  path: string;
  center: { x: number; y: number };
  color: string;
  hoverColor: string;
}

export const REGIONS: Record<string, RegionData> = {
  "台北": {
    path: "M180,120 Q210,110 240,120 Q260,140 250,170 Q230,190 200,190 Q170,180 160,160 Q160,140 180,120 Z",
    center: { x: 210, y: 150 },
    color: "rgba(43, 127, 255, 0.2)",
    hoverColor: "rgba(43, 127, 255, 0.4)"
  },
  "新北": {
    path: "M160,160 Q150,140 130,140 Q110,150 100,180 Q110,210 130,220 Q160,230 190,220 Q210,200 200,190 Q170,180 160,160 Z",
    center: { x: 150, y: 180 },
    color: "rgba(75, 120, 240, 0.2)",
    hoverColor: "rgba(75, 120, 240, 0.4)"
  },
  "桃園": {
    path: "M130,220 Q110,210 100,180 Q90,200 80,230 Q90,260 110,270 Q140,280 160,260 Q170,240 160,230 Q130,220 130,220 Z",
    center: { x: 120, y: 240 },
    color: "rgba(100, 110, 230, 0.2)",
    hoverColor: "rgba(100, 110, 230, 0.4)"
  },
  "新竹": {
    path: "M110,270 Q90,260 80,230 Q70,250 70,280 Q80,310 100,320 Q130,320 150,300 Q160,280 160,260 Q140,280 110,270 Z",
    center: { x: 110, y: 280 },
    color: "rgba(125, 95, 220, 0.2)",
    hoverColor: "rgba(125, 95, 220, 0.4)"
  },
  "苗栗": {
    path: "M100,320 Q80,310 70,280 Q60,300 60,330 Q70,360 90,370 Q120,370 140,350 Q150,330 150,300 Q130,320 100,320 Z",
    center: { x: 100, y: 330 },
    color: "rgba(150, 80, 210, 0.2)",
    hoverColor: "rgba(150, 80, 210, 0.4)"
  },
  "台中": {
    path: "M90,370 Q70,360 60,330 Q50,350 50,380 Q60,410 90,420 Q130,420 160,400 Q170,370 140,350 Q120,370 90,370 Z",
    center: { x: 110, y: 380 },
    color: "rgba(175, 65, 200, 0.2)",
    hoverColor: "rgba(175, 65, 200, 0.4)"
  },
  "彰化": {
    path: "M90,420 Q60,410 50,380 Q40,400 50,430 Q70,450 100,450 Q130,440 140,420 Q130,420 90,420 Z",
    center: { x: 90, y: 420 },
    color: "rgba(200, 50, 190, 0.2)",
    hoverColor: "rgba(200, 50, 190, 0.4)"
  },
  "南投": {
    path: "M140,420 Q170,410 190,420 Q210,440 210,470 Q190,490 160,480 Q130,460 100,450 Q130,440 140,420 Z",
    center: { x: 160, y: 450 },
    color: "rgba(200, 80, 170, 0.2)",
    hoverColor: "rgba(200, 80, 170, 0.4)"
  },
  "雲林": {
    path: "M100,450 Q70,450 50,430 Q30,450 40,480 Q60,500 90,500 Q120,490 130,470 Q130,460 100,450 Z",
    center: { x: 80, y: 470 },
    color: "rgba(210, 100, 150, 0.2)",
    hoverColor: "rgba(210, 100, 150, 0.4)"
  },
  "嘉義": {
    path: "M130,470 Q120,490 90,500 Q70,520 80,550 Q100,570 130,560 Q150,540 160,510 Q150,490 130,470 Z",
    center: { x: 120, y: 520 },
    color: "rgba(220, 120, 130, 0.2)",
    hoverColor: "rgba(220, 120, 130, 0.4)"
  },
  "台南": {
    path: "M160,510 Q150,540 130,560 Q140,580 160,590 Q190,590 210,570 Q220,540 210,510 Q190,490 160,510 Z",
    center: { x: 180, y: 550 },
    color: "rgba(230, 140, 110, 0.2)",
    hoverColor: "rgba(230, 140, 110, 0.4)"
  },
  "高雄": {
    path: "M210,510 Q220,540 210,570 Q220,590 240,600 Q270,590 280,560 Q270,530 250,510 Q230,500 210,510 Z",
    center: { x: 240, y: 550 },
    color: "rgba(240, 160, 90, 0.2)",
    hoverColor: "rgba(240, 160, 90, 0.4)"
  },
  "屏東": {
    path: "M240,600 Q220,590 210,570 Q190,590 190,620 Q210,650 240,650 Q270,640 280,610 Q270,590 240,600 Z",
    center: { x: 230, y: 610 },
    color: "rgba(250, 180, 70, 0.2)",
    hoverColor: "rgba(250, 180, 70, 0.4)"
  },
  "宜蘭": {
    path: "M240,120 Q270,130 290,150 Q300,180 290,210 Q270,230 240,220 Q230,190 250,170 Q260,140 240,120 Z",
    center: { x: 260, y: 170 },
    color: "rgba(43, 180, 200, 0.2)",
    hoverColor: "rgba(43, 180, 200, 0.4)"
  },
  "花蓮": {
    path: "M290,210 Q300,180 290,150 Q300,170 310,200 Q320,250 320,300 Q310,340 290,340 Q270,310 260,270 Q270,240 290,210 Z",
    center: { x: 290, y: 250 },
    color: "rgba(0, 200, 180, 0.2)",
    hoverColor: "rgba(0, 200, 180, 0.4)"
  },
  "台東": {
    path: "M290,340 Q310,340 320,300 Q330,330 330,370 Q320,410 300,440 Q270,450 250,430 Q260,390 270,350 Q270,310 290,340 Z",
    center: { x: 290, y: 380 },
    color: "rgba(0, 210, 160, 0.2)",
    hoverColor: "rgba(0, 210, 160, 0.4)"
  }
};

// User data
export interface UserData {
  id: number;
  username: string;
  avatar: string;
  city: string;
  skills: string[];
  bio: string;
}

export const MOCK_USERS: UserData[] = [
  {
    id: 1,
    username: "TaipeiTech",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=TaipeiTech",
    city: "台北",
    skills: ["React", "TypeScript", "UI/UX"],
    bio: "前端開發者，專注於創建美觀且易用的用戶界面"
  },
  {
    id: 2,
    username: "CloudMaster",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=CloudMaster",
    city: "台北",
    skills: ["AWS", "DevOps", "Kubernetes"],
    bio: "雲端架構專家，幫助企業實現雲轉型"
  },
  {
    id: 3,
    username: "AIResearcher",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=AIResearcher",
    city: "新竹",
    skills: ["Machine Learning", "Python", "TensorFlow"],
    bio: "人工智能研究員，專注於電腦視覺和自然語言處理"
  },
  {
    id: 4,
    username: "BlockchainDev",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=BlockchainDev",
    city: "台北",
    skills: ["Blockchain", "Solidity", "Web3"],
    bio: "區塊鏈開發者，熱衷於去中心化應用"
  },
  {
    id: 5,
    username: "MobileGuru",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=MobileGuru",
    city: "台中",
    skills: ["iOS", "Swift", "React Native"],
    bio: "移動應用開發專家，創建流暢的用戶體驗"
  },
  {
    id: 6,
    username: "DataWizard",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=DataWizard",
    city: "台中",
    skills: ["Data Science", "R", "Visualization"],
    bio: "數據科學家，擅長從數據中發現有價值的洞察"
  },
  {
    id: 7,
    username: "GameCreator",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=GameCreator",
    city: "高雄",
    skills: ["Unity", "C#", "3D Modeling"],
    bio: "遊戲開發者，創造沉浸式娛樂體驗"
  },
  {
    id: 8,
    username: "SecurityPro",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=SecurityPro",
    city: "台北",
    skills: ["Cybersecurity", "Ethical Hacking", "Network Security"],
    bio: "網絡安全專家，保護數字資產免受威脅"
  },
  {
    id: 9,
    username: "FullStackDev",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=FullStackDev",
    city: "台南",
    skills: ["JavaScript", "Node.js", "MongoDB"],
    bio: "全棧開發人員，從前端到後端都能勝任"
  },
  {
    id: 10,
    username: "UXDesigner",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=UXDesigner",
    city: "台北",
    skills: ["UI Design", "Figma", "User Research"],
    bio: "專注於用戶體驗設計，打造以人為本的產品"
  },
  {
    id: 11,
    username: "IoTEngineer",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=IoTEngineer",
    city: "新竹",
    skills: ["IoT", "Arduino", "Embedded Systems"],
    bio: "物聯網工程師，連接現實世界與數字世界"
  },
  {
    id: 12,
    username: "ARDeveloper",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ARDeveloper",
    city: "台中",
    skills: ["Augmented Reality", "ARKit", "Unity"],
    bio: "增強現實開發者，創建互動式沉浸體驗"
  },
  {
    id: 13,
    username: "DataEngineer",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=DataEngineer",
    city: "高雄",
    skills: ["Big Data", "Hadoop", "Spark"],
    bio: "數據工程師，構建大規模數據處理系統"
  },
  {
    id: 14,
    username: "ProductManager",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ProductManager",
    city: "台北",
    skills: ["Product Strategy", "Agile", "Market Research"],
    bio: "產品經理，將創意轉化為成功的產品"
  },
  {
    id: 15,
    username: "ServerlessExpert",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ServerlessExpert",
    city: "台南",
    skills: ["Serverless", "AWS Lambda", "Cloud Functions"],
    bio: "無服務器架構專家，構建高擴展性應用"
  },
  {
    id: 16,
    username: "QAEngineer",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=QAEngineer",
    city: "台北",
    skills: ["Test Automation", "Selenium", "Quality Assurance"],
    bio: "質量保證工程師，確保軟件品質和可靠性"
  },
  {
    id: 17,
    username: "EmbeddedDev",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=EmbeddedDev",
    city: "新竹",
    skills: ["Embedded C", "Firmware", "RTOS"],
    bio: "嵌入式系統開發者，專注於高效穩定的底層軟件"
  },
  {
    id: 18,
    username: "StartupFounder",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=StartupFounder",
    city: "台北",
    skills: ["Entrepreneurship", "Business Development", "Pitching"],
    bio: "創業者，正在構建下一個改變世界的產品"
  },
  {
    id: 19,
    username: "DevOpsGuru",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=DevOpsGuru",
    city: "台中",
    skills: ["CI/CD", "Docker", "Infrastructure as Code"],
    bio: "DevOps專家，實現開發與運維的無縫銜接"
  },
  {
    id: 20,
    username: "AIEthicist",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=AIEthicist",
    city: "台北",
    skills: ["AI Ethics", "Policy", "Responsible AI"],
    bio: "人工智能倫理專家，關注技術發展的社會影響"
  },
  {
    id: 21,
    username: "HealthTechDev",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=HealthTechDev",
    city: "高雄",
    skills: ["Health Informatics", "Medical Software", "Angular"],
    bio: "醫療技術開發者，利用技術改善醫療體系"
  },
  {
    id: 22,
    username: "3DModeler",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=3DModeler",
    city: "台南",
    skills: ["Blender", "3D Animation", "Texturing"],
    bio: "3D建模師，創建逼真的數字藝術作品"
  },
  {
    id: 23,
    username: "RoboticsDev",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=RoboticsDev",
    city: "新竹",
    skills: ["Robotics", "ROS", "Computer Vision"],
    bio: "機器人開發者，構建智能自主的機器人系統"
  },
  {
    id: 24,
    username: "CloudArchitect",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=CloudArchitect",
    city: "台北",
    skills: ["Azure", "GCP", "Multi-cloud"],
    bio: "雲架構師，設計可擴展的分佈式系統"
  },
  {
    id: 25,
    username: "NLPExpert",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=NLPExpert",
    city: "台中",
    skills: ["NLP", "BERT", "Transformers"],
    bio: "自然語言處理專家，致力於讓機器理解人類語言"
  },
  {
    id: 26,
    username: "CryptoTrader",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=CryptoTrader",
    city: "高雄",
    skills: ["Cryptocurrency", "Trading Algorithms", "Risk Management"],
    bio: "加密貨幣交易員，開發自動化交易策略"
  },
  {
    id: 27,
    username: "OpenSourceContributor",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=OpenSourceContributor",
    city: "台南",
    skills: ["Open Source", "Git", "Community Building"],
    bio: "開源貢獻者，相信共享知識的力量"
  },
  {
    id: 28,
    username: "HardwareHacker",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=HardwareHacker",
    city: "新竹",
    skills: ["PCB Design", "Raspberry Pi", "Electronics"],
    bio: "硬件極客，喜歡設計和製作電子產品"
  },
  {
    id: 29,
    username: "FintechInnovator",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=FintechInnovator",
    city: "台北",
    skills: ["Fintech", "Payment Systems", "Financial Regulations"],
    bio: "金融科技創新者，致力於改革傳統金融服務"
  },
  {
    id: 30,
    username: "EdTechSpecialist",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=EdTechSpecialist",
    city: "花蓮",
    skills: ["Educational Technology", "Learning Management Systems", "Instructional Design"],
    bio: "教育科技專家，利用科技提升學習體驗"
  }
]; 