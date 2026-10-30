-- Runway slice A: tables, RLS, views, indexes.
-- Mirrors the Runway 1.5.0 model. See apps/runway/SPEC.md.

-- Enums -----------------------------------------------------------------------

create type public.account_type as enum ('checking', 'savings', 'credit', 'cash', 'other');
create type public.category_kind as enum ('spend', 'income');
create type public.transaction_source as enum ('manual', 'import');
create type public.repeat_kind as enum ('none', 'monthly', 'yearly');
-- One of the ui tokens (packages/ui Tone), never a hex.
create type public.color_token as enum ('acc', 'ok', 'warn', 'bad');

-- Tables ----------------------------------------------------------------------

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  type public.account_type not null,
  currency text not null default 'USD',
  opening_balance numeric(14, 2) not null default 0,
  opening_at date not null default current_date,
  archived boolean not null default false,
  sort integer not null default 0
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  kind public.category_kind not null,
  color_token public.color_token not null default 'acc',
  sort integer not null default 0
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  occurred_at date not null,
  -- Negative is money out.
  amount numeric(14, 2) not null,
  payee text not null default '',
  memo text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  -- Two rows sharing a group are one transfer. Excluded from spend and income.
  transfer_group uuid,
  source public.transaction_source not null default 'manual',
  created_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  sort integer not null default 0
);

create table public.plan_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan_id uuid not null references public.plans (id) on delete cascade,
  name text not null,
  note text not null default ''
);

-- Fixed upcoming payments. Not spend until they occur.
create table public.expected (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  amount numeric(14, 2) not null check (amount > 0),
  due_at date not null,
  repeat public.repeat_kind not null default 'none',
  account_id uuid references public.accounts (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  plan_item_id uuid references public.plan_items (id) on delete set null,
  active boolean not null default true
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  -- First of the month.
  month date not null check (month = date_trunc('month', month)::date),
  amount numeric(14, 2) not null,
  unique (user_id, category_id, month)
);

-- Indexes ---------------------------------------------------------------------

create index transactions_user_occurred_idx on public.transactions (user_id, occurred_at);
create index transactions_account_idx on public.transactions (account_id);
create index expected_user_due_idx on public.expected (user_id, due_at);

-- Row level security ----------------------------------------------------------
-- Every table: owner only. user_id defaults to auth.uid() so inserts need not set it.

alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.plans enable row level security;
alter table public.plan_items enable row level security;
alter table public.expected enable row level security;
alter table public.budgets enable row level security;

create policy "owner" on public.accounts for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner" on public.categories for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner" on public.transactions for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner" on public.plans for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner" on public.plan_items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner" on public.expected for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owner" on public.budgets for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Views -----------------------------------------------------------------------
-- security_invoker so the caller's RLS applies. Without it a view runs as its
-- owner and leaks every user's rows.

-- Per account: opening balance plus every transaction.
create view public.account_balances with (security_invoker = true) as
select
  a.id,
  a.user_id,
  a.name,
  a.type,
  a.currency,
  a.archived,
  a.sort,
  a.opening_balance + coalesce(sum(t.amount), 0) as balance
from public.accounts a
left join public.transactions t on t.account_id = a.id
group by a.id;

-- Per user, month, category: money out, transfers excluded.
create view public.monthly_spend with (security_invoker = true) as
select
  t.user_id,
  date_trunc('month', t.occurred_at)::date as month,
  t.category_id,
  sum(-t.amount) as spend
from public.transactions t
where t.amount < 0 and t.transfer_group is null
group by t.user_id, date_trunc('month', t.occurred_at), t.category_id;

-- Per user: cash on hand divided by trailing 90-day average daily outflow.
-- Null with fewer than 30 days of data or no outflow in the window.
create view public.runway_days with (security_invoker = true) as
with span as (
  select user_id, current_date - min(occurred_at) as days_of_data
  from public.transactions
  group by user_id
),
cash as (
  select user_id, sum(balance) as cash
  from public.account_balances
  where type in ('checking', 'savings', 'cash') and not archived
  group by user_id
),
outflow as (
  select user_id, sum(-amount) as outflow
  from public.transactions
  where amount < 0
    and transfer_group is null
    and occurred_at > current_date - 90
  group by user_id
)
select
  s.user_id,
  s.days_of_data,
  coalesce(c.cash, 0) as cash,
  coalesce(o.outflow, 0) / least(90, greatest(s.days_of_data, 1)) as daily_outflow,
  case
    when s.days_of_data < 30 or coalesce(o.outflow, 0) <= 0 then null
    else round(coalesce(c.cash, 0) / (o.outflow / least(90, s.days_of_data)))
  end as days
from span s
left join cash c on c.user_id = s.user_id
left join outflow o on o.user_id = s.user_id;
