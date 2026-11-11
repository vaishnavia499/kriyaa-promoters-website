import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Navigation,
  Plus,
  Minus,
  RotateCcw,
  Train,
  Plane,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectLandmarksMapProps {
  project: Project;
}

interface LandmarkPoint {
  id: string;
  name: string;
  sub: string;
  dist: string;
  lat: number;
  lng: number;
  category: 'highway' | 'railway' | 'airport' | 'education' | 'hospital' | 'shopping';
  iconEmoji: string;
  color: string;
}

export const ProjectLandmarksMap: React.FC<ProjectLandmarksMapProps> = ({ project }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('streets');
  const [activeLandmarkId, setActiveLandmarkId] = useState<string | null>(null);

  // Center Coordinates for Site
  const siteGeo = useMemo(() => {
    if (
      project.geoCoordinates &&
      typeof project.geoCoordinates.lat === 'number' &&
      typeof project.geoCoordinates.lng === 'number' &&
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
    return { lat: 11.7525, lng: 79.7540 };
  }, [project]);

  // Nearby Landmarks calculated around the site
  const landmarks: LandmarkPoint[] = useMemo(() => {
    const { lat, lng } = siteGeo;
    return [
      {
        id: 'lm-highway',
        name: 'NH-45A / ECR Coastal Corridor',
        sub: 'Rapid seamless access to arterial highway connecting Puducherry & Chidambaram',
        dist: '400 m (1 min)',
        lat: lat + 0.0035,
        lng: lng + 0.0028,
        category: 'highway',
        iconEmoji: '🛣️',
        color: '#15803D',
      },
      {
        id: 'lm-railway',
        name: 'Cuddalore Port Junction Rwy Station',
        sub: 'Main Southern Railway junction with express trains to Chennai & Tiruchirappalli',
        dist: '4.2 km (8 mins)',
        lat: lat - 0.0085,
        lng: lng + 0.012,
        category: 'railway',
        iconEmoji: '🚆',
        color: '#B45309',
      },
      {
        id: 'lm-education',
        name: 'Periyar Arts & Science College / Schools',
        sub: "St. Joseph's Hr. Sec., Krishnasamy Memorial School & Periyar Arts College",
        dist: '1.0 km (2 mins)',
        lat: lat + 0.006,
        lng: lng - 0.004,
        category: 'education',
        iconEmoji: '🎓',
        color: '#2563EB',
      },
      {
        id: 'lm-hospital',
        name: 'Government Hospital & Healthcare',
        sub: 'Government General Hospital, Krishna Hospital & 24x7 Multi-Specialty Clinics',
        dist: '3.5 km (6 mins)',
        lat: lat - 0.006,
        lng: lng - 0.008,
        category: 'hospital',
        iconEmoji: '🏥',
        color: '#DC2626',
      },
      {
        id: 'lm-shopping',
        name: 'AR Shopping Mall & Commercial Hub',
        sub: 'AR Shopping Mall, Imperial Road Daily Produce Market & Banking Hubs',
        dist: '3.8 km (7 mins)',
        lat: lat - 0.004,
        lng: lng + 0.009,
        category: 'shopping',
        iconEmoji: '🛍️',
        color: '#D97706',
      },
      {
        id: 'lm-airport',
        name: 'Pondicherry Airport Route',
        sub: 'Pondicherry Airport (24 km · 35 mins) & Chennai International Airport (180 km)',
        dist: '24 km (35 mins)',
        lat: lat + 0.015,
        lng: lng + 0.018,
        category: 'airport',
        iconEmoji: '✈️',
        color: '#0D9488',
      },
    ];
  }, [siteGeo]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const { lat, lng } = siteGeo;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Tile Layers
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );
    const streetsLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });

    if (mapStyle === 'satellite') {
      satelliteLayer.addTo(map);
    } else {
      streetsLayer.addTo(map);
    }

    // 1. Primary Site Marker (Gold / Forest Green)
    const siteIcon = L.divIcon({
      className: 'site-marker-icon',
      html: `
        <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background-color: rgba(234, 179, 8, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 36px; height: 36px; border-radius: 50%; background-color: #0B3B24; border: 3px solid #EAB308; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
            <span style="font-size: 18px;">⭐</span>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });

    const siteMarker = L.marker([lat, lng], { icon: siteIcon }).addTo(map);
    siteMarker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 190px;">
        <span style="display: inline-block; background: #0B3B24; color: #EAB308; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">SITE LOCATION</span>
        <h4 style="margin: 0; font-size: 14px; font-weight: 900; color: #0B3B24;">${project.name}</h4>
        <p style="margin: 2px 0 4px; font-size: 11px; color: #15803D; font-weight: 700;">${project.dtcpNumber || 'DTCP Sanctioned Layout'}</p>
        <p style="margin: 0 0 6px; font-size: 10px; color: #64748B;">${project.location}, ${project.district || 'Tamil Nadu'}</p>
        <div style="font-size: 9px; font-family: monospace; color: #047857; background: #ECFDF5; padding: 3px 6px; border-radius: 6px;">
          GPS: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E
        </div>
      </div>
    `);

    // 2. Add Landmark Markers
    landmarks.forEach((lm) => {
      const lmIcon = L.divIcon({
        className: 'landmark-marker-icon',
        html: `
          <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background-color: #FFFFFF; border: 2.5px solid ${lm.color}; box-shadow: 0 3px 10px rgba(0,0,0,0.3); cursor: pointer;">
            <span style="font-size: 14px;">${lm.iconEmoji}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const lmMarker = L.marker([lm.lat, lm.lng], { icon: lmIcon }).addTo(map);
      lmMarker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 190px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
            <span style="font-size: 12px; font-weight: 800; color: #0F172A;">${lm.name}</span>
            <span style="background: ${lm.color}15; color: ${lm.color}; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; white-space: nowrap;">${lm.dist}</span>
          </div>
          <p style="margin: 0; font-size: 10px; color: #64748B; line-height: 1.3;">${lm.sub}</p>
        </div>
      `);

      lmMarker.on('click', () => {
        setActiveLandmarkId(lm.id);
      });
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [siteGeo, landmarks, project, mapStyle]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    mapInstanceRef.current?.setView([siteGeo.lat, siteGeo.lng], 15);
    setActiveLandmarkId(null);
  };

  const handleFocusLandmark = (lm: LandmarkPoint) => {
    setActiveLandmarkId(lm.id);
    mapInstanceRef.current?.flyTo([lm.lat, lm.lng], 16, { duration: 0.8 });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Site Location &amp; Landmark Connectivity Map
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 text-[10px] font-black uppercase">
              Live GPS View
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Explore {project.name}&apos;s proximity to transit corridors, healthcare, and educational hubs.
          </p>
        </div>

        {/* Style Switcher & Zoom Controls Header */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setMapStyle('streets')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                mapStyle === 'streets'
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>Map</span>
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                mapStyle === 'satellite'
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Satellite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Zoom & Re-Center Buttons on Top Right */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 shadow-lg pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-md flex flex-col gap-1">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#15803D] hover:text-white text-slate-800 flex items-center justify-center transition cursor-pointer font-black"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#15803D] hover:text-white text-slate-800 flex items-center justify-center transition cursor-pointer font-black"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#EAB308] hover:text-[#0B3B24] text-slate-800 flex items-center justify-center transition cursor-pointer"
              title="Re-center on Golden City Site"
              aria-label="Re-center on Golden City Site"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-md flex items-center gap-2 pointer-events-none text-[11px] font-bold text-slate-700">
          <span className="w-3 h-3 rounded-full bg-[#0B3B24] border-2 border-[#EAB308] inline-block" />
          <span>{project.name} (Site Location)</span>
        </div>
      </div>

      {/* Quick Interactive Landmark Jump Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Jump:</span>
        {landmarks.map((lm) => (
          <button
            key={lm.id}
            type="button"
            onClick={() => handleFocusLandmark(lm)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              activeLandmarkId === lm.id
                ? 'bg-[#0B3B24] text-white border-[#0B3B24] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{lm.iconEmoji}</span>
            <span>{lm.name.split('/')[0].split('(')[0].trim()}</span>
            <span className="text-[10px] opacity-75 font-mono">({lm.dist.split('(')[0].trim()})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
