"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image"; // Importante para performance no Next.js

export default function Home() {
  // --- ESTADOS DO CARRINHO ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 150;

  // --- LÓGICA DE VÍDEO CONTROLADO PELO SCROLL (LERP) ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    let targetTime = 0;
    let currentTime = 0;
    const friction = 0.12; 

    const render = () => {
      if (video.duration) {
        currentTime += (targetTime - currentTime) * friction;
        if (Math.abs(currentTime - targetTime) < 0.001) {
          currentTime = targetTime;
        }
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

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-x-hidden selection:bg-accent selection:text-white">
      
      {/* --- OFF-CANVAS CART --- */}
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

              {/* ITEM DO CARRINHO COM AGUA2.PNG */}
              <div className="flex gap-6 pb-8 border-b border-white/5">
                <div className="w-24 h-32 bg-background border border-white/5 relative overflow-hidden shrink-0">
                  <Image 
                    src="/agua4.png" 
                    alt="Água. Elixir No. 1" 
                    fill 
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex flex-col justify-between py-2 w-full">
                  <div>
                    <h4 className="font-display text-lg text-primary mb-1 italic">Água. Elixir No. 1</h4>
                    <p className="text-muted text-[10px] uppercase tracking-widest font-body">750ml • Limited Edition</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 font-body">
                    <div className="flex items-center border border-white/10 px-3 py-1 gap-4">
                      <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="text-muted">-</button>
                      <span className="text-xs">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-muted">+</button>
                    </div>
                    <span className="text-primary text-sm">${(quantity * unitPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button className="mt-auto w-full py-5 bg-accent text-white font-body text-[10px] uppercase tracking-[0.3em] font-bold">Complete Acquisition</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HERO / VIDEO SECTION --- */}
      <section className="min-h-[350vh] relative flex flex-col items-center">
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-background">
          <motion.video
            ref={videoRef}
            muted playsInline preload="auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="w-full h-full object-contain"
            style={{ willChange: "transform, contents", transform: "translateZ(0)" }}
          >
            <source src="/AguaShot_smooth.mp4" type="video/mp4" />
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }} className="text-muted font-body max-w-md mx-auto leading-loose mb-12 text-xs tracking-wide">Drawn from the deepest springs. A crystalline elixir crafted for those who seek the perfect balance.</motion.p>
          <motion.button onClick={() => setIsCartOpen(true)} className="group relative px-10 py-4 border border-surface hover:border-accent transition-colors">
            <div className="absolute inset-0 w-0 bg-accent transition-all duration-500 group-hover:w-full"></div>
            <span className="relative text-primary font-body text-xs uppercase tracking-[0.2em] group-hover:text-white">Acquire Exclusivity</span>
          </motion.button>
        </div>
      </section>

      {/* --- SEÇÃO 2: THE COMPOSITION --- */}
      <section className="min-h-screen flex items-center justify-center px-6 py-32 relative z-10 bg-background border-t border-surface/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-surface rounded-full blur-[120px] opacity-20 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-primary font-display text-5xl md:text-7xl italic mb-12 tracking-wide leading-tight">
              The<br/>Composition.
            </h2>
            <div className="h-[1px] w-16 bg-accent mx-auto mb-16 opacity-60"></div>
            <div className="space-y-8 text-muted font-body leading-loose text-sm md:text-base tracking-wide max-w-xl mx-auto text-balance">
              <p>Far beyond hydration. Our mineral blend is extracted from deep artisan springs, filtered through volcanic rock for decades.</p>
              <p>Featuring crystalline top notes, a slightly alkaline body, and an absurdly clean finish. Bottled at the source to preserve the signature of a true classic.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-surface/10 py-20 flex flex-col items-center bg-background z-10 relative">
        <h2 className="text-primary font-display text-4xl italic mb-10 tracking-wider">Água.</h2>
        <a href="https://www.linkedin.com/in/leonardo-gaertner-93a087245/" target="_blank" rel="noopener noreferrer" className="text-muted font-body text-[11px] uppercase tracking-[0.4em] hover:text-accent transition-colors duration-300 mb-16">LinkedIn</a>
        <p className="text-muted/30 font-body text-[10px] uppercase tracking-[0.5em] text-center leading-relaxed">
          Engineered & Designed by<br/>
          <span className="text-muted/70 mt-3 block uppercase font-medium">Leonardo Gaertner</span>
        </p>
      </footer>
    </main>
  );
}