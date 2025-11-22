-- =====================================================
-- Test Data for AI Finance Copilot
-- Run this in Supabase SQL Editor
-- =====================================================

-- First, insert a test user (or use your existing user's email)
-- Replace 'your-test-email@example.com' with your actual test user email
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'demo@example.com',  -- Change this to your test user email
  'Demo User',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET "updatedAt" = NOW()
RETURNING id;

-- Store the user id for later use
-- After running above, copy the user id and replace 'YOUR_USER_ID' below with it

-- =====================================================
-- INSERT CATEGORIES
-- =====================================================
INSERT INTO public."Category" (id, name, color, icon, "userId", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Groceries', '#10b981', NULL, 'YOUR_USER_ID', NOW(), NOW()),
  (gen_random_uuid()::text, 'Dining', '#f59e0b', NULL, 'YOUR_USER_ID', NOW(), NOW()),
  (gen_random_uuid()::text, 'Entertainment', '#8b5cf6', NULL, 'YOUR_USER_ID', NOW(), NOW()),
  (gen_random_uuid()::text, 'Transportation', '#3b82f6', NULL, 'YOUR_USER_ID', NOW(), NOW()),
  (gen_random_uuid()::text, 'Utilities', '#06b6d4', NULL, 'YOUR_USER_ID', NOW(), NOW()),
  (gen_random_uuid()::text, 'Shopping', '#ec4899', NULL, 'YOUR_USER_ID', NOW(), NOW()),
  (gen_random_uuid()::text, 'Healthcare', '#ef4444', NULL, 'YOUR_USER_ID', NOW(), NOW()),
  (gen_random_uuid()::text, 'Subscription', '#a855f7', NULL, 'YOUR_USER_ID', NOW(), NOW());

-- =====================================================
-- INSERT BANK ACCOUNTS
-- =====================================================
INSERT INTO public."Account" (id, name, type, balance, currency, "creditLimit", apr, "loanAmount", "remainingBalance", "loanTerm", "monthlyPayment", "userId", "createdAt", "updatedAt")
VALUES
  -- Checking Account
  (gen_random_uuid()::text, 'Chase Checking', 'CHECKING', 5420.50, 'USD', NULL, NULL, NULL, NULL, NULL, NULL, 'YOUR_USER_ID', NOW(), NOW()),

  -- Savings Account
  (gen_random_uuid()::text, 'Marcus Savings', 'SAVINGS', 15000.00, 'USD', NULL, NULL, NULL, NULL, NULL, NULL, 'YOUR_USER_ID', NOW(), NOW());

-- =====================================================
-- INSERT CREDIT CARDS
-- =====================================================
INSERT INTO public."Account" (id, name, type, balance, currency, "creditLimit", apr, "loanAmount", "remainingBalance", "loanTerm", "monthlyPayment", "userId", "createdAt", "updatedAt")
VALUES
  -- Credit Card 1
  (gen_random_uuid()::text, 'Chase Sapphire Reserve', 'CREDIT_CARD', 2845.67, 'USD', 10000, 19.99, NULL, NULL, NULL, NULL, 'YOUR_USER_ID', NOW(), NOW()),

  -- Credit Card 2
  (gen_random_uuid()::text, 'American Express Gold', 'CREDIT_CARD', 1234.89, 'USD', 5000, 21.99, NULL, NULL, NULL, NULL, 'YOUR_USER_ID', NOW(), NOW()),

  -- Credit Card 3
  (gen_random_uuid()::text, 'Capital One Quicksilver', 'CREDIT_CARD', 567.23, 'USD', 3000, 18.49, NULL, NULL, NULL, NULL, 'YOUR_USER_ID', NOW(), NOW()),

  -- Credit Card 4
  (gen_random_uuid()::text, 'Discover It', 'CREDIT_CARD', 892.45, 'USD', 4000, 20.24, NULL, NULL, NULL, NULL, 'YOUR_USER_ID', NOW(), NOW()),

  -- Credit Card 5
  (gen_random_uuid()::text, 'Citi Double Cash', 'CREDIT_CARD', 1567.89, 'USD', 7500, 17.99, NULL, NULL, NULL, NULL, 'YOUR_USER_ID', NOW(), NOW());

-- =====================================================
-- INSERT LOAN ACCOUNTS
-- =====================================================
INSERT INTO public."Account" (id, name, type, balance, currency, "creditLimit", apr, "loanAmount", "remainingBalance", "loanTerm", "monthlyPayment", "userId", "createdAt", "updatedAt")
VALUES
  -- Car Loan
  (gen_random_uuid()::text, 'Honda Civic Auto Loan', 'LOAN', -18450.00, 'USD', NULL, 4.9, 25000.00, 18450.00, 60, 465.23, 'YOUR_USER_ID', NOW(), NOW()),

  -- Student Loan
  (gen_random_uuid()::text, 'Federal Student Loan', 'LOAN', -32780.00, 'USD', NULL, 5.5, 45000.00, 32780.00, 120, 350.00, 'YOUR_USER_ID', NOW(), NOW()),

  -- Personal Loan
  (gen_random_uuid()::text, 'Personal Loan - Debt Consolidation', 'LOAN', -8920.00, 'USD', NULL, 8.99, 12000.00, 8920.00, 36, 315.67, 'YOUR_USER_ID', NOW(), NOW());

-- =====================================================
-- INSERT 10 RECURRING CHARGES
-- Note: You'll need to replace ACCOUNT_ID and CATEGORY_ID with actual IDs
-- Run this query first to get your IDs:
-- SELECT id, name FROM public."Account" WHERE "userId" = 'YOUR_USER_ID';
-- SELECT id, name FROM public."Category" WHERE "userId" = 'YOUR_USER_ID';
-- =====================================================

INSERT INTO public."RecurringCharge" (id, name, amount, frequency, "nextDueDate", "accountId", "categoryId", "userId", "createdAt", "updatedAt")
VALUES
  -- 1. Netflix
  (gen_random_uuid()::text, 'Netflix Subscription', 15.99, 'MONTHLY', NOW() + INTERVAL '5 days', 'CREDIT_CARD_ACCOUNT_ID', 'SUBSCRIPTION_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 2. Spotify
  (gen_random_uuid()::text, 'Spotify Premium', 10.99, 'MONTHLY', NOW() + INTERVAL '12 days', 'CREDIT_CARD_ACCOUNT_ID', 'SUBSCRIPTION_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 3. Gym
  (gen_random_uuid()::text, 'Gym Membership', 49.99, 'MONTHLY', NOW() + INTERVAL '8 days', 'CREDIT_CARD_ACCOUNT_ID', 'HEALTHCARE_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 4. Electric Bill
  (gen_random_uuid()::text, 'Electric Bill', 125.00, 'MONTHLY', NOW() + INTERVAL '15 days', 'CHECKING_ACCOUNT_ID', 'UTILITIES_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 5. Internet
  (gen_random_uuid()::text, 'Internet Service', 79.99, 'MONTHLY', NOW() + INTERVAL '3 days', 'CHECKING_ACCOUNT_ID', 'UTILITIES_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 6. Phone Bill
  (gen_random_uuid()::text, 'Verizon Phone Plan', 85.00, 'MONTHLY', NOW() + INTERVAL '20 days', 'CREDIT_CARD_ACCOUNT_ID', 'UTILITIES_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 7. Car Loan Payment
  (gen_random_uuid()::text, 'Car Loan Payment', 465.23, 'MONTHLY', NOW() + INTERVAL '1 day', 'CHECKING_ACCOUNT_ID', 'TRANSPORTATION_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 8. Student Loan Payment
  (gen_random_uuid()::text, 'Student Loan Payment', 350.00, 'MONTHLY', NOW() + INTERVAL '10 days', 'CHECKING_ACCOUNT_ID', 'SHOPPING_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 9. Car Insurance
  (gen_random_uuid()::text, 'Car Insurance', 145.00, 'MONTHLY', NOW() + INTERVAL '7 days', 'CHECKING_ACCOUNT_ID', 'TRANSPORTATION_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW()),

  -- 10. Amazon Prime
  (gen_random_uuid()::text, 'Amazon Prime', 14.99, 'MONTHLY', NOW() + INTERVAL '18 days', 'CREDIT_CARD_ACCOUNT_ID', 'SUBSCRIPTION_CATEGORY_ID', 'YOUR_USER_ID', NOW(), NOW());


-- =====================================================
-- EASIER VERSION: Use WITH clause to auto-populate IDs
-- =====================================================
-- Uncomment and run this instead if you want automated ID replacement:

/*
WITH user_data AS (
  SELECT id as user_id FROM public."User" WHERE email = 'demo@example.com' LIMIT 1
),
checking_account AS (
  SELECT id FROM public."Account" WHERE name = 'Chase Checking' LIMIT 1
),
credit_card AS (
  SELECT id FROM public."Account" WHERE type = 'CREDIT_CARD' LIMIT 1
),
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
INSERT INTO public."RecurringCharge" (id, name, amount, frequency, "nextDueDate", "accountId", "categoryId", "userId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  name,
  amount,
  frequency,
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
) AS recurring(name, amount, frequency, "nextDueDate", "accountId", "categoryId");
*/
