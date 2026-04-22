export type RunnerProvider = "dummy" | "ollama";

export interface RunnerModel {
  name: string;
  provider: RunnerProvider;
  description?: string;
}

export interface RunnerConfig {
  provider: RunnerProvider;
  modelName: string;
  cacheEnabled: boolean;
}

export interface RunnerGenerateParams {
  prompt: string;
  system?: string;
  format?: "json";
  modelName?: string;
}

export interface RunnerStats {
  latencyMs: number;
  cached: boolean;
  provider: RunnerProvider;
  modelName: string;
}

export interface RunnerGenerateResult {
  success: boolean;
  data?: { response: string };
  error?: string;
  stats?: RunnerStats;
}
