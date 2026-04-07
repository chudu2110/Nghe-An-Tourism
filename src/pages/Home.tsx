import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, MapPin, Calendar, Compass, Utensils, Home as HomeIcon, BookOpen, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import Card from '../components/Card';
import BookingSection from '../components/BookingSection';
import { destinations, experiences, foodAndCulture } from '../data/ngheAnData';
import { useI18n } from '../i18n';
import { buildSiteDocs, searchSite } from '../services/siteSearch';

const monthHeaderImage = (fileName: string) =>
  new URL(`../../Home img/12 month header/${fileName}`, import.meta.url).href;

const homeBodyImage = (fileName: string) =>
  new URL(`../../Home img/Body img/${fileName}`, import.meta.url).href;

const monthImages: Record<string, string> = {
  Jan: monthHeaderImage('Jan.webp'),
  Feb: monthHeaderImage('Feb.webp'),
  Mar: monthHeaderImage('March.webp'),
  Apr: monthHeaderImage('April.webp'),
  May: monthHeaderImage('May.webp'),
  Jun: monthHeaderImage('June.webp'),
  Jul: monthHeaderImage('July.webp'),
  Aug: monthHeaderImage('Aug.webp'),
  Sep: monthHeaderImage('Sep.webp'),
  Oct: monthHeaderImage('Oct.webp'),
  Nov: monthHeaderImage('Nov.webp'),
  Dec: monthHeaderImage('Dec.webp'),
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type SuggestionAction =
  | { type: 'navigate'; to: string }
  | { type: 'open'; url: string }
  | { type: 'search'; q: string };

type Suggestion = {
  id: string;
  label: string;
  sublabel?: string;
  action: SuggestionAction;
};

function normalizeText(v: string) {
  return v.trim().toLowerCase();
}

function googleMapsSearchUrl(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

async function fetchDuckDuckGoSuggest(q: string, signal: AbortSignal): Promise<string[]> {
  const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`DuckDuckGo suggest error: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .map((x: any) => (typeof x?.phrase === 'string' ? x.phrase : ''))
    .filter((s: string) => s.trim().length > 0);
}

export default function Home() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const selectedMonth = months[currentMonthIndex];
  const { t } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const suggestBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentMonthIndex((prev) => (prev + 1) % months.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const getServicePath = (service: string) => {
    if (service === 'Tư vấn Tour') return '/planning';
    if (service === 'Thuê xe') return '/booking';
    if (service === 'Đặt phòng') return '/booking';
    if (service === 'Dịch vụ Guide') return '/volunteers';
    return '/booking';
  };

  const siteDocs = useMemo(() => buildSiteDocs(t), [t]);
  const siteMatchesForQuery = useMemo(() => searchSite(siteDocs, query, 6), [siteDocs, query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!isSuggestOpen) return;
      const el = suggestBoxRef.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && el.contains(target)) return;
      setIsSuggestOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isSuggestOpen]);

  useEffect(() => {
    const q = query.trim();
    if (!isSuggestOpen) return;
    if (!q) {
      setSuggestions([]);
      setActiveIndex(-1);
      setIsSuggestLoading(false);
      return;
    }

    const qNorm = normalizeText(q);
    const siteSuggestions: Suggestion[] = siteMatchesForQuery.map((r) => ({
      id: `site:${r.doc.id}`,
      label: r.doc.title,
      sublabel: r.doc.kind,
      action: { type: 'navigate', to: r.doc.path },
    }));

    const quick: Suggestion[] = [
      { id: `quick:all:${q}`, label: `Xem kết quả tìm kiếm: ${q}`, action: { type: 'navigate', to: `/search?q=${encodeURIComponent(q)}` } },
      { id: `quick:gmap:${q}`, label: `Dẫn đường Google Maps: ${q}`, action: { type: 'open', url: googleMapsSearchUrl(q) } },
    ];

    setSuggestions([...siteSuggestions, ...quick]);
    setActiveIndex(-1);
    setIsSuggestLoading(q.length >= 2);

    if (q.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetchDuckDuckGoSuggest(q, controller.signal)
        .then((phrases) => {
          const web = phrases
            .slice(0, 6)
            .filter((p) => normalizeText(p) !== qNorm)
            .map((p) => ({
              id: `web:${p}`,
              label: p,
              sublabel: 'Web',
              action: { type: 'navigate', to: `/search?q=${encodeURIComponent(p)}` } as const,
            }));
          setSuggestions((prev) => {
            const base = prev.filter((s) => !s.id.startsWith('web:'));
            return [...base, ...web];
          });
        })
        .catch(() => {})
        .finally(() => {
          if (controller.signal.aborted) return;
          setIsSuggestLoading(false);
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, isSuggestOpen, siteMatchesForQuery]);

  const runSuggestion = (s: Suggestion) => {
    setIsSuggestOpen(false);
    setActiveIndex(-1);

    if (s.action.type === 'navigate') {
      navigate(s.action.to);
      return;
    }
    if (s.action.type === 'open') {
      window.open(s.action.url, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(s.action.q)}`);
  };

  const onSubmitSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const nextMonth = () => {
    setCurrentMonthIndex((prev) => (prev + 1) % months.length);
  };

  const prevMonth = () => {
    setCurrentMonthIndex((prev) => (prev - 1 + months.length) % months.length);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedMonth}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              src={monthImages[selectedMonth]}
              alt={t('Nghệ An in {month}', { month: selectedMonth })}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className={`relative ${isSuggestOpen ? 'z-40' : 'z-10'} text-center px-4 max-w-4xl mx-auto`}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white font-bold tracking-[0.3em] uppercase text-sm mb-6"
          >
            {t('Chào mừng đến với Nghệ An')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-12 tracking-tight font-serif"
          >
            {t('Khám phá trái tim miền Trung')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-2 rounded-sm shadow-2xl flex flex-col md:flex-row items-stretch md:items-center max-w-3xl mx-auto"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < suggestions.length) {
                  runSuggestion(suggestions[activeIndex]);
                  return;
                }
                onSubmitSearch();
              }}
              className="flex flex-col md:flex-row items-stretch md:items-center w-full"
            >
              <div ref={suggestBoxRef} className="relative flex-grow flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder={t('Bạn muốn đi đâu?')}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!isSuggestOpen) setIsSuggestOpen(true);
                  }}
                  onFocus={() => setIsSuggestOpen(true)}
                  onKeyDown={(e) => {
                    if (!isSuggestOpen) return;
                    if (e.key === 'Escape') {
                      setIsSuggestOpen(false);
                      setActiveIndex(-1);
                      return;
                    }
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setActiveIndex((idx) => Math.min(idx + 1, suggestions.length - 1));
                      return;
                    }
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setActiveIndex((idx) => Math.max(idx - 1, 0));
                      return;
                    }
                  }}
                  className="w-full outline-none text-gray-800 font-medium"
                />

                {isSuggestOpen && (suggestions.length > 0 || isSuggestLoading) && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-sm overflow-hidden z-50">
                    {isSuggestLoading && (
                      <div className="px-4 py-3 text-xs text-gray-500">Đang gợi ý...</div>
                    )}
                    {suggestions.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => runSuggestion(s)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          idx === activeIndex ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-semibold text-gray-900 truncate">{s.label}</span>
                          {s.sublabel && <span className="text-[10px] uppercase tracking-widest text-gray-400 shrink-0">{s.sublabel}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 transition-colors uppercase tracking-widest text-sm"
              >
                {t('Tìm kiếm')}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Month Selector - Left Aligned */}
        <div className="absolute bottom-12 left-4 sm:left-8 lg:left-16 z-20 flex items-center space-x-6 md:space-x-10 text-white">
          <button className="hover:text-red-500 transition-colors shrink-0">
            <Grid size={24} />
          </button>
          
          <div className="flex items-center space-x-6 md:space-x-10">
            <button onClick={prevMonth} className="hover:text-red-500 transition-colors shrink-0">
              <ChevronLeft size={28} />
            </button>
            
            <div className="flex items-center space-x-6 md:space-x-10 overflow-hidden">
              {months.map((month, idx) => {
                // Show a window of months around the current index
                const diff = (idx - currentMonthIndex + months.length) % months.length;
                const isVisible = diff <= 2 || diff >= months.length - 2;
                
                if (!isVisible) return null;

                return (
                  <button
                    key={month}
                    onClick={() => setCurrentMonthIndex(idx)}
                    className={`text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 shrink-0 ${
                      idx === currentMonthIndex ? 'text-white scale-110' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            <button onClick={nextMonth} className="hover:text-red-500 transition-colors shrink-0">
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest mb-2">{t('Cuộn để xem')}</span>
          <div className="w-[1px] h-12 bg-white/50" />
        </motion.div>
      </section>

      {/* About Nghệ An */}
      <Section title={t('Về Nghệ An')} subtitle={t('Khám phá vùng đất địa linh nhân kiệt')}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              {t('Nghệ An không chỉ là một điểm đến, đó là một hành trình trở về nguồn cội.')}
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('Với diện tích lớn nhất Việt Nam, Nghệ An sở hữu địa hình đa dạng từ những bãi biển xanh ngắt ở Cửa Lò đến những dãy núi hùng vĩ ở Kỳ Sơn, Quế Phong. Đây là quê hương của Chủ tịch Hồ Chí Minh vĩ đại và là cái nôi của Dân ca Ví, Giặm - Di sản văn hóa phi vật thể đại diện của nhân loại.')}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-3 rounded-full text-red-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">16,490</p>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('Diện tích (km²)')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-3 rounded-full text-red-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100+</p>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('Lễ hội hàng năm')}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="group flex items-center space-x-2 text-red-600 font-bold uppercase tracking-widest text-sm pt-4"
            >
              <span>{t('Tìm hiểu thêm về lịch sử')}</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src={homeBodyImage('mô tê răng rứa.webp')}
              alt="Nghệ An Culture"
              className="rounded-sm shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-xl hidden md:block max-w-xs">
              <p className="text-red-600 font-bold text-4xl mb-2">{t('"Mô, tê, răng, rứa"')}</p>
              <p className="text-gray-600 text-sm">{t('Giọng nói đặc trưng, ấm áp và chân tình của người dân xứ Nghệ.')}</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Featured Destinations - Bento Grid Layout */}
      <Section title={t('Điểm đến nổi bật')} subtitle={t('Những nơi bạn không thể bỏ qua')} className="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[300px]">
          {/* Large Featured Card */}
          <Card
            key={destinations[0].id}
            title={t(destinations[0].name)}
            subtitle={t(destinations[0].festival)}
            image={destinations[0].image}
            description={t(destinations[0].description)}
            link={destinations[0].link}
            variant="editorial"
            aspectRatio="portrait"
            className="md:col-span-2 md:row-span-2"
          />
          
          {/* Wide Card */}
          <Card
            key={destinations[1].id}
            title={t(destinations[1].name)}
            subtitle={t(destinations[1].festival)}
            image={destinations[1].image}
            description={t(destinations[1].description)}
            link={destinations[1].link}
            variant="editorial"
            aspectRatio="wide"
            className="md:col-span-2 lg:col-span-4"
          />

          {/* Regular Cards */}
          <Card
            key={destinations[2].id}
            title={t(destinations[2].name)}
            subtitle={t(destinations[2].festival)}
            image={destinations[2].image}
            description={t(destinations[2].description)}
            link={destinations[2].link}
            variant="editorial"
            aspectRatio="square"
            className="md:col-span-2 lg:col-span-2"
          />
          
          <Card
            key={destinations[3].id}
            title={t(destinations[3].name)}
            subtitle={t(destinations[3].festival)}
            image={destinations[3].image}
            description={t(destinations[3].description)}
            link={destinations[3].link}
            variant="editorial"
            aspectRatio="square"
            className="md:col-span-2 lg:col-span-2"
          />

          <Card
            key={destinations[4].id}
            title={t(destinations[4].name)}
            subtitle={t(destinations[4].festival)}
            image={destinations[4].image}
            description={t(destinations[4].description)}
            link={destinations[4].link}
            variant="editorial"
            aspectRatio="wide"
            className="md:col-span-4 lg:col-span-4"
          />
          
          <Card
            key={destinations[5].id}
            title={t(destinations[5].name)}
            subtitle={t(destinations[5].festival)}
            image={destinations[5].image}
            description={t(destinations[5].description)}
            link={destinations[5].link}
            variant="editorial"
            aspectRatio="portrait"
            className="md:col-span-2 lg:col-span-2 md:row-span-2"
          />

          <Card
            key="puxailaileng"
            title={t('Puxailaileng')}
            subtitle={t('Đỉnh cao nhất Bắc Trường Sơn')}
            image={homeBodyImage('Puxailaileng.webp')}
            imageClassName="object-cover object-bottom scale-125 -translate-y-6"
            description={t('Đỉnh Puxailaileng (Kỳ Sơn, Nghệ An) cao khoảng 2.720m — cung trekking gần 20km qua rừng sa mu, pơ mu và cột mốc 422 trước khi chạm “đất cao, trời thấp”.')}
            link="https://baonghean.vn/hanh-trinh-chinh-phuc-dinh-nui-puxailaileng-cao-nhat-bac-truong-son-10215374.html"
            variant="editorial"
            aspectRatio="wide"
            className="md:col-span-2 md:col-start-3 md:row-start-3 lg:col-span-4 lg:col-start-1 lg:row-start-4"
          />
        </div>
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => navigate('/destinations')}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-gray-900 transition-all duration-300 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white uppercase tracking-widest text-sm overflow-hidden"
          >
            <span className="relative z-10">{t('Xem tất cả điểm đến')}</span>
            <ArrowRight size={18} className="ml-2 relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </Section>

      {/* Featured Experiences - Overlapping Layout */}
      <Section title={t('Trải nghiệm độc đáo')} subtitle={t('Hành trình của những cảm xúc')}>
        <div className="space-y-32">
          {experiences.slice(0, 3).map((exp, idx) => (
            <div key={exp.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-3/5 relative"
              >
                <div className="aspect-video overflow-hidden rounded-sm shadow-2xl">
                  <img src={exp.image} alt={exp.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className={`absolute -bottom-12 ${idx % 2 === 0 ? '-right-12' : '-left-12'} hidden lg:block w-64 h-64 bg-red-600 -z-10 opacity-10`} />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-2/5 space-y-6"
              >
                <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px]">{t('Trải nghiệm 0{n}', { n: idx + 1 })}</span>
                <h3 className="text-4xl md:text-5xl font-bold font-serif leading-tight">{t(exp.name)}</h3>
                <p className="text-gray-500 text-lg leading-relaxed">{t(exp.description)}</p>
                <button
                  type="button"
                  onClick={() => navigate('/experiences')}
                  className="flex items-center space-x-3 text-gray-900 font-bold uppercase tracking-widest text-xs group"
                >
                  <span className="border-b-2 border-red-600 pb-1">{t('Khám phá chi tiết')}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            </div>
          ))}
        </div>
      </Section>

      {/* Booking Section */}
      <BookingSection />

      {/* Food & Culture */}
      <Section title={t('Ẩm thực & Văn hóa')} subtitle={t('Hương vị và tâm hồn xứ Nghệ')} dark>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {foodAndCulture.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-sm aspect-video cursor-pointer"
              onClick={() => navigate('/food-culture')}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold mb-2">{t(item.name)}</h3>
                <p className="text-gray-300 mb-6 max-w-md">{t(item.description)}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/food-culture');
                  }}
                  className="flex items-center space-x-2 text-white font-bold uppercase tracking-widest text-xs"
                >
                  <span>{t('Khám phá ngay')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* New Editorial Planning Section */}
      <section className="py-32 bg-[#fcfcfc] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: The "Hero" Visual (Chapter Preview) */}
            <div className="lg:col-span-7 sticky top-32">
              <div className="relative">
                <motion.div 
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-sm shadow-2xl"
                >
                  <img 
                    src={homeBodyImage('Tư vấn lịch trình.jpg')} 
                    alt="Planning Hero" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                
                {/* Overlapping Decorative Element */}
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -z-10" />
                
                {/* Vertical Label */}
                <div className="absolute top-12 -left-8 hidden xl:block">
                  <span className="writing-mode-vertical text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">
                    {t('Hành trình của bạn bắt đầu từ đây')}
                  </span>
                </div>

                {/* Floating Service Badge */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -bottom-6 -left-6 bg-white p-8 shadow-2xl max-w-[240px] hidden md:block border border-gray-100"
                >
                  <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">{t('Dịch vụ nổi bật')}</p>
                  <p className="text-gray-900 font-serif text-xl font-bold leading-tight">{t('Tư vấn lịch trình 1-1 cùng chuyên gia bản địa.')}</p>
                </motion.div>
              </div>
            </div>

            {/* Right Column: The Chapters (Services) */}
            <div className="lg:col-span-5 space-y-16">
              <div className="mb-20">
                <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">{t('Lên kế hoạch')}</span>
                <h2 className="text-5xl md:text-6xl font-bold font-serif leading-tight text-gray-900 mb-6">
                  {t('Thiết kế hành trình của riêng bạn')}
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  {t('Chúng tôi không chỉ cung cấp thông tin, chúng tôi cung cấp giải pháp toàn diện để bạn tận hưởng Nghệ An một cách trọn vẹn nhất.')}
                </p>
              </div>

              <div className="space-y-12">
                {[
                  { 
                    num: '01', 
                    title: 'Thời điểm & Lịch trình', 
                    desc: 'Khám phá Nghệ An vào mùa hoa hướng dương hay mùa biển gọi? Chúng tôi giúp bạn chọn thời điểm và lên lịch trình tối ưu.',
                    service: 'Tư vấn Tour'
                  },
                  { 
                    num: '02', 
                    title: 'Di chuyển & Vận tải', 
                    desc: 'Dịch vụ đưa đón sân bay Vinh, thuê xe tự lái hoặc xe du lịch chất lượng cao cho cả gia đình.',
                    service: 'Thuê xe'
                  },
                  { 
                    num: '03', 
                    title: 'Lưu trú & Nghỉ dưỡng', 
                    desc: 'Từ những homestay mộc mạc tại bản làng đến các resort 5 sao đẳng cấp tại Cửa Lò.',
                    service: 'Đặt phòng'
                  },
                  { 
                    num: '04', 
                    title: 'Hướng dẫn viên bản địa', 
                    desc: 'Kết nối với những người con xứ Nghệ am hiểu văn hóa, lịch sử để chuyến đi thêm phần ý nghĩa.',
                    service: 'Dịch vụ Guide'
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(getServicePath(item.service))}
                    className="group cursor-pointer border-b border-gray-100 pb-12"
                  >
                    <div className="flex items-start space-x-8">
                      <span className="text-4xl font-serif italic text-gray-200 group-hover:text-red-600 transition-colors duration-500">
                        {item.num}
                      </span>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-2xl font-bold text-gray-900 group-hover:translate-x-2 transition-transform duration-500">
                            {t(item.title)}
                          </h4>
                          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {t(item.service)}
                          </span>
                        </div>
                        <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                          {t(item.desc)}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(getServicePath(item.service));
                          }}
                          className="flex items-center space-x-2 text-red-600 font-bold uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                        >
                          <span>{t('Khám phá ngay')}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-12">
                <button
                  type="button"
                  onClick={() => navigate('/planning')}
                  className="w-full bg-gray-900 text-white font-bold py-6 px-8 hover:bg-red-600 transition-all uppercase tracking-widest text-sm flex items-center justify-center space-x-4 group"
                >
                  <span>{t('Bắt đầu lên kế hoạch ngay')}</span>
                  <Compass size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Volunteer Guides CTA - Stylish Split Layout */}
      <section className="relative py-32 bg-gray-950 overflow-hidden group">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Bold Typography & Content */}
            <div className="lg:col-span-7 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-red-600 font-mono text-xs font-bold tracking-[0.5em] uppercase mb-8 block">
                  {t('Cộng đồng & Kết nối')}
                </span>
                <h2 className="text-5xl md:text-8xl font-bold text-white mb-8 font-serif leading-[0.9] tracking-tighter">
                  {t('Khám phá')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                    {t('Xứ Nghệ')}
                  </span> <br />
                  {t('cùng người bản địa')}
                </h2>
                <p className="text-gray-400 text-xl max-w-xl mb-12 leading-relaxed font-light">
                  {t('Không chỉ là một chuyến đi, đó là sự kết nối chân thực. Hãy để những người con Nghệ An kể cho bạn nghe những câu chuyện mà sách vở chưa từng nhắc tới.')}
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link 
                    to="/volunteers" 
                    className="group/btn relative overflow-hidden bg-red-600 text-white font-bold py-5 px-10 rounded-sm transition-all hover:bg-red-700 text-center uppercase tracking-widest text-xs shadow-2xl shadow-red-600/20"
                  >
                    <span className="relative z-10">{t('Tìm hướng dẫn viên')}</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </Link>
                  <Link 
                    to="/volunteers" 
                    className="group/btn relative overflow-hidden border border-white/20 text-white font-bold py-5 px-10 rounded-sm transition-all hover:border-red-600 text-center uppercase tracking-widest text-xs"
                  >
                    <span className="relative z-10">{t('Trở thành tình nguyện viên')}</span>
                    <div className="absolute inset-0 bg-red-600 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Impactful Visual */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img 
                    src={homeBodyImage('Khám phá cùng người bản địa.jpg')} 
                    alt="Local Guide Experience" 
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass Morphic Card Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {[
                          homeBodyImage('Tình nguyện viên 01.jpg'),
                          homeBodyImage('Tình nguyện viên 02.jpg'),
                          homeBodyImage('Tình nguyện viên 03.jpg'),
                        ].map((src, i) => (
                          <div key={src} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 overflow-hidden">
                            <img src={src} alt={`Tình nguyện viên ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{t('+500 Tình nguyện viên')}</p>
                        <p className="text-gray-400 text-xs">{t('Sẵn sàng đồng hành cùng bạn')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Floating Element */}
                <div className="absolute -top-12 -right-12 w-48 h-48 border border-red-600/20 rounded-full animate-pulse -z-10" />
                <div className="absolute top-1/2 -left-12 w-24 h-24 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
