/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircleHeart, 
  Moon, 
  Gift, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Info,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Home,
  Menu,
  X
} from 'lucide-react';
import { initiativesData, Initiative } from './types';

const iconMap: Record<string, React.ReactNode> = {
  MessageCircleHeart: <MessageCircleHeart className="w-8 h-8" />,
  Moon: <Moon className="w-8 h-8" />,
  Gift: <Gift className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
};

const colorClasses: Record<string, { bg: string, text: string, border: string, light: string }> = {
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
  blue: { bg: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50' },
  rose: { bg: 'bg-rose-600', text: 'text-rose-700', border: 'border-rose-200', light: 'bg-rose-50' },
};

function Logo({ className }: { className?: string }) {
  const [imageError, setImageError] = useState(false);
  
  // Array of potential logo URLs to try
  const logoUrls = [
    '/logo.png',
    'https://alzikr.edu.sa/wp-content/uploads/2021/09/Logo.png',
    'https://althikr.edu.sa/wp-content/uploads/2021/09/Logo.png'
  ];

  if (imageError) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="bg-brand-secondary p-2 rounded-xl shadow-lg">
          <BookOpen className="w-8 h-8 text-brand-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-serif font-bold text-white leading-none">مدارس الذكر</span>
          <span className="text-[10px] text-brand-secondary font-bold tracking-widest uppercase">Al Zikr Schools</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={logoUrls[0]} 
      alt="Al Zikr Schools" 
      className={`${className} w-auto object-contain transition-all duration-500`}
      referrerPolicy="no-referrer"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        const currentIndex = logoUrls.indexOf(target.src);
        if (currentIndex < logoUrls.length - 1) {
          target.src = logoUrls[currentIndex + 1];
          // If we reach the live site URL, it might need the invert trick
          if (target.src.includes('alzikr.edu.sa')) {
            target.classList.add('brightness-0', 'invert');
          }
        } else {
          setImageError(true);
        }
      }}
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentInitiative = initiativesData.find(i => i.id === activeTab);

  const navLinks = [
    { id: 'home', title: 'الرئيسية' },
    ...initiativesData.map(init => ({ id: init.id, title: init.title }))
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="bg-brand-primary text-white p-4 md:p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer transition-transform hover:scale-105" 
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            id="site-logo"
          >
            <Logo className="h-12 md:h-24" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`hover:text-brand-secondary transition-colors font-bold ${activeTab === link.id ? 'text-brand-secondary underline underline-offset-8' : ''}`}
              >
                {link.title}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-primary border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-4">
                {navLinks.map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-right py-2 hover:text-brand-secondary transition-colors font-bold ${activeTab === link.id ? 'text-brand-secondary' : ''}`}
                  >
                    {link.title}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <HomePage key="home" onStart={(id) => setActiveTab(id)} />
          ) : (
            currentInitiative && (
              <InitiativePage 
                key={currentInitiative.id} 
                initiative={currentInitiative} 
                onBack={() => setActiveTab('home')}
              />
            )
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-brand-primary text-white py-12 px-6 border-t border-brand-secondary/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <div className="mb-6 flex justify-center md:justify-start">
               <Logo className="h-16 opacity-80" />
            </div>
            <p className="text-sm text-brand-accent/70 leading-relaxed">
              برنامج تربوي إيماني يهدف إلى غرس القيم والسلوكيات الإيجابية لدى الطالبات، لبناء شخصية متوازنة وواعية.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-serif mb-4 text-brand-secondary underline underline-offset-8">المحطات</h3>
            <div className="flex flex-col gap-2 text-sm">
              {initiativesData.map(i => (
                <button key={i.id} onClick={() => setActiveTab(i.id)} className="hover:text-brand-secondary transition-colors">
                  {i.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-serif mb-4 text-brand-secondary underline underline-offset-8"> فريق العمل  </h3>
            <div className="text-sm text-brand-accent/70 space-y-4">
              <div>
                <p className="font-bold mb-2 text-white">الطالبات:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span>١. ريما المالكي</span>
                  <span>٢. لارين اليماني</span>
                  <span>٣. هاجر بالعبيد</span>
                  <span>٤. نورة التميمي</span>
                  <span>٥. ردينة الزهراني</span>
                  <span>٦. يارا السندي</span>
                  <span>٧. حلا الوادعي</span>
                  <span>٨. جواهر زيني</span>
                  <span>٩. زهرة مدخلي</span>
                  <span>١٠. البتول الأحمدي</span>
                  <span>١١. طيبة باموسى</span>
                  <span>١٢. ملك باشماخ</span>
                  <span>١٣. سارة الصاعدي</span>
                  <span>١٤. ريما الجديبي</span>
                  <span>١٥. مريم قوقندي</span>
                  <span>١٦. فاطمة الزهراني</span>
                  <span>١٧. سفانة باشنفر</span>
                  <span>١٨. سدين باشنفر</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="font-bold mb-2 text-white">إعداد وإشراف:</p>
                <div className="space-y-1">
                  <p>أ/ إيمان باطرفي</p>
                  <p>أ/ حنين سلامه</p>
                </div>
              </div>
              <div className="pt-4 text-xs opacity-50">
                جميع الحقوق محفوظة &copy; {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ onStart }: { onStart: (id: string) => void, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6"
    >
      {/* Hero Section */}
      <section className="text-center mb-12 md:mb-20 relative px-4 py-10 md:py-16 rounded-3xl overflow-hidden glass-card">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--color-brand-secondary),transparent_50%)] opacity-20"></div>
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="relative z-10"
        >
          <h2 className="text-4xl md:text-7xl font-serif mb-6 text-brand-primary leading-tight">
             أثر يبقى <br /> 
            <span className="text-brand-secondary"></span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            مرحبًا بكم في رحلتنا التربوية، حيث نمضي معًا عبر محطات مضيئة لنبني جيًلا يفتخر بقيمه ويجسد أخلاقه في كل خطوة.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button 
              onClick={() => onStart(initiativesData[0].id)}
              className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center gap-2"
            >
              ابدأ الرحلة <ChevronLeft className="w-5 h-5" />
            </button>
            <a 
              href="https://drive.google.com/drive/folders/1LOzBFFa2hTq2ptyosrnGoJsnrTVytFHd?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-secondary text-brand-primary px-8 py-4 rounded-full font-bold shadow-lg shadow-brand-secondary/20 hover:bg-brand-secondary/90 transition-all flex items-center gap-2 border-2 border-brand-primary/10"
            >
              معرض الصور المرئي <Users className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Program Map / Stations */}
      <section className="mb-20">
        <h3 className="text-3xl font-serif text-center mb-12 flex items-center justify-center gap-3">
          <BookOpen className="text-brand-secondary" /> محطات البرنامج
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initiativesData.map((init, index) => (
            <motion.div
              key={init.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onStart(init.id)}
              className="cursor-pointer group relative overflow-hidden h-full"
              id={`station-${init.id}`}
            >
              <div className={`absolute top-0 right-0 w-2 h-full ${colorClasses[init.color].bg} rounded-l-full`}></div>
              <div className="bg-white p-8 rounded-2xl h-full shadow-md border border-gray-100 group-hover:border-brand-secondary/30 transition-all">
                <div className={`${colorClasses[init.color].light} ${colorClasses[init.color].text} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  {iconMap[init.iconName]}
                </div>
                <h4 className="text-xl mb-3 font-bold group-hover:text-brand-secondary transition-colors">
                  {init.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {init.description.substring(0, 100)}...
                </p>
                <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-brand-primary transition-colors mt-auto">
                    استكشاف المحطة <ChevronLeft className="w-4 h-4 mr-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="bg-brand-primary text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-secondary opacity-10 rounded-full blur-3xl -mb-32 -mr-32"></div>
          <h3 className="text-3xl font-serif mb-8 text-brand-secondary">أهداف البرنامج الرئيسية</h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="bg-white/10 p-2 rounded-lg h-fit"><CheckCircle2 className="text-brand-secondary" /></div>
              <div>
                <p className="font-bold text-lg">تعزيز القيم الإسلامية</p>
                <p className="text-white/70 text-sm">غرس السلوكيات الإيجابية المستمدة من ديننا الحنيف.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-white/10 p-2 rounded-lg h-fit"><Users className="text-brand-secondary" /></div>
              <div>
                <p className="font-bold text-lg">بناء الشخصية الواعية</p>
                <p className="text-white/70 text-sm">تنمية شخصية متوازنة قادرة على التفاعل المجتمعي الإيجابي.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-white/10 p-2 rounded-lg h-fit"><Award className="text-brand-secondary" /></div>
              <div>
                <p className="font-bold text-lg">الاستدامة في الأثر</p>
                <p className="text-white/70 text-sm">ضمان استمرارية السلوك الصالح حتى بعد انتهاء البرنامج.</p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-4xl font-serif mb-6 text-brand-primary">لماذا "أثر يبقى"؟</h3>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            نحن نؤمن أن التعليم ليس مجرد معرفة نلقنها، بل هو أثر نضعه في نفوس طالباتنا. "أثر يبقى" هو رحلة متكاملة تربط بين الكلمة الطيبة، والعبادة في رمضان، وفرحة العيد، لتشكل لوحة متناغمة من الأخلاق والسلوك.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-brand-light rounded-2xl border border-brand-secondary/20">
              <div className="text-3xl font-bold text-brand-secondary mb-1">4</div>
              <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">مبادرات رئيسية</p>
            </div>
            <div className="p-6 bg-brand-light rounded-2xl border border-brand-secondary/20">
                <div className="text-3xl font-bold text-brand-secondary mb-1">100%</div>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">تفاعل قيمي وتطبيقي</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function InitiativePage({ initiative, onBack }: { initiative: Initiative, onBack: () => void, key?: string }) {
  const colors = colorClasses[initiative.color];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6"
    >
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors font-bold"
      >
        <ChevronRight className="w-5 h-5" /> العودة للرئيسية
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className={`${colors.light} p-10 rounded-3xl border ${colors.border} relative overflow-hidden`}>
            <div className={`absolute -top-6 -left-6 w-32 h-32 ${colors.bg} opacity-10 rounded-full blur-2xl`}></div>
            <div className="relative z-10">
              <div className={`${colors.bg} text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                {iconMap[initiative.iconName]}
              </div>
              <h2 className="text-3xl font-serif mb-4">{initiative.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {initiative.description}
              </p>
              <div className="space-y-4">
                <h4 className="font-bold border-b pb-2 flex items-center gap-2">
                   <Info className="w-4 h-4 text-brand-secondary" /> الأهداف التفصيلية
                </h4>
                <ul className="space-y-3">
                  {initiative.goals.map((goal, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-700">
                      <span className={`${colors.bg} w-1.5 h-1.5 rounded-full mt-1.5 shrink-0`}></span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              {initiative.driveLink && (
                <div className="mt-8">
                  <a 
                    href={initiative.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${colors.bg} text-white w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:brightness-110 transition-all`}
                  >
                    <Users className="w-5 h-5" /> مشاهدة معرض الصور المرئي
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <h4 className="font-bold mb-4 flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-brand-secondary" /> محاور الاستهداف
             </h4>
             <div className="space-y-4">
                {initiative.pillars.map((pillar, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-bold text-brand-primary mb-2">{pillar.title}</p>
                    <div className="flex flex-wrap gap-2">
                       {pillar.details.map((detail, dIdx) => (
                         <span key={dIdx} className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200">
                            {detail}
                         </span>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-3xl font-serif mb-8 border-r-4 border-brand-secondary pr-4 leading-none">
                الأنشطة والمخرجات
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {initiative.activities.map((activity, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className={`${colors.light} ${colors.text} w-12 h-12 rounded-full flex items-center justify-center mb-6`}>
                       <Award className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{activity.title}</h4>
                    <p className="text-gray-500 leading-relaxed text-sm">
                      {activity.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Interactive Section Example Removed */}
            
            {/* Dynamic Summary/Impact Section (The Large Colored Box) */}
            <section className="bg-brand-primary text-white p-6 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary opacity-10 rounded-full blur-3xl -mb-32 -ml-32"></div>
               <div className="relative z-10 flex flex-col gap-6 md:gap-10">
                  <div className="flex flex-col md:flex-row items-center text-center md:text-right gap-6 md:gap-10">
                    <div className="shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-brand-secondary rounded-full flex items-center justify-center p-4">
                          <Heart className="w-12 h-12 md:w-16 md:h-16 text-brand-secondary fill-brand-secondary" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl md:text-3xl font-serif mb-4 text-brand-secondary">إيجابيات وأثر المبادرة</h3>
                      <p className="text-white/80 leading-relaxed text-base md:text-lg">
                         {(initiative.id === 'kind-words' || initiative.id === 'eid-joy') ? 
                            initiative.summaryText : 
                            "نستعرض هنا أبرز المكاسب والأثر المستدام الذي حققناه من خلال هذه المحطة التربوية وتفاعلنا المثمر:"
                         }
                      </p>
                    </div>
                  </div>

                  {/* If lists exist, they now appear MERGED inside this colored box */}
                  {(initiative.positives && initiative.positives.length > 0) || (initiative.impact && initiative.impact.length > 0) ? (
                    <div className="grid lg:grid-cols-2 gap-8 border-t border-white/10 pt-10">
                       {/* Positives Column */}
                       <div>
                          <h4 className="text-brand-secondary font-bold mb-6 flex items-center gap-2 text-xl">
                             <Sparkles className="w-6 h-6" /> إيجابيات البرنامج
                          </h4>
                          <ul className="space-y-4">
                             {initiative.positives?.map((p, i) => (
                                <li key={i} className="bg-white/5 p-5 rounded-2xl flex gap-4 text-white/90 border border-white/5 hover:bg-white/10 transition-colors">
                                   <CheckCircle2 className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                                   <span className="leading-relaxed">{p}</span>
                                </li>
                             ))}
                          </ul>
                       </div>
                       {/* Impact Column */}
                       <div>
                          <h4 className="text-brand-accent font-bold mb-6 flex items-center gap-2 text-xl">
                             <Award className="w-6 h-6 text-brand-secondary" /> أثر البرنامج
                          </h4>
                          <ul className="space-y-4">
                             {initiative.impact?.map((p, i) => (
                                <li key={i} className="bg-white/10 p-5 rounded-2xl flex gap-4 text-white/90 border border-white/5 hover:bg-white/20 transition-colors">
                                   <div className="bg-brand-secondary w-2 h-2 rounded-full mt-2.5 shrink-0 shadow-[0_0_10px_var(--color-brand-secondary)]" />
                                   <span className="leading-relaxed">{p}</span>
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                  ) : null}
               </div>
            </section>
        </div>

      </div>
    </motion.div>
  );
}
