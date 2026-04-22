# Formstr-WebLLM

`llm-runner` is a provider-agnostic local AI orchestration layer for product teams that need
one stable prompt->response interface while supporting multiple runtimes (WebLLM, Ollama, etc.).

This repository is the reusable baseline. The production POC integration currently lives in
`nostr-forms` using an adapter pattern based on this contract.

## Architecture
<img width="1823" height="863" alt="image" src="https://github.com/user-attachments/assets/97f77bb6-fc11-4a9f-839f-508680859b97" />

## Why this design

- Stable interface for features: feature code only calls the runner facade.
- Swappable providers: runtime-specific complexity is isolated in adapters.
- Safer outputs: JSON parse/guard happens before domain mapping.
- Faster iteration: cache and runtime stats are built into the runner layer.

## Core runner contract

- `setConfig()` and `getConfig()` for provider/model/cache controls.
- `fetchModels(provider)` to populate model selectors.
- `testConnection(provider)` to validate runtime readiness before generation.
- `generate({ prompt, system, format })` returning normalized text output and optional stats.

## Adapter pattern (new repo)

In a new repository, keep your feature logic independent from model runtime details:

1. `RunnerFacade`: exposes `testConnection`, `fetchModels`, `generate`.
2. `WebllmAdapter`: handles engine load/reload, model listing, and chat completion.
3. `OllamaAdapter`: handles extension/runtime calls and model listing.
4. `OutputParserGuard`: validates model output format before domain transformation.

Use `nostr-forms` integration as reference:

- `nostr-forms/packages/formstr-app/src/services/llmRunnerService.ts`
- `nostr-forms/packages/formstr-app/src/services/webllmService.ts`
- `nostr-forms/packages/formstr-app/src/containers/CreateFormNew/components/AIFormGeneratorModal/index.tsx`

## Quick usage example

```ts
import { LlmRunner } from "@formstr/llm-runner";

const runner = new LlmRunner({
  provider: "ollama",
  modelName: "qwen2.5:3b",
  cacheEnabled: true,
});

const result = await runner.generate({
  prompt: 'USER REQUEST: "Create a contact form"',
  format: "json",
});
```

## Documentation map

- Adapter onboarding: `docs/integration-adapter-guide.md`
- POC implementation phases: `docs/poc-implementation-plan.md`
- Model and runtime notes: `docs/model-formats.md`
