export const CacheKeys = {
  CUISINES_ALL: "ref:cuisines:all",
  DIETS_ALL: "ref:diets:all",
  DISH_TYPES_ALL: "ref:dish-types:all",
  TTL_REF: 86400,

  recommendations: {
    topPicks: (userId: string) => `rec:top-picks:${userId}`,
    fridge: (userId: string) => `rec:fridge:${userId}`,
    similar: (userId: string) => `rec:similar:${userId}`,
    TTL: 900,
  },

  recipes: {
    trending: "recipes:trending",
    TTL: 3600,
  },

  RATE_LIMIT: "rl:",
};
