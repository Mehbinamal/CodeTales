# CodeTales - GitHub Repository Storyteller

A beautiful web application that tells the story behind any public GitHub repository by analyzing its commit history, contributors, and evolution over time.

## Project Structure

This project is now separated into two independent parts:

- **Frontend**: React + TypeScript + Vite application
- **Backend**: Express.js API server

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Running the Backend Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

### Running the Frontend

1. In a new terminal, navigate to the project root:
   ```bash
   cd /path/to/CodeTales
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173` and will automatically proxy API requests to the backend server.

## Development

- **Frontend**: `npm run dev` - Starts Vite dev server
- **Backend**: `cd server && npm run dev` - Starts Express API server
- **Both (Optional)**: `npm run dev:both` - Starts both frontend and backend together
- **Build**: `npm run build` - Builds the frontend for production

## Features

- 🎨 Beautiful, modern UI with Tailwind CSS
- 📊 Repository analytics and insights
- 📅 Commit timeline visualization
- 🤖 AI-generated narrative stories
- 📱 Responsive design
- ⚡ Fast development with Vite
- 🔗 Direct URL access: Visit `codetales.com/username/repo` to generate stories instantly
- 🔄 Shareable repository story links

## API Endpoints

- `POST /api/generate-story` - Generate a story for a GitHub repository
- `GET /api/health` - Health check endpoint

## URL Routing

The application supports direct URL access for repository stories:

- **Home Page**: `codetales.com/` - Main interface for entering repository URLs
- **Repository Story**: `codetales.com/username/repo` - Direct access to generate a story for a specific repository
- **Examples**:
  - `codetales.com/facebook/react` - Story for React repository
  - `codetales.com/microsoft/vscode` - Story for VS Code repository
  - `codetales.com/vercel/next.js` - Story for Next.js repository

The URL-based routing automatically generates stories when users visit repository-specific URLs, making it easy to share and bookmark repository stories.

## Technologies Used

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

**Backend:**
- Express.js
- Node.js
- GitHub API integration

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
# Optional: Add GitHub token for higher rate limits
# GITHUB_TOKEN=your_github_personal_access_token_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!

[![💻 Built at TinkerSpace](https://img.shields.io/badge/Built%20at-TinkerSpace-blueviolet?style=for-the-badge&label=%F0%9F%92%BBBuilt%20at&labelColor=turquoise&color=white)](https://tinkerhub.org/tinkerspace)
