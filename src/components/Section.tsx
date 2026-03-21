import React from 'react';
import { motion } from 'motion/react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export default function Section({ title, subtitle, children, className = '', dark = false }: SectionProps) {
  return (
    <section className={`py-20 ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-red-600 font-bold tracking-widest uppercase text-xs mb-2"
              >
                {subtitle}
              </motion.p>
            )}
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight"
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
