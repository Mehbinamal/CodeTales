# CodeTales Server

This is the backend server for CodeTales, which generates stories about GitHub repositories using Gemini AI.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   npm install @google/generative-ai
   ```

2. **Environment Configuration:**
   Create a `.env` file in the server directory with the following variables:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```

3. **Get a Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

4. **Run the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/generate-story` - Generate a story from a GitHub repository URL
- `GET /api/health` - Health check endpoint

## Project Structure

- `controllers/storyController.js` - Business logic for story generation
- `routes/storyRoutes.js` - API route definitions
- `index.js` - Server setup and configuration 