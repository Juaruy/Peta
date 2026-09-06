"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
type FlowButtonProps = {
  text?: string;
  onClick?: () => void;
  action?: "back" | "click";
};
export function FlowButton({
  text = "Modern Button",
  onClick,
  action = "click",
}: FlowButtonProps) {
  const router = useRouter();
  const handleClick = () => {
    if (action === "back") {
      router.back();
      return;
    }
    onClick?.();
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className=" group relative flex cursor-pointer items-center gap-0 overflow-hidden rounded-full border-[1.5px] border-[#333333]/40 bg-neutral-300 px-8 py-3 text-sm font-semibold text-[#111111] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-white active:scale-[0.95] "
    >
      {" "}
      {/* Icon */}{" "}
      <ArrowLeft
        strokeWidth={2.5}
        className=" absolute left-4 top-1/2 z-[9] h-4 w-4 -translate-y-1/2 fill-none stroke-[#111111] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-[-25%] group-hover:stroke-white "
      />{" "}
      {/* Text */}{" "}
      <span className=" relative z-[1] flex items-center translate-x-2 leading-none transition-all duration-[800ms] ease-out group-hover:-translate-x-2 ">
        {" "}
        {text}{" "}
      </span>{" "}
      {/* Circle */}{" "}
      <span className=" absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#111111] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100 " />{" "}
      {/* Hover Icon */}{" "}
      <ArrowLeft
        strokeWidth={2.5}
        className=" absolute right-[-25%] top-1/2 z-[9] h-[15px] w-[15px] translate-y-[calc(-50%+1px)] fill-none stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-4 "
      />{" "}
    </button>
  );
}
