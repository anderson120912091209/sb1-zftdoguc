import React from 'react';
import { REGIONS, RegionData, UserData } from './mockData';
import { motion } from 'framer-motion';

interface TaiwanSVGProps {
  selectedRegion: string | null;
  onRegionClick: (regionId: string, regionData: RegionData) => void;
  displayMode: 'default' | 'heatmap';
  users: UserData[];
  onUserPinClick: (user: UserData) => void;
}

const TaiwanSVG: React.FC<TaiwanSVGProps> = ({ 
  selectedRegion, 
  onRegionClick, 
  displayMode,
  users,
  onUserPinClick 
}) => {
  // Get user counts per region for heatmap
  const userCountByRegion: Record<string, number> = {};
  users.forEach(user => {
    userCountByRegion[user.city] = (userCountByRegion[user.city] || 0) + 1;
  });
  
  // Find max count for scaling the heatmap intensity
  const maxUsers = Math.max(...Object.values(userCountByRegion), 1);
  
  return (
    <svg
      viewBox="0 0 400 600"
      width="400"
      height="600"
      style={{ margin: '0 auto', display: 'block' }}
    >
      {/* Main Island Outline */}
      <path
        d="M200,100 Q300,150 320,250 Q330,350 280,450 Q230,530 180,500 Q120,480 100,400 Q80,300 120,200 Q150,120 200,100 Z"
        fill="none"
        stroke="#6E3AFF"
        strokeWidth="2"
        strokeDasharray="5,5"
      />

      {/* Regions */}
      {Object.entries(REGIONS).map(([regionId, regionData]) => {
        // Calculate heatmap color intensity based on user count
        const userCount = userCountByRegion[regionId] || 0;
        const intensity = displayMode === 'heatmap' 
          ? Math.max(0.1, Math.min(0.8, userCount / maxUsers))
          : 0.2;
          
        let fillColor = regionData.color;
        
        if (displayMode === 'heatmap') {
          // For heatmap, use different intensities of red
          const heatIntensity = Math.floor(intensity * 255);
          fillColor = `rgba(255, ${255 - heatIntensity}, ${255 - heatIntensity}, ${intensity + 0.1})`;
        }
        
        return (
          <motion.path
            key={regionId}
            d={regionData.path}
            fill={fillColor}
            stroke={selectedRegion === regionId ? "#fff" : "rgba(255,255,255,0.5)"}
            strokeWidth={selectedRegion === regionId ? 2 : 1}
            whileHover={{ 
              fill: displayMode === 'default' ? regionData.hoverColor : fillColor,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            onClick={() => onRegionClick(regionId, regionData)}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        );
      })}
      
      {/* Region Labels */}
      {Object.entries(REGIONS).map(([regionId, regionData]) => (
        <text
          key={`label-${regionId}`}
          x={regionData.center.x}
          y={regionData.center.y}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          {regionId}
        </text>
      ))}
      
      {/* User Pins */}
      {users.map((user) => {
        const region = REGIONS[user.city];
        if (!region) return null;
        
        // Randomize position a bit within the region
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        
        return (
          <motion.g
            key={user.id}
            onClick={(e) => {
              e.stopPropagation();
              onUserPinClick(user);
            }}
            whileHover={{ scale: 1.2 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, delay: Math.random() * 0.3 }}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={region.center.x + offsetX}
              cy={region.center.y + offsetY}
              r={6}
              fill="#2B7FFF"
              stroke="white"
              strokeWidth={1.5}
            />
            <circle
              cx={region.center.x + offsetX}
              cy={region.center.y + offsetY}
              r={10}
              fill="rgba(43, 127, 255, 0.3)"
              strokeWidth={0}
            >
              <animate
                attributeName="r"
                values="10;15;10"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </motion.g>
        );
      })}
    </svg>
  );
};

export default TaiwanSVG; 