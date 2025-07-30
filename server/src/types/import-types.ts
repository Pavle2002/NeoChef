export type RecipeSearchOptions = {
  cuisine: string;
  diet: string;
  type: string;
  number: number;
  offset: number;
};

export type CombinationProgressEntry = { offset: number; done: boolean };

export type ImportProgressState = {
  position: {
    cuisineIndex: number;
    dietIndex: number;
    dishTypeIndex: number;
  };
  combinations: Record<string, CombinationProgressEntry>;
};
