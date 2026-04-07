import React from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const blogImage = (fileName: string) => new URL(`../../Blog img/${fileName}`, import.meta.url).href;

export default function BlogNhungQuanCaHeHidden() {
  const { t, lang } = useI18n();

  return (
    <div key={lang} className="pt-20 bg-[#fdfcf9] min-h-screen">
      <section className="relative h-[55vh] bg-gray-950 overflow-hidden">
        <img
          src={blogImage('Những quán cà hê hidden.jpg')}
          alt={t('Những quán “cà-hê” hidden')}
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
            {t('Những quán “cà-hê” hidden')}
          </h1>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-widest text-white/70">
            <div className="flex items-center space-x-2">
              <User size={12} />
              <span>{t('Nghệ An Discovery')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={12} />
              <span>20 Th03, 2024</span>
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
              'Ngồi trong những quán “cà-hê” ấy, thời gian dường như trôi chậm lại. Không còn những âm thanh ồn ào của phố xá, không còn những vội vã thường ngày, chỉ còn tiếng thìa chạm nhẹ vào thành cốc, tiếng máy pha cà phê khe khẽ, và đôi khi là vài bản nhạc cũ vang lên đủ để lấp đầy khoảng lặng.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl">
            <img
              src={blogImage('Cà hê 01.jpg')}
              alt="Quán cà hê 01"
              className="w-full h-auto object-cover"
            />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Có những buổi chiều, tôi chỉ ngồi đó, không làm gì cả. Không điện thoại, không công việc. Chỉ nhìn ra khoảng sân nhỏ, nơi ánh nắng len qua từng tán cây, rơi lặng lẽ xuống những chiếc bàn gỗ đã sờn màu. Những vị khách quen đến rồi đi, chào nhau bằng ánh mắt hoặc một cái gật đầu rất nhẹ — đủ để biết rằng họ cũng đang tìm kiếm một điều gì đó giống tôi: một khoảng bình yên giữa lòng thành phố.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl">
            <img
              src={blogImage('Cà hê 02.jpg')}
              alt="Quán cà hê 02"
              className="w-full h-auto object-cover"
            />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Mỗi quán “cà-hê” hidden như vậy đều mang một câu chuyện riêng. Có quán là căn nhà cũ được giữ nguyên gần như mọi thứ, từ bộ bàn ghế gỗ, chiếc quạt trần quay chậm, đến những bức tường loang màu thời gian. Có quán lại chỉ đơn giản là một góc nhỏ được chăm chút bằng vài chậu cây, vài bức tranh, nhưng lại đủ khiến người ta muốn quay lại thêm nhiều lần nữa.'
            )}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Tôi không nhớ mình đã đi bao nhiêu quán như thế, chỉ nhớ cảm giác mỗi lần rẽ vào một con ngõ nhỏ, tìm thấy một quán cà phê mới, giống như vừa khám phá ra một bí mật nho nhỏ của thành phố. Và có lẽ, chính những “bí mật” ấy đã làm cho Nghệ An — trong mắt tôi — không chỉ là nơi để sống, mà còn là nơi để cảm, để chậm lại, và để yêu theo một cách rất riêng.'
            )}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Có thể với nhiều người, đó chỉ là những quán cà phê bình thường. Nhưng với tôi, đó là những khoảng lặng có hình hài — nơi mỗi tách cà phê không chỉ có vị đắng, mà còn có cả ký ức, cảm xúc, và một chút gì đó rất khó gọi tên.'
            )}
          </p>

          <div className="pt-6 text-right text-sm text-gray-500 italic">{t('- Thanh Huyền -')}</div>
        </article>
      </section>
    </div>
  );
}
