"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  Send, 
  MessageSquare, 
  Award, 
  Compass, 
  Info,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  ChevronRight,
  Globe,
  Leaf
} from "lucide-react";
import confetti from "canvas-confetti";
import { fetchWishes, addWish, type Wish, type NewWish } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";

const INITIAL_WISHES: Wish[] = [];

export default function GraduationInvite() {
  // Language
  const { locale, t, toggleLocale } = useLanguage();

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // Music Player State
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Guestbook State
  const [wishes, setWishes] = useState(INITIAL_WISHES);
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Flip Card State (keeps track of flipped card IDs)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Interactive Mini-Map State (active step along the path at Dong A University)
  const [activeMapStep, setActiveMapStep] = useState(0);

  // Target Date: July 10, 2026, 09:00 AM (GMT+7)
  const targetDate = new Date("2026-07-10T09:00:00+07:00").getTime();

  useEffect(() => {
    // Load wishes from Supabase
    const loadWishes = async () => {
      const data = await fetchWishes();
      setWishes(data);
    };
    loadWishes();

    // Initialize Audio (Gentle acoustic music)
    audioRef.current = new Audio("/audio/videoplayback.m4a");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
    audioRef.current.play().catch(() => {
      // Autoplay may be blocked by browser; user can manually start audio.
      setIsPlaying(false);
    });

    // Countdown Interval
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isOver: false });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [targetDate]);

  // Toggle Music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play blocked by browser. Needs user interaction."));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Flip card handler
  const handleCardClick = (id: number | undefined) => {
    if (!id) return;
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Submit wish handler
  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    setIsSubmitting(true);

    try {
      const newWish: NewWish = {
        name: formName.trim(),
        wishes: formMessage.trim()
      };

      const result = await addWish(newWish);
      
      if (result) {
        const updatedWishes = [result, ...wishes];
        setWishes(updatedWishes);

        // Trigger Confetti (Mint Green, Peach/Orange, White, Gold)
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#0F5E3D", "#EE6C25", "#F4F9F5", "#FFD700"]
        });

        // Clear Form
        setFormName("");
        setFormMessage("");
        setIsSuccess(true);

        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error adding wish:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardColor = (index: number) => {
    const colors = ["bg-[#EAF2EC]", "bg-[#FFF3EC]", "bg-[#E2EFE7]"];
    return colors[index % colors.length];
  };

  const formatDateFromDatabase = (dateString: string | undefined) => {
    const dateLocale = locale === "vi" ? "vi-VN" : "en-US";
    if (!dateString) return new Date().toLocaleDateString(dateLocale);
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(dateLocale);
    } catch {
      return new Date().toLocaleDateString(dateLocale);
    }
  };

  // Calendar Export Logic (July 10, 2026)
  const handleAddToCalendar = () => {
    const title = t.calendarTitle;
    const details = t.calendarDetails;
    const location = t.calendarLocation;
    const startDate = "20260710T090000";
    const endDate = "20260710T120000";

    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(gCalUrl, "_blank");
  };

  return (
    <div className="relative min-h-screen selection:bg-[#0F5E3D] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft, gentle green/orange blur blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-[#0F5E3D]/5 blur-[120px]" />
        <div className="absolute top-[35%] right-[-10%] w-[65%] h-[65%] rounded-full bg-[#EE6C25]/4 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-[#0F5E3D]/4 blur-[130px]" />
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col gap-2.5">
        {/* Language Toggle Button */}
        <button
          onClick={toggleLocale}
          className="btn-3d-cream p-3 sm:p-4 rounded-full flex items-center justify-center gap-2 group shadow-lg cursor-pointer touch-manipulation hover:shadow-xl transition-shadow"
          title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
          aria-label="Toggle Language"
          id="language-toggle"
        >
          <Globe className="w-5 h-5 sm:w-5 sm:h-5 text-[#0F5E3D] flex-shrink-0" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-20 transition-all duration-300 ease-out text-xs font-semibold whitespace-nowrap">
            {locale === "vi" ? "English" : "Tiếng Việt"}
          </span>
        </button>

        {/* Music Toggle Button */}
        <button
          onClick={toggleMusic}
          className="btn-3d-cream p-3 sm:p-4 rounded-full flex items-center justify-center gap-2 group shadow-lg cursor-pointer touch-manipulation hover:shadow-xl transition-shadow"
          title={t.musicTitle}
          aria-label="Toggle Music"
          id="music-toggle"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-5 h-5 sm:w-5 sm:h-5 text-[#0F5E3D] animate-pulse flex-shrink-0" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-16 md:group-hover:max-w-20 transition-all duration-300 ease-out text-xs font-semibold whitespace-nowrap">
                {t.musicOff}
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 sm:w-5 sm:h-5 text-[#0F5E3D] flex-shrink-0" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-16 md:group-hover:max-w-20 transition-all duration-300 ease-out text-xs font-semibold whitespace-nowrap">
                {t.musicOn}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <header className="relative w-full py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 flex flex-col items-center justify-center z-10 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center w-full"
        >
          {/* Custom Polaroid-style Photo Frame */}
          <div className="relative w-60 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 mb-6 sm:mb-8 flex items-center justify-center filter drop-shadow-2xl">
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative w-full h-full p-4 pb-6 bg-white rounded-3xl border border-zinc-200/40 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.95),_inset_-4px_-4px_10px_rgba(0,0,0,0.03),_0_20px_45px_rgba(15,94,61,0.05)] flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="relative w-full h-[85%] rounded-2xl overflow-hidden border border-zinc-100 bg-[#FAFAFA]">
                <Image 
                  src="/hero-avatar.jpg?v=2" 
                  alt="Phan Ngọc Ý Mỹ Graduation" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Polaroid Signature */}
              <div className="text-center pt-3 text-[#0F5E3D] font-serif font-bold tracking-wider text-sm md:text-base">
                🎓 Phan Ngọc Ý Mỹ &bull; UDA 2026
              </div>

              {/* Cap Overlay */}
              <div className="absolute -top-6 -right-6 w-20 h-20 filter drop-shadow-md z-30">
                <Image
                  src="/hero-cap.png"
                  alt="Mini Cap"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            
            {/* Sparkles decorations */}
            <motion.div 
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-2 right-2 text-[#0F5E3D]/70"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
            <motion.div 
              animate={{ scale: [1.25, 1, 1.25], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-6 left-2 text-[#EE6C25]/60"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>

          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F5E3D] bg-[#0F5E3D]/10 border border-[#0F5E3D]/20 mb-4 inline-flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5" /> {t.badge}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1E3328] leading-tight max-w-4xl px-2 sm:px-3">
            {t.heroTitle} <br className="sm:hidden" />
            <span className="text-[#EE6C25] text-shadow-3d-orange font-serif relative inline-block py-1">
              {t.heroName}
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 max-w-xl mx-auto italic font-light px-3 sm:px-4 leading-relaxed">
            {t.heroQuote}
          </p>
        </motion.div>
      </header>

      {/* Countdown Section */}
      <section className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 z-10 mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="clay-card p-6 sm:p-8 md:p-12 text-center"
        >
          <h2 className="text-[#0F5E3D] text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase mb-6 sm:mb-8 flex items-center justify-center gap-2 flex-wrap">
            <Clock className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '8s' }} /> {t.countdownHeading}
          </h2>

          <AnimatePresence mode="wait">
            {!timeLeft.isOver ? (
              <motion.div 
                key="timer"
                className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Days */}
                <div className="countdown-block py-3 sm:py-6 px-2 sm:px-4 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-[#0F5E3D] tracking-tight">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500 mt-1 sm:mt-2">{t.days}</span>
                </div>
                {/* Hours */}
                <div className="countdown-block py-3 sm:py-6 px-2 sm:px-4 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-[#0F5E3D] tracking-tight">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500 mt-1 sm:mt-2">{t.hours}</span>
                </div>
                {/* Minutes */}
                <div className="countdown-block py-3 sm:py-6 px-2 sm:px-4 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-[#0F5E3D] tracking-tight">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500 mt-1 sm:mt-2">{t.minutes}</span>
                </div>
                {/* Seconds */}
                <div className="countdown-block py-3 sm:py-6 px-2 sm:px-4 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-[#0F5E3D] tracking-tight">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500 mt-1 sm:mt-2">{t.seconds}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-5 rounded-3xl bg-[#0F5E3D] border-2 border-white/20 text-white shadow-xl animate-bounce flex-wrap justify-center"
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse absolute animate-spin" />
                </div>
                <span className="font-serif text-sm sm:text-lg md:text-xl lg:text-2xl font-bold tracking-wide">
                  {t.happeningNow}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-4 sm:mt-8 text-[10px] sm:text-xs text-zinc-400 px-2">
            {t.countdownNote}
          </p>
        </motion.div>
      </section>

      {/* Event Details & Map Section */}
      <section className="relative w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 z-10 mb-12 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-stretch">
          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="clay-card-green p-6 sm:p-8 md:p-12 text-white flex flex-col justify-between"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 leading-snug">
                {t.eventDetailsTitle}
              </h2>
              <div className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 sm:p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60 mb-1">{t.timeLabel}</h3>
                    <p className="font-serif text-lg sm:text-xl md:text-2xl font-semibold">{t.timeValue}</p>
                    <p className="text-zinc-200 text-xs sm:text-sm mt-1">{t.dateValue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 sm:p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60 mb-1">{t.locationLabel}</h3>
                    <p className="font-serif text-base sm:text-lg md:text-xl font-semibold">{t.locationName}</p>
                    <p className="text-zinc-200 text-xs sm:text-sm mt-1 leading-relaxed">
                      {t.locationAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button
                onClick={handleAddToCalendar}
                className="btn-3d-cream py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl text-xs sm:text-sm flex-1 sm:flex-none inline-flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <Calendar className="w-4 h-4 flex-shrink-0" /> {t.saveCalendar}
              </button>
              <a
                href="https://maps.google.com/?q=Đại+học+Đông+Á+33+Xô+Viết+Nghệ+Tĩnh+Đà+Nẵng" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/15 transition-all py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl text-xs sm:text-sm flex-1 sm:flex-none inline-flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" /> {t.getDirections}
              </a>
            </div>
          </motion.div>

          {/* Interactive Map Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Google Map iframe */}
            <div className="relative h-48 sm:h-64 md:h-72 rounded-3xl overflow-hidden shadow-lg border border-zinc-200/40 bg-white p-2">
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.3828989508546!2d108.2213025148577!3d16.032028988898197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142199b0c000001%3A0x6764516751240166!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyDEkMO0bmcgw4E!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: "sepia(20%) hue-rotate(85deg) saturate(95%) contrast(100%)" }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dong A University Map"
                ></iframe>
                <div className="absolute bottom-3 right-3 bg-[#0F5E3D] text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-md border border-white/10 pointer-events-none">
                  UDA - 33 Xô Viết Nghệ Tĩnh
                </div>
              </div>
            </div>

            {/* Campus Guide Mini-map */}
            <div className="clay-card p-4 sm:p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E3328] flex items-center gap-2 flex-shrink-0">
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F5E3D] animate-pulse flex-shrink-0" /> <span className="hidden sm:inline">{t.miniMapTitle}</span><span className="sm:hidden">{t.miniMapTitleShort}</span>
                  </h3>
                  <span className="text-[10px] sm:text-xs text-zinc-500 font-medium">{t.miniMapHint}</span>
                </div>
                
                {/* Pathway Visualizer */}
                <div className="relative h-24 sm:h-28 bg-[#0F5E3D]/5 rounded-2xl border border-[#0F5E3D]/10 flex items-center justify-between px-3 sm:px-6 mb-3 sm:mb-4 overflow-x-auto overflow-y-hidden">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M 50,75 C 100,75 120,35 200,35 C 280,35 300,75 380,75 C 450,75 480,30 550,30" 
                      fill="none" 
                      stroke="#0F5E3D" 
                      strokeWidth="3" 
                      strokeDasharray="6 6"
                      className="opacity-40"
                    />
                  </svg>

                  {/* Interactive Nodes */}
                  {t.mapSteps.map((step, idx) => {
                    const isActive = activeMapStep === idx;
                    const isPassed = activeMapStep > idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveMapStep(idx)}
                        className="relative z-10 flex flex-col items-center focus:outline-none group cursor-pointer flex-shrink-0 px-1 sm:px-2"
                      >
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? "bg-[#0F5E3D] text-white scale-110 sm:scale-125 ring-4 ring-[#0F5E3D]/20 shadow-md" 
                            : isPassed 
                              ? "bg-[#0F5E3D]/80 text-white" 
                              : "bg-white text-zinc-400 border border-zinc-200"
                        }`}>
                          {isActive ? (
                            <span className="text-[8px] sm:text-[10px] font-black">🎓</span>
                          ) : (
                            <span className="text-[10px] sm:text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`text-[8px] sm:text-[10px] mt-1 font-bold transition-colors ${
                          isActive ? "text-[#0F5E3D]" : "text-zinc-400 group-hover:text-zinc-600"
                        }`}>
                          S{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMapStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/60 p-3 sm:p-4 rounded-xl border border-[#0F5E3D]/10 flex items-start gap-2 sm:gap-3"
                >
                  <div className="p-1.5 sm:p-2 bg-[#0F5E3D]/10 rounded-lg text-[#0F5E3D] mt-0.5 flex-shrink-0">
                    <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#1E3328]">
                      {t.mapSteps[activeMapStep].title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 leading-relaxed">
                      {t.mapSteps[activeMapStep].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="relative w-full py-12 sm:py-16 px-3 sm:px-4 z-10 bg-[#0F5E3D]/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#0F5E3D] text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-[#0F5E3D]/10 px-3 sm:px-3.5 py-1.5 rounded-full inline-block">
              {t.journeyBadge}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-black text-[#1E3328] mt-3 sm:mt-4">
              {t.journeyTitle}
            </h2>
            <div className="w-8 sm:w-12 h-1 bg-[#0F5E3D] mx-auto mt-3 sm:mt-4 rounded-full" />
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[4px] bg-[#0F5E3D]/10 -translate-x-1/2 rounded-full hidden md:block" />
            <div className="absolute left-4 top-0 bottom-0 w-[4px] bg-[#0F5E3D]/10 -translate-x-1/2 rounded-full md:hidden" />

            <div className="space-y-16">
              {(() => {
                const milestoneImages = ["/freshman.jpg", "/food-lab.jpg", "/food-intern.jpg", "/graduation.jpg"];
                const milestoneAlts = ["Freshman Year Milestone", "Food Chemistry Lab", "Food Processing Internship", "Graduation Day"];
                return t.milestones.map((milestone, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div key={idx} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch md:justify-between relative`}>
                      <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#0F5E3D] border-4 border-[#F4F9F5] -translate-x-1/2 flex items-center justify-center shadow-md z-20">
                        <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="pl-12 md:pl-0 md:w-[45%] flex flex-col"
                      >
                        <div className="clay-card p-4 sm:p-6 bg-white flex flex-col justify-between flex-1">
                          <div>
                            <span className="text-[#0F5E3D] text-xs sm:text-sm font-extrabold tracking-wider">{milestone.year}</span>
                            <h3 className="font-serif text-lg sm:text-2xl font-extrabold text-[#1E3328] mt-1.5 mb-3 sm:mb-4">{milestone.title}</h3>
                            <ul className="space-y-2.5 sm:space-y-3">
                              {milestone.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2.5 text-zinc-700 text-xs sm:text-sm leading-relaxed font-medium">
                                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F5E3D] mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Milestone Image */}
                          <div className="relative h-40 sm:h-48 w-full rounded-2xl overflow-hidden glass-card p-1 mt-4">
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                              <Image
                                src={milestoneImages[idx] || milestoneImages[0]}
                                alt={milestoneAlts[idx] || "Milestone"}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <div className="hidden md:block md:w-[45%]" />
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Guestbook & Thank You Section */}
      <section className="relative w-full max-w-6xl mx-auto px-3 sm:px-4 py-12 sm:py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          {/* Guestbook Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 clay-card p-6 sm:p-8 md:p-10 bg-white"
          >
            <span className="text-[#0F5E3D] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 block">{t.guestbookBadge}</span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1E3328] mb-4 sm:mb-6">
              {t.guestbookTitle}
            </h2>

            <form onSubmit={handleWishSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="guestName" className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                  {t.nameLabel}
                </label>
                <input
                  id="guestName"
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0F5E3D]/20 focus:border-[#0F5E3D] bg-[#FAFAFA] text-[#1E3328] text-sm transition-all shadow-inner"
                />
              </div>

              <div>
                <label htmlFor="guestWish" className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                  {t.wishLabel}
                </label>
                <textarea
                  id="guestWish"
                  required
                  rows={4}
                  placeholder={t.wishPlaceholder}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0F5E3D]/20 focus:border-[#0F5E3D] bg-[#FAFAFA] text-[#1E3328] text-sm transition-all shadow-inner resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-3d-orange w-full py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer touch-manipulation"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-green-200" /> {t.submitSuccess}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {t.submitButton}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Wishes Display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col h-full justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6 px-1 flex-wrap">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F5E3D] flex-shrink-0" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3328]">{t.wishesFromEveryone}</h3>
                <span className="text-[10px] sm:text-xs bg-[#0F5E3D]/10 text-[#0F5E3D] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold">
                  {wishes.length}
                </span>
              </div>

              {/* 3D Flip Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
                <AnimatePresence initial={false}>
                  {wishes.map((item) => {
                    const isFlipped = item.id ? !!flippedCards[item.id] : false;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="perspective-1000 h-48 sm:h-52 w-full cursor-pointer group"
                        onClick={() => handleCardClick(item.id)}
                      >
                        <div className={`w-full h-full relative preserve-3d duration-500 transition-transform ${
                          isFlipped ? "rotate-y-180" : ""
                        }`}>
                          {/* Card Front */}
                          <div className={`absolute inset-0 backface-hidden rounded-2xl p-3 sm:p-5 flex flex-col justify-between border border-zinc-200/40 shadow-md ${getCardColor(wishes.indexOf(item))} hover:shadow-lg transition-shadow duration-300`}>
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-serif text-sm sm:text-base font-bold text-[#1E3328] truncate">
                                  {item.name}
                                </span>
                                <span className="text-[8px] sm:text-[10px] text-zinc-400 bg-white/60 px-1.5 sm:px-2 py-0.5 rounded border border-zinc-100 flex-shrink-0 whitespace-nowrap">
                                  {formatDateFromDatabase(item.created_at)}
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-zinc-500 line-clamp-3 sm:line-clamp-4 mt-2 sm:mt-3 leading-relaxed">
                                {item.wishes}
                              </p>
                            </div>
                            <div className="flex justify-between items-center text-[8px] sm:text-[10px] text-[#0F5E3D] font-bold mt-2 pt-2 border-t border-zinc-100/60 gap-1">
                              <span className="truncate">{t.flipToSee}</span>
                              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            </div>
                          </div>

                          {/* Card Back (Flipped) */}
                          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0F5E3D] text-[#F4F9F5] rounded-2xl p-3 sm:p-6 flex flex-col justify-between border border-white/10 shadow-lg">
                            <div className="overflow-y-auto max-h-32 sm:max-h-36 pr-1 custom-scrollbar">
                              <p className="font-serif text-xs sm:text-sm italic font-light leading-relaxed">
                                &ldquo;{item.wishes}&rdquo;
                              </p>
                            </div>
                            <div className="text-right border-t border-white/10 pt-2 sm:pt-2.5 mt-2 flex justify-between items-center gap-1">
                              <span className="text-[8px] sm:text-[10px] text-white/50">{t.flipBack}</span>
                              <span className="font-serif text-[10px] sm:text-xs font-bold text-white tracking-wide truncate">
                                — {item.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Thank You Note & Heart Button */}
            <div className="mt-10 sm:mt-14 p-4 sm:p-6 md:p-8 rounded-3xl bg-[#0F5E3D]/4 border border-[#0F5E3D]/15 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              {/* Floating interactive 3D heart button */}
              <motion.div 
                whileHover={{ scale: 1.25, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center cursor-pointer text-[#EE6C25] border border-[#0F5E3D]/10 flex-shrink-0 touch-manipulation"
                title={t.heartTitle}
                onClick={() => {
                  confetti({
                    particleCount: 40,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ["#0F5E3D", "#EE6C25", "#F4F9F5"]
                  });
                  confetti({
                    particleCount: 40,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ["#0F5E3D", "#EE6C25", "#F4F9F5"]
                  });
                }}
              >
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-[#EE6C25] text-[#EE6C25] animate-pulse" />
              </motion.div>

              <div>
                <p className="text-zinc-600 text-xs sm:text-sm italic leading-relaxed text-center sm:text-left">
                  {t.thankYouQuote}
                </p>
                <div className="mt-3 sm:mt-4 flex justify-center sm:justify-end">
                  <div className="text-right">
                    <span className="font-serif text-base sm:text-lg font-bold text-[#EE6C25] tracking-wide block">
                      Phan Ngọc Ý Mỹ
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-zinc-400 uppercase tracking-widest">
                      {t.graduation2026}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 sm:py-8 px-3 sm:px-4 text-center text-zinc-400 text-[10px] sm:text-xs border-t border-zinc-200/50 mt-12 sm:mt-16 bg-white/30 backdrop-blur z-10 relative">
        <p className="font-medium text-zinc-500 text-[10px] sm:text-xs">
          {t.footerCopyright}
        </p>
        <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-1">
          {t.footerSchool}
        </p>
      </footer>
    </div>
  );
}
