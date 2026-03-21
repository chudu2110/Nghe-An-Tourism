import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Clock, ChevronRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const planningImage = (fileName: string) =>
  new URL(`../../Planning img/${fileName}`, import.meta.url).href;

const itineraries = [
  {
    title: "Di sản & Biển xanh",
    duration: "2 Ngày 1 Đêm",
    days: [
      {
        day: "01",
        title: "Vinh - Nam Đàn",
        desc: "Khám phá cội nguồn lịch sử tại Khu di tích Kim Liên, thưởng thức đặc sản Bê thui Nam Đàn và ngắm hoàng hôn trên núi Quyết.",
        image: planningImage('Vinh Nam Đàn.webp')
      },
      {
        day: "02",
        title: "Cửa Lò - Vinh",
        desc: "Đón bình minh trên biển Cửa Lò, trải nghiệm câu mực đêm và mua sắm hải sản tươi sống tại chợ đặc sản.",
        image: planningImage('Cửa lò Vinh.jpg')
      }
    ]
  },
  {
    title: "Đại ngàn miền Tây",
    duration: "3 Ngày 2 Đêm",
    days: [
      {
        day: "01",
        title: "Vinh - Nam Đàn",
        desc: "Thăm quê nội, quê ngoại Bác Hồ và tìm hiểu về văn hóa làng sen truyền thống.",
        image: planningImage('Vinh Nam Đàn 02.jpg')
      },
      {
        day: "02",
        title: "Con Cuông - Thác Kèm",
        desc: "Hòa mình vào thiên nhiên hoang sơ của Vườn quốc gia Pù Mát, tắm thác Kèm và thưởng thức cơm lam, cá mát.",
        image: planningImage('Con cuông.webp')
      },
      {
        day: "03",
        title: "Thanh Chương - Vinh",
        desc: "Check-in Đảo Chè Thanh Chương - 'Hạ Long trên cạn' của Nghệ An trước khi kết thúc hành trình.",
        image: planningImage('Thanh chương.webp')
      }
    ]
  }
];

const transport = [
  { num: '01', title: 'Hàng không', image: planningImage('Hàng không.webp'), desc: 'Sân bay Quốc tế Vinh kết nối trực tiếp với Hà Nội, TP.HCM, Đà Nẵng và các thành phố lớn.', detail: '15+ chuyến mỗi ngày' },
  { num: '02', title: 'Đường sắt', image: planningImage('Đường sắt.jpg'), desc: 'Ga Vinh là điểm dừng quan trọng trên tuyến Bắc - Nam, thuận tiện cho việc di chuyển chậm và ngắm cảnh.', detail: 'Tuyến SE1, SE3, SE5, SE7' },
  { num: '03', title: 'Đường bộ', image: planningImage('đường bộ.jpg'), desc: 'Hệ thống xe khách chất lượng cao và đường cao tốc giúp việc di chuyển từ Hà Nội chỉ mất khoảng 4-5 giờ.', detail: 'Xe giường nằm 24/7' },
];

