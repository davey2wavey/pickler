-- Seed for local development. One demo user, plausible numbers, not David's.
-- Dates are relative to current_date so runway and current-month budgets stay live.
-- Sign in locally with demo@runway.local / runway-demo.

-- Demo user --------------------------------------------------------------------

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token,
  is_sso_user, is_anonymous
) values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'demo@runway.local',
  extensions.crypt('runway-demo', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{}', now(), now(),
  '', '', '', '', '', '', '', '', false, false
);

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  gen_random_uuid(),
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '{"sub":"00000000-0000-4000-8000-000000000001","email":"demo@runway.local","email_verified":true}',
  'email', now(), now(), now()
);

-- Accounts ---------------------------------------------------------------------

insert into public.accounts (id, user_id, name, type, opening_balance, opening_at, sort) values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Checking', 'checking', 4200.00, current_date - 100, 0),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'Savings', 'savings', 12500.00, current_date - 100, 1);

-- Categories -------------------------------------------------------------------

insert into public.categories (id, user_id, name, kind, color_token, sort) values
  ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Rent', 'spend', 'bad', 0),
  ('20000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'Groceries', 'spend', 'acc', 1),
  ('20000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Dining', 'spend', 'warn', 2),
  ('20000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'Transport', 'spend', 'acc', 3),
  ('20000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', 'Utilities', 'spend', 'warn', 4),
  ('20000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000001', 'Subscriptions', 'spend', 'warn', 5),
  ('20000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000001', 'Health', 'spend', 'ok', 6),
  ('20000000-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000001', 'Fun', 'spend', 'acc', 7),
  ('20000000-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000001', 'Travel', 'spend', 'acc', 8),
  ('20000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000001', 'Gifts', 'spend', 'ok', 9),
  ('20000000-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000001', 'Salary', 'income', 'ok', 10),
  ('20000000-0000-4000-8000-000000000012', '00000000-0000-4000-8000-000000000001', 'Freelance', 'income', 'ok', 11);

-- Transactions -----------------------------------------------------------------
-- (days ago, account, amount, payee, category). Negative is money out.

insert into public.transactions (user_id, account_id, occurred_at, amount, payee, category_id)
select
  '00000000-0000-4000-8000-000000000001',
  case v.acct when 'c' then '10000000-0000-4000-8000-000000000001'::uuid else '10000000-0000-4000-8000-000000000002'::uuid end,
  current_date - v.days_ago,
  v.amount,
  v.payee,
  ('20000000-0000-4000-8000-0000000000' || lpad(v.cat::text, 2, '0'))::uuid
from (values
  -- Month 3 (about 90 to 61 days ago)
  (89, 'c',  3400.00, 'Acme Payroll', 11),
  (88, 'c', -1650.00, 'Maple Street Apartments', 1),
  (87, 'c',   -86.40, 'Trader Joes', 2),
  (86, 'c',   -42.10, 'Shell', 4),
  (84, 'c',   -31.75, 'Taqueria Cancun', 3),
  (83, 'c',  -118.00, 'PG&E', 5),
  (82, 'c',   -15.99, 'Netflix', 6),
  (81, 'c',   -64.22, 'Safeway', 2),
  (79, 'c',   -22.00, 'Clipper', 4),
  (78, 'c',   -58.90, 'Burma Superstar', 3),
  (76, 'c',  -140.00, 'CVS Pharmacy', 7),
  (75, 'c',   -12.99, 'Spotify', 6),
  (74, 'c',   -92.15, 'Trader Joes', 2),
  (72, 'c',   -48.00, 'Roxie Theater', 8),
  (71, 'c',   -37.60, 'Souvla', 3),
  (69, 'c',   -70.00, 'Comcast', 5),
  (68, 'c',   -55.10, 'Safeway', 2),
  (66, 'c',  -210.00, 'United Airlines', 9),
  (65, 'c',   -19.99, 'iCloud', 6),
  (63, 'c',   -27.30, 'Philz Coffee', 3),
  (62, 'c',  -44.80, 'Shell', 4),
  -- Month 2 (about 60 to 31 days ago)
  (59, 'c',  3400.00, 'Acme Payroll', 11),
  (58, 'c', -1650.00, 'Maple Street Apartments', 1),
  (57, 'c',   -79.05, 'Trader Joes', 2),
  (56, 'c',  1200.00, 'Northbeach Studio', 12),
  (55, 'c',   -33.40, 'Taqueria Cancun', 3),
  (53, 'c',  -112.60, 'PG&E', 5),
  (52, 'c',   -15.99, 'Netflix', 6),
  (51, 'c',   -61.30, 'Safeway', 2),
  (49, 'c',   -22.00, 'Clipper', 4),
  (48, 'c',   -72.45, 'Nopa', 3),
  (46, 'c',   -60.00, 'Gift for Mom', 10),
  (45, 'c',   -12.99, 'Spotify', 6),
  (44, 'c',   -88.70, 'Trader Joes', 2),
  (42, 'c',   -35.00, 'SF MOMA', 8),
  (41, 'c',   -29.15, 'Souvla', 3),
  (39, 'c',   -70.00, 'Comcast', 5),
  (38, 'c',   -49.95, 'Safeway', 2),
  (36, 'c',   -95.00, 'One Medical', 7),
  (35, 'c',   -19.99, 'iCloud', 6),
  (33, 'c',   -24.60, 'Philz Coffee', 3),
  (32, 'c',   -41.20, 'Shell', 4),
  -- Month 1 (about 30 days ago to today)
  (29, 'c',  3400.00, 'Acme Payroll', 11),
  (28, 'c', -1650.00, 'Maple Street Apartments', 1),
  (27, 'c',   -83.90, 'Trader Joes', 2),
  (25, 'c',   -38.25, 'Taqueria Cancun', 3),
  (23, 'c',  -121.30, 'PG&E', 5),
  (22, 'c',   -15.99, 'Netflix', 6),
  (21, 'c',   -66.10, 'Safeway', 2),
  (19, 'c',   -22.00, 'Clipper', 4),
  (18, 'c',   -54.75, 'Burma Superstar', 3),
  (16, 'c',   -40.00, 'Gift for Sam', 10),
  (15, 'c',   -12.99, 'Spotify', 6),
  (14, 'c',   -90.40, 'Trader Joes', 2),
  (12, 'c',   -52.00, 'Oracle Park', 8),
  (11, 'c',   -31.85, 'Souvla', 3),
  (9,  'c',   -70.00, 'Comcast', 5),
  (8,  'c',   -57.65, 'Safeway', 2),
  (6,  'c',   -19.99, 'iCloud', 6),
  (4,  'c',   -26.40, 'Philz Coffee', 3),
  (2,  'c',   -43.10, 'Shell', 4)
) as v(days_ago, acct, amount, payee, cat);

-- Two transfers: checking to savings. Both rows share a group. Not spend, not income.

insert into public.transactions (user_id, account_id, occurred_at, amount, payee, memo, transfer_group) values
  ('00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', current_date - 85, -500.00, 'Transfer', 'to Savings', '30000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', current_date - 85,  500.00, 'Transfer', 'from Checking', '30000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', current_date - 25, -500.00, 'Transfer', 'to Savings', '30000000-0000-4000-8000-000000000002'),
  ('00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', current_date - 25,  500.00, 'Transfer', 'from Checking', '30000000-0000-4000-8000-000000000002');

-- Plan -------------------------------------------------------------------------

insert into public.plans (id, user_id, name, sort) values
  ('40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Trips', 0);

insert into public.plan_items (id, user_id, plan_id, name, note) values
  ('50000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'Japan', 'Two weeks in spring'),
  ('50000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'Tahoe', 'Long weekend');

-- Expected ---------------------------------------------------------------------

insert into public.expected (user_id, name, amount, due_at, repeat, account_id, category_id, plan_item_id) values
  ('00000000-0000-4000-8000-000000000001', 'Rent', 1650.00, (date_trunc('month', current_date) + interval '1 month')::date, 'monthly', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', null),
  ('00000000-0000-4000-8000-000000000001', 'Car insurance', 420.00, current_date + 18, 'yearly', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000004', null),
  ('00000000-0000-4000-8000-000000000001', 'Japan flights', 1100.00, current_date + 45, 'none', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000009', '50000000-0000-4000-8000-000000000001');

-- Budgets for the current month -------------------------------------------------

insert into public.budgets (user_id, category_id, month, amount)
select '00000000-0000-4000-8000-000000000001', id, date_trunc('month', current_date)::date, b.amount
from public.categories c
join (values
  ('Rent', 1650.00), ('Groceries', 400.00), ('Dining', 250.00), ('Transport', 150.00),
  ('Utilities', 200.00), ('Subscriptions', 60.00), ('Health', 100.00), ('Fun', 120.00)
) as b(name, amount) on b.name = c.name
where c.user_id = '00000000-0000-4000-8000-000000000001';
