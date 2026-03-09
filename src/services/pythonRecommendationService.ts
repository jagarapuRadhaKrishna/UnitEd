const PYTHON_RECOMMENDATION_URL = 'http://127.0.0.1:8765';
const REQUEST_TIMEOUT_MS = 2500;

export interface PythonRecommendationProfile {
  student_id: string;
  name: string;
  department: string;
  skills: string[];
  interests: string[];
  year_of_graduation?: number;
}

export interface PythonRecommendationPost {
  id: string;
  title: string;
  description: string;
  purpose: string;
  department?: string;
  skill_requirements: Array<{ skill?: string; skills?: string[]; requiredCount?: number }>;
  status: string;
}

export interface PythonRecommendationResult {
  post_id: string;
  title: string;
  cosine_score: number;
  matched_terms: string[];
  rationale: string;
}

export interface PythonRecommendationResponse {
  recommendations: PythonRecommendationResult[];
  logs: string[];
  report?: {
    summary?: {
      recommendations_returned?: number;
      active_posts_considered?: number;
    };
  };
}

async function fetchWithTimeout(input: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function isPythonRecommendationBridgeAvailable(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${PYTHON_RECOMMENDATION_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function requestPythonRecommendations(
  profile: PythonRecommendationProfile,
  posts: PythonRecommendationPost[],
  topK: number,
): Promise<PythonRecommendationResponse> {
  const response = await fetchWithTimeout(`${PYTHON_RECOMMENDATION_URL}/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profile,
      posts,
      top_k: topK,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Python recommendation bridge request failed.');
  }

  return response.json() as Promise<PythonRecommendationResponse>;
}
