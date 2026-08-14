"use client";

export default function WorkSection() {
  return (
    <section
      className="relative h-fit w-full overflow-hidden bg-black text-white
        px-8
        py-12
        md:px-12
        md:py-16
        lg:px-16"
    >
      {/* SECTION HEADING */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-[-0.03em]">
          Ideas with room to breathe.
        </h2>
      </div>
    </section>
  );
}
