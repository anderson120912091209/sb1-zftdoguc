import React from 'react';
import taiwan from '@svg-maps/taiwan';

// Import types from our declaration file
interface Location {
  id: string;
  name: string;
  path: string;
}

interface TaiwanMapProps {
  className?: string;
  // Add county data with user counts
  countyData?: {
    id: string;
    count: number;
  }[];
  onCountyClick?: (countyId: string) => void;
  // New theme props for customization
  baseColor?: string;
  hoverColor?: string;
  activeColor?: string;
}

const TaiwanMap: React.FC<TaiwanMapProps> = ({ 
  className = '', 
  countyData = [],
  onCountyClick,
  // Default to theme colors
  baseColor = 'rgba(43, 127, 255, 0.7)', // stellar-blue
  hoverColor = '#6E3AFF', // cosmic-purple
  activeColor = '#00E5B0' // nova-mint
}) => {
  // Create a lookup for county data
  const countyDataMap = new Map();
  countyData.forEach(county => {
    countyDataMap.set(county.id, county.count);
  });
  
  // Get max count for color scaling
  const maxCount = Math.max(...countyData.map(county => county.count), 1);
  
  // Function to calculate color based on count
  const getCountyFill = (id: string) => {
    const count = countyDataMap.get(id) || 0;
    if (count === 0) return 'rgba(10, 11, 15, 0.3)'; // deep-space with transparency
    
    // Use baseColor with opacity based on count
    const intensity = Math.min(Math.max(count / maxCount, 0.2), 1);
    // Extract RGB components from baseColor
    let color = baseColor;
    
    if (baseColor.startsWith('rgba')) {
      // If it's already rgba, adjust the opacity
      return baseColor.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 
                             `rgba($1,$2,$3,${intensity})`);
    } else if (baseColor.startsWith('rgb')) {
      // If it's rgb, convert to rgba
      return baseColor.replace(/rgb\(([^)]+)\)/, 
                             `rgba($1,${intensity})`);
    } else {
      // For hex or named colors, use as is with opacity
      return `${baseColor}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`;
    }
  };
  
  const handleCountyClick = (event: React.MouseEvent<SVGPathElement>) => {
    if (onCountyClick) {
      const id = event.currentTarget.getAttribute('id') || '';
      onCountyClick(id);
      
      // Highlight the clicked county
      const target = event.currentTarget;
      const originalFill = target.getAttribute('data-original-fill') || '';
      
      // Reset other counties
      document.querySelectorAll('.county').forEach(el => {
        if (el !== target) {
          const origFill = el.getAttribute('data-original-fill');
          if (origFill) (el as SVGPathElement).style.fill = origFill;
        }
      });
      
      // Toggle active state
      if (target.style.fill === activeColor) {
        target.style.fill = originalFill;
      } else {
        target.style.fill = activeColor;
      }
    }
  };
  
  return (
    <div 
      className={`taiwan-map-container ${className}`} 
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <svg 
        viewBox={taiwan.viewBox}
        className="taiwan-map" 
        width="100%" 
        height="100%"
        style={{ 
          background: 'transparent',
          transform: 'none',
          transition: 'none',
          willChange: 'auto',
          display: 'block'
        }}
      >
        {taiwan.locations.map((county: Location) => {
          const fillColor = getCountyFill(county.id);
          return (
            <path
              key={county.id}
              id={county.id}
              d={county.path}
              fill={fillColor}
              data-original-fill={fillColor}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={0.5}
              className="county transition-colors duration-300"
              style={{ transform: 'none' }}
              onClick={handleCountyClick}
              onMouseOver={(e) => {
                e.currentTarget.style.stroke = hoverColor;
                // Apply hover effect
                if (e.currentTarget.style.fill !== activeColor) {
                  e.currentTarget.style.fill = hoverColor;
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.stroke = 'rgba(255, 255, 255, 0.3)';
                // Reset fill if not active
                if (e.currentTarget.style.fill !== activeColor) {
                  const originalFill = e.currentTarget.getAttribute('data-original-fill') || '';
                  e.currentTarget.style.fill = originalFill;
                }
              }}
            >
              <title>
                {county.name}: {countyDataMap.get(county.id) || 0} users
              </title>
            </path>
          );
        })}
      </svg>
    </div>
  );
};

export default TaiwanMap; 