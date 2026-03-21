import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Calendar, User, Tag, ArrowRight, Bookmark, Filter, ChevronRight, Clock } from 'lucide-react';
import { useI18n } from '../i18n';

const blogImage = (fileName: string) =>
  new URL(`../../Blog img/${fileName}`, import.meta.url).href;

const categories = ['Tất cả', 'Kinh nghiệm', 'Ẩm thực', 'Văn hóa', 'Hành trình', 'Cảm hứng'];

const blogPosts = [
  {
    id: 1,
    title: 'Bình minh trên Đảo Chè: Bản giao hưởng của sương và nắng',
    subtitle: 'Hành trình',
    category: 'Hành trình',
    author: 'Minh Anh',
    date: '15 Th03, 2024',
    readTime: '8 phút',
    image: blogImage('Bình Minh trên đào chè.webp'),
    description: 'Đảo Chè Thanh Chương không chỉ là một địa điểm du lịch, đó là nơi tâm hồn bạn được gột rửa bởi sự tĩnh lặng của mặt nước và hương thơm dịu nhẹ của những đồi chè xanh mướt.',
    featured: true,
    link: 'https://www.traveloka.com/vi-vn/explore/destination/dao-che-thanh-chuong-acc/245803'
  },
  {
    id: 2,
    title: 'Súp lươn xứ Nghệ: Vị cay nồng đánh thức mọi giác quan',
    subtitle: 'Ẩm thực',
    category: 'Ẩm thực',
    author: 'Hoàng Nam',
    date: '12 Th03, 2024',
    readTime: '5 phút',
    image: blogImage('súp lươn xứ nghệ.jpg'),
    description: 'Khám phá bí mật đằng sau món ăn làm nên tên tuổi của ẩm thực thành Vinh, từ cách chọn lươn đến sự kết hợp tinh tế của gia vị.',
    link: 'https://vinpearl.com/vi/sup-luon-nghe-an-mot-trong-7-mon-an-doc-dao-nhat-the-gioi'
  },
  {
    id: 3,
    title: 'Về thăm Làng Sen: Nơi thời gian như ngừng lại',
    subtitle: 'Văn hóa',
    category: 'Văn hóa',
    author: 'Thu Hà',
    date: '10 Th03, 2024',
    readTime: '6 phút',
    image: blogImage('Về thăm làng sen.jpg'),
    description: 'Dưới mái nhà tranh đơn sơ, những câu chuyện về Bác Hồ kính yêu hiện lên sống động, nhắc nhở chúng ta về những giá trị cốt lõi của dân tộc.',
    link: 'https://vinpearl.com/vi/vo-xu-nghe-tham-lang-sen-que-bac-di-tich-noi-tieng-tu-bac-vao-nam'
  },
  {
    id: 4,
    title: 'Trải nghiệm tour du lịch mạo hiểm tại Pù Mát.',
    subtitle: 'Kinh nghiệm',
    category: 'Kinh nghiệm',
    author: 'Quốc Bảo',
    date: '08 Th03, 2024',
    readTime: '10 phút',
    image: blogImage('Du lịch mạo hiểm(săn mây).webp'),
    description: 'Tất tần tật những gì bạn cần chuẩn bị cho hành trình chinh phục điểm du lịch hấp dẫn nhất xứ Nghệ, từ trang bị đến thời',
    link: 'https://trekking-camping.com/tour/tour-trekking-cam-trai-cheo-sup-tham-hiem-vqg-pu-mat/'
  },
  {
    id: 5,
    title: 'Mùa hoa hướng dương Nghĩa Đàn: Cánh đồng vàng rực rỡ',
    subtitle: 'Cảm hứng',
    category: 'Cảm hứng',
    author: 'Ngọc Mai',
    date: '05 Th03, 2024',
    readTime: '4 phút',
    image: blogImage('hoa hướng dương nghĩa đàn.webp'),
    description: 'Khi hàng triệu đóa hướng dương cùng khoe sắc dưới ánh nắng miền Trung, đó là lúc Nghĩa Đàn trở thành thiên đường cho những tâm hồn yêu cái đẹp.',
    link: 'https://vinpearl.com/vi/ghe-tham-canh-dong-hoa-huong-duong-nghe-an-diem-check-in-tuyet-dep'
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const { t } = useI18n();

  const filteredPosts = activeCategory === 'Tất cả' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts.find(p => p.featured);

  return (
    <div className="pt-20 bg-[#fdfcf9] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gray-950">
        <motion.div style={{ y }} className="absolute inset-0 z-0 opacity-40">
          <img
            src={blogImage('khoảnh khắc 01.jpg')}
            alt="Blog Hero"
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-transparent to-gray-950" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-12 bg-red-600" />
              <span className="text-red-600 font-mono text-xs font-bold tracking-[0.5em] uppercase">{t('Góc nhìn & Cảm hứng')}</span>
              <div className="h-px w-12 bg-red-600" />
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-bold text-white leading-[0.8] tracking-tighter font-serif">
              {t('Nhật')} <br />
              <span className="italic text-red-600">{t('ký.')}</span>
            </h1>
            
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              {t('Những câu chuyện, kinh nghiệm và cảm hứng cho hành trình của bạn tại mảnh đất Nghệ An.')}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fdfcf9] to-transparent" />
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-sm shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
          >
            <div className="relative aspect-video lg:aspect-auto overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute top-8 left-8 bg-red-600 text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                {t('Tiêu điểm')}
              </div>
            </div>
            <div className="p-12 lg:p-20 flex flex-col justify-center space-y-8">
              <div className="space-y-2">
                <p className="text-red-600 font-bold text-[10px] uppercase tracking-[0.3em]">{t(featuredPost.subtitle)}</p>
                <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight text-gray-900 tracking-tighter">
                  {t(featuredPost.title)}
                </h2>
              </div>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                {t(featuredPost.description)}
              </p>
              <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{featuredPost.author}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{featuredPost.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => featuredPost.link && window.open(featuredPost.link, '_blank', 'noopener,noreferrer')}
                  className="flex items-center space-x-3 text-gray-900 font-bold uppercase tracking-widest text-[10px] group"
                >
                  <span>{t('Đọc tiếp')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-red-600" />
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Categories & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-200 pb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100'
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64 group">
            <input 
              type="text" 
              placeholder={t('Tìm kiếm bài viết...')}
              className="w-full bg-white border border-gray-100 px-10 py-3 rounded-full text-xs focus:outline-none focus:border-red-600 transition-all"
            />
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.filter(p => !p.featured).map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => post.link && window.open(post.link, '_blank', 'noopener,noreferrer')}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-sm mb-8 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:text-red-600 transition-colors">
                    <Bookmark size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-gray-950/80 backdrop-blur-md text-white px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em]">
                    {t(post.category)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-serif text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                  {t(post.title)}
                </h3>
                
                <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">
                  {t(post.description)}
                </p>
                
                <div className="pt-4 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-900 group-hover:translate-x-2 transition-transform">
                  <span>{t('Đọc tiếp')}</span>
                  <ChevronRight size={14} className="text-red-600" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-40">
        <div className="bg-gray-950 rounded-sm p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <img 
              src={blogImage('khoảnh khắc 02.jpg')} 
              alt="Newsletter BG" 
              className="w-full h-full object-cover grayscale" 
            />
            <div className="absolute inset-0 bg-gradient-to-l from-gray-950 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-xl space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-red-600" />
              <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px]">{t('Đăng ký bản tin')}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white font-serif tracking-tighter leading-tight">
              {t('Nhận cảm hứng')} <br /> <span className="text-red-600 italic">{t('mỗi tuần.')}</span>
            </h2>
            <p className="text-gray-400 font-light leading-relaxed">
              {t('Đăng ký để nhận những câu chuyện du lịch mới nhất, kinh nghiệm độc quyền và ưu đãi hành trình từ Nghệ An Discovery.')}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 pt-4">
              <input 
                type="email" 
                placeholder={t('Địa chỉ email của bạn')}
                className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-white text-sm focus:outline-none focus:border-red-600 transition-all rounded-sm"
              />
              <button className="bg-red-600 text-white font-bold py-4 px-10 rounded-sm hover:bg-red-700 transition-all uppercase tracking-widest text-xs">
                {t('Đăng ký ngay')}
              </button>
            </form>
            <p className="text-[10px] text-gray-500 italic">
              {t('* Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào.')}
            </p>
          </div>
        </div>
      </section>

      {/* Instagram Feed / Visual Inspiration */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-serif tracking-tighter">{t('Khoảnh khắc')} <span className="text-red-600 italic">#NgheAnDiscovery</span></h2>
            <p className="text-gray-400 text-sm font-light tracking-widest uppercase">{t('Theo dõi chúng tôi để thấy nhiều hơn')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              blogImage('khoảnh khắc 01.jpg'),
              blogImage('Khoảnh khắc 02.jpg'),
              blogImage('Khoảnh khắc 03.jpg'),
              blogImage('khoảnh khắc 04.jpg'),
              blogImage('khoảnh khắc 05.jpg'),
              blogImage('khoảnh khắc 06.jpg'),
            ].map((src, i) => (
              <motion.div
                key={src}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                className="aspect-square overflow-hidden rounded-sm cursor-pointer grayscale hover:grayscale-0 transition-all duration-500"
              >
                <img 
                  src={src} 
                  alt={`Moment ${i}`} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
