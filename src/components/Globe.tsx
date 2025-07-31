import React, { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';

declare global {
  interface Window {
    Globe: any;
    topojson: any;
  }
}

const Globe = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstance = useRef<any>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // Load globe.gl script
    const script1 = document.createElement('script');
    script1.src = 'https://unpkg.com/globe.gl@2.34.0/dist/globe.gl.min.js';
    document.head.appendChild(script1);

    // Load topojson script
    const script2 = document.createElement('script');
    script2.src = 'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js';
    document.head.appendChild(script2);

    script1.onload = () => {
      // Chicago location and Chicagoland area
      const chicago = { lat: 41.8781, lng: -87.6298 };
      const chicagolandArea = [
        { lat: 42.0647, lng: -87.9073 }, // Northwest
        { lat: 42.0647, lng: -87.5240 }, // Northeast  
        { lat: 41.6444, lng: -87.5240 }, // Southeast
        { lat: 41.6444, lng: -87.9073 }, // Southwest
        { lat: 42.0647, lng: -87.9073 }  // Close polygon
      ];

      // For the US outline, we use a GeoJSON path of the US mainland.
      const usGeoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

      // Globe rendering
      const globe = window.Globe()(globeRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .backgroundColor('rgba(0,0,0,0)')
        .showGraticules(false)
        .width(370)
        .height(370);

      globeInstance.current = globe;

      // High-res globe
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.7;
      globe.pointOfView({lat: chicago.lat, lng: chicago.lng, altitude: 0.8}, 0);

      // Load and add USA highlighting
      fetch(usGeoUrl)
        .then(response => response.json())
        .then(usData => {
          const contiguousGeometries = usData.objects.states.geometries.filter(
            d => d.id !== '02' && d.id !== '15'
          );
      
          const mergedGeometry = window.topojson.merge(usData, contiguousGeometries);
      
          const mergedFeature = {
            type: "Feature",
            geometry: mergedGeometry,
            properties: { name: "Contiguous US" }
          };
      
          globe.polygonsData([mergedFeature])
            .polygonCapColor(() => 'rgba(59, 130, 246, 0.4)') // Very light blue fill
            .polygonSideColor(() => 'rgba(59, 130, 246, 0.05)')
            .polygonStrokeColor(() => 'rgba(59, 130, 246, 1)') // Bright light blue border
            .polygonAltitude(() => 0.005)
            .polygonStrokeWidth(() => 2) // Thicker stroke for better visibility
            .polygonsTransitionDuration(800);
        })
        .catch(error => {
          console.log('Could not load US data:', error);
        });

      // Add Chicago marker
      globe
        .labelsData([{
          lat: chicago.lat,
          lng: chicago.lng,
          label: 'Chicago, IL',
          size: 1.4,
          color: 'hsl(var(--primary))'
        }])
        .labelLat((d: any) => d.lat)
        .labelLng((d: any) => d.lng)
        .labelText((d: any) => d.label)
        .labelColor(() => 'hsl(var(--primary))')
        .labelDotRadius(0.72)
        .labelResolution(3)
        .labelAltitude(0.015)
        .labelSize((d: any) => 1.22)
        .labelType('dot')
        .labelLabel((d: any) => `
          <div style="font-weight:600;color:hsl(var(--primary));font-size:1.03em;filter:drop-shadow(0 1px 6px #000)">
          ${d.label}
          </div>
          <div style="color:hsl(var(--muted-foreground));font-size:0.92em">Headquarters</div>
        `);

      // Add Chicagoland area highlight
      const chicagolandPolygon = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [chicagolandArea.map(point => [point.lng, point.lat])]
        },
        properties: { name: "Chicagoland" }
      };

      globe.polygonsData([chicagolandPolygon])
        .polygonCapColor(() => 'rgba(34, 197, 94, 0.25)')
        .polygonSideColor(() => 'rgba(34, 197, 94, 0.15)')
        .polygonStrokeColor(() => 'rgb(34, 197, 94)')
        .polygonLabel(() => `<div style="font-weight:600;color:rgb(34, 197, 94);font-size:1.06em;filter:drop-shadow(0 1px 6px #000)">Chicagoland Area</div>`)
        .polygonAltitude(() => 0.01)
        .polygonStrokeWidth(() => 2)
        .polygonsTransitionDuration(600);

      // Animate a glowing effect by pulsing the stroke width
      let increasing = true;
      let width = 2;
      setInterval(() => {
        if (increasing) width += 0.1;
        else width -= 0.1;
        if (width > 3) increasing = false;
        if (width < 2) increasing = true;
        globe.polygonStrokeWidth(() => width);
      }, 100);
    };

    return () => {
      // Cleanup
      if (globeInstance.current) {
        globeInstance.current = null;
      }
    };
  }, []);


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg relative overflow-visible animate-fade-in">
        <div className="relative">
          <div 
            ref={globeRef}
            className="w-full h-[370px] bg-background rounded-full border border-border shadow-inner flex items-center justify-center overflow-visible"
          />
          
          {/* Globe outline */}
          <div className="absolute inset-0 w-full h-full border-2 border-primary/20 rounded-full shadow-[0_0_24px_0_hsl(var(--primary)/0.3)] opacity-35 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default Globe;