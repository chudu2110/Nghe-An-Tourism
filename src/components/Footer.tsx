import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { useI18n } from '../i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo và About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <div className="bg-red-600 text-white w-10 h-10 flex items-center justify-center font-black text-xl rounded-full group-hover:rotate-12 transition-transform duration-500">
                N
              </div>
              <span className="font-serif font-bold text-2xl tracking-tighter text-white">
                Nghệ An<span className="text-red-600">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('Khám phá vẻ đẹp, văn hóa và con người Nghệ An. Chúng tôi cung cấp thông tin du lịch toàn diện để bạn có một hành trình đáng nhớ.')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wider uppercase">{t('Khám phá')}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/destinations" className="hover:text-white transition-colors">{t('Điểm đến')}</Link></li>
              <li><Link to="/experiences" className="hover:text-white transition-colors">{t('Trải nghiệm')}</Link></li>
              <li><Link to="/food-culture" className="hover:text-white transition-colors">{t('Ẩm thực & Văn hóa')}</Link></li>
              <li><Link to="/planning" className="hover:text-white transition-colors">{t('Lên kế hoạch')}</Link></li>
              <li><Link to="/booking" className="hover:text-white transition-colors">{t('Đặt lịch & Dịch vụ')}</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wider uppercase">{t('Thông tin')}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/blog" className="hover:text-white transition-colors">{t('Blog du lịch')}</Link></li>
              <li><Link to="/dictionary" className="hover:text-white transition-colors">{t('Từ điển tiếng Nghệ')}</Link></li>
              <li><Link to="/volunteers" className="hover:text-white transition-colors">{t('Hướng dẫn viên tình nguyện')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('Về chúng tôi')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wider uppercase">{t('Liên hệ')}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-red-600 shrink-0" />
                <span>{t('TP Vinh, Nghệ An, Việt Nam')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-red-600 shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-red-600 shrink-0" />
                <span>info@nghean-travel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© 2026 Nghệ An Travel. {t('Tất cả quyền được bảo lưu.')}</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">{t('Chính sách bảo mật')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('Điều khoản dịch vụ')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('Cài đặt cookie')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
