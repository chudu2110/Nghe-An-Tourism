import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';

import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Clock, 
  Heart, 
  Share2,
  Shuffle,
  Repeat,
  Mic2,
  Search,
  X
} from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  image: string;
  mediaType: 'soundcloud' | 'video';
  audioUrl?: string;
  videoUrl?: string;
}

const podcastVideo = (fileName: string) =>
  new URL(`../../Podcast/${fileName}`, import.meta.url).href;

const blogImage = (fileName: string) =>
  new URL(`../../Blog img/${fileName}`, import.meta.url).href;

const episodesEn: PodcastEpisode[] = [
  {
    id: '1',
    title: 'A Day Living Like a Local – Feeling Slow in the Lao Wind',
    description: 'Hành trình âm thanh đưa bạn sâu vào lõi rừng quốc gia Pù Mát, nơi những loài thú quý hiếm và thảm thực vật nguyên sinh vẫn đang được bảo tồn.',
    duration: '10:45',
    date: '12/04/2026',
    category: 'Con người',
    image: blogImage('Tiếng mẹ đẻ 03.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep1.mp4')
  },
  {
    id: '2',
    title: 'Beyond the Beach - The Untold Stories of Cua Lo',
    description: 'Tìm hiểu về nguồn gốc và những bí quyết gia truyền tạo nên món súp lươn cay nồng, biểu tượng ẩm thực không thể trộn lẫn của người dân Nghệ An.',
    duration: '08:12',
    date: '05/04/2026',
    category: 'Thiên nhiên',
    image: blogImage('Cửa Lò 03.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep2.mp4')
  },
  {
    id: '3',
    title: 'Think you’ve tried Nghe An eel ? Maybe…. not yet',
    description: 'Cuộc trò chuyện với các nghệ nhân dân gian về sức sống của Dân ca Ví, Giặm trong đời sống hiện đại và nỗ lực đưa di sản vươn tầm thế giới.',
    duration: '09:58',
    date: '28/03/2026',
    category: 'Ẩm thực',
    image: blogImage('súp lươn xứ nghệ.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep3.mp4')
  },
  {
    id: '4',
    title: 'The Rhythm of Life on the Boat - Stories of Nghe An Fishermen',
    description: 'Ghé thăm làng sen quê Bác và những làng nghề truyền thống đang hồi sinh mạnh mẽ nhờ sự kết hợp giữa thủ công và tư duy du lịch mới.',
    duration: '41:10',
    date: '20/03/2026',
    category: 'Văn hóa',
    image: blogImage('Tiếng mẹ đẻ 02.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep4.mp4')
  }
];

const episodesVi: PodcastEpisode[] = [
  {
    id: '1',
    title: 'Tập 1: Một ngày làm người Nghệ – sống chậm giữa gió Lào',
    description: 'Hành trình âm thanh đưa bạn sâu vào lõi rừng quốc gia Pù Mát, nơi những loài thú quý hiếm và thảm thực vật nguyên sinh vẫn đang được bảo tồn.',
    duration: '10:45',
    date: '12/04/2026',
    category: 'Con người',
    image: blogImage('Tiếng mẹ đẻ 03.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep1 VN.mp4')
  },
  {
    id: '2',
    title: 'Tập 2: Biển không chỉ để tắm – câu chuyện phía sau Cửa Lò',
    description: 'Tìm hiểu về nguồn gốc và những bí quyết gia truyền tạo nên món súp lươn cay nồng, biểu tượng ẩm thực không thể trộn lẫn của người dân Nghệ An.',
    duration: '08:12',
    date: '05/04/2026',
    category: 'Thiên nhiên',
    image: blogImage('Cửa Lò 03.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep2 VN.mp4')
  },
  {
    id: '3',
    title: 'Tập 3: Bạn nghĩ mình đã thử súp lươn Nghệ An? Có thể… chưa đâu',
    description: 'Cuộc trò chuyện với các nghệ nhân dân gian về sức sống của Dân ca Ví, Giặm trong đời sống hiện đại và nỗ lực đưa di sản vươn tầm thế giới.',
    duration: '09:58',
    date: '28/03/2026',
    category: 'Ẩm thực',
    image: blogImage('súp lươn xứ nghệ.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep3 VN.mp4')
  },
  {
    id: '4',
    title: 'Tập 4: Nhịp sống trên thuyền - Đời ngư dân xứ Nghệ',
    description: 'Ghé thăm làng sen quê Bác và những làng nghề truyền thống đang hồi sinh mạnh mẽ nhờ sự kết hợp giữa thủ công và tư duy du lịch mới.',
    duration: '41:10',
    date: '20/03/2026',
    category: 'Văn hóa',
    image: blogImage('Tiếng mẹ đẻ 02.jpg'),
    mediaType: 'video',
    videoUrl: podcastVideo('Ep4 VN.mp4')
  }
];

