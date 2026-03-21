import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, Compass, Navigation, ArrowRight, Info, Anchor, Mountain, TreeDeciduous, Globe2, Landmark, Waves, Maximize2, Layers, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const destinationImage = (fileName: string) =>
  new URL(`../../Destination img/${fileName}`, import.meta.url).href;

const regions = [
  {
    id: 'coastal',
    number: '01',
    title: 'Vùng Duyên Hải',
    subtitle: 'Biên cương duyên hải',
    desc: 'Dải đất ven biển với những bãi tắm tuyệt đẹp và hệ thống cảng biển sầm uất. Nơi giao thoa giữa đất liền và đại dương bao la.',
    districts: ['Vinh', 'Cửa Lò', 'Nghi Lộc', 'Diễn Châu', 'Quỳnh Lưu', 'Hoàng Mai'],
    icon: <Anchor size={32} />,
    image: destinationImage('Duyên Hải.jpeg')
  },
  {
    id: 'plain',
    number: '02',
    title: 'Vùng Đồng Bằng',
    subtitle: 'Trái tim văn hóa',
    desc: 'Cái nôi văn hóa lúa nước, nơi tập trung các di tích lịch sử và làng nghề truyền thống. Linh hồn của Xứ Nghệ ngàn năm.',
    districts: ['Nam Đàn', 'Hưng Nguyên', 'Yên Thành', 'Đô Lương', 'Thanh Chương'],
    icon: <TreeDeciduous size={32} />,
    image: destinationImage('Đồng bằng.jpg')
  },
  {
    id: 'mountain',
    number: '03',
    title: 'Vùng Miền Núi',
    subtitle: 'Cao nguyên hùng vĩ',
    desc: 'Vùng đại ngàn hùng vĩ với hệ sinh thái đa dạng và bản sắc văn hóa các dân tộc thiểu số. Nơi những đỉnh núi chạm mây trời.',
    districts: ['Con Cuông', 'Tương Dương', 'Kỳ Sơn', 'Quỳ Châu', 'Quỳ Hợp', 'Quế Phong', 'Anh Sơn', 'Tân Kỳ', 'Nghĩa Đàn', 'Thái Hòa'],
    icon: <Mountain size={32} />,
    image: destinationImage('Miền núi.jpg')
  }
];

const keyDestinations = [
  {
    name: 'Thành phố Vinh',
    role: 'Trung tâm kinh tế',
    desc: 'Đô thị loại I, trái tim của Xứ Nghệ với nhịp sống hiện đại và bề dày lịch sử cách mạng.',
    stats: '205 km²',
    image: destinationImage('Thành Vinh.webp'),
    coords: '18.67° N, 105.68° E'
  },
  {
    name: 'Thị xã Cửa Lò',
    role: 'Cửa ngõ biển',
    desc: 'Một trong những bãi biển đẹp nhất miền Trung với hạ tầng du lịch đồng bộ và hiện đại.',
    stats: '10km bờ biển',
    image: destinationImage('Thị xã cửa lò.jpg'),
    coords: '18.82° N, 105.71° E'
  },
  {
    name: 'Huyện Nam Đàn',
    role: 'Vùng đất di sản',
    desc: 'Quê hương của Chủ tịch Hồ Chí Minh và nhiều vĩ nhân, trung tâm du lịch văn hóa tâm linh.',
    stats: 'Di tích quốc gia',
    image: destinationImage('Nam Đàn.webp'),
    coords: '18.70° N, 105.50° E'
  }
];

const administrativeDivisions = [
  'TP Vinh', 'TX Cửa Lò', 'TX Thái Hòa', 'TX Hoàng Mai', 'Anh Sơn', 'Con Cuông', 'Diễn Châu',
  'Đô Lương', 'Hưng Nguyên', 'Kỳ Sơn', 'Nam Đàn', 'Nghi Lộc', 'Nghĩa Đàn', 'Quế Phong',
  'Quỳ Châu', 'Quỳ Hợp', 'Quỳnh Lưu', 'Tân Kỳ', 'Thanh Chương', 'Tương Dương', 'Yên Thành'
];

