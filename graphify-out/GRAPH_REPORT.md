git # Graph Report - .  (2026-08-11)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 364 nodes · 678 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- card.tsx
- dependencies
- handleError
- devDependencies
- (dashboard)/page.tsx
- compilerOptions
- prisma.ts
- validate.py
- cn
- components.json
- campaigns.ts
- app/layout.tsx
- extends
- postcss.config.mjs
- (auth)/layout.tsx
- middleware.ts
- next.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 26 edges
2. `handleError()` - 17 edges
3. `Card` - 16 edges
4. `CardHeader` - 16 edges
5. `CardTitle` - 16 edges
6. `CardContent` - 16 edges
7. `Button` - 15 edges
8. `compilerOptions` - 15 edges
9. `prisma` - 14 edges
10. `read_text()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `generateTrackingToken()`  [EXTRACTED]
  prisma/seed.ts → src/lib/tracking/token.ts
- `LoginPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(auth)/login/page.tsx → src/lib/auth/supabase-client.ts
- `RegisterPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(auth)/register/page.tsx → src/lib/auth/supabase-client.ts
- `POST()` --calls--> `handleError()`  [EXTRACTED]
  src/app/api/campaigns/route.ts → src/lib/api-error.ts
- `POST()` --calls--> `handleError()`  [EXTRACTED]
  src/app/api/campaigns/send/route.ts → src/lib/api-error.ts

## Import Cycles
- None detected.

## Communities (21 total, 5 thin omitted)

### Community 0 - "card.tsx"
Cohesion: 0.08
Nodes (40): LoginPage(), RegisterPage(), CampaignWithRelations, dynamic, runtime, dynamic, dynamic, dynamic (+32 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (49): class-variance-authority, clsx, graphify, @hookform/resolvers, lucide-react, dependencies, class-variance-authority, clsx (+41 more)

### Community 2 - "handleError"
Cohesion: 0.09
Nodes (33): POST(), POST(), checkDatabase(), checkGroq(), checkOllama(), checkResend(), GET(), hasRealValue() (+25 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (31): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, postcss, tailwindcss, tsx (+23 more)

### Community 4 - "(dashboard)/page.tsx"
Cohesion: 0.13
Nodes (24): POST(), ResendEmailResponse, sendCampaignSchema, sendWithResend(), DashboardPage(), dynamic, percent(), TargetManager() (+16 more)

### Community 5 - "compilerOptions"
Cohesion: 0.08
Nodes (25): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+17 more)

### Community 6 - "prisma.ts"
Cohesion: 0.16
Nodes (16): GET(), GET(), transparentPixel, GET(), POST(), submitTrainingSchema, dynamic, adapter (+8 more)

### Community 7 - "validate.py"
Cohesion: 0.21
Nodes (21): Path, check_agents_headings(), check_citation_cff(), check_handoff_context(), check_no_legacy_hooks_file(), check_out_of_scope_sections(), check_part3_no_fabricated_config(), check_part3_project_structure() (+13 more)

### Community 8 - "cn"
Cohesion: 0.21
Nodes (10): MobileNav(), navItems, navItems, Sidebar(), Avatar, AvatarFallback, AvatarImage, CardFooter (+2 more)

### Community 9 - "components.json"
Cohesion: 0.15
Nodes (12): aliases, components, utils, rsc, $schema, style, tailwind, baseColor (+4 more)

### Community 10 - "campaigns.ts"
Cohesion: 0.26
Nodes (9): adapter, main(), prisma, POST(), createCampaign(), CreateCampaignInput, createCampaignSchema, getOrCreateDemoAdmin() (+1 more)

### Community 11 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 12 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

## Knowledge Gaps
- **128 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `$schema`, `style`, `rsc` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `prisma.ts` to `card.tsx`, `handleError`, `campaigns.ts`, `(dashboard)/page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `card.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `$schema` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08198757763975155 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `handleError` be split into smaller, more focused modules?**
  _Cohesion score 0.09080841638981174 - nodes in this community are weakly interconnected._