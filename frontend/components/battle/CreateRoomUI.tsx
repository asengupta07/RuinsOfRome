import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface CreateRoomUIProps {
  roomId: string;
  setPlayerRoomMode: (value: any) => void;
  setRoomId: (value: string) => void;
  toast: (props: any) => void;
}

export const CreateRoomUI = ({
  roomId,
  setPlayerRoomMode,
  setRoomId,
  toast,
}: CreateRoomUIProps) => {
  // State to track if opponent has joined
  const [opponentJoined, setOpponentJoined] = useState(false);

  // Simulate opponent joining after a random time between 5-10 seconds
  // In a real app, this would come from your WebSocket or other real-time service
  useEffect(() => {
    if (roomId && !opponentJoined) {
      const timer = setTimeout(
        () => {
          setOpponentJoined(true);
          toast({
            title: "Opponent Joined!",
            description: "An opponent has joined your room. Battle begins!",
            variant: "default",
          });
        },
        Math.floor(Math.random() * 5000) + 5000
      ); // Random between 5-10 seconds

      return () => clearTimeout(timer);
    }
  }, [roomId, opponentJoined, toast]);

  // Copy room ID to clipboard
  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard",
      variant: "default",
    });
  };

  // Go back to room selection
  const onCancel = () => {
    setPlayerRoomMode("select");
    setRoomId("");
  };

  // If opponent has joined, we don't need to show this UI anymore
  // The BattleArena component will handle the battle
  if (opponentJoined) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2 text-emerald-500">
          Battle Room Created
        </h1>
        <p className="text-slate-300">
          Share this code with your friend to begin combat
        </p>
      </div>

      <Card className="w-full max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-600 relative z-10">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-emerald-400">
            Your Room Code
          </h2>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="relative">
            <div className="flex">
              {roomId.split("").map((char, index) => (
                <div
                  key={index}
                  className="w-12 h-16 flex items-center justify-center bg-slate-700 border-2 border-emerald-500 mx-1 rounded-md text-2xl font-bold"
                >
                  {char}
                </div>
              ))}
            </div>
            <Button
              size="sm"
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-emerald-800 hover:bg-emerald-700"
              onClick={copyRoomIdToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-slate-300 text-sm">
            Waiting for opponent to join...
          </p>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-pulse-slow w-full"></div>
          </div>
        </CardFooter>
      </Card>

      <Button
        className="mt-4 border-emerald-700 text-emerald-400 hover:bg-emerald-900/60"
        onClick={onCancel}
      >
        Cancel & Go Back
      </Button>
    </div>
  );
};
