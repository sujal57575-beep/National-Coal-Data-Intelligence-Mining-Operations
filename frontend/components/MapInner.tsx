'use client';
/**
 * MapInner.tsx — loaded ONLY on client (no SSR) via next/dynamic
 * Uses: Leaflet + OpenStreetMap (free, no key) + Nominatim + Overpass + Open-Meteo
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  geocodePlace,
  getMineWeather,
  getAirQuality,
  fetchMineLocationsOSM,
  NominatimResult,
  WeatherData,
  AirQualityData,
} from '../services/apiService';
import {
  Search, Layers, MapPin, Filter, Thermometer, Wind, Cloud,
  Loader2, Info, TrendingUp, BarChart3, Maximize2, Minimize2, X
} from 'lucide-react';

/* ── Fix Leaflet's broken webpack icon paths ─────────────── */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ── Data ────────────────────────────────────────────────── */
const TILE_LAYERS = [
  { id: 'osm', label: 'Street (OSM)', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attr: '&copy; OpenStreetMap contributors' },
  { id: 'sat', label: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '&copy; Esri World Imagery' },
  { id: 'topo', label: 'Topography', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr: '&copy; OpenTopoMap' },
  { id: 'dark', label: 'Carto Voyager', url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attr: '&copy; CARTO' },
];

const COAL_FIELDS = [
  { name: 'Jharia', state: 'Jharkhand', lat: 23.75, lon: 86.42, resources_mt: 42000, pct: 10.48, sub: 'BCCL', color: '#ef4444', fields: ['Jharia', 'Bokaro', 'Karanpura'] },
  { name: 'Talcher', state: 'Odisha', lat: 20.95, lon: 85.22, resources_mt: 55000, pct: 13.73, sub: 'MCL', color: '#10b981', fields: ['Talcher'] },
  { name: 'Ib Valley', state: 'Odisha', lat: 21.82, lon: 83.81, resources_mt: 45000, pct: 11.23, sub: 'MCL', color: '#059669', fields: ['Ib Valley'] },
  { name: 'Korba', state: 'Chhattisgarh', lat: 22.36, lon: 82.69, resources_mt: 38000, pct: 9.49, sub: 'SECL', color: '#f59e0b', fields: ['Korba', 'Hasdeo-Arand'] },
  { name: 'Singrauli', state: 'MP', lat: 24.20, lon: 82.66, resources_mt: 18000, pct: 4.50, sub: 'NCL', color: '#6366f1', fields: ['Singrauli'] },
  { name: 'Raniganj', state: 'West Bengal', lat: 23.62, lon: 87.13, resources_mt: 28000, pct: 6.99, sub: 'ECL', color: '#8b5cf6', fields: ['Raniganj', 'Birbhum'] },
  { name: 'Godavari Valley', state: 'Telangana', lat: 17.97, lon: 79.57, resources_mt: 23000, pct: 5.74, sub: 'SCCL', color: '#06b6d4', fields: ['Godavari Valley'] },
  { name: 'Wardha Valley', state: 'Maharashtra', lat: 20.47, lon: 78.95, resources_mt: 12000, pct: 2.99, sub: 'WCL', color: '#14b8a6', fields: ['Wardha Valley'] },
  { name: 'Rajmahal', state: 'Jharkhand', lat: 24.49, lon: 87.55, resources_mt: 12000, pct: 2.99, sub: 'ECL', color: '#a78bfa', fields: ['Rajmahal'] },
  { name: 'Mand-Raigarh', state: 'Chhattisgarh', lat: 21.90, lon: 83.40, resources_mt: 14000, pct: 3.49, sub: 'SECL', color: '#fbbf24', fields: ['Mand-Raigarh'] },
];

const SUBS = ['ALL', 'BCCL', 'MCL', 'SECL', 'NCL', 'ECL', 'WCL', 'SCCL'];

