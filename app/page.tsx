"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 150;

  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();

  // Lógica de Scroll Suavizado (Lerp)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    let targetTime = 0;
    let currentTime = 0;
    const friction = 0.08; // Valor ideal para sensação de luxo e fluidez

    const render = () => {
      if (video.duration) {
        currentTime += (targetTime - currentTime) * friction;
        video.currentTime = currentTime;
      }
      requestAnimationFrame(render);
    };

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (video.duration) {
        targetTime = latest * video.duration;
      }
    });

    const raf = requestAnimationFrame(render);

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
    };
  }, [scrollYProgress]);

  const containerRef = useRef(null);
  const { scrollYProgress: sectionScroll } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(sectionScroll, [0, 1], ["-15%", "15%"]);

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-x-hidden selection:bg-accent selection:text-white">
      
      {/* --- CART --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] cursor-pointer"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-surface z-[101] p-12 flex flex-col border-l border-white/5"
            >
              <div className="flex justify-between items-center mb-16">
                <h3 className="font-display text-2xl italic text-primary">Your Selection</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-muted hover:text-accent transition-colors text-xs uppercase tracking-widest">Close</button>
              </div>
              {/* Cart Content... */}
              <div className="flex gap-6 pb-8 border-b border-white/5">
                <div className="w-24 h-32 bg-background border border-white/5 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-muted uppercase tracking-tighter italic font-display">Água.</span>
                </div>
                <div className="flex flex-col justify-between py-2 w-full">
                  <div>
                    <h4 className="font-display text-lg text-primary mb-1 italic">Água. Elixir No. 1</h4>
                    <p className="text-muted text-[10px] uppercase tracking-widest font-body">750ml • Limited</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-white/10 px-3 py-1 gap-4 font-body">
                      <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="text-muted">-</button>
                      <span className="text-xs">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-muted">+</button>
                    </div>
                    <span className="text-primary font-body text-sm">${(quantity * unitPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button className="mt-auto w-full py-5 bg-accent text-white font-body text-[10px] uppercase tracking-[0.3em] font-bold">Complete Acquisition</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HERO / VIDEO SECTION --- */}
      <section className="min-h-[300vh] relative flex flex-col items-center">
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-background">
          <motion.video
            ref={videoRef}
            muted playsInline preload="auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="w-full h-full object-contain"
          >
            <source src="/AguaShot.mp4" type="video/mp4" />
          </motion.video>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40"></div>
        </div>

        <motion.nav 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
          className="fixed top-0 w-full p-8 flex justify-end z-20"
        >
          <button className="text-primary font-body text-xs uppercase tracking-[0.2em] hover:text-accent transition-colors">Discover</button>
        </motion.nav>

        <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center z-10 px-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }} className="text-accent font-body tracking-[0.3em] text-[10px] uppercase mb-6 font-medium">The Essence of Purity</motion.p>
          <motion.h1 initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 2.5 }} className="text-primary font-display text-7xl md:text-9xl italic mb-8 tracking-wider">Água.</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }} className="text-muted font-body max-w-md mx-auto leading-loose mb-12 text-xs tracking-wide">Drawn from the deepest springs. A crystalline elixir for the bold.</motion.p>
          <motion.button onClick={() => setIsCartOpen(true)} className="group relative px-10 py-4 border border-surface hover:border-accent transition-colors">
            <div className="absolute inset-0 w-0 bg-accent transition-all duration-500 group-hover:w-full"></div>
            <span className="relative text-primary font-body text-xs uppercase tracking-[0.2em] group-hover:text-white">Acquire Exclusivity</span>
          </motion.button>
        </div>
      </section>

      {/* --- SECTION 2: THE COMPOSITION --- */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10 border-t border-surface/30 bg-background">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-primary font-display text-4xl italic mb-6">The Composition.</h2>
            <div className="h-[1px] w-12 bg-accent mb-8"></div>
            <p className="text-muted font-body leading-loose text-sm mb-6">Filtered through volcanic rock for decades.</p>
          </motion.div>
          <div ref={containerRef} className="h-[260px] w-full border border-surface relative overflow-hidden bg-black">
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[130%] -top-[15%] bg-[url('/agua2.png')] bg-contain bg-center bg-no-repeat opacity-80" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-surface/30 py-16 flex flex-col items-center bg-background z-10">
        <h2 className="text-primary font-display text-3xl italic mb-8">Água.</h2>
        <a href="https://www.linkedin.com/in/leonardo-gaertner-93a087245/" target="_blank" className="text-muted font-body text-[10px] uppercase tracking-[0.3em] hover:text-accent mb-12">LinkedIn</a>
        <p className="text-muted/40 font-body text-[9px] uppercase tracking-[0.4em] text-center">Engineered & Designed by<br/><span className="text-muted/80 mt-2 block uppercase">Leonardo Gaertner</span></p>
      </footer>
    </main>
  );
}