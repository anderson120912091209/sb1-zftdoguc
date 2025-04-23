// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import { geoOrthographic, geoPath } from 'd3-geo';
// import { feature } from 'topojson-client';
// import { UserData } from './mockData';


// interface SphereMapProps {
//   users: UserData[];
//   selectedRegion: string | null;
//   onRegionClick: (regionId: string, center: { x: number, y: number }) => void;
//   onUserPinClick: (user: UserData) => void;
// }

// interface TopoJSONFeature {
//   type: string;
//   geometry: any;
//   properties: {
//     NAME_1?: string;
//     [key: string]: any;
//   };
// }

// const SphereMap: React.FC<SphereMapProps> = ({ 
//   users, 
//   selectedRegion, 
//   onRegionClick, 
//   onUserPinClick 
// }) => {
//   const svgRef = useRef<SVGSVGElement>(null);
//   const width = 600;
//   const height = 600;
//   const initialScale = 6000;
//   const sensitivity = 75;
  
//   useEffect(() => {
//     if (!svgRef.current) return;
    
//     const svg = d3.select(svgRef.current);
    
//     // Clear previous content
//     svg.selectAll('*').remove();

//     // Define the projection
//     const projection = geoOrthographic()
//       .scale(initialScale)
//       .translate([width / 2, height / 2])
//       .center([121, 23.5]) // Taiwan's approximate center
//       .rotate([-121, -23.5, 0]);
    
//     // Create the path generator
//     const path = geoPath().projection(projection);
    
//     // Create the main group
//     const g = svg.append('g');
    
//     // Add a blue background circle
//     g.append('circle')
//       .attr('cx', width / 2)
//       .attr('cy', height / 2)
//       .attr('r', initialScale / 10)
//       .attr('class', 'ocean')
//       .attr('fill', 'rgba(43, 127, 255, 0.5)');
      
//     // Add rotation and zooming capabilities
//     let rotateX = -121;
//     let rotateY = -23.5;
//     let currentScale = initialScale;
    
//     const zoom = d3.zoom()
//       .scaleExtent([0.5, 8])
//       .on('zoom', (event) => {
//         currentScale = initialScale * event.transform.k;
//         projection.scale(currentScale);
//         g.selectAll('path').attr('d', path as any);
//         g.selectAll('.user-pin').attr('transform', (d: any) => {
//           const coords = projection([d.lon, d.lat]) || [0, 0];
//           return `translate(${coords[0]},${coords[1]})`;
//         });
//       });
    
//     svg.call(zoom as any);
    
//     // Handle drag to rotate the globe
//     const drag = d3.drag()
//       .on('drag', (event) => {
//         rotateX += event.dx / sensitivity;
//         rotateY -= event.dy / sensitivity;
//         rotateY = Math.max(-90, Math.min(90, rotateY));
        
//         projection.rotate([rotateX, rotateY, 0]);
//         g.selectAll('path').attr('d', path as any);
//         g.selectAll('.user-pin').attr('transform', (d: any) => {
//           const coords = projection([d.lon, d.lat]) || [0, 0];
//           return `translate(${coords[0]},${coords[1]})`;
//         });
//       });
    
//     svg.call(drag as any);
    
//     // Load Taiwan TopoJSON data
//     const fetchMapData = async () => {
//       try {
//         // Fetch Taiwan TopoJSON data from public folder
//         const response = await fetch('/taiwan-topo.json');
//         const data = await response.json();
        
//         // Convert TopoJSON to GeoJSON
//         const taiwanFeatures = feature(data, data.objects.counties) as any;
        
//         // Draw the map
//         g.selectAll('.region')
//           .data(taiwanFeatures.features)
//           .enter()
//           .append('path')
//           .attr('class', 'region')
//           .attr('d', path as any)
//           .attr('fill', (d: TopoJSONFeature) => {
//             // Check if this is the selected region
//             return selectedRegion === d.properties.NAME_1 
//               ? 'rgba(110, 58, 255, 0.7)' 
//               : 'rgba(110, 58, 255, 0.3)';
//           })
//           .attr('stroke', '#fff')
//           .attr('stroke-width', 0.5)
//           .on('mouseover', function() {
//             d3.select(this)
//               .attr('fill', 'rgba(110, 58, 255, 0.5)');
//           })
//           .on('mouseout', function(_, d: any) {
//             d3.select(this)
//               .attr('fill', selectedRegion === d.properties.NAME_1 
//                 ? 'rgba(110, 58, 255, 0.7)' 
//                 : 'rgba(110, 58, 255, 0.3)');
//           })
//           .on('click', (_, d: any) => {
//             const regionName = d.properties.NAME_1;
//             const centroid = path.centroid(d);
//             onRegionClick(regionName, { x: centroid[0], y: centroid[1] });
//           });
          
