import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { HERO_SLIDES } from '../data/mockData';

interface HeroCarouselProps {
  onSelectCourse: (courseId: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onSelectCourse,
  onNavigateSection,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  const handleAction = () => {
    if (slide.actionType === 'course') {
      onSelectCourse(slide.targetId);
    } else {
      onNavigateSection(slide.targetId);
    }
  };

  const handleSecondaryAction = () => {
    if (slide.actionType === 'course') {
      onSelectCourse(slide.targetId);
    } else {
      onNavigateSection(slide.targetId);
    }
  };

  return (
    <section
      className="relative bg-slate-900 text-white overflow-hidden shadow-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Banners principales de convocatorias y servicios"
    >
      <div className="relative min-h-[420px] md:min-h-[480px] lg:min-h-[520px] flex items-center">
        {/* Background Image with Dark Gradient Scrim */}
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
          />
          {/* Multi-layered scrim for optimal contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30"></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full z-10">
          <div className="max-w-2xl">
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 tracking-wider mb-3 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-sm border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{slide.kicker}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4 text-balance">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200 line-clamp-3 mb-6 max-w-xl font-normal leading-relaxed">
              {slide.description}
            </p>

            {/* Feature Tag */}
            <div className="flex items-center gap-2 text-xs text-emerald-300 mb-8 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{slide.tag}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#D92525] hover:bg-red-700 text-white font-bold text-sm shadow-lg transition-transform active:scale-95"
              >
                <span>{slide.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSecondaryAction}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-xs border border-white/20 transition-colors"
              >
                <span>{slide.secondaryText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/10 z-20"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/10 z-20"
          aria-label="Slide siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators / Tabs */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
