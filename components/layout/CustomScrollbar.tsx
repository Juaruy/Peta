"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function CustomScrollbar() {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);

  const [dimensions, setDimensions] = useState({
    travelDistance: 0,
    thumbHeight: 28,
  });

  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartProgress = useRef(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ==========================================================================
     GET MAX SCROLL
     ========================================================================== */

  const getMaxScroll = useCallback(() => {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
  }, []);

  /* ==========================================================================
     UPDATE PROGRESS
     ========================================================================== */

  const updateProgress = useCallback(() => {
    const maxScroll = getMaxScroll();

    if (maxScroll <= 0) {
      setProgress(0);
      return;
    }

    const scrollTop = window.scrollY;

    const nextProgress = scrollTop / maxScroll;

    setProgress(Math.min(Math.max(nextProgress, 0), 1));
  }, [getMaxScroll]);

  /* ==========================================================================
     SHOW SCROLLBAR
     ========================================================================== */

  const showScrollbar = useCallback(() => {
    setIsScrolling(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isDragging.current) {
        setIsScrolling(false);
      }
    }, 700);
  }, []);

  /* ==========================================================================
     SCROLL EVENT
     ========================================================================== */

  useEffect(() => {
    const handleScroll = () => {
      updateProgress();
      showScrollbar();
    };

    const handleResize = () => {
      updateProgress();
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    const initialUpdate = requestAnimationFrame(updateProgress);

    const initialHideTimeout = setTimeout(() => {
      setIsScrolling(false);
    }, 700);

    return () => {
      cancelAnimationFrame(initialUpdate);

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      clearTimeout(initialHideTimeout);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateProgress, showScrollbar]);

  /* ==========================================================================
     UPDATE THUMB DIMENSIONS
     ========================================================================== */

  useEffect(() => {
    const scrollbar = scrollbarRef.current;
    const thumb = thumbRef.current;

    if (!scrollbar || !thumb) return;

    const updateDimensions = () => {
      const scrollbarHeight = scrollbar.clientHeight;
      const thumbHeight = thumb.offsetHeight;

      const travelDistance = Math.max(0, scrollbarHeight - thumbHeight);

      setDimensions({
        travelDistance,
        thumbHeight,
      });
    };

    const observer = new ResizeObserver(updateDimensions);

    observer.observe(scrollbar);
    observer.observe(thumb);

    updateDimensions();

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ==========================================================================
     DRAG START
     ========================================================================== */

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    isDragging.current = true;

    dragStartY.current = e.clientY;
    dragStartProgress.current = progress;

    setIsScrolling(true);

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  /* ==========================================================================
     DRAG MOVE
     ========================================================================== */

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const { travelDistance } = dimensions;

    if (travelDistance <= 0) return;

    const deltaY = e.clientY - dragStartY.current;

    const deltaProgress = deltaY / travelDistance;

    const nextProgress = dragStartProgress.current + deltaProgress;

    const clampedProgress = Math.min(Math.max(nextProgress, 0), 1);

    setProgress(clampedProgress);

    const maxScroll = getMaxScroll();

    window.scrollTo({
      top: clampedProgress * maxScroll,
      behavior: "auto",
    });
  };

  /* ==========================================================================
     DRAG END
     ========================================================================== */

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 700);
  };

  /* ==========================================================================
     THUMB POSITION
     ========================================================================== */

  const thumbPosition = progress * dimensions.travelDistance;

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <div
      ref={scrollbarRef}
      className={`custom-scrollbar ${
        isScrolling ? "custom-scrollbar--visible" : ""
      }`}
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        className="custom-scrollbar__thumb"
        style={{
          transform: `translateY(${thumbPosition}px)`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
}
