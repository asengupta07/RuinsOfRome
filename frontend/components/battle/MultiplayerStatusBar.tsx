import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MultiplayerStatusBarProps {
  roomId: string;
  setBattleMode: (value: any) => void;
  setRoomId: (value: string) => void;
  setPlayerRoomMode: (value: any) => void;
  resetBattleState: () => void;
}

export const MultiplayerStatusBar = ({
  roomId,
  setBattleMode,
  setRoomId,
  setPlayerRoomMode,
  resetBattleState,
}: MultiplayerStatusBarProps) => {
  // State to track status message
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for opponent's move..."
  );

  // Simulate different battle states (in a real app, this would come from a server)
  useEffect(() => {
    const messages = [
      "Waiting for opponent's move...",
      "Your turn - choose an ability!",
      "Opponent is thinking...",
      "Battle in progress",
    ];

    // Change message every 5 seconds for demo purposes
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setStatusMessage(messages[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLeaveRoom = () => {
    setBattleMode("select");
    setRoomId("");
    setPlayerRoomMode("select");
    resetBattleState();
  };

  return (
    <div className="bg-slate-900/80 border-b border-emerald-900 py-2 px-4 mb-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-emerald-400">Room: {roomId}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-300">{statusMessage}</span>
        <Button
          size="sm"
          className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={handleLeaveRoom}
        >
          Leave Room
        </Button>
      </div>
    </div>
  );
};
