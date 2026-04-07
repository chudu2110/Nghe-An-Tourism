import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Search, 
  UserPlus, 
  MessageCircle, 
  Filter, 
  ChevronRight, 
  CheckCircle2,
  Globe,
  MapPin,
  Mail,
  Zap,
  Users,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { stripVietnameseDiacritics, useI18n } from '../i18n';

const volunteerImage = (fileName: string) =>
  new URL(`../../Volunteer img/${fileName}`, import.meta.url).href;

// Compact directory data
const volunteerDirectory = [
  { id: 'VN001', name: 'Nguyễn Văn Nam', area: 'TP. Vinh', lang: 'Tiếng Anh, Pháp', status: 'Sẵn sàng', specialty: 'Lịch sử', avatar: volunteerImage('avt Nguyễn Văn Nam.png') },
  { id: 'VN002', name: 'Lê Thị Mai', area: 'Nam Đàn', lang: 'Tiếng Anh', status: 'Đang dẫn đoàn', specialty: 'Ẩm thực', avatar: volunteerImage('avt Lê Thị Mai.jpg') },
  { id: 'VN003', name: 'Trần Minh Tuấn', area: 'Con Cuông', lang: 'Tiếng Nhật', status: 'Sẵn sàng', specialty: 'Trekking', avatar: volunteerImage('avt Trần Minh Tuấn.jpg') },
  { id: 'VN004', name: 'Hoàng Thị Lan', area: 'Cửa Lò', lang: 'Tiếng Trung', status: 'Sẵn sàng', specialty: 'Nghỉ dưỡng', avatar: volunteerImage('avt Hoàng Thị Lan.jpg') },
  { id: 'VN005', name: 'Phạm Đức Anh', area: 'Thanh Chương', lang: 'Tiếng Anh', status: 'Bận', specialty: 'Văn hóa', avatar: volunteerImage('avt Phạm Đức Anh.jpg') },
];

const openRoles = [
  { title: 'Dẫn đoàn văn hóa', count: '12 vị trí', desc: 'Chia sẻ kiến thức về các di tích lịch sử và danh lam thắng cảnh.' },
  { title: 'Hỗ trợ cộng đồng', count: '05 vị trí', desc: 'Giúp đỡ khách du lịch trong việc giao tiếp và di chuyển tại địa phương.' },
  { title: 'Sáng tạo nội dung', count: '03 vị trí', desc: 'Chụp ảnh, quay phim và viết bài quảng bá du lịch Xứ Nghệ.' },
  { title: 'Điều phối sự kiện', count: '02 vị trí', desc: 'Hỗ trợ tổ chức các lễ hội và sự kiện văn hóa tại Nghệ An.' },
];

const featuredGuides = [
  { id: 'FG001', name: 'Minh Tuấn', area: 'Con Cuông', specialty: 'Trekking & Rừng núi', rating: 4.9, reviews: 128, img: volunteerImage('Sứ giả Minh Tuấn.jpeg') },
  { id: 'FG002', name: 'Thanh Mai', area: 'Nam Đàn', specialty: 'Lịch sử & Di tích', rating: 5.0, reviews: 86, img: volunteerImage('avt sứ giả Thanh Mai.jpg') },
  { id: 'FG003', name: 'Đức Anh', area: 'TP. Vinh', specialty: 'Ẩm thực & Đêm Vinh', rating: 4.8, reviews: 210, img: volunteerImage('Sử giả Đức Anh.jpg') },
];

