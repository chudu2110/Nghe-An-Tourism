import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';

type NavItem = {
  id: string;
  name: string;
  path: string;
  children?: Array<{ name: string; path: string }>;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const location = useLocation();
  const isLight = isScrolled || location.pathname === '/assistant';
  const { lang, setLang, t } = useI18n();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: 'destinations',
        name: 'Điểm đến',
        path: '/destinations',
        children: [
          { name: 'Bản đồ', path: '/map' },
          { name: 'Từ điển', path: '/dictionary' },
        ],
      },
      {
        id: 'accommodations',
        name: 'Đặt chỗ',
        path: '/booking',
        children: [{ name: 'Tình nguyện viên', path: '/volunteers' }],
      },
      {
        id: 'experiences',
        name: 'Trải nghiệm',
        path: '/experiences',
        children: [{ name: 'Ẩm thực & Văn hóa', path: '/food-culture' }],
      },
      {
        id: 'planning',
        name: 'Lên kế hoạch',
        path: '/planning',
        children: [{ name: 'Blog', path: '/blog' }],
      },
    ],
    []
  );

  const toggleLang = () => setLang(lang === 'vi' ? 'en' : 'vi');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenMobileGroup(null);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-red-600 text-white w-10 h-10 flex items-center justify-center font-black text-xl rounded-full group-hover:rotate-12 transition-transform duration-500">
              N
            </div>
            <span className={`font-serif font-bold text-2xl tracking-tighter ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Nghệ An<span className="text-red-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  to={item.path}
                  className={`text-[10px] font-bold tracking-[0.2em] transition-all hover:text-red-600 uppercase relative ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {t(item.name)}
                    <ChevronDown size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-600 transition-all group-hover:w-full" />
                </Link>

                {item.children?.length ? (
                  <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="flex flex-col items-start">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block py-2 text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap hover:text-red-600 transition-colors ${
                            isLight ? 'text-gray-900' : 'text-white'
                          }`}
                        >
                          {t(child.name)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
            <div className="flex items-center space-x-6 ml-6 border-l border-gray-200 pl-6">
              <button
                type="button"
                onClick={toggleLang}
                className={`${isLight ? 'text-gray-900' : 'text-white'} flex items-center space-x-2 group`}
              >
                <Globe size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black tracking-widest">{lang === 'vi' ? t('VN') : t('ENG')}</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isLight ? 'text-gray-900' : 'text-white'} flex items-center space-x-2`}
            >
              <span className="text-[10px] font-black tracking-widest uppercase hidden sm:block">
                {isOpen ? t('Đóng') : t('Menu')}
              </span>
              {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => {
                const isExpanded = openMobileGroup === item.id;
                return (
                  <div key={item.id} className="border-b border-gray-50">
                    <div className="flex items-center justify-between px-3 py-4">
                      <Link to={item.path} className="text-lg font-bold text-gray-900 hover:text-red-600">
                        {t(item.name)}
                      </Link>
                      {item.children?.length ? (
                        <button
                          type="button"
                          onClick={() => setOpenMobileGroup(isExpanded ? null : item.id)}
                          className="text-gray-500"
                          aria-label={t(item.name)}
                        >
                          <ChevronDown size={20} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      ) : null}
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4">
                            {item.children?.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className="block px-6 py-3 text-sm font-bold text-gray-600 hover:text-red-600"
                              >
                                {t(child.name)}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
              <div className="flex justify-between items-center px-3 py-6">
                 <button type="button" onClick={toggleLang} className="flex items-center space-x-2 text-gray-500">
                    <Globe size={16} />
                    <span className="text-xs font-bold uppercase">{lang === 'vi' ? t('VN') : t('ENG')}</span>
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
