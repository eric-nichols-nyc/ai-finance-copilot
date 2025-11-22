-- =====================================================
-- Test Data for AI Finance Copilot
-- Run this in Supabase SQL Editor
-- This script automatically handles all ID relationships
-- =====================================================

-- Step 1: Insert or update test user
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'demo@example.com',  -- Change this to your test user email if needed
  'Demo User',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET "updatedAt" = NOW();

-- Step 2: Insert all test data with automatic ID resolution
WITH user_data AS (
  SELECT id as user_id FROM public."User" WHERE email = 'demo@example.com' LIMIT 1
),
-- Insert Categories
inserted_categories AS (
  INSERT INTO public."Category" (id, name, color, icon, "userId", "createdAt", "updatedAt")
  SELECT
    gen_random_uuid()::text,
    name,
    color,
    NULL,
    (SELECT user_id FROM user_data),
    NOW(),
    NOW()
  FROM (
    VALUES
      ('Groceries', '#10b981'),
      ('Dining', '#f59e0b'),
      ('Entertainment', '#8b5cf6'),
      ('Transportation', '#3b82f6'),
      ('Utilities', '#06b6d4'),
      ('Shopping', '#ec4899'),
      ('Healthcare', '#ef4444'),
      ('Subscription', '#a855f7')
  ) AS categories(name, color)
  WHERE NOT EXISTS (
    SELECT 1 FROM public."Category"
    WHERE "userId" = (SELECT user_id FROM user_data)
  )
  RETURNING id, name
),
-- Insert Bank Accounts
inserted_accounts AS (
  INSERT INTO public."Account" (id, name, type, balance, currency, "creditLimit", apr, "loanAmount", "remainingBalance", "loanTerm", "monthlyPayment", "userId", "createdAt", "updatedAt")
  SELECT
    gen_random_uuid()::text,
    name,
    type,
    balance,
    'USD',
    "creditLimit",
    apr,
    "loanAmount",
    "remainingBalance",
    "loanTerm",
    "monthlyPayment",
    (SELECT user_id FROM user_data),
    NOW(),
    NOW()
  FROM (
    VALUES
      -- Checking Account
      ('Chase Checking', 'CHECKING', 5420.50, NULL, NULL, NULL, NULL, NULL, NULL),
      -- Savings Account
      ('Marcus Savings', 'SAVINGS', 15000.00, NULL, NULL, NULL, NULL, NULL, NULL),
      -- Credit Cards
      ('Chase Sapphire Reserve', 'CREDIT_CARD', 2845.67, 10000, 19.99, NULL, NULL, NULL, NULL),
      ('American Express Gold', 'CREDIT_CARD', 1234.89, 5000, 21.99, NULL, NULL, NULL, NULL),
      ('Capital One Quicksilver', 'CREDIT_CARD', 567.23, 3000, 18.49, NULL, NULL, NULL, NULL),
      ('Discover It', 'CREDIT_CARD', 892.45, 4000, 20.24, NULL, NULL, NULL, NULL),
      ('Citi Double Cash', 'CREDIT_CARD', 1567.89, 7500, 17.99, NULL, NULL, NULL, NULL),
      -- Loans
      ('Honda Civic Auto Loan', 'LOAN', -18450.00, NULL, 4.9, 25000.00, 18450.00, 60, 465.23),
      ('Federal Student Loan', 'LOAN', -32780.00, NULL, 5.5, 45000.00, 32780.00, 120, 350.00),
      ('Personal Loan - Debt Consolidation', 'LOAN', -8920.00, NULL, 8.99, 12000.00, 8920.00, 36, 315.67)
  ) AS accounts(name, type, balance, "creditLimit", apr, "loanAmount", "remainingBalance", "loanTerm", "monthlyPayment")
  WHERE NOT EXISTS (
    SELECT 1 FROM public."Account"
    WHERE "userId" = (SELECT user_id FROM user_data)
  )
  RETURNING id, name, type
),
-- Get account IDs for recurring charges
checking_account AS (
  SELECT id FROM public."Account"
  WHERE name = 'Chase Checking'
  AND "userId" = (SELECT user_id FROM user_data)
  LIMIT 1
),
credit_card AS (
  SELECT id FROM public."Account"
  WHERE type = 'CREDIT_CARD'
  AND "userId" = (SELECT user_id FROM user_data)
  LIMIT 1
),
-- Get category IDs for recurring charges
categories AS (
  SELECT
    MAX(CASE WHEN name = 'Subscription' THEN id END) as subscription_id,
    MAX(CASE WHEN name = 'Healthcare' THEN id END) as healthcare_id,
    MAX(CASE WHEN name = 'Utilities' THEN id END) as utilities_id,
    MAX(CASE WHEN name = 'Transportation' THEN id END) as transportation_id,
    MAX(CASE WHEN name = 'Shopping' THEN id END) as shopping_id
  FROM public."Category"
  WHERE "userId" = (SELECT user_id FROM user_data)
)
-- Insert Recurring Charges
INSERT INTO public."RecurringCharge" (id, name, amount, frequency, "nextDueDate", "accountId", "categoryId", "userId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  name,
  amount,
  frequency::text,
  "nextDueDate",
  "accountId",
  "categoryId",
  (SELECT user_id FROM user_data),
  NOW(),
  NOW()
FROM (
  VALUES
    ('Netflix Subscription', 15.99, 'MONTHLY', NOW() + INTERVAL '5 days', (SELECT id FROM credit_card), (SELECT subscription_id FROM categories)),
    ('Spotify Premium', 10.99, 'MONTHLY', NOW() + INTERVAL '12 days', (SELECT id FROM credit_card), (SELECT subscription_id FROM categories)),
    ('Gym Membership', 49.99, 'MONTHLY', NOW() + INTERVAL '8 days', (SELECT id FROM credit_card), (SELECT healthcare_id FROM categories)),
    ('Electric Bill', 125.00, 'MONTHLY', NOW() + INTERVAL '15 days', (SELECT id FROM checking_account), (SELECT utilities_id FROM categories)),
    ('Internet Service', 79.99, 'MONTHLY', NOW() + INTERVAL '3 days', (SELECT id FROM checking_account), (SELECT utilities_id FROM categories)),
    ('Verizon Phone Plan', 85.00, 'MONTHLY', NOW() + INTERVAL '20 days', (SELECT id FROM credit_card), (SELECT utilities_id FROM categories)),
    ('Car Loan Payment', 465.23, 'MONTHLY', NOW() + INTERVAL '1 day', (SELECT id FROM checking_account), (SELECT transportation_id FROM categories)),
    ('Student Loan Payment', 350.00, 'MONTHLY', NOW() + INTERVAL '10 days', (SELECT id FROM checking_account), (SELECT shopping_id FROM categories)),
    ('Car Insurance', 145.00, 'MONTHLY', NOW() + INTERVAL '7 days', (SELECT id FROM checking_account), (SELECT transportation_id FROM categories)),
    ('Amazon Prime', 14.99, 'MONTHLY', NOW() + INTERVAL '18 days', (SELECT id FROM credit_card), (SELECT subscription_id FROM categories))
) AS recurring(name, amount, frequency, "nextDueDate", "accountId", "categoryId")
WHERE NOT EXISTS (
  SELECT 1 FROM public."RecurringCharge"
  WHERE "userId" = (SELECT user_id FROM user_data)
);

-- Show summary of inserted data
SELECT
  'Data insertion complete!' as status,
  (SELECT COUNT(*) FROM public."Category" WHERE "userId" = (SELECT id FROM public."User" WHERE email = 'demo@example.com')) as categories_count,
  (SELECT COUNT(*) FROM public."Account" WHERE "userId" = (SELECT id FROM public."User" WHERE email = 'demo@example.com')) as accounts_count,
  (SELECT COUNT(*) FROM public."RecurringCharge" WHERE "userId" = (SELECT id FROM public."User" WHERE email = 'demo@example.com')) as recurring_charges_count;
