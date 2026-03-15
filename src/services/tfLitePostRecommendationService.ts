import * as tf from '@tensorflow/tfjs';

export interface RecommendationUserProfile {
  id: string;
  skills: string[];
}

export interface RecommendationSkillRequirement {
  skills?: string[];
  skill?: string;
  requiredCount?: number;
}

export interface RecommendationPostInput {
  id: string;
  title: string;
  skillRequirements: RecommendationSkillRequirement[];
}

export interface PostRecommendationScore {
  postId: string;
  title: string;
  cosineSimilarity: number;
  matchPercent: number;
  coveragePercent: number;
  matchedSkills: string[];
  vocabularySize: number;
  matchedRequirementCount: number;
  totalRequirementCount: number;
}

export interface PostRecommendationSummary {
  totalPosts: number;
  recommendedPosts: number;
  averageMatchPercent: number;
  vocabularySize: number;
}

export interface PostRecommendationResult {
  scores: PostRecommendationScore[];
  summary: PostRecommendationSummary;
}

const SKILL_ALIASES: Record<string, string> = {
  'ai ml': 'ai ml',
  'ai/ml': 'ai ml',
  angularjs: 'angular',
  'ar vr': 'ar vr',
  'ar/vr': 'ar vr',
  'asp net': 'asp.net',
  'asp net core': 'asp.net core',
  'c sharp': 'c#',
  'cplusplus': 'c++',
  'github actions': 'github actions',
  'mongo db': 'mongodb',
  mongodb: 'mongodb',
  'next js': 'next.js',
  nextjs: 'next.js',
  'node js': 'node.js',
  nodejs: 'node.js',
  'postgres sql': 'postgresql',
  postgres: 'postgresql',
  'power shell': 'powershell',
  'py torch': 'pytorch',
  pytorch: 'pytorch',
  'react js': 'react',
  'tailwind': 'tailwind css',
  'tf lite': 'tensorflow lite',
  'type script': 'typescript',
  'ui ux': 'ui ux',
  'ui ux design': 'ui ux design',
  'web 3': 'web3',
};

function normalizeSkill(rawSkill: string): string {
  return rawSkill
    .toLowerCase()
    .replace(/[\/_-]+/g, ' ')
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalizeSkill(rawSkill: string): string {
  const normalized = normalizeSkill(rawSkill);
  return SKILL_ALIASES[normalized] ?? normalized;
}

function getRequirementSkills(requirement: RecommendationSkillRequirement): string[] {
  const rawSkills = Array.isArray(requirement.skills)
    ? requirement.skills
    : requirement.skill
      ? [requirement.skill]
      : [];

  return rawSkills
    .map(canonicalizeSkill)
    .filter(Boolean);
}

function buildWeightedSkillMap(skills: string[], baseWeight = 1): Map<string, number> {
  const map = new Map<string, number>();

  skills
    .map(canonicalizeSkill)
    .filter(Boolean)
    .forEach((skill) => {
      map.set(skill, (map.get(skill) ?? 0) + baseWeight);
    });

  return map;
}

function buildPostSkillMap(skillRequirements: RecommendationSkillRequirement[]): Map<string, number> {
  const map = new Map<string, number>();

  skillRequirements.forEach((requirement) => {
    const requirementWeight = Math.max(1, requirement.requiredCount ?? 1);
    getRequirementSkills(requirement).forEach((skill) => {
      map.set(skill, (map.get(skill) ?? 0) + requirementWeight);
    });
  });

  return map;
}

function mapToVector(skillMap: Map<string, number>, vocabulary: string[]): number[] {
  return vocabulary.map((skill) => skillMap.get(skill) ?? 0);
}

function calculateCosineSimilarity(userVector: number[], postVector: number[]): number {
  return tf.tidy(() => {
    const userTensor = tf.tensor1d(userVector, 'float32');
    const postTensor = tf.tensor1d(postVector, 'float32');
    const dotProduct = tf.sum(tf.mul(userTensor, postTensor));
    const magnitudes = tf.mul(tf.norm(userTensor), tf.norm(postTensor));
    const similarity = tf.divNoNan(dotProduct, magnitudes);
    return Number(similarity.dataSync()[0] ?? 0);
  });
}

function calculateRequirementCoverage(
  skillRequirements: RecommendationSkillRequirement[],
  userSkillSet: Set<string>,
): { matchedRequirementCount: number; totalRequirementCount: number } {
  const totalRequirementCount = skillRequirements.length;
  const matchedRequirementCount = skillRequirements.filter((requirement) =>
    getRequirementSkills(requirement).every((skill) => userSkillSet.has(skill)),
  ).length;

  return { matchedRequirementCount, totalRequirementCount };
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function relayRecommendationLogsToTerminal(
  profileId: string,
  summary: PostRecommendationSummary,
  scores: PostRecommendationScore[],
): void {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  const lines = [
    `Summary: profileId=${profileId}, totalPosts=${summary.totalPosts}, recommendedPosts=${summary.recommendedPosts}, averageMatchPercent=${summary.averageMatchPercent}, vocabularySize=${summary.vocabularySize}`,
    ...scores.map((score, index) => (
      `Rank ${index + 1}: ${score.title} | postId=${score.postId} | matchPercent=${score.matchPercent.toFixed(2)} | cosineSimilarity=${roundToTwoDecimals(score.cosineSimilarity)} | coveragePercent=${score.coveragePercent} | matchedSkills=${score.matchedSkills.join(', ') || 'none'}`
    )),
  ];

  void fetch('/__dev-log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: '[TensorFlow Lite] Post recommendation match scoring',
      lines,
    }),
  }).catch(() => {
    // Keep browser-side recommendation scoring unaffected if the dev relay is unavailable.
  });
}

