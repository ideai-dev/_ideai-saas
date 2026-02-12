# Shared Packages

This directory contains shared code used across the monorepo.

## Available Packages

### @repo/types

Shared TypeScript types for consistency across frontend and backend services.

**Location**: `packages/types/`

**Usage**:
```typescript
import type { User, Item, ApiResponse } from '@repo/types';

const user: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

**Adding New Types**:
```typescript
// packages/types/src/index.ts
export interface NewType {
  id: string;
  name: string;
}
```

### @repo/typescript-config

Shared TypeScript configurations for consistent compiler settings.

**Location**: `packages/typescript-config/`

**Usage**:
```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    // Your overrides
  }
}
```

**Available Configs**:
- `base.json` - Base configuration for all TypeScript projects
- `nextjs.json` - Next.js specific configuration (coming soon)
- `react-library.json` - React library configuration (coming soon)

### @repo/eslint-config

Shared ESLint configurations for consistent code style.

**Location**: `packages/eslint-config/`

**Usage**:
```javascript
// eslint.config.js
module.exports = {
  extends: ['@repo/eslint-config/next'],
};
```

**Available Configs**:
- `next.js` - Next.js projects (coming soon)
- `library.js` - Library projects (coming soon)

## Creating a New Package

1. **Create package directory**:
   ```bash
   mkdir -p packages/my-package/src
   cd packages/my-package
   ```

2. **Create package.json**:
   ```json
   {
     "name": "@repo/my-package",
     "version": "0.0.0",
     "private": true,
     "main": "./src/index.ts",
     "types": "./src/index.ts",
     "exports": {
       ".": "./src/index.ts"
     }
   }
   ```

3. **Create source file**:
   ```typescript
   // packages/my-package/src/index.ts
   export function myFunction() {
     return 'Hello from my package!';
   }
   ```

4. **Use in other packages**:
   ```json
   // apps/web/package.json
   {
     "dependencies": {
       "@repo/my-package": "workspace:*"
     }
   }
   ```

   ```typescript
   // apps/web/app/page.tsx
   import { myFunction } from '@repo/my-package';
   
   console.log(myFunction());
   ```

5. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Best Practices

### Types Package

✅ **Do**:
- Export interfaces and types
- Keep types simple and focused
- Document complex types with JSDoc
- Use descriptive names
- Group related types

❌ **Don't**:
- Include implementation code
- Export functions or classes
- Have runtime dependencies
- Use any or unknown excessively

### Config Packages

✅ **Do**:
- Keep configs minimal
- Document why settings exist
- Version control all configs
- Test configs in real projects

❌ **Don't**:
- Override configs unnecessarily
- Include project-specific settings
- Make breaking changes without communication

## Package Dependencies

Packages can depend on each other:

```json
{
  "dependencies": {
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}
```

Turborepo automatically handles build order.

## TypeScript Path Mapping

Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/types": ["./packages/types/src"],
      "@repo/utils": ["./packages/utils/src"]
    }
  }
}
```

## Testing Packages

Test packages in isolation:

```bash
# Create test file
# packages/my-package/src/index.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from './index';

describe('myFunction', () => {
  it('should work', () => {
    expect(myFunction()).toBe('Hello from my package!');
  });
});

# Run tests
cd packages/my-package
pnpm test
```

## Publishing Packages (Internal)

These packages are internal to the monorepo and marked as `private: true`.

If you need to publish publicly:

1. Remove `"private": true` from `package.json`
2. Add proper versioning
3. Set up npm publishing in CI/CD
4. Update import paths in consuming packages

## Troubleshooting

### Type Imports Not Working

```bash
# Restart TypeScript server in your IDE
# VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"

# Clear build cache
pnpm turbo clean
rm -rf .turbo

# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Package Not Found

```bash
# Ensure package is in workspace
# Check pnpm-workspace.yaml includes 'packages/*'

# Install from root
pnpm install

# Check if package.json has correct workspace reference
"@repo/my-package": "workspace:*"
```

## Examples

### Creating a Utility Package

```typescript
// packages/utils/src/index.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Creating a Constants Package

```typescript
// packages/constants/src/index.ts
export const API_ENDPOINTS = {
  PYTHON: process.env.NEXT_PUBLIC_API_PYTHON_URL || 'http://localhost:8000',
  NODE: process.env.NEXT_PUBLIC_API_NODE_URL || 'http://localhost:3001',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const;
```

### Creating a React Hooks Package

```typescript
// packages/hooks/src/index.ts
import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
}
```

## Contributing

When adding or modifying shared packages:

1. Update this README
2. Add tests for new functionality
3. Update dependent packages if breaking changes
4. Document in CHANGELOG.md
5. Run type checking across all packages

## Package Versioning

Currently using `0.0.0` for all internal packages. For production:

- Follow [Semantic Versioning](https://semver.org/)
- Use changesets for version management
- Automate publishing with CI/CD

## Future Packages

Planned additions:

- `@repo/ui` - Shared React components
- `@repo/utils` - Utility functions
- `@repo/constants` - Shared constants
- `@repo/hooks` - Shared React hooks
- `@repo/api-client` - API client library
- `@repo/validators` - Zod schemas

## Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
