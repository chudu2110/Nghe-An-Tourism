import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, Compass, Camera, Mountain, Waves, Landmark, ArrowRight, Sparkles, Star, Zap, Clock, Users, Quote, MoveRight, Play, Trees, ScrollText, Music, Flame, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const experienceImage = (fileName: string) =>
  new URL(`../../Experiences img/${fileName}`, import.meta.url).href;

const experienceCategories = [
  {
    id: 'nature',
    title: 'Tiếng gọi của Núi Rừng',
    subtitle: 'Tiếng gọi hoang dã',
    icon: <Trees size={48} strokeWidth={1.5} />,
    desc: 'Từ đỉnh Pù Mát mây phủ đến những cánh đồng hoa hướng dương rực rỡ, thiên nhiên Nghệ An là bản hùng ca của sự sống.',
    image: experienceImage('tiếng gọi núi rừng.jpg'),
    color: 'text-emerald-600',
    link: 'https://www.youtube.com/watch?v=YUe1Y0mj-t0'
  },
  {
    id: 'history',
    title: 'Lời thì thầm của Quá khứ',
    subtitle: 'Lời thì thầm lịch sử',
    icon: <ScrollText size={48} strokeWidth={1.5} />,
    desc: 'Mỗi viên gạch tại Thành cổ Vinh hay mái nhà tranh Làng Sen đều kể câu chuyện về những vĩ nhân và hào khí dân tộc.',
    image: experienceImage('thành cổ vinh.webp'),
    color: 'text-amber-600',
    link: 'https://www.youtube.com/watch?v=9PwjrSS6CTY'
  },
  {
    id: 'culture',
    title: 'Nhịp đập của Đất mẹ',
    subtitle: 'Tâm hồn văn hóa',
    icon: <Music size={48} strokeWidth={1.5} />,
    desc: 'Hòa mình vào điệu hò Ví Giặm bên dòng Lam, nơi văn hóa không chỉ là di sản mà là hơi thở thường nhật.',
    image: experienceImage('ví dặm sông lam.jpg'),
    color: 'text-blue-600',
    link: 'https://www.youtube.com/watch?v=DBN60PzuNPk'
  }
];

const featuredJourneys = [
  {
    id: '01',
    title: 'Chinh phục "Nóc nhà" Pù Mát',
    location: 'Con Cuông',
    desc: 'Một hành trình xuyên qua vùng lõi rừng nguyên sinh, nơi bạn sẽ được nghe tiếng thở của đại ngàn và tắm mình trong dòng thác Kèm huyền thoại.',
    image: experienceImage('Nóc nhà Pù Mát.jpg'),
    tags: ['Mạo hiểm', 'Trekking', 'Sinh thái'],
    link: 'https://www.youtube.com/watch?v=AtmN9pMIm_A'
  },
  {
    id: '02',
    title: 'Bình minh trên "Biển bạc" Cửa Lò',
    location: 'Cửa Lò',
    desc: 'Không chỉ là tắm biển, đó là trải nghiệm đi thuyền thúng cùng ngư dân, đón những mẻ lưới đầu tiên và cảm nhận vị mặn mòi của biển cả lúc rạng đông.',
    image: experienceImage('biển bạc cửa lò.webp'),
    tags: ['Nghỉ dưỡng', 'Đời sống', 'Ẩm thực'],
    link: 'https://www.youtube.com/watch?v=pr1rjRBXCp8'
  }
];

