import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Gift, Sparkles, Ticket, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

type PrizeKind = 'discount' | 'free' | 'lose';

type Prize = {
  id: string;
  label: string;
  kind: PrizeKind;
  weight: number;
  color: string;
  textColor: string;
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeAngle(angle: number) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function pickWeightedIndex(weights: number[]) {
  const total = weights.reduce((acc, w) => acc + Math.max(0, w), 0);
  if (total <= 0) return 0;
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= Math.max(0, weights[i]);
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const delta = normalizeAngle(endAngle - startAngle);
  const largeArcFlag = delta > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

function splitWheelLabel(label: string) {
  const text = label.toUpperCase().trim();
  if (text.length <= 14) return [text];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [text];

  const useThreeLines = text.length > 22 || words.length >= 5;
  if (useThreeLines) {
    let best: { i: number; j: number; score: number } | null = null;
    for (let i = 1; i < words.length - 1; i++) {
      for (let j = i + 1; j < words.length; j++) {
        const a = words.slice(0, i).join(' ');
        const b = words.slice(i, j).join(' ');
        const c = words.slice(j).join(' ');
        const maxLen = Math.max(a.length, b.length, c.length);
        const score = maxLen * 10 + Math.abs(a.length - b.length) + Math.abs(b.length - c.length);
        if (!best || score < best.score) best = { i, j, score };
      }
    }

    const i = best?.i ?? 1;
    const j = best?.j ?? Math.max(i + 1, Math.ceil((words.length * 2) / 3));
    const line1 = words.slice(0, i).join(' ');
    const line2 = words.slice(i, j).join(' ');
    const line3 = words.slice(j).join(' ');
    if (line3.length <= 3) return [text];
    return [line1, line2, line3];
  }

  let best: { i: number; score: number } | null = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const score = Math.abs(a.length - b.length);
    if (!best || score < best.score) best = { i, score };
  }

  const idx = best?.i ?? Math.ceil(words.length / 2);
  const line1 = words.slice(0, idx).join(' ');
  const line2 = words.slice(idx).join(' ');
  if (line2.length <= 3) return [text];
  return [line1, line2];
}

export default function LuckyWheel() {
  const { t } = useI18n();
  const prizes: Prize[] = useMemo(
    () => [
      { id: 'lose', label: 'Chúc bạn may mắn lần sau', kind: 'lose', weight: 55, color: '#0b1220', textColor: '#ffffff' },
      { id: '10', label: 'Voucher giảm 10%', kind: 'discount', weight: 12, color: '#9f1239', textColor: '#ffffff' },
      { id: '15', label: 'Voucher giảm 15%', kind: 'discount', weight: 10, color: '#111827', textColor: '#ffffff' },
      { id: '20', label: 'Voucher giảm 20%', kind: 'discount', weight: 8, color: '#be123c', textColor: '#ffffff' },
      { id: '30', label: 'Voucher giảm 30%', kind: 'discount', weight: 6, color: '#111827', textColor: '#ffffff' },
      { id: '40', label: 'Voucher giảm 40%', kind: 'discount', weight: 4, color: '#9f1239', textColor: '#ffffff' },
      { id: '50', label: 'Voucher giảm 50%', kind: 'discount', weight: 3, color: '#111827', textColor: '#ffffff' },
      { id: 'free', label: 'Chuyến đi miễn phí', kind: 'free', weight: 2, color: '#be123c', textColor: '#ffffff' },
    ],
    []
  );

  const sliceAngle = 360 / prizes.length;
  const spinTurns = 6;
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [resultPulse, setResultPulse] = useState(0);

  const [prizeMessage, setPrizeMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  const spin = () => {
    if (spinning) return;
    setSubmitted(false);
    setSpinning(true);

    const pickedIndex = pickWeightedIndex(prizes.map((p) => p.weight));
    const base = normalizeAngle(360 - (pickedIndex * sliceAngle + sliceAngle / 2));
    const extra = Math.random() * (sliceAngle * 0.25) - sliceAngle * 0.125;
    const target = rotation + spinTurns * 360 + base + extra;

    window.setTimeout(() => {
      const chosen = prizes[pickedIndex];
      setResult(chosen);
      setResultPulse((n) => n + 1);
      setPrizeMessage(t('Bạn được giải: {label}. Tiếp tục điền thông tin để nhận.', { label: t(chosen.label) }));
      setSpinning(false);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2200);

    setRotation(target);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    const nameOk = fullName.trim().length >= 2;
    const phoneOk = phone.replace(/\D/g, '').length >= 8;
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    if (!nameOk || !phoneOk || !emailOk) return;
    setSubmitted(true);
  };

  const c = 200;
  const r = 180;

  return (
    <div className="pt-20 bg-white overflow-hidden">
      <section className="relative border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-12 text-[22vw] font-black text-gray-50 select-none leading-none tracking-tighter">
            {t('QUAY')}
          </div>
          <div className="absolute -bottom-24 -right-12 text-[22vw] font-black text-gray-50 select-none leading-none tracking-tighter">
            {t('TRÚNG')}
          </div>
          <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block">
            <div className="writing-mode-vertical-rl rotate-180 text-[10px] font-bold tracking-[0.8em] text-gray-300 uppercase">
              {t('NGHE AN TRAVEL • VÒNG QUAY MAY MẮN • 2026')}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="flex items-center justify-between gap-6 mb-14">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-gray-500 hover:text-gray-950 transition-colors text-xs uppercase tracking-[0.35em] font-bold"
            >
              <ArrowLeft size={18} />
              {t('Quay lại')}
            </Link>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400">
              <Sparkles size={16} className="text-red-600" />
              {t('Ưu đãi giới hạn')}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
            <div className="lg:col-span-5 space-y-10">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-7">
                  <div className="h-px w-14 bg-red-600" />
                  <span className="text-red-600 font-bold tracking-[0.5em] uppercase text-[10px]">{t('Trúng kỳ nghỉ miễn phí')}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter leading-[0.95]">
                  {t('Vòng quay')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 italic">{t('may mắn.')}</span>
                </h1>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 max-w-xl">
                {[
                  { icon: <Ticket size={20} />, title: t('Voucher'), desc: t('Giảm 10%–50% cho dịch vụ.') },
                  { icon: <Trophy size={20} />, title: t('Giải đặc biệt'), desc: t('Chuyến đi miễn phí.') },
                  { icon: <Gift size={20} />, title: t('Nhận thưởng'), desc: t('Tự điền vào form phía dưới.') },
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-gray-100 rounded-sm bg-white shadow-sm">
                    <div className="text-red-600 mb-4">{item.icon}</div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-gray-900 mb-2">{item.title}</div>
                    <div className="text-gray-500 text-sm leading-relaxed font-light">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative mx-auto w-full max-w-[520px]">
                <div className="absolute -inset-10 bg-gradient-to-br from-red-600/15 via-transparent to-gray-900/10 blur-3xl pointer-events-none" />

                <div className="relative bg-white rounded-[2.75rem] border border-gray-100 shadow-2xl overflow-hidden">
                  <div className="px-8 pt-8 pb-6 flex items-start justify-between gap-6">
                    <div>
                      <div className="text-2xl font-bold font-serif tracking-tight mt-2">{t('Quay & Nhận quà')}</div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400 pt-2">
                      {spinning ? t('Đang quay...') : t('Sẵn sàng')}
                    </div>
                  </div>

                  <div className="px-8 pb-10">
                    <div className="relative mx-auto w-full max-w-[440px] aspect-square">
                      <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 flex flex-col items-center">
                        <div className="w-4 h-4 bg-red-600 rounded-full shadow-lg" />
                        <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-xl -mt-1" />
                      </div>

                      <motion.div
                        animate={{ rotate: rotation }}
                        transition={{ duration: 2.2, ease: [0.12, 0.95, 0.18, 1] }}
                        className="absolute inset-0 rounded-full"
                        style={{ transformOrigin: '50% 50%' }}
                      >
                        <svg viewBox="0 0 400 400" className="w-full h-full">
                          <defs>
                            <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
                              <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#000000" floodOpacity="0.18" />
                            </filter>
                          </defs>

                          <circle cx={c} cy={c} r={r + 8} fill="#ffffff" />
                          <circle cx={c} cy={c} r={r + 4} fill="#f3f4f6" />
                          <g filter="url(#shadow)">
                            {prizes.map((p, i) => {
                              const start = i * sliceAngle - 90;
                              const end = (i + 1) * sliceAngle - 90;
                              const mid = start + sliceAngle / 2;
                              const labelPos = polarToCartesian(c, c, r * 0.78, mid);
                              const midN = normalizeAngle(mid);
                              const upsideDown = midN > 90 && midN < 270;
                              const rot = upsideDown ? mid + 180 : mid;
                              const label = t(p.label);
                              const lines = splitWheelLabel(label);
                              let fontSize = clampNumber(11.4 - Math.max(0, label.length - 12) * 0.18, 8.6, 11.4);
                              if (lines.length === 3) fontSize = Math.min(fontSize, 8.8);
                              const yStart = labelPos.y - (lines.length - 1) * fontSize * 0.6;
                              return (
                                <g key={p.id}>
                                  <path d={wedgePath(c, c, r, start, end)} fill={p.color} stroke="#ffffff" strokeWidth={2} />
                                  <text
                                    x={labelPos.x}
                                    y={yStart}
                                    fill={p.textColor}
                                    fontSize={fontSize}
                                    fontWeight={800}
                                    textAnchor="middle"
                                    transform={`rotate(${rot} ${labelPos.x} ${labelPos.y})`}
                                    style={{ letterSpacing: '0.01em' }}
                                  >
                                    {lines.map((line, idx) => (
                                      <tspan key={idx} x={labelPos.x} dy={idx === 0 ? 0 : fontSize * 1.16}>
                                        {line}
                                      </tspan>
                                    ))}
                                  </text>
                                </g>
                              );
                            })}
                          </g>

                          <circle cx={c} cy={c} r={64} fill="#0b1220" />
                          <circle cx={c} cy={c} r={56} fill="#ffffff" opacity={0.06} />
                          <circle cx={c} cy={c} r={50} fill="#9f1239" />
                          <text
                            x={c}
                            y={c - 6}
                            fill="#ffffff"
                            fontSize={18}
                            fontWeight={900}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ letterSpacing: '0.18em' }}
                          >
                            {t('QUAY')}
                          </text>
                          <text
                            x={c}
                            y={c + 18}
                            fill="#ffffff"
                            opacity={0.9}
                            fontSize={10}
                            fontWeight={800}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ letterSpacing: '0.35em' }}
                          >
                            {t('NGAY')}
                          </text>
                        </svg>
                      </motion.div>

                      <div className="absolute inset-0 rounded-full border border-gray-100 pointer-events-none" />
                      <div className="absolute inset-3 rounded-full border border-gray-100 pointer-events-none" />
                      <div className="absolute inset-10 rounded-full bg-gradient-to-br from-white/0 via-white/0 to-white/20 pointer-events-none" />
                      <button
                        type="button"
                        onClick={spin}
                        disabled={spinning}
                        className="absolute inset-0 m-auto w-28 h-28 rounded-full bg-transparent disabled:cursor-not-allowed"
                        aria-label={t('Quay')}
                      />
                    </div>

                    <motion.div
                      key={resultPulse}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: result ? 1 : 0, y: result ? 0 : 10 }}
                      className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 px-8 py-6"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.45em] text-gray-400 mb-2">{t('Kết quả')}</div>
                      <div className="text-2xl font-bold font-serif tracking-tight text-gray-950">
                        {result ? t(result.label) : '—'}
                      </div>
                      <div className="text-gray-500 font-light leading-relaxed mt-2">
                        {result?.kind === 'lose'
                          ? t('Lần sau sẽ may mắn hơn. Bạn có thể quay lại để thử tiếp.')
                          : t('Nhập thông tin ở form bên dưới để nhận giải.')}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div ref={formRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex items-end justify-between gap-10">
            <div>
              <div className="text-red-600 font-bold tracking-[0.5em] uppercase text-[10px] mb-3">{t('Nhận giải')}</div>
              <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter">{t('Thông tin nhận thưởng.')}</h2>
            </div>
            <div className="hidden md:block text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400">
              {t('Form tự điền sau khi quay')}
            </div>
          </div>

          <div className="bg-gray-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-600/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

            <div className="p-10 md:p-16 relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold font-serif italic">{t('Điền thông tin')}</h3>
              <p className="text-gray-400 font-light leading-relaxed mt-3 max-w-2xl">
                {t('Sau khi quay, giải thưởng sẽ tự động được điền vào ô bên dưới. Vui lòng nhập đúng họ tên, số điện thoại và email để chúng tôi liên hệ.')}
              </p>

              <form onSubmit={onSubmit} className="mt-12 space-y-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Giải thưởng')}</label>
                  <textarea
                    value={prizeMessage}
                    readOnly
                    rows={2}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-lg md:text-xl font-serif placeholder:text-[11px] placeholder:font-bold placeholder:tracking-[0.35em] placeholder:text-white/25 focus:border-red-600 outline-none transition-colors resize-none"
                    placeholder={t('Hãy quay vòng quay để nhận giải…')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Họ và tên')}</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      type="text"
                      className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-serif placeholder:text-[11px] placeholder:font-bold placeholder:tracking-[0.35em] placeholder:text-white/25 focus:border-red-600 outline-none transition-colors"
                      placeholder={t('NGUYEN VAN A')}
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Số điện thoại')}</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-serif placeholder:text-[11px] placeholder:font-bold placeholder:tracking-[0.35em] placeholder:text-white/25 focus:border-red-600 outline-none transition-colors"
                      placeholder={t('0123 456 789')}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Email')}</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-serif placeholder:text-[11px] placeholder:font-bold placeholder:tracking-[0.35em] placeholder:text-white/25 focus:border-red-600 outline-none transition-colors"
                    placeholder={t('HELLO@EMAIL.COM')}
                    autoComplete="email"
                  />
                </div>

                <div className="pt-2 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <button
                    type="submit"
                    disabled={!result || result.kind === 'lose' || submitted}
                    className="w-full md:w-auto py-7 px-10 bg-red-600 text-white font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitted ? t('Đã gửi') : t('Nhận giải ngay')}
                  </button>

                  <div className="text-gray-400 text-sm font-light leading-relaxed">
                    {!result
                      ? t('Quay vòng quay để nhận giải trước khi gửi.')
                      : result.kind === 'lose'
                        ? t('Giải này không cần nhận. Bạn có thể quay lại để thử tiếp.')
                        : t('Nhấn “Nhận giải ngay” để chúng tôi liên hệ xác nhận.')}
                  </div>
                </div>

                {submitted && (
                  <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-8 py-6">
                    <div className="text-[10px] font-bold uppercase tracking-[0.45em] text-gray-500 mb-2">{t('Thành công')}</div>
                    <div className="text-white text-xl font-serif font-bold">
                      {t('Đã ghi nhận thông tin. Chúng tôi sẽ liên hệ sớm.')}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
