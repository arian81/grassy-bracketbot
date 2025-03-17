"use client";

import { z } from "zod";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

// Define Zod schemas
const PlayerSchema = z.object({
  image_path: z.string(),
  registration_date: z.string(),
  last_seen: z.string(),
  wins: z.number(),
  draws: z.number(),
  losses: z.number(),
});

const LeaderboardSchema = z.object({
  next_player_id: z.number(),
  players: z.record(z.string(), PlayerSchema),
});

// type Leaderboard = z.infer<typeof LeaderboardSchema>;

async function getLeaderboard() {
  try {
    const res = await fetch("http://localhost:8000/leaderboard");
    if (!res.ok) {
      throw new Error(
        `Failed to fetch leaderboard: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return LeaderboardSchema.parse(data);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Invalid leaderboard data format");
    }
    throw error;
  }
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = React.useState<z.infer<
    typeof LeaderboardSchema
  > | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getLeaderboard()
      .then((data) => setLeaderboard(data))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        )
      );
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Leaderboard
            </h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  const players = Object.entries(leaderboard.players).map(([id, player]) => ({
    id,
    ...player,
    image_path: `http://localhost:8000/image/${player.image_path}`,
  }));

  // Sort players by wins (descending)
  const sortedPlayers = players.sort((a, b) => b.wins - a.wins);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Grassy Leaderboard
        </h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead>Draws</TableHead>
                <TableHead>Losses</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player, index) => (
                <TableRow
                  key={player.id}
                  className={
                    index === 2 ? "border-b-8 border-gray-200 rounded-full" : ""
                  }
                >
                  <TableCell>
                    <span
                      className={
                        index === 0
                          ? "text-yellow-500 font-bold"
                          : index === 1
                          ? "text-gray-400 font-bold"
                          : index === 2
                          ? "text-amber-600 font-bold"
                          : ""
                      }
                    >
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={player.image_path}
                            alt={`Player ${player.id}`}
                            className="object-cover [filter:saturate(1.4)_brightness(0.9)]"
                          />
                          <AvatarFallback>P{player.id}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          Player {player.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{player.wins}</TableCell>
                  <TableCell>{player.draws}</TableCell>
                  <TableCell>{player.losses}</TableCell>
                  <TableCell>
                    {format(new Date(player.last_seen), "MMM d, yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
