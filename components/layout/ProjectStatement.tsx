"use client";

export default function ProjectStatement() {
  return (
    <section
      className="
        relative
        flex
        min-h-screen
        w-full
        flex-col
        justify-between
        bg-white
        px-6
        py-8
        text-black
        md:px-12
        md:py-10
        lg:px-16
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-black/10
          pb-4
          text-[9px]
          uppercase
          tracking-[0.12em]
        "
      >
        <span>Thoughts</span>

        <span>01</span>
      </div>

      {/* STATEMENT */}
      <div className="max-w-[900px]">
        <p
          className="
            text-[clamp(2.5rem,5vw,6rem)]
            font-medium
            leading-[0.9]
            tracking-[-0.05em]
          "
        >
          We design digital experiences that turn ideas into something people
          can actually feel.
        </p>
      </div>

      {/* FOOTER */}
      <div
        className="
          flex
          items-end
          justify-between
          text-[9px]
          uppercase
          tracking-[0.12em]
        "
      >
        <span>A small thought</span>

        <span>2026</span>
      </div>
    </section>
  );
}