//         // Add region labels
//         g.selectAll('.region-label')
//           .data(taiwanFeatures.features)
//           .enter()
//           .append('text')
//           .attr('class', 'region-label')
//           .attr('transform', (d: any) => {
//             const centroid = path.centroid(d);
//             return `translate(${centroid[0]},${centroid[1]})`;
//           })
//           .attr('text-anchor', 'middle')
//           .attr('fill', 'white')
//           .attr('font-size', '8px')
//           .attr('font-weight', 'bold')
//           .text((d: TopoJSONFeature) => d.properties.NAME_1);
          
//         // Place user pins on the map
//         const userPins = g.selectAll('.user-pin')
//           .data(users)
//           .enter()
//           .append('g')
//           .attr('class', 'user-pin')
//           .attr('transform', (d: any) => {
//             // Convert city name to approx. longitude/latitude
//             // This is a simplified mapping - in a real app, you'd use proper geocoding
//             let lon = 121, lat = 23.5;
            
//             // Very rough approximation of city coordinates
//             switch(d.city) {
//               case '台北': lon = 121.5; lat = 25.0; break;
//               case '新北': lon = 121.6; lat = 25.1; break;
//               case '桃園': lon = 121.3; lat = 24.9; break;
//               case '新竹': lon = 120.9; lat = 24.8; break;
//               case '苗栗': lon = 120.8; lat = 24.5; break;
//               case '台中': lon = 120.7; lat = 24.1; break;
//               case '彰化': lon = 120.5; lat = 24.0; break;
//               case '南投': lon = 120.9; lat = 23.9; break;
//               case '雲林': lon = 120.5; lat = 23.7; break;
//               case '嘉義': lon = 120.4; lat = 23.5; break;
//               case '台南': lon = 120.2; lat = 23.0; break;
//               case '高雄': lon = 120.3; lat = 22.6; break;
//               case '屏東': lon = 120.5; lat = 22.7; break;
//               case '宜蘭': lon = 121.7; lat = 24.7; break;
//               case '花蓮': lon = 121.6; lat = 23.9; break;
//               case '台東': lon = 121.1; lat = 22.7; break;
//             }
            
//             // Store lon/lat on the data object for drag updates
//             (d as any).lon = lon;
//             (d as any).lat = lat;
            
//             const coords = projection([lon, lat]) || [0, 0];
//             return `translate(${coords[0]},${coords[1]})`;
//           })
//           .on('click', (_, d) => {
//             onUserPinClick(d);
//           });
          
//         // Add a circle for each user
//         userPins.append('circle')
//           .attr('r', 4)
//           .attr('fill', '#2B7FFF')
//           .attr('stroke', 'white')
//           .attr('stroke-width', 1.5);
          
//         // Add a pulsing effect
//         userPins.append('circle')
//           .attr('r', 8)
//           .attr('fill', 'rgba(43, 127, 255, 0.3)')
//           .attr('stroke-width', 0)
//           .append('animate')
//           .attr('attributeName', 'r')
//           .attr('values', '8;12;8')
//           .attr('dur', '3s')
//           .attr('repeatCount', 'indefinite')
//           .append('animate')
//           .attr('attributeName', 'opacity')
//           .attr('values', '0.3;0.1;0.3')
//           .attr('dur', '3s')
//           .attr('repeatCount', 'indefinite');
          
//       } catch (error) {
//         console.error('Error loading Taiwan map data:', error);
//       }
//     };
    
//     fetchMapData();
    
//     // Cleanup
//     return () => {
//       svg.selectAll('*').remove();
//     };
//   }, [users, selectedRegion, onRegionClick, onUserPinClick]);
  
//   return (
//     <div className="d3-map-container relative w-full h-full flex items-center justify-center">
//       <svg 
//         ref={svgRef} 
//         width={width} 
//         height={height} 
//         viewBox={`0 0 ${width} ${height}`}
//         className="max-w-full max-h-full"
//       />
//       <div className="absolute bottom-4 left-4 text-xs text-star-white/60">
//         拖曳旋轉 - 滾輪縮放
//       </div>
//     </div>
//   );
// };

// export default SphereMap; 