/* ── Component ───────────────────────────────────────────── */
const MapInner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);
  const osmPinsRef = useRef<L.CircleMarker[]>([]);

  const [activeLayer, setActiveLayer] = useState('osm');
  const [filterSub, setFilterSub] = useState('ALL');
  const [searchQ, setSearchQ] = useState('');
  const [searchRes, setSearchRes] = useState<NominatimResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [osmLoading, setOsmLoading] = useState(false);
  const [osmCount, setOsmCount] = useState(0);
  const [showOsm, setShowOsm] = useState(false);
  const [selected, setSelected] = useState<typeof COAL_FIELDS[0] | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aq, setAq] = useState<AirQualityData | null>(null);
  const [envLoad, setEnvLoad] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(prev => !prev);
        });
      } else {
        setIsFullscreen(prev => !prev);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  /* Invalidate Leaflet map size on fullscreen toggle & window resize */
  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.invalidateSize();
    };
    const t1 = setTimeout(() => mapRef.current?.invalidateSize(), 50);
    const t2 = setTimeout(() => mapRef.current?.invalidateSize(), 200);
    const t3 = setTimeout(() => mapRef.current?.invalidateSize(), 500);
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleResize);
    };
  }, [isFullscreen]);

  /* Allow pressing Escape to exit fullscreen */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };
    const onFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setTimeout(() => mapRef.current?.invalidateSize(), 50);
      setTimeout(() => mapRef.current?.invalidateSize(), 200);
      setTimeout(() => mapRef.current?.invalidateSize(), 500);
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, [isFullscreen]);

  /* Init map once */
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [22.5, 83.5],
      zoom: 5,
      zoomControl: true,
    });

    const initLayer = TILE_LAYERS.find(t => t.id === 'osm')!;
    tileRef.current = L.tileLayer(initLayer.url, { attribution: initLayer.attr, maxZoom: 19 }).addTo(map);

    mapRef.current = map;

    // Immediately trigger size recalculation multiple times
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 300);
    setTimeout(() => map.invalidateSize(), 800);

    // Draw all coal field circles
    COAL_FIELDS.forEach(cf => {
      const radius = Math.sqrt(cf.resources_mt / 1000) * 900;
      const c = L.circle([cf.lat, cf.lon], {
        radius, color: cf.color, fillColor: cf.color, fillOpacity: 0.4, weight: 2,
      })
        .bindPopup(buildPopup(cf))
        .addTo(map);

      c.on('click', () => {
        setSelected(cf);
        loadEnv(cf.lat, cf.lon);
        map.flyTo([cf.lat, cf.lon], 8, { animate: true, duration: 1.2 });
      });
      circlesRef.current.push(c);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  /* Swap tile layer */
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileRef.current) tileRef.current.remove();
    const lyr = TILE_LAYERS.find(t => t.id === activeLayer)!;
    tileRef.current = L.tileLayer(lyr.url, { attribution: lyr.attr, maxZoom: 19 }).addTo(mapRef.current);
  }, [activeLayer]);

  const buildPopup = (cf: typeof COAL_FIELDS[0]) => `
    <div style="font-family:Inter,system-ui,sans-serif;min-width:220px">
      <div style="font-weight:800;font-size:15px;color:#0f172a;margin-bottom:3px">${cf.name}</div>
      <div style="font-size:11px;color:#64748b;margin-bottom:10px">${cf.state} · ${cf.sub}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:10px;padding:8px;text-align:center">
          <div style="font-size:10px;color:#15803d;font-weight:700;text-transform:uppercase">Resources</div>
          <div style="font-size:16px;font-weight:900;color:#0f172a">${(cf.resources_mt/1000).toFixed(1)}<span style="font-size:11px;font-weight:600;color:#64748b"> BT</span></div>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:8px;text-align:center">
          <div style="font-size:10px;color:#1d4ed8;font-weight:700;text-transform:uppercase">Share</div>
          <div style="font-size:16px;font-weight:900;color:#0f172a">${cf.pct}%</div>
        </div>
      </div>
      <div style="font-size:10px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:8px">
        <span style="color:#0ea5e9;font-weight:600">Coalfields:</span> ${cf.fields.join(', ')}
      </div>
    </div>
  `;

  const loadEnv = async (lat: number, lon: number) => {
    setEnvLoad(true);
    setWeather(null); setAq(null);
    const [w, a] = await Promise.all([getMineWeather(lat, lon), getAirQuality(lat, lon)]);
    setWeather(w); setAq(a);
    setEnvLoad(false);
  };

  const doSearch = useCallback(async () => {
    if (!searchQ.trim()) return;
    setSearchLoading(true);
    const res = await geocodePlace(searchQ + ' coalfield India');
    setSearchRes(res.slice(0, 5));
    setSearchLoading(false);
  }, [searchQ]);

  const flyTo = (r: NominatimResult) => {
    mapRef.current?.flyTo([parseFloat(r.lat), parseFloat(r.lon)], 10, { animate: true, duration: 1.4 });
    setSearchRes([]); setSearchQ(r.display_name.split(',')[0]);
  };

  const toggleOsm = async () => {
    if (showOsm) {
      osmPinsRef.current.forEach(m => m.remove());
      osmPinsRef.current = []; setOsmCount(0); setShowOsm(false); return;
    }
    if (!mapRef.current) return;
    setOsmLoading(true); setShowOsm(true);
    const b = mapRef.current.getBounds();
    const nodes = await fetchMineLocationsOSM(b.getSouth(), b.getWest(), b.getNorth(), b.getEast());
    nodes.slice(0, 120).forEach(n => {
      if (!n.lat || !n.lon) return;
      const m = L.circleMarker([n.lat, n.lon], { radius: 5, color: '#f59e0b', fillColor: '#fcd34d', fillOpacity: 0.9, weight: 1.5 })
        .bindPopup(`<b>${n.tags.name || 'Mine/Quarry'}</b><br/><small style="color:#64748b">${n.tags.operator || n.tags.industrial || 'OSM data'}</small>`)
        .addTo(mapRef.current!);
      osmPinsRef.current.push(m);
    });
    setOsmCount(nodes.length); setOsmLoading(false);
  };

  const filteredFields = COAL_FIELDS.filter(f => filterSub === 'ALL' || f.sub === filterSub);

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[99999] bg-slate-950 p-4 flex flex-col lg:flex-row gap-4 h-screen w-screen overflow-hidden'
          : 'flex flex-col lg:flex-row gap-4 h-[650px] min-h-[650px] w-full transition-all'
      }
    >
      {/* ── Map canvas ────────────────────────────────── */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 h-full">
        {/* Toolbar */}
        <div className="px-4 py-2.5 border-b border-slate-100/60 bg-white/70 backdrop-blur-sm flex items-center flex-wrap gap-2 shrink-0">
          {/* Search box */}
          <div className="relative">
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Search mine / coalfield…"
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 w-52 bg-white"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            {searchLoading && <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-cyan-500" />}
            {searchRes.length > 0 && (
              <div className="absolute top-9 left-0 z-[9999] bg-white rounded-xl border border-slate-200 shadow-2xl w-72">
                {searchRes.map(r => (
                  <button key={r.place_id} onClick={() => flyTo(r)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-cyan-50 border-b border-slate-50 last:border-0 transition-colors">
                    <div className="font-semibold text-slate-800 truncate">{r.display_name.split(',')[0]}</div>
                    <div className="text-[10px] text-slate-400 truncate">{r.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Base layer switcher */}
          <div className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
            {TILE_LAYERS.map(lyr => (
              <button key={lyr.id} onClick={() => setActiveLayer(lyr.id)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition-all ${activeLayer === lyr.id ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-700'}`}>
                {lyr.label}
              </button>
            ))}
          </div>

          {/* OSM mine pins toggle */}
          <button onClick={toggleOsm}
            className={`text-[10px] px-3 py-1 rounded-lg font-bold border flex items-center space-x-1.5 transition-all ${showOsm ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20' : 'border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-700'}`}>
            {osmLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
            <span>OSM Mine Pins</span>
            {osmCount > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${showOsm ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>{osmCount}</span>}
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`text-[10px] px-3 py-1 rounded-lg font-bold border flex items-center space-x-1.5 transition-all ml-auto ${
              isFullscreen
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20'
                : 'bg-slate-900 text-white border-slate-800 hover:bg-cyan-600 hover:border-cyan-500 shadow-sm'
            }`}
            title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Expand Map to Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="font-semibold">{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>
        </div>

        {/* Leaflet div */}
        <div className="flex-1 relative w-full h-full min-h-[520px]">
          <div ref={mapDivRef} className="absolute inset-0 w-full h-full" style={{ minHeight: '520px' }} />

          {/* Floating Fullscreen button on map */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 right-3 z-[1000] px-2.5 py-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200/80 transition-all hover:scale-105 backdrop-blur-sm flex items-center space-x-1.5"
            title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Full Screen View'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-rose-600" />
                <span className="text-[11px] font-bold text-rose-600">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-cyan-600" />
                <span className="text-[11px] font-bold text-slate-800">Full Screen</span>
              </>
            )}
          </button>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 border-t border-slate-100/60 bg-white/40 flex items-center justify-between text-[10px] text-slate-400 shrink-0 flex-wrap gap-1">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-600">Circle radius = geological resources</span>
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-amber-400/70 border border-amber-400 inline-block" />OSM Pin</span>
          </div>
          <span className="font-semibold text-cyan-600">OpenStreetMap · Nominatim · Overpass · Open-Meteo</span>
        </div>
      </div>

      {/* ── Side panel ────────────────────────────────── */}
      <div className={`w-full lg:w-72 flex flex-col gap-3 overflow-y-auto shrink-0 ${isFullscreen ? 'h-full bg-slate-900/60 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-md' : ''}`}>
        {/* Subsidiary filter */}
        <div className="glass-card rounded-2xl p-3 shrink-0">
          <div className="flex items-center space-x-1.5 mb-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Filter Subsidiary</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {SUBS.map(s => (
              <button key={s} onClick={() => setFilterSub(s)}
                className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border transition-all ${filterSub === s ? 'bg-cyan-600 text-white border-cyan-500' : 'border-slate-200 text-slate-600 hover:border-cyan-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Coalfield list */}
        <div className="glass-card rounded-2xl p-3 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-1.5 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Coalfields ({filteredFields.length})</span>
          </div>
          <div className="space-y-1.5">
            {filteredFields.sort((a, b) => b.resources_mt - a.resources_mt).map(cf => (
              <button key={cf.name}
                onClick={() => {
                  setSelected(cf);
                  loadEnv(cf.lat, cf.lon);
                  mapRef.current?.flyTo([cf.lat, cf.lon], 9, { animate: true, duration: 1.2 });
                }}
                className={`w-full text-left p-2 rounded-xl border transition-all ${selected?.name === cf.name ? 'border-cyan-400 bg-cyan-50/60 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-white/60'}`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cf.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-slate-800 truncate">{cf.name}</div>
                    <div className="text-[9px] text-slate-500">{cf.state} · {cf.sub}</div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{cf.pct}%</span>
                </div>
                <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(cf.resources_mt / 55000) * 100}%`, backgroundColor: cf.color }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Environmental data card */}
        {selected && (
          <div className="glass-card rounded-2xl p-3 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 truncate">{selected.name} · Live Env</span>
              {envLoad && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500 shrink-0" />}
            </div>
            {weather && !envLoad && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="flex items-center space-x-1 text-slate-500"><Thermometer className="w-3 h-3 text-orange-500" /><span>Temp</span></span>
                  <span className="font-bold text-slate-800">{weather.temp.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="flex items-center space-x-1 text-slate-500"><Wind className="w-3 h-3 text-cyan-500" /><span>Wind</span></span>
                  <span className="font-bold text-slate-800">{weather.wind_speed.toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="flex items-center space-x-1 text-slate-500"><Cloud className="w-3 h-3 text-slate-400" /><span>Humidity</span></span>
                  <span className="font-bold text-slate-800">{weather.humidity}%</span>
                </div>
                {aq && (
                  <div className="border-t border-slate-100 pt-1.5 mt-1">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700">Air Quality</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: aq.aqi_color }}>{aq.aqi_label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {[['PM2.5', aq.pm2_5.toFixed(1)], ['PM10', aq.pm10.toFixed(1)], ['CO', aq.co.toFixed(0)], ['NO₂', aq.no2.toFixed(1)]].map(([k, v]) => (
                        <div key={k} className="bg-slate-50 rounded-lg p-1.5 text-center">
                          <div className="text-[9px] text-slate-400">{k}</div>
                          <div className="text-[11px] font-bold text-slate-800">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {envLoad && <div className="flex items-center justify-center py-3 text-slate-400 text-xs"><Loader2 className="w-4 h-4 animate-spin mr-1.5" />Fetching…</div>}
            <div className="mt-2 text-[9px] text-slate-400 flex items-center space-x-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>Open-Meteo + OpenWeatherMap</span>
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <div className="glass-card rounded-xl p-2.5 text-center">
            <div className="text-xs font-extrabold text-slate-900">400.72 BT</div>
            <div className="text-[9px] text-slate-500 mt-0.5">GSI 2025 Total</div>
          </div>
          <div className="glass-card rounded-xl p-2.5 text-center">
            <div className="text-xs font-extrabold text-emerald-700">781.06 MT</div>
            <div className="text-[9px] text-slate-500 mt-0.5">FY24-25 Output</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapInner;
