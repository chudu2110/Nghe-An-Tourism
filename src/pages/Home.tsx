import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight, MapPin, Calendar, Compass, Utensils, Home as HomeIcon, BookOpen, ChevronLeft, ChevronRight, Grid, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import Card from '../components/Card';
import BookingSection from '../components/BookingSection';
import { destinations, experiences, foodAndCulture } from '../data/ngheAnData';
import { useI18n } from '../i18n';

const monthHeaderImage = (fileName: string) =>
  new URL(`../../Home img/12 month header/${fileName}`, import.meta.url).href;

const monthHeaderVideo = (fileName: string) =>
  new URL(`../../Home img/12 month header/${fileName}`, import.meta.url).href;

const homeBodyImage = (fileName: string) =>
  new URL(`../../Home img/Body img/${fileName}`, import.meta.url).href;

type HeroMedia =
  | { kind: 'image'; src: string }
  | { kind: 'video'; src: string };

const HERO_VIDEO_SOUND_PREF_KEY = 'heroVideoSoundEnabled';

const monthMedia: Record<string, HeroMedia> = {
  Jan: { kind: 'video', src: monthHeaderVideo('Jan Header.mp4') },
  Feb: { kind: 'video', src: monthHeaderVideo('Feb Header.mp4') },
  Mar: { kind: 'video', src: monthHeaderVideo('March Header.mp4') },
  Apr: { kind: 'video', src: monthHeaderVideo('April Header.mp4') },
  May: { kind: 'video', src: monthHeaderVideo('May Header.mp4') },
  Jun: { kind: 'video', src: monthHeaderVideo('June Header.mp4') },
  Jul: { kind: 'video', src: monthHeaderVideo('July Header.mp4') },
  Aug: { kind: 'video', src: monthHeaderVideo('Aug Header.mp4') },
  Sep: { kind: 'video', src: monthHeaderVideo('Sep Header.mp4') },
  Oct: { kind: 'video', src: monthHeaderVideo('Oct Header.mp4') },
  Nov: { kind: 'video', src: monthHeaderVideo('Nov header.mp4') },
  Dec: { kind: 'video', src: monthHeaderVideo('Dec Header.mp4') },
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return reduced;
}

async function preloadAndDecodeImage(src: string) {
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });

  const img = new Image();
  img.src = src;
  if (typeof img.decode === 'function') {
    try {
      await img.decode();
    } catch {}
  }
}

async function preloadVideo(src: string) {
  await new Promise<void>((resolve, reject) => {
    const v = document.createElement('video');
    v.preload = 'auto';
    v.muted = true;
    v.playsInline = true;
    const timeoutId = window.setTimeout(() => resolve(), 2500);
    const done = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };
    const fail = () => {
      window.clearTimeout(timeoutId);
      reject(new Error(`Failed to preload video: ${src}`));
    };
    v.onloadeddata = done;
    v.onloadedmetadata = done;
    v.oncanplay = done;
    v.onerror = fail;
    v.src = src;
    try {
      v.load();
    } catch {}
  });
}

