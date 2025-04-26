import type { IImportProgressManager } from "@interfaces/import-progress-manager.interface.js";
import type { ImportProgressState } from "@models/import-progress-state.js";
import { promises as fs } from "fs";
import { dirname } from "path";

export class FileImportProgressManager implements IImportProgressManager {
  constructor(private filePath: string) {
    this.filePath = filePath;
  }
  /**
   * Saves the current progress state to a file
   * @param progress The progress state to save
   */
  async save(progress: ImportProgressState): Promise<void> {
    try {
      await fs.mkdir(dirname(this.filePath), { recursive: true });
      await fs.writeFile(
        this.filePath,
        JSON.stringify(progress, null, 2),
        "utf8"
      );
    } catch (error) {
      throw new Error(`Failed to save progress state to ${this.filePath}`);
    }
  }
  /**
   * Loads the progress state from a file
   * If file is not found, returns the default state
   * @returns The loaded progress state
   */
  async load(): Promise<ImportProgressState> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      if (data.trim() === "") {
        return this.getDefaultState();
      }
      return JSON.parse(data) as ImportProgressState;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return this.getDefaultState();
      }
      throw new Error(`Failed to load progress state from ${this.filePath}`);
    }
  }

  private getDefaultState(): ImportProgressState {
    return {
      position: {
        cuisineIndex: 0,
        dietIndex: 0,
        dishTypeIndex: 0,
      },
      combinations: {},
    };
  }
}
