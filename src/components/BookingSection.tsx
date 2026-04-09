import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Home, Train, Hotel, Car, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { services as bookingServices } from '../pages/Booking';

const homeBodyImage = (fileName: string) =>
  new URL(`../../Home img/Body img/${fileName}`, import.meta.url).href;

const bookingCategories = [
  { id: 'flights', icon: <Plane />, label: 'Chuyến bay' },
  { id: 'apartments', icon: <Home />, label: 'Căn hộ & Homestay' },
  { id: 'railway', icon: <Train />, label: 'Lịch trình Tàu hỏa' },
  { id: 'hotels', icon: <Hotel />, label: 'Khách sạn' },
  { id: 'cars', icon: <Car />, label: 'Thuê xe tự lái' },
];

type HomeBookingCategory = (typeof bookingCategories)[number]['id'];

type BookingCategoryFromPage = 'hotels' | 'homestays' | 'cars' | 'transport';

type BookingServiceItem = {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  tags: string[];
};

type Offer = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  linkText: string;
  category: HomeBookingCategory;
  bookingCategory: BookingCategoryFromPage;
};

type FeaturedOffer = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  linkText: string;
  kind: 'flight' | 'newsletter';
};

const featuredOffers: FeaturedOffer[] = [
  {
    id: 'featured-flight-1',
    title: 'Vietnam Airlines đến Vinh',
    subtitle: 'Bay cùng hãng hàng không quốc gia',
    image: homeBodyImage('Vietnamairline Vinh.webp'),
    description: 'Kết nối Nghệ An với mọi miền tổ quốc và thế giới cùng Vietnam Airlines.',
    linkText: 'Đặt vé ngay',
    kind: 'flight'
  },
  {
    id: 'featured-flight-2',
    title: 'Vietjet Air đến Vinh',
    subtitle: 'Bay cùng Vietjet',
    image: homeBodyImage('Flight.jpg'),
    description: 'Bay tiết kiệm, linh hoạt lịch trình và săn ưu đãi để đến Nghệ An thật dễ dàng.',
    linkText: 'Đặt vé ngay',
    kind: 'flight'
  },
  {
    id: 'featured-newsletter-1',
    title: 'Bản tin du lịch',
    subtitle: 'Nhận ưu đãi đặc biệt.',
    image: homeBodyImage('Bản tin du lịch.webp'),
    description: 'Bản tin hàng tháng cung cấp những mẹo hay nhất và thông tin quan trọng về du lịch Nghệ An cho chuyến đi hoàn hảo của bạn.',
    linkText: 'Đăng ký ngay!',
    kind: 'newsletter'
  }
];

const toOffer = (
  item: BookingServiceItem,
  category: HomeBookingCategory,
  bookingCategory: BookingCategoryFromPage
): Offer => ({
  id: `${bookingCategory}-${item.id}`,
  title: item.name,
  subtitle: item.location,
  image: item.image,
  description: `${item.price} • ${item.tags.join(' • ')} • ${item.rating}/5`,
  linkText: 'Đặt ngay',
  category,
  bookingCategory
});

const isFlightTransport = (item: BookingServiceItem) =>
  item.tags.some((tag) => tag.toLowerCase().includes('hàng không'));

type BookingSectionProps = {
  showFloatingWidgets?: boolean;
};

