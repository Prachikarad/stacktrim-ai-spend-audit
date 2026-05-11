create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text,
  company_name text,
  team_size integer,
  monthly_savings numeric not null default 0,
  annual_savings numeric not null default 0,
  credex_fit boolean not null default false,
  audit jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "Allow anonymous lead inserts" on public.leads;

create policy "Allow anonymous lead inserts"
on public.leads
for insert
to anon
with check (
  email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);
