import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';

interface CardProps {
  key?: React.Key;
  title: string;
  subtitle?: string;
  image: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  description?: string;
  link?: string;
  className?: string;
  variant?: 'default' | 'editorial' | 'minimal';
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
}

export default function Card({ 
  title, 
  subtitle, 
  image, 
  imageWrapperClassName,
  imageClassName,
  description, 
  link, 
  className = '', 
  variant = 'default',
  aspectRatio = 'video'
}: CardProps) {
  const { t } = useI18n();
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/9]'
  };

  const handleClick = () => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        // Handle internal navigation if needed in the future
      }
    }
  };

  if (variant === 'editorial') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-sm cursor-pointer ${className}`}
      >
        <div className={`${aspectClasses[aspectRatio]} overflow-hidden ${imageWrapperClassName ?? ''}`}>
          <img
            src={image}
            alt={title}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClassName ?? ''}`}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="text-red-500 font-bold text-xs tracking-[0.2em] uppercase mb-2">{subtitle ? t(subtitle) : undefined}</p>
          <h3 className="text-3xl font-bold text-white mb-4 font-serif">{t(title)}</h3>
          <p className="text-gray-300 text-sm line-clamp-2 mb-6">{description ? t(description) : undefined}</p>
          <div className="flex items-center text-white font-bold text-xs uppercase tracking-widest">
            <span>{t('Khám phá')}</span>
            <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
        <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full group-hover:hidden transition-all">
           <span className="text-white text-[10px] font-bold tracking-widest uppercase">{subtitle ? t(subtitle) : t('Nghệ An')}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-sm bg-white shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${className}`}
    >
      <div className={`${aspectClasses[aspectRatio]} overflow-hidden ${imageWrapperClassName ?? ''}`}>
        <img
          src={image}
          alt={title}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClassName ?? ''}`}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-8">
        {subtitle && (
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.3em] mb-3">
            {t(subtitle)}
          </p>
        )}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors font-serif">
          {t(title)}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
            {t(description)}
          </p>
        )}
        <div className="flex items-center text-xs font-bold text-gray-900 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
          <span>{t('Tìm hiểu thêm')}</span>
          <ArrowRight size={14} className="ml-2 text-red-600" />
        </div>
      </div>
    </motion.div>
  );
}
