import React, { useState } from 'react';
import { Volume2, Search, Book, Play, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Section from '../components/Section';
import { dictionary } from '../data/ngheAnData';
import { useI18n } from '../i18n';

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [loadingWord, setLoadingWord] = useState<string | null>(null);
  const { t } = useI18n();

  const filteredWords = dictionary.filter(
    (item) =>
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayAudio = (word: string) => {
    if (playingWord === word) return;

    setLoadingWord(word);
    
    // Google Translate TTS API (Free & high quality for Vietnamese)
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=vi&client=tw-ob`;
    
    const audio = new Audio(googleTtsUrl);
    
    audio.oncanplaythrough = () => {
      setLoadingWord(null);
      setPlayingWord(word);
      audio.play();
    };

    audio.onended = () => {
      setPlayingWord(null);
    };

    audio.onerror = () => {
      setLoadingWord(null);
      setPlayingWord(null);
      console.error("Audio playback error");
      // Fallback to Web Speech API if Google TTS fails
      speakWithWebSpeech(word);
    };
  };

  const speakWithWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.onstart = () => setPlayingWord(text);
    utterance.onend = () => setPlayingWord(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="pt-24 overflow-hidden">
      {/* Hero Section - More Editorial */}
      <section className="relative bg-red-600 py-32 text-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Book size={600} strokeWidth={0.5} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
                <Sparkles size={16} />
                <span>{t('Khám phá phương ngữ xứ Nghệ')}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-none">
                {t('Từ điển')} <span className="italic font-serif">"Nghệ"</span><br />{t('xứ Nghệ')}
              </h1>
              <p className="text-xl text-red-100 max-w-xl mb-12 leading-relaxed">
                {t('Tiếng Nghệ không chỉ là ngôn ngữ, đó là một phần tâm hồn của người dân nơi đây. Khám phá sự thú vị và ấm áp của phương ngữ xứ Nghệ.')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white p-2 rounded-2xl shadow-2xl">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    type="text"
                    placeholder={t('Tìm kiếm từ hoặc nghĩa...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 text-gray-900 py-6 pl-16 pr-8 rounded-xl outline-none font-medium text-xl focus:bg-white transition-colors"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-800/30 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredWords.map((item, index) => (
              <motion.div
                layout
                key={item.word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`group relative p-10 bg-white border border-gray-100 rounded-3xl transition-all hover:shadow-2xl hover:-translate-y-2 ${
                  index % 4 === 0 ? 'md:col-span-2 lg:col-span-1 bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2 block">{t('Từ vựng')}</span>
                    <h3 className="text-5xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-none">
                      {item.word}
                    </h3>
                  </div>
                  <button
                    onClick={() => handlePlayAudio(item.word)}
                    disabled={loadingWord === item.word}
                    className={`p-4 rounded-2xl transition-all shadow-lg ${
                      playingWord === item.word
                        ? 'bg-red-600 text-white scale-110'
                        : 'bg-white text-gray-400 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    {loadingWord === item.word ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Volume2 size={24} />
                    )}
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-red-600/20 rounded-full" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('Nghĩa phổ thông')}</p>
                    <p className="text-2xl font-medium text-gray-800 leading-tight">{t(item.meaning)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('Ví dụ thực tế')}</p>
                    <p className="text-gray-600 italic text-lg leading-relaxed">
                      <span className="text-red-600 font-bold text-2xl leading-none mr-1">"</span>
                      {t(item.example)}
                      <span className="text-red-600 font-bold text-2xl leading-none ml-1">"</span>
                    </p>
                  </div>
                </div>

                {/* Decorative background number */}
                <div className="absolute bottom-4 right-8 text-8xl font-bold text-gray-100 -z-10 select-none group-hover:text-red-50 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredWords.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="inline-flex p-6 bg-gray-50 rounded-full mb-6">
              <Search size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-2xl font-medium">{t('Không tìm thấy từ nào khớp với tìm kiếm của bạn.')}</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-red-600 font-bold hover:underline"
            >
              {t('Xóa bộ lọc tìm kiếm')}
            </button>
          </motion.div>
        )}
      </Section>

      {/* Quote Section - More Immersive */}
      <section className="relative py-32 overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(153,27,27,0.3),transparent_70%)]" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold text-red-500 uppercase tracking-[0.3em] mb-12">{t('Tâm hồn xứ Nghệ')}</h2>
            <p className="text-3xl md:text-5xl font-serif italic leading-tight mb-12 text-gray-200">
              {t('"Dù đi đâu xa, chỉ cần nghe một tiếng \'mô\', \'tê\' là lòng lại thấy ấm áp lạ kỳ, như được trở về với mái nhà thân thương."')}
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
