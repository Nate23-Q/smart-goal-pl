# Smart Goal Planner

A fintech application for managing multiple savings goals with full CRUD functionality using React, Vite, and json-server.

## Features

- **Goal Management**: Add, update, and delete financial goals
- **Progress Tracking**: Visual progress bars and completion status
- **Deposit System**: Make deposits to specific goals
- **Overview Dashboard**: Total savings, completed goals, and statistics
- **Deadline Warnings**: Alerts for goals approaching deadlines
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the json-server (in one terminal):
```bash
npm run server
```

3. Start the development server (in another terminal):
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

The json-server provides the following endpoints:

- `GET /goals` - Fetch all goals
- `POST /goals` - Create a new goal
- `PATCH /goals/:id` - Update a specific goal
- `DELETE /goals/:id` - Delete a specific goal

## Goal Data Structure

```json
{
  "id": "string",
  "name": "string",
  "targetAmount": number,
  "savedAmount": number,
  "category": "string",
  "deadline": "YYYY-MM-DD",
  "createdAt": "YYYY-MM-DD"
}
```

## Usage

1. **Add Goals**: Click "Add Goal" to create new savings targets
3. **Track Progress**: View progress bars and completion percentages
4. **Monitor Deadlines**: Get warnings for goals due within 30 days
5. **Delete Goals**: Use the × button to remove goals

## Technologies Used

- React 18
- Vite
- json-server
- CSS3 with Grid and Flexbox
- Fetch API for HTTP requests