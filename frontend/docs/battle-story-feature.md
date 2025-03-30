# Battle Story Generation Feature

This feature enhances the battle system by generating epic narrative stories after each battle, storing them in MongoDB, and providing an interface to read the chronicles of past battles.

## Setup Instructions

### Prerequisites

- MongoDB account (MongoDB Atlas recommended for cloud deployment)
- Groq API account and API key

### Environment Variables

Create a `.env.local` file in the root of the frontend directory with the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/ruinsofrome?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_groq_api_key_here
```

Replace the values with your actual MongoDB connection string and Groq API key.

### Install Dependencies

Make sure you have the required dependencies installed:

```bash
npm install mongoose
```

## How It Works

1. **Battle Completion**: When a battle concludes (victory or defeat), the system collects data about the battle including:

   - Player's gladiator name and stats
   - Opponent's gladiator name and stats
   - Gods supporting each gladiator
   - Battle logs (key events during the battle)
   - The winner

2. **Story Generation**: This data is sent to the Groq API, which generates a narrative paragraph about the battle.

3. **MongoDB Storage**: The generated story, along with battle metadata, is stored in MongoDB with a sequential chapter number.

4. **User Interface**: Players can read the battle story from the victory/defeat modals and navigate through their battle history.

5. **Chronicles Page**: A dedicated page at `/chronicles` allows players to browse through all their stored battle stories in a visually appealing format with chapter navigation.

## Technical Components

- **MongoDB Connection**: `frontend/lib/db/mongodb.ts`
- **MongoDB Schema**: `frontend/lib/db/models/BattleStory.ts`
- **Groq API Service**: `frontend/lib/services/groqService.ts`
- **Battle Story Service**: `frontend/lib/services/battleStoryService.ts`
- **Battle History Utilities**: `frontend/lib/battle/battleHistoryUtils.ts`
- **API Routes**:
  - `frontend/app/api/battle-stories/route.ts` (POST for creating, GET for listing)
  - `frontend/app/api/battle-stories/[chapter]/route.ts` (GET for individual stories)
- **UI Components**:
  - Story display in VictoryModal
  - Story display in DefeatModal
  - Chronicles page: `frontend/app/chronicles/page.tsx`

## API Reference

### Create Battle Story

```
POST /api/battle-stories
```

Request body:

```json
{
  "yourGods": [
    { "name": "Jupiter", "icon": "/jupiter.png", "rarity": "Legendary" }
  ],
  "opponentGods": [{ "name": "Mars", "icon": "/mars.png", "rarity": "Epic" }],
  "yourGladiator": "Marcus Aurelius",
  "opponentGladiator": "Digitalis Maximus",
  "battleLogs": [
    "Marcus Aurelius enters the arena to thunderous applause.",
    "Digitalis Maximus stands ready, weapon in hand.",
    "The crowd roars as the battle begins.",
    "Marcus Aurelius delivers the final blow, claiming victory!"
  ],
  "winner": "Marcus Aurelius"
}
```

### List All Battle Stories

```
GET /api/battle-stories
```

### Get Battle Story by Chapter

```
GET /api/battle-stories/1
```

## Future Enhancements

- Battle history page to browse all stored battle stories
- Enhanced battle logs with more detailed events
- Illustrations generated for each battle story
- Search and filter functionality for the Chronicles page
- Interactive storylines where past battles influence future stories
- Ability to share battle stories on social media
