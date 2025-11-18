export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface SizeChart {
  size: Size
  bust: { min: number; max: number }
  waist: { min: number; max: number }
  hips: { min: number; max: number }
}

export interface FitScore {
  bust: 'perfect' | 'good' | 'loose' | 'tight'
  waist: 'perfect' | 'good' | 'loose' | 'tight'
  hips: 'perfect' | 'good' | 'loose' | 'tight'
}

export interface SizeRecommendation {
  recommendedSize: Size
  confidenceScore: number
  fitScore: FitScore
  alternativeSizes: Size[]
}

// Size chart for women's activewear (in cm)
const sizeChart: SizeChart[] = [
  {
    size: 'XS',
    bust: { min: 76, max: 81 },
    waist: { min: 58, max: 63 },
    hips: { min: 84, max: 89 },
  },
  {
    size: 'S',
    bust: { min: 81, max: 86 },
    waist: { min: 63, max: 68 },
    hips: { min: 89, max: 94 },
  },
  {
    size: 'M',
    bust: { min: 86, max: 91 },
    waist: { min: 68, max: 73 },
    hips: { min: 94, max: 99 },
  },
  {
    size: 'L',
    bust: { min: 91, max: 97 },
    waist: { min: 73, max: 79 },
    hips: { min: 99, max: 105 },
  },
  {
    size: 'XL',
    bust: { min: 97, max: 104 },
    waist: { min: 79, max: 86 },
    hips: { min: 105, max: 112 },
  },
  {
    size: 'XXL',
    bust: { min: 104, max: 112 },
    waist: { min: 86, max: 94 },
    hips: { min: 112, max: 120 },
  },
]

function checkFit(measurement: number, range: { min: number; max: number }): 'perfect' | 'good' | 'loose' | 'tight' {
  const mid = (range.min + range.max) / 2
  const tolerance = (range.max - range.min) / 4

  if (measurement >= range.min && measurement <= range.max) {
    // Within range
    if (Math.abs(measurement - mid) <= tolerance) {
      return 'perfect'
    }
    return 'good'
  } else if (measurement < range.min) {
    return 'loose'
  } else {
    return 'tight'
  }
}

function calculateFitScore(bust: number, waist: number, hips: number, sizeData: SizeChart): number {
  const bustFit = checkFit(bust, sizeData.bust)
  const waistFit = checkFit(waist, sizeData.waist)
  const hipsFit = checkFit(hips, sizeData.hips)

  let score = 0
  const scores = { perfect: 100, good: 80, loose: 50, tight: 50 }

  score += scores[bustFit] || 0
  score += scores[waistFit] || 0
  score += scores[hipsFit] || 0

  return Math.round(score / 3)
}

export function calculateSize(
  bust: number,
  waist: number,
  hips: number,
  fitPreference?: string
): SizeRecommendation {
  // Calculate fit scores for all sizes
  const sizeScores = sizeChart.map((sizeData) => ({
    size: sizeData.size,
    score: calculateFitScore(bust, waist, hips, sizeData),
    fitScore: {
      bust: checkFit(bust, sizeData.bust),
      waist: checkFit(waist, sizeData.waist),
      hips: checkFit(hips, sizeData.hips),
    },
  }))

  // Sort by score
  sizeScores.sort((a, b) => b.score - a.score)

  // Adjust based on fit preference
  let recommendedSize = sizeScores[0].size
  let confidenceScore = sizeScores[0].score
  const fitScore = sizeScores[0].fitScore

  if (fitPreference) {
    const currentIndex = sizeChart.findIndex((s) => s.size === recommendedSize)

    if (fitPreference.includes('รัดกุม') || fitPreference.includes('Tight')) {
      // Prefer tighter fit - go one size down if possible
      if (currentIndex > 0 && sizeScores[0].score >= 80) {
        recommendedSize = sizeChart[currentIndex - 1].size
        confidenceScore = Math.max(85, sizeScores[0].score - 10)
      }
    } else if (fitPreference.includes('หลวม') || fitPreference.includes('Loose')) {
      // Prefer looser fit - go one size up if possible
      if (currentIndex < sizeChart.length - 1 && sizeScores[0].score >= 80) {
        recommendedSize = sizeChart[currentIndex + 1].size
        confidenceScore = Math.max(85, sizeScores[0].score - 10)
      }
    }
  }

  // Get alternative sizes
  const alternativeSizes = sizeScores
    .filter((s) => s.size !== recommendedSize && s.score >= 70)
    .slice(0, 2)
    .map((s) => s.size)

  return {
    recommendedSize,
    confidenceScore,
    fitScore,
    alternativeSizes,
  }
}