export default function Home() {
  const [requestedMonthIndex, setRequestedMonthIndex] = useState(new Date().getMonth());
  const [displayedMonthIndex, setDisplayedMonthIndex] = useState(new Date().getMonth());
  const requestedMonth = months[requestedMonthIndex];
  const displayedMonth = months[displayedMonthIndex];
  const displayedHeroMedia = monthMedia[displayedMonth];
  const isDisplayedHeroVideo = displayedHeroMedia.kind === 'video';
  const { t } = useI18n();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroSize, setHeroSize] = useState({ w: 0, h: 0 });
  const [hasHeroAudioGesture, setHasHeroAudioGesture] = useState(false);
  const [heroVolume, setHeroVolume] = useState(0.35);
  const [heroUserMuted, setHeroUserMuted] = useState(true);
  const [heroSoundReady, setHeroSoundReady] = useState(false);
  const [heroUserPaused, setHeroUserPaused] = useState(false);
  const [heroVideoPaused, setHeroVideoPaused] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [showHeroIntro, setShowHeroIntro] = useState(false);
  const [heroIntroHasRun, setHeroIntroHasRun] = useState(false);
  const heroDragRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    basePanX: number;
    basePanY: number;
  }>({ pointerId: null, startX: 0, startY: 0, basePanX: 0, basePanY: 0 });
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScrollClamped = useTransform(heroScrollYProgress, (v) => Math.max(0, Math.min(1, v)));
  const heroBgY = useTransform(heroScrollClamped, [0, 1], [0, 0]);
  const heroOverlayOpacity = useTransform(heroScrollClamped, [0, 1], [0.15, 0.4]);
  const heroLoadSeq = useRef(0);
  const heroPreloaded = useRef<Set<string>>(new Set());
  const heroPanXRaw = useMotionValue(0);
  const heroPanYRaw = useMotionValue(0);
  const heroMouseXRaw = useMotionValue(0);
  const heroMouseYRaw = useMotionValue(0);
  const heroPanX = useSpring(heroPanXRaw, { stiffness: 120, damping: 26, mass: 0.5 });
  const heroPanY = useSpring(heroPanYRaw, { stiffness: 120, damping: 26, mass: 0.5 });
  const heroMouseX = useSpring(heroMouseXRaw, { stiffness: 140, damping: 28, mass: 0.5 });
  const heroMouseY = useSpring(heroMouseYRaw, { stiffness: 140, damping: 28, mass: 0.5 });
  const heroY = useTransform([heroBgY, heroPanY], ([a, b]) => (a as number) + (b as number));
  const heroMediaScale = reduceMotion ? 1 : isDisplayedHeroVideo ? 1.15 : 1.1;
  const heroPanXMax = useMemo(() => {
    if (!heroSize.w) return 80;
    return Math.max(30, (heroMediaScale - 1) * (heroSize.w / 2) - 10);
  }, [heroMediaScale, heroSize.w]);
  const heroPanYMax = useMemo(() => {
    if (!heroSize.h) return 50;
    return Math.max(20, (heroMediaScale - 1) * (heroSize.h / 2) - 10);
  }, [heroMediaScale, heroSize.h]);
  const heroRotY = useTransform(heroPanX, (v) => (v / heroPanXMax) * 22);
  const heroRotX = useTransform(heroPanY, (v) => (-v / heroPanYMax) * 14);
  const heroSpecular = useTransform([heroMouseX, heroMouseY], ([x, y]) => {
    const xp = 50 + (x as number) * 22;
    const yp = 50 + (y as number) * 18;
    return `radial-gradient(900px circle at ${xp}% ${yp}%, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 22%, transparent 55%)`;
  });
  const heroConcaveShade = useTransform([heroMouseX, heroMouseY], ([x, y]) => {
    const xp = 50 + (x as number) * 10;
    const yp = 50 + (y as number) * 8;
    const xOpp = 50 - (x as number) * 8;
    const yOpp = 50 - (y as number) * 6;
    return `radial-gradient(120% 90% at 50% 50%, rgba(255,255,255,0.06), transparent 55%), radial-gradient(130% 110% at ${xOpp}% ${yOpp}%, rgba(0,0,0,0.18), transparent 60%), radial-gradient(120% 110% at ${xp}% ${yp}%, rgba(0,0,0,0.12), transparent 62%)`;
  });
  const featuredDestinationsRef = useRef<HTMLDivElement | null>(null);
  const [showFloatingWidgets, setShowFloatingWidgets] = useState(false);

  const heroIntroTop = t('Chào mừng đến với Nghệ An');
  const heroIntroMain = t('Khám phá trái tim miền Trung');
  const heroIntroTopChars = useMemo(() => Array.from(heroIntroTop), [heroIntroTop]);
  const heroIntroMainWords = useMemo(() => heroIntroMain.trim().split(/\s+/).filter(Boolean), [heroIntroMain]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const update = () => setHeroSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const enabled = window.localStorage.getItem(HERO_VIDEO_SOUND_PREF_KEY) === '1';
    setHasHeroAudioGesture(enabled);
    setHeroUserMuted(!enabled);
    setHeroSoundReady(false);
    setHeroUserPaused(false);
  }, []);

  useEffect(() => {
    if (!showHeroIntro) return;
    const id = window.setTimeout(() => setShowHeroIntro(false), 6500);
    return () => window.clearTimeout(id);
  }, [showHeroIntro]);

  useEffect(() => {
    if (heroIntroHasRun) return;
    const media = monthMedia[displayedMonth];
    const src = media?.src;
    if (!src) return;

    let cancelled = false;
    let startId: number | null = null;

    const run = async () => {
      try {
        if (media.kind === 'video') await preloadVideo(src);
        else await preloadAndDecodeImage(src);
      } catch {}

      if (cancelled) return;
      startId = window.setTimeout(() => {
        if (cancelled) return;
        setShowHeroIntro(true);
        setHeroIntroHasRun(true);
      }, 420);
    };

    run();

    return () => {
      cancelled = true;
      if (startId) window.clearTimeout(startId);
    };
  }, [displayedMonth, heroIntroHasRun]);

  useEffect(() => {
    const el = featuredDestinationsRef.current;
    if (!el) return;
    if (showFloatingWidgets) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setShowFloatingWidgets(true);
        obs.disconnect();
      },
      { threshold: 0.25 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [showFloatingWidgets]);

  useEffect(() => {
    setHeroSoundReady(false);
    setHeroUserPaused(false);
    if (heroVideoRef.current) heroVideoRef.current.volume = heroVolume;
  }, [displayedMonth]);

  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.volume = heroVolume;
  }, [heroVolume]);

  useEffect(() => {
    if (!isDisplayedHeroVideo) return;
    const section = heroRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const inView = Boolean(entry?.isIntersecting) && (entry?.intersectionRatio ?? 0) >= 0.35;
        setIsHeroInView(inView);
      },
      { threshold: [0, 0.2, 0.35, 0.6, 1] }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, [isDisplayedHeroVideo]);

  useEffect(() => {
    if (!isDisplayedHeroVideo) return;
    let cleanup: (() => void) | null = null;
    const id = window.setTimeout(() => {
      const v = heroVideoRef.current;
      if (!v) return;
      const sync = () => {
        setHeroVideoPaused(v.paused);
        setHeroSoundReady(!v.muted && !v.paused);
      };
      sync();
      v.addEventListener('play', sync);
      v.addEventListener('pause', sync);
      v.addEventListener('volumechange', sync);
      cleanup = () => {
        v.removeEventListener('play', sync);
        v.removeEventListener('pause', sync);
        v.removeEventListener('volumechange', sync);
      };
    }, 0);
    return () => {
      window.clearTimeout(id);
      cleanup?.();
    };
  }, [displayedMonth, isDisplayedHeroVideo]);

  useEffect(() => {
    if (!isDisplayedHeroVideo) return;
    const v = heroVideoRef.current;
    if (!v) return;

    if (!isHeroInView) {
      v.muted = true;
      setHeroSoundReady(false);
      setHeroVideoPaused(true);
      try {
        v.pause();
      } catch {}
      return;
    }

    if (heroUserPaused) {
      setHeroVideoPaused(true);
      try {
        v.pause();
      } catch {}
      return;
    }

    const attemptPlay = async (expectSound: boolean) => {
      try {
        await v.play();
        setHeroVideoPaused(false);
        if (expectSound) setHeroSoundReady(true);
      } catch {
        setHeroVideoPaused(true);
        if (expectSound) setHeroSoundReady(false);
      }
    };

    v.volume = heroVolume;
    if (heroUserMuted) {
      v.muted = true;
      setHeroSoundReady(false);
      void attemptPlay(false);
      return;
    } else if (hasHeroAudioGesture) {
      v.muted = false;
      void attemptPlay(true);
      return;
    } else {
      v.muted = true;
      setHeroSoundReady(false);
      void attemptPlay(false);
      return;
    }
  }, [displayedMonth, hasHeroAudioGesture, heroUserMuted, heroUserPaused, heroVolume, isDisplayedHeroVideo, isHeroInView]);

  useEffect(() => {
    if (!isDisplayedHeroVideo) return;
    if (heroUserMuted) return;
    if (hasHeroAudioGesture) return;

    const enableFromAnyGesture = () => {
      if (heroUserMuted) return;
      setHasHeroAudioGesture(true);
      window.localStorage.setItem(HERO_VIDEO_SOUND_PREF_KEY, '1');
      void tryEnableHeroVideoSound();
    };

    window.addEventListener('pointerdown', enableFromAnyGesture, true);
    window.addEventListener('keydown', enableFromAnyGesture, true);
    window.addEventListener('wheel', enableFromAnyGesture as any, { capture: true, passive: true } as any);
    window.addEventListener('touchstart', enableFromAnyGesture as any, { capture: true, passive: true } as any);

    return () => {
      window.removeEventListener('pointerdown', enableFromAnyGesture, true);
      window.removeEventListener('keydown', enableFromAnyGesture, true);
      window.removeEventListener('wheel', enableFromAnyGesture as any, true);
      window.removeEventListener('touchstart', enableFromAnyGesture as any, true);
    };
  }, [displayedMonth, hasHeroAudioGesture, heroUserMuted, heroVolume, isDisplayedHeroVideo]);

  useEffect(() => {
    setDisplayedMonthIndex(requestedMonthIndex);
    const media = monthMedia[requestedMonth];
    const src = media?.src;
    const seq = ++heroLoadSeq.current;

    const run = async () => {
      if (!src) return;
      if (heroPreloaded.current.has(src)) return;
      try {
        if (media.kind === 'video') await preloadVideo(src);
        else await preloadAndDecodeImage(src);
      } catch {}
      if (seq !== heroLoadSeq.current) return;
      heroPreloaded.current.add(src);
    };

    void run();
  }, [requestedMonth, requestedMonthIndex]);

  useEffect(() => {
    const preloadTargets = [
      monthMedia[months[(displayedMonthIndex + 1) % months.length]],
      monthMedia[months[(displayedMonthIndex + 2) % months.length]],
      monthMedia[months[(displayedMonthIndex - 1 + months.length) % months.length]],
    ].filter(Boolean) as HeroMedia[];

    const run = async () => {
      for (const m of preloadTargets) {
        const src = m.src;
        if (!src) continue;
        if (heroPreloaded.current.has(src)) continue;
        try {
          if (m.kind === 'video') await preloadVideo(src);
          else await preloadAndDecodeImage(src);
        } catch {}
        heroPreloaded.current.add(src);
      }
    };

    const w = window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(() => run(), { timeout: 800 });
      return () => {
        if (typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(id);
      };
    }

    const id = window.setTimeout(() => run(), 300);
    return () => window.clearTimeout(id);
  }, [displayedMonthIndex]);

  const getServicePath = (service: string) => {
    if (service === 'Tư vấn Tour') return '/planning';
    if (service === 'Thuê xe') return '/booking';
    if (service === 'Đặt phòng') return '/booking';
    if (service === 'Dịch vụ Guide') return '/volunteers';
    return '/booking';
  };

  const nextMonth = () => {
    setRequestedMonthIndex((prev) => (prev + 1) % months.length);
  };

  const prevMonth = () => {
    setRequestedMonthIndex((prev) => (prev - 1 + months.length) % months.length);
  };

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const tryEnableHeroVideoSound = async () => {
    if (!isDisplayedHeroVideo) return;
    if (heroUserMuted) return;
    const v = heroVideoRef.current;
    if (!v) return;
    try {
      v.muted = false;
      v.volume = heroVolume;
      await v.play();
      setHeroSoundReady(true);
      setHeroVideoPaused(false);
    } catch {
      setHeroSoundReady(false);
      setHeroVideoPaused(true);
    }
  };

  const onHeroPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    if (!isDisplayedHeroVideo) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('[data-hero-control]')) return;
    if (target?.closest('[data-hero-ui]')) return;
    if (!hasHeroAudioGesture) setHasHeroAudioGesture(true);
    void tryEnableHeroVideoSound();
    const el = heroRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    heroDragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      basePanX: heroPanXRaw.get(),
      basePanY: heroPanYRaw.get(),
    };
  };

  const onHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const el = heroRef.current;
    if (!el) return;
    const drag = heroDragRef.current;
    if (isDisplayedHeroVideo && drag.pointerId === e.pointerId) {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const nextX = clamp(drag.basePanX + dx * 1.25, -heroPanXMax, heroPanXMax);
      const nextY = clamp(drag.basePanY + dy * 0.9, -heroPanYMax, heroPanYMax);
      heroPanXRaw.set(nextX);
      heroPanYRaw.set(nextY);
      heroMouseXRaw.set(nextX / heroPanXMax);
      heroMouseYRaw.set(nextY / heroPanYMax);
      return;
    }

    if (e.pointerType === 'touch') return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    let cx = clamp(nx, -1, 1);
    let cy = clamp(ny, -1, 1);
    
    // Calculate distance from center [0, 1.414]
    const dist = Math.sqrt(cx * cx + cy * cy);
    
    // Smoothly fade the 360 effect to 0 when moving towards the corners/edges.
    // The effect will peak around the middle area and disappear at the 4 corners.
    const factor = Math.max(0, 1 - Math.pow(dist, 1.5));
    cx *= factor;
    cy *= factor;

    heroPanXRaw.set(cx * Math.min(110, heroPanXMax));
    heroPanYRaw.set(cy * Math.min(70, heroPanYMax));
    heroMouseXRaw.set(cx);
    heroMouseYRaw.set(cy);
  };

  const onHeroPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    const drag = heroDragRef.current;
    if (drag.pointerId !== e.pointerId) return;
    heroDragRef.current.pointerId = null;
  };

  const onHeroWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (reduceMotion) return;
    if (!isDisplayedHeroVideo) return;
    if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
      heroPanXRaw.set(0);
      heroMouseXRaw.set(0);
      return;
    }
    const nextX = clamp(heroPanXRaw.get() - e.deltaX * 0.6, -heroPanXMax, heroPanXMax);
    heroPanXRaw.set(nextX);
    heroMouseXRaw.set(nextX / heroPanXMax);
  };

  const onHeroPointerLeave = () => {
    heroDragRef.current.pointerId = null;
    heroPanXRaw.set(0);
    heroPanYRaw.set(0);
    heroMouseXRaw.set(0);
    heroMouseYRaw.set(0);
  };

  const heroIsSoundOn = !heroUserMuted && hasHeroAudioGesture && heroSoundReady;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative"
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        onPointerDown={onHeroPointerDown}
        onPointerMove={onHeroPointerMove}
        onPointerUp={onHeroPointerUp}
        onPointerCancel={onHeroPointerUp}
        onWheel={onHeroWheel}
        onPointerLeave={onHeroPointerLeave}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="sync" initial={false}>
            {displayedHeroMedia.kind === 'video' ? (
              <motion.video
                key={displayedMonth}
                ref={heroVideoRef}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={reduceMotion ? undefined : { duration: 0.35, ease: 'linear' }}
                src={displayedHeroMedia.src}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                autoPlay
                muted={!hasHeroAudioGesture || heroUserMuted}
                preload="auto"
                onEnded={nextMonth}
                onCanPlay={() => {
                  if (heroUserPaused) return;
                  const v = heroVideoRef.current;
                  if (!v) return;
                  try {
                    void v.play();
                  } catch {}
                }}
                style={{
                  x: 0,
                  y: 0,
                  scale: reduceMotion ? 1 : 1.15,
                  filter: reduceMotion ? undefined : 'none',
                  transformPerspective: 1000,
                  transformStyle: 'preserve-3d',
                  rotateX: reduceMotion ? 0 : heroRotX,
                  rotateY: reduceMotion ? 0 : heroRotY,
                  willChange: 'transform',
                }}
              />
            ) : (
              <motion.img
                key={displayedMonth}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={reduceMotion ? undefined : { duration: 0.35, ease: 'linear' }}
                src={displayedHeroMedia.src}
                alt={t('Nghệ An in {month}', { month: displayedMonth })}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                decoding="async"
                fetchPriority="high"
                loading="eager"
                style={{
                  x: 0,
                  y: 0,
                  scale: reduceMotion ? 1 : 1.1,
                  filter: reduceMotion ? undefined : 'none',
                  transformPerspective: 1000,
                  transformStyle: 'preserve-3d',
                  rotateX: reduceMotion ? 0 : heroRotX,
                  rotateY: reduceMotion ? 0 : heroRotY,
                  willChange: 'transform',
                }}
              />
            )}
          </AnimatePresence>
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: heroConcaveShade,
              opacity: reduceMotion ? 0 : 0.5,
              mixBlendMode: 'multiply',
            }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: heroSpecular,
              opacity: reduceMotion ? 0 : 0.38,
              mixBlendMode: 'overlay',
            }}
          />
          <motion.div className="absolute inset-0 bg-black/20" style={{ opacity: heroOverlayOpacity }} />
        </div>

        {isDisplayedHeroVideo && (
          <div className="absolute bottom-8 right-4 sm:right-8 lg:right-16 z-20 flex items-center gap-4">
            <div>
              <button
                type="button"
                data-hero-control
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const nextMuted = !heroUserMuted;
                  setHeroUserMuted(nextMuted);
                  window.localStorage.setItem(HERO_VIDEO_SOUND_PREF_KEY, nextMuted ? '0' : '1');
                  const v = heroVideoRef.current;
                  if (v) {
                    if (nextMuted) {
                      v.muted = true;
                      setHeroSoundReady(false);
                    } else {
                      if (!hasHeroAudioGesture) setHasHeroAudioGesture(true);
                      setHeroUserPaused(false);
                      v.muted = false;
                      v.volume = heroVolume;
                      void tryEnableHeroVideoSound();
                    }
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-12 h-12 flex items-center justify-center text-white/90 hover:text-white transition-colors drop-shadow-lg"
                aria-label={t('Âm lượng')}
              >
                {heroIsSoundOn ? <Volume2 size={26} /> : <VolumeX size={26} />}
              </button>
            </div>
            <div>
              <button
                type="button"
                data-hero-control
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const v = heroVideoRef.current;
                  if (!v) return;
                  if (v.paused) {
                    setHeroUserPaused(false);
                    if (!heroUserMuted && hasHeroAudioGesture) {
                      void tryEnableHeroVideoSound();
                      return;
                    }
                    try {
                      void v.play();
                    } catch {}
                    return;
                  }
                  setHeroUserPaused(true);
                  try {
                    v.pause();
                  } catch {}
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-12 h-12 rounded-full border-2 border-white/80 text-white/90 hover:text-white hover:border-white transition-colors flex items-center justify-center drop-shadow-lg"
                aria-label={t('Tạm dừng')}
              >
                {heroVideoPaused ? <Play size={22} /> : <Pause size={22} />}
              </button>
            </div>
          </div>
        )}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
          <AnimatePresence initial={false}>
            {showHeroIntro && (
              <motion.div
                key="hero-intro"
                initial={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.98 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
                transition={reduceMotion ? undefined : { type: 'spring', stiffness: 220, damping: 20, mass: 0.5 }}
                className="flex flex-col items-center gap-4"
                style={reduceMotion ? undefined : { perspective: 1000 }}
              >
                {reduceMotion ? (
                  <>
                    <p className="text-white font-bold tracking-[0.24em] uppercase text-sm md:text-base">
                      {heroIntroTop}
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight font-serif leading-[1.05]">
                      {heroIntroMain}
                    </h1>
                  </>
                ) : (
                  <>
                    <motion.p
                      aria-label={heroIntroTop}
                      initial={{ opacity: 0, y: 18, filter: 'blur(16px)', clipPath: 'inset(0 0 100% 0)' }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        clipPath: 'inset(0 0 0% 0)',
                        x: [0, -8, 7, -4, 0],
                      }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(14px)' }}
                      transition={{
                        duration: 0.95,
                        ease: [0.16, 1, 0.3, 1],
                        x: { duration: 0.22, ease: 'linear', delay: 0.48 },
                      }}
                      className="text-white font-bold tracking-[0.24em] uppercase text-sm md:text-base"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {heroIntroTopChars.map((ch, i) => (
                        <motion.span
                          key={`${ch}-${i}`}
                          aria-hidden
                          initial={{ opacity: 0, y: 26, rotateX: 120, rotateZ: -2.5, filter: 'blur(18px)' }}
                          animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, filter: 'blur(0px)' }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 + i * 0.03 }}
                          className="inline-block"
                          style={{ transformOrigin: '50% 100%' }}
                        >
                          {ch === ' ' ? '\u00A0' : ch}
                        </motion.span>
                      ))}
                    </motion.p>

                    <motion.h1
                      aria-label={heroIntroMain}
                      initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: 65, rotateZ: -1.2, filter: 'blur(22px)', clipPath: 'inset(0 100% 0 0)' }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        rotateZ: 0,
                        filter: 'blur(0px)',
                        clipPath: 'inset(0 0% 0 0)',
                      }}
                      exit={{ opacity: 0, y: -18, scale: 0.98, rotateX: 10, filter: 'blur(14px)' }}
                      transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight font-serif leading-[1.05]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <span className="relative inline-block overflow-visible align-bottom pb-2">
                        <motion.span
                          aria-hidden
                          className="absolute inset-0"
                          initial={{ x: '-140%', opacity: 0 }}
                          animate={{ x: '140%', opacity: [0, 1, 0] }}
                          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
                          style={{
                            backgroundImage:
                              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.26) 20%, rgba(255,255,255,0.06) 50%, transparent 100%)',
                            mixBlendMode: 'overlay',
                          }}
                        />
                        <span className="relative">
                          {heroIntroMainWords.map((word, i) => (
                            <motion.span
                              key={`${word}-${i}`}
                              aria-hidden
                              initial={{ opacity: 0, y: 34, rotateX: 95, rotateZ: -0.8, filter: 'blur(26px)' }}
                              animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, filter: 'blur(0px)' }}
                              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.65 + i * 0.11 }}
                              className="inline-block"
                              style={{ transformOrigin: '50% 100%' }}
                            >
                              {word}
                              {i < heroIntroMainWords.length - 1 ? '\u00A0' : null}
                            </motion.span>
                          ))}
                        </span>
                      </span>
                    </motion.h1>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Month Selector - Left Aligned */}
        <div data-hero-ui className="absolute bottom-12 left-4 sm:left-8 lg:left-16 z-20 flex items-center space-x-6 md:space-x-10 text-white">
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
                const diff = (idx - requestedMonthIndex + months.length) % months.length;
                const isVisible = diff <= 2 || diff >= months.length - 2;
                
                if (!isVisible) return null;

                return (
                  <button
                    key={month}
                    onClick={() => setRequestedMonthIndex(idx)}
                    className={`text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 shrink-0 ${
                      idx === requestedMonthIndex ? 'text-white scale-110' : 'text-white/50 hover:text-white/80'
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
          animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
          transition={reduceMotion ? undefined : { repeat: Infinity, duration: 2 }}
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
            <motion.img
              src={homeBodyImage('mô tê răng rứa.webp')}
              alt="Nghệ An Culture"
              className="rounded-sm shadow-2xl"
              referrerPolicy="no-referrer"
              whileHover={reduceMotion ? undefined : { scale: 1.02, rotate: -0.3 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-xl hidden md:block max-w-xs">
              <p className="text-red-600 font-bold text-4xl mb-2">{t('"Mô, tê, răng, rứa"')}</p>
              <p className="text-gray-600 text-sm">{t('Giọng nói đặc trưng, ấm áp và chân tình của người dân xứ Nghệ.')}</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Featured Destinations - Bento Grid Layout */}
      <div ref={featuredDestinationsRef}>
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
      </div>

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
      <BookingSection showFloatingWidgets={showFloatingWidgets} />

      {/* Food & Culture */}
      <Section title={t('Ẩm thực & Văn hóa')} subtitle={t('Hương vị và tâm hồn xứ Nghệ')} dark>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {foodAndCulture.map((item) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? undefined : { opacity: 0, y: 26, scale: 0.98 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
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
            </motion.div>
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
                  animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                  transition={reduceMotion ? undefined : { repeat: Infinity, duration: 4 }}
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
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          animate={reduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage:
              'linear-gradient(120deg, rgba(239,68,68,0.10), rgba(255,255,255,0.03), rgba(239,68,68,0.08))',
            backgroundSize: '200% 200%',
          }}
        />

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
    </motion.div>
  );
}
