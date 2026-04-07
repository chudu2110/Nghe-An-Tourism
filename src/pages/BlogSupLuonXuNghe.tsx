import React from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const blogImage = (fileName: string) => new URL(`../../Blog img/${fileName}`, import.meta.url).href;

export default function BlogSupLuonXuNghe() {
  const { t } = useI18n();

  return (
    <div className="pt-20 bg-[#fdfcf9] min-h-screen">
      <section className="relative h-[55vh] bg-gray-950 overflow-hidden">
        <img
          src={blogImage('súp lươn xứ nghệ.jpg')}
          alt={t('Súp lươn xứ Nghệ: Vị cay nồng đánh thức mọi giác quan')}
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
            {t('Súp lươn xứ Nghệ: Vị cay nồng đánh thức mọi giác quan')}
          </h1>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-widest text-white/70">
            <div className="flex items-center space-x-2">
              <User size={12} />
              <span>{t('Hoàng Nam')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={12} />
              <span>12 Th03, 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={12} />
              <span>{t('5 phút')}</span>
            </div>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full">{t('Ẩm thực')}</div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-28">
        <article className="bg-white rounded-sm shadow-2xl p-8 md:p-14 space-y-8">
          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Đã về xứ Nghệ, có một món mà bạn nhất định không thể bỏ lỡ: lươn xứ Nghệ. Lươn ở đây là lươn đồng, con nào con nấy chắc nịch, thịt vàng óng và thơm một cách rất riêng — cái vị mà chỉ cần nếm thử một lần là nhớ mãi.'
            )}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Bạn có thể đã quen với miến lươn, cháo lươn hay lươn chiên giòn. Nhưng với tôi, thứ níu chân người ta lâu nhất lại là một bát súp lươn nóng hổi. Một bát súp lươn ngon không chỉ nằm ở nguyên liệu mà còn ở cách nấu: thịt lươn được xào săn, tẩm ướp đậm đà với nước mắm, nghệ, hành tăm — dậy lên một mùi thơm rất “Nghệ”. Nước dùng sánh nhẹ, cay cay, ấm nồng nơi đầu lưỡi, điểm thêm chút hành phi vàng ruộm — tất cả hòa quyện thành một hương vị vừa mộc mạc, vừa sâu đậm.'
            )}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Súp lươn thường ăn kèm với bánh mì nóng giòn, bẻ một miếng chấm vào bát súp, để lớp vỏ giòn tan thấm đẫm nước lươn cay ấm. Hoặc ăn cùng bánh mướt mềm mịn, nhẹ nhàng mà lại nâng trọn vị đậm đà của món ăn.'
            )}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Nhưng có lẽ, súp lươn ngon nhất không chỉ vì cách nấu — mà còn vì thời điểm. Một buổi chiều xứ Nghệ se lạnh, trời lất phất mưa, ngồi trong một quán nhỏ, trước mặt là bát súp lươn bốc khói nghi ngút, tay cầm miếng bánh mì nóng… Khoảnh khắc ấy, mọi thứ dường như chậm lại.'
            )}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Và bạn sẽ hiểu, “mỹ vị nhân gian” đôi khi không nằm ở những thứ cầu kỳ, mà chỉ đơn giản là một bát súp lươn nóng — đúng lúc, đúng nơi, đúng cảm xúc.'
            )}
          </p>
        </article>
      </section>
    </div>
  );
}
