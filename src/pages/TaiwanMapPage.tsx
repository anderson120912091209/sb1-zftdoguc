import React, { useState, useEffect } from 'react';
import TaiwanMap from '../components/TaiwanMap';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Filter, X } from 'lucide-react';
import API, { ProfileWithSkills } from '../api';
import { useAuth } from '../context/auth';
import { motion } from 'framer-motion';

// County IDs for Taiwan
const COUNTIES = [
  'TPE', 'NTP', 'TYC', 'TXG', 'TNN', 'KHH', 'HSZ', 'MIA', 
  'CHA', 'NAN', 'YUN', 'CYI', 'PIF', 'ILA', 'HUA', 'TTT'
];

// County names in Chinese
const COUNTY_NAMES: Record<string, string> = {
  'TPE': '臺北市',
  'NTP': '新北市',
  'TYC': '桃園市',
  'TXG': '臺中市',
  'TNN': '臺南市',
  'KHH': '高雄市',
  'HSZ': '新竹市',
  'MIA': '苗栗縣',
  'CHA': '彰化縣',
  'NAN': '南投縣',
  'YUN': '雲林縣',
  'CYI': '嘉義市',
  'PIF': '屏東縣',
  'ILA': '宜蘭縣',
  'HUA': '花蓮縣',
  'TTT': '臺東縣'
};

const TaiwanMapPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileWithSkills[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileWithSkills[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithSkills | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countyData, setCountyData] = useState<{id: string; count: number}[]>([]);

  // Load profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // Use the API to fetch public profiles
        const { profiles, error } = await API.teams.getPublicProfiles();
        if (error) throw new Error(error);
        
        setProfiles(profiles);
        setFilteredProfiles(profiles);
        
        // Generate county data
        generateCountyData(profiles);
      } catch (err: any) {
        console.error('Error fetching profiles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);

  // Generate county data for the map - distribute profiles across counties
  const generateCountyData = (profileList: ProfileWithSkills[]) => {
    // Distribute profiles randomly but deterministically across counties
    const countyCounts: Record<string, number> = {};
    
    // Initialize all counties with zero
    COUNTIES.forEach(county => {
      countyCounts[county] = 0;
    });
    
    // Distribute profiles based on display_name's first character
    profileList.forEach(profile => {
      if (profile.display_name) {
        // Use the name's first character code to determine county (deterministic)
        const charCode = profile.display_name.charCodeAt(0);
        const countyIndex = charCode % COUNTIES.length;
        const countyId = COUNTIES[countyIndex];
        
        countyCounts[countyId] = (countyCounts[countyId] || 0) + 1;
      } else {
        // If no display_name, put in Taipei
        countyCounts['TPE'] = (countyCounts['TPE'] || 0) + 1;
      }
    });
    
    // Convert to format needed by TaiwanMap
    const data = Object.keys(countyCounts).map(id => ({
      id,
      count: countyCounts[id]
    }));
    
    setCountyData(data);
  };

  // Filter profiles based on search query and selected county
  useEffect(() => {
    let filtered = [...profiles];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(profile =>
        profile.display_name?.toLowerCase().includes(query) ||
        profile.bio?.toLowerCase().includes(query) ||
        profile.skills.some(skill => skill.name.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected county
    if (selectedCounty) {
      // Filter based on the deterministic county assignment
      filtered = filtered.filter(profile => {
        if (!profile.display_name) return selectedCounty === 'TPE';  // Default to Taipei
        
        const charCode = profile.display_name.charCodeAt(0);
        const countyIndex = charCode % COUNTIES.length;
        const countyId = COUNTIES[countyIndex];
        
        return countyId === selectedCounty;
      });
    }
    
    setFilteredProfiles(filtered);
  }, [profiles, searchQuery, selectedCounty]);

  // Handle county click
  const handleCountyClick = (countyId: string) => {
    if (selectedCounty === countyId) {
      // If clicking the same county, clear the selection
      setSelectedCounty(null);
    } else {
      setSelectedCounty(countyId);
    }
  };

  // Handle profile click
  const handleProfileClick = (profile: ProfileWithSkills) => {
    setSelectedProfile(profile);
  };

  // Calculate user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format skill level to be more readable
  const formatSkillLevel = (level?: string) => {
    if (!level) return '';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // Format goal label to be more readable
  const formatGoalLabel = (goal?: string) => {
    if (!goal) return '';
    
    const goalMap: Record<string, string> = {
      'exploring': '探索中',
      'learning': '學習中',
      'building': '構建專案',
      'collaborating': '尋找合作',
      'mentoring': '指導他人',
      'early_ideation': '早期創意階段',
      'serious_startup': '正式創業'
    };
    
    return goalMap[goal] || goal;
  };
  
  // Get county name for a profile
  const getProfileCounty = (profile: ProfileWithSkills): string => {
    if (!profile.display_name) return COUNTY_NAMES['TPE'];
    
    const charCode = profile.display_name.charCodeAt(0);
    const countyIndex = charCode % COUNTIES.length;
    const countyId = COUNTIES[countyIndex];
    
    return COUNTY_NAMES[countyId] || countyId;
  };
  
  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{ contain: 'content' }}
    >
      <main 
        className="flex-grow py-10"
        style={{ contain: 'content' }}
      >
        <div 
          className="container-custom mx-auto px-4"
          style={{ contain: 'content' }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="gradient-text">台灣社群地圖</span>
          </h1>
          <p className="text-xl text-star-white/80 max-w-2xl mx-auto text-center mb-12">
            探索台灣各地的創作者、開發者和創業者，找到您附近的創新社群
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left sidebar */}
            <div className="lg:w-1/4">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">搜尋創作者</h2>
                  <div className="relative mb-4">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-star-white/50" />
                    <Input
                      type="text"
                      placeholder="搜尋名稱、技能或介紹..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {selectedCounty && (
                    <div className="flex items-center justify-between mb-4 p-2 bg-cosmic-purple/10 rounded-lg">
                      <span>
                        已選擇: <span className="font-medium">{COUNTY_NAMES[selectedCounty] || selectedCounty}</span>
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedCounty(null)}
                        className="p-1 h-auto hover:bg-transparent focus:ring-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    點擊地圖上的縣市來查看該地區的創作者，或使用搜尋功能尋找特定技能
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {selectedCounty ? `${COUNTY_NAMES[selectedCounty] || selectedCounty}創作者` : '創作者列表'}
                    <span className="text-sm font-normal ml-2 text-muted-foreground">
                      ({filteredProfiles.length})
                    </span>
                  </h2>
                  
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      載入中...
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-destructive">
                      發生錯誤: {error}
                    </div>
                  ) : filteredProfiles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      未找到創作者
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {filteredProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center p-3 rounded-lg cursor-pointer mb-2"
                          onClick={() => handleProfileClick(profile)}
                        >
                          <Avatar className="mr-3">
                            <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
                            <AvatarFallback>
                              {getInitials(profile.display_name || 'User')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile.display_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {getProfileCounty(profile)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right content */}
            <div className="lg:w-3/4">
              <Card className="mb-6 bg-transparent border-none shadow-none">
                <CardContent className="pt-0 px-0">
                  <div 
                    className="max-w-3xl mx-auto"
                    style={{ 
                      position: 'relative', 
                      transform: 'none', 
                      transition: 'none',
                      overflow: 'hidden'
                    }}
                  >
                    <TaiwanMap 
                      countyData={countyData} 
                      onCountyClick={handleCountyClick}
                      baseColor="rgba(43, 127, 255, 0.7)"  // stellar-blue
                      hoverColor="#6E3AFF"                 // cosmic-purple
                      activeColor="#00E5B0"                // nova-mint
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Profile modal */}
      {selectedProfile && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedProfile(null)}
        >
          <motion.div 
            className="bg-deep-space border border-cosmic-purple/30 rounded-xl p-6 m-4 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button 
              className="absolute top-4 right-4 hover:bg-transparent focus:ring-0" 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedProfile(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center mb-6">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage 
                  src={selectedProfile.avatar_url || ''} 
                  alt={selectedProfile.display_name || 'User'} 
                />
                <AvatarFallback className="text-xl">
                  {getInitials(selectedProfile.display_name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{selectedProfile.display_name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {getProfileCounty(selectedProfile)}
                  </span>
                  {selectedProfile.skill_level && (
                    <Badge variant="outline" className="text-xs">
                      {formatSkillLevel(selectedProfile.skill_level)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {selectedProfile.bio && (
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-1">自我介紹</h4>
                <p>{selectedProfile.bio}</p>
              </div>
            )}
            
            {selectedProfile.skills && selectedProfile.skills.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-2">技能</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {selectedProfile.goal && (
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-1">目標</h4>
                <Badge variant="outline">{formatGoalLabel(selectedProfile.goal)}</Badge>
              </div>
            )}
            
            {selectedProfile.background_text && (
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-1">背景</h4>
                <p className="text-sm">{selectedProfile.background_text}</p>
              </div>
            )}
            
            {user && (
              <Button className="w-full hover:bg-cosmic-purple focus:ring-0">
                發送合作邀請
              </Button>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaiwanMapPage; 