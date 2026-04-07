import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const foodCultureImage = (fileName: string) =>
  new URL(`../../Food&Culture img/${fileName}`, import.meta.url).href;

const viGiamSound = new URL('../../Sound/Đừng Trách Câu Ví Dặm  - Cáp Anh Tài  Lê Thu Uyên  Dân Ca Xứ Nghệ Hot Nhất 2024.mp3', import.meta.url).href;

export default function FoodCulture() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(viGiamSound);
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="pt-20 bg-[#faf9f6] overflow-hidden selection:bg-red-100 selection:text-red-900">
      {/* Hero Section - KEPT AS REQUESTED */}
      <section className="relative h-[90vh] bg-gray-950 text-white overflow-hidden">
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0"
        >
          <img 
            src={foodCultureImage('Header.jpg')}
            alt={t('Ảnh nền')}
            className="w-full h-full object-cover opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="h-[1px] w-12 bg-red-600" />
                  <span className="text-red-500 font-mono text-[10px] font-bold tracking-[0.5em] uppercase">
                    {t('Di sản & Hương vị')}
                  </span>
                </div>
                <h1 className={`text-5xl md:text-[8.5rem] font-bold mb-10 font-serif ${lang === 'vi' ? 'leading-[1.2]' : 'leading-[1.0]'} tracking-tighter`}>
                  {t('Hồn cốt')} <br />
                  <span className="italic text-red-600 ml-4 md:ml-20">{t('Xứ Nghệ')}</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mb-12 leading-relaxed font-light">
                  {t('Khám phá chiều sâu văn hóa qua những làn điệu Ví Giặm và hương vị đậm đà của những món ăn đã đi vào thơ ca, nhạc họa.')}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                  {[
                    { label: t('Di sản UNESCO'), value: '01' },
                    { label: t('Làng nghề truyền thống'), value: '30+' },
                    { label: t('Lễ hội hàng năm'), value: '100+' },
                    { label: t('Đặc sản địa phương'), value: '50+' }
                  ].map((stat, i) => (
                    <div key={i} className="group">
                      <div className="text-3xl font-bold mb-1 group-hover:text-red-500 transition-colors">{stat.value}</div>
                      <div className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Culinary Philosophy - High-End Editorial */}
      <section className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-60" />
              <motion.div 
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[4/5] overflow-hidden rounded-sm shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.1)]"
              >
                <img 
                  src={foodCultureImage('mặn mòi vị đất Lam.jpg')}
                  alt={t('Chi tiết ẩm thực')}
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2s]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -bottom-12 -right-12 bg-gray-950 text-white p-10 max-w-xs hidden lg:block">
                <div className="text-red-600 mb-6 text-6xl font-serif">“</div>
                <p className="text-sm font-light leading-relaxed italic">
                  {t('"Người Nghệ ăn cay để chống chọi với cái rét, ăn mặn để nhớ về biển cả, và nấu nướng bằng cả tấm lòng chân chất."')}
                </p>
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-6">
                <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px] block">{t('Triết lý vị giác')}</span>
                <h2 className="text-6xl md:text-8xl font-bold font-serif leading-[0.9] tracking-tighter text-gray-900">
                  {t('Mặn mòi')} <br /> <span className="text-red-600 italic">{t('vị đất Lam')}</span>
                </h2>
              </div>
              
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                {t('Ẩm thực Nghệ An là sự kết tinh của sự kiên cường và khéo léo. Không phô trương, nhưng mỗi món ăn đều mang trong mình một câu chuyện về lịch sử và con người.')}
              </p>

              <div className="grid grid-cols-1 gap-10 pt-8">
                {[
                  { 
                    title: 'Hành Tăm (Củ Nén)', 
                    desc: 'Linh hồn của món lươn, mang vị cay nồng đặc trưng giúp cân bằng tính hàn.',
                    num: '01'
                  },
                  { 
                    title: 'Tương Nam Đàn', 
                    desc: 'Được ủ từ đậu nành và nếp thơm, là gia vị không thể thiếu trong mâm cơm gia đình.',
                    num: '02'
                  },
                  { 
                    title: 'Mật Mía Nghĩa Đàn', 
                    desc: 'Vị ngọt thanh khiết từ những cánh đồng mía ngút ngàn, thay thế cho đường tinh luyện.',
                    num: '03'
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-6 group"
                  >
                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-500">
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-tighter">
                        {item.num}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">{t(item.title)}</h4>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">{t(item.desc)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Culinary Gallery - Asymmetric Breakthrough */}
      <section className="py-40 bg-[#0a0a0a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32">
            <div className="space-y-6">
              <span className="text-red-500 font-bold tracking-[0.4em] uppercase text-[10px] block">{t('Danh mục đặc sản')}</span>
              <h2 className="text-6xl md:text-9xl font-bold font-serif leading-none tracking-tighter">
                {t('Tinh hoa')} <br /> <span className="text-red-500 italic">{t('ẩm thực')}</span>
              </h2>
            </div>
            <div className="max-w-xs text-right mt-12 md:mt-0">
              <p className="text-gray-500 text-sm font-light italic leading-relaxed">
                {t('"Ăn một miếng bánh mướt, nghe cả cánh đồng lúa chín trong lòng."')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Main Feature */}
            <div className="md:col-span-7 space-y-12">
              <motion.div
                id="banh-muot-thanh-chuong"
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.7 }}
                className="relative aspect-[16/10] overflow-hidden rounded-sm group cursor-none"
              >
                <img 
                  src={foodCultureImage('Bánh mướt thanh chương.webp')}
                  alt={t('Bánh Mướt Thanh Chương')}
                  className="w-full h-full object-cover transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                <div className="absolute bottom-10 left-10 space-y-2">
                  <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest">{t('Món ăn sáng quốc dân')}</span>
                  <h3 className="text-4xl font-bold font-serif">
                    <a
                      href="https://mia.vn/cam-nang-du-lich/dac-san-banh-muot-nghe-an-13348"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {t('Bánh Mướt Thanh Chương')}
                    </a>
                  </h3>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-8">
                <div id="chao-canh-thanh-vinh" className="space-y-6">
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    transition={{ duration: 0.7 }}
                    className="aspect-square overflow-hidden rounded-sm relative group"
                  >
                    <img 
                      src={foodCultureImage('Cháo canh thành Vinh.webp')}
                      alt={t('Cháo canh thành Vinh')}
                      className="w-full h-full object-cover transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                  </motion.div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg font-serif">
                      <a
                        href="https://mia.vn/cam-nang-du-lich/chao-canh-nghe-an-15270"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {t('Cháo canh thành Vinh')}
                      </a>
                    </h4>
                    <p className="text-gray-500 text-xs font-light leading-relaxed">{t('Sự kết hợp hài hòa giữa sợi bánh dai mềm, nước dùng thanh ngọt và các loại topping như thịt heo, chả, trứng cút luộc, thịt cá hoặc tôm.')}</p>
                  </div>
                </div>
                <div id="nhut-thanh-chuong" className="space-y-6 pt-12">
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    transition={{ duration: 0.7 }}
                    className="aspect-square overflow-hidden rounded-sm relative group"
                  >
                    <img 
                      src={foodCultureImage('Nhút thanh chương.jpg')}
                      alt={t('Nhút Thanh Chương')}
                      className="w-full h-full object-cover transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                  </motion.div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg font-serif">
                      <a
                        href="https://dbndnghean.vn/nhut-thanh-chuong-huong-vi-dac-san-xu-nghe-8497.htm"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {t('Nhút Thanh Chương')}
                      </a>
                    </h4>
                    <p className="text-gray-500 text-xs font-light leading-relaxed">{t('Món ăn dân dã làm từ xơ mít non, biểu tượng của sự chắt chiu.')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Column */}
            <div className="md:col-span-5 space-y-12 md:pt-32">
              <div id="sup-luon-vinh" className="p-12 bg-white/5 border border-white/10 rounded-sm space-y-8">
                <div className="text-5xl font-serif italic text-red-500 opacity-50">01</div>
                <h3 className="text-3xl font-bold font-serif leading-tight">
                  <a
                    href="https://vinpearl.com/vi/sup-luon-nghe-an-mot-trong-7-mon-an-doc-dao-nhat-the-gioi"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {t('Súp Lươn Vinh -')} <br /> {t('Đánh thức mọi giác quan.')}
                  </a>
                </h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {t('Thịt lươn đồng béo ngậy, hành tăm thơm nồng và vị cay đặc trưng tạo nên một trải nghiệm ẩm thực không thể nào quên khi đặt chân đến thành phố Vinh.')}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/map')}
                    className="flex items-center space-x-4 text-white font-bold uppercase tracking-widest text-[10px] group"
                  >
                    <span className="border-b border-white/20 pb-1 group-hover:border-red-500 transition-colors">{t('Tìm địa chỉ quán ngon')}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div 
                  initial={{ y: 50 }}
                  whileInView={{ y: 0 }}
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.7 }}
                  className="aspect-[3/4] overflow-hidden rounded-sm relative group"
                >
                  <img 
                    src={foodCultureImage('đặc sản nam đàn.jpg')}
                    alt={t('Thịt me, thịt nghé Nam Nghĩa')}
                    className="w-full h-full object-cover transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                </motion.div>
                <div className="space-y-2">
                  <h4 className="font-bold text-lg font-serif">
                    <a
                      href="https://baonghean.vn/ngot-thom-thit-me-nam-nghia-10101684.html"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {t('Thịt me, thịt nghé Nam Nghĩa')}
                    </a>
                  </h4>
                  <p className="text-gray-500 text-xs font-light leading-relaxed">{t('Thịt me, thịt nghé Nam Nghĩa có vị ngọt, dai dai, giòn sần sật từ lớp da và mùi thơm hương đồng cỏ nội độc đáo.')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Cultural Soul (Ví Giặm) - Immersive Atmospheric */}
      <section className="min-h-screen bg-[#f5f2ed] relative flex items-center overflow-hidden py-40">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-[1px] w-12 bg-red-600" />
                  <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px]">{t('Di sản phi vật thể')}</span>
                </div>
                <h2 className="text-7xl md:text-9xl font-bold font-serif leading-[0.85] tracking-tighter text-gray-900">
                  {t('Ví Giặm')} <br /> <span className="text-red-600 italic">{t('ân tình')}</span>
                </h2>
              </div>

              <p className="text-gray-600 text-xl font-light leading-relaxed italic border-l-4 border-red-600 pl-8">
                {t('"Hát cho tan hết nỗi buồn, hát cho dòng Lam xanh mãi, hát cho tình người Nghệ mãi sắt son."')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-red-600">
                    <div className="w-1 h-1 bg-red-600 rounded-full" />
                    <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">{t('Hát Ví')}</h4>
                  </div>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    {t('Lối hát tự do, không có nhịp điệu gò bó, thường hát khi đang lao động, đối đáp giao duyên.')}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-red-600">
                    <div className="w-1 h-1 bg-red-600 rounded-full" />
                    <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">{t('Hát Giặm')}</h4>
                  </div>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    {t('Nhịp điệu dồn dập, chắc khỏe, kể về những câu chuyện đạo lý, nhân nghĩa ở đời.')}
                  </p>
                </div>
              </div>

              <div className="pt-12 flex items-center space-x-8">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-24 h-24 rounded-full bg-red-600 flex flex-col items-center justify-center text-white shadow-2xl shadow-red-600/30 hover:scale-110 transition-transform group overflow-hidden relative"
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <VolumeX size={24} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <Volume2 size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 relative z-10">
                    {isPlaying ? t('Dừng') : t('Nghe')}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>

                {/* Music Waves Effect */}
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-end space-x-1 h-8"
                    >
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: [
                              '20%', '100%', '40%', '80%', '30%', '90%', '20%'
                            ][i % 7] 
                          }}
                          transition={{ 
                            duration: 0.8 + (i * 0.1), 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="w-1 bg-red-600 rounded-full"
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative z-10 aspect-[3/4] rounded-[10rem] overflow-hidden shadow-[60px_60px_100px_-20px_rgba(0,0,0,0.15)] rotate-3">
                <img 
                  src={foodCultureImage('ví dặm ân tình.jpg')}
                  alt={t('Biểu diễn dân ca')}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-72 bg-white p-10 rounded-3xl shadow-2xl -rotate-6 hidden md:block border border-gray-50">
                <div className="space-y-6">
                  <div className="text-amber-500 font-serif text-2xl">★★★★★</div>
                  <p className="text-gray-900 font-bold text-lg font-serif italic leading-tight">
                    {t('"Di sản văn hóa phi vật thể đại diện của nhân loại."')}
                  </p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">{t('UNESCO, 2014')}</p>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-1/2 -left-20 w-40 h-40 border border-red-600/20 rounded-full -translate-y-1/2 animate-spin-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Artisanal Heritage - Brutalist Grid Layout */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-900">
            <div className="p-12 lg:p-24 space-y-12 border-b lg:border-b-0 lg:border-r border-gray-900">
              <div className="space-y-6">
                <span className="text-red-600 font-mono text-xs font-bold tracking-[0.5em] uppercase">{t('Làng nghề truyền thống')}</span>
                <h2 className="text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tighter text-gray-900">{t('Bàn tay')} <br /> <span className="text-red-600 italic">{t('tài hoa')}</span></h2>
              </div>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                {t('Những làng nghề hàng trăm năm tuổi vẫn đang âm thầm giữ lửa, biến những nguyên liệu thô sơ thành những tác phẩm nghệ thuật đầy hồn cốt.')}
              </p>
              <div className="pt-12">
                <a
                  href="https://baonghean.vn/nhung-lang-nghe-khong-nen-bo-lo-khi-ve-voi-nghe-an-10187251.html"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center space-x-8 text-gray-900 font-bold uppercase tracking-widest text-xs"
                >
                  <span>{t('Tìm hiểu thêm')}</span>
                  <div className="w-20 h-[1px] bg-gray-200 group-hover:w-32 group-hover:bg-red-600 transition-all duration-500" />
                  <ArrowRight size={20} className="group-hover:text-red-600 transition-colors" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {[
                { 
                  title: 'Gốm Trù Sơn', 
                  image: foodCultureImage('gốm trù sơn.webp'), 
                  desc: 'Gốm mộc không men, nung củi.',
                  loc: 'Đô Lương',
                  link: 'https://vietnamtourism.gov.vn/post/23072'
                },
                { 
                  title: 'Dệt Thổ Cẩm', 
                  image: foodCultureImage('dệt thổ cẩm.jpg'), 
                  desc: 'Sắc màu của núi rừng Tây Bắc.',
                  loc: 'Quỳ Châu',
                  link: 'https://vietnamtourism.gov.vn/post/63326'
                },
                { 
                  title: 'Đúc Đồng', 
                  image: foodCultureImage('đúc đồng.webp'), 
                  desc: 'Tinh hoa đúc đồng ngàn năm.',
                  loc: 'Hưng Nguyên',
                  link: 'https://tapchicongthuong.vn/lang-nghe-duc-dong-con-cat-2738.htm'
                },
                { 
                  title: 'Mây Tre Đan', 
                  image: foodCultureImage('mây tre đan.jpg'), 
                  desc: 'Sự dẻo dai của tâm hồn Việt.',
                  loc: 'Nghi Lộc',
                  link: 'https://baonghean.vn/may-tre-dan-vung-cao-nghe-an-vuon-ra-the-gioi-10292839.html'
                }
              ].map((item, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden border-r border-b border-gray-900 last:border-r-0">
                  <img 
                    src={item.image} 
                    alt={t(item.title)} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gray-950/60 group-hover:bg-gray-950/20 transition-all duration-500" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center space-x-2 text-red-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t(item.loc)}</span>
                    </div>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xl font-bold font-serif mb-1 text-white hover:underline underline-offset-4"
                      >
                        {t(item.title)}
                      </a>
                    ) : (
                      <h4 className="text-xl font-bold font-serif mb-1 text-white">{t(item.title)}</h4>
                    )}
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{t(item.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Festival Calendar - Typographic Editorial */}
      <section className="py-40 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32 space-y-6">
            <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px] block">{t('Lịch trình văn hóa')}</span>
            <h2 className="text-6xl md:text-9xl font-bold font-serif tracking-tighter text-gray-900">
              {t('Mùa lễ hội')} <br /> <span className="text-red-600 italic">{t('trường tồn')}</span>
            </h2>
          </div>

          <div className="space-y-0 border-t border-gray-200">
            {[
              { month: 'Tháng Giêng', event: 'Lễ hội Hang Bua', loc: 'Quỳ Châu', desc: 'Lễ hội lớn nhất của đồng bào Thái vùng Tây Bắc Nghệ An, nơi hội tụ sắc màu thổ cẩm.', link: 'https://dantocmiennui.baotintuc.vn/ve-quy-chau-du-hoi-hang-bua-post346563.html' },
              { month: 'Tháng Ba', event: 'Lễ hội Đền Cuông', loc: 'Diễn Châu', desc: 'Tưởng nhớ Thục Phán An Dương Vương với các nghi lễ trang trọng trên đỉnh núi Mộ Dạ.', link: 'https://vinpearl.com/vi/ron-rang-xem-hoi-den-cuong-nghe-an-vang-danh-nhat-xu-nghe' },
              { month: 'Tháng Năm', event: 'Lễ hội Làng Sen', loc: 'Nam Đàn', desc: 'Hành trình về nguồn đầy xúc động nhân ngày sinh Chủ tịch Hồ Chí Minh kính yêu.', link: 'https://truyenhinhnghean.vn/van-hoa-giai-tri/202505/be-mac-le-hoi-lang-sen-nam-2025-dau-an-nghe-thuat-sau-lang-nhieu-cam-xuc-d3c73f5/' },
              { month: 'Tháng Mười', event: 'Lễ hội Đền Ông Hoàng Mười', loc: 'Hưng Nguyên', desc: 'Không gian tâm linh huyền bí, thu hút hàng vạn du khách về cầu may mắn và bình an.', link: 'https://hungnguyen.nghean.gov.vn/tiep-can-thong-tin/le-hoi-den-ong-hoang-muoi-diem-den-du-lich-hap-dan-cua-du-khach-trong-hanh-trinh-ve-voi-xu-nghe-984627?pageindex=0' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => {
                  if (item.link) {
                    window.open(item.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="group grid grid-cols-1 md:grid-cols-12 gap-8 py-20 border-b border-gray-200 items-center hover:bg-white transition-colors px-8 cursor-pointer"
              >
                <div className="md:col-span-2">
                  <span className="text-red-600 font-serif italic text-3xl">{t(item.month)}</span>
                </div>
                <div className="md:col-span-4">
                  <h4 className="text-4xl font-bold font-serif text-gray-900 group-hover:text-red-600 transition-colors">{t(item.event)}</h4>
                  <div className="flex items-center space-x-2 text-gray-400 text-[10px] uppercase tracking-widest mt-4">
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    <span className="font-bold">{t(item.loc)}</span>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <p className="text-gray-500 text-sm font-light leading-relaxed max-w-md">{t(item.desc)}</p>
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Visual Inspiration - Dot Matrix Pattern */}
      <section className="py-60 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-5xl mx-auto px-4 text-center space-y-16 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-5xl md:text-[6rem] font-bold font-serif tracking-tighter leading-[0.9] mb-12">
              {t('Hương vị là')} <span className="text-red-600 italic">{t('ký ức,')}</span> <br /> 
              {t('Văn hóa là')} <span className="text-red-600 italic">{t('tâm hồn')}</span>
            </h2>
            <p className="text-gray-400 text-xl font-light leading-relaxed max-w-3xl mx-auto">
              {t('Hãy để mỗi món ăn, mỗi làn điệu dẫn lối bạn vào sâu thẳm tâm hồn của mảnh đất Nghệ An đầy nắng gió nhưng cũng đầy ân tình.')}
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-12">
            <button
              type="button"
              onClick={() => navigate('/destinations')}
              className="bg-red-600 text-white font-bold py-6 px-16 rounded-sm hover:bg-red-700 transition-all uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-red-600/20 group flex items-center space-x-4"
            >
              <span>{t('Bắt đầu hành trình')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/map')}
              className="border border-white/10 text-white font-bold py-6 px-16 rounded-sm hover:bg-white hover:text-gray-950 transition-all uppercase tracking-[0.3em] text-[10px]"
            >
              {t('Tải bản đồ văn hóa')}
            </button>
          </div>
        </div>

      </section>

      {/* Footer Quick Links - Professional Grid */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { num: '01', title: 'Lịch sử', desc: 'Vùng đất địa linh nhân kiệt.' },
              { num: '02', title: 'Địa lý', desc: 'Sự giao thoa giữa rừng và biển.' },
              { num: '03', title: 'Khám phá', desc: 'Những góc nhìn mới về xứ Nghệ.' },
              { num: '04', title: 'Di sản', desc: 'Gìn giữ giá trị cho mai sau.' }
            ].map((item, i) => (
              <div key={i} className="space-y-6 group">
                <div className="text-red-600 font-serif italic text-4xl opacity-20 group-hover:opacity-100 transition-opacity duration-500">{item.num}</div>
                <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">{t(item.title)}</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{t(item.desc)}</p>
                <div className="w-8 h-[1px] bg-gray-100 group-hover:w-16 group-hover:bg-red-600 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
