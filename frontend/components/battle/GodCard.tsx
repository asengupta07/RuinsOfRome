import Image from "next/image";
import { God } from "@/lib/battle/types";
import { getGodPlaceholderImage } from "@/lib/battle/utils";

interface GodCardProps {
  god: God;
  isHuman: boolean;
}

export const GodCard = ({ god, isHuman }: GodCardProps) => {
  return (
    <div
      className={`relative rounded-lg overflow-hidden border-2 group
        ${
          god.rarity === "Legendary"
            ? "border-yellow-500 shadow-yellow-500/20"
            : god.rarity === "Epic"
            ? "border-purple-500 shadow-purple-500/20" 
            : "border-blue-500 shadow-blue-500/20"
        }
        shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={isHuman ? god.icon : getGodPlaceholderImage()}
          alt={god.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/god-placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
      <div className="aspect-square relative">
        <div className="absolute bottom-2 w-full text-center">
          <div className="text-sm font-bold text-white drop-shadow-lg">{god.name.charAt(0).toUpperCase() + god.name.slice(1)}</div>
          <div className={`text-xs font-medium
            ${
              god.rarity === "Legendary"
                ? "text-yellow-400"
                : god.rarity === "Epic"
                ? "text-purple-400"
                : "text-blue-400"
            }`}>
            {god.rarity}
          </div>
        </div>
      </div>
    </div>
  );
};
