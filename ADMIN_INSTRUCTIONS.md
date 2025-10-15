# Admin Panel Instructions

## 🔐 Admin Credentials

**Username:** `admin321`  
**Password:** `Admin77**`

## 📋 How to Access Admin Panel

### Local Development:
1. Start your dev server: `npm run dev`
2. Go to: **http://localhost:5173/admin**
3. Enter the admin credentials above
4. You'll see the admin dashboard with all orders!

### Production:
- Go to: **your-domain.com/admin**
- Login with admin credentials

## 🗄️ Database Setup for Admin Panel

**IMPORTANT:** Run this SQL in Supabase to allow the admin panel to view all orders:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **wokkqrtigvznkksswjcv**
3. Go to **SQL Editor**
4. Copy and paste the SQL from `ADMIN_DATABASE_UPDATE.sql`
5. Click **Run**

This updates the security policies to allow reading all orders (needed for admin panel).

## ✨ Admin Panel Features

### Dashboard Stats:
- 💰 **Total Revenue** - Sum of all completed orders
- 📦 **Total Orders** - Count of all orders
- ✅ **Completed Orders** - Successful orders
- ⏳ **Pending Orders** - Orders awaiting processing

### Order Management:
- 🔍 **Search** - Find orders by ID, user ID, or customer name
- 🎯 **Filter** - Filter by order status (pending, processing, completed, cancelled)
- 📊 **Full Order Details** - See all order information including:
  - Customer name and location
  - Order items and quantities
  - Total amount
  - Order status
  - Timestamp

### Order Details Shown:
- Order ID
- Customer name and shipping address
- Order date and time
- List of products ordered with flavors
- Total amount paid
- Current order status

## 🔒 Security Notes

**Current Setup (Development):**
- Admin credentials are hardcoded (username/password)
- Stored in localStorage after login
- Database policies allow reading all orders

**For Production (Recommended Improvements):**
1. Move admin credentials to environment variables
2. Create an `admin_users` table in database
3. Use proper role-based access control (RBAC)
4. Add admin-only API routes with service role key
5. Implement 2FA for admin accounts
6. Add audit logging for admin actions

## 🚀 Quick Start

```bash
# 1. Run the database update SQL in Supabase
# (Copy from ADMIN_DATABASE_UPDATE.sql)

# 2. Start your dev server
npm run dev

# 3. Open admin panel
# Go to: http://localhost:5173/admin

# 4. Login
# Username: admin321
# Password: Admin77**
```

## 📱 What You Can Do

✅ View all customer orders in real-time  
✅ Search orders by customer or order ID  
✅ Filter orders by status  
✅ See revenue and order statistics  
✅ View detailed order information  
✅ Monitor pending orders  

## 🛠️ Troubleshooting

### "No orders showing"
- Make sure you ran the `ADMIN_DATABASE_UPDATE.sql` in Supabase
- Check that you have some test orders in the database
- Try refreshing the page

### "Can't access /admin route"
- Make sure your dev server is running
- Try accessing: `http://localhost:5173/admin` (not `/admin` alone)

### "Login not working"
- Double-check credentials: `admin321` / `Admin77**`
- Check browser console for errors
- Clear localStorage and try again

## 🔄 Logging Out

Click the **"Logout"** button in the top right corner of the admin panel.

---

**Need Help?** Check the browser console for any error messages!