export async function rankPostsWithTfLiteCosineSimilarity(
  profile: RecommendationUserProfile,
  posts: RecommendationPostInput[],
): Promise<PostRecommendationResult> {
  await tf.ready();

  const userSkillMap = buildWeightedSkillMap(profile.skills);
  const userSkillSet = new Set(userSkillMap.keys());

  const scores = posts
    .map((post) => {
      const postSkillMap = buildPostSkillMap(post.skillRequirements);
      const vocabulary = Array.from(new Set([...userSkillMap.keys(), ...postSkillMap.keys()])).sort();
      const userVector = mapToVector(userSkillMap, vocabulary);
      const postVector = mapToVector(postSkillMap, vocabulary);
      const cosineSimilarity = vocabulary.length > 0 ? calculateCosineSimilarity(userVector, postVector) : 0;
      const matchedSkills = Array.from(postSkillMap.keys()).filter((skill) => userSkillSet.has(skill));
      const { matchedRequirementCount, totalRequirementCount } = calculateRequirementCoverage(post.skillRequirements, userSkillSet);
      const coveragePercent = totalRequirementCount > 0
        ? (matchedRequirementCount / totalRequirementCount) * 100
        : matchedSkills.length > 0
          ? 100
          : 0;
      const matchPercent = roundToTwoDecimals(cosineSimilarity * 100);

      return {
        postId: post.id,
        title: post.title,
        cosineSimilarity,
        matchPercent,
        coveragePercent: roundToTwoDecimals(coveragePercent),
        matchedSkills,
        vocabularySize: vocabulary.length,
        matchedRequirementCount,
        totalRequirementCount,
      };
    })
    .sort((left, right) => {
      if (right.cosineSimilarity !== left.cosineSimilarity) {
        return right.cosineSimilarity - left.cosineSimilarity;
      }

      if (right.coveragePercent !== left.coveragePercent) {
        return right.coveragePercent - left.coveragePercent;
      }

      return left.title.localeCompare(right.title);
    });

  const recommendedScores = scores.filter((score) => score.matchPercent > 0);
  const averageMatchPercent = recommendedScores.length > 0
    ? roundToTwoDecimals(
        recommendedScores.reduce((total, score) => total + score.matchPercent, 0) / recommendedScores.length,
      )
    : 0;
  const vocabularySize = scores.reduce((max, score) => Math.max(max, score.vocabularySize), 0);

  console.groupCollapsed('[TensorFlow Lite] Post recommendation match scoring');
  console.log('Summary', {
    profileId: profile.id,
    totalPosts: posts.length,
    recommendedPosts: recommendedScores.length,
    averageMatchPercent,
    vocabularySize,
  });
  scores.forEach((score, index) => {
    console.log(`Rank ${index + 1}: ${score.title}`, {
      postId: score.postId,
      matchPercent: score.matchPercent,
      cosineSimilarity: roundToTwoDecimals(score.cosineSimilarity),
      coveragePercent: score.coveragePercent,
      matchedSkills: score.matchedSkills,
      matchedRequirements: `${score.matchedRequirementCount}/${score.totalRequirementCount}`,
    });
  });
  console.groupEnd();

  const summary: PostRecommendationSummary = {
    totalPosts: posts.length,
    recommendedPosts: recommendedScores.length,
    averageMatchPercent,
    vocabularySize,
  };

  relayRecommendationLogsToTerminal(profile.id, summary, scores);

  return {
    scores,
    summary,
  };
}
