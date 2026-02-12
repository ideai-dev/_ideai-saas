# Dependency Management & Vendoring Strategy

## Philosophy

For a production-grade 2027 monorepo, critical dependencies should be **vendored and version-locked** to ensure:

1. **Stability** - No surprise breaking changes from auto-updates
2. **Sovereignty** - Work offline without npm/CDN access
3. **Security** - Audit exact code running in production
4. **Compliance** - Meet regulatory requirements for source control

## Critical Dependencies to Vendor

### UI & Visualization (High Priority)

```
lib/vendored/
├── react-flow/           # @xyflow/react - Diagram components
├── shadcn-ui/            # shadcn/ui components (already local)
├── lucide-icons/         # Icon library
├── recharts/             # Charts and data viz
└── radix-ui/             # Primitives for shadcn
```

### Why Vendor These?

- **React Flow** - Core to your architecture visualization
- **shadcn/ui** - Already follows vendoring pattern (components in codebase)
- **Lucide Icons** - UI breaks without icons
- **Recharts** - Dashboard visualizations
- **Radix UI** - Foundational primitives

## Vendoring Process

### 1. React Flow Example

```bash
# Install normally first
pnpm add @xyflow/react

# Create vendored directory
mkdir -p lib/vendored/react-flow

# Copy source files
cp -r node_modules/@xyflow/react/dist/* lib/vendored/react-flow/
cp node_modules/@xyflow/react/package.json lib/vendored/react-flow/

# Update tsconfig paths
# tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@xyflow/react": ["./lib/vendored/react-flow"]
    }
  }
}

# Lock version in package.json
{
  "dependencies": {
    "@xyflow/react": "12.3.7"  // No ^ or ~
  }
}

# Update imports
# Before: import { ReactFlow } from '@xyflow/react'
# After: import { ReactFlow } from '@/lib/vendored/react-flow'
```

### 2. Lucide Icons Example

```bash
# Install
pnpm add lucide-react

# Vendor only icons you use
mkdir -p lib/vendored/icons
cp node_modules/lucide-react/dist/esm/icons/* lib/vendored/icons/

# Create index file
# lib/vendored/icons/index.ts
export { Terminal } from './terminal'
export { Database } from './database'
export { Cloud } from './cloud'
// ... only what you need
```

## Package Manager Configuration

### pnpm (Recommended)

```yaml
# .npmrc
save-exact=true
auto-install-peers=false
strict-peer-dependencies=true

# Lock resolutions
package-import-method=copy

# Prefer offline
prefer-offline=true
offline=false  # Set true for fully offline dev
```

### Lock File Strategy

```bash
# Commit lock files
git add pnpm-lock.yaml

# Never ignore lockfiles
# .gitignore should NOT have:
# pnpm-lock.yaml
# package-lock.json
# yarn.lock
```

## Dependency Categories

### Tier 1: Vendored (Critical)
- React Flow
- UI components (shadcn already done)
- Icon libraries
- Chart libraries
- **Rule**: If UI breaks without it, vendor it

### Tier 2: Locked Versions (Important)
- Next.js (lock version)
- React (lock version)
- Tailwind (lock version)
- TypeScript (lock version)
- **Rule**: Major frameworks, lock but don't vendor

### Tier 3: Flexible (Nice-to-have)
- Dev dependencies
- Testing libraries
- Build tools
- **Rule**: Can float versions, won't break production

## Version Locking Examples

### package.json Pattern

```json
{
  "dependencies": {
    "next": "16.0.1",              // Locked - no ^ or ~
    "react": "19.2.0",              // Locked
    "@xyflow/react": "12.3.7",      // Vendored + Locked
    "zod": "^3.24.1"                // Flexible (validation lib)
  },
  "devDependencies": {
    "typescript": "5.7.3",          // Locked (breaks builds)
    "eslint": "^9.0.0",             // Flexible (dev tool)
    "prettier": "^3.0.0"            // Flexible (formatting)
  }
}
```

## Multi-Language Dependencies

### Python (services/python/*/requirements.txt)

```txt
# Locked versions
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.6
sqlalchemy==2.0.36

# Pin transitive deps that matter
httpx==0.28.1
python-multipart==0.0.20

# Use constraints file for dev deps
# dev-requirements.txt
pytest>=8.0.0,<9.0.0
black>=24.0.0,<25.0.0
```

