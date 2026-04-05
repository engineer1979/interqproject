# Task Progress: Fix Signup Database Errors
Status: [3/6]

**Current State:**
- ✓ RPC migration: 20261201040000_fix_signup_profile_rpc.sql
- ✓ SimpleAuthContext.tsx: replaced upserts → .rpc('create_user_profile') + graceful company insert + toast feedback
- Vite HMR live update successful

**Steps:**
- [x] 1-3. Prep complete ✓
- [x] 4. Edit auth context ✓
- [ ] 5. User must run: npx supabase db push (apply RPC to DB)
- [ ] 6. Restart dev server (pnpm dev)
- [ ] 7. Test new signup at http://localhost:8081/auth → no DB errors
- [ ] 8. Complete

**Next:** Run `npx supabase db push` to deploy RPC, then restart server.
