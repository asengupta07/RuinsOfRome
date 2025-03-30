"use client";

import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function ConvexFunctionTester() {
    const [gameLog, setGameLog] = useState("");
    const gameId = "12345";
    // const userId = "user_001";
    const userId = "user_002";
    const [logs, setLogs] = useState("");

    const sendLog = useMutation(api.game.sendLog);
    const lastUserLog = useQuery(api.game.getLastUserLogs, { gameId, userIds: ["user_001", "user_002"] }) as { body: string }[] | undefined;

    const handleSendLog = async () => {
        await sendLog({
            userId,
            body: gameLog,
            gameId,
        });
        setGameLog("");
    }

    useEffect(() => {
        console.log("lastUserLog", lastUserLog);
        if (lastUserLog) {
            setLogs(lastUserLog?.map(log => log.body).join("\n") || "");
        }
    }
    , [lastUserLog]);

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <Card className="w-full max-w-md">
                <CardContent className="p-6 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">Send Game Log</h2>
                    <p className="text-sm text-gray-500">User ID: {userId}</p>
                    <p className="text-sm text-gray-500">Game ID: {gameId}</p>
                    <Input placeholder="Game Log" value={gameLog} onChange={(e) => setGameLog(e.target.value)} />
                    <Button onClick={() => handleSendLog()} className="mt-2">Send Log</Button>
                </CardContent>
            </Card>

            <Card className="w-full max-w-md">
                <CardContent className="p-6 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">Inserted Logs</h2>
                    <div className="border p-2 rounded bg-gray-100 min-h-[100px]">{logs ? logs : "No logs found."}</div>
                </CardContent>
            </Card>
        </div>
    );
}
