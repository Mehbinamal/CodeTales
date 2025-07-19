export interface Repository {
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface CommitHighlight {
  sha: string;
  message: string;
  date: string;
  author: string;
}

export interface CodeStory {
  repository: Repository;
  timeline: CommitHighlight[];
  narrative: string;
  insights: {
    totalCommits: number;
    contributors: number;
    activeMonths: number;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: CodeStory;
  error?: string;
}