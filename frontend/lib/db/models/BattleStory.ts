import mongoose, { Schema, Document } from "mongoose";

// Interface for God object
export interface God {
  name: string;
  icon?: string;
  rarity?: string;
}

// Interface for Battle Story document
export interface IBattleStory extends Document {
  chapter: number;
  story: string;
  playerGladiator: string;
  opponentGladiator: string;
  playerGods: God[];
  opponentGods: God[];
  battleLogs: string[];
  winner: string;
  createdAt: Date;
}

// Schema for Battle Story
const BattleStorySchema: Schema = new Schema({
  chapter: {
    type: Number,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  playerGladiator: {
    type: String,
    required: true,
  },
  opponentGladiator: {
    type: String,
    required: true,
  },
  playerGods: [
    {
      name: String,
      icon: String,
      rarity: String,
    },
  ],
  opponentGods: [
    {
      name: String,
      icon: String,
      rarity: String,
    },
  ],
  battleLogs: [String],
  winner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Only create the model if it doesn't already exist (for Next.js hot reloading)
const BattleStory =
  mongoose.models.BattleStory ||
  mongoose.model<IBattleStory>("BattleStory", BattleStorySchema);

export default BattleStory;
