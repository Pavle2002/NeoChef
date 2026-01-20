import { config } from "@config/config.js";

export const CacheKeys = {
  CUISINES_ALL: "ref:cuisines:all",
  DIETS_ALL: "ref:diets:all",
  DISH_TYPES_ALL: "ref:dish-types:all",
  TTL_REF: config.caching_ttls.filterOptions,

  recommendations: {
    topPicks: (userId: string) => `rec:top-picks:${userId}`,
    fridge: (userId: string) => `rec:fridge:${userId}`,
    similar: (userId: string) => `rec:similar:${userId}`,
    TTL: config.caching_ttls.recommendedRecipes,
  },

  recipes: {
    trending: "recipes:trending",
    TTL: config.caching_ttls.trendingRecipes,
  },

  RATE_LIMIT: "rl:",
};
