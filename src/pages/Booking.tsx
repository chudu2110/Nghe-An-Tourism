import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Building2, Train, Car, Hotel, ArrowRight, Star, MapPin, ShieldCheck, Clock, CreditCard, Phone, Sparkles, Zap, Award } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import { useI18n } from '../i18n';

const planningImage = (fileName: string) =>
  new URL(`../../Planning img/${fileName}`, import.meta.url).href;

export const bookingCategories = [
  { id: 'hotels', icon: <Hotel />, label: 'Khách sạn', description: '3-5 sao sang trọng' },
  { id: 'homestays', icon: <Building2 />, label: 'Homestay', description: 'Trải nghiệm bản địa' },
  { id: 'cars', icon: <Car />, label: 'Thuê xe', description: 'Tự lái & Tài xế' },
  { id: 'transport', icon: <Train />, label: 'Di chuyển', description: 'Tàu hỏa & Máy bay' },
];

export const services = {
  hotels: [
    { id: 1, name: 'Mường Thanh Luxury Sông Lam', location: 'TP Vinh', price: '1.500.000đ', rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', tags: ['5 Sao', 'Hồ bơi'] },
    { id: 2, name: 'Vinpearl Discovery Cửa Hội', location: 'Cửa Lò', price: '2.800.000đ', rating: 4.8, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800', tags: ['Resort', 'Bãi biển'] },
    { id: 3, name: 'Saigon Kim Lien Hotel', location: 'TP Vinh', price: '900.000đ', rating: 4.5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', tags: ['4 Sao', 'Trung tâm'] },
  ],
  homestays: [
    { id: 4, name: 'Hồng Sơn Homestay', location: 'Con Cuông', price: '350.000đ', rating: 4.7, image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800', tags: ['Nhà sàn', 'Pù Mát'] },
    { id: 5, name: 'Làng Sen Homestay', location: 'Nam Đàn', price: '400.000đ', rating: 4.6, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', tags: ['Yên tĩnh', 'Cánh đồng'] },
  ],
  cars: [
    { id: 6, name: 'Toyota Fortuner 2023', location: 'TP Vinh', price: '1.200.000đ/ngày', rating: 4.9, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', tags: ['7 Chỗ', 'Tự lái'] },
    { id: 7, name: 'Hyundai Accent 2022', location: 'TP Vinh', price: '800.000đ/ngày', rating: 4.8, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800', tags: ['5 Chỗ', 'Tiết kiệm'] },
  ],
  transport: [
    { id: 8, name: 'Vietnam Airlines', location: 'Sân bay Vinh', price: '800.000đ', rating: 4.9, image: planningImage('Hàng không.webp'), tags: ['Hàng không', 'Uy tín'] },
    { id: 9, name: 'Đường sắt Việt Nam', location: 'Ga Vinh', price: '300.000đ', rating: 4.5, image: planningImage('Đường sắt.jpg'), tags: ['Tàu hỏa', 'An toàn'] },
  ]
};

export default function Booking() {
  const [activeCategory, setActiveCategory] = useState('hotels');
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const next = new URLSearchParams(location.search).get('category')?.trim();
    if (!next) return;
    if (bookingCategories.some((c) => c.id === next)) setActiveCategory(next);
  }, [location.search]);

  return (
    <div className="pt-20 bg-white overflow-hidden">
      {/* SECTION 1: EDITORIAL HERO (Recipe 2 & 11) */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden border-b border-gray-100">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 text-[30vw] font-black text-gray-50 select-none leading-none tracking-tighter">
            {t('ĐẶT')}
          </div>
          <div className="absolute -bottom-20 -right-20 text-[30vw] font-black text-gray-50 select-none leading-none tracking-tighter">
            {t('NGAY')}
          </div>
          {/* Vertical Rail Text */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden xl:block">
            <div className="writing-mode-vertical-rl rotate-180 text-[10px] font-bold tracking-[0.8em] text-gray-300 uppercase">
              {t('DỊCH VỤ NGHE AN TRAVEL • 2026')}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-12"
          >
            <span className="text-red-600 font-mono text-[10px] font-bold tracking-[0.6em] uppercase">
              {t('Trải nghiệm đặt dịch vụ cao cấp')}
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[12vw] font-bold text-gray-900 mb-12 font-serif leading-[0.85] tracking-tighter uppercase"
          >
            {t('Hành trình')} <br /> 
            <span className="italic text-red-600">{t('Hoàn hảo.')}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8"
          >
            {bookingCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById('booking-content')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center space-x-3 bg-white border border-gray-200 py-4 px-8 rounded-full hover:border-red-600 hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-500"
              >
                <div className="text-red-600 group-hover:scale-110 transition-transform">
                  {React.cloneElement(cat.icon as React.ReactElement, { size: 18 })}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{t(cat.label)}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-300"
        >
          <div className="w-px h-16 bg-gradient-to-b from-gray-300 to-transparent" />
        </motion.div>
      </section>

      {/* SECTION 2: BOOKING PROCESS (Recipe 5 Style) */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-gray-900">
            {[
              { step: '01', title: t('Tìm kiếm'), desc: t('Lựa chọn dịch vụ phù hợp với nhu cầu của bạn.') },
              { step: '02', title: t('Tùy chỉnh'), desc: t('Chọn thời gian, địa điểm và các yêu cầu đi kèm.') },
              { step: '03', title: t('Xác nhận'), desc: t('Thanh toán an toàn qua nhiều phương thức linh hoạt.') },
              { step: '04', title: t('Khởi hành'), desc: t('Nhận vé điện tử và sẵn sàng cho chuyến đi.') },
            ].map((item, i) => (
              <div key={i} className="p-12 border-b md:border-b-0 md:border-r border-gray-900 last:border-0 hover:bg-red-600 hover:text-white transition-all duration-500 group">
                <span className="text-4xl font-black font-serif mb-8 block opacity-20 group-hover:opacity-100 transition-opacity">{item.step}</span>
                <h4 className="text-lg font-bold uppercase tracking-widest mb-4">{item.title}</h4>
                <p className="text-gray-500 group-hover:text-white/80 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Interface - Editorial Tabs & Grid */}
      <section id="booking-content" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar Tabs - Vertical Rail Style */}
            <div className="lg:w-1/4">
              <div className="sticky top-32 space-y-4">
                <h2 className="text-3xl font-bold font-serif mb-10">{t('Danh mục.')}</h2>
                <div className="flex flex-col space-y-2">
                  {bookingCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`group flex items-center justify-between p-6 rounded-sm transition-all duration-500 text-left ${
                        activeCategory === cat.id
                          ? 'bg-gray-900 text-white shadow-2xl'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`${activeCategory === cat.id ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600'} transition-colors`}>
                          {React.cloneElement(cat.icon as React.ReactElement, { size: 24 })}
                        </div>
                        <div>
                          <p className="font-bold text-sm uppercase tracking-widest">{t(cat.label)}</p>
                          <p className={`text-[10px] mt-1 ${activeCategory === cat.id ? 'text-gray-400' : 'text-gray-400'}`}>
                            {t(cat.description)}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className={`transition-transform duration-500 ${activeCategory === cat.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                    </button>
                  ))}
                </div>
                
                {/* Support Card */}
                <div className="mt-12 p-8 bg-red-600 rounded-sm text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <Phone className="mb-4" size={32} />
                    <h4 className="font-bold text-lg mb-2">{t('Hỗ trợ đặt lịch?')}</h4>
                    <p className="text-red-100 text-xs mb-6">{t('Gọi ngay cho chúng tôi để được tư vấn miễn phí 24/7.')}</p>
                    <p className="text-2xl font-bold">1900 1234</p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="lg:w-3/4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                  {services[activeCategory as keyof typeof services].map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative"
                    >
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-8 shadow-xl relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Floating Price Tag */}
                        <div className="absolute top-6 left-6 bg-white py-2 px-4 rounded-sm shadow-xl">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-1">{t('Từ')}</p>
                          <p className="text-sm font-bold text-red-600 leading-none">{item.price}</p>
                        </div>

                        {/* Rating Overlay */}
                        <div className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-md text-white py-2 px-3 rounded-sm flex items-center space-x-2">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold">{item.rating}</span>
                        </div>
                      </div>

                      <div className="absolute -bottom-6 left-6 right-6 bg-white p-8 rounded-xl shadow-2xl transform group-hover:-translate-y-4 transition-transform duration-500 border border-gray-100">
                        <div className="flex items-center text-red-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                          <MapPin size={12} className="mr-2" />
                          {t(item.location)}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">{t(item.name)}</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100 px-2 py-1 rounded">
                              {t(tag)}
                            </span>
                          ))}
                        </div>
                        <button className="w-full bg-gray-900 text-white py-4 rounded-sm font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-red-600 transition-all duration-300 shadow-lg">
                          {t('Đặt ngay')}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Brutalist Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-bold font-serif mb-6">{t('Cam kết dịch vụ.')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto font-light">{t('Chúng tôi kết nối bạn với những đối tác uy tín nhất để đảm bảo mỗi chuyến đi đều là một kỷ niệm đẹp.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-gray-900">
            {[
              { icon: <ShieldCheck size={32} />, title: t('An toàn tuyệt đối'), desc: t('Mọi đối tác đều được kiểm duyệt kỹ lưỡng về chất lượng và uy tín.') },
              { icon: <Clock size={32} />, title: t('Hỗ trợ 24/7'), desc: t('Đội ngũ hỗ trợ bản địa luôn sẵn sàng giúp đỡ bạn trong mọi tình huống.') },
              { icon: <CreditCard size={32} />, title: t('Thanh toán linh hoạt'), desc: t('Đa dạng phương thức thanh toán an toàn, minh bạch và nhanh chóng.') },
              { icon: <Award size={32} />, title: t('Giá tốt nhất'), desc: t('Cam kết mức giá cạnh tranh nhất cùng nhiều ưu đãi độc quyền.') },
            ].map((item, idx) => (
              <div key={idx} className={`p-12 group hover:bg-gray-950 transition-colors duration-500 ${idx !== 3 ? 'lg:border-r border-gray-900' : ''} ${idx !== 0 ? 'border-t lg:border-t-0 border-gray-900' : ''}`}>
                <div className="text-red-600 mb-8 transform group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-xl font-bold mb-6 group-hover:text-white transition-colors uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive CTA Section */}
      <section className="relative py-32 bg-gray-950 overflow-hidden group">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-red-600 font-mono text-xs font-bold tracking-[0.5em] uppercase mb-8 block">{t('Ưu đãi độc quyền')}</span>
                <h2 className="text-5xl md:text-8xl font-bold text-white mb-8 font-serif leading-[0.9] tracking-tighter">
                  {t('Sẵn sàng')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                    {t('Khởi hành?')}
                  </span>
                </h2>
                <p className="text-gray-400 text-xl max-w-xl mb-12 leading-relaxed font-light">
                  {t('Đừng bỏ lỡ những ưu đãi đặc biệt dành riêng cho khách hàng đặt lịch sớm. Hãy để chúng tôi chăm sóc mọi chi tiết cho chuyến đi của bạn.')}
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <button
                    type="button"
                    onClick={() => navigate('/lucky-wheel')}
                    className="group/btn relative overflow-hidden bg-red-600 text-white font-bold py-5 px-10 rounded-sm transition-all hover:bg-red-700 text-center uppercase tracking-widest text-xs shadow-2xl shadow-red-600/20"
                  >
                    <span className="relative z-10">{t('Khám phá ưu đãi')}</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/assistant')}
                    className="group/btn relative overflow-hidden border border-white/20 text-white font-bold py-5 px-10 rounded-sm transition-all hover:border-red-600 text-center uppercase tracking-widest text-xs"
                  >
                    <span className="relative z-10">{t('Liên hệ tư vấn')}</span>
                    <div className="absolute inset-0 bg-red-600 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-square rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200" 
                  alt={t('Trải nghiệm du lịch')}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {/* Floating Badge */}
              <div className="absolute -top-10 -right-10 bg-white p-8 rounded-full shadow-2xl animate-bounce">
                <Zap className="text-red-600" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
