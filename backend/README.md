# VSchool portable backend

This directory contains framework-independent module code and composition factories. Next.js-specific adapters live in lib/server outside this directory. Browser-safe shared contracts live in shared/contracts.

Read [the extraction contract](../docs/BACKEND_EXTRACTION.md). Run pnpm check:backend and pnpm check:boundaries from the project root. A future NestJS host reuses this code and supplies its controller, identity, DI and lifecycle adapters; no Nest decorators belong in the portable core.
