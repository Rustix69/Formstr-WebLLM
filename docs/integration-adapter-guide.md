# Adapter integration guide

This guide explains how to integrate the runner pattern into a new product repository
so the POC is understandable, demo-ready, and maintainable.

## Integration goal

Build one feature-facing API:

- `testConnection(provider)`
- `fetchModels(provider)`
- `generate(input)`

Then hide runtime details behind provider adapters:

- `webllm` adapter
- `ollama` adapter

## Recommended module layout

```text
src/
  services/
    llmRunnerService.ts
    webllmService.ts
    ollamaService.ts
  features/
    aiFeature/
      PromptModal.tsx
      outputParser.ts
      domainMapper.ts
```

## Step 1: define a stable runner contract

Keep this in one place (example: `llmRunnerService.ts`):

- provider type (`webllm` | `ollama`)
- config shape (`provider`, `modelName`, `cacheEnabled`)
- unified output shape (`success`, `data.response`, `error`, `stats`)

This prevents UI/features from coupling to WebGPU, extension APIs, or model quirks.

## Step 2: implement provider adapters

### WebLLM adapter responsibilities

- runtime checks (browser, WebGPU adapter)
- model catalog selection
- engine load/reload for selected model
- prompt completion and normalized text output

### Ollama adapter responsibilities

- extension/runtime availability check
- model listing
- non-streaming prompt completion
- normalized text output

## Step 3: add output safety before domain mapping

Always parse and validate model output before updating product state.

Example pipeline:

1. `generate()` returns `data.response` (text)
2. `parseOutput()` validates JSON shape
3. `mapToDomain()` converts to your app schema
4. update UI/state only after successful mapping

## Step 4: wire feature UI to runner only

Feature UI should:

- select provider and model
- call `testConnection()` before generation
- call `generate()` with system prompt + user prompt
- display errors from runner in user-friendly text

Feature UI should not:

- call WebLLM APIs directly
- call extension APIs directly
- parse raw runtime-specific responses

## Step 5: include demo guardrails

- cache enable/disable toggle
- clear readiness states: `checking`, `ready`, `error`
- fallback provider option (`ollama` when WebLLM fails)
- visible latency/model metadata for demo confidence

## Reference implementation in this workspace

- `nostr-forms/packages/formstr-app/src/services/llmRunnerService.ts`
- `nostr-forms/packages/formstr-app/src/services/webllmService.ts`
- `nostr-forms/packages/formstr-app/src/containers/CreateFormNew/components/AIFormGeneratorModal/index.tsx`

## Demo checklist

- provider switches correctly between `webllm` and `ollama`
- model dropdown updates per provider
- model load/reload works when switching models
- prompt -> valid output -> mapped domain object works end-to-end
- failures are surfaced with actionable messages
