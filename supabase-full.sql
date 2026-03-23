-- =============================================
-- FOODDASH - CLEAN DATABASE SETUP
-- Only tables + policies. NO demo data.
-- All data comes from the app manually.
-- =============================================

-- STEP 1: DROP ALL OLD TABLES
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS delivery_partners CASCADE;
DROP TABLE IF EXISTS cookers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- STEP 2: USERS TABLE (all roles)
-- =============================================
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'cooker', 'delivery')),
  avatar TEXT DEFAULT '👤',
  address TEXT,
  kitchen_name TEXT,
  speciality TEXT,
  bio TEXT,
  vehicle_type TEXT,
  vehicle_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 3: CUSTOMERS TABLE
-- =============================================
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  delivery_address TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  preferred_payment TEXT DEFAULT 'COD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 4: COOKERS TABLE
-- =============================================
CREATE TABLE cookers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  kitchen_name TEXT NOT NULL,
  speciality TEXT,
  bio TEXT,
  location TEXT,
  rating NUMERIC DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  is_open BOOLEAN DEFAULT true,
  delivery_fee NUMERIC DEFAULT 30,
  delivery_time TEXT DEFAULT '30-45 min',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 5: DELIVERY PARTNERS TABLE
-- =============================================
CREATE TABLE delivery_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  vehicle_type TEXT NOT NULL DEFAULT 'Bike',
  vehicle_number TEXT NOT NULL DEFAULT '',
  is_online BOOLEAN DEFAULT false,
  current_location TEXT,
  total_deliveries INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 4.5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 6: FOODS TABLE (cooker posts food here)
-- =============================================
CREATE TABLE foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cooker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cooker_name TEXT NOT NULL,
  kitchen_name TEXT NOT NULL,
  location TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  is_veg BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  servings INTEGER DEFAULT 10,
  prep_time TEXT,
  rating NUMERIC DEFAULT 0,
  orders INTEGER DEFAULT 0,
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 7: RECIPES TABLE
-- =============================================
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cooker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cooker_name TEXT NOT NULL,
  kitchen_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT,
  video_url TEXT,
  ingredients TEXT[] DEFAULT '{}',
  steps TEXT[] DEFAULT '{}',
  prep_time TEXT,
  cook_time TEXT,
  servings TEXT,
  is_veg BOOLEAN DEFAULT true,
  difficulty TEXT DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  tips TEXT,
  likes INTEGER DEFAULT 0,
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 8: ORDERS TABLE (customer places order)
-- =============================================
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  cooker_id UUID REFERENCES users(id),
  kitchen_name TEXT NOT NULL,
  delivery_partner_id UUID REFERENCES users(id),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  platform_fee NUMERIC DEFAULT 5,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'preparing', 'ready', 'picked', 'on_way', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'COD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 9: FAVORITES TABLE
-- =============================================
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, food_id)
);

-- =============================================
-- STEP 10: CART TABLE
-- =============================================
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  cook_id UUID REFERENCES users(id),
  kitchen_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, food_id)
);

-- =============================================
-- STEP 11: ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 12: RLS POLICIES (Allow all operations)
-- =============================================

-- Users: anyone can read, insert, update
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete" ON users FOR DELETE USING (true);

-- Customers
CREATE POLICY "customers_select" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_update" ON customers FOR UPDATE USING (true);
CREATE POLICY "customers_delete" ON customers FOR DELETE USING (true);

-- Cookers
CREATE POLICY "cookers_select" ON cookers FOR SELECT USING (true);
CREATE POLICY "cookers_insert" ON cookers FOR INSERT WITH CHECK (true);
CREATE POLICY "cookers_update" ON cookers FOR UPDATE USING (true);
CREATE POLICY "cookers_delete" ON cookers FOR DELETE USING (true);

-- Delivery Partners
CREATE POLICY "partners_select" ON delivery_partners FOR SELECT USING (true);
CREATE POLICY "partners_insert" ON delivery_partners FOR INSERT WITH CHECK (true);
CREATE POLICY "partners_update" ON delivery_partners FOR UPDATE USING (true);
CREATE POLICY "partners_delete" ON delivery_partners FOR DELETE USING (true);

-- Foods: cooker uploads, customer views
CREATE POLICY "foods_select" ON foods FOR SELECT USING (true);
CREATE POLICY "foods_insert" ON foods FOR INSERT WITH CHECK (true);
CREATE POLICY "foods_update" ON foods FOR UPDATE USING (true);
CREATE POLICY "foods_delete" ON foods FOR DELETE USING (true);

-- Recipes
CREATE POLICY "recipes_select" ON recipes FOR SELECT USING (true);
CREATE POLICY "recipes_insert" ON recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "recipes_update" ON recipes FOR UPDATE USING (true);
CREATE POLICY "recipes_delete" ON recipes FOR DELETE USING (true);

-- Orders: customer places, cooker/delivery updates
CREATE POLICY "orders_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE USING (true);

-- Favorites
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (true);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (true);

-- Cart
CREATE POLICY "cart_select" ON cart_items FOR SELECT USING (true);
CREATE POLICY "cart_insert" ON cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "cart_update" ON cart_items FOR UPDATE USING (true);
CREATE POLICY "cart_delete" ON cart_items FOR DELETE USING (true);

-- =============================================
-- STEP 13: ENABLE REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE foods;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE recipes;

-- =============================================
-- DONE!
--
-- HOW IT WORKS:
-- 1. Cooker signs up → data saved to "users" + "cookers"
-- 2. Customer signs up → data saved to "users" + "customers"
-- 3. Delivery partner signs up → data saved to "users" + "delivery_partners"
-- 4. Cooker posts food → saved to "foods" table
-- 5. Customer browses → reads from "foods" table (real-time)
-- 6. Customer places order → saved to "orders" table
-- 7. Cooker/Delivery updates order → "orders" table updates (real-time)
-- 8. Customer tracks order → reads "orders" table (real-time)
--
-- ALL DATA IS MANUAL - NO DEMO DATA
-- =============================================
