# Model formats and runtime notes

This POC targets practical browser integration first, with a provider abstraction that
lets one feature API work across WebLLM and Ollama.

## Runtime strategy

- `webllm` for in-browser local inference (WebGPU).
- `ollama` as alternative provider when browser/runtime constraints apply.

## Model format considerations

- WebLLM models are distributed in MLC-compatible bundles and selected by model IDs.
- For broader compatibility, prefer lower-footprint variants first (for example q4f32 for
  mixed adapter support) and use higher-quality variants when supported.
- Model selection should happen at runtime after adapter capability checks (for example,
  checking `shader-f16` support).

## Practical model selection guidance

- Start with a compatibility-first model in demos.
- Promote to higher-quality models only after adapter and memory checks pass.
- Keep at least one secondary model available so model switching can be demonstrated.

## Why provider abstraction still matters

- Feature teams use one API regardless of model/runtime.
- Runtime-specific errors stay inside adapters.
- Future provider additions (ONNX/TFLite/other browser engines) do not require feature rewrites.
