import { Swords, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { handleCreateRoom } from "@/lib/battle/battleHandler";
import { generateRoomId } from "@/lib/battle/utils";

interface PlayerRoomSelectionProps {
  setBattleMode: (value: any) => void;
  setPlayerRoomMode: (value: any) => void;
  setRoomId: (value: string) => void;
  toast: (props: any) => void;
}

export const PlayerRoomSelection = ({
  setBattleMode,
  setPlayerRoomMode,
  setRoomId,
  toast,
}: PlayerRoomSelectionProps) => {
  const onCreateRoom = () => {
    setPlayerRoomMode("create");
    handleCreateRoom(generateRoomId, setRoomId, toast);
  };

  const onJoinRoom = () => {
    setPlayerRoomMode("join");
  };

  const onBackToSelection = () => {
    setBattleMode("select");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2 text-emerald-500">
          Player vs Player
        </h1>
        <p className="text-slate-300">
          Create a new battle or join an existing one
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-10">
        {/* Create Room Option */}
        <Card
          className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-700 hover:border-emerald-500 transition-all cursor-pointer transform hover:scale-105"
          onClick={onCreateRoom}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center">
              <div className="bg-emerald-900/60 p-4 rounded-full">
                <Swords className="h-12 w-12 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center pt-2">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">
              Create Battle
            </h2>
            <p className="text-slate-300 text-sm">
              Start a new arena and invite a friend to battle.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-1 pb-4">
            <Button className="bg-emerald-900/60 border-emerald-700 text-emerald-400 hover:bg-emerald-800/60">
              Create Room
            </Button>
          </CardFooter>
        </Card>

        {/* Join Room Option */}
        <Card
          className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-700 hover:border-emerald-500 transition-all cursor-pointer transform hover:scale-105"
          onClick={onJoinRoom}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center">
              <div className="bg-emerald-900/60 p-4 rounded-full">
                <ArrowRight className="h-12 w-12 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center pt-2">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">
              Join Battle
            </h2>
            <p className="text-slate-300 text-sm">
              Enter a room code to join an existing battle.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-1 pb-4">
            <Button className="bg-emerald-900/60 border-emerald-700 text-emerald-400 hover:bg-emerald-800/60">
              Join Room
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Button
        variant="ghost"
        className="mt-4 text-slate-400 hover:text-slate-200"
        onClick={onBackToSelection}
      >
        Back to Battle Selection
      </Button>
    </div>
  );
};
