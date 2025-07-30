import type { ImportProgressState } from "@app-types/import-types.js";

export interface IImportProgressManager {
  save(progress: ImportProgressState): Promise<void>;
  load(): Promise<ImportProgressState>;
}
