import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { handleJoinRoom } from "@/lib/battle/battleHandler";

interface JoinRoomUIProps {
  setPlayerRoomMode: (value: any) => void;
  setJoinRoomId: (value: string) => void;
  joinRoomId: string;
  setRoomId: (value: string) => void;
  toast: (props: any) => void;
}

export const JoinRoomUI = ({
  setPlayerRoomMode,
  setJoinRoomId,
  joinRoomId,
  setRoomId,
  toast,
}: JoinRoomUIProps) => {
  // State to track if we're connecting to a room
  const [isConnecting, setIsConnecting] = useState(false);
  // State to track if connection is complete and battle is starting
  const [connectionComplete, setConnectionComplete] = useState(false);

  const onJoinRoom = () => {
    setIsConnecting(true);
    handleJoinRoom(joinRoomId, setRoomId, toast);

    // Simulate a brief connection period before the battle starts
    // In a real app, this would be handled by your WebSocket connection
    setTimeout(() => {
      setConnectionComplete(true);
      toast({
        title: "Connection Successful!",
        description: "You've joined the battle. Prepare for combat!",
        variant: "default",
      });
    }, 2000);
  };

  const onBackToSelection = () => {
    setPlayerRoomMode("select");
    setJoinRoomId("");
  };

  // If connection is complete, we don't need to show this UI anymore
  // The BattleArena component will handle the battle
  if (connectionComplete) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2 text-emerald-500">
          Join Battle
        </h1>
        <p className="text-slate-300">
          Enter the room code provided by your friend
        </p>
      </div>

      <Card className="w-full max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-600 relative z-10">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-emerald-400">
            {isConnecting ? "Connecting to Battle..." : "Enter Room Code"}
          </h2>
        </CardHeader>
        <CardContent>
          {isConnecting ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-300">
                Establishing connection to room {joinRoomId}...
              </p>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse w-full"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                className="bg-slate-700 border-emerald-600 text-white placeholder:text-slate-400 text-center text-xl tracking-widest"
                placeholder="ENTER CODE"
                maxLength={6}
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {isConnecting ? (
            <Button
              className="w-full border-emerald-700 text-emerald-400 hover:bg-emerald-900/60"
              onClick={onBackToSelection}
            >
              Cancel
            </Button>
          ) : (
            <Button
              className="w-full bg-emerald-700 hover:bg-emerald-600"
              onClick={onJoinRoom}
              disabled={!joinRoomId || joinRoomId.length < 4}
            >
              Join Battle
            </Button>
          )}
        </CardFooter>
      </Card>

      {!isConnecting && (
        <Button
          className="mt-4 border-emerald-700 text-emerald-400 hover:bg-emerald-900/60"
          onClick={onBackToSelection}
        >
          Back to Selection
        </Button>
      )}
    </div>
  );
};
