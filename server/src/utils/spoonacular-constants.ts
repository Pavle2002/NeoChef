export const CUISINES = [
  "italian",
  "mexican",
  "chinese",
  "american",
  "indian",
  "japanese",
  "french",
  "mediterranean",
  "thai",
  "spanish",
  "greek",
  "german",
  "korean",
  "vietnamese",
  "middle eastern",
  "british",
  "caribbean",
  "latin american",
  "cajun",
  "southern",
  "eastern european",
  "irish",
  "african",
  "nordic",
  "jewish",
  "asian",
  "european",
] as const;

export const DIETS = [
  "gluten free",
  "ketogenic",
  "vegetarian",
  "vegan",
  "lacto-vegetarian",
  "ovo-vegetarian",
  "pescetarian",
  "paleo",
  "primal",
  "low fodmap",
  "whole30",
] as const;

export const DISH_TYPES = [
  "main course",
  "side dish",
  "dessert",
  "appetizer",
  "salad",
  "bread",
  "breakfast",
  "soup",
  "beverage",
  "sauce",
  "marinade",
  "fingerfood",
  "snack",
  "drink",
] as const;

export type Cuisine = (typeof CUISINES)[number];
export type Diet = (typeof DIETS)[number];
export type DishType = (typeof DISH_TYPES)[number];
