import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Filter, X, Send, Map as MapIcon, List, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../context/auth';
import TaiwanSVG from './TaiwanSVG';
import { MOCK_USERS, REGIONS, RegionData, UserData } from './mockData';

type ViewMode = 'map' | 'list';
type DisplayMode = 'default' | 'heatmap';

const InteractiveTaiwanMap: React.FC = () => {
  const { user } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('default');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filter users based on selected region and skill filter
  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesRegion = !selectedRegion || user.city === selectedRegion;
    const matchesSkill = !skillFilter || 
      user.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    return matchesRegion && matchesSkill;
  });

  const handleZoomIn = () => {
    if (zoomLevel < 5) setZoomLevel(prev => prev + 0.5);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => prev - 0.5);
      if (zoomLevel <= 1.5) {
        setSelectedRegion(null);
        setPanOffset({ x: 0, y: 0 });
      }
    }
  };

  const handleRegionClick = (regionId: string, regionData: RegionData) => {
    setSelectedRegion(regionId);
    setZoomLevel(3);
    
    // Calculate center of the region to adjust pan
    const offsetX = -regionData.center.x * 3 + (mapContainerRef.current?.clientWidth || 0) / 2;
    const offsetY = -regionData.center.y * 3 + (mapContainerRef.current?.clientHeight || 0) / 2;
    setPanOffset({ x: offsetX, y: offsetY });
  };

  const handleBackToFullMap = () => {
    setSelectedRegion(null);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleUserPinClick = (userData: UserData) => {
    setSelectedUser(userData);
  };

  const handleSendInvite = (userData: UserData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    toast.success(`邀請已發送給 ${userData.username}！`, {
      icon: '✉️',
      duration: 3000
    });
    setSelectedUser(null);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (selectedUser && e.target instanceof Element) {
      const profilePopup = document.getElementById('user-profile-popup');
      if (profilePopup && !profilePopup.contains(e.target)) {
        setSelectedUser(null);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDragging, dragStart, selectedUser]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Map Controls & Filters */}
      <div className="lg:w-1/4">
        <div className="glass-card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">地圖控制</h3>
          
          <div className="flex justify-between mb-6">
            <Button 
              onClick={handleZoomIn} 
              className="bg-cosmic-purple/20 border border-cosmic-purple/50 hover:bg-cosmic-purple/30"
              disabled={zoomLevel >= 5}
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            
            <Button 
              onClick={handleBackToFullMap}
              className="bg-cosmic-purple/20 border border-cosmic-purple/50 hover:bg-cosmic-purple/30"
              disabled={!selectedRegion && zoomLevel === 1}
            >
              全台灣視圖
            </Button>
            
            <Button 
              onClick={handleZoomOut} 
              className="bg-cosmic-purple/20 border border-cosmic-purple/50 hover:bg-cosmic-purple/30"
              disabled={zoomLevel <= 1}
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="text-sm text-star-white/80 mb-2">顯示模式</div>
          <div className="flex justify-between mb-6">
            <Button 
              onClick={() => setViewMode('map')} 
              className={`flex-1 mr-2 ${viewMode === 'map' 
                ? 'bg-cosmic-purple text-white' 
                : 'bg-cosmic-purple/20 border border-cosmic-purple/50'}`}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              地圖
            </Button>
            
            <Button 
              onClick={() => setViewMode('list')}
              className={`flex-1 ${viewMode === 'list' 
                ? 'bg-cosmic-purple text-white' 
                : 'bg-cosmic-purple/20 border border-cosmic-purple/50'}`}
            >
              <List className="w-4 h-4 mr-2" />
              列表
            </Button>
          </div>
          
          <div className="text-sm text-star-white/80 mb-2">地圖樣式</div>
          <div className="flex justify-between mb-6">
            <Button 
              onClick={() => setDisplayMode('default')} 
              className={`flex-1 mr-2 ${displayMode === 'default' 
                ? 'bg-cosmic-purple text-white' 
                : 'bg-cosmic-purple/20 border border-cosmic-purple/50'}`}
            >
              標準
            </Button>
            
            <Button 
              onClick={() => setDisplayMode('heatmap')}
              className={`flex-1 ${displayMode === 'heatmap' 
                ? 'bg-cosmic-purple text-white' 
                : 'bg-cosmic-purple/20 border border-cosmic-purple/50'}`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              熱度圖
            </Button>
          </div>
          
          <div className="relative mt-4">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-star-white/50" />
            <Input
              type="text"
              placeholder="按技能篩選..."
              className="pl-10 bg-deep-space border-cosmic-purple/30"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
        </div>
        
        {/* User List (Visible in both map and list modes) */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">
            {selectedRegion ? `${selectedRegion}的創作者` : '所有創作者'}
            <span className="text-sm ml-2 text-star-white/60">
              ({filteredUsers.length})
            </span>
          </h3>
          
          <div className="max-h-[400px] overflow-y-auto pr-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center p-3 mb-2 rounded-lg hover:bg-cosmic-purple/10 cursor-pointer transition-colors"
                  onClick={() => handleUserPinClick(user)}
                >
                  <Avatar className="mr-3 border border-cosmic-purple/30">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-cosmic-purple/20">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-star-white/60">{user.city}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-star-white/60">
                沒有找到符合條件的創作者
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Map Area */}
      <div className="lg:w-3/4 glass-card p-4 relative">
        {viewMode === 'map' ? (
          <div 
            ref={mapContainerRef}
            className={`relative w-full h-[600px] overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
          >
            <motion.div
              style={{
                scale: zoomLevel,
                x: panOffset.x,
                y: panOffset.y
              }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="origin-center"
            >
              <TaiwanSVG 
                selectedRegion={selectedRegion}
                onRegionClick={handleRegionClick}
                displayMode={displayMode}
                users={filteredUsers}
                onUserPinClick={handleUserPinClick}
              />
            </motion.div>
            
            {/* Region Title */}
            {selectedRegion && (
              <div className="absolute top-4 left-4 bg-deep-space/80 backdrop-blur-sm p-3 rounded-lg border border-cosmic-purple/30">
                <h3 className="text-xl font-bold text-stellar-blue">{selectedRegion}</h3>
                <p className="text-sm text-star-white/60">
                  {filteredUsers.length} 位創作者在此地區
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 h-[600px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                className="glass-card overflow-hidden"
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(110, 58, 255, 0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleUserPinClick(user)}
              >
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <Avatar className="w-12 h-12 mr-3 border border-cosmic-purple/30">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback className="bg-cosmic-purple/20">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-star-white/60">{user.city}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-star-white/80 mb-3 line-clamp-2">{user.bio}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-stellar-blue/10 text-stellar-blue text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* User Profile Popup */}
      {selectedUser && (
        <motion.div
          id="user-profile-popup"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-deep-space border border-cosmic-purple/30 rounded-xl p-6 max-w-md w-full shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <button
            className="absolute top-3 right-3 text-star-white/60 hover:text-star-white"
            onClick={() => setSelectedUser(null)}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center mb-6">
            <Avatar className="w-16 h-16 mr-4 border-2 border-cosmic-purple/30">
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
              <AvatarFallback className="bg-cosmic-purple/20 text-xl font-bold">
                {selectedUser.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{selectedUser.username}</h3>
              <p className="text-star-white/60">{selectedUser.city}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm text-star-white/60 mb-1">簡介</h4>
            <p className="text-star-white/90">{selectedUser.bio}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm text-star-white/60 mb-2">技能</h4>
            <div className="flex flex-wrap gap-2">
              {selectedUser.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-stellar-blue/10 text-stellar-blue">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full btn btn-primary"
            onClick={() => handleSendInvite(selectedUser)}
          >
            <Send className="w-4 h-4 mr-2" />
            邀請加入您的團隊
          </Button>
        </motion.div>
      )}
      
      {/* Auth Modal */}
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
              您需要先登入或註冊才能邀請創作者加入您的團隊
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => window.location.href = '/auth/signup'} 
                className="flex-1 btn btn-primary"
              >
                註冊
              </Button>
              <Button 
                onClick={() => window.location.href = '/auth/login'} 
                className="flex-1 btn btn-secondary"
              >
                登入
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveTaiwanMap; 