export default function BookingSection({ showFloatingWidgets = true }: BookingSectionProps) {
  const [activeCategory, setActiveCategory] = useState<HomeBookingCategory>('flights');
  const [showFreeTripTag, setShowFreeTripTag] = useState(true);
  const navigate = useNavigate();
  const { t } = useI18n();

  const offers: Offer[] = [
    ...bookingServices.hotels.map((item) => toOffer(item, 'hotels', 'hotels')),
    ...bookingServices.homestays.map((item) => toOffer(item, 'apartments', 'homestays')),
    ...bookingServices.cars.map((item) => toOffer(item, 'cars', 'cars')),
    ...bookingServices.transport.map((item) =>
      toOffer(item, isFlightTransport(item) ? 'flights' : 'railway', 'transport')
    ),
  ];

  const activeOffers = offers.filter((o) => o.category === activeCategory).slice(0, 2);
  const cards: (Offer | FeaturedOffer)[] =
    activeCategory === 'flights' ? featuredOffers : activeOffers;

  const hideFreeTripTag = () => {
    setShowFreeTripTag(false);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Selector - Matching the image style */}
        <div className="flex flex-wrap items-center gap-x-12 gap-y-6 mb-20">
          {bookingCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-3 transition-all duration-300 group ${
                activeCategory === cat.id
                  ? 'px-6 py-3 border-2 border-red-600 rounded-full text-red-600'
                  : 'text-gray-800 hover:text-red-600'
              }`}
            >
              <span className={`${activeCategory === cat.id ? 'text-red-600' : 'text-gray-800 group-hover:text-red-600'}`}>
                {React.cloneElement(cat.icon as React.ReactElement, { size: 28, strokeWidth: 1.5 })}
              </span>
              <span className="font-medium text-xl">{t(cat.label)}</span>
            </button>
          ))}
        </div>

        {/* Content Grid - 3 Column Layout like the image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Left Column - Empty or for spacing as in the image */}
          <div className={activeCategory === 'flights' ? 'hidden' : 'hidden md:block'}>
            {/* This space can be used for a vertical title or left empty for the "Swiss" look */}
          </div>

          {cards.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col group ${
                activeCategory === 'railway' && cards.length === 1 ? 'md:col-start-3' : ''
              }`}
            >
              <div className="aspect-[16/10] overflow-hidden rounded-sm mb-8">
                <img
                  src={offer.image}
                  alt={t(offer.title)}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <span className="text-gray-500 text-sm mb-4 font-medium">{t(offer.subtitle)}</span>
                <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                  {t(offer.title)}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">
                  {t(offer.description)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if ('bookingCategory' in offer) {
                      navigate(`/booking?category=${offer.bookingCategory}#booking-content`);
                      return;
                    }
                    if (offer.kind === 'newsletter') navigate('/blog');
                    else navigate('/booking?category=transport#booking-content');
                  }}
                  className="text-red-600 font-bold text-xl hover:underline inline-flex items-center w-fit"
                >
                  {t(offer.linkText)}
                </button>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {showFloatingWidgets && showFreeTripTag && (
              <motion.div
                initial={{ opacity: 0, x: 56, y: 34, rotate: -8, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: 56, y: 34, rotate: -8, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.7 }}
                className="fixed right-32 bottom-10 z-[60]"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => navigate('/lucky-wheel')}
                    className="relative bg-red-600 text-white px-7 py-4 rounded-xl shadow-2xl hover:bg-red-700 transition-colors after:content-[''] after:absolute after:right-7 after:top-[calc(100%-1px)] after:w-10 after:h-8 after:bg-red-600 after:[clip-path:polygon(0_0,100%_0,100%_100%)]"
                  >
                    <span className="font-medium text-lg leading-none">{t('Trúng kỳ nghỉ miễn phí')}</span>
                    <span className="absolute -right-2 -top-2 opacity-90">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          hideFreeTripTag();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            hideFreeTripTag();
                          }
                        }}
                        aria-label={t('Đóng')}
                        className="w-6 h-6 rounded-full bg-white/15 border border-white/25 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                      >
                        <X size={12} />
                      </span>
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Assistant Tab - Vertical on the right edge */}
      <AnimatePresence>
        {showFloatingWidgets && (
          <motion.div
            initial={{ opacity: 0, x: 0, clipPath: 'inset(0 0 0 100%)', filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)', filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 0, clipPath: 'inset(0 0 0 100%)', filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden xl:block"
          >
            <button
              type="button"
              onClick={() => navigate('/assistant')}
              className="bg-[#e61e2a] text-white py-6 px-3 rounded-l-2xl flex flex-col items-center space-y-4 cursor-pointer hover:bg-red-700 transition-all shadow-2xl group"
            >
              <div className="relative">
                <MessageSquare size={24} className="fill-white/20" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-red-600" />
              </div>
              <span className="writing-mode-vertical text-sm font-bold uppercase tracking-[0.2em] py-4">{t('Assistant')}</span>
              <div className="w-1 h-8 bg-white/30 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ y: [-32, 32] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-full h-1/2 bg-white"
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
