import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Send, AlertCircle, Code, Briefcase, Leaf, Sparkles, BarChart3, BookOpen, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// 模擬團隊數據 - 之後將用Supabase數據替換
const MOCK_TEAMS = [
  {
    id: 1,
    name: '創新科技團隊',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=team1',
    members: 4,
    skills: ['React', 'Node.js', 'AI', 'UI/UX'],
    description: '開發創新的人工智能應用程序，專注於用戶體驗和可擴展性',
    category: 'technology',
    lookingFor: ['前端工程師', '數據科學家']
  },
  {
    id: 2,
    name: '生物科技新創',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=team2',
    members: 3,
    skills: ['生物技術', '醫療', '數據分析'],
    description: '研發創新生物技術解決方案，專注於醫療保健領域',
    category: 'biotech',
    lookingFor: ['生物學家', '行銷專家']
  },
  {
    id: 3,
    name: '永續發展團隊',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=team3',
    members: 5,
    skills: ['綠色科技', '可持續發展', 'IoT', '環保'],
    description: '通過創新技術解決環境挑戰，建立可持續發展的未來',
    category: 'sustainability',
    lookingFor: ['項目經理', '環境科學家']
  },
  {
    id: 4,
    name: 'Fintech創新小組',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=team4',
    members: 4,
    skills: ['區塊鏈', '金融', 'Smart Contracts', 'API'],
    description: '利用區塊鏈技術變革金融服務，打造更包容的金融生態系統',
    category: 'fintech',
    lookingFor: ['區塊鏈開發者', '金融分析師']
  },
  {
    id: 5,
    name: '教育科技團隊',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=team5',
    members: 3,
    skills: ['教育', 'EdTech', 'React', 'Firebase'],
    description: '創建創新的教育技術解決方案，使學習更具互動性和可訪問性',
    category: 'education',
    lookingFor: ['全端開發者', '教育學專家']
  },
  {
    id: 6,
    name: '數字藝術集體',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=team6',
    members: 4,
    skills: ['設計', '藝術', '3D建模', 'NFT'],
    description: '結合藝術和技術創作數字體驗和NFT藝術作品',
    category: 'art',
    lookingFor: ['3D藝術家', 'NFT專家']
  }
];

// 分類篩選選項
const CATEGORIES = [
  { id: 'all', name: '全部', icon: <Filter className="w-4 h-4" /> },
  { id: 'technology', name: '科技', icon: <Code className="w-4 h-4" /> },
  { id: 'biotech', name: '生物科技', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'sustainability', name: '永續發展', icon: <Leaf className="w-4 h-4" /> },
  { id: 'fintech', name: '金融科技', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'education', name: '教育科技', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'art', name: '藝術科技', icon: <Palette className="w-4 h-4" /> }
];

const TeamGallery: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  // 根據搜索和類別過濾團隊
  const filteredTeams = MOCK_TEAMS.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      team.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || team.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 處理連接請求
  const handleConnectRequest = (teamId: number) => {
    if (!user) {
      setShowAuthModal(true);
      setSelectedTeam(teamId);
    } else {
      // 將來實現實際與Supabase的連接邏輯
      alert(`已發送邀請給團隊 ${MOCK_TEAMS.find(t => t.id === teamId)?.name}`);
    }
  };

  return (
    <section id="explore" className="section bg-deep-space pt-12 pb-24">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">尋找夢幻團隊</span>
          </h2>
          <p className="text-xl text-star-white/80 max-w-2xl mx-auto">
            探索激動人心的項目並尋找有才華的團隊成員，一起創造未來
          </p>
        </div>

        {/* 搜索和過濾 */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-star-white/50" />
            <Input
              type="text"
              placeholder="搜索項目、技能或團隊..."
              className="pl-10 bg-deep-space border-cosmic-purple/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full border ${
                  selectedCategory === category.id
                    ? 'bg-cosmic-purple/20 border-cosmic-purple'
                    : 'border-cosmic-purple/30 hover:border-cosmic-purple/70'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 團隊畫廊 */}
        {filteredTeams.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                className="glass-card overflow-hidden"
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(110, 58, 255, 0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-16 h-16 mr-4 border-2 border-cosmic-purple/30">
                      <AvatarImage src={team.avatar} alt={team.name} />
                      <AvatarFallback className="bg-cosmic-purple/20 text-xl font-bold">
                        {team.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{team.name}</h3>
                      <p className="text-star-white/60 text-sm">{team.members} 位成員</p>
                    </div>
                  </div>
                  
                  <p className="text-star-white/80 mb-4">{team.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm text-star-white/60 mb-2">技能與專長</h4>
                    <div className="flex flex-wrap gap-2">
                      {team.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-stellar-blue/10 text-stellar-blue">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm text-star-white/60 mb-2">正在尋找</h4>
                    <div className="flex flex-wrap gap-2">
                      {team.lookingFor.map((role, i) => (
                        <Badge key={i} variant="outline" className="border-cosmic-purple/40 text-cosmic-purple">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleConnectRequest(team.id)}
                    className="w-full btn btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    發送邀請
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 mx-auto text-star-white/30 mb-4" />
            <h3 className="text-2xl font-bold mb-2">未找到匹配的團隊</h3>
            <p className="text-star-white/60">
              嘗試不同的搜索詞或過濾器，或稍後再回來查看
            </p>
          </div>
        )}

        {/* 登入提示彈窗 */}
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 bg-deep-space/80 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div 
              className="bg-deep-space border border-cosmic-purple/30 rounded-xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">需要登入</h3>
              <p className="text-star-white/80 mb-6">
                您需要先登入或註冊才能與團隊聯繫
              </p>
              <div className="flex gap-4">
                <Link to="/auth/signup" className="btn btn-primary flex-1">
                  註冊
                </Link>
                <Link to="/auth/login" className="btn btn-secondary flex-1">
                  登入
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeamGallery; 