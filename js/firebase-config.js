// ============================================================
// REAL FIREBASE FIRESTORE - Hotel Management System
// ============================================================
// STEP 1: Paste your Firebase config below
const firebaseConfig = {
  apiKey: "process.env.FIREBASE_API_KEY",
  authDomain: "process.env.FIREBASE_AUTH_DOMAIN",
  databaseURL: "process.env.FIREBASE_DATABASE_URL",
  projectId: "process.env.FIREBASE_PROJECT_ID",
  storageBucket: "process.env.FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "process.env.FIREBASE_MESSAGING_SENDER_ID",
  appId: "process.env.FIREBASE_APP_ID",
  measurementId: "process.env.FIREBASE_MEASUREMENT_ID"
};
    
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ── Collection name mapping (local alias → Firestore collection) ──
const COL = {
  menu:'menu_items', tables:'restaurant_tables', orders:'orders',
  order_items:'order_items', staff:'users', attendance:'attendance',
  reviews:'reviews', reservations:'reservations', leave_requests:'leave_requests',
  notifications:'notifications', analytics:'analytics', billing:'billing'
};

// ── Local cache (populated by real-time snapshots) ──
const cache = {};
Object.keys(COL).forEach(k => cache[k] = {});

// ── Timestamp converter (Firestore Timestamp → ISO string) ──
function convertTimestamps(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {...obj};
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (val && typeof val === 'object' && typeof val.toDate === 'function') {
      out[key] = val.toDate().toISOString();
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      out[key] = convertTimestamps(val);
    }
  }
  return out;
}

// ── Firestore CRUD API (same interface as before) ──
window.firestore = {
  // Create or set document
  async set(col, id, data) {
    const colName = COL[col] || col;
    const clean = {...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()};
    delete clean.id; delete clean._ts;
    if (id) {
      await db.collection(colName).doc(id).set(clean, {merge:true});
      return id;
    } else {
      const ref = await db.collection(colName).add({...clean, createdAt: firebase.firestore.FieldValue.serverTimestamp()});
      return ref.id;
    }
  },

  // Get single document
  async get(col, id) {
    const colName = COL[col] || col;
    const snap = await db.collection(colName).doc(id).get();
    return snap.exists ? convertTimestamps({id: snap.id, ...snap.data()}) : null;
  },

  // Get all documents
  async getAll(col) {
    const colName = COL[col] || col;
    const snap = await db.collection(colName).get();
    return snap.docs.map(d => convertTimestamps({id: d.id, ...d.data()}));
  },

  // Update document
  async update(col, id, data) {
    const colName = COL[col] || col;
    const clean = {...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()};
    delete clean.id;
    await db.collection(colName).doc(id).update(clean);
  },

  // Delete document
  async delete(col, id) {
    const colName = COL[col] || col;
    await db.collection(colName).doc(id).delete();
  },

  // Real-time listener (returns unsubscribe function)
  onSnapshot(col, callback) {
    const colName = COL[col] || col;
    return db.collection(colName).onSnapshot(snap => {
      const items = [];
      cache[col] = {};
      snap.forEach(doc => {
        const item = convertTimestamps({id: doc.id, ...doc.data()});
        items.push(item);
        cache[col][doc.id] = item;
      });
      callback(items);
    }, err => console.error(`Snapshot error [${colName}]:`, err));
  },

  // Query helper
  async query(col, field, op, value) {
    const colName = COL[col] || col;
    const snap = await db.collection(colName).where(field, op, value).get();
    return snap.docs.map(d => ({id: d.id, ...d.data()}));
  }
};

// ── Auth Engine ──────────────────────────────────────────────
// Uses Firestore credential check instead of Firebase Auth API
// (avoids identitytoolkit API restrictions on file:// origins)
const fireAuth = firebase.auth();

window.hotelAuth = {
  currentUser: null,

  async signIn(email, pw) {
    const emailClean = (email || '').trim().toLowerCase();
    console.log('🔐 LOGIN ATTEMPT — Email:', emailClean);
    console.log('   Project ID:', firebaseConfig.projectId);
    console.log('   Auth Domain:', firebaseConfig.authDomain);

    // ── Check Firestore users collection ──
    try {
      console.log('   → Checking Firestore users collection...');
      const snap = await db.collection('users')
        .where('email', '==', emailClean)
        .where('password', '==', pw)
        .limit(1).get();

      if (!snap.empty) {
        const u = snap.docs[0].data();
        console.log('   ✅ Firestore credential match:', u.role);
        this.currentUser = { email: emailClean, role: u.role || 'customer', name: u.name || emailClean, uid: snap.docs[0].id };
        localStorage.setItem('hotelUser', JSON.stringify(this.currentUser));
        return this.currentUser;
      }
    } catch(dbErr) {
      console.warn('   ⚠️ Firestore lookup failed:', dbErr.message);
    }

    // ── Step 3: Try Firebase Auth as last resort ──
    try {
      console.log('   → Trying Firebase Auth...');
      const cred = await fireAuth.signInWithEmailAndPassword(emailClean, pw);
      console.log('   ✅ Firebase Auth success, UID:', cred.user.uid);

      let role = 'customer', name = emailClean.split('@')[0];
      if (emailClean.includes('chef')) role = 'chef';
      else if (emailClean.includes('manager')) role = 'manager';
      else if (emailClean.includes('owner')) role = 'owner';

      this.currentUser = { email: emailClean, role, name, uid: cred.user.uid };
      localStorage.setItem('hotelUser', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch(authErr) {
      console.warn('   ⚠️ Firebase Auth failed:', authErr.code, '—', authErr.message);
    }

    // ── All methods failed ──
    console.error('   ❌ LOGIN FAILED — all auth methods rejected credentials');
    throw { code: 'auth/invalid-credential', message: 'Invalid email or password.' };
  },

  signOut() {
    fireAuth.signOut().catch(()=>{});
    this.currentUser = null;
    localStorage.removeItem('hotelUser');
    // Works from both / and /pages/
    const base = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    window.location.href = base;
  },

  getUser() {
    if (this.currentUser) return this.currentUser;
    const s = localStorage.getItem('hotelUser');
    if (s) { try { this.currentUser = JSON.parse(s); return this.currentUser; } catch(e){} }
    return null;
  },

  requireRole(role) {
    const u = this.getUser();
    if (!u || u.role !== role) {
      alert('Access denied. Please login as ' + role + '.');
      window.location.href = '../index.html';
      return false;
    }
    return true;
  }
};

// ── Export globals ──
window.HotelDB = { DB: cache, cache, db };
window.db = db;

console.log('🔥 Firebase Firestore connected');
