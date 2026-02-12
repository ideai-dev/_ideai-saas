# LLM Service (Python)

Multi-provider LLM routing service.

**Registry:** `services/services.json` → `id: llm-service`  
**Tags:** llm, ai, chat, completion, openai, anthropic, ollama, routing, inference

## Language: Python 3.12+
## Framework: FastAPI
## Location: services/python/llm-service/

## What This Does
- Routes requests to the best LLM (OpenAI, Anthropic, or local Ollama)
- Imports from `providers/openai/`, `providers/anthropic/`
- Contains YOUR business logic for model selection, fallback, cost optimization

## Structure
```
llm-service/
  app/
    main.py          # FastAPI app
    router.py        # LLM routing logic
    models.py        # Pydantic models
  requirements.txt
  Dockerfile
```

## Run
```bash
cd services/python/llm-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```
