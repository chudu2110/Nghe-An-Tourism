import React from 'react';
import Section from '../components/Section';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../i18n';

export default function About() {
  const { t } = useI18n();
  return (
    <div className="pt-24 overflow-hidden">
      {/* Hero Section - Editorial Style */}
      <section className="relative bg-gray-900 py-32 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(153,27,27,0.4),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
              <Sparkles size={16} className="text-red-500" />
              <span>{t('Hành trình kết nối văn hóa')}</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-bold mb-8 tracking-tighter leading-none">
              {t('Về')} <span className="italic font-serif text-red-600">{t('chúng tôi')}</span>
            </h1>
            <p className="text-2xl text-gray-400 max-w-2xl leading-relaxed">
              {t('Sứ mệnh của chúng tôi là mang vẻ đẹp của Nghệ An đến gần hơn với mọi người, bằng tình yêu và sự thấu hiểu sâu sắc về mảnh đất này.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section - Overlapping Layout */}
      <Section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img
                src="https://picsum.photos/seed/about-us/1200/800"
                alt="Our Story"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gray-900/5 rounded-full blur-3xl" />
          </div>
          
          <div className="lg:col-span-5 lg:-ml-20 relative z-20">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-2xl border border-gray-100"
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                {t('Nghệ An Travel - Cổng thông tin du lịch toàn diện.')}
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  {t('Website này được xây dựng với mong muốn cung cấp cho du khách trong và ngoài nước những thông tin chính xác, đầy đủ và hấp dẫn nhất về du lịch Nghệ An.')}
                </p>
                <p>
                  {t('Từ những điểm đến nổi tiếng đến những góc khuất hoang sơ, chúng tôi hy vọng sẽ là người bạn đồng hành tin cậy trên mỗi bước chân của bạn.')}
                </p>
                <p className="italic font-serif text-xl border-l-4 border-red-600 pl-6 py-2">
                  {t('"Chúng tôi tin rằng Nghệ An có một sức hút kỳ lạ, một sự kết hợp hoàn hảo giữa thiên nhiên hùng vĩ và bề dày lịch sử văn hóa."')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Contact Section - Modern Grid */}
      <section className="bg-gray-50 py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-16">
              <div>
                <h2 className="text-sm font-bold text-red-600 uppercase tracking-[0.3em] mb-6">{t('Liên hệ')}</h2>
                <h3 className="text-5xl font-bold text-gray-900 leading-tight">{t('Chúng tôi luôn lắng nghe bạn')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  { icon: <MapPin />, title: t('Địa chỉ'), value: t('TP Vinh, Nghệ An, Việt Nam') },
                  { icon: <Phone />, title: t('Điện thoại'), value: '+84 123 456 789' },
                  { icon: <Mail />, title: t('Email'), value: 'info@nghean-travel.com' },
                ].map((item, idx) => (
                  <div key={idx} className="group p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-500 leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 hover:-translate-y-1 transition-all shadow-lg"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-red-600 rounded-[3rem] -rotate-2 opacity-10" />
              <div className="relative bg-white p-12 shadow-2xl rounded-[2.5rem] border border-gray-100">
                <h3 className="text-3xl font-bold mb-10 text-center">{t('Gửi tin nhắn')}</h3>
                <form className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">{t('Họ và tên')}</label>
                    <input type="text" className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none focus:ring-2 ring-red-600/20 border border-transparent focus:border-red-600 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">{t('Email')}</label>
                    <input type="email" className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none focus:ring-2 ring-red-600/20 border border-transparent focus:border-red-600 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">{t('Tin nhắn')}</label>
                    <textarea rows={5} className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none focus:ring-2 ring-red-600/20 border border-transparent focus:border-red-600 transition-all resize-none" />
                  </div>
                  <button className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 hover:-translate-y-1">
                    {t('Gửi tin nhắn ngay')} <ArrowRight size={18} className="inline ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