export default function Podcast() {
  const { lang } = useI18n();
  const episodes = lang === 'vi' ? episodesVi : episodesEn;

  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(() => episodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [displayDuration, setDisplayDuration] = useState('--:--');
  const [durationsById, setDurationsById] = useState<Record<string, string>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [likedEpisodes, setLikedEpisodes] = useState<Set<string>>(new Set());
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(66);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeEpisodeRef = useRef<PodcastEpisode>(episodes[0]);
  const isRepeatRef = useRef(isRepeat);
  const handleNextRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeEpisodeRef.current = activeEpisode;
  }, [activeEpisode]);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const pauseActiveMedia = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  // Update volume when state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    pauseActiveMedia();
    setIsPlaying(false);
    setIsLoading(false);
    setShowPlayer(false);
    setDurationsById({});
    setDisplayDuration('--:--');
    setActiveEpisode(prev => episodes.find(e => e.id === prev.id) ?? episodes[0]);
  }, [lang]);

  useEffect(() => {
    setProgress(0);
    setCurrentTime('0:00');
    setDisplayDuration(durationsById[activeEpisode.id] ?? '--:--');
  }, [activeEpisode.id, durationsById]);

  useEffect(() => {
    if (isPlaying) return;
    const video = videoRef.current;
    if (!video || !activeEpisode.videoUrl) return;
    video.load();
  }, [activeEpisode.id, activeEpisode.videoUrl, isPlaying]);

  useEffect(() => {
    let cancelled = false;

    const loadOne = (ep: PodcastEpisode) =>
      new Promise<void>((resolve) => {
        if (!ep.videoUrl) {
          resolve();
          return;
        }

        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.muted = true;
        tempVideo.playsInline = true;

        const cleanup = () => {
          tempVideo.removeAttribute('src');
          tempVideo.load();
          resolve();
        };

        tempVideo.onloadedmetadata = () => {
          if (cancelled) {
            cleanup();
            return;
          }

          const duration = tempVideo.duration;
          if (Number.isFinite(duration) && duration > 0) {
            const formatted = formatTime(duration);
            setDurationsById(prev => (prev[ep.id] === formatted ? prev : { ...prev, [ep.id]: formatted }));

            if (activeEpisodeRef.current.id === ep.id) {
              setDisplayDuration(formatted);
            }
          }

          cleanup();
        };

        tempVideo.onerror = cleanup;
        tempVideo.src = ep.videoUrl;
        tempVideo.load();
      });

    (async () => {
      for (const ep of episodes) {
        if (cancelled) return;
        await loadOne(ep);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const togglePlay = (ep?: PodcastEpisode) => {
    const nextEpisode = ep ?? activeEpisode;
    const isSwitching = ep && ep.id !== activeEpisode.id;

    if (isSwitching) {
      pauseActiveMedia();
      setActiveEpisode(nextEpisode);
      setIsPlaying(false);
      setShowPlayer(true);
      setIsLoading(true);

      const video = videoRef.current;
      if (!video || !nextEpisode.videoUrl) {
        setIsLoading(false);
        return;
      }
      video.src = nextEpisode.videoUrl;
      video.currentTime = 0;
      video.volume = volume / 100;
      video.load();
      video.play().catch(() => setIsLoading(false));
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setShowPlayer(true);
      setIsLoading(true);
      video.play().catch(() => setIsLoading(false));
    } else {
      video.pause();
    }
  };

  const toggleLike = (id: string) => {
    setLikedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleNext = () => {
    const currentIndex = episodes.findIndex(e => e.id === activeEpisode.id);
    const nextIndex = isShuffle 
      ? Math.floor(Math.random() * episodes.length)
      : (currentIndex + 1) % episodes.length;
    togglePlay(episodes[nextIndex]);
  };

  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  const handlePrevious = () => {
    const currentIndex = episodes.findIndex(e => e.id === activeEpisode.id);
    const prevIndex = (currentIndex - 1 + episodes.length) % episodes.length;
    togglePlay(episodes[prevIndex]);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;

    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    video.currentTime = video.duration * ratio;
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setVolume(newVolume);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeEpisode.title,
        text: activeEpisode.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(lang === 'vi' ? 'Đã sao chép liên kết vào bộ nhớ tạm!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-red-600/30 pt-16">
      
      <video
        ref={videoRef}
        src={activeEpisode.videoUrl}
        playsInline
        preload="metadata"
        onCanPlay={() => setIsLoading(false)}
        onLoadedMetadata={(e) => {
          const duration = (e.currentTarget as HTMLVideoElement).duration;
          if (Number.isFinite(duration) && duration > 0) {
            const formatted = formatTime(duration);
            setDisplayDuration(formatted);
            const current = activeEpisodeRef.current;
            setDurationsById(prev => (prev[current.id] === formatted ? prev : { ...prev, [current.id]: formatted }));
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          setIsLoading(false);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          const video = e.currentTarget as HTMLVideoElement;
          const duration = video.duration;
          if (!Number.isFinite(duration) || duration <= 0) return;
          setProgress((video.currentTime / duration) * 100);
          setCurrentTime(formatTime(video.currentTime));
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (isRepeatRef.current) {
            const video = videoRef.current;
            if (video) {
              video.currentTime = 0;
              video.play().catch(() => {});
            }
          } else {
            handleNextRef.current();
          }
        }}
        style={{ position: 'fixed', left: '-1000px', top: '-1000px', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
      />

      {/* MAIN CONTENT AREA */}
      <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* HEADER SECTION (Spotify Style) */}
        <section className="flex flex-col md:flex-row items-end gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-64 h-64 md:w-72 md:h-72 flex-shrink-0 shadow-2xl shadow-black/10 rounded-lg overflow-hidden"
          >
            <img 
              src={activeEpisode.image} 
              alt={activeEpisode.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex-grow space-y-6">
            <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-red-500 mb-4">Podcast Series</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-black font-serif">
              {lang === 'vi' ? (
                <>
                  Âm thanh <br /> <span className="text-red-500 italic">Xứ Nghệ</span>
                </>
              ) : (
                <>
                  Sounds of <br /> <span className="text-red-500 italic">Nghe An</span>
                </>
              )}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Mic2 size={16} className="text-red-500" />
                <span>Nghệ An Portal</span>
              </div>
              <span>•</span>
              <span>{lang === 'vi' ? `${episodes.length} tập phát sóng` : `${episodes.length} episodes`}</span>
              <span>•</span>
              <span className="text-gray-400 italic">
                {lang === 'vi' ? 'Cẩm nhận văn hóa qua thính giác' : 'Experience culture through sound'}
              </span>
            </div>
          </div>
        </section>

        {/* ACTION BAR */}
        <div className="flex items-center gap-8 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => togglePlay()}
            className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/20 hover:bg-red-500 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
              />
            ) : isPlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" className="ml-1" />
            )}
          </motion.button>
          
          <button 
            onClick={() => toggleLike(activeEpisode.id)}
            className={`transition-colors ${likedEpisodes.has(activeEpisode.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
          >
            <Heart size={32} fill={likedEpisodes.has(activeEpisode.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleShare}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Share2 size={28} />
          </button>
        </div>

        {/* EPISODE TABLE */}
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_120px_100px] gap-4 px-4 py-3 border-b border-black/5 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
            <div className="text-center">#</div>
            <div>{lang === 'vi' ? 'Tiêu đề' : 'Title'}</div>
            <div className="hidden md:block">{lang === 'vi' ? 'Ngày đăng' : 'Date'}</div>
            <div className="text-right flex justify-end items-center gap-2">
              <Clock size={14} />
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-1">
            {episodes.map((ep, index) => (
              <motion.div
                key={ep.id}
                onMouseEnter={() => setHoveredId(ep.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => togglePlay(ep)}
                className={`grid grid-cols-[40px_1fr_120px_100px] gap-4 px-4 py-3 rounded-md cursor-pointer transition-colors group ${
                  activeEpisode.id === ep.id ? 'bg-black/5' : 'hover:bg-black/10'
                }`}
              >
                <div className="flex items-center justify-center text-sm font-medium text-gray-400">
                  {isLoading && activeEpisode.id === ep.id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"
                    />
                  ) : hoveredId === ep.id || (activeEpisode.id === ep.id && isPlaying) ? (
                    activeEpisode.id === ep.id && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-3">
                        <motion.div animate={{ height: [4, 12, 6, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-red-500" />
                        <motion.div animate={{ height: [10, 4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-red-500" />
                        <motion.div animate={{ height: [6, 10, 4, 12] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-red-500" />
                      </div>
                    ) : (
                      <Play size={14} fill="currentColor" className="text-black" />
                    )
                  ) : (
                    <span className={activeEpisode.id === ep.id ? 'text-red-500' : ''}>{index + 1}</span>
                  )}
                </div>

                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img src={ep.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="min-w-0">
                      <h3 className={`text-sm font-bold truncate ${activeEpisode.id === ep.id ? 'text-red-500' : 'text-black'}`}>
                        {ep.title}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">{ep.category}</p>
                    </div>
                    {likedEpisodes.has(ep.id) && <Heart size={14} className="text-red-600 flex-shrink-0" fill="currentColor" />}
                  </div>
                </div>

                <div className="hidden md:flex items-center text-xs text-gray-400 font-medium">
                  {ep.date}
                </div>

                <div className="flex items-center justify-end text-xs text-gray-400 font-medium">
                  {durationsById[ep.id] ?? '--:--'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED PLAYER BAR (Spotify Style) */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 h-24 bg-white/95 backdrop-blur-md border border-black/5 shadow-2xl rounded-2xl px-4 md:px-6 z-[60] flex items-center justify-between"
          >
            
            {/* Current Track Info */}
            <div className="flex items-center gap-4 w-1/4 min-w-0">
              <div className="w-14 h-14 rounded-lg shadow-lg overflow-hidden flex-shrink-0">
                <img src={activeEpisode.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <h4 className="text-sm font-bold text-black truncate hover:underline cursor-pointer">{activeEpisode.title}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{activeEpisode.category}</p>
              </div>
              <button 
                onClick={() => toggleLike(activeEpisode.id)}
                className={`ml-2 flex-shrink-0 transition-colors ${likedEpisodes.has(activeEpisode.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart size={18} fill={likedEpisodes.has(activeEpisode.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`transition-colors hidden sm:block ${isShuffle ? 'text-red-600' : 'text-gray-400 hover:text-black'}`}
                >
                  <Shuffle size={18} />
                </button>
                <button 
                  onClick={handlePrevious}
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <SkipBack size={24} fill="currentColor" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => togglePlay()}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  )}
                </motion.button>
                <button 
                  onClick={handleNext}
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <SkipForward size={24} fill="currentColor" />
                </button>
                <button 
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`transition-colors hidden sm:block ${isRepeat ? 'text-red-600' : 'text-gray-400 hover:text-black'}`}
                >
                  <Repeat size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-3 w-full">
                <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{currentTime}</span>
                <div 
                  className="flex-grow h-1.5 bg-black/5 rounded-full overflow-hidden group cursor-pointer relative"
                  onClick={handleSeek}
                >
                  <div 
                    className="absolute inset-0 bg-red-600 group-hover:bg-red-500 transition-colors" 
                    style={{ width: `${progress}%` }} 
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 w-8">{displayDuration}</span>
              </div>
            </div>

            {/* Extra Controls */}
            <div className="flex items-center justify-end gap-4 w-1/4">
              <div className="flex items-center gap-2 group">
                <button onClick={() => setVolume(v => v === 0 ? 66 : 0)}>
                  <Volume2 size={18} className={`${volume === 0 ? 'text-gray-300' : 'text-gray-400'} group-hover:text-black transition-colors`} />
                </button>
                <div 
                  className="w-24 h-1 bg-black/5 rounded-full overflow-hidden hidden sm:block cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="h-full bg-black group-hover:bg-red-600 transition-colors" 
                    style={{ width: `${volume}%` }}
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  pauseActiveMedia();
                  setIsPlaying(false);
                  setShowPlayer(false);
                }}
                className="text-gray-400 hover:text-red-600 transition-colors ml-2"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH OVERLAY (Minimalist) */}
      <div className="fixed top-24 right-8 z-40">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={lang === 'vi' ? 'Tìm kiếm tập phát sóng...' : 'Search episodes...'}
            className="bg-black/5 border border-black/10 rounded-full py-3 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-red-600/50 w-64 transition-all focus:w-80 text-black"
          />
        </div>
      </div>

    </div>
  );
}
