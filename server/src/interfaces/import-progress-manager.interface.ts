import type { ImportProgressState } from "@models/import-progress-state.js";

export interface IImportProgressManager {
  save(progress: ImportProgressState): Promise<void>;
  load(): Promise<ImportProgressState>;
}
