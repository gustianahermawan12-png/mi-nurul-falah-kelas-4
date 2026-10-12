# Project Guidance

## User Preferences

- Mobile-first, desain modern dan bersih
- Warna dominan hijau Islami / khas MI Nurul Falah
- Orang tua read-only; hanya guru yang dapat mengubah data
- Kategori nilai harus dapat ditambah secara dinamis
- Harus disediakan akun guru awal beserta kredensialnya

## Verified Commands

- **typecheck**: `mops check --fix`
- **build**: `mops build`

## Learnings

- Backend: main.mo is the composition root with stable state, MixinAuthorization, MixinObjectStorage, domain mixins, and an OQL Expose with one entity per table plus .sample(...).
- Teacher credentials are seeded by the migration chain as username 'guru' / password 'guru123'.
- Motoko has no triple-quoted strings and no `return` keyword; bind the value to a local `let` and end the body with it.
- Time.now() returns Int; convert with .toNat() for Nat timestamps.
- Storage.ExternalBlob is an alias for Blob and the OQL BlobValue instance already covers it; no custom OptionalBlobValue module is needed.
- With check-limit=1, fold all initial stable state into a single migration file.
- Frontend: TanStack Router with role-guarded beforeLoad routes; session persisted in localStorage under 'mi-nurul-falah.session'.
- Frontend: all backend calls go through React Query hooks in src/frontend/src/hooks/useQueries.ts; format helpers in src/frontend/src/lib/format.ts.
- Frontend: tailwind.config.js must map the gold/success/warning OKLCH tokens declared in index.css or those classes silently no-op.
- Generated-app regression testing: the tester agent timed out repeatedly on this project and never produced a suite; the cover task was skipped and the build deployed without automated tests.
- Teacher write guards check AccessControl.hasPermission(accessControlState, caller, #admin); loginTeacher must grant the caller principal #admin or every teacher write traps with IC0503 'Unauthorized: hanya guru yang dapat mengubah data'.
- Storage.ExternalBlob is an alias for Blob and the OQL BlobValue instance already covers it.
- Local-deploy E2E testing repeatedly found teacher writes rejected with IC0503 despite loginTeacher granting #admin; the fix did not take effect in the deployed draft, so teacher write access remains unverified.
