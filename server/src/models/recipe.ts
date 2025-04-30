export type Recipe = {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  imageType: string;
  spoonacularScore?: number;
  healthScore?: number;
  servings: number;
  weightPerServing: number;
  pricePerServing: number;
  caloriesPerServing?: number;
  readyInMinutes: number;
  instructions: string[];
  summary: string;
  percentProtein?: number;
  percentFat?: number;
  percentCarbs?: number;
};
