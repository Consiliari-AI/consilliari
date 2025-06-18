export const cosAnalysisDto = (data) => {
  return {
    total_cos_score: data.total_cos_score || 0,
    rating_label: data.rating_label || "Not Available",
    score_breakdown: {
      career_capital: data.score_breakdown?.career_capital || 0,
      skills_and_readiness: data.score_breakdown?.skills_and_readiness || 0,
      performance_and_impact: data.score_breakdown?.performance_and_impact || 0,
      growth_engine: data.score_breakdown?.growth_engine || 0,
      alignment_and_market: data.score_breakdown?.alignment_and_market || 0,
    },
  };
}; 