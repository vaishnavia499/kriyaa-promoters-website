import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ExternalLink, Layers, Navigation, Plus, Minus, RotateCcw } from 'lucide-react';
import { Project } from '../../types';

interface SatelliteMapViewProps {
  project: Project;
}

export const SatelliteMapView: React.FC<SatelliteMapViewProps> = ({ project }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('satellite');

  // Resolve valid coordinates with reliable fallbacks
  const geo = useMemo(() => {
    if (
      project.geoCoordinates &&
      typeof project.geoCoordinates.lat === 'number' &&
      typeof project.geoCoordinates.lng === 'number' &&
      !isNaN(project.geoCoordinates.lat) &&
      !isNaN(project.geoCoordinates.lng) &&
      project.geoCoordinates.lat !== 0 &&
      project.geoCoordinates.lng !== 0
    ) {
      return project.geoCoordinates;
    }
    const loc = `${project.name} ${project.location} ${project.district || ''}`.toLowerCase();
    if (loc.includes('chidambaram')) {
      return { lat: 11.3992, lng: 79.6936 };
    }
    if (loc.includes('pondy') || loc.includes('puducherry') || loc.includes('ecr')) {
      return { lat: 11.9860, lng: 79.8320 };
    }
    // Default: Golden City, NH Bypass Corridor, Cuddalore
    return { lat: 11.7525, lng: 79.7540 };
  }, [project]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up prior map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const { lat, lng } = geo;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Layer 1: Esri World Imagery (Satellite)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
      }
    );

    // Layer 2: OpenStreetMap (Streets)
    const streetsLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });

    if (mapStyle === 'satellite') {
      satelliteLayer.addTo(map);
    } else {
      streetsLayer.addTo(map);
    }

    // Custom pulse marker for layout location
    const customIcon = L.divIcon({
      className: 'custom-pulse-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background-color: rgba(234, 179, 8, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #0B3B24; border: 3px solid #EAB308; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.6);">
            <span style="font-size: 16px;">📍</span>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    const popupHtml = `
      <div style="font-family: system-ui, sans-serif; padding: 6px; min-width: 200px;">
        <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #0B3B24;">${project.name}</h4>
        <p style="margin: 3px 0 6px; font-size: 11px; color: #15803D; font-weight: 700;">${project.dtcpNumber || 'DTCP Approved'}</p>
        <p style="margin: 0 0 6px; font-size: 11px; color: #475569;">${project.location}, ${project.district || 'Tamil Nadu'}</p>
        <div style="font-size: 10px; font-family: monospace; color: #047857; background: #ECFDF5; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px;">
          GPS: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E
        </div>
        <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank" rel="noreferrer" style="display: block; text-align: center; font-size: 11px; font-weight: 700; color: #FFFFFF; background: #15803D; padding: 6px 10px; border-radius: 8px; text-decoration: none;">
          Open in Google Maps ↗
        </a>
      </div>
    `;

    marker.bindPopup(popupHtml).openPopup();

    // Invalidate size on resize/load so map fills container fully
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [geo, project, mapStyle]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    mapInstanceRef.current?.setView([geo.lat, geo.lng], 16);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden select-none bg-slate-950 rounded-2xl border border-slate-200">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-10" />

      {/* Floating HUD: Satellite vs Street Toggle & Project Coordinates */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-white shadow-2xl flex items-center gap-2.5 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">
              {project.name} · Site GPS
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {geo.lat.toFixed(5)}° N, {geo.lng.toFixed(5)}° E
            </span>
          </div>
        </div>

        {/* Style Switcher */}
        <div className="bg-black/85 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-2xl flex items-center gap-1 pointer-events-auto self-start">
          <button
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'satellite'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'streets'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </button>
        </div>
      </div>

      {/* Floating Zoom & Re-Center Controls on Top Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-black/85 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-2xl flex flex-col gap-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#15803D] text-white flex items-center justify-center transition cursor-pointer font-black"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#15803D] text-white flex items-center justify-center transition cursor-pointer font-black"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#EAB308] hover:text-[#0B3B24] text-white flex items-center justify-center transition cursor-pointer"
            title="Re-center on Site"
            aria-label="Re-center on Site"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating External Directions Button on Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <a
          href={`https://maps.google.com/?q=${geo.lat},${geo.lng}`}
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-2 rounded-xl bg-black/85 hover:bg-black text-white text-xs font-bold border border-white/20 flex items-center gap-2 backdrop-blur-md shadow-2xl transition cursor-pointer"
        >
          <span>Open Directions</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#EAB308]" />
        </a>
      </div>
    </div>
  );
};
