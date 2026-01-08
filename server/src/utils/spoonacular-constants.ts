export const CUISINES = [
  "asian",
  "european",
  "american",
  "african",
  "middle eastern",
  "mediterranean",
  "latin american",
  "eastern european",
  "mexican",
  "italian",
  "chinese",
  "indian",
  "thai",
  "korean",
  "british",
  "japanese",
  "french",
  "greek",
  "spanish",
  "german",
  "vietnamese",
  "cajun",
  "southern",
  "irish",
  "jewish",
  "caribbean",
  "nordic",
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
