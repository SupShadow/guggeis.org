import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  candidateImageSrc: string;
  supporterCount: number;
}

export const HeroMotion: React.FC<HeroProps> = ({ candidateImageSrc, supporterCount }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [daysUntilElection, setDaysUntilElection] = useState<number | null>(null);

  // Calculate countdown
  useEffect(() => {
    const wahltermin = new Date('2026-03-08T00:00:00');
    const jetzt = new Date();
    const diff = wahltermin.getTime() - jetzt.getTime();
    const tage = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (tage > 0) setDaysUntilElection(tage);
  }, []);

  // Parallax Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Different velocities for depth perception
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const rotateDivider = useTransform(scrollYProgress, [0, 1], [-2, 0]);

  // Animation Variants for "The Stamp" entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 80, opacity: 0, skewY: 3 },
    visible: {
      y: 0,
      opacity: 1,
      skewY: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section ref={ref} className="relative bg-sand overflow-hidden">
      {/* Background Typography Texture (Huge & Subtle) */}
      <motion.div
        style={{ y: yText }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-[0.03] select-none"
      >
        <h2 aria-hidden="true" className="text-[20vw] font-headline font-black uppercase text-primary leading-none tracking-tighter text-center whitespace-nowrap">
          Mutig
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-5rem)]">
          {/* Text Content */}
          <motion.div
            className="flex flex-col justify-center px-6 py-8 lg:py-20 lg:px-12 order-2 lg:order-1 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-block px-3 py-1 bg-accent-teal text-white text-sm font-bold tracking-widest uppercase">
                Wahl 2026
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-headline text-primary mb-3 lg:mb-4 leading-none"
            >
              <span className="sr-only">Julian Guggeis: </span>Straubing<br />
              <span className="text-dark">kann mehr.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-sm sm:text-base text-dark/80 font-medium mb-4 lg:mb-5">
              <span className="text-primary">Julian Guggeis</span> · Kandidat für den Stadtrat 2026<br className="sm:hidden" />
              <span className="hidden sm:inline"> · </span>SPD Listenplatz 11
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-gray max-w-lg mb-3 lg:mb-4 leading-relaxed border-l-4 border-primary pl-6"
            >
              Ich kämpfe für bezahlbare Wohnungen, Busse die auch abends fahren,
              und eine Innenstadt, die wieder lebt. <strong className="text-dark">Dafür trete ich an.</strong>
            </motion.p>

            <motion.p variants={itemVariants} className="text-sm sm:text-base text-primary font-headline uppercase tracking-wide mb-4">
              Bereit für den Wandel. Bereit für 2026.
            </motion.p>

            {/* Countdown */}
            <motion.div variants={itemVariants} className="mb-4 lg:mb-8 p-3 lg:p-4 bg-white/80 backdrop-blur-sm inline-block">
              <p className="text-xs lg:text-sm text-gray mb-1">Noch</p>
              <p className="text-xl lg:text-2xl font-headline text-primary">
                {daysUntilElection ?? '---'} Tage bis zur Wahl
              </p>
              <p className="text-xs text-gray/70 mt-1">8. März 2026</p>
            </motion.div>

            {/* Supporter Count */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-center gap-3 text-dark">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-sand flex items-center justify-center">
                      <span className="text-xs" aria-hidden="true">&#x1F464;</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm">
                  <strong className="text-primary">{supporterCount}+</strong> Unterstützer:innen
                </p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pb-4">
              <a
                href="#kontakt"
                className="group relative px-8 py-4 bg-primary text-white font-headline uppercase tracking-wider overflow-hidden min-h-[44px] inline-flex items-center justify-center transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="relative z-10 group-hover:text-primary transition-colors duration-300">Schreib mir</span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out skew-x-12 origin-left" />
              </a>
              <a
                href="#themen"
                className="px-8 py-4 border-2 border-primary text-primary font-headline uppercase tracking-wider hover:bg-primary hover:text-white transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center"
              >
                Meine 5 Versprechen
              </a>
            </motion.div>
          </motion.div>

          {/* Image with Mutig-Winkel */}
          <motion.div
            className="relative order-1 lg:order-2 h-[35vh] sm:h-[40vh] lg:h-auto"
            style={{ y: yImage }}
          >
            <div className="absolute inset-0 hero-image-clip">
              <img
                src={candidateImageSrc}
                alt="Julian Guggeis spricht vor Publikum – Kandidat für den Stadtrat Straubing 2026"
                className="w-full h-full object-cover object-[center_30%] lg:object-center"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sand/30 via-transparent to-transparent lg:bg-gradient-to-l" />
            </div>

            {/* Floating Date Badge */}
            <motion.div
              className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 z-30 bg-white p-4 lg:p-6 shadow-xl"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: -3 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
            >
              <p className="font-headline font-black text-3xl lg:text-4xl text-primary leading-none">08.03.</p>
              <p className="font-body font-bold text-dark text-xs lg:text-sm uppercase mt-1">Stadtratswahl</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll-Down Indicator */}
      <a
        href="#manifest"
        className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce-scroll hidden lg:flex flex-col items-center text-dark/80 hover:text-primary transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full"
        aria-label="Zum nächsten Abschnitt scrollen"
      >
        <span className="text-xs uppercase tracking-widest mb-2">Mehr erfahren</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>

      {/* Angled bottom edge */}
      <motion.div
        style={{ rotate: rotateDivider }}
        className="absolute bottom-0 left-0 right-0 h-16 bg-white transform origin-bottom-left translate-y-8 scale-110"
      />
    </section>
  );
};

export default HeroMotion;
