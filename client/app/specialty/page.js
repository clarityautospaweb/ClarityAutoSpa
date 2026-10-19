import Image from "next/image";
import SpecialtyContent from "@/components/sections/SpecialtyContent";

export const metadata = {
  title: "Specialty Cleaning & Biohazard Restoration | Clarity Auto Spa, Brooklyn",
  description: "Mold remediation, flood extraction, rodent intrusion cleanup, and odor removal in Park Slope, Brooklyn. Expert diagnostic vehicle decontamination.",
};

export default function SpecialtyPage() {
  return (
    <div className="relative pt-24 min-h-screen bg-[#0b0e10] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/whyus/flood.jpg"
          alt="Clarity Auto Spa Specialty Restoration"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#0b0e10]/95 to-[#0b0e10]" />
      </div>
      <div className="relative z-10">
        <SpecialtyContent />
      </div>
    </div>
  );
}
