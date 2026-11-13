import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  Navigation,
  Plus,
  Minus,
  RotateCcw,
  Train,
  Plane,
  GraduationCap,
  HeartPulse,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectLandmarksMapProps {
  project: Project;
}

type LandmarkCategory = 'all' | 'transit' | 'education' | 'healthcare';

interface LandmarkItem {
  id: string;
  name: string;
  sub: string;
  dist: string;
  lat: number;
  lng: number;
  category: 'transit' | 'education' | 'healthcare';
  icon: React.ComponentType<{ className?: string }>;
  iconEmoji: string;
  color: string;
}

export const ProjectLandmarksMap: React.FC<ProjectLandmarksMapProps> = ({ project }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [activeCategory, setActiveCategory] = useState<LandmarkCategory>('all');
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

  // Google Maps Full Route URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${siteGeo.lat},${siteGeo.lng}`;

  // 5 Canonical Landmarks from User Screenshots
  const landmarks: LandmarkItem[] = useMemo(() => {
    const { lat, lng } = siteGeo;
    return [
      {
        id: 'lm-ecr',
        name: 'NH–45A / ECR Coastal Corridor',
        sub: 'Major highway arterial access',
        dist: '400 m · 1 min',
        lat: lat + 0.0035,
        lng: lng + 0.0028,
        category: 'transit',
        icon: Navigation,
        iconEmoji: '🛣️',
        color: '#15803D',
      },
      {
        id: 'lm-railway',
        name: 'Cuddalore Port Junction',
        sub: 'Main Southern Railway station',
        dist: '4.2 km · 8 mins',
        lat: lat - 0.0085,
        lng: lng + 0.012,
        category: 'transit',
        icon: Train,
        iconEmoji: '🚆',
        color: '#B45309',
      },
      {
        id: 'lm-college',
        name: 'Periyar Arts & Science College',
        sub: 'Higher education centre',
        dist: '1.0 km · 2 mins',
        lat: lat + 0.006,
        lng: lng - 0.004,
        category: 'education',
        icon: GraduationCap,
        iconEmoji: '🎓',
        color: '#2563EB',
      },
      {
        id: 'lm-hospital',
        name: 'Government District Hospital',
        sub: '24/7 Multi-specialty healthcare',
        dist: '3.5 km · 7 mins',
        lat: lat - 0.006,
        lng: lng - 0.008,
        category: 'healthcare',
        icon: HeartPulse,
        iconEmoji: '🏥',
        color: '#DC2626',
      },
      {
        id: 'lm-airport',
        name: 'Pondicherry Airport Route',
        sub: 'Direct regional flight access',
        dist: '24 km · 35 mins',
        lat: lat + 0.015,
        lng: lng + 0.018,
        category: 'transit',
        icon: Plane,
        iconEmoji: '✈️',
        color: '#0D9488',
      },
    ];
  }, [siteGeo]);

  // Filtered landmarks based on category
  const visibleLandmarks = useMemo(() => {
    if (activeCategory === 'all') return landmarks;
    return landmarks.filter((lm) => lm.category === activeCategory);
  }, [landmarks, activeCategory]);

  // Initialize Map
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

    // 1. Primary Site Marker (Gold / Forest Green with pulse)
    const siteIcon = L.divIcon({
      className: 'site-marker-icon',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background-color: rgba(234, 179, 8, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #0B3B24; border: 3px solid #EAB308; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.45);">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #EAB308;"></div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });

    const siteMarker = L.marker([lat, lng], { icon: siteIcon }).addTo(map);
    siteMarker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
        <span style="display: inline-block; background: #0B3B24; color: #EAB308; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">TOWNSHIP ENTRANCE</span>
        <h4 style="margin: 0; font-size: 13px; font-weight: 900; color: #0B3B24;">${project.name}</h4>
        <p style="margin: 2px 0 0; font-size: 11px; color: #64748B;">${project.location}, ${project.district || 'Tamil Nadu'}</p>
      </div>
    `);

    // 2. Landmark Markers
    markersRef.current = {};
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
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 3px;">
            <span style="font-size: 12px; font-weight: 800; color: #0F172A;">${lm.name}</span>
          </div>
          <span style="background: ${lm.color}15; color: ${lm.color}; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 3px;">${lm.dist}</span>
          <p style="margin: 0; font-size: 10px; color: #64748B; line-height: 1.3;">${lm.sub}</p>
        </div>
      `);

      lmMarker.on('click', () => {
        handleSelectLandmark(lm);
      });

      markersRef.current[lm.id] = lmMarker;
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      routeLayerRef.current = null;
    };
  }, [siteGeo, landmarks, project, mapStyle]);

  // Handle selecting landmark: flies to it and draws route line
  const handleSelectLandmark = (lm: LandmarkItem) => {
    setActiveLandmarkId(lm.id);
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous route line
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // Draw dashed connecting route line between site entrance and landmark
    const route = L.polyline(
      [
        [siteGeo.lat, siteGeo.lng],
        [lm.lat, lm.lng],
      ],
      {
        color: '#0B3B24',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.85,
      }
    ).addTo(map);
    routeLayerRef.current = route;

    // Fit bounds to show both site entrance and landmark nicely
    map.fitBounds(
      [
        [siteGeo.lat, siteGeo.lng],
        [lm.lat, lm.lng],
      ],
      {
        padding: [60, 60],
        maxZoom: 16,
      }
    );

    // Open popup
    const marker = markersRef.current[lm.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    setActiveLandmarkId(null);
    if (routeLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    mapInstanceRef.current?.setView([siteGeo.lat, siteGeo.lng], 15);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header: Site Location & Proximity Map (Matches Image 2) */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0B3B24] tracking-tight">
          Site Location &amp; Proximity Map
        </h3>
      </div>

      {/* 2. Map Canvas with Controls, "Open Full Route" button & "Golden City Township Entrance" pill */}
      <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-[#F1F5F2]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top-Right: Open Full Route Button (Matches Image 2) */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-20 px-3.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#0B3B24] border border-slate-200/90 shadow-md flex items-center gap-1.5 text-xs font-black transition active:scale-95 cursor-pointer pointer-events-auto group"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#0B3B24] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Open Full Route</span>
        </a>

        {/* Floating Map Style Switcher (Street / Satellite) & Zoom Controls */}
        <div className="absolute top-14 right-3 z-20 flex flex-col gap-1.5 shadow-md pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-xs flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setMapStyle((s) => (s === 'streets' ? 'satellite' : 'streets'))}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#15803D] hover:text-white text-slate-800 flex items-center justify-center transition cursor-pointer"
              title={mapStyle === 'streets' ? 'Switch to Satellite' : 'Switch to Map'}
              aria-label="Toggle Satellite"
            >
              <Layers className="w-4 h-4" />
            </button>
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
              title="Re-center on Site"
              aria-label="Re-center on Site"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom-Left: Golden City Township Entrance Pill (Matches Image 2) */}
        <div className="absolute bottom-3 left-3 z-20 px-3.5 py-1.5 rounded-full bg-[#0B3B24]/95 backdrop-blur-xs text-white text-xs font-bold border border-emerald-700/60 shadow-lg flex items-center gap-2 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] inline-block shadow-xs shrink-0" />
          <span>{project.name} Township Entrance</span>
        </div>
      </div>

      {/* 3. Category Filter Buttons: All Points | Transit | Education | Healthcare (Matches Image 2) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {[
          { id: 'all', label: 'All Points' },
          { id: 'transit', label: 'Transit' },
          { id: 'education', label: 'Education' },
          { id: 'healthcare', label: 'Healthcare' },
        ].map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id as LandmarkCategory);
                setActiveLandmarkId(null);
                if (routeLayerRef.current && mapInstanceRef.current) {
                  mapInstanceRef.current.removeLayer(routeLayerRef.current);
                  routeLayerRef.current = null;
                }
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm transition cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[#0B3B24] text-white font-black shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold border border-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Nearby Places Landmark Cards (Matches Images 2 & 3) */}
      <div className="space-y-3 pt-1">
        {visibleLandmarks.map((lm) => {
          const Icon = lm.icon;
          const isSelected = activeLandmarkId === lm.id;

          return (
            <div
              key={lm.id}
              onClick={() => handleSelectLandmark(lm)}
              className={`group rounded-2xl sm:rounded-3xl border p-3.5 sm:p-4 bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-[#0B3B24] ring-2 ring-[#0B3B24]/20 bg-emerald-50/20'
                  : 'border-slate-200/90 hover:border-emerald-700/40'
              }`}
            >
              {/* Left: Round Category Icon + Titles */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isSelected
                      ? 'bg-[#0B3B24] text-[#EAB308] border-[#0B3B24]'
                      : 'bg-slate-50 text-[#0B3B24] border-slate-200/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-black text-[#0B3B24] leading-tight truncate">
                    {lm.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                    {lm.sub}
                  </p>
                </div>
              </div>

              {/* Right: Gold Badge with Distance & Duration */}
              <div className="px-3.5 py-1.5 rounded-xl sm:rounded-full bg-[#FEF9C3]/50 border border-[#EAB308]/60 text-[#CA8A04] text-xs sm:text-sm font-black whitespace-nowrap shrink-0 shadow-2xs">
                {lm.dist}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