export default function Experiences() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="pt-20 bg-[#fdfcf9] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <motion.div style={{ opacity }} className="absolute inset-0 z-0">
          <img
            src={experienceImage('Header.jpg')}
            alt={t('Ảnh bìa trải nghiệm')}
            className="w-full h-full object-cover grayscale opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-12 bg-red-600" />
              <span className="text-red-600 font-mono text-xs font-bold tracking-[0.5em] uppercase">{t('Hành trình cảm xúc')}</span>
              <div className="h-px w-12 bg-red-600" />
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-bold text-gray-900 leading-[0.8] tracking-tighter font-serif">
              {t('Trải')}
              {lang === 'vi' ? ' ' : ''}
              <span className="italic text-red-600">{t('nghiệm.')}</span>
            </h1>
            
            <p className="text-gray-500 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              {t('Những hoạt động độc đáo, những hành trình đầy cảm hứng đang chờ đón bạn tại mảnh đất miền Trung đầy nắng và gió.')}
            </p>

            <div className="flex justify-center pt-12">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border-2 border-gray-200 rounded-full flex justify-center p-2"
              >
                <div className="w-1 h-2 bg-red-600 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[25vw] font-bold text-gray-50 select-none pointer-events-none -z-10 leading-none opacity-50">
          {t('Hành trình')}
        </div>
      </section>

      {/* Breakthrough Section 1: The Three Pillars */}
      <section className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
            {experienceCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`relative group p-12 border-l border-gray-100 last:border-r ${idx % 2 !== 0 ? 'lg:-translate-y-20' : ''}`}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-[#fdfcf9] -z-10 transform skew-y-3 group-hover:skew-y-0 transition-transform duration-700" />
                
                <div className="mb-12 relative">
                  <div className={`text-6xl font-serif opacity-10 absolute -top-8 -left-4 ${cat.color}`}>0{idx + 1}</div>
                  <div className={`${cat.color} relative z-10`}>{cat.icon}</div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold font-serif text-gray-900">{t(cat.title)}</h3>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-red-600 font-bold">{t(cat.subtitle)}</p>
                  </div>
                  <p className="text-gray-500 leading-relaxed font-light text-sm">
                    {t(cat.desc)}
                  </p>
                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={() => {
                        if (cat.link) {
                          window.open(cat.link, '_blank', 'noopener,noreferrer');
                        } else {
                          navigate('/destinations');
                        }
                      }}
                      className="flex items-center space-x-4 group/btn"
                    >
                      <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover/btn:bg-red-600 group-hover/btn:border-red-600 transition-all">
                        <ArrowRight size={18} className="group-hover/btn:text-white transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/btn:text-gray-900 transition-colors">{t('Khám phá thêm')}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-16 aspect-[4/5] overflow-hidden rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <img src={cat.image} alt={t(cat.title)} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakthrough Section 2: The Grand Journeys */}
      <section className="bg-gray-950 text-white min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
          <div className="space-y-64">
            {featuredJourneys.map((journey, idx) => (
              <div key={journey.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-24 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`lg:col-span-5 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="text-[15rem] font-serif font-bold text-white/5 leading-none absolute -top-32 -left-16 select-none">
                      {journey.id}
                    </div>
                    <div className="relative z-10 space-y-10">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-px bg-red-600" />
                        <span className="text-red-600 font-mono text-xs font-bold tracking-[0.4em] uppercase">{t(journey.location)}</span>
                      </div>
                      <h2 className="text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tighter">
                        {t(journey.title)}
                      </h2>
                      <p className="text-gray-400 text-xl leading-relaxed font-light">
                        {t(journey.desc)}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {journey.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hover:bg-white hover:text-gray-950 transition-all cursor-default">
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                      <div className="pt-8">
                        <button
                          type="button"
                          onClick={() => {
                            if (journey.link) {
                              window.open(journey.link, '_blank', 'noopener,noreferrer');
                            } else {
                              navigate('/blog');
                            }
                          }}
                          className="flex items-center space-x-6 group/play"
                        >
                          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center group-hover/play:scale-110 transition-transform">
                            <Play size={24} fill="white" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Xem trải nghiệm')}</p>
                            <p className="text-white font-serif italic text-lg">{t('Hành trình thực tế')}</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className={`lg:col-span-7 ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: idx % 2 === 0 ? 5 : -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl"
                  >
                    <img src={journey.image} alt={t(journey.title)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-white/60">{t('Đánh giá')}</p>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-white">
                        <Users size={20} />
                        <span className="text-sm font-bold">{t('1.2k+ đã trải nghiệm')}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakthrough Section 3: The Pulse of the Land */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-32 border-b border-gray-900 pb-16">
            <h2 className="text-6xl md:text-8xl font-bold font-serif tracking-tighter mb-8 md:mb-0">{t('Nhịp sống')} <br /> <span className="text-red-600 italic">{t('bản địa.')}</span></h2>
            <div className="max-w-xs text-right">
              <p className="text-gray-500 text-sm leading-relaxed font-light italic">
                {t('"Đừng chỉ là du khách, hãy trở thành một phần của mảnh đất này qua những hoạt động thường nhật."')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-900">
            {[
              { title: 'Chèo thuyền Kayak', icon: <Waves />, desc: 'Lướt trên dòng Lam thơ mộng lúc hoàng hôn.', color: 'bg-blue-50' },
              { title: 'Trekking rừng sâu', icon: <Compass />, desc: 'Thử thách bản lĩnh tại vùng lõi Pù Mát.', color: 'bg-emerald-50' },
              { title: 'Săn ảnh di tích', icon: <Camera />, desc: 'Ghi lại hồn cốt lịch sử qua ống kính.', color: 'bg-amber-50' },
              { title: 'Tour ẩm thực đêm', icon: <Flame />, desc: 'Thưởng thức vị cay nồng của súp lươn Vinh.', color: 'bg-red-50' }
            ].map((item, idx) => (
              <div key={idx} className={`p-16 group hover:bg-gray-900 transition-all duration-500 border-gray-900 ${idx !== 3 ? 'lg:border-r' : ''} ${idx !== 0 ? 'border-t lg:border-t-0' : ''}`}>
                <div className="mb-12 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 text-gray-900 group-hover:text-red-600">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 48, strokeWidth: 1 })}
                </div>
                <h3 className="text-2xl font-bold mb-6 group-hover:text-white transition-colors uppercase tracking-tight">{t(item.title)}</h3>
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors text-sm font-light">{t(item.desc)}</p>
                <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="text-red-600" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakthrough Section 4: Traveler's Scrapbook */}
      <section className="py-40 bg-[#f5f2ed] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 rotate-12 border border-black/20 p-4 text-8xl font-serif italic">{t('Bưu thiếp')}</div>
          <div className="absolute bottom-20 right-10 -rotate-12 border border-black/20 p-4 text-8xl font-serif italic">{t('Ký ức')}</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            
            {/* Left Column: The Scrapbook Stack */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-square md:aspect-[4/5] w-full max-w-2xl mx-auto">
                {/* Main Photo - Polaroid Style */}
                <motion.div
                  initial={{ rotate: -5, x: -20 }}
                  whileInView={{ rotate: -2, x: 0 }}
                  className="absolute inset-0 bg-white p-6 pb-24 shadow-2xl z-20 transform -rotate-2"
                >
                  <img src={experienceImage('Hoàng hôn trên sông lam.jpg')} alt={t('Khoảnh khắc du khách')} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="font-serif italic text-2xl text-gray-800">{t('"Hoàng hôn trên sông Lam, 2024"')}</p>
                  </div>
                </motion.div>

                {/* Secondary Photo - Taped Style */}
                <motion.div
                  initial={{ rotate: 10, x: 50, y: 50 }}
                  whileInView={{ rotate: 5, x: 30, y: 30 }}
                  className="absolute top-1/4 -right-12 w-2/3 aspect-square bg-white p-4 pb-16 shadow-xl z-30 transform rotate-6 border-t-8 border-red-600/10"
                >
                  <img src={experienceImage('nụ cười bản địa.jpg')} alt={t('Người bạn bản địa')} className="w-full h-full object-cover" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-8 bg-gray-200/50 backdrop-blur-sm rotate-3" />
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gray-400">{t('Nụ cười bản địa')}</p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-600 rounded-full flex items-center justify-center z-40 animate-bounce-slow">
                  <Camera className="text-white" size={40} />
                </div>
              </div>
            </div>

            {/* Right Column: The Stories */}
            <div className="lg:col-span-5 space-y-16">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-px w-12 bg-red-600" />
                  <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px]">{t('Nhật ký hành trình')}</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tighter text-gray-900">
                  {t('Nghe')} <br /> <span className="text-red-600 italic">{t('người đi trước.')}</span>
                </h2>
                <p className="text-gray-500 font-light leading-relaxed text-lg">
                  {t('Không phải lời khuyên từ chuyên gia, đây là những mảnh ghép cảm xúc thực tế từ những tâm hồn đã trót yêu mảnh đất này.')}
                </p>
              </div>

              <div className="space-y-12">
                {[
                  { 
                    author: "Linh (24 tuổi)", 
                    role: "Du lịch một mình",
                    quote: "Lần đầu trekking Pù Mát, mệt lả nhưng khoảnh khắc chạm tay vào dòng thác Kèm, mọi mệt mỏi tan biến. Nghệ An hoang sơ hơn tôi tưởng.",
                    avatar: experienceImage('Linh.jpg')
                  },
                  { 
                    author: "Bác Hùng (60 tuổi)", 
                    role: "Yêu di sản",
                    quote: "Về thăm quê Bác vào một chiều sen nở, lòng bâng khuâng lạ thường. Sự giản dị ở đây dạy tôi nhiều điều về cuộc sống.",
                    avatar: experienceImage('bác Hùng.webp')
                  },
                  { 
                    author: "Tom (UK)", 
                    role: "Khám phá ẩm thực",
                    quote: "Súp lươn cay ở Vinh đúng là một phát hiện! Đừng bỏ lỡ tour ẩm thực đêm nếu bạn muốn nếm trọn “tâm hồn” của mảnh đất này.",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
                  }
                ].map((story, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="group flex space-x-6 items-start"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <img src={story.avatar} alt={story.author} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-bold text-gray-900">{story.author}</h4>
                        <span className="text-[10px] uppercase tracking-widest text-red-600/50 font-bold">{t(story.role)}</span>
                      </div>
                      <p className="text-gray-600 font-serif italic leading-relaxed group-hover:text-gray-900 transition-colors">
                        "{t(story.quote)}"
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/blog')}
                  className="group flex items-center space-x-6 text-gray-900 font-bold uppercase tracking-widest text-xs"
                >
                  <span>{t('Xem thêm hàng ngàn câu chuyện')}</span>
                  <div className="w-16 h-px bg-gray-900 group-hover:w-24 group-hover:bg-red-600 transition-all" />
                  <MoveRight size={20} className="group-hover:text-red-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={experienceImage('tiếng gọi núi rừng.jpg')} alt={t('Ảnh nền')} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-6xl md:text-9xl font-bold text-white font-serif tracking-tighter leading-none">
              {t('Viết nên')} <br /> <span className="text-red-600 italic">{t('câu chuyện')}</span> <br /> {t('của bạn.')}
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              {t('Mỗi bước chân tại Nghệ An là một trang mới trong cuốn nhật ký hành trình của cuộc đời bạn.')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 pt-12">
              <button
                type="button"
                onClick={() => navigate('/planning')}
                className="bg-red-600 text-white font-bold py-6 px-16 rounded-sm hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-2xl shadow-red-600/20"
              >
                {t('Lên kế hoạch ngay')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/assistant')}
                className="border border-white/20 text-white font-bold py-6 px-16 rounded-sm hover:border-red-600 transition-all uppercase tracking-widest text-xs"
              >
                {t('Liên hệ tư vấn')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