### Node.js (services/nodejs/*/package.json)

```json
{
  "dependencies": {
    "express": "4.21.2",
    "ws": "8.18.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

### Rust (services/rust/*/Cargo.toml)

```toml
[dependencies]
tokio = "=1.43.0"        # Exact version
serde = "=1.0.215"
axum = "=0.8.1"

[profile.release]
lto = true               # Link-time optimization
codegen-units = 1        # Single codegen unit for size
```

## Internal Package Registry (Enterprise)

### Setup Verdaccio (Private npm Registry)

```bash
# docker-compose.yml
services:
  verdaccio:
    image: verdaccio/verdaccio:latest
    ports:
      - "4873:4873"
    volumes:
      - ./verdaccio/storage:/verdaccio/storage
      - ./verdaccio/config:/verdaccio/conf

# .npmrc
registry=http://localhost:4873
```

### Benefits
- Offline development
- Version control
- Compliance & audit
- Faster installs (LAN speed)

## Dependency Update Strategy

### Monthly Dependency Review

```bash
# 1. Check for updates
pnpm outdated

# 2. Review security advisories
pnpm audit

# 3. Update non-critical deps
pnpm update --latest --interactive

# 4. Test thoroughly
pnpm test
pnpm build

# 5. Commit with changelog
git add pnpm-lock.yaml
git commit -m "chore: update dependencies (see CHANGELOG)"
```

### Breaking Change Protocol

1. **Review release notes** - Understand what changed
2. **Update in feature branch** - Never main
3. **Run full test suite** - Unit + integration + E2E
4. **Update vendored copies** - If applicable
5. **Document migration** - Update docs/MIGRATIONS.md

## Offline Development Setup

### 1. Cache All Dependencies

```bash
# Download all dependencies
pnpm install

# Verify offline mode works
pnpm install --offline

# Create tarball backup
tar -czf node_modules_backup.tar.gz node_modules pnpm-lock.yaml
```

### 2. Python Offline Setup

```bash
# Download wheels
pip download -r requirements.txt -d ./wheels

# Install from local wheels
pip install --no-index --find-links=./wheels -r requirements.txt
```

### 3. Docker Images (Pre-pulled)

```bash
# Pull all images
docker compose pull

# Save images to tar
docker save $(docker images -q) -o docker-images.tar

# Load on offline machine
docker load -i docker-images.tar
```

## Security & Compliance

### Supply Chain Security

```bash
# 1. Enable provenance
pnpm config set provenance true

# 2. Verify signatures
pnpm install --verify-signatures

# 3. Lock file integrity
pnpm install --frozen-lockfile

# 4. Audit dependencies
pnpm audit --audit-level=moderate
```

### License Compliance

```bash
# Generate license report
pnpm licenses list --json > licenses.json

# Check for incompatible licenses
# Avoid: GPL (if proprietary), SSPL
# Prefer: MIT, Apache-2.0, BSD
```

## Vendored Directory Structure

```
lib/vendored/
├── README.md              # Why vendored, update process
├── react-flow/
│   ├── package.json       # Original package.json
│   ├── LICENSE            # Original license
│   ├── VENDORED.md        # Date vendored, version, reason
│   └── dist/              # Compiled assets
├── icons/
│   ├── VENDORED.md
│   └── [icon-files]
└── shadcn-ui/
    ├── VENDORED.md
    └── components/        # Already following this pattern!
```

## Update Checklist

When updating vendored dependencies:

- [ ] Check upstream changelog for breaking changes
- [ ] Download new version
- [ ] Update VENDORED.md with new version and date
- [ ] Run full test suite
- [ ] Update imports if API changed
- [ ] Verify offline build works
- [ ] Update documentation
- [ ] Commit with detailed message

## Tooling

### Custom Scripts

```json
// package.json
{
  "scripts": {
    "vendor:check": "node scripts/check-vendored.js",
    "vendor:update": "node scripts/update-vendored.js",
    "offline:verify": "pnpm install --offline && pnpm build"
  }
}
```

---

**Remember**: Vendoring is about control and predictability. Not every dependency needs vendoring, but critical UI/UX dependencies should be vendored for production stability.
