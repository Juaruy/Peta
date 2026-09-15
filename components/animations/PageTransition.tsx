"use client";

import { useEffect, useRef } from "react";

import { usePathname, useRouter } from "next/navigation";

import gsap from "gsap";

const TRANSITION_EVENT = "next-project-navigation";
const TRANSITION_STORAGE_KEY = "project-page-transition";

type NavigationDetail = {
  href: string;
};

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  const router = useRouter();
  const pathname = usePathname();

  /* =========================================================
     ENTER TRANSITION
     ========================================================= */

  useEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) {
      return;
    }

    const shouldAnimateIn =
      sessionStorage.getItem(TRANSITION_STORAGE_KEY) === "true";

    if (!shouldAnimateIn) {
      gsap.set(overlay, {
        xPercent: 100,
      });

      return;
    }

    sessionStorage.removeItem(TRANSITION_STORAGE_KEY);

    /*
     * Route baru selalu dimulai dari atas.
     */

    window.scrollTo(0, 0);

    gsap.killTweensOf(overlay);

    gsap.set(overlay, {
      xPercent: 100,
    });

    /*
     * Overlay hanya menjadi finishing transition.
     *
     * Masuk dari kanan → keluar ke kiri.
     */

    gsap.to(overlay, {
      xPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",

      onComplete: () => {
        gsap.set(overlay, {
          xPercent: 100,
        });

        isTransitioningRef.current = false;
      },
    });
  }, [pathname]);

  /* =========================================================
     OUTGOING TRANSITION
     ========================================================= */

  useEffect(() => {
    const handleNavigation = (event: Event) => {
      const customEvent = event as CustomEvent<NavigationDetail>;

      const href = customEvent.detail?.href;

      if (!href) {
        return;
      }

      if (isTransitioningRef.current) {
        return;
      }

      if (href === pathname) {
        return;
      }

      const overlay = overlayRef.current;

      if (!overlay) {
        router.push(href);

        return;
      }

      isTransitioningRef.current = true;

      /*
       * Tandai bahwa route berikutnya datang dari
       * horizontal Next Project transition.
       */

      sessionStorage.setItem(TRANSITION_STORAGE_KEY, "true");

      /*
       * Prefetch halaman berikutnya.
       */

      router.prefetch(href);

      /*
       * Stop vertical scrolling sebentar ketika
       * route transition dimulai.
       */

      document.body.style.overflow = "hidden";

      gsap.killTweensOf(overlay);

      gsap.set(overlay, {
        xPercent: 100,
      });

      /*
       * Horizontal slide masuk.
       */

      gsap.to(overlay, {
        xPercent: 0,
        duration: 0.65,
        ease: "power4.inOut",

        onComplete: () => {
          router.push(href, {
            scroll: false,
          });
        },
      });
    };

    window.addEventListener(TRANSITION_EVENT, handleNavigation);

    return () => {
      window.removeEventListener(TRANSITION_EVENT, handleNavigation);

      document.body.style.overflow = "";

      gsap.killTweensOf(overlayRef.current);
    };
  }, [pathname, router]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        z-[9999]
        translate-x-full
        transform-gpu
        bg-[#111111]
        will-change-transform
      "
    />
  );
}
