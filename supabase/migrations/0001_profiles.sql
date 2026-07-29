-- profiles: kullanıcı kimliği (username + avatar). auth.users ile 1-1.
-- Skor/xp/level/role BU tabloda değil — onlar Faz'da Edge Function ile gelir
-- (bkz. docs/mobile-standards/SUPABASE-RLS.md). Şimdilik yalnız kimlik alanları.
create table if not exists public.profiles (
  id         uuid        primary key references auth.users (id) on delete cascade,
  username   text        not null unique,
  avatar_id  text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Kullanıcı yalnızca kendi profilini görebilir/oluşturabilir/güncelleyebilir.
-- (Public okuma leaderboard geldiğinde ayrı policy ile açılacak.)
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