export default function Planning() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="pt-20 bg-[#faf9f6] overflow-hidden selection:bg-red-100 selection:text-red-900">
      {/* Hero Section - Matched with FoodCulture */}
      <section className="relative h-[90vh] bg-gray-950 text-white overflow-hidden">
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920" 
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
                    {t('Hướng dẫn du lịch')}
                  </span>
                </div>
                <h1 className="text-7xl md:text-[10rem] font-bold mb-10 font-serif leading-[0.8] tracking-tighter">
                  {t('Lên kế hoạch')}
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mb-12 leading-relaxed font-light">
                  {t('Từ lịch trình chi tiết đến phương thức di chuyển, chúng tôi chuẩn bị mọi thứ để bạn có một chuyến đi Xứ Nghệ trọn vẹn nhất.')}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                  {[
                    { label: t('Hành trình gợi ý'), value: '05+' },
                    { label: t('Phương tiện di chuyển'), value: '03' },
                    { label: t('Điểm đến nổi bật'), value: '50+' },
                    { label: t('Hỗ trợ 24/7'), value: t('Có') }
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

      {/* Section 1: Itineraries - Asymmetric Breakthrough */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32">
            <div className="space-y-6">
              <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px] block">{t('Lịch trình gợi ý')}</span>
              <h2 className="text-6xl md:text-9xl font-bold font-serif leading-none tracking-tighter text-gray-900">
                {t('Hành trình')} <br /> <span className="text-red-600 italic">{t('khám phá.')}</span>
              </h2>
            </div>
            <div className="max-w-xs text-right mt-12 md:mt-0">
              <p className="text-gray-400 text-sm font-light italic leading-relaxed">
                {t('"Mỗi chuyến đi là một chương mới trong cuốn sách cuộc đời."')}
              </p>
            </div>
          </div>

          <div className="space-y-60">
            {itineraries.map((itinerary, idx) => (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                <div className={`lg:col-span-4 space-y-12 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="space-y-6">
                    <span className="text-red-600 font-bold text-[10px] tracking-widest uppercase block">{t(itinerary.duration)}</span>
                    <h3 className="text-5xl font-bold font-serif text-gray-900 leading-tight">{t(itinerary.title)}</h3>
                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                      {t('Một hành trình được thiết kế tỉ mỉ để bạn cảm nhận trọn vẹn vẻ đẹp và tâm hồn của mảnh đất Nghệ An.')}
                    </p>
                  </div>
                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={() => navigate('/booking')}
                      className="group flex items-center space-x-8 text-gray-900 font-bold uppercase tracking-widest text-xs"
                    >
                      <span>{t('Tải PDF chi tiết')}</span>
                      <div className="w-20 h-[1px] bg-gray-200 group-hover:w-32 group-hover:bg-red-600 transition-all duration-500" />
                      <ArrowRight size={20} className="group-hover:text-red-600 transition-colors" />
                    </button>
                  </div>
                </div>
                
                <div className={`lg:col-span-8 space-y-24 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {itinerary.days.map((day, dIdx) => (
                    <motion.div
                      key={dIdx}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center group"
                    >
                      <div className="md:col-span-2">
                        <span className="text-8xl font-bold text-gray-100 group-hover:text-red-600/20 transition-colors duration-700 font-serif italic">{day.day}</span>
                      </div>
                      <div className="md:col-span-4">
                        <h4 className="text-2xl font-bold font-serif mb-4 text-gray-900">{t(day.title)}</h4>
                        <p className="text-gray-500 text-sm font-light leading-relaxed">{t(day.desc)}</p>
                      </div>
                      <div className="md:col-span-6">
                        <div className="aspect-[16/10] overflow-hidden rounded-sm relative shadow-2xl">
                          <img 
                            src={day.image} 
                            alt={t(day.title)} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Transport - Editorial Staggered Layout */}
      <section className="py-40 bg-[#fdfdfb] text-gray-900 overflow-hidden relative">
        {/* Vertical Rail Text - A unique design touch */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
          <div className="rotate-90 origin-left text-[10px] font-bold uppercase tracking-[1em] text-gray-200 whitespace-nowrap">
            {t('DI CHUYỂN • NGHỆ AN • VIỆT NAM • 2024')}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-12">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-block px-4 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.3em]">
                {t('Hướng dẫn di chuyển')}
              </div>
              <h2 className="text-6xl md:text-8xl font-bold font-serif leading-[0.9] tracking-tighter">
                {t('Kết nối')} <br /> <span className="text-red-600 italic">{t('mọi miền.')}</span>
              </h2>
            </div>
            <div className="lg:w-1/3">
              <p className="text-gray-500 text-lg font-light leading-relaxed border-l-2 border-gray-100 pl-8">
                {t('Nghệ An là đầu mối giao thông quan trọng, giúp bạn dễ dàng tiếp cận bằng mọi phương tiện với hệ thống hạ tầng hiện đại và thuận tiện nhất khu vực miền Trung.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {transport.map((item, i) => (
              <div 
                key={i} 
                className={`group relative transition-all duration-1000 ${i === 1 ? 'md:mt-24' : i === 2 ? 'md:mt-48' : ''}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-gray-100 shadow-2xl">
                  <img 
                    src={item.image} 
                    alt={t(item.title)}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <span className="absolute top-6 left-6 text-6xl font-serif italic text-white/30 group-hover:text-white transition-colors duration-500">
                    {item.num}
                  </span>
                  
                  {/* Floating Badge on Hover */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="bg-white p-4 rounded-full shadow-xl">
                      <ChevronRight className="text-red-600" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-4xl font-bold font-serif text-gray-900 group-hover:text-red-600 transition-colors duration-300">{t(item.title)}</h4>
                    <div className="w-12 h-[1px] bg-gray-200 group-hover:w-24 group-hover:bg-red-600 transition-all duration-500" />
                  </div>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">{t(item.desc)}</p>
                  
                  <div className="flex items-center space-x-4 text-red-600">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{t(item.detail)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/booking')}
                    className="w-full py-5 border border-gray-900 text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-500 shadow-sm hover:shadow-xl"
                  >
                    {t('Đặt vé ngay')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Weather & Seasons - Atmospheric Immersive */}
      <section className="min-h-screen bg-[#f5f2ed] relative flex items-center overflow-hidden py-40">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-white/50 skew-x-12 -translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 aspect-[4/5] rounded-[5rem] overflow-hidden shadow-[60px_60px_100px_-20px_rgba(0,0,0,0.15)]">
                <img 
                  src={planningImage('4 mùa.webp')} 
                  alt={t('Bốn mùa Nghệ An')}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 bg-white p-8 rounded-2xl shadow-2xl hidden md:block border border-gray-50 z-20">
                <div className="space-y-4">
                  <div className="text-red-600 font-serif text-4xl">28°C</div>
                  <p className="text-gray-900 font-bold text-base font-serif italic leading-tight">
                    {t('"Nhiệt độ trung bình lý tưởng cho những chuyến hành trình."')}
                  </p>
                  <p className="text-gray-400 text-[9px] uppercase tracking-[0.2em] font-bold">{t('Thời tiết Xứ Nghệ')}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-12 relative z-30">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-[1px] w-12 bg-red-600" />
                  <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px]">{t('Thời điểm lý tưởng')}</span>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-bold font-serif leading-[0.85] tracking-tighter text-gray-900">
                  {t('Bốn mùa')} <br /> <span className="text-red-600 italic">{t('thay áo.')}</span>
                </h2>
              </div>

              <div className="space-y-12 pt-8">
                {[
                  { season: t('Mùa Xuân (Tháng 2 - 4)'), desc: t('Thời tiết mát mẻ, lý tưởng cho các hoạt động tâm linh, lễ hội đầu năm và thăm quê Bác.') },
                  { season: t('Mùa Hè (Tháng 5 - 8)'), desc: t('Thời điểm tuyệt vời nhất để nghỉ mát tại biển Cửa Lò, Quỳnh Bảng hay Bãi Lữ.') },
                  { season: t('Mùa Thu - Đông (Tháng 9 - 1)'), desc: t('Mùa của hoa hướng dương (tháng 12) và khám phá vẻ đẹp hùng vĩ của miền Tây Nghệ An.') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6 group">
                    <div className="w-1 h-1 bg-red-600 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">{item.season}</h4>
                      <p className="text-gray-500 text-sm font-light leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Packing Checklist - Creative Bento Grid */}
      <section className="py-40 bg-[#faf9f6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-[1px] bg-red-600" />
                  <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px]">{t('Hướng dẫn chuẩn bị')}</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-bold font-serif tracking-tighter text-gray-900 leading-[0.9]">
                {t('Chuẩn bị')} <br /> <span className="text-red-600 italic">{t('chu đáo.')}</span>
              </h2>
            </div>
            <p className="text-gray-400 text-lg font-light max-w-sm leading-relaxed">
              {t('Một hành trình hoàn hảo bắt đầu từ những khâu chuẩn bị nhỏ nhất. Hãy chắc chắn bạn đã mang theo những thứ cần thiết.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 min-h-[800px]">
            {/* Card 1: Essential Documents */}
            <div className="md:col-span-2 md:row-span-1 bg-white p-8 md:p-10 flex flex-col justify-between group hover:bg-red-600 transition-all duration-700 shadow-sm hover:shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="p-3 opacity-0 group-hover:opacity-0">
                  {/* Icon removed */}
                </div>
                <span className="text-3xl font-serif italic text-gray-100 group-hover:text-white/20">01</span>
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 group-hover:text-white">{t('Giấy tờ tùy thân')}</h4>
                <p className="text-gray-500 group-hover:text-white/80 font-light text-sm md:text-base">{t('CCCD hoặc Hộ chiếu là vật bất ly thân cho mọi thủ tục lưu trú và di chuyển.')}</p>
              </div>
            </div>

            {/* Card 2: Attire */}
            <div className="md:col-span-1 md:row-span-2 bg-gray-900 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800" 
                  alt={t('Trang phục')}
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 opacity-0 group-hover:opacity-0">
                  {/* Icon removed */}
                </div>
                <span className="text-3xl font-serif italic text-white/10">02</span>
              </div>
              <div className="relative z-10 space-y-3">
                <h4 className="text-2xl md:text-3xl font-bold font-serif text-white">{t('Trang phục')}</h4>
                <p className="text-gray-400 group-hover:text-white transition-colors font-light text-sm md:text-base">{t('Lựa chọn trang phục lịch sự khi thăm các di tích lịch sử và đền chùa linh thiêng.')}</p>
              </div>
            </div>

            {/* Card 3: Beach Gear */}
            <div className="md:col-span-1 md:row-span-1 bg-red-600 p-8 md:p-10 flex flex-col justify-between group hover:bg-white transition-all duration-700 shadow-xl">
              <div className="flex justify-between items-start">
                <div className="p-3 opacity-0 group-hover:opacity-0">
                  {/* Icon removed */}
                </div>
                <span className="text-3xl font-serif italic text-white/20 group-hover:text-red-600/10">03</span>
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl md:text-3xl font-bold font-serif text-white group-hover:text-gray-900">{t('Biển xanh')}</h4>
                <p className="text-white/80 group-hover:text-gray-500 font-light text-sm md:text-base">{t('Kem chống nắng, kính mát và đồ bơi cho những ngày nắng vàng tại Cửa Lò.')}</p>
              </div>
            </div>

            {/* Card 4: Adventure Gear */}
            <div className="md:col-span-1 md:row-span-1 bg-white p-8 md:p-10 flex flex-col justify-between group hover:bg-gray-900 transition-all duration-700 shadow-sm hover:shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="p-3 opacity-0 group-hover:opacity-0">
                  {/* Icon removed */}
                </div>
                <span className="text-3xl font-serif italic text-gray-100 group-hover:text-white/10">04</span>
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 group-hover:text-white">{t('Khám phá')}</h4>
                <p className="text-gray-500 group-hover:text-white/80 font-light text-sm md:text-base">{t('Giày đi bộ hoặc leo núi chuyên dụng cho hành trình chinh phục đại ngàn Pù Mát.')}</p>
              </div>
            </div>

            {/* Card 5: Essential Items */}
            <div className="md:col-span-2 md:row-span-1 bg-[#e4e3e0] p-8 md:p-10 flex flex-col md:flex-row gap-8 group hover:bg-white transition-all duration-700 shadow-sm hover:shadow-2xl">
              <div className="flex-1 space-y-6 flex flex-col justify-between">
                <div className="p-3 opacity-0 group-hover:opacity-0">
                  {/* Icon removed */}
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">{t('Đồ dùng thiết yếu')}</h4>
                  <p className="text-gray-500 font-light text-sm md:text-base">{t('Thuốc chống côn trùng, bản đồ offline và sạc dự phòng cho những vùng sóng yếu.')}</p>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden rounded-2xl min-h-[150px]">
                <img 
                  src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=800" 
                  alt={t('Đồ dùng thiết yếu')}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Volunteer Support - Atmospheric Immersive */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd2671017f81?auto=format&fit=crop&q=80&w=1920" 
            alt={t('Hỗ trợ tình nguyện viên')}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-[2px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-[1px] bg-red-600" />
                  <span className="text-red-500 font-bold tracking-[0.4em] uppercase text-[10px]">{t('Cố vấn hành trình')}</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-bold font-serif text-white leading-[0.9] tracking-tighter">
                  {t('Đồng hành')} <br /> <span className="text-red-600 italic">{t('tận tâm.')}</span>
                </h2>
              </div>
              
              <div className="p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] space-y-8 max-w-2xl">
                <p className="text-gray-300 text-xl font-light leading-relaxed">
                  {t('Đội ngũ tình nguyện viên am hiểu bản địa luôn sẵn sàng lắng nghe và tư vấn lộ trình cá nhân hóa, giúp bạn chạm đến những góc khuất đẹp nhất của Xứ Nghệ.')}
                </p>
                
                <div className="flex flex-wrap gap-x-10 gap-y-6">
                  {[
                    t('Tư vấn 24/7'),
                    t('Hoàn toàn miễn phí'),
                    t('Am hiểu bản địa')
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3 text-white/60">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96 group cursor-pointer">
                {/* Rotating Border */}
                <div className="absolute inset-0 border border-dashed border-white/20 rounded-full animate-[spin_30s_linear_infinite]" />
                
                {/* Main Circle */}
                <div className="absolute inset-4 bg-red-600 rounded-full flex flex-col items-center justify-center text-white text-center p-8 transition-transform duration-700 group-hover:scale-105 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                  <span className="text-[9px] uppercase tracking-[0.5em] mb-4 opacity-70">{t('Bắt đầu ngay')}</span>
                  <h4 className="text-2xl md:text-3xl font-bold font-serif mb-8 leading-tight">{t('Kết nối với')} <br /> {t('tình nguyện viên')}</h4>
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-500">
                    <ArrowRight className="text-red-600 group-hover:text-white transition-colors" size={24} />
                  </div>
                </div>

                {/* Decorative Orbiting Dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff]" />
              </div>
              
              {/* Background Glows */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/20 rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-600/10 rounded-full blur-[100px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Visual Inspiration - Dot Matrix Pattern */}
      <section className="py-40 bg-[#faf9f6] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12 relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter text-gray-900 leading-tight">
            {t('Hành trình là')} <span className="text-red-600 italic">{t('trải nghiệm,')}</span> <br /> 
            {t('Kế hoạch là')} <span className="text-red-600 italic">{t('khởi đầu.')}</span>
          </h2>
          <p className="text-gray-400 text-xl font-light leading-relaxed">
            {t('Hãy để chúng tôi đồng hành cùng bạn trong từng bước chân khám phá mảnh đất Nghệ An đầy ân tình.')}
          </p>
        </div>
      </section>
    </div>
  );
}
