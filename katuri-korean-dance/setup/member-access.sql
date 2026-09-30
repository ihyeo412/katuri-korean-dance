-- Run in the selected Supabase project's SQL editor before enabling the site.
-- No real member names, emails or locations belong in the public repository.
begin;
create table public.katuri_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  approved boolean not null default false
);
create table public.member_meetings (
  event_id text primary key,
  title text not null,
  meeting_time text,
  meeting_place text,
  note text
);
alter table public.katuri_members enable row level security;
alter table public.member_meetings enable row level security;
revoke all on public.katuri_members, public.member_meetings from anon, authenticated;
grant select on public.katuri_members, public.member_meetings to authenticated;
create policy "Read own approval" on public.katuri_members for select to authenticated
using (user_id = (select auth.uid()));
create policy "Approved members read meeting details" on public.member_meetings for select to authenticated
using (exists (select 1 from public.katuri_members m where m.user_id = (select auth.uid()) and m.approved = true));
-- No client INSERT/UPDATE/DELETE policies: approval and locations are admin-managed.
commit;
