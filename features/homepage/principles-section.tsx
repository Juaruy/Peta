"use client";

import AccordionGallery from "@/components/animations/AccordionGallery";

const items = [
  {
    title: "Reserach",
    description:
      "Lorem Ipsum is placeholder text used in printing, typesetting, and digital design, originating from a scrambled version of Cicero's 1st-century BC text De Finibus Bonorum et Malorum",
    color: "bg-neutral-800",
  },
  {
    title: "Define",
    description:
      "Lorem Ipsum is placeholder text used in printing, typesetting, and digital design, originating from a scrambled version of Cicero's 1st-century BC text De Finibus Bonorum et Malorum",
    color: "bg-neutral-800",
  },
  {
    title: "Design",
    description:
      "Lorem Ipsum is placeholder text used in printing, typesetting, and digital design, originating from a scrambled version of Cicero's 1st-century BC text De Finibus Bonorum et Malorum",
    color: "bg-neutral-800",
  },
  {
    title: "Implemetation",
    description:
      "Lorem Ipsum is placeholder text used in printing, typesetting, and digital design, originating from a scrambled version of Cicero's 1st-century BC text De Finibus Bonorum et Malorum",
    color: "bg-neutral-800",
  },
  {
    title: "Testing",
    description:
      "Lorem Ipsum is placeholder text used in printing, typesetting, and digital design, originating from a scrambled version of Cicero's 1st-century BC text De Finibus Bonorum et Malorum",
    color: "bg-neutral-800",
  },
];

export default function PrinciplesSection() {
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
          Principles
        </h2>
      </div>

      <AccordionGallery
        items={items}
        defaultIndex={2}
        expandRatio={0.52}
        trigger="hover"
        accentColor="#ffffff"
        overlayColor="#060010"
        textColor="#ffffff"
        grayscale
        duration={0.6}
        ease="power3.out"
        parallax={0.5}
        tilt={8}
        stagger={0.06}
        height={460}
        gap={10}
        radius={16}
        orientation="horizontal"
      />
    </section>
  );
}
