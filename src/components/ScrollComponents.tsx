"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp, Home, Info, Layers, Mail } from "lucide-react";
import { useState } from "react";

// Scroll Progress Bar
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-800 origin-left z-50"
      style={{ scaleX }}
    />
  );
};

// Floating "Back to Top" Button
export const FloatingActionButton = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);
  const scale = useTransform(scrollY, [0, 300], [0.8, 1]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <motion.button
      className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-zinc-700 to-zinc-800 text-white rounded-full shadow-lg 
      hover:shadow-xl hover:scale-110 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center 
      z-40 backdrop-blur-sm border border-white/20 transition-all duration-200 cursor-pointer"
      style={{ opacity, scale }}
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
    >
      <ArrowUp className="w-6 h-6" />
    </motion.button>
  );
};

// Floating Navigation
export const FloatingNav = () => {
  const [active, setActive] = useState("home");

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "features", label: "Features", icon: <Layers className="w-5 h-5" /> },
    { id: "about", label: "About", icon: <Info className="w-5 h-5" /> },
    { id: "contact", label: "Contact", icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <motion.nav
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-zinc-900/80 text-white backdrop-blur-md 
      rounded-full shadow-lg flex items-center justify-between px-6 py-3 border border-white/10 z-40 gap-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`flex flex-col items-center justify-center text-xs transition-all duration-200 ${
            active === item.id
              ? "text-white scale-110"
              : "text-zinc-400 hover:text-white hover:scale-105"
          }`}
        >
          {item.icon}
          <span className="text-[10px] mt-1">{item.label}</span>
        </button>
      ))}
    </motion.nav>
  );
};

// Page Utilities Wrapper
export const PageUtilities = () => (
  <>
    <ScrollProgress />
    <FloatingNav />
    <FloatingActionButton />
  </>
);
