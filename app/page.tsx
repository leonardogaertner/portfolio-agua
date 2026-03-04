"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 150;

  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();

  // Garante que o vídeo tenha opacidade visível desde o início (0.6)
  const videoOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.6, 0.6, 0.3]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const video = videoRef.current;
    
    // Log para depuração no console do navegador (F12)
    if (video) {
      console.log("Tentando carregar vídeo:", video.src);
      video.load(); // Força o carregamento do recurso
    }

    let targetTime = 0;
    let actualTime = 0;
    const friction = 0.15; 

    const render = () => {
      if (video && video.duration && !isNaN(video.duration)) {
        actualTime += (targetTime - actualTime) * friction;
        if (Math.abs(actualTime - targetTime) < 0.0001) {
          actualTime = targetTime;
        }
        video.currentTime = actualTime;
      }
      requestAnimationFrame(render);
    };

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (video && video.duration) {
        targetTime = latest * video.duration;
      }
    });

    const raf = requestAnimationFrame(render);
    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
    };
  }, [isMounted, scrollYProgress]);

  return (
    <main className="min-h-screen bg-black flex flex-col relative overflow-x-hidden selection:bg-accent selection:text-white font-body">
      
      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] cursor-pointer"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-black z-[101] p-12 flex flex-col border-l border-white/5"
            >
              <div className="flex justify-between items-center mb-16 font-display">
                <h3 className="text-2xl italic text-primary">Your Selection</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-muted hover:text-accent transition-colors text-xs uppercase tracking-widest font-body">Close</button>
              </div>

              <div className="flex gap-6 pb-8 border-b border-white/5">
                <div className="w-32 h-24 bg-black border border-white/5 relative overflow-hidden shrink-0">
                  <Image 
                    src="/agua.jpg" 
                    alt="Água" 
                    fill 
                    className="object-cover" 
                    sizes="128px"
                  />
                </div>
                <div className="flex flex-col justify-between py-1 w-full">
                  <h4 className="font-display text-lg text-primary italic">Água.</h4>
                  <div className="flex justify-between items-center mt-4 font-body">
                    <div className="flex items-center border border-white/10 px-3 py-1 gap-4">
                      <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                      <span className="text-xs">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
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

      {/* --- BACKGROUND VÍDEO FIXO (CORRIGIDO) --- */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-black">
        {isMounted && (
          <motion.video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            style={{ 
              opacity: videoOpacity,
              willChange: "transform, contents", 
              transform: "translateZ(0)" 
            }}
            className="w-full h-full object-cover block"
          >
            {/* O arquivo DEVE estar em public/AguaShot_smooth.mp4 */}
            <source src="/AguaShot_smooth.mp4" type="video/mp4" />
          </motion.video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="min-h-[300vh] relative flex flex-col items-center z-10 w-full">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.0 }}
            className="text-accent font-body tracking-[0.3em] text-[10px] uppercase mb-6 font-medium"
          >
            The Essence of Purity
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 1.2, filter: "blur(60px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-primary font-display text-7xl md:text-9xl italic mb-8 tracking-wider"
          >
            Água.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-muted font-body max-w-md mx-auto leading-loose mb-12 text-xs tracking-wide px-4">Drawn from the deepest springs. A crystalline elixir crafted for the bold.</motion.p>
          <motion.button onClick={() => setIsCartOpen(true)} className="group relative px-10 py-4 bg-transparent overflow-hidden border border-white/20 hover:border-accent transition-colors duration-500 cursor-pointer">
            <div className="absolute inset-0 w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full"></div>
            <span className="relative text-primary font-body text-xs uppercase tracking-[0.2em] font-medium group-hover:text-white transition-colors duration-500">Acquire Exclusivity</span>
          </motion.button>
        </div>
      </section>

      {/* --- SEÇÃO 2: THE COMPOSITION --- */}
      <section className="min-h-screen flex items-center justify-center py-32 relative z-10 bg-transparent w-full">
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-primary font-display text-5xl md:text-7xl italic mb-12 tracking-wide drop-shadow-lg">The<br/>Composition.</h2>
            <div className="h-[1px] w-16 bg-accent mx-auto mb-16 opacity-60"></div>
            <p className="text-primary font-body leading-loose text-sm md:text-base tracking-wide max-w-xl mx-auto text-balance drop-shadow-md">Far beyond hydration. Our mineral blend is extracted from deep artisan springs, filtered through volcanic rock for decades.</p>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/5 py-20 flex flex-col items-center bg-black z-20 relative px-4">
        <h2 className="text-primary font-display text-3xl italic mb-8">Água.</h2>
        <a href="https://www.linkedin.com/in/leonardo-gaertner-93a087245/" target="_blank" rel="noopener noreferrer" className="text-muted font-body text-[11px] uppercase tracking-[0.4em] hover:text-accent mb-12">LinkedIn</a>
        <p className="text-muted/40 font-body text-[9px] uppercase tracking-[0.5em] text-center">Engineered & Designed by<br/><span className="text-muted/70 mt-3 block uppercase font-medium">Leonardo Gaertner</span></p>
      </footer>
    </main>
  );
}