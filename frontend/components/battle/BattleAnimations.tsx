import React from "react";

// Function to render attack animation
export const renderAttackAnimation = (
  type: string,
  isHumanAttack: boolean
): React.ReactNode => {
  // Update base classes to position animations correctly based on attacker
  const baseClasses = `absolute z-20 transform ${
    isHumanAttack ? "left-0 translate-x-1/2" : "right-0 -translate-x-1/2"
  } top-1/2 -translate-y-1/2 pointer-events-none`;

  // Direction-specific transforms
  const directionTransform = isHumanAttack
    ? {
        start: "translateX(-100%) translateY(-50%)",
        middle: "translateX(0%) translateY(-50%)",
        end: "translateX(100%) translateY(-50%)",
      }
    : {
        start: "translateX(100%) translateY(-50%)",
        middle: "translateX(0%) translateY(-50%)",
        end: "translateX(-100%) translateY(-50%)",
      };

  switch (type) {
    case "slash":
      return (
        <div
          className={`${baseClasses} w-20 h-20 ${
            isHumanAttack ? "animate-slash-right" : "animate-slash"
          }`}
        >
          <div className="w-full h-full bg-emerald-500 rounded-full opacity-50 animate-ping"></div>
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rotate-45 blur-sm animate-pulse"></div>
        </div>
      );
    case "stab":
      return (
        <div
          className={`${baseClasses} w-32 h-8 ${
            isHumanAttack ? "animate-stab-right" : "animate-stab"
          }`}
        >
          <div className="w-full h-full bg-emerald-500 transform skew-x-30 opacity-70"></div>
          <div
            className={`absolute w-4 h-4 bg-white ${
              isHumanAttack ? "right-0" : "left-0"
            } top-1/2 -translate-y-1/2 rounded-full shadow-lg shadow-emerald-500`}
          ></div>
        </div>
      );
    case "punch":
      return (
        <div
          className={`${baseClasses} w-16 h-16 ${
            isHumanAttack ? "animate-punch-right" : "animate-punch"
          }`}
        >
          <div className="w-full h-full bg-emerald-600 rounded-full relative flex items-center justify-center">
            <span className="text-white font-bold text-xl">POW!</span>
          </div>
        </div>
      );
    case "magic":
      return (
        <div
          className={`${baseClasses} w-24 h-24 ${
            isHumanAttack ? "animate-magic-right" : "animate-magic"
          }`}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-70 animate-pulse"></div>
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <span className="text-white font-bold text-xl animate-bounce">
              ✨
            </span>
          </div>
        </div>
      );
    case "arrow":
      return (
        <div
          className={`${baseClasses} w-32 h-6 ${
            isHumanAttack ? "animate-arrow-right" : "animate-arrow"
          }`}
        >
          <div className="w-full h-1 bg-brown-500"></div>
          <div
            className={`absolute ${
              isHumanAttack ? "left-0" : "right-0"
            } w-0 h-0 border-y-8 border-y-transparent ${
              isHumanAttack
                ? "border-l-8 border-l-brown-800"
                : "border-r-8 border-r-brown-800"
            }`}
          ></div>
        </div>
      );
    default:
      return null;
  }
};
