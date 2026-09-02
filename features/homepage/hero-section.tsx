"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);

  /* ================================================================
     AUTO HIDE TEXT
     Text akan hilang setelah 3 detik ketika tidak di-hover.
     ================================================================ */

  useEffect(() => {
    if (isTextHovered || !isTextVisible) return;

    const timer = setTimeout(() => {
      setIsTextVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isTextHovered, isTextVisible]);

  /* ================================================================
     HERO SCROLL TRIGGER
     Ketika user kembali ke hero, text muncul lagi.
     ================================================================ */

  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTextVisible(true);
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hero"
      className="
        relative
        h-screen
        w-screen
        bg-black
        px-6
        py-12
        text-white
        md:px-12
        md:py-12
        lg:px-16
        lg:py-32
      "
    >
      {/* BACKGROUND VIDEO */}

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="
          absolute
          inset-0
          z-0
          h-full
          w-full
          object-cover
          grayscale
        "
      >
        <source src="/aboutyou.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          bg-black/45
        "
      />

      {/* BOTTOM FADE */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-10
          h-[35%]
          bg-gradient-to-t
          from-black
          via-black/60
          to-transparent
        "
      />

      {/* HERO CONTENT */}

      <div
        className="
          pointer-events-none
          relative
          z-20
          flex
          h-full
          w-full
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        {/* TEXT */}

        <motion.div
          onMouseEnter={() => {
            setIsTextHovered(true);
            setIsTextVisible(true);
          }}
          onMouseLeave={() => {
            setIsTextHovered(false);
          }}
          animate={{
            opacity: isTextVisible ? 1 : 0,
          }}
          transition={{
            duration: isTextVisible ? 0.5 : 1,
            ease: "easeInOut",
          }}
          className="
            pointer-events-auto
            cursor-default
          "
        >
          <h1
            className="
              text-5xl
              font-aeonik
              font-medium
              leading-[0.95]
              tracking-[-0.05em]
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
            "
          >
            Hello World!!!
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-base
              font-aeonik
              font-regular
              tracking-[-0.03em]
              sm:text-lg
              md:text-base
            "
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
          </p>
        </motion.div>
      </div>
    </section>
  );
}
