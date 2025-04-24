import type { ProgressState } from "@app-types/spoonacular-types.js";

export interface IImportProgressManager {
  save(progress: ProgressState): Promise<void>;
  load(): Promise<ProgressState>;
}
