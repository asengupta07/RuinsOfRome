import Image from "next/image";
import { God } from "@/lib/battle/types";
import { getGodPlaceholderImage } from "@/lib/battle/utils";

interface GodCardProps {
  god: God;
}

export const GodCard = ({ god }: GodCardProps) => {
  return (
    <div
      className={`relative rounded-lg overflow-hidden border-2 
        ${
          god.rarity === "Legendary"
            ? "border-yellow-500"
            : god.rarity === "Epic"
            ? "border-purple-500"
            : "border-blue-500"
        } 
        bg-slate-800/80 p-2 shadow-lg`}
    >
      <div className="aspect-square relative">
        <Image
          src={getGodPlaceholderImage()}
          alt={god.name}
          width={60}
          height={60}
          className="object-cover"
          // Fallback in case the placeholder doesn't exist yet
          onError={(e) => {
            e.currentTarget.src = "/god-placeholder.svg";
          }}
        />
      </div>
      <div className="text-center text-xs mt-1 font-semibold">{god.name}</div>
    </div>
  );
};