export default function Volunteers() {
  const [viewMode, setViewMode] = useState<'join' | 'find'>('join');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [expertise, setExpertise] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mode = new URLSearchParams(location.search).get('mode');
    if (mode === 'find') setViewMode('find');
    if (mode === 'join') setViewMode('join');
  }, [location.search]);

  const onApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    const nameOk = fullName.trim().length >= 2;
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    const expertiseOk = !!expertise;
    if (!nameOk || !emailOk || !expertiseOk) {
      setError(t('Vui lòng điền đầy đủ thông tin theo yêu cầu.'));
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-red-600 selection:text-white">
      
      {/* SECTION 1: DUAL-ACTION HERO (Split Layout) */}
      <section className="relative min-h-screen flex flex-col lg:flex-row border-b border-white/10 pt-20">
        {/* Left: Join Path */}
        <div 
          onClick={() => setViewMode('join')}
          className={`flex-1 p-12 md:p-24 flex flex-col justify-center cursor-pointer transition-all duration-1000 relative overflow-hidden group border-r border-white/10 ${viewMode === 'join' ? 'bg-red-600' : 'bg-transparent hover:bg-white/5'}`}
        >
          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-4">
              <span className={`font-mono text-[10px] font-bold tracking-[0.5em] uppercase ${viewMode === 'join' ? 'text-white' : 'text-red-500'}`}>
                {t('01. Tuyển dụng')}
              </span>
            </div>
            <h1 className={`text-[clamp(2.1rem,5.5vw,7rem)] font-bold font-serif ${lang === 'vi' ? 'leading-[1.2]' : 'leading-[1.0]'} tracking-tighter uppercase`}>
              {t('Gia nhập')} <br /> <span className={viewMode === 'join' ? 'text-black italic' : 'text-red-600 italic'}>{t('Sứ giả')}</span>
            </h1>
            <p className={`max-w-md text-xl font-light leading-relaxed ${viewMode === 'join' ? 'text-white/90' : 'text-gray-400'}`}>
              {t('Trở thành cầu nối văn hóa giữa Xứ Nghệ và thế giới. Chúng tôi đang tìm kiếm những trái tim nhiệt huyết.')}
            </p>
            <div className={`w-24 h-24 rounded-full border flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 ${viewMode === 'join' ? 'border-white text-white' : 'border-red-600 text-red-600'}`}>
              <UserPlus size={40} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Right: Find Path */}
        <div 
          onClick={() => setViewMode('find')}
          className={`flex-1 p-12 md:p-24 flex flex-col justify-center cursor-pointer transition-all duration-1000 relative overflow-hidden group ${viewMode === 'find' ? 'bg-white text-black' : 'bg-transparent hover:bg-white/5'}`}
        >
          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-4">
              <span className={`font-mono text-[10px] font-bold tracking-[0.5em] uppercase ${viewMode === 'find' ? 'text-black' : 'text-red-500'}`}>
                {t('02. Kết nối')}
              </span>
            </div>
            <h1 className={`text-[clamp(2.1rem,5.5vw,7rem)] font-bold font-serif ${lang === 'vi' ? 'leading-[1.2]' : 'leading-[1.0]'} tracking-tighter uppercase`}>
              {t('Kết nối')} <br /> <span className="text-red-600 italic">{t('Cộng đồng')}</span>
            </h1>
            <p className={`max-w-md text-xl font-light leading-relaxed ${viewMode === 'find' ? 'text-black/70' : 'text-gray-400'}`}>
              {t('Tìm kiếm sự hỗ trợ từ những người am hiểu địa phương nhất. Hoàn toàn miễn phí và tận tâm.')}
            </p>
            <div className={`w-24 h-24 rounded-full border flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 ${viewMode === 'find' ? 'border-black text-black' : 'border-red-600 text-red-600'}`}>
              <Search size={40} strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DYNAMIC INTERFACE */}
      <AnimatePresence mode="wait">
        {viewMode === 'join' ? (
          <motion.section 
            key="join-interface"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="py-32 bg-white text-black"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                {/* Left: Open Positions */}
                <div className="lg:col-span-7 space-y-20">
                  <div className="space-y-6">
                    <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-[10px] block">{t('Cơ hội tham gia')}</span>
                    <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter leading-none uppercase">{t('Vị trí')} <br /> {t('đang tuyển')}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
                    {openRoles.map((role, i) => (
                      <div key={i} className="p-10 border-b md:border-r border-black last:border-b-0 md:[&:nth-child(2)]:border-r-0 md:[&:nth-child(3)]:border-b-0 hover:bg-black hover:text-white transition-all duration-500 group relative">
                        <span className="text-[10px] font-bold text-red-600 mb-4 block">{t(role.count)}</span>
                        <h4 className="text-2xl font-bold font-serif mb-4 uppercase">{t(role.title)}</h4>
                        <p className="text-gray-500 group-hover:text-gray-400 font-light text-sm leading-relaxed">{t(role.desc)}</p>
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={20} className="text-red-600" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
                    {[
                      { icon: <Zap size={24} />, title: t('Đào tạo'), desc: t('Kỹ năng ngoại ngữ & nghiệp vụ hướng dẫn.') },
                      { icon: <Globe size={24} />, title: t('Mạng lưới'), desc: t('Kết nối với du khách từ khắp nơi trên thế giới.') },
                      { icon: <Award size={24} />, title: t('Chứng nhận'), desc: t('Được công nhận bởi cộng đồng du lịch Nghệ An.') }
                    ].map((benefit, i) => (
                      <div key={i} className="space-y-4">
                        <div className="text-red-600">{benefit.icon}</div>
                        <h5 className="font-bold text-sm uppercase tracking-widest">{benefit.title}</h5>
                        <p className="text-gray-500 text-xs leading-relaxed">{benefit.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Process Steps */}
                  <div className="pt-20 space-y-12">
                    <h3 className="text-2xl font-bold font-serif uppercase tracking-tighter">{t('Quy trình ứng tuyển')}</h3>
                    <div className="space-y-8">
                      {[
                        { step: '01', title: t('Nộp hồ sơ'), desc: t('Điền thông tin vào form bên cạnh hoặc gửi CV trực tiếp.') },
                        { step: '02', title: t('Phỏng vấn'), desc: t('Trao đổi về kỹ năng và niềm đam mê với văn hóa Xứ Nghệ.') },
                        { step: '03', title: t('Thử thách'), desc: t('Tham gia một buổi dẫn đoàn thực tế cùng chuyên gia.') }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start space-x-8 group">
                          <span className="text-4xl font-black font-serif text-gray-100 group-hover:text-red-600 transition-colors">{item.step}</span>
                          <div className="space-y-1">
                            <h6 className="font-bold uppercase text-sm tracking-widest">{item.title}</h6>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Application Form */}
                <div className="lg:col-span-5">
                  <div className="sticky top-32 bg-gray-950 text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
                    <h3 className="text-3xl font-bold font-serif mb-12 italic">{t('Đăng ký ứng tuyển')}</h3>
                    <form className="space-y-10" onSubmit={onApplySubmit}>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Họ và tên')}</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-serif focus:border-red-600 outline-none transition-colors"
                          placeholder={t('NGUYEN VAN A')}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Email liên hệ')}</label>
                        <input
                          type="email"
                          className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-serif focus:border-red-600 outline-none transition-colors"
                          placeholder={t('HELLO@EMAIL.COM')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Lĩnh vực am hiểu')}</label>
                        <select
                          className="w-full bg-transparent border-b border-white/20 py-4 text-lg font-serif focus:border-red-600 outline-none transition-colors appearance-none cursor-pointer"
                          value={expertise}
                          onChange={(e) => setExpertise(e.target.value)}
                        >
                          <option value="" className="bg-gray-900" disabled>
                            {t('Chọn lĩnh vực')}
                          </option>
                          <option value="culture" className="bg-gray-900">
                            {t('VĂN HÓA & LỊCH SỬ')}
                          </option>
                          <option value="cuisine" className="bg-gray-900">
                            {t('ẨM THỰC XỨ NGHỆ')}
                          </option>
                          <option value="nature" className="bg-gray-900">
                            {t('THIÊN NHIÊN & TREKKING')}
                          </option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-8 bg-red-600 text-white font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-red-600/20"
                      >
                        {t('Gửi hồ sơ ngay')}
                      </button>
                      {(submitted || error) && (
                        <div className="text-gray-400 text-sm font-light leading-relaxed">
                          {submitted
                            ? t('Đăng ký thành công, hãy thường xuyên kiểm tra mail của bạn để nhận thông tin sớm nhất từ chúng tôi!')
                            : t('Vui lòng điền đầy đủ thông tin theo yêu cầu.')}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            key="find-interface"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="py-32 bg-[#0a0a0a]"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                <div className="space-y-6">
                  <span className="text-red-500 font-bold tracking-[0.4em] uppercase text-[10px] block">{t('Mạng lưới kết nối')}</span>
                    <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter leading-none uppercase">{t('Danh bạ ')}<br /> <span className="text-red-600 italic">{t('Sứ giả')}</span></h2>
                </div>
                
                {/* Search & Filter Bar */}
                <div className="flex w-full md:w-auto items-center space-x-4">
                  <div className="relative flex-1 md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      placeholder={t('Tìm theo tên, khu vực, ngôn ngữ...')} 
                      className="w-full bg-white/5 border border-white/10 py-5 pl-16 pr-6 rounded-full outline-none focus:border-red-600 transition-all text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <Filter size={20} />
                  </button>
                </div>
              </div>

              {/* Compact Directory Table (Recipe 1 Style) */}
              <div className="overflow-x-auto border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">{t('Mã số')}</th>
                      <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">{t('Họ và tên')}</th>
                      <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">{t('Khu vực')}</th>
                      <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">{t('Ngôn ngữ')}</th>
                      <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">{t('Chuyên môn')}</th>
                      <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">{t('Trạng thái')}</th>
                      <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">{t('Hành động')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteerDirectory.filter(v => 
                      (() => {
                        const q = stripVietnameseDiacritics(searchTerm.trim()).toLowerCase();
                        if (!q) return true;
                        const name = stripVietnameseDiacritics(v.name).toLowerCase();
                        const area = stripVietnameseDiacritics(v.area).toLowerCase();
                        const lang = stripVietnameseDiacritics(v.lang).toLowerCase();
                        return name.includes(q) || area.includes(q) || lang.includes(q);
                      })()
                    ).map((v) => (
                      <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-8 font-mono text-xs text-gray-600">{v.id}</td>
                        <td className="p-8">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                              <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold font-serif text-xl">{v.name}</span>
                          </div>
                        </td>
                        <td className="p-8 text-sm flex items-center space-x-3 h-full">
                          <MapPin size={16} className="text-red-600" />
                          <span className="text-gray-300">{t(v.area)}</span>
                        </td>
                        <td className="p-8 text-sm text-gray-400">{t(v.lang)}</td>
                        <td className="p-8">
                          <span className="px-4 py-1.5 bg-red-600/10 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {t(v.specialty)}
                          </span>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${v.status === 'Sẵn sàng' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : v.status === 'Bận' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                            <span className="text-xs font-medium">{t(v.status)}</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center space-x-4">
                            <button
                              type="button"
                              onClick={() => navigate('/assistant')}
                              className="p-3 bg-white/5 rounded-xl hover:bg-red-600 transition-colors group/btn"
                            >
                              <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate('/about')}
                              className="p-3 bg-white/5 rounded-xl hover:bg-red-600 transition-colors group/btn"
                            >
                              <Mail size={18} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 p-12 bg-white/5 rounded-[2rem] border border-white/10">
                <div className="flex items-center space-x-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-950 bg-gray-800 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+30}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">{t('Hiển thị {shown} trên {total} tình nguyện viên đang hoạt động.', { shown: 5, total: 512 })}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/assistant')}
                  className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-red-600 hover:text-white transition-all"
                >
                  {t('Xem toàn bộ danh sách')}
                </button>
              </div>

              {/* NEW: Featured Guides for Tourists */}
              <div className="mt-32 space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="space-y-4">
                    <span className="text-red-500 font-bold tracking-[0.4em] uppercase text-[10px] block">{t('Dành cho khách du lịch')}</span>
                    <h2 className="text-4xl md:text-6xl font-bold font-serif tracking-tighter leading-none uppercase">{t('Sứ giả')} <br /> <span className="text-red-600 italic">{t('Tiêu biểu')}</span></h2>
                  </div>
                  <p className="max-w-md text-gray-500 text-sm leading-relaxed">
                    {t('Những tình nguyện viên có kinh nghiệm dẫn đoàn phong phú và nhận được nhiều phản hồi tích cực nhất từ du khách.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredGuides.map((guide) => (
                    <div key={guide.id} className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-red-600 transition-all duration-500">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img 
                          src={guide.img} 
                          alt={guide.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{t(guide.area)}</span>
                            <h4 className="text-2xl font-bold font-serif text-white">{guide.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-red-500 font-bold text-lg">★ {guide.rating}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-widest">{t('{n} đánh giá', { n: guide.reviews })}</div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs font-light">{t(guide.specialty)}</p>
                        <button
                          type="button"
                          onClick={() => navigate('/assistant')}
                          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 hover:text-white transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500"
                        >
                          {t('Kết nối ngay')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEW: Request a Guide Widget (Recipe 3 Style) */}
              <div className="mt-32 p-12 md:p-20 bg-red-600 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <h3 className="text-4xl md:text-6xl font-bold font-serif tracking-tighter leading-none uppercase text-white">
                      {t('Bạn cần một')} <br /> <span className="text-black italic">{t('Sứ giả riêng?')}</span>
                    </h3>
                    <p className="text-white/80 text-lg font-light leading-relaxed max-w-md">
                      {t('Nếu bạn có yêu cầu đặc biệt về lịch trình hoặc ngôn ngữ, hãy gửi yêu cầu cho chúng tôi. Chúng tôi sẽ tìm kiếm người phù hợp nhất cho bạn.')}
                    </p>
                    <div className="flex items-center space-x-8">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-red-600 bg-white/20" />
                        ))}
                      </div>
                      <span className="text-white font-bold text-sm uppercase tracking-widest">{t('Hơn 500+ Sứ giả sẵn sàng')}</span>
                    </div>
                  </div>
                  
                  <div className="bg-black p-10 rounded-[2.5rem] shadow-2xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Ngày đi')}</label>
                        <input type="date" className="w-full bg-white/5 border-b border-white/10 py-3 text-white outline-none focus:border-red-600 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Số người')}</label>
                        <input type="number" placeholder={t('1')} className="w-full bg-white/5 border-b border-white/10 py-3 text-white outline-none focus:border-red-600 transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('Ghi chú yêu cầu')}</label>
                      <textarea placeholder={t('Ví dụ: Cần người am hiểu về lịch sử triều Lê...')} className="w-full bg-white/5 border-b border-white/10 py-3 text-white outline-none focus:border-red-600 transition-colors h-24 resize-none" />
                    </div>
                    <button className="w-full py-6 bg-red-600 text-white font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-white hover:text-black transition-all duration-500">
                      {t('Gửi yêu cầu hỗ trợ')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* SECTION 3: TRUST & SAFETY (Recipe 7) */}
      <section className="py-40 bg-white text-black relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-16">
          <ShieldCheck className="text-red-600 mx-auto" size={100} strokeWidth={1} />
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter leading-none uppercase italic">{t('Cam kết')} <br /> <span className="text-red-600 not-italic">{t('Tin cậy')}</span></h2>
            <p className="text-gray-500 text-2xl font-light leading-relaxed italic">
              {t('"Tất cả tình nguyện viên đều được xác minh danh tính và đào tạo kỹ lưỡng. Chúng tôi cam kết mang lại trải nghiệm văn minh, an toàn và đậm chất bản địa cho mọi du khách khi đến với Nghệ An."')}
            </p>
          </div>
          <div className="flex justify-center space-x-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-red-600/20" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