export default function Destinations() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-red-600 selection:text-white overflow-hidden">
      {/* Hero Section - Editorial Magazine Style */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 opacity-40 grayscale"
          >
            <img 
              src={destinationImage('Header.jpg')} 
              alt={t('Phong cảnh Nghệ An')} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 w-full max-w-[1800px] px-4 md:px-12">
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-1 border border-red-600/50 text-red-500 font-mono text-xs tracking-[0.3em] uppercase rounded-full bg-red-600/5 backdrop-blur-sm">
                {t('Hồ sơ hành chính & địa lý')}
              </span>
            </motion.div>

            <div className="relative">
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[15vw] md:text-[12vw] font-bold font-serif leading-[0.8] tracking-tighter uppercase mix-blend-difference"
              >
                {t('Điểm')}
                {lang === 'vi' ? ' ' : ''}
                <span className="text-red-600 italic">{t('đến.')}</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute -top-10 right-0 md:right-20 w-32 h-32 md:w-48 md:h-48 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow"
              >
                <div className="text-[10px] font-mono tracking-widest uppercase text-white/40 text-center">
                  Nghệ An <br /> 16,490 km² <br /> {t('Việt Nam')}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 max-w-2xl"
            >
              <p className="text-xl md:text-2xl font-light text-white/60 leading-relaxed">
                {t('Khám phá bản đồ địa lý và hành chính của tỉnh có diện tích lớn nhất Việt Nam. Một hệ sinh thái đa dạng từ đại ngàn hùng vĩ đến biển cả bao la.')}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 hidden md:flex items-center space-x-8">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Biên giới Lào')}</span>
            <span className="text-xl font-serif italic">419 km</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Bờ biển')}</span>
            <span className="text-xl font-serif italic">82 km</span>
          </div>
        </div>
      </section>

      {/* Regional Explorer - Oversized Typographic Layout */}
      <section className="py-40 relative bg-white text-black">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-red-600 font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">{t('Sinh thái vùng')}</span>
              <h2 className="text-6xl md:text-8xl font-bold font-serif tracking-tighter leading-none">
                {t('Ba vùng')} <br /> <span className="text-red-600 italic">{t('sinh thái.')}</span>
              </h2>
            </div>
            <div className="md:text-right max-w-xs">
              <p className="text-gray-500 font-light leading-relaxed">
                {t('Nghệ An được chia thành 3 vùng sinh thái đặc trưng, mỗi vùng mang một sắc thái địa lý và văn hóa riêng biệt.')}
              </p>
            </div>
          </div>

          <div className="space-y-60">
            {regions.map((region, idx) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              >
                <div className="absolute -top-40 -left-10 text-[25vw] font-serif font-black text-gray-100 leading-none select-none z-0">
                  {region.number}
                </div>
                
                <div className={`lg:col-span-7 relative z-10 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    transition={{ duration: 0.7 }}
                    className="aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                  >
                    <img src={region.image} alt={t(region.title)} className="w-full h-full object-cover" />
                  </motion.div>
                </div>

                <div className={`lg:col-span-5 relative z-20 ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-5xl md:text-6xl font-bold font-serif tracking-tight">{t(region.title)}</h3>
                      <p className="text-xs font-mono tracking-[0.5em] text-red-600 uppercase font-bold">{t(region.subtitle)}</p>
                    </div>
                    <p className="text-xl text-gray-600 font-light leading-relaxed">
                      {t(region.desc)}
                    </p>
                    <div className="pt-8 border-t border-gray-100">
                      <div className="flex items-center space-x-3 mb-6">
                        <Layers size={16} className="text-red-600" />
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t('Đơn vị hành chính')}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {region.districts.map((d, i) => (
                          <span key={i} className="text-[11px] font-medium bg-gray-50 text-gray-800 px-4 py-1.5 rounded-full border border-gray-200 hover:border-red-600 hover:text-red-600 transition-colors cursor-default">
                            {t(d)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Strategic Destinations - Dark Luxury Split Layout */}
      <section className="py-40 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="max-w-[1800px] mx-auto px-4 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <span className="text-red-600 font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">{t('Trung tâm chiến lược')}</span>
              <h2 className="text-6xl md:text-9xl font-bold font-serif tracking-tighter leading-[0.85]">
                {t('Tâm điểm')} <br /> <span className="text-red-600 italic">{t('chiến lược.')}</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-white/40 text-xl font-light leading-relaxed italic">
                {t('"Những tọa độ vàng định hình tương lai phát triển kinh tế, văn hóa và du lịch của toàn tỉnh."')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {keyDestinations.map((dest, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative h-[700px] overflow-hidden bg-gray-900"
              >
                <img 
                  src={dest.image} 
                  alt={t(dest.name)} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute top-8 left-8">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">{dest.coords}</span>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-12 translate-y-12 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-red-600 font-mono text-[10px] font-bold tracking-[0.4em] uppercase">{t(dest.role)}</p>
                      <h3 className="text-4xl font-bold font-serif">{t(dest.name)}</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      {t(dest.desc)}
                    </p>
                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-red-600 transition-colors">
                          <Maximize2 size={14} className="text-white/40 group-hover:text-red-600" />
                        </div>
                        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{t(dest.stats)}</span>
                      </div>
                      <ArrowRight className="text-white/20 group-hover:text-red-600 group-hover:translate-x-2 transition-all" size={24} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Administrative Grid - Brutalist Layout */}
      <section className="py-40 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-4">
            <h2 className="text-7xl md:text-9xl font-bold font-serif tracking-tighter">21</h2>
            <div className="max-w-md">
              <span className="text-red-600 font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">{t('Đơn vị hành chính')}</span>
              <p className="text-gray-500 font-light leading-relaxed">
                {t('Hệ thống hành chính bao gồm 1 thành phố, 3 thị xã và 17 huyện. Một mạng lưới quản lý chặt chẽ và hiệu quả.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 border-t border-l border-black">
            {administrativeDivisions.map((name, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                className="p-8 border-r border-b border-black aspect-square flex flex-col justify-between transition-colors duration-300 group cursor-crosshair"
              >
                <span className="text-[10px] font-mono text-gray-300 group-hover:text-white/40 transition-colors">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <h4 className="text-sm font-bold uppercase tracking-tighter leading-none">{t(name)}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmospheric Footer CTA */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img 
            src={destinationImage('Miền núi.jpg')} 
            alt={t('Phong cảnh huyền ảo')}
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="flex justify-center space-x-12">
              <MapIcon className="text-red-600/30" size={40} />
              <Navigation className="text-red-600/30" size={40} />
              <Compass className="text-red-600/30" size={40} />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold font-serif italic leading-tight">
              {t('Nghệ An không chỉ là một tỉnh,')} <br /> 
              <span className="text-red-600">{t('đó là một bản đồ di sản.')}</span>
            </h2>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate('/map')}
              className="px-12 py-5 bg-red-600 text-white font-mono text-xs tracking-[0.3em] uppercase rounded-full hover:bg-red-700 transition-colors shadow-2xl shadow-red-600/20"
            >
              {t('Khám phá bản đồ tương tác')}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
