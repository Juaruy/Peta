"use client";

// ==========================================================================
// LENIS CONTEXT
// ==========================================================================
//
// APA ITU LENIS?
// ---------------
// Lenis adalah library smooth-scroll untuk web. Dia mengambil alih event
// scroll (wheel/touch), lalu menggerakkan `window.scrollY` secara manual
// dengan easing yang halus (bukan scroll native yang langsung pindah).
//
// KENAPA PERLU CONTEXT?
// ---------------------
// Sebelumnya, instance `Lenis` dibuat secara lokal di dalam komponen
// `StackedScroll`. Masalahnya, tombol "GO UP" di footer (ContactSection)
// juga butuh akses ke instance Lenis yang SAMA supaya scroll-to-top-nya
// mulus dan konsisten dengan smooth-scroll global.
//
// Dengan React Context kita menaruh instance Lenis di satu tempat (provider)
// yang membungkus seluruh aplikasi, lalu komponen mana pun bisa memanggil
// `useLenis()` untuk mendapat instance yang sama.
//
// CARA PAKAI
// ------------
// 1. Bungkus aplikasi dengan `<LenisProvider>` (di `app/layout.tsx`).
// 2. Di komponen yang butuh scroll programatik:
//      const lenis = useLenis();
//      lenis?.scrollTo(0, { duration: 1.8 });
// ==========================================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Lenis from "lenis";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Context menyimpan instance Lenis. Nilai awalnya `null` (belum dibuat).
const LenisContext = createContext<Lenis | null>(null);

// Hook yang dipakai komponen lain untuk mengambil instance Lenis.
// Karena provider mungkin belum siap (mis. di SSR), kembalikan `null`
// sehingga pemanggil harus guard: `lenis?.scrollTo(...)`.
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

type LenisProviderProps = {
  children: ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  // Simpan instance di state. Initializer useState hanya dijalankan SATU
  // KALI saat komponen mount (dan sekali lagi saat hydration di client),
  // sehingga Lenis tidak dibuat duplikat tiap re-render.
  //
  // Guard `typeof window` penting: saat SSR/hydration server tidak ada
  // browser API, jadi kita beri `null` dan baru buat instance di client.
  const [lenis] = useState<Lenis | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new Lenis({
      // Durasi animasi scroll (detik). Lebih besar = lebih lambat/lambat.
      duration: 1.35,
      // Easing untuk gerakan scroll (easeOut quart = berhenti perlahan).
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      // Aktifkan smoothing untuk scroll mouse/wheel.
      smoothWheel: true,
      // Skala kecepatan scroll wheel (0.85 = sedikit lebih pelan dari native).
      wheelMultiplier: 0.85,
      // Skala kecepatan scroll sentuh (touch).
      touchMultiplier: 1.5,
      // Jangan sinkronkan dengan touch native (biar Lenis yang pegang).
      syncTouch: false,
      // Matikan auto-raf; kita kendalikan RAF sendiri lewat gsap.ticker
      // supaya sinkron dengan GSAP ScrollTrigger.
      autoRaf: false,
    });
  });

  // Effect untuk menghubungkan Lenis dengan GSAP ScrollTrigger.
  useEffect(() => {
    if (!lenis) return;

    // Setiap Lenis menggerakkan scroll, beri tahu ScrollTrigger agar posisi
    // trigger-nya ikut terupdate mengikuti scroll manual dari Lenis.
    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleLenisScroll);

    // Jalankan Lenis pada setiap frame GSAP ticker. Ini yang membuat
    // smooth-scroll berjalan, dan karena satu ticker dengan ScrollTrigger,
    // keduanya tetap sinkron (tidak ada geser/gagap antar keduanya).
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    // Cleanup saat provider unmount: lepas event & destroy instance.
    return () => {
      lenis.off("scroll", handleLenisScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [lenis]);

  // `lenis` berasal dari useState, jadi nilainya stabil (tidak berubah antar
  // re-render). Langsung pakai sebagai value context.
  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
