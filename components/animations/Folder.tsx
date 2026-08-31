import React, { useState } from "react";
import Link from "next/link";

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  title?: string;
  href?: string;
  className?: string;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;

  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(color.slice(0, 6), 16);

  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

const Folder: React.FC<FolderProps> = ({
  color = "#5227FF",
  size = 1,
  items = [],
  title,
  href,
  className = "",
}) => {
  const maxItems = 3;

  const papers = items.slice(0, maxItems);

  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);

  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })),
  );

  const folderBackColor = darkenColor(color, 0.08);

  const scaleStyle = {
    transform: `scale(${size})`,
  };

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);

    setPaperOffsets(
      Array.from({ length: maxItems }, () => ({
        x: 0,
        y: 0,
      })),
    );
  };

  const handlePaperMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (!open) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;

    setPaperOffsets((prev) => {
      const newOffsets = [...prev];

      newOffsets[index] = {
        x: offsetX,
        y: offsetY,
      };

      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];

      newOffsets[index] = {
        x: 0,
        y: 0,
      };

      return newOffsets;
    });
  };

  const getOpenTransform = (index: number) => {
    if (index === 0) {
      return "translate(-120%, -70%) rotate(-15deg)";
    }

    if (index === 1) {
      return "translate(10%, -70%) rotate(15deg)";
    }

    if (index === 2) {
      return "translate(-50%, -100%) rotate(5deg)";
    }

    return "";
  };

  const folderContent = (
    <div className="flex flex-col items-center" style={scaleStyle}>
      {/* FOLDER */}
      <div
        className={`group relative cursor-pointer transition-all duration-200 ease-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
          !open ? "hover:-translate-y-2" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: open ? "translateY(-8px)" : undefined,
        }}
        tabIndex={0}
        role="link"
        aria-label={title ? `View ${title} project` : "View project"}
      >
        <div
          className="relative h-[80px] w-[100px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{
            backgroundColor: folderBackColor,
          }}
        >
          {/* FOLDER TAB */}
          <span
            className="absolute bottom-[98%] left-0 z-0 h-[10px] w-[30px] rounded-tl-[5px] rounded-tr-[5px]"
            style={{
              backgroundColor: folderBackColor,
            }}
          />

          {/* PAPERS / PROJECT IMAGES */}
          {papers.map((item, i) => {
            let sizeClasses = "";

            if (i === 0) {
              sizeClasses = "h-[80%] w-[70%]";
            }

            if (i === 1) {
              sizeClasses = open ? "h-[80%] w-[80%]" : "h-[70%] w-[80%]";
            }

            if (i === 2) {
              sizeClasses = open ? "h-[80%] w-[90%]" : "h-[60%] w-[90%]";
            }

            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : undefined;

            return (
              <div
                key={i}
                onMouseMove={(e) => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
                className={`absolute bottom-[10%] left-1/2 z-20 overflow-hidden rounded-[10px] transition-all duration-300 ease-in-out ${
                  !open
                    ? "transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0"
                    : "hover:scale-110"
                } ${sizeClasses}`}
                style={{
                  ...(!open
                    ? {}
                    : {
                        transform: transformStyle,
                      }),
                  backgroundColor: "transparent",
                }}
              >
                {item}
              </div>
            );
          })}

          {/* FRONT FOLDER */}
          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:[transform:skew(15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && {
                transform: "skew(15deg) scaleY(0.6)",
              }),
            }}
          />

          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:[transform:skew(-15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && {
                transform: "skew(-15deg) scaleY(0.6)",
              }),
            }}
          />
        </div>
      </div>

      {/* PROJECT TITLE */}
      {title && (
        <div className="mt-5 text-center">
          <span className="text-base font-medium text-white md:text-lg">
            {title}
          </span>
        </div>
      )}
    </div>
  );

  return href ? (
    <Link
      href={href}
      className={`block ${className}`}
      aria-label={title ? `View ${title} project` : "View project"}
    >
      {folderContent}
    </Link>
  ) : (
    <div className={className}>{folderContent}</div>
  );
};

export default Folder;
