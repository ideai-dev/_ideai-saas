# Contributing Guide

Thank you for contributing to the 2027 Full-Stack Monorepo! This guide will help you get started.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/monorepo.git
   cd monorepo
   ```

3. **Run setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Services

```bash
# All services
pnpm dev

# Individual services
pnpm --filter web dev
pnpm --filter api-node dev

# Python service
cd services/api-python
source venv/bin/activate
uvicorn main:app --reload
```

### Making Changes

1. **Frontend (Next.js)**
   - Located in `apps/web/`
   - Use Server Components by default
   - Add `'use client'` only when needed
   - Follow Next.js 16 patterns

2. **Python API**
   - Located in `services/api-python/`
   - Use async/await
   - Add type hints
   - Update OpenAPI docs

3. **Node.js API**
   - Located in `services/api-node/`
   - Use TypeScript
   - Follow ES module patterns
   - Add proper error handling

4. **Shared Code**
   - Types: `packages/types/`
   - Add shared types for cross-service communication

### Code Style

#### TypeScript/JavaScript
```bash
# Format
pnpm format

# Lint
pnpm lint

# Type check
pnpm type-check
```

#### Python
```bash
cd services/api-python

# Format
black .

# Lint
ruff check .

# Type check
mypy .
```

## Testing

### Frontend Tests
```bash
pnpm --filter web test
```

### Python Tests
```bash
cd services/api-python
pytest
pytest --cov  # with coverage
```

### Node.js Tests
```bash
pnpm --filter api-node test
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(web): add user dashboard page
fix(api-python): resolve database connection timeout
docs(readme): update installation instructions
refactor(api-node): simplify task controller
test(web): add unit tests for auth flow
chore(deps): update dependencies
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   pnpm test
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure CI passes

5. **Address Review Comments**
   - Make requested changes
   - Push updates to the same branch

## Code Review Guidelines

### As a Reviewer
- Be constructive and respectful
- Focus on code quality and maintainability
- Test the changes locally if possible
- Approve when satisfied

### As an Author
- Respond to all comments
- Ask questions if unclear
- Make requested changes promptly
- Keep PRs focused and small

## Project Structure

```
monorepo/
├── apps/
│   └── web/              # Next.js frontend
├── services/
│   ├── api-python/       # FastAPI service
│   └── api-node/         # Node.js service
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── typescript-config/
│   └── eslint-config/
├── docker/              # Docker configurations
├── docs/                # Documentation
└── scripts/             # Setup and utility scripts
```

## Adding New Features

### New Frontend Page
1. Create page in `apps/web/app/[route]/page.tsx`
2. Add types to `packages/types/`
3. Create API calls
4. Add tests

### New API Endpoint

#### Python
```python
# services/api-python/main.py
@app.get("/api/new-endpoint")
async def new_endpoint():
    return {"data": "value"}
```

#### Node.js
```typescript
// services/api-node/src/index.ts
app.get('/api/new-endpoint', (req, res) => {
  res.json({ data: 'value' });
});
```

### New Shared Package
1. Create in `packages/your-package/`
2. Add `package.json`
3. Export from `index.ts`
4. Reference in other packages

## Documentation

- Update README.md for major changes
- Add JSDoc/docstrings for public functions
- Update API docs in `docs/API.md`
- Add examples for new features

## Environment Variables

- Never commit `.env` files
- Update `.env.example` for new variables
- Document required variables in README

## Database Changes

### Migrations (Python/Alembic)
```bash
cd services/api-python

# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8000 | xargs kill -9  # Python API
lsof -ti:3001 | xargs kill -9  # Node API
```

### Python Virtual Environment Issues
```bash
cd services/api-python
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node Modules Issues
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Turbo Cache Issues
```bash
pnpm turbo clean
rm -rf .turbo
```

## Getting Help

- Check [documentation](./docs/)
- Search existing [issues](https://github.com/your-repo/issues)
- Ask in [discussions](https://github.com/your-repo/discussions)
- Join our [Discord](https://discord.gg/your-server)

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
