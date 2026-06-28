# ✦ The Grand Mehta Palace
## Complete Hotel + Restaurant Management Ecosystem

---

## 🗂️ Project Structure

```
hotel web/
├── index.html                  ← 🏨 Main Landing Page (Start Here)
├── css/
│   ├── global.css              ← Design system, tokens, components
│   └── landing.css             ← Landing page specific styles
├── js/
│   ├── firebase-config.js      ← Real-time DB engine + seed data
│   ├── i18n.js                 ← Multi-language (EN / HI / GU)
│   ├── landing.js              ← Landing page logic
│   └── utils.js                ← Shared utilities (toast, PDF, etc.)
└── pages/
    ├── customer.html           ← 👤 Customer ordering system
    ├── chef.html               ← 👨‍🍳 Kitchen workflow dashboard
    ├── manager.html            ← 📋 Manager full dashboard
    └── owner.html              ← 👑 Owner analytics dashboard
```

---

## 🚀 How to Run

### Option 1 — Direct Open (Instant, No Server Needed)
Simply double-click `index.html` to open in your browser.

### Option 2 — Local Server (Recommended for best performance)
```bash
# Using Python
python -m http.server 8080
# Then open: http://localhost:8080

# Using Node.js
npx serve .
# Then open: http://localhost:3000
```

---

## 🔐 Login Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Chef    | chef@hotel.com         | chef123     |
| Manager | manager@hotel.com      | manager123  |
| Owner   | owner@hotel.com        | owner123    |

> Customer does NOT require login — just enter table number (1–10)

---

## 🌟 Feature Overview

### 🏨 Landing Page (index.html)
- Cinematic fullscreen hero with auto-sliding images
- About Hotel, Gallery, Facilities, Team, Reviews, Contact
- Table reservation form
- Role selection cards (Customer / Chef / Manager / Owner)
- Dark + Light mode toggle
- English / Hindi / Gujarati language switcher

### 👤 Customer Dashboard (pages/customer.html)
- Enter via table number (1–10)
- Browse full menu by category (Starters, Main, Fast Food, Drinks, Desserts)
- Add to cart with qty controls
- Special instructions per order
- Real-time order status tracking (Preparing → Cooking → Ready → Served)
- Live GST calculation + order total

### 👨‍🍳 Chef Dashboard (pages/chef.html)
- Live incoming orders with real-time updates
- Accept ✓ or Reject ✕ each order
- Mark orders as Ready when done
- Live stats: New / Cooking / Ready / Served today
- Kitchen timer showing order age

### 📋 Manager Dashboard (pages/manager.html)
- Live Orders monitoring with Mark Served / Mark Paid
- Table Monitor — click to cycle status (Available → Reserved → Occupied)
- Attendance management — mark Present / Late / Absent per staff
- Staff & Shifts view
- Salary overview
- Leave request submission & approval
- Reservations list

### 👑 Owner Dashboard (pages/owner.html)
- Revenue analytics with Chart.js (Daily / Weekly / Monthly toggle)
- Orders by Category donut chart
- Top Ordered Items list
- Complete Order History table
- Billing — generate printable PDF bills with UPI QR placeholder
- Menu Control — toggle any food item ON/OFF
- Staff & Salary management
- Attendance reports
- Leave approvals
- Live table status

---

## 💡 Real-time Architecture

The system uses an **in-memory real-time database** (firebase-config.js) that:
- Fires listeners instantly when data changes (like Firestore `onSnapshot`)
- Shares state across all tabs/dashboards
- Seeds 10 tables, 17 menu items, 5 staff, sample orders on load

### To Connect Real Firebase:
1. Create project at https://console.firebase.google.com
2. Replace `firebaseConfig` in `js/firebase-config.js` with your credentials
3. Add Firebase SDK scripts to each HTML file
4. Replace `window.firestore.*` calls with actual Firestore SDK calls

---

## 📲 WhatsApp Notifications
In `js/utils.js`, the `sendWhatsApp()` function is ready.
Uncomment the `window.open(...)` line and replace phone numbers with real ones.

---

## 🖨️ PDF Bill Generation
Click **"🖨️ Print Bill"** on any served order in the Owner dashboard.
A print-ready bill window opens with:
- Hotel logo & details
- Table number, date/time
- Itemized list with GST breakdown
- UPI QR placeholder area

---

## 🌐 Language Support
Switch languages from any page using the language selector dropdown:
- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Gujarati (ગુજરાતી)

---

## 🎨 Design System
- **Colors**: Gold (#C9A84C), Deep Dark (#0A0A0F), Cream (#FDF8F0)
- **Fonts**: Playfair Display (headings), Inter (body), Cormorant Garamond (accents)
- **Effects**: Glassmorphism, gold glow, smooth transitions, scroll animations
- **Mode**: Full Dark + Light theme with localStorage persistence
- **Responsive**: Desktop + Tablet + Mobile optimized

---

## 🔮 Future Upgrades (Production-Ready Hooks)
- [ ] Replace mock DB with Firebase Firestore (hooks already in place)
- [ ] Add Firebase Auth for real login
- [ ] Integrate real WhatsApp Business API
- [ ] Add actual UPI payment gateway (Razorpay/PayU)
- [ ] Add QR code scanner for table entry
- [ ] Add push notifications via Firebase Cloud Messaging
- [ ] Add email receipts via EmailJS or SendGrid

---

*Built with ❤️ — The Grand Mehta Palace Management System*
