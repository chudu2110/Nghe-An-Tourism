import React from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const blogImage = (fileName: string) => new URL(`../../Blog img/${fileName}`, import.meta.url).href;

export default function BlogBienCuaLoHoiThoKyUc() {
  const { t, lang } = useI18n();

  return (
    <div key={lang} className="pt-20 bg-[#fdfcf9] min-h-screen">
      <section className="relative h-[55vh] bg-gray-950 overflow-hidden">
        <img
          src={blogImage('Biển Cửa Lò, hơi thở ký ức.jpg')}
          alt={t('Biển Cửa Lò – hơi thở của ký ức')}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-gray-950/30 to-[#fdfcf9]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-3 text-white/80 hover:text-white text-xs font-bold uppercase tracking-widest w-fit"
          >
            <ArrowLeft size={16} />
            <span>{t('Quay lại Blog')}</span>
          </Link>

          <h1 className="mt-8 text-4xl md:text-6xl font-bold font-serif text-white tracking-tighter leading-tight">
            {t('Biển Cửa Lò – hơi thở của ký ức')}
          </h1>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-widest text-white/70">
            <div className="flex items-center space-x-2">
              <User size={12} />
              <span>{t('Nghệ An Discovery')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={12} />
              <span>18 Th03, 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={12} />
              <span>{t('6 phút')}</span>
            </div>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full">{t('Cảm hứng')}</div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-28">
        <article className="bg-white rounded-sm shadow-2xl p-8 md:p-14 space-y-8">
          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Biển Cửa Lò không chỉ là biển, mà là một nhịp tim, một hơi thở ký ức mà mỗi người con xứ Nghệ đều mang theo. Ngày bé, tôi lẩn tránh những con sóng lớn, trắng xóa, như sợ rằng mình sẽ bị cuốn trôi theo cơn giận dữ của biển. Nhưng lớn lên, tôi nhận ra rằng biển không hề đáng sợ – biển chỉ mời gọi, thôi thúc tôi quay về. Tôi gạt bỏ nỗi sợ hãi, để một lần nữa lắng nghe âm thanh của sóng: nhịp điệu rền rĩ, vừa dồn dập vừa da diết, vang vọng như một bản tình ca bất tận của đại dương.'
            )}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Bình minh trên Cửa Lò như vẽ nên một bức tranh thủy mặc: sương mỏng ôm lấy mặt nước, nắng vàng nhảy múa trên từng bọt sóng. Tôi lặng lẽ bước trên bãi cát, để lại dấu chân bên những vỏ sò, ốc nối đuôi nhau, nơi những câu chuyện xưa cũ còn vương vấn trong cát. Chiều xuống, biển khoác áo vàng cam dịu dàng, sóng vỗ nhẹ nhàng như những lời ru, và trong không gian ấy, mọi ồn ào của thế giới dường như tan biến.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl aspect-video">
            <video
              src={blogImage('Cửa Lò 02.mp4')}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Máy ảnh của tôi chứa hàng trăm khoảnh khắc về biển: bác ngư dân lặng lẽ thả lưới, ánh nắng xuyên qua từng cánh lưới như những sợi chỉ vàng, những con sóng xô bọt trắng vào bờ cát, tất cả dường như đang kể về một câu chuyện chưa từng được kể. Biển Cửa Lò không chỉ là cảnh vật, mà là cảm xúc, là ký ức, là nơi tôi tìm thấy chính mình trong nhịp sóng và gió biển.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl">
            <img
              src={blogImage('Cửa Lò 03.jpg')}
              alt="Biển Cửa Lò 03"
              className="w-full h-auto object-cover"
            />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Đối với tôi, mỗi lần trở về biển là mỗi lần được sống lại ký ức, được nhắc nhở rằng có những điều giản đơn nhưng da diết, như biển, mãi in dấu trong tâm hồn. Biển Cửa Lò là nỗi nhớ – vừa gần gũi, vừa xa xăm, nhưng luôn dịu dàng ôm trọn trái tim những người yêu biển.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl">
            <img
              src={blogImage('Cửa Lò 04.jpg')}
              alt="Biển Cửa Lò 04"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="pt-6 text-right text-sm text-gray-500 italic">{t('- Thanh Huyền -')}</div>
        </article>
      </section>
    </div>
  );
}
