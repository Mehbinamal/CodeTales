# CodeTales Supabase Edge Functions

This directory contains all the Supabase Edge Functions for the CodeTales application.

## Functions Overview

### 1. `generate_story_from_repo`
Generates an AI-powered story from a GitHub repository's commit history.

**Endpoint:** `POST /functions/v1/generate_story_from_repo`

**Parameters:**
- `repo_url` (string, required): GitHub repository URL
- `public_id` (string, required): Unique public identifier for the repo

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "repo_url": "https://github.com/user/repo",
    "public_id": "unique-id",
    "story": "AI-generated story...",
    "commit_history": [...],
    "code_summary": "...",
    "main_language": "JavaScript"
  }
}
```

### 2. `save_user_story_point`
Allows users to add personal story points to a specific commit or repository.

**Endpoint:** `POST /functions/v1/save_user_story_point`

**Parameters:**
- `repo_url` (string, required): GitHub repository URL
- `story_point` (string, required): User's story point/note
- `user_id` (string, required): User's UUID
- `commit_hash` (string, optional): Specific commit hash

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "repo_url": "https://github.com/user/repo",
    "story_point": "User's note",
    "user_id": "user-uuid",
    "commit_hash": "abc123",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 3. `get_repo_story_with_user_points`
Returns the complete story of a repository, combining AI-generated content and user-added story points.

**Endpoint:** `POST /functions/v1/get_repo_story_with_user_points`

**Parameters:**
- `repo_url` (string, required): GitHub repository URL

**Response:**
```json
{
  "repo_info": {
    "story": "AI-generated story...",
    "commit_history": [...],
    "code_summary": "...",
    "main_language": "JavaScript",
    "owner": "username",
    "repo_name": "repo-name"
  },
  "user_story_points": [
    {
      "id": "uuid",
      "story_point": "User note",
      "user_id": "user-uuid",
      "commit_hash": "abc123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total_story_points": 1
}
```

### 4. `track_repo_for_user`
Allows users to track or untrack repositories for updates and notifications.

**Endpoint:** `POST /functions/v1/track_repo_for_user`

**Parameters:**
- `user_id` (string, required): User's UUID
- `repo_url` (string, required): GitHub repository URL
- `action` (string, optional): "track" or "untrack" (default: "track")

**Response (track):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user-uuid",
    "repo_url": "https://github.com/user/repo",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Repository tracked successfully"
}
```

**Response (untrack):**
```json
{
  "success": true,
  "message": "Repository untracked successfully"
}
```

### 5. `get_user_tracked_repos`
Retrieves all repositories tracked by a specific user.

**Endpoint:** `POST /functions/v1/get_user_tracked_repos`

**Parameters:**
- `user_id` (string, required): User's UUID

**Response:**
```json
{
  "tracked_repos": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "repo_url": "https://github.com/user/repo",
      "created_at": "2024-01-01T00:00:00Z",
      "repos": {
        "repo_url": "https://github.com/user/repo",
        "repo_name": "repo-name",
        "owner": "username",
        "story": "AI-generated story...",
        "main_language": "JavaScript",
        "created_at": "2024-01-01T00:00:00Z"
      }
    }
  ],
  "total_tracked": 1
}
```

## Database Schema

### Tables

#### `repos`
Stores AI-generated repository stories and metadata.

#### `story_points`
Stores user-added story points and notes.

#### `tracked_repos`
Stores user repository tracking preferences.

#### `personal_story_points`
Legacy table for personal story points (referenced by repo_id).

## Usage Examples

### JavaScript/TypeScript

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

// Generate story from repo
const { data: story } = await supabase.functions.invoke('generate_story_from_repo', {
  body: {
    repo_url: 'https://github.com/user/repo',
    public_id: 'unique-id'
  }
})

// Save user story point
const { data: storyPoint } = await supabase.functions.invoke('save_user_story_point', {
  body: {
    repo_url: 'https://github.com/user/repo',
    story_point: 'This commit introduced a major refactor',
    user_id: 'user-uuid',
    commit_hash: 'abc123'
  }
})

// Get complete repo story
const { data: fullStory } = await supabase.functions.invoke('get_repo_story_with_user_points', {
  body: {
    repo_url: 'https://github.com/user/repo'
  }
})

// Track repository
const { data: tracked } = await supabase.functions.invoke('track_repo_for_user', {
  body: {
    user_id: 'user-uuid',
    repo_url: 'https://github.com/user/repo',
    action: 'track'
  }
})

// Get user's tracked repos
const { data: trackedRepos } = await supabase.functions.invoke('get_user_tracked_repos', {
  body: {
    user_id: 'user-uuid'
  }
})
```

### cURL

```bash
# Generate story
curl -X POST 'https://your-project.supabase.co/functions/v1/generate_story_from_repo' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"repo_url": "https://github.com/user/repo", "public_id": "unique-id"}'

# Save story point
curl -X POST 'https://your-project.supabase.co/functions/v1/save_user_story_point' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"repo_url": "https://github.com/user/repo", "story_point": "User note", "user_id": "user-uuid"}'
```

## Error Handling

All functions return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (if available)"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (missing required parameters)
- `500`: Internal server error

## CORS Support

All functions include CORS headers for cross-origin requests:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Deployment

To deploy these functions to Supabase:

```bash
supabase functions deploy generate_story_from_repo
supabase functions deploy save_user_story_point
supabase functions deploy get_repo_story_with_user_points
supabase functions deploy track_repo_for_user
supabase functions deploy get_user_tracked_repos
```

## Environment Variables

Make sure these environment variables are set in your Supabase project:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: OpenAI API key (for story generation) 