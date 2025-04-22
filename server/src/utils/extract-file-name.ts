/**
 * Extracts the image name from a given URL.
 * @param {string} url - The URL to extract the image name from.
 * @returns {string} The extracted image name, or an empty string if not found.
 */
export function extractImageName(url: string): string {
  return url.split("/").pop() || "";
}
