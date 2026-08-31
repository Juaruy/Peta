"use client";

import {
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { IonIcon } from "@ionic/react";

import {
  batteryFull,
  cellular,
  chatboxEllipsesOutline,
  headsetOutline,
  listOutline,
  pause,
  play,
  playSkipBack,
  playSkipForward,
  repeat,
  remove,
  search,
} from "ionicons/icons";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";

import NeoButton from "./neo-button";

type SearchResult = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
};

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      medium?: {
        url?: string;
      };
    };
  };
};

type YouTubePlayer = {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId?: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            modestbranding?: number;
            rel?: number;
          };
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
    };
  }
}

// ==========================================================================
// RUNNING TITLE
// ==========================================================================

function RunningTitle({ title, isLight }: { title: string; isLight: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);

  const x = useMotionValue(0);

  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const isRunningRef = useRef(false);
  const isHoveredRef = useRef(false);

  const gap = 56;

  // ------------------------------------------------------------------------
  // MEASURE TEXT
  // ------------------------------------------------------------------------

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const text = textRef.current;

      if (!container || !text) {
        return;
      }

      const containerWidth = container.clientWidth;

      /*
       * Karena textRef sekarang adalah COPY 1,
       * scrollWidth tetap memberikan width asli title.
       */
      const actualTextWidth = text.scrollWidth;

      setTextWidth(actualTextWidth);
      setIsOverflowing(actualTextWidth > containerWidth + 1);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [title]);

  // ------------------------------------------------------------------------
  // RESET WHEN TITLE CHANGES
  // ------------------------------------------------------------------------

  useEffect(() => {
    animationRef.current?.stop();
    animationRef.current = null;

    x.set(0);

    isRunningRef.current = false;
    isHoveredRef.current = false;

    const frame = requestAnimationFrame(() => {
      setIsMarqueeActive(false);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [title, textWidth, x]);

  // ------------------------------------------------------------------------
  // MARQUEE DISTANCE
  // ------------------------------------------------------------------------

  const cycleDistance = textWidth + gap;

  // ------------------------------------------------------------------------
  // SPEED
  // ------------------------------------------------------------------------

  const normalSpeed = 42;
  const hoverSpeed = 18;

  // ------------------------------------------------------------------------
  // START / CONTINUE MARQUEE
  // ------------------------------------------------------------------------

  const startMarquee = useCallback(
    function startMarquee(speed: number) {
      if (cycleDistance <= 0) {
        return;
      }

      const currentX = x.get();

      /*
       * Karena x bergerak:
       *
       * 0 -> -cycleDistance
       *
       * kita normalisasi posisi supaya tidak pernah
       * keluar dari satu cycle.
       */
      let normalizedX = currentX;

      if (Math.abs(normalizedX) >= cycleDistance) {
        normalizedX = 0;
        x.set(0);
      }

      const travelled = Math.abs(normalizedX);

      const remainingDistance = Math.max(0, cycleDistance - travelled);

      if (remainingDistance <= 0.5) {
        x.set(0);

        animationRef.current = null;
        isRunningRef.current = false;
        setIsMarqueeActive(false);

        return;
      }

      isRunningRef.current = true;
      setIsMarqueeActive(true);

      animationRef.current?.stop();

      animationRef.current = animate(x, -cycleDistance, {
        duration: remainingDistance / speed,
        ease: "linear",

        onComplete: () => {
          /*
           * COPY 2 sekarang sudah tepat mengambil posisi
           * COPY 1.
           *
           * Reset tidak terlihat.
           */
          x.set(0);

          animationRef.current = null;
          isRunningRef.current = false;

          /*
           * Ini yang sebelumnya hilang:
           *
           * Setelah satu cycle selesai,
           * marquee berubah menjadi static ellipsis.
           */
          setIsMarqueeActive(false);
        },
      });
    },
    [cycleDistance, x],
  );

  // ------------------------------------------------------------------------
  // AUTO START WHEN OVERFLOWING
  // ------------------------------------------------------------------------

  useEffect(() => {
    if (!isOverflowing || textWidth <= 0) {
      return;
    }

    /*
     * Tunggu satu frame supaya DOM benar-benar
     * sudah menggunakan layout marquee.
     */
    const frame = requestAnimationFrame(() => {
      startMarquee(42);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isOverflowing, textWidth, startMarquee]);

  // ------------------------------------------------------------------------
  // CLEANUP
  // ------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
    };
  }, []);

  // ------------------------------------------------------------------------
  // STATIC TITLE
  // ------------------------------------------------------------------------

  if (!isOverflowing) {
    return (
      <div
        ref={containerRef}
        className="w-full min-w-0 overflow-hidden"
        aria-label={title}
      >
        <span
          ref={textRef}
          className={`
            block
            truncate
            text-[17px]
            font-semibold
            leading-tight
            sm:text-[20px]
            ${isLight ? "text-black" : "text-white"}
          `}
        >
          {title}
        </span>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // HOVER ENTER
  // ------------------------------------------------------------------------

  const handleMouseEnter = () => {
    isHoveredRef.current = true;

    /*
     * Kalau marquee sedang jalan:
     * percepat ke hover speed dari posisi sekarang.
     */
    if (isRunningRef.current) {
      startMarquee(hoverSpeed);
      return;
    }

    /*
     * Kalau marquee sudah selesai / sedang static ellipsis:
     * mulai lagi dari awal.
     */
    startMarquee(hoverSpeed);
  };

  // ------------------------------------------------------------------------
  // HOVER LEAVE
  // ------------------------------------------------------------------------

  const handleMouseLeave = () => {
    isHoveredRef.current = false;

    if (!isRunningRef.current) {
      return;
    }

    /*
     * Tetap lanjut dari posisi sekarang,
     * tapi kembali ke normal speed.
     */
    startMarquee(normalSpeed);
  };

  // ------------------------------------------------------------------------
  // STATIC ELLIPSIS
  // ------------------------------------------------------------------------

  /*
   * Saat marquee tidak aktif:
   *
   * title full tidak ditampilkan.
   *
   * CSS truncate yang menghasilkan "...".
   */
  if (!isMarqueeActive) {
    return (
      <div
        ref={containerRef}
        className="w-full min-w-0 overflow-hidden"
        aria-label={title}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span
          ref={textRef}
          className={`
            block
            truncate
            text-[17px]
            font-semibold
            leading-tight
            sm:text-[20px]
            ${isLight ? "text-black" : "text-white"}
          `}
        >
          {title}
        </span>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // MARQUEE RENDER
  // ------------------------------------------------------------------------

  return (
    <div
      ref={containerRef}
      className="w-full min-w-0 overflow-hidden"
      aria-label={title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="flex w-max items-center"
        style={{
          x,
        }}
      >
        {/* ================================================================
            COPY 1
        ================================================================ */}

        <span
          ref={textRef}
          className={`
            block
            shrink-0
            whitespace-nowrap
            text-[17px]
            font-semibold
            leading-tight
            sm:text-[20px]
            ${isLight ? "text-black" : "text-white"}
          `}
        >
          {title}
        </span>

        {/* ================================================================
            GAP
        ================================================================ */}

        <span
          aria-hidden="true"
          className="block shrink-0"
          style={{
            width: `${gap}px`,
          }}
        />

        {/* ================================================================
            COPY 2
        ================================================================ */}

        <span
          aria-hidden="true"
          className={`
            block
            shrink-0
            whitespace-nowrap
            text-[17px]
            font-semibold
            leading-tight
            sm:text-[20px]
            ${isLight ? "text-black" : "text-white"}
          `}
        >
          {title}
        </span>

        {/* ================================================================
            EXTRA GAP
        ================================================================ */}

        <span
          aria-hidden="true"
          className="block shrink-0"
          style={{
            width: `${gap}px`,
          }}
        />
      </motion.div>
    </div>
  );
}
// ==========================================================================
// MUSIC WAVE ICON
// ==========================================================================

function MusicWaveIcon({ isPlaying }: { isPlaying: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!isPlaying) {
    /*
     * `IonIcon` renders a Stencil `<ion-icon>` web component, yang barunya
     * di-upgrade oleh runtime di sisi client (menambahkan role/class).
     * Kalau di-render saat SSR, attribute itu tidak ada di server HTML
     * sehingga memicu hydration mismatch. Guard `mounted` membuat icon
     * navbar baru dirender setelah mount, menghindari mismatch itu.
     */
    return (
      <motion.span
        className="flex h-[16px] w-[16px] items-center justify-center"
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        {mounted && <IonIcon icon={remove} className="h-[16px] w-[16px]" />}
      </motion.span>
    );
  }

  const bars = [6, 11, 8, 13];

  return (
    <span className="flex h-[16px] w-[16px] items-center justify-center gap-[2px]">
      {bars.map((height, index) => (
        <motion.span
          key={index}
          className="w-[2px] rounded-full bg-current"
          animate={{
            height: [`${height}px`, "4px", `${height}px`],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        />
      ))}
    </span>
  );
}

// ==========================================================================
// TIME FORMATTER
// ==========================================================================

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// ==========================================================================
// ARTWORK COLOR EXTRACTION
// ==========================================================================

function extractArtworkColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.decoding = "async";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d", {
          willReadFrequently: true,
        });

        if (!context) {
          resolve("#7b8790");
          return;
        }

        const size = 32;

        canvas.width = size;
        canvas.height = size;

        context.drawImage(image, 0, 0, size, size);

        const pixels = context.getImageData(0, 0, size, size).data;

        type ColorBucket = {
          count: number;
          r: number;
          g: number;
          b: number;
        };

        const buckets = new Map<string, ColorBucket>();

        for (let i = 0; i < pixels.length; i += 4) {
          const alpha = pixels[i + 3];

          if (alpha < 180) {
            continue;
          }

          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);

          if (max > 245 && min > 235) {
            continue;
          }

          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;

          const key = `${qr},${qg},${qb}`;

          const existing = buckets.get(key);

          if (existing) {
            existing.count += 1;
            existing.r += r;
            existing.g += g;
            existing.b += b;
          } else {
            buckets.set(key, {
              count: 1,
              r,
              g,
              b,
            });
          }
        }

        let winner: ColorBucket | undefined;

        for (const bucket of buckets.values()) {
          if (!winner || bucket.count > winner.count) {
            winner = bucket;
          }
        }

        if (!winner || winner.count === 0) {
          resolve("#7b8790");
          return;
        }

        const r = Math.round(winner.r / winner.count);
        const g = Math.round(winner.g / winner.count);
        const b = Math.round(winner.b / winner.count);

        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch {
        resolve("#7b8790");
      }
    };

    image.onerror = () => {
      resolve("#7b8790");
    };

    image.src = imageUrl;
  });
}

// ==========================================================================
// MUSIC PLAYER
// ==========================================================================

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentSong, setCurrentSong] = useState<SearchResult | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [queue, setQueue] = useState<SearchResult[]>([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  // ========================================================================
  // REAL-TIME CLOCK
  // ========================================================================

  const [currentClock, setCurrentClock] = useState("");

  // ========================================================================
  // ARTWORK COLOR
  // ========================================================================

  const [artworkColor, setArtworkColor] = useState("#7b8790");
  const [artworkIsLight, setArtworkIsLight] = useState(false);

  // ========================================================================
  // REFS
  // ========================================================================

  const playerRef = useRef<YouTubePlayer | null>(null);

  const pendingVideoIdRef = useRef<string | null>(null);

  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchAbortControllerRef = useRef<AbortController | null>(null);

  const queueRef = useRef<SearchResult[]>([]);

  const currentIndexRef = useRef(-1);

  const currentSongRef = useRef<SearchResult | null>(null);

  const isRepeatRef = useRef(false);

  // ========================================================================
  // SYNC REFS
  // ========================================================================

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  // ========================================================================
  // REAL-TIME CLOCK
  // ========================================================================

  useEffect(() => {
    const updateClock = () => {
      const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

      setCurrentClock(formattedTime);
    };

    updateClock();

    const interval = setInterval(updateClock, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ========================================================================
  // ARTWORK COLOR EFFECT
  // ========================================================================

  useEffect(() => {
    if (!currentSong?.thumbnail) {
      return;
    }

    let cancelled = false;

    extractArtworkColor(currentSong.thumbnail).then((color) => {
      if (cancelled) {
        return;
      }

      setArtworkColor(color);

      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

      if (match) {
        const [, r, g, b] = match;

        const luminance =
          (Number(r) * 299 + Number(g) * 587 + Number(b) * 114) / 1000;

        setArtworkIsLight(luminance > 155);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentSong?.thumbnail]);

  // ========================================================================
  // FADE TIMER
  // ========================================================================

  const resetFadeTimer = useCallback(() => {
    setIsPlayerVisible(true);

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    fadeTimeoutRef.current = setTimeout(() => {
      setIsPlayerVisible(false);
    }, 4000);
  }, []);

  // ========================================================================
  // PLAY NEXT SONG
  // ========================================================================

  const playNextSong = useCallback(() => {
    const currentQueue = queueRef.current;
    const currentIdx = currentIndexRef.current;
    const repeat = isRepeatRef.current;

    if (!currentQueue.length) {
      setIsPlaying(false);
      return;
    }

    if (repeat && currentIdx >= 0) {
      const song = currentQueue[currentIdx];

      if (!song) {
        setIsPlaying(false);
        return;
      }

      setCurrentSong(song);
      currentSongRef.current = song;

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);

      playerRef.current?.loadVideoById(song.videoId);
      playerRef.current?.playVideo();

      resetFadeTimer();

      return;
    }

    const nextIndex = currentIdx + 1;

    if (nextIndex >= currentQueue.length) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    const nextSong = currentQueue[nextIndex];

    setCurrentSong(nextSong);
    currentSongRef.current = nextSong;

    setCurrentIndex(nextIndex);
    currentIndexRef.current = nextIndex;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);

    playerRef.current?.loadVideoById(nextSong.videoId);
    playerRef.current?.playVideo();

    resetFadeTimer();
  }, [resetFadeTimer]);

  // ========================================================================
  // LOAD YOUTUBE IFRAME API
  // ========================================================================

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.YT?.Player) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  // ========================================================================
  // CREATE YOUTUBE PLAYER
  // ========================================================================

  useEffect(() => {
    let cancelled = false;

    const createPlayer = () => {
      if (cancelled) {
        return;
      }

      if (!window.YT?.Player) {
        setTimeout(createPlayer, 100);
        return;
      }

      if (playerRef.current) {
        return;
      }

      const playerElement = document.getElementById("youtube-player");

      if (!playerElement) {
        setTimeout(createPlayer, 100);
        return;
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },

        events: {
          onReady: () => {
            if (cancelled) {
              return;
            }

            if (pendingVideoIdRef.current) {
              const videoId = pendingVideoIdRef.current;

              pendingVideoIdRef.current = null;

              playerRef.current?.loadVideoById(videoId);
              playerRef.current?.playVideo();

              setIsPlaying(true);
            }
          },

          onStateChange: (event) => {
            if (cancelled) {
              return;
            }

            if (event.data === 1) {
              setIsPlaying(true);
              resetFadeTimer();
            }

            if (event.data === 2) {
              setIsPlaying(false);
              resetFadeTimer();
            }

            if (event.data === 0) {
              setIsPlaying(false);
              playNextSong();
            }
          },
        },
      });
    };

    createPlayer();

    return () => {
      cancelled = true;
    };
  }, [playNextSong, resetFadeTimer]);

  // ========================================================================
  // PROGRESS UPDATE
  // ========================================================================

  useEffect(() => {
    if (!currentSong) {
      return;
    }

    const interval = setInterval(() => {
      if (!playerRef.current) {
        return;
      }

      try {
        const time = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();

        if (Number.isFinite(time) && Number.isFinite(total)) {
          setCurrentTime(time);
          setDuration(total);
        }
      } catch {
        // Player may not be ready.
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [currentSong]);

  // ========================================================================
  // SEARCH API
  // ========================================================================

  const searchYouTube = useCallback(
    async (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();

      if (!trimmedQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      const controller = new AbortController();

      searchAbortControllerRef.current = controller;

      try {
        setLoading(true);

        const response = await fetch(
          `/api/youtube?q=${encodeURIComponent(trimmedQuery)}`,
          {
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        const mappedResults: SearchResult[] = (
          (data.items as YouTubeSearchItem[] | undefined) || []
        )
          .filter(
            (item) =>
              item.id?.videoId &&
              item.snippet?.title &&
              item.snippet?.channelTitle &&
              item.snippet?.thumbnails?.medium?.url,
          )
          .map((item) => {
            const videoId = item.id!.videoId!;
            const snippet = item.snippet!;
            const thumbnail = snippet.thumbnails!.medium!.url!;

            return {
              videoId,
              title: snippet.title!,
              channelTitle: snippet.channelTitle!,
              thumbnail,
            };
          });

        setResults(mappedResults);

        resetFadeTimer();
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("YouTube search error:", error);

        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [resetFadeTimer],
  );

  // ========================================================================
  // DEBOUNCED SEARCH
  // ========================================================================

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!trimmedQuery) {
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      queueMicrotask(() => {
        setResults([]);
        setLoading(false);
      });

      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchYouTube(trimmedQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, searchYouTube]);

  // ========================================================================
  // MANUAL SEARCH
  // ========================================================================

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchYouTube(trimmedQuery);
  };

  // ========================================================================
  // PLAY SONG
  // ========================================================================

  const playSong = (
    song: SearchResult,
    index: number,
    newQueue?: SearchResult[],
  ) => {
    const nextQueue = newQueue ?? queueRef.current;

    setCurrentSong(song);
    currentSongRef.current = song;

    setCurrentIndex(index);
    currentIndexRef.current = index;

    setQueue(nextQueue);
    queueRef.current = nextQueue;

    setCurrentTime(0);
    setDuration(0);

    setIsPlayerVisible(true);

    resetFadeTimer();

    if (!playerRef.current) {
      pendingVideoIdRef.current = song.videoId;
      return;
    }

    playerRef.current.loadVideoById(song.videoId);
    playerRef.current.playVideo();

    setIsPlaying(true);
  };

  // ========================================================================
  // PLAY SEARCH RESULT
  // ========================================================================

  const handlePlaySong = (song: SearchResult) => {
    const index = results.findIndex((item) => item.videoId === song.videoId);

    playSong(song, index, results);

    setIsSearchOpen(false);
  };

  // ========================================================================
  // PLAY / PAUSE
  // ========================================================================

  const togglePlay = () => {
    if (!playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }

    resetFadeTimer();
  };

  // ========================================================================
  // NEXT
  // ========================================================================

  const handleNext = () => {
    playNextSong();
  };

  // ========================================================================
  // PREVIOUS
  // ========================================================================

  const handlePrevious = () => {
    const currentQueue = queueRef.current;
    const currentIdx = currentIndexRef.current;

    if (!currentQueue.length) {
      return;
    }

    if (currentTime > 3) {
      const song = currentSongRef.current;

      if (song) {
        playerRef.current?.loadVideoById(song.videoId);
        playerRef.current?.playVideo();
      }

      setCurrentTime(0);
      setIsPlaying(true);

      resetFadeTimer();

      return;
    }

    const previousIndex = currentIdx - 1;

    if (previousIndex < 0) {
      return;
    }

    const previousSong = currentQueue[previousIndex];

    setCurrentSong(previousSong);
    currentSongRef.current = previousSong;

    setCurrentIndex(previousIndex);
    currentIndexRef.current = previousIndex;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);

    playerRef.current?.loadVideoById(previousSong.videoId);
    playerRef.current?.playVideo();

    resetFadeTimer();
  };

  // ========================================================================
  // SEEK
  // ========================================================================

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const clickPosition = e.clientX - rect.left;

    const percentage = Math.max(0, Math.min(1, clickPosition / rect.width));

    const newTime = percentage * duration;

    playerRef.current.seekTo(newTime, true);

    setCurrentTime(newTime);

    resetFadeTimer();
  };

  // ========================================================================
  // OPEN PLAYER
  // ========================================================================

  const openSearch = () => {
    setIsPlayerVisible(true);
    setIsOpen(true);
    setIsSearchOpen(false);

    resetFadeTimer();
  };

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  const closeModal = () => {
    setIsOpen(false);
    setIsSearchOpen(false);

    setQuery("");
    setResults([]);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }

    setLoading(false);

    resetFadeTimer();
  };

  // ========================================================================
  // OPEN SEARCH SCREEN
  // ========================================================================

  const openSearchScreen = () => {
    setIsSearchOpen(true);
    setQuery("");
    setResults([]);
    setLoading(false);
  };

  // ========================================================================
  // CLOSE SEARCH SCREEN
  // ========================================================================

  const closeSearchScreen = () => {
    setIsSearchOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);

    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }
  };

  // ========================================================================
  // PLAYER HOVER
  // ========================================================================

  const handlePlayerEnter = () => {
    setIsPlayerVisible(true);

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
  };

  const handlePlayerLeave = () => {
    resetFadeTimer();
  };

  // ========================================================================
  // CLEANUP
  // ========================================================================

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  // ========================================================================
  // PROGRESS
  // ========================================================================

  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <>
      {/* =====================================================================
          NAVBAR MUSIC BUTTON
      ===================================================================== */}

      <NeoButton
        variant="global"
        color="secondary"
        size="sm"
        iconHover="none"
        customIcon={<MusicWaveIcon isPlaying={isPlaying} />}
        className="
          hidden
          md:inline-flex
          [&>span]:hidden
        "
        iconClassName="
          md:h-[42px] md:w-[42px]
          lg:h-[50px] lg:w-[50px]
        "
        onClick={openSearch}
      >
        {""}
      </NeoButton>

      {/* =====================================================================
          PERSISTENT YOUTUBE PLAYER
      ===================================================================== */}

      <div className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0">
        <div id="youtube-player" />
      </div>

      {/* =====================================================================
          MINI MUSIC PLAYER
      ===================================================================== */}

      {currentSong && (
        <div
          className={`
            fixed
            bottom-6
            left-1/2
            z-[9998]
            -translate-x-1/2
            transition-all
            duration-500
            ${
              isPlayerVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-30"
            }
          `}
          onMouseEnter={handlePlayerEnter}
          onMouseLeave={handlePlayerLeave}
        >
          <div className="flex items-center gap-3 rounded-full border border-neutral-300 bg-neutral-100 px-3 py-2 shadow-xl backdrop-blur-2xl">
            <img
              src={currentSong.thumbnail}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />

            <div className="w-44 min-w-0">
              <p className="truncate text-xs font-medium text-black">
                {currentSong.title}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-neutral-400">
                {currentSong.channelTitle}
              </p>

              <div
                onClick={handleSeek}
                className="group relative mt-1.5 h-[3px] w-full cursor-pointer rounded-full bg-neutral-300"
              >
                <div
                  className="relative h-full rounded-full bg-black transition-[width] duration-100"
                  style={{
                    width: `${progress}%`,
                  }}
                >
                  <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex <= 0 && currentTime <= 3}
                aria-label="Previous song"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-black disabled:cursor-default disabled:text-neutral-200"
              >
                <IonIcon icon={playSkipBack} className="h-[15px] w-[15px]" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <IonIcon icon={pause} className="h-[15px] w-[15px]" />
                ) : (
                  <IonIcon icon={play} className="h-[15px] w-[15px]" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isRepeat && currentIndex >= queue.length - 1}
                aria-label="Next song"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-black disabled:cursor-default disabled:text-neutral-200"
              >
                <IonIcon icon={playSkipForward} className="h-[15px] w-[15px]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRepeat((prev) => {
                    const next = !prev;

                    isRepeatRef.current = next;

                    return next;
                  });

                  resetFadeTimer();
                }}
                aria-label="Toggle repeat"
                className={`
                  ml-0.5
                  flex
                  h-8
                  w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  transition-colors
                  ${
                    isRepeat
                      ? "text-black"
                      : "text-neutral-400 hover:text-black"
                  }
                `}
              >
                <IonIcon icon={repeat} className="h-[15px] w-[15px]" />
              </button>

              <button
                type="button"
                onClick={openSearch}
                aria-label="Open music player"
                className="ml-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-black"
              >
                <IonIcon icon={search} className="h-[15px] w-[15px]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          IPOD MODAL
      ===================================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 px-4 py-5 backdrop-blur-md"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 18,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 18,
              }}
              transition={{
                duration: 0.26,
                ease: "easeOut",
              }}
              className="
                relative
                w-full
                max-w-[430px]
                overflow-visible
                rounded-[38px]
                border
                border-black/10
                bg-[#ececeb]
                px-[16px]
                pb-[30px]
                pt-[16px]
                text-black
                shadow-[0_28px_90px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.95)]
              "
            >
              {/* =================================================================
                  SCREEN / BEZEL
              ================================================================= */}

              <div
                className="
                  relative
                  aspect-[1.38/1]
                  w-full
                  overflow-hidden
                  rounded-[29px]
                  border-[6px]
                  border-[#25282b]
                  bg-[#111315]
                  shadow-[0_3px_8px_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.05)]
                "
              >
                <AnimatePresence mode="wait">
                  {/* =============================================================
                      NOW PLAYING
                  ============================================================= */}

                  {!isSearchOpen && (
                    <motion.div
                      key="player-screen"
                      className="relative h-full w-full overflow-hidden"
                      initial={{
                        opacity: 0,
                        x: -8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -8,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                    >
                      {currentSong ? (
                        <div
                          className="relative flex h-full w-full flex-col overflow-hidden"
                          style={{
                            background: artworkColor,
                          }}
                        >
                          {/* FULL SCREEN BLURRED ARTWORK */}

                          <div className="absolute inset-0 overflow-hidden">
                            <img
                              src={currentSong.thumbnail}
                              alt=""
                              aria-hidden="true"
                              className="
                                absolute
                                inset-[-10%]
                                h-[120%]
                                w-[120%]
                                object-cover
                                scale-110
                                opacity-75
                                blur-[32px]
                              "
                            />

                            <div
                              className="absolute inset-0"
                              style={{
                                background: artworkIsLight
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.08)",
                              }}
                            />
                          </div>

                          {/* GLOBAL GRADIENT */}

                          <div
                            className="absolute inset-0"
                            style={{
                              background: artworkIsLight
                                ? "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 48%, rgba(0,0,0,0.10) 100%)"
                                : "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 48%, rgba(0,0,0,0.28) 100%)",
                            }}
                          />

                          {/* NOW PLAYING CONTENT */}

                          <div className="relative z-10 flex w-full flex-col px-4">
                            {/* NAVIGATION */}

                            <div
                              className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                pt-3
                                text-[10px]
                                font-medium
                                ${
                                  artworkIsLight
                                    ? "text-black/70"
                                    : "text-white/80"
                                }
                              `}
                            >
                              <div className="flex items-center gap-1.5">
                                <span>{currentClock}</span>

                                <span
                                  className={
                                    artworkIsLight
                                      ? "text-black/40"
                                      : "text-white/45"
                                  }
                                >
                                  Music
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[9px]">
                                <IonIcon
                                  icon={cellular}
                                  className="h-[13px] w-[13px]"
                                  style={{
                                    color: artworkIsLight
                                      ? "rgba(0, 0, 0, 0.6)"
                                      : "rgba(255, 255, 255, 0.8)",
                                  }}
                                />

                                <span>5G</span>

                                <IonIcon
                                  icon={batteryFull}
                                  className="h-[15px] w-[15px]"
                                  style={{
                                    color: artworkIsLight
                                      ? "rgba(0, 0, 0, 0.6)"
                                      : "rgba(255, 255, 255, 0.8)",
                                  }}
                                />
                              </div>
                            </div>

                            {/* MAIN CONTENT */}

                            <div className="flex w-full items-center pt-6">
                              {/* ARTWORK */}

                              <div
                                className="
                                  relative
                                  aspect-square
                                  w-[36%]
                                  shrink-0
                                "
                              >
                                <img
                                  src={currentSong.thumbnail}
                                  alt=""
                                  aria-hidden="true"
                                  className="
                                    absolute
                                    -inset-[7%]
                                    h-[114%]
                                    w-[114%]
                                    rounded-[14px]
                                    object-cover
                                    scale-[1.04]
                                    opacity-80
                                    blur-[16px]
                                  "
                                />

                                <img
                                  src={currentSong.thumbnail}
                                  alt=""
                                  aria-hidden="true"
                                  className="
                                    absolute
                                    -inset-[3%]
                                    h-[106%]
                                    w-[106%]
                                    rounded-[12px]
                                    object-cover
                                    opacity-60
                                    blur-[8px]
                                  "
                                />

                                <div
                                  className="
                                    relative
                                    h-full
                                    w-full
                                    overflow-hidden
                                    rounded-[10px]
                                    shadow-[0_8px_24px_rgba(0,0,0,0.24)]
                                    sm:rounded-[11px]
                                  "
                                >
                                  <img
                                    src={currentSong.thumbnail}
                                    alt={`${currentSong.title} artwork`}
                                    className="
                                      block
                                      h-full
                                      w-full
                                      object-cover
                                    "
                                  />
                                </div>
                              </div>

                              {/* SONG INFO */}

                              <div
                                className={`
                                  min-w-0
                                  flex-1
                                  pl-5
                                  ${
                                    artworkIsLight ? "text-black" : "text-white"
                                  }
                                `}
                              >
                                <RunningTitle
                                  title={currentSong.title}
                                  isLight={artworkIsLight}
                                />

                                <p
                                  className={
                                    artworkIsLight
                                      ? "mt-1 truncate text-[12px] text-black/55"
                                      : "mt-1 truncate text-[12px] text-white/70"
                                  }
                                >
                                  {currentSong.channelTitle}
                                </p>

                                <p
                                  className={
                                    artworkIsLight
                                      ? "mt-1 text-[11px] text-black/35"
                                      : "mt-1 text-[11px] text-white/45"
                                  }
                                >
                                  Music
                                </p>
                              </div>
                            </div>

                            {/* STEREO + REPEAT */}

                            <div
                              className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                py-2
                                ${
                                  artworkIsLight
                                    ? "text-black/60"
                                    : "text-white/70"
                                }
                              `}
                            >
                              <div className="flex items-center gap-1.5">
                                <IonIcon
                                  icon={headsetOutline}
                                  className="h-[13px] w-[13px]"
                                />

                                <span className="text-[12px] font-medium">
                                  Stereo
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsRepeat((prev) => {
                                    const next = !prev;

                                    isRepeatRef.current = next;

                                    return next;
                                  });

                                  resetFadeTimer();
                                }}
                                className={`
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-full
                                  cursor-pointer
                                  transition-colors
                                  ${
                                    isRepeat
                                      ? artworkIsLight
                                        ? "text-black"
                                        : "text-white"
                                      : artworkIsLight
                                        ? "text-black/45 hover:text-black"
                                        : "text-white/55 hover:text-white"
                                  }
                                `}
                                aria-label="Toggle repeat"
                              >
                                <IonIcon
                                  icon={repeat}
                                  className="h-[16px] w-[16px]"
                                />
                              </button>
                            </div>

                            {/* PROGRESS */}

                            <div className="w-full pb-3">
                              <div
                                className={`
                                  mb-1
                                  flex
                                  items-center
                                  justify-between
                                  text-[10px]
                                  ${
                                    artworkIsLight
                                      ? "text-black/45"
                                      : "text-white/55"
                                  }
                                `}
                              >
                                <span>{formatTime(currentTime)}</span>

                                <span>
                                  -
                                  {formatTime(
                                    Math.max(duration - currentTime, 0),
                                  )}
                                </span>
                              </div>

                              <div
                                onClick={handleSeek}
                                className={`
                                  group
                                  relative
                                  h-[4px]
                                  w-full
                                  cursor-pointer
                                  rounded-full
                                  ${
                                    artworkIsLight
                                      ? "bg-black/20"
                                      : "bg-white/30"
                                  }
                                `}
                              >
                                <div
                                  className={`
                                    relative
                                    h-full
                                    rounded-full
                                    transition-[width]
                                    duration-100
                                    ${
                                      artworkIsLight
                                        ? "bg-black/70"
                                        : "bg-white/85"
                                    }
                                  `}
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                >
                                  <div
                                    className={`
                                      absolute
                                      right-0
                                      top-1/2
                                      h-2
                                      w-2
                                      translate-x-1/2
                                      -translate-y-1/2
                                      rounded-full
                                      opacity-0
                                      shadow-sm
                                      transition-opacity
                                      group-hover:opacity-100
                                      ${
                                        artworkIsLight ? "bg-black" : "bg-white"
                                      }
                                    `}
                                  />
                                </div>
                              </div>

                              {/* DEVICE / ACTIONS */}

                              <div
                                className={`
                                  mt-2
                                  flex
                                  items-center
                                  justify-between
                                  text-[10px]
                                  ${
                                    artworkIsLight
                                      ? "text-black/45"
                                      : "text-white/55"
                                  }
                                `}
                              >
                                <span className="truncate">
                                  Playing on this device
                                </span>

                                <div className="flex items-center gap-3">
                                  <IonIcon
                                    icon={chatboxEllipsesOutline}
                                    className="h-[13px] w-[13px]"
                                  />

                                  <IonIcon
                                    icon={listOutline}
                                    className="h-[13px] w-[13px]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* NOTHING PLAYING */

                        <div className="relative flex h-full flex-col bg-[linear-gradient(145deg,#d9e2e7_0%,#c8d4da_42%,#afbec5_100%)] px-5 pb-5 pt-4 text-[#17232a]">
                          <div className="flex items-center justify-between text-[10px] font-medium text-black/55">
                            <div className="flex items-center gap-1.5">
                              <span>{currentClock}</span>

                              <span className="text-black/30">Music</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[9px]">
                              <IonIcon
                                icon={cellular}
                                className="h-[13px] w-[13px] text-black/55"
                              />

                              <span>5G</span>

                              <IonIcon
                                icon={batteryFull}
                                className="h-[16px] w-[16px] text-black/55"
                              />
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/55 shadow-sm">
                              <IonIcon
                                icon={play}
                                className="ml-0.5 h-[20px] w-[20px] text-black/40"
                              />
                            </div>

                            <p className="text-[16px] font-semibold">
                              Nothing playing
                            </p>

                            <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-black/45">
                              Open the library from the click wheel to search
                              for a song.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* =============================================================
                      SEARCH SCREEN
                  ============================================================= */}

                  {isSearchOpen && (
                    <motion.div
                      key="search-screen"
                      className="
                        flex
                        h-full
                        min-h-0
                        flex-col
                        bg-[#f4f4f1]
                        p-4
                        text-black
                      "
                      initial={{
                        opacity: 0,
                        x: 8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: 8,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                    >
                      {/* STATUS BAR */}

                      <div className="flex shrink-0 items-center justify-between border-b border-black/10 pb-2 pt-[1px] text-[10px] font-medium text-black/50">
                        <div className="flex items-center gap-1.5">
                          <span>{currentClock}</span>

                          <span className="text-black/30">Music</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px]">
                          <IonIcon
                            icon={cellular}
                            className="h-[13px] w-[13px] text-black/55"
                          />

                          <span>5G</span>

                          <IonIcon
                            icon={batteryFull}
                            className="h-[16px] w-[16px] text-black/55"
                          />
                        </div>
                      </div>

                      {/* SEARCH TITLE */}

                      <div className="mt-3 shrink-0">
                        <h2 className="mt-0.5 text-[16px] font-semibold">
                          Search music
                        </h2>
                      </div>

                      {/* SEARCH INPUT */}

                      <form onSubmit={handleSearch} className="mt-3 shrink-0">
                        <div className="flex h-9 items-center rounded-[10px] border border-black/10 bg-black/[0.035] px-3">
                          <IonIcon
                            icon={search}
                            className="mr-2 h-[13px] w-[13px] shrink-0 text-black/35"
                          />

                          <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search a song..."
                            className="h-full w-full bg-transparent text-[12px] outline-none placeholder:text-black/30"
                            autoFocus
                          />
                        </div>
                      </form>

                      {/* SEARCH RESULTS */}

                      <div
                        className="
                          mt-2.5
                          min-h-0
                          flex-1
                          overflow-y-auto
                          overscroll-contain
                          pr-1
                          [scrollbar-width:thin]
                        "
                        onWheel={(e) => {
                          /*
                           * Stop wheel event from bubbling ke halaman.
                           * Jadi yang bergerak hanya result list.
                           */
                          e.stopPropagation();
                        }}
                      >
                        {loading && (
                          <div className="flex h-full items-center justify-center">
                            <p className="text-[12px] text-black/40">
                              Searching...
                            </p>
                          </div>
                        )}

                        {!loading && results.length === 0 && query && (
                          <div className="flex h-full items-center justify-center">
                            <p className="text-[12px] text-black/40">
                              No results found.
                            </p>
                          </div>
                        )}

                        {!loading && !query && (
                          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                            <IonIcon
                              icon={search}
                              className="mb-2 h-[18px] w-[18px] text-black/20"
                            />

                            <p className="text-[11px] leading-relaxed text-black/40">
                              Search for anything you want to listen to.
                            </p>
                          </div>
                        )}

                        {!loading && results.length > 0 && (
                          <div className="space-y-0.5 pb-1">
                            {results.map((result) => (
                              <button
                                key={result.videoId}
                                type="button"
                                onClick={() => handlePlaySong(result)}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[9px] p-1.5 text-left transition-colors hover:bg-black/[0.05]"
                              >
                                <img
                                  src={result.thumbnail}
                                  alt=""
                                  className="h-9 w-12 shrink-0 rounded-[6px] object-cover"
                                />

                                <div className="min-w-0">
                                  <p className="truncate text-[11px] font-medium">
                                    {result.title}
                                  </p>

                                  <p className="mt-0.5 truncate text-[9px] text-black/40">
                                    {result.channelTitle}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* =================================================================
                  CLICK WHEEL
              ================================================================= */}

              <div className="flex flex-col items-center px-[48px] pb-[4px] pt-[18px] sm:px-[52px] sm:pt-[22px]">
                {/* CLOSE */}

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close music player"
                  className="mb-3 flex h-6 items-center justify-center rounded-full px-3 text-[9px] font-medium uppercase tracking-[0.14em] text-black/40 transition-colors hover:bg-black/[0.04] hover:text-black/70"
                >
                  Close
                </button>

                {/* WHEEL */}

                <div
                  className="
                    relative
                    aspect-square
                    w-full
                    max-w-[272px]
                    rounded-full
                    border
                    border-black/10
                    bg-[#dededc]
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_4px_rgba(0,0,0,0.15)]
                  "
                >
                  {/* TOP — PLAY / PAUSE */}

                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="
                      absolute
                      left-1/2
                      top-[8px]
                      flex
                      h-[58px]
                      w-[64px]
                      -translate-x-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      text-black/60
                      transition-colors
                      hover:text-black
                    "
                  >
                    {isPlaying ? (
                      <IonIcon icon={pause} className="h-[22px] w-[22px]" />
                    ) : (
                      <IonIcon
                        icon={play}
                        className="ml-0.5 h-[20px] w-[20px]"
                      />
                    )}
                  </button>

                  {/* LEFT — PREVIOUS */}

                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex <= 0 && currentTime <= 3}
                    aria-label="Previous song"
                    className="
                      absolute
                      left-[6px]
                      top-1/2
                      flex
                      h-[64px]
                      w-[58px]
                      -translate-y-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      text-black/60
                      transition-colors
                      hover:text-black
                      disabled:cursor-default
                      disabled:text-black/20
                    "
                  >
                    <IonIcon
                      icon={playSkipBack}
                      className="h-[25px] w-[25px]"
                    />
                  </button>

                  {/* RIGHT — NEXT */}

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isRepeat && currentIndex >= queue.length - 1}
                    aria-label="Next song"
                    className="
                      absolute
                      right-[6px]
                      top-1/2
                      flex
                      h-[64px]
                      w-[58px]
                      -translate-y-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      text-black/60
                      transition-colors
                      hover:text-black
                      disabled:cursor-default
                      disabled:text-black/20
                    "
                  >
                    <IonIcon
                      icon={playSkipForward}
                      className="h-[25px] w-[25px]"
                    />
                  </button>

                  {/* BOTTOM — REPEAT */}

                  <button
                    type="button"
                    onClick={() => {
                      setIsRepeat((prev) => {
                        const next = !prev;

                        isRepeatRef.current = next;

                        return next;
                      });

                      resetFadeTimer();
                    }}
                    aria-label="Toggle repeat"
                    className={`
                      absolute
                      bottom-[8px]
                      left-1/2
                      flex
                      h-[58px]
                      w-[64px]
                      -translate-x-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      transition-colors
                      hover:text-black
                      ${isRepeat ? "text-black" : "text-black/45"}
                    `}
                  >
                    <IonIcon icon={repeat} className="h-[22px] w-[22px]" />
                  </button>

                  {/* CENTER — SEARCH / BACK */}

                  <button
                    type="button"
                    onClick={() => {
                      if (isSearchOpen) {
                        closeSearchScreen();
                      } else {
                        openSearchScreen();
                      }
                    }}
                    aria-label={
                      isSearchOpen ? "Back to now playing" : "Search music"
                    }
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      flex
                      h-[96px]
                      w-[96px]
                      -translate-x-1/2
                      -translate-y-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-black/15
                      bg-[#ececeb]
                      shadow-[inset_0_1px_3px_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.08)]
                      transition-transform
                      hover:scale-[1.02]
                      active:scale-[0.98]
                    "
                  >
                    {isSearchOpen ? (
                      <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/35">
                        Back
                      </span>
                    ) : (
                      <IonIcon
                        icon={search}
                        className="h-[20px] w-[20px] text-black/45"
                      />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
