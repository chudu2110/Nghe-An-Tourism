import React, { Component, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ChevronRight, Globe, Layers, MapPin, Maximize2, Minimize2, Plus, Route, Search, Sparkles, Star, Utensils, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';

type Category = 'all' | 'nature' | 'culture' | 'food';

type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: Exclude<Category, 'all'>;
  rating: number;
  desc: string;
  vibe: string;
};

const CENTER: { lat: number; lng: number } = { lat: 18.6734, lng: 105.6813 };

const categories: Array<{ id: Category; label: string; icon: React.ReactNode }> = [
  { id: 'all', label: 'Tất cả', icon: <Globe size={14} /> },
  { id: 'nature', label: 'Thiên nhiên', icon: <Camera size={14} /> },
  { id: 'culture', label: 'Văn hóa', icon: <Sparkles size={14} /> },
  { id: 'food', label: 'Ẩm thực', icon: <Utensils size={14} /> },
];

const initialPlaces: Place[] = [
  { id: '1', name: 'Quảng trường Hồ Chí Minh', lat: 18.6672, lng: 105.6865, category: 'culture', rating: 4.8, desc: 'Biểu tượng văn hóa của thành phố Vinh.', vibe: 'Kiến trúc – lịch sử – check-in' },
  { id: '2', name: 'Đảo Chè Thanh Chương', lat: 18.725, lng: 105.312, category: 'nature', rating: 4.9, desc: 'Vẻ đẹp xanh mướt giữa lòng hồ.', vibe: 'Bình minh – mặt nước – chill' },
  { id: '3', name: 'Bãi biển Cửa Lò', lat: 18.818, lng: 105.712, category: 'nature', rating: 4.7, desc: 'Bãi biển nổi tiếng nhất miền Trung.', vibe: 'Hoàng hôn – hải sản – dạo biển' },
  { id: '4', name: 'Khu di tích Kim Liên', lat: 18.678, lng: 105.512, category: 'culture', rating: 5.0, desc: 'Quê nội Chủ tịch Hồ Chí Minh.', vibe: 'Di sản – chiều sâu – tĩnh lặng' },
  { id: '5', name: 'Súp lươn Vinh', lat: 18.67, lng: 105.68, category: 'food', rating: 4.9, desc: 'Đặc sản không thể bỏ qua.', vibe: 'Cay nồng – đậm đà – đêm Vinh' },
];

