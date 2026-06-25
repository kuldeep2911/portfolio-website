-- ============================================================
-- RLS HARDENING — run once in Supabase → SQL Editor → Run
-- ============================================================
-- Resets Row-Level Security to the correct model:
--   • Content tables: anyone can READ; only an authenticated admin can write.
--   • messages:       anyone can INSERT (contact form); only admin can read/modify.
-- This removes any over-permissive "public/anon can insert/update/delete"
-- policies that allow anonymous visitors to modify your data.
-- ============================================================

-- 1) Drop ALL existing policies on the relevant tables (clean slate).
do $$
declare r record;
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profile','brain_nodes','projects','skills',
        'ongoing_projects','social_links','messages'
      )
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 2) Make sure RLS is enabled everywhere.
alter table profile           enable row level security;
alter table brain_nodes       enable row level security;
alter table projects          enable row level security;
alter table skills            enable row level security;
alter table ongoing_projects  enable row level security;
alter table social_links      enable row level security;
alter table messages          enable row level security;

-- 3) CONTENT TABLES — public read, authenticated (admin) write.
--    Helper pattern applied to each content table.
do $$
declare t text;
begin
  foreach t in array array[
    'profile','brain_nodes','projects','skills','ongoing_projects','social_links'
  ]
  loop
    execute format('create policy "read_%1$s"   on public.%1$I for select using (true);', t);
    execute format('create policy "insert_%1$s" on public.%1$I for insert to authenticated with check (true);', t);
    execute format('create policy "update_%1$s" on public.%1$I for update to authenticated using (true) with check (true);', t);
    execute format('create policy "delete_%1$s" on public.%1$I for delete to authenticated using (true);', t);
  end loop;
end $$;

-- 4) MESSAGES — anyone can submit the contact form; only admin can read/modify.
create policy "insert_messages" on public.messages for insert with check (true);
create policy "read_messages"   on public.messages for select to authenticated using (true);
create policy "update_messages" on public.messages for update to authenticated using (true) with check (true);
create policy "delete_messages" on public.messages for delete to authenticated using (true);

-- ============================================================
-- After running, verify in Dashboard → Authentication → Policies:
-- every table should show ONE "read_*" SELECT (public) and the
-- insert/update/delete policies should say "authenticated" (NOT public).
-- messages should show insert=public, the rest=authenticated.
-- ============================================================
