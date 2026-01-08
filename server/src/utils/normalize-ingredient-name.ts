import pluralize from "pluralize";

export function normalizeIngredientName(input: string): string {
  let name = input.toLowerCase().trim();

  // Remove parentheses content
  name = name.replace(/\([^)]*\)/g, " ");

  // Remove punctuation and numbers, preserving only Unicode letters and spaces
  name = name.replace(/[^\p{L}\s]/gu, " ");

  // Normalize whitespace
  name = name.replace(/\s+/g, " ").trim();

  // Singularize each word
  name = name
    .split(" ")
    .filter(Boolean)
    .map((word) => pluralize.singular(word))
    .join(" ");

  return name;
}
