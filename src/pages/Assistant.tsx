import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCcw, Send } from 'lucide-react';
import { useI18n } from '../i18n';

type Role = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

type QaItem = {
  id: string;
  questionKey: string;
  answerKey: string;
  keywords: string[];
  labelKey: string;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreQuestion(input: string, candidates: string[], keywords: string[]) {
  const q = normalizeText(input);
  if (!q) return 0;

  const normalizedCandidates = candidates.map(normalizeText).filter(Boolean);
  if (normalizedCandidates.some((c) => q === c)) return 999;

  let score = 0;
  if (normalizedCandidates.some((c) => q.includes(c))) score += 25;

  const words = q.split(' ').filter(Boolean);
  for (const kw of keywords) {
    const k = normalizeText(kw);
    if (!k) continue;
    if (q.includes(k)) score += 10;
    else if (words.some((w) => w.length >= 3 && k.includes(w))) score += 2;
  }
  return score;
}

function formatTextBlocks(content: string) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function Assistant() {
  const { t } = useI18n();
  const qa: QaItem[] = useMemo(
    () => [
      {
        id: 'itinerary-2d1n',
        labelKey: 'Lịch trình',
        questionKey: 'Gợi ý lịch trình 2 ngày 1 đêm ở Nghệ An cho lần đầu?',
        keywords: [
          'lịch trình',
          '2 ngày',
          '2n1đ',
          'lần đầu',
          'Vinh',
          'Nam Đàn',
          'Cửa Lò',
          'itinerary',
          '2 days',
          '2d1n',
          'first time',
          'Vinh',
          'Nam Dan',
          'Cua Lo',
        ],
        answerKey:
          'Gợi ý 2N1Đ (nhịp vừa – đủ đặc trưng):\n' +
          'Ngày 1: Vinh → Nam Đàn (Kim Liên) → ăn Bê thui Nam Đàn → tối dạo Quảng trường Hồ Chí Minh.\n' +
          'Ngày 2: Cửa Lò đón bình minh → hải sản → quay về Vinh mua đặc sản (nhút, tương Nam Đàn, bánh mướt).\n' +
          'Nếu bạn thích trekking/thiên nhiên, thay Cửa Lò bằng Con Cuông – Pù Mát.',
      },
      {
        id: 'food-vinh-night',
        labelKey: 'Ăn gì',
        questionKey: 'Ở Vinh buổi tối ăn gì ngon?',
        keywords: [
          'Vinh',
          'buổi tối',
          'ăn gì',
          'quán',
          'đặc sản',
          'súp lươn',
          'bánh mướt',
          'cháo lươn',
          'Vinh',
          'night',
          'what to eat',
          'local food',
          'eel soup',
          'banh muot',
        ],
        answerKey:
          'Combo “ăn tối kiểu Vinh” dễ hợp khẩu vị:\n' +
          'Súp lươn / cháo lươn (cay nhẹ, thơm) → tráng miệng bằng cam Xã Đoài.\n' +
          'Nếu muốn nhẹ bụng: bánh mướt chấm nước mắm + ram.\n' +
          'Đi nhóm đông: gọi thêm gà đồi, cá mát (nếu quán có).',
      },
      {
        id: 'cua-lo-season',
        labelKey: 'Mùa đẹp',
        questionKey: 'Đi biển Cửa Lò mùa nào đẹp?',
        keywords: [
          'Cửa Lò',
          'biển',
          'mùa nào',
          'tháng',
          'thời tiết',
          'Cua Lo',
          'beach',
          'best time',
          'season',
          'weather',
          'month',
        ],
        answerKey:
          'Cửa Lò đẹp nhất thường rơi vào khoảng tháng 4–8.\n' +
          'Tháng 4–5: trời dễ chịu, biển êm, ít đông.\n' +
          'Tháng 6–7: sôi động nhất (đông hơn, giá dịch vụ có thể nhỉnh).\n' +
          'Nếu đi cuối hè, nhớ xem dự báo thời tiết trước 2–3 ngày.',
      },
      {
        id: 'pu-mat-trekking',
        labelKey: 'Trekking',
        questionKey: 'Muốn trekking Pù Mát cần chuẩn bị gì?',
        keywords: [
          'Pù Mát',
          'trekking',
          'đi rừng',
          'chuẩn bị',
          'Con Cuông',
          'thác Kèm',
          'Pu Mat',
          'hiking',
          'packing list',
          'prepare',
          'Con Cuong',
          'Kem waterfall',
        ],
        answerKey:
          'Checklist trekking Pù Mát (an toàn trước, đẹp sau):\n' +
          'Giày bám tốt + tất dày, áo nhanh khô, áo mưa mỏng.\n' +
          'Nước + điện giải, thuốc chống côn trùng, băng cá nhân.\n' +
          'Pin dự phòng, túi chống nước cho điện thoại.\n' +
          'Đi theo nhóm/guide địa phương nếu cung đường lạ.',
      },
      {
        id: 'dialect-fun',
        labelKey: 'Phương ngữ',
        questionKey: 'Cho mình vài câu tiếng Nghệ vui vui để bắt chuyện?',
        keywords: [
          'tiếng Nghệ',
          'phương ngữ',
          'mô',
          'tê',
          'răng',
          'ri',
          'bắt chuyện',
          'dialect',
          'slang',
          'greetings',
          'how to say',
        ],
        answerKey:
          'Một vài câu “vừa vui vừa thân”:\n' +
          '“Mi đi mô rứa?” = Bạn đi đâu vậy?\n' +
          '“Răng mi khoẻ không?” = Bạn khoẻ không?\n' +
          '“Mần chi đó?” = Đang làm gì đó?\n' +
          'Gặp người thân quen, nói chậm thôi là duyên cực.',
      },
      {
        id: 'souvenir',
        labelKey: 'Quà',
        questionKey: 'Nên mua đặc sản Nghệ An làm quà gì?',
        keywords: [
          'đặc sản',
          'làm quà',
          'mua gì',
          'cu đơ',
          'nhút',
          'tương',
          'cam',
          'bánh mướt',
          'souvenir',
          'gift',
          'what to buy',
          'specialty',
        ],
        answerKey:
          'Quà dễ mang – hợp nhiều người:\n' +
          'Bánh cu đơ (ngọt giòn, hợp trà).\n' +
          'Nhút Thanh Chương, tương Nam Đàn (hợp bữa cơm).\n' +
          'Cam Xã Đoài / các loại mứt theo mùa.\n' +
          'Nếu bạn muốn “độc lạ”: đồ mây tre đan làm decor nhỏ.',
      },
    ],
    []
  );

  const recommended = useMemo(() => qa.slice(0, 6), [qa]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'hello',
      role: 'assistant',
      createdAt: Date.now(),
      content:
        'Chào bạn! Mình là AI Assistant của Nghệ An Tourism – giúp bạn lên kế hoạch du lịch nhanh chóng, dễ dàng và chuẩn chỉnh.',
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, typing]);

  const reset = () => {
    setDraft('');
    setTyping(false);
    setMessages([
      {
        id: 'hello',
        role: 'assistant',
        createdAt: Date.now(),
        content:
          'Chào bạn! Mình là AI Assistant của Nghệ An Tourism – giúp bạn lên kế hoạch du lịch nhanh chóng, dễ dàng và chuẩn chỉnh.',
      },
    ]);
  };

  const answerFor = (question: string) => {
    const input = question.trim();
    const best = qa
      .map((item) => ({
        item,
        score: scoreQuestion(input, [item.questionKey, t(item.questionKey)], item.keywords),
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (best && best.score > 0) return best.item.answerKey;
    return (
      'Mình chưa có câu trả lời “soạn sẵn” cho câu này.\n' +
      'Bạn thử chọn 1 gợi ý ở khung Gợi ý, hoặc hỏi lại theo một trong các hướng:\n' +
      '• Lịch trình (mấy ngày, đi đâu)\n' +
      '• Ăn gì (thành phố/khu vực)\n' +
      '• Di chuyển (từ đâu đến đâu)\n' +
      '• Trải nghiệm (biển/trekking/văn hoá)'
    );
  };

  const pushQuestion = async (question: string) => {
    const q = question.trim();
    if (!q || typing) return;

    const now = Date.now();
    const userMsg: ChatMessage = { id: `u-${now}`, role: 'user', createdAt: now, content: q };
    setMessages((m) => [...m, userMsg]);
    setDraft('');
    setTyping(true);

    window.setTimeout(() => {
      const a = answerFor(q);
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', createdAt: Date.now(), content: a }]);
      setTyping(false);
    }, 520);
  };

  return (
    <div className="pt-24 min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-6rem)] flex flex-col">
        <div className="py-6 flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-gray-400">{t('Trợ lý AI')}</div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[11px] font-semibold text-gray-700"
          >
            <RefreshCcw size={16} className="text-red-600" />
            {t('Đặt lại')}
          </button>
        </div>

        <div className="assistant-scroll flex-1 overflow-y-auto pb-40">
          <div className="space-y-4 py-2">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[92%] rounded-3xl px-5 py-4 border ${
                      isUser ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="space-y-2">
                      {formatTextBlocks(t(m.content)).map((line, i) => (
                        <div key={i} className={`text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-gray-700'}`}>
                          {line.startsWith('• ') ? (
                            <span className="inline-flex gap-2">
                              <span className={isUser ? 'text-white/80' : 'text-red-600'}>•</span>
                              <span>{line.slice(2)}</span>
                            </span>
                          ) : (
                            line
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-3xl px-5 py-4 bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:120ms]" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:240ms]" />
                  </div>
                </div>
              </div>
            )}

            {messages.length <= 1 && !typing && (
              <div className="pt-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-gray-400 mb-3">{t('Gợi ý')}</div>
                <div className="flex flex-wrap gap-2">
                  {recommended.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pushQuestion(t(item.questionKey))}
                      className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 hover:bg-white hover:border-gray-300 transition-colors"
                    >
                      {t(item.questionKey)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-4 pb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              pushQuestion(draft);
            }}
            className="flex items-end gap-3"
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  pushQuestion(draft);
                }
              }}
              rows={1}
              placeholder={t('Nhập câu hỏi…')}
              className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-3xl px-5 py-4 outline-none text-gray-900 placeholder:text-gray-400 focus:border-red-600/40 transition-colors"
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              className="h-[52px] w-[52px] rounded-full bg-red-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500 transition-colors flex items-center justify-center"
              aria-label={t('Gửi')}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