const tiles = {
  dark: {
    name: 'Noir',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  light: {
    name: 'Studio',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
} as const;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const h = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function routeDistanceKm(points: Array<{ lat: number; lng: number }>) {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) total += haversineKm(points[i - 1], points[i]);
  return total;
}

function markerColor(category: Place['category']) {
  if (category === 'nature') return '#16a34a';
  if (category === 'culture') return '#f59e0b';
  return '#dc2626';
}

function buildMarkerIcon(opts: { color: string; selected: boolean }) {
  const size = opts.selected ? 18 : 14;
  const pulse = opts.selected ? 'box-shadow:0 0 0 0 rgba(220,38,38,0.0);' : '';
  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;">
      <div style="position:absolute;inset:-10px;border-radius:9999px;border:1px solid rgba(255,255,255,0.25);${opts.selected ? 'animation:pulse 1.6s infinite;' : ''}"></div>
      <div style="position:absolute;inset:0;border-radius:9999px;background:${opts.color};border:2px solid rgba(255,255,255,0.9);${pulse}"></div>
    </div>
  `;

  return L.divIcon({
    className: 'na-leaflet-pin',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

type MapErrorBoundaryProps = { children: ReactNode; fallback: ReactNode };
type MapErrorBoundaryState = { hasError: boolean };

class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  declare props: Readonly<MapErrorBoundaryProps>;
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function MapPage() {
  const { t } = useI18n();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>(initialPlaces[0]?.id ?? '1');
  const [tileMode, setTileMode] = useState<keyof typeof tiles>('dark');
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    const next = q?.trim();
    if (!next) return;
    setSearchTerm(next);
    const match = initialPlaces.find((p) => p.name.toLowerCase().includes(next.toLowerCase()));
    if (match) setSelectedId(match.id);
  }, [location.search]);

  const filteredPlaces = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return initialPlaces.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const selectedPlace = useMemo(() => {
    return initialPlaces.find((p) => p.id === selectedId) ?? initialPlaces[0];
  }, [selectedId]);

  const routePlaces = useMemo(() => {
    return routeIds
      .map((id) => initialPlaces.find((p) => p.id === id))
      .filter((p): p is Place => Boolean(p));
  }, [routeIds]);

  const routeKm = useMemo(() => routeDistanceKm(routePlaces), [routePlaces]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      window.setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 80);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      mapRef.current?.invalidateSize();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (!mapElRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapElRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      preferCanvas: true,
    }).setView([CENTER.lat, CENTER.lng], 11);

    mapRef.current = map;

    const layer = L.tileLayer(tiles[tileMode].url, {
      attribution: tiles[tileMode].attribution,
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = layer;
    window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => {
      routeLineRef.current?.remove();
      routeLineRef.current = null;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      tileLayerRef.current?.remove();
      tileLayerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) tileLayerRef.current.remove();
    tileLayerRef.current = L.tileLayer(tiles[tileMode].url, {
      attribution: tiles[tileMode].attribution,
      maxZoom: 18,
    }).addTo(map);
  }, [tileMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const visible = new Set(filteredPlaces.map((p) => p.id));
    markersRef.current.forEach((marker, id) => {
      if (!visible.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    filteredPlaces.forEach((place) => {
      if (markersRef.current.has(place.id)) return;
      const icon = buildMarkerIcon({ color: markerColor(place.category), selected: place.id === selectedId });
      const marker = L.marker([place.lat, place.lng], { icon });
      marker.on('click', () => setSelectedId(place.id));
      marker.bindTooltip(t(place.name), { direction: 'top', opacity: 0.9, offset: [0, -12], sticky: true });
      marker.addTo(map);
      markersRef.current.set(place.id, marker);
    });
  }, [filteredPlaces, selectedId, t]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const place = initialPlaces.find((p) => p.id === id);
      if (!place) return;
      marker.setIcon(buildMarkerIcon({ color: markerColor(place.category), selected: id === selectedId }));
    });
  }, [selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo([selectedPlace.lat, selectedPlace.lng], 13, { duration: 1.2 });
  }, [selectedPlace.lat, selectedPlace.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const latlngs = routePlaces.map((p) => [p.lat, p.lng] as L.LatLngExpression);
    if (latlngs.length >= 2) {
      if (!routeLineRef.current) {
        routeLineRef.current = L.polyline(latlngs, { color: '#dc2626', weight: 4, opacity: 0.9 }).addTo(map);
      } else {
        routeLineRef.current.setLatLngs(latlngs);
      }
    } else if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
  }, [routePlaces]);

  const toggleStop = (id: string) => {
    setRouteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearRoute = () => setRouteIds([]);
  const resetView = () => {
    mapRef.current?.flyTo([CENTER.lat, CENTER.lng], 11, { duration: 1.1 });
  };
  const toggleFullscreen = async () => {
    const el = mapWrapperRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      window.setTimeout(() => mapRef.current?.invalidateSize(), 0);
    }
  };

  const mapFallback = (
    <div className="absolute inset-0 flex items-center justify-center bg-[#070707]">
      <div className="max-w-lg w-full mx-6 p-10 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl text-white">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">{t('Trạng thái bản đồ')}</span>
          <span className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/80">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{t('Dự phòng')}</span>
          </span>
        </div>
        <h3 className="text-3xl font-bold font-serif tracking-tight">{t('Không tải được bản đồ')}</h3>
        <p className="mt-3 text-white/60 text-sm leading-relaxed">
          {t('Trang vẫn hoạt động bình thường với danh sách điểm đến và tính năng tạo lộ trình. Bản đồ nền sẽ được phục hồi khi kết nối ổn định.')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 w-full py-4 rounded-full bg-red-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-colors"
        >
          {t('Tải lại')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-20 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-red-600" />
              <span className="text-red-500 font-mono text-[10px] font-bold tracking-[0.5em] uppercase">{t('Nghệ An Live')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-serif tracking-tighter leading-[0.9] text-white">
              {t('Bản đồ')} <span className="text-red-600 italic">{t('trải nghiệm.')}</span>
            </h1>
            <p className="text-white/55 text-sm max-w-2xl font-light leading-relaxed">
              {t('Chọn điểm đến, thêm vào lộ trình và xem đường nối trực tiếp trên bản đồ. Nút toàn màn hình ở góc phải của bản đồ.')}
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-white/70 text-[11px] font-bold">
              {filteredPlaces.length}/{initialPlaces.length} {t('điểm')}
            </div>
            <div className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-white/70 text-[11px] font-mono">
              {routeKm.toFixed(1)} km
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 overflow-hidden">
                <motion.div
                  animate={{ x: [-220, 420] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                  className="w-1/2 h-full bg-white/40"
                />
              </div>

              <div className="p-8 space-y-6">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-red-500 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder={t('Tìm điểm đến, món ăn, di tích...')}
                    className="w-full bg-black/30 border border-white/10 py-4 pl-12 pr-4 rounded-full outline-none focus:border-red-600 transition-all text-sm text-white placeholder:text-white/40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-[11px] font-bold transition-all ${
                        activeCategory === cat.id
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-black/20 border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {cat.icon}
                      <span>{t(cat.label)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[520px] overflow-y-auto custom-scrollbar map-scrollbar border-t border-white/10">
                <AnimatePresence mode="popLayout">
                  {filteredPlaces.map((place, idx) => (
                    <motion.button
                      key={place.id}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setSelectedId(place.id)}
                      className={`w-full text-left p-6 border-b border-white/10 transition-all ${
                        selectedId === place.id ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{t(place.category === 'nature' ? 'Thiên nhiên' : place.category === 'culture' ? 'Văn hóa' : 'Ẩm thực')}</p>
                        <div className="flex items-center space-x-1 text-red-500 bg-red-600/10 px-2 py-1 rounded-full">
                          <Star size={10} className="fill-red-500" />
                          <span className="text-[11px] font-bold text-white/90">{place.rating}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <h4 className="text-xl font-bold font-serif text-white leading-tight">{t(place.name)}</h4>
                        <div className={`p-2 border rounded-full transition-all ${
                          selectedId === place.id ? 'bg-red-600 text-white border-red-600' : 'border-white/15 text-white/70'
                        }`}>
                          <ChevronRight size={12} />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-white/55 font-light leading-relaxed line-clamp-2">{t(place.desc)}</p>
                      <p className="mt-3 text-[11px] text-white/40">{t(place.vibe)}</p>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {filteredPlaces.length === 0 && (
                  <div className="p-10 text-center space-y-3">
                    <div className="w-12 h-12 border border-dashed border-white/15 rounded-full flex items-center justify-center mx-auto">
                      <Search size={20} className="text-white/40" />
                    </div>
                    <p className="text-sm text-white/60">{t('Không tìm thấy kết quả')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div
              ref={mapWrapperRef}
              className="relative h-[420px] sm:h-[520px] lg:h-[640px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
            >
              <div className="absolute inset-0">
                <MapErrorBoundary fallback={mapFallback}>
                  <div ref={mapElRef} className="w-full h-full" />
                </MapErrorBoundary>
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-red-600/20 blur-[90px]" />
                <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-white/5 blur-[90px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/45" />
              </div>

              <div className="absolute top-5 right-5 flex items-center space-x-2 pointer-events-auto">
                <button
                  onClick={() => setTileMode((m) => (m === 'dark' ? 'light' : 'dark'))}
                  className="inline-flex items-center space-x-2 px-3 py-2 rounded-full border border-white/10 bg-black/30 text-white/80 hover:text-white hover:border-white/20 transition-colors text-[11px] font-bold"
                >
                  <Layers size={14} />
                  <span>{tiles[tileMode].name}</span>
                </button>
                <button
                  onClick={resetView}
                  className="w-10 h-10 rounded-full border border-white/10 bg-black/30 text-white/80 hover:text-white hover:border-white/20 transition-colors inline-flex items-center justify-center"
                  aria-label={t('Đặt lại góc nhìn')}
                >
                  <MapPin size={18} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-full border border-white/10 bg-black/30 text-white/80 hover:text-white hover:border-white/20 transition-colors inline-flex items-center justify-center"
                  aria-label={t('Toàn màn hình')}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>

              <div className="absolute left-6 bottom-6 right-6 pointer-events-none">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">{t('Điểm đang chọn')}</p>
                    <p className="mt-2 text-2xl font-bold font-serif text-white leading-tight">{t(selectedPlace.name)}</p>
                    <p className="mt-2 text-white/55 text-sm leading-relaxed max-w-xl">{t(selectedPlace.desc)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">{t('Toạ độ')}</p>
                    <p className="mt-2 text-white/80 text-sm font-mono">
                      {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center">
                    <Route size={18} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">{t('Lộ trình')}</p>
                    <p className="text-white/70 text-sm font-light">{routeIds.length} {t('điểm')} • {routeKm.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleStop(selectedPlace.id)}
                    className={`px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest transition-colors ${
                      routeIds.includes(selectedPlace.id) ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center space-x-2">
                      {routeIds.includes(selectedPlace.id) ? <X size={16} /> : <Plus size={16} />}
                      <span>{routeIds.includes(selectedPlace.id) ? t('Bỏ') : t('Thêm')}</span>
                    </span>
                  </button>
                  <button
                    onClick={clearRoute}
                    className="px-4 py-2 rounded-full bg-black/30 border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-colors text-[11px] font-bold"
                  >
                    {t('Xóa')}
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 flex flex-wrap gap-2">
                {routePlaces.length === 0 ? (
                  <span className="text-white/55 text-sm">{t('Thêm vài điểm để vẽ lộ trình trên bản đồ.')}</span>
                ) : (
                  routePlaces.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/15 transition-colors text-[11px] font-bold"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: markerColor(p.category) }} />
                      <span>{idx + 1}. {t(p.name)}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .na-leaflet-pin { background: transparent; border: none; }
        .leaflet-container { background: #0b0b0b; }
        .leaflet-control-container { display: none; }
        .leaflet-tooltip { background: rgba(0,0,0,0.65); color: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.12); border-radius: 9999px; padding: 6px 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .leaflet-tooltip:before { border-top-color: rgba(255,255,255,0.12); }
        .map-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(220,38,38,0.85) rgba(255,255,255,0.06); }
        .map-scrollbar::-webkit-scrollbar { width: 12px; }
        .map-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-left: 1px solid rgba(255,255,255,0.08); }
        .map-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, rgba(220,38,38,0.95), rgba(220,38,38,0.55)); border-radius: 9999px; border: 3px solid rgba(0,0,0,0.55); }
        .map-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, rgba(220,38,38,1), rgba(220,38,38,0.7)); }
        @keyframes pulse {
          0% { transform: scale(0.85); opacity: 0.9; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
