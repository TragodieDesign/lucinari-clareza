import { useState, type ReactNode } from "react";

type BrandImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  icon?: ReactNode;
  label?: string;
  tone?: "deep" | "mid" | "cream" | "gold";
};

const tones: Record<NonNullable<BrandImageProps["tone"]>, string> = {
  deep: "bg-[#0e302e] text-[#e2c88c]",
  mid: "bg-[#123c38] text-[#e2c88c]",
  cream: "bg-[#f3eee1] text-[#0e302e]",
  gold: "bg-[#e2c88c] text-[#0e302e]",
};

const BrandImage = ({ src, alt = "", className = "", imgClassName = "", icon, label, tone = "deep" }: BrandImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {failed ? (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center ${tones[tone]}`}>
          {icon && <span className="opacity-80">{icon}</span>}
          {label && <span className="font-outfit text-[10px] font-bold uppercase tracking-widest">{label}</span>}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

export default BrandImage;
