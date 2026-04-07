import React from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const blogImage = (fileName: string) => new URL(`../../Blog img/${fileName}`, import.meta.url).href;

export default function BlogNgonNguQueHuongTiengDatMe() {
  const { t, lang } = useI18n();

  return (
    <div key={lang} className="pt-20 bg-[#fdfcf9] min-h-screen">
      <section className="relative h-[55vh] bg-gray-950 overflow-hidden">
        <img
          src={blogImage('ngôn ngữ quê hương- tiếng đất mẹ.jpg')}
          alt={t('Ngôn ngữ quê hương - tiếng đất mẹ')}
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
            {t('Ngôn ngữ quê hương - tiếng đất mẹ')}
          </h1>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-widest text-white/70">
            <div className="flex items-center space-x-2">
              <User size={12} />
              <span>{t('Nghệ An Discovery')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={12} />
              <span>22 Th03, 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={12} />
              <span>{t('6 phút')}</span>
            </div>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full">{t('Văn hóa')}</div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-28">
        <article className="bg-white rounded-sm shadow-2xl p-8 md:p-14 space-y-8">
          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Nhiều người khi đến thăm Nghệ An, dù là khách lạ ghé qua hay những người con xa xứ vừa chạm lại ngõ quê, đều khẽ chững lại trước tiếng nói nơi đây. Nó không “dễ nghe” theo cách tròn trịa, mềm mại; mà có gì đó mộc, thô, như chính đất cát miền Trung – nắng gắt, gió Lào, và cả những mùa mưa dầm dai dẳng. Có người nghe lần đầu thì bật cười, có người ngơ ngác không hiểu, còn tôi – một đứa lớn lên cùng thứ âm thanh ấy – lại thấy trong đó là cả một bầu trời ký ức.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl">
            <img
              src={blogImage('Tiếng mẹ đẻ 01.jpg')}
              alt="Tiếng mẹ đẻ 01"
              className="w-full h-auto object-cover"
            />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Ngày bé, tôi từng nghĩ giọng Nghệ là điều gì đó… cần phải giấu đi. Những lần ra ngoài, tôi tập nói tròn vành rõ chữ, cố uốn từng âm cho “giống người ta”, như thể đang mặc một chiếc áo không thuộc về mình. Nhưng lạ thay, cứ mỗi lần nghe ai đó vô tình buông một câu “mi đi mô rứa?”, tim tôi lại khẽ rung lên, như có ai gọi đúng tên mình giữa một đám đông xa lạ.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl">
            <img
              src={blogImage('Tiếng mẹ đẻ 02.jpg')}
              alt="Tiếng mẹ đẻ 02"
              className="w-full h-auto object-cover"
            />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Giờ đây, khi đi xa hơn, gặp nhiều người hơn, tôi mới hiểu: ngôn ngữ không chỉ là công cụ để giao tiếp, mà còn là nơi trú ngụ của cảm xúc. Giọng Nghệ có thể khó nghe với người ngoài, nhưng với tôi, đó là giọng của mẹ gọi bữa cơm chiều, là tiếng bà kể chuyện bên bếp lửa, là âm thanh của những buổi trưa hè ve kêu râm ran ngoài hiên. Nó không chỉ là “cách nói”, mà là cách quê hương ở lại trong mỗi con người.'
            )}
          </p>

          <div className="my-8 rounded-sm overflow-hidden shadow-2xl">
            <img
              src={blogImage('Tiếng mẹ đẻ 03.jpg')}
              alt="Tiếng mẹ đẻ 03"
              className="w-full h-auto object-cover"
            />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {t(
              'Ngôn ngữ quê hương, suy cho cùng, không cần phải hoàn hảo. Nó chỉ cần đủ chân thật để khi ta cất lên, ta biết mình thuộc về đâu. Và dù có đi xa đến mấy, chỉ cần còn giữ được “tiếng đất mẹ” trong lòng, thì quê hương vẫn luôn ở rất gần.'
            )}
          </p>

          <div className="pt-6 text-right text-sm text-gray-500 italic">{t('- Thanh Huyền -')}</div>
        </article>
      </section>
    </div>
  );
}
