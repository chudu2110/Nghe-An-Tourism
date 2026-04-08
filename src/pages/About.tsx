import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';

const aboutImage = (fileName: string) =>
  new URL(`../../About img/${fileName}`, import.meta.url).href;

export default function About() {
  const { scrollYProgress } = useScroll();
  const { t, lang } = useI18n();
  
  // Parallax and scroll transforms
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroImageScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  const heroImageY = useTransform(scrollYProgress, [0, 0.25], [0, 60]);

  const sections = [
    {
      id: '01',
      title: 'Điểm Đến',
      path: '/destinations',
      desc: 'Hành trình từ đỉnh Puxailaileng hùng vĩ đến dải cát trắng mịn Cửa Lò.',
      img: aboutImage('Điểm đến.webp')
    },
    {
      id: '02',
      title: 'Bản Đồ',
      path: '/map',
      desc: 'Dẫn lối bạn đến những góc nhỏ chưa tên.',
      img: aboutImage('Bản đồ.jpg')
    },
    {
      id: '03',
      title: 'Từ Điển',
      path: '/dictionary',
      desc: 'Giải mã những từ ngữ địa phương đặc trưng của người Xứ Nghệ.',
      img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: '04',
      title: 'Trải Nghiệm',
      path: '/experiences',
      desc: 'Săn mây đại ngàn, chèo thuyền trên sông Lam và văn hóa bản địa.',
      img: aboutImage('Trải nghiệm.webp')
    },
    {
      id: '05',
      title: 'Ẩm thực & Văn hóa',
      path: '/food-culture',
      desc: 'Hương vị đặc sản và chiều sâu văn hóa trong từng câu chuyện Xứ Nghệ.',
      img: aboutImage('Ẩm thực.jpg')
    },
    {
      id: '06',
      title: 'Đặt chỗ',
      path: '/booking',
      desc: 'Dịch vụ đặt phòng, tour và vé tham quan nhanh chóng, an toàn.',
      img: aboutImage('Đặt chỗ.jpg')
    },
    {
      id: '07',
      title: 'Tình Nguyện',
      path: '/volunteers',
      desc: 'Tham gia bảo tồn thiên nhiên và hỗ trợ phát triển cộng đồng.',
      img: aboutImage('tình nguyện.jpg')
    },
    {
      id: '08',
      title: 'Kế Hoạch',
      path: '/planning',
      desc: 'Công cụ thiết kế hành trình hoàn hảo theo từng mùa và sở thích.',
      img: aboutImage('Kế hoạch.jpg')
    },
    {
      id: '09',
      title: 'Blog',
      path: '/blog',
      desc: 'Những câu chuyện, kinh nghiệm và cảm hứng cho hành trình của bạn tại mảnh đất Nghệ An.',
      img: aboutImage('Blog.jpg')
    },
    {
      id: '10',
      title: 'Podcast',
      path: '/podcast',
      desc: 'Câu chuyện đặc trưng, ấm áp và chân tình của người dân xứ Nghệ.',
      img: aboutImage('Podcast.webp')
    }
  ];

  return (
    <div className="bg-white text-[#1a1a1a] selection:bg-red-50 selection:text-red-900 overflow-hidden font-sans">
      
      {/* SECTION 1: MINIMALIST EDITORIAL HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 border-b border-gray-100 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.img
            style={{ scale: heroImageScale, y: heroImageY }}
            src={aboutImage('Header.jpg')}
            alt={t('Phong cảnh Nghệ An')}
            className="w-full h-full object-cover grayscale opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/35 to-white/80" />
        </div>

        <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
            <div className="lg:col-span-8 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-[1px] bg-red-600" />
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-red-600">{t('Cẩm nang cổng thông tin')}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
              >
                <motion.h1 
                  style={{ y: heroTextY }}
                  className={`text-5xl md:text-[8.5vw] font-serif italic ${lang === 'vi' ? 'leading-[1.2]' : 'leading-[1.0]'} tracking-tighter text-[#1a1a1a]`}
                >
                  <span className="font-bold tracking-[0.02em]">{t('Hệ sinh thái')}</span> <br />
                  <span className="text-red-600 font-bold tracking-[0.02em]">{t('Du lịch số')}</span>
                </motion.h1>
              </motion.div>
            </div>
            
            <div className="lg:col-span-4 pb-4">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.18 }}
                className="text-xl text-gray-500 font-light leading-relaxed border-l border-gray-100 pl-8"
              >
                {t('Cổng thông tin toàn diện giúp bạn giải mã vẻ đẹp tiềm ẩn của Nghệ An thông qua những trải nghiệm thực tế và dữ liệu chính xác.')}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CLEAN DIRECTORY LIST (Swiss Style) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl font-serif italic tracking-tighter"
              >
                {t('Mục lục')} <span className="text-red-600">{t('Khám phá')}</span>
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-gray-400 max-w-sm text-sm leading-relaxed"
            >
              {t('Từ cảnh sắc đến con người Xứ Nghệ, tất cả đều sẵn sàng để bạn trải nghiệm một cách trọn vẹn nhất.')}
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-120px' }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 gap-px bg-gray-100 border-t border-b border-gray-100"
          >
            {sections.map((item) => (
              <motion.div
                key={item.path}
                variants={{
                  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
                  show: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.7, ease: 'easeOut' } },
                }}
              >
                <Link 
                  to={item.path} 
                  className="group relative bg-white py-12 flex flex-col md:flex-row md:items-center justify-between transition-all duration-500 hover:px-8"
                >
                  <div className="flex items-center gap-12 z-10">
                    <span className="text-sm font-mono text-gray-300 group-hover:text-red-600 transition-colors">{item.id}</span>
                    <div className="space-y-2">
                      <h3 className="text-3xl md:text-5xl font-serif italic group-hover:translate-x-4 transition-transform duration-500">{t(item.title)}</h3>
                      <p className="text-gray-400 text-sm max-w-md group-hover:translate-x-4 transition-transform duration-500 delay-75">{t(item.desc)}</p>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-0 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {t('Truy cập')} <ArrowRight size={14} />
                  </div>

                  <div className="absolute right-40 top-1/2 -translate-y-1/2 w-64 h-40 rounded-2xl overflow-hidden opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 pointer-events-none hidden lg:block">
                    <img src={item.img} alt={t(item.title)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: IMAGE FOCUS (Clean Grid) */}
      <section className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=1200" 
                alt={t('Văn hóa')} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="space-y-16">
              <div className="space-y-6">
                <span className="text-red-600 text-[10px] font-bold tracking-[0.4em] uppercase">{t('Giá trị cốt lõi')}</span>
                <motion.h2
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-6xl font-serif italic leading-none tracking-tighter"
                >
                  {t('Sứ mệnh của')} <br /> <span className="text-red-600">{t('Chúng tôi')}</span>
                </motion.h2>
              </div>

              <div className="space-y-12">
                {[
                  { title: 'Dữ liệu chính xác', desc: 'Mọi thông tin đều được đội ngũ chuyên gia bản địa kiểm chứng và cập nhật thường xuyên.' },
                  { title: 'Trải nghiệm cá nhân', desc: 'Chúng tôi tin rằng mỗi hành trình đều là duy nhất, và nền tảng này giúp bạn cá nhân hóa điều đó.' },
                  { title: 'Kết nối cộng đồng', desc: 'Xóa nhòa khoảng cách giữa du khách và người dân địa phương thông qua các dự án tình nguyện.' }
                ].map((val, i) => (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="space-y-4 border-l-2 border-gray-100 pl-8 hover:border-red-600 transition-colors"
                  >
                    <h4 className="text-xl font-serif italic font-bold">{t(val.title)}</h4>
                    <p className="text-gray-500 font-light leading-relaxed text-sm">{t(val.desc)}</p>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MINIMAL CTA */}
      <section className="py-40 bg-white text-center">
        <div className="max-w-3xl mx-auto px-8 space-y-12">
          <motion.h2
            initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-7xl md:text-8xl font-serif italic tracking-tighter leading-[0.9]"
          >
            {t('Bắt đầu')} <br />{' '}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.7, ease: 'easeOut' }}
              className="text-red-600 inline-block"
            >
              {t('Hành trình')}
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
            className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed"
          >
            {t('Chọn một chuyên mục từ mục lục phía trên hoặc quay lại trang chủ để bắt đầu khám phá Nghệ An theo cách của bạn.')}
          </motion.p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1a1a1a] hover:text-red-600 transition-colors group"
            >
              {t('Quay lại trang chủ')} 
              <span className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                <ArrowRight size={14} className="group-hover:text-white transition-colors" />
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
