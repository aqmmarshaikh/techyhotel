// ============================================================
// LANDING PAGE LOGIC
// ============================================================

// ── Utilities ──────────────────────────────────────────────
function showToast(msg, type='info') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  const icons = {success:'✅',error:'❌',info:'ℹ️'};
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.animation='slideOut 0.4s ease forwards'; setTimeout(()=>t.remove(),400); }, 3500);
}

function openModal(id){ document.getElementById(id).classList.add('active'); }
function closeModal(id){ document.getElementById(id).classList.remove('active'); }
window.closeModal = closeModal;

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click', e=>{ if(e.target===m) m.classList.remove('active'); });
});

// ── Page Loader ─────────────────────────────────────────────
window.addEventListener('load', ()=>{
  setTimeout(()=>{
    const loader = document.getElementById('page-loader');
    loader.classList.add('loader-hidden');
    setTimeout(()=>loader.remove(), 800);
  }, 1800);
});

// ── Theme Toggle ────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('hotelTheme', isDark ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isDark ? '🌙 Dark' : '☀️ Light';
}
window.toggleTheme = toggleTheme;

// Apply saved theme
(function(){
  const saved = localStorage.getItem('hotelTheme');
  if(saved) {
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('theme-btn');
    if(btn) btn.textContent = saved==='light' ? '🌙 Dark' : '☀️ Light';
  }
})();

// ── Nav Scroll ──────────────────────────────────────────────
window.addEventListener('scroll', ()=>{
  const nav = document.getElementById('landing-nav');
  if(nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

function toggleNav(){
  document.getElementById('nav-links').classList.toggle('open');
}
window.toggleNav = toggleNav;

// ── Hero Slider ─────────────────────────────────────────────
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dotsContainer = document.getElementById('hero-dots');

function initSlider() {
  if(!dotsContainer) return;
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'hero-dot' + (i===0?' active':'');
    d.onclick = ()=>goToSlide(i);
    dotsContainer.appendChild(d);
  });
  setInterval(nextSlide, 5000);
}

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  document.querySelectorAll('.hero-dot')[currentSlide]?.classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  document.querySelectorAll('.hero-dot')[currentSlide]?.classList.add('active');
}

function nextSlide(){ goToSlide(currentSlide+1); }

// ── Scroll Animations ───────────────────────────────────────
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
}, { threshold:0.15 });

document.querySelectorAll('.facility-card,.team-card,.gallery-item,.about-stat,.contact-item').forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(30px)';
  el.style.transition='opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ── Reviews Track ────────────────────────────────────────────
// ── Reviews Track ────────────────────────────────────────────
function loadReviews() {
  const track = document.getElementById('reviews-track');
  if(!track) return;
  // Listen to real Firestore reviews
  window.firestore.onSnapshot('reviews', reviews => {
    if (!reviews || reviews.length === 0) {
      track.innerHTML = '<div style="text-align:center;width:100%;color:var(--text-muted);padding:20px;">No reviews yet. Be the first to share your experience! ✦</div>';
      return;
    }
    const allReviews = [...reviews, ...reviews]; // duplicate for infinite scroll
    track.innerHTML = allReviews.map(r=>`
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.rating||5)}${'☆'.repeat(5-(r.rating||5))}</div>
        <p class="review-text">"${r.comment}"</p>
        <div class="flex justify-between items-center">
          <div class="review-author">${r.name}</div>
          <div class="review-date">${r.date || ''}</div>
        </div>
      </div>
    `).join('');
  });
}

// ── Settings Track ───────────────────────────────────────────
const defaultFacilities = [
  { icon: '📶', title: 'Free High-Speed WiFi', desc: 'Seamless connectivity throughout the property with 1Gbps fiber' },
  { icon: '🍽️', title: 'Premium Dining', desc: 'Award-winning multi-cuisine restaurant open 6 AM to midnight' },
  { icon: '❄️', title: 'Central AC', desc: 'Climate-controlled rooms with individual temperature settings' },
  { icon: '👨‍👩‍👧', title: 'Family Spaces', desc: 'Dedicated family suites and kids-friendly dining areas' },
  { icon: '🅿️', title: 'Secure Parking', desc: '24/7 valet and self-parking with CCTV surveillance' },
  { icon: '⚡', title: 'Fast Service', desc: 'Average room service delivery in under 15 minutes' },
  { icon: '🎉', title: 'Special Events', desc: 'Banquet halls for weddings, corporate events, and celebrations' },
  { icon: '📅', title: 'Easy Reservations', desc: 'Online table and room booking with instant confirmation' }
];

const defaultGallery = [
  { img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe2fa?w=800&q=80', title: 'Luxury Suite', size: 'large' },
  { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', title: 'Fine Dining', size: 'regular' },
  { img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80', title: 'Signature Dishes', size: 'regular' },
  { img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', title: 'Restaurant', size: 'regular' },
  { img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80', title: 'Outdoor Lounge', size: 'large' },
  { img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80', title: 'Chef Specials', size: 'regular' },
  { img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', title: 'Biryani Royale', size: 'regular' }
];

function loadSettings() {
  window.firestore.onSnapshot('settings', list => {
    const general = list.find(s => s.id === 'general') || {
      name: 'The Grand Mehta Palace',
      logo: '✦',
      address: '123 Palace Road, Navrangpura, Ahmedabad, Gujarat 380009',
      phone: '+91 79 2630 0000 / +91 98765 43210',
      email: 'info@grandmehtapalace.com / reservations@grandmehtapalace.com',
      timings: '6:00 AM – 12:00 AM',
      tax_percentage: 5,
      currency: '₹',
      about_desc1: 'Founded in 1995 by visionary entrepreneur Arjun Mehta, The Grand Mehta Palace has stood as Ahmedabad\'s crown jewel of hospitality. What began as a modest guesthouse has grown into a world-class destination.',
      about_desc2: 'Our philosophy is simple: every guest deserves a royal experience. From the hand-crafted interiors to the meticulously curated menu, every detail speaks of our commitment to excellence.',
      facilities: defaultFacilities,
      gallery: defaultGallery
    };

    const hotelLogo = general.logo || '✦';
    const hotelName = general.name || 'The Grand Mehta Palace';
    document.querySelectorAll('.nav-logo').forEach(el => el.textContent = `${hotelLogo} ${hotelName}`);
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const parts = hotelName.split(' ');
      if (parts.length >= 2) {
        const first = parts.slice(0, -2).join(' ') || parts[0];
        const last = parts.slice(-2).join(' ');
        heroTitle.innerHTML = `${first}<br/><span class="text-gold font-serif">${last}</span>`;
      } else {
        heroTitle.innerHTML = `<span class="text-gold font-serif">${hotelName}</span>`;
      }
    }
    
    const addrEl = document.getElementById('hotel-address');
    if (addrEl) addrEl.innerHTML = (general.address || '').replace(/, /g, ',<br/>');
    
    const phoneEl = document.getElementById('hotel-phone');
    if (phoneEl) phoneEl.innerHTML = (general.phone || '').replace(/ \/ /g, '<br/>');
    
    const emailEl = document.getElementById('hotel-email');
    if (emailEl) emailEl.innerHTML = (general.email || '').replace(/ \/ /g, '<br/>');
    
    const timingEl = document.getElementById('hotel-timings');
    if (timingEl) timingEl.innerHTML = `Restaurant: ${general.timings || '6:00 AM – 12:00 AM'}<br/>Reception: 24/7`;
    
    const about1El = document.getElementById('hotel-about-desc1');
    if (about1El) about1El.textContent = general.about_desc1 || '';
    
    const about2El = document.getElementById('hotel-about-desc2');
    if (about2El) about2El.textContent = general.about_desc2 || '';
    
    const footerAddress = document.getElementById('footer-address');
    if (footerAddress) footerAddress.textContent = `📍 ${general.address || ''}`;
    
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) footerPhone.textContent = `📞 ${general.phone || ''}`;
    
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) footerEmail.textContent = `✉️ ${general.email || ''}`;

    const facGrid = document.getElementById('facilities-grid');
    if (facGrid) {
      const facilitiesList = general.facilities || defaultFacilities;
      facGrid.innerHTML = facilitiesList.map(f => `
        <div class="facility-card">
          <div class="fac-icon">${f.icon}</div>
          <h4>${f.title}</h4>
          <p>${f.desc}</p>
        </div>
      `).join('');
    }

    const galGrid = document.getElementById('gallery-grid');
    if (galGrid) {
      const galleryList = general.gallery || defaultGallery;
      galGrid.innerHTML = galleryList.map(g => `
        <div class="gallery-item ${g.size === 'large' ? 'large' : ''}">
          <img src="${g.img}" alt="${g.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1551882547-ff40c63fe2fa?w=400'"/>
          <div class="gallery-overlay"><span>${g.title}</span></div>
        </div>
      `).join('');
    }
  });
}
window.loadSettings = loadSettings;

// ── Team Track ───────────────────────────────────────────────
function loadTeam() {
  const container = document.getElementById('team-grid');
  if(!container) return;
  
  window.firestore.onSnapshot('staff', staff => {
    const roleOrder = { owner: 1, manager: 2, chef: 3, waiter: 4 };
    const sorted = staff.slice()
      .filter(s => ['owner', 'manager', 'chef', 'waiter'].includes(s.role))
      .sort((a, b) => (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99));
      
    if (sorted.length === 0) return;
    
    container.innerHTML = sorted.map(s => {
      const isFeatured = s.role === 'owner';
      const photo = s.photo || (s.role === 'owner' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' : 
                               s.role === 'manager' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' :
                               s.role === 'chef' ? 'https://images.unsplash.com/photo-1583394293214-5b9c6a2a8a6a?w=400&q=80' :
                               'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80');
      const designation = s.designation || (s.role === 'owner' ? 'Owner & Founder' : 
                                           s.role === 'manager' ? 'General Manager' : 
                                           s.role === 'chef' ? 'Head Chef' : 'Lead Waiter');
      const desc = s.description || (s.role === 'owner' ? '30+ years in hospitality. Built this palace from ground up.' :
                                    s.role === 'manager' ? 'IHM graduate with 12 years managing 5-star properties.' :
                                    s.role === 'chef' ? 'Trained in Paris and Mumbai, Chef Ravi brings Michelin-star techniques.' :
                                    'Known for his warm smile and impeccable service etiquette.');
      const socialHtml = '<span>🔗</span><span>📸</span>';

      return `
        <div class="team-card ${isFeatured ? 'featured' : ''}">
          <div class="team-img-wrap">
            <img src="${photo}" alt="${s.name}" onerror="this.src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'"/>
            ${isFeatured ? '<div class="team-glow"></div>' : ''}
          </div>
          <div class="team-badge">${designation}</div>
          <h3 class="team-name">${s.name}</h3>
          <p class="team-role text-gold">${s.role.toUpperCase()}</p>
          <p class="team-desc">${desc}</p>
          <div class="team-exp">${s.joinDate ? (new Date().getFullYear() - new Date(s.joinDate).getFullYear()) + ' Years Experience' : '5 Years Experience'}</div>
          <div class="team-social">${socialHtml}</div>
        </div>
      `;
    }).join('');
  });
}
window.loadTeam = loadTeam;

// ── Star Picker ──────────────────────────────────────────────
let selectedRating = 5;
document.querySelectorAll('.star-opt').forEach(s=>{
  s.addEventListener('click', ()=>{
    selectedRating = parseInt(s.dataset.val);
    document.getElementById('review-rating').value = selectedRating;
    document.querySelectorAll('.star-opt').forEach((x,i)=>x.classList.toggle('active', i<selectedRating));
  });
  s.addEventListener('mouseover', ()=>{
    const v = parseInt(s.dataset.val);
    document.querySelectorAll('.star-opt').forEach((x,i)=>x.classList.toggle('active', i<v));
  });
});
document.getElementById('star-picker')?.addEventListener('mouseleave',()=>{
  document.querySelectorAll('.star-opt').forEach((x,i)=>x.classList.toggle('active', i<selectedRating));
});
document.querySelectorAll('.star-opt').forEach((_,i)=>{ if(i<5) document.querySelectorAll('.star-opt')[i].classList.add('active'); });

// ── Submit Review ─────────────────────────────────────────────
async function submitReview(e) {
  e.preventDefault();
  const name = document.getElementById('review-name').value.trim();
  const comment = document.getElementById('review-comment').value.trim();
  const rating = parseInt(document.getElementById('review-rating').value)||5;
  const review = { name, comment, rating, date:new Date().toISOString().split('T')[0] };
  await window.firestore.set('reviews', null, review);
  showToast('Thank you for your review! ✦', 'success');
  document.getElementById('review-form').reset();
  selectedRating=5;
  document.querySelectorAll('.star-opt').forEach((x,i)=>x.classList.toggle('active', i<5));
  loadReviews();
}
window.submitReview = submitReview;

// ── Reservation ──────────────────────────────────────────────
async function submitReservation(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('res-name').value,
    phone: document.getElementById('res-phone').value,
    datetime: document.getElementById('res-time').value,
    guests: document.getElementById('res-guests').value,
    notes: document.getElementById('res-notes').value,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  await window.firestore.set('reservations', null, data);
  showToast('Reservation confirmed! We\'ll call to verify. ✦', 'success');
  sendWhatsApp('manager', `📅 NEW RESERVATION\nName: ${data.name}\nTime: ${data.datetime}\nGuests: ${data.guests}\nPhone: ${data.phone}`);
  document.getElementById('reservation-form').reset();
}
window.submitReservation = submitReservation;

// ── WhatsApp Notifications ─────────────────────────────────
function sendWhatsApp(role, message) {
  // Replace with actual WhatsApp numbers
  const numbers = { owner:'919876543210', manager:'919876543211' };
  const num = numbers[role] || numbers.manager;
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  // Open in background - for demo just log
  console.log(`📲 WhatsApp to ${role}: ${message}`);
  // In production: window.open(url);
}
window.sendWhatsApp = sendWhatsApp;

// ── Role Entry ────────────────────────────────────────────────
let loginTargetRole = '';
function enterAs(role) {
  if(role === 'customer') { openModal('customer-modal'); return; }
  loginTargetRole = role;
  document.getElementById('login-role-label').textContent = `(${role.charAt(0).toUpperCase()+role.slice(1)})`;
  
  // Clear any existing values
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  
  openModal('login-modal');
}
window.enterAs = enterAs;

async function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  console.log('🔐 doLogin called with:', email, pw);
  try {
    const user = await window.hotelAuth.signIn(email, pw);
    closeModal('login-modal');
    showToast(`Welcome back, ${user.name}! Redirecting... ✦`, 'success');
    setTimeout(()=>{ window.location.href = `pages/${user.role}.html`; }, 1000);
  } catch(err) {
    console.error('❌ Login error:', err.code, err.message);
    const msgs = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/invalid-email': 'Invalid email format.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check connection.'
    };
    showToast(msgs[err.code] || `Auth error: ${err.code || err.message}`, 'error');
  }
}
window.doLogin = doLogin;

function enterCustomer() {
  const n = parseInt(document.getElementById('table-input').value);
  if(!n || n<1) { showToast('Please enter a valid table number', 'error'); return; }
  sessionStorage.setItem('customerTable', n);
  closeModal('customer-modal');
  window.location.href = `pages/customer.html?table=${n}`;
}
window.enterCustomer = enterCustomer;

function scrollToRoles(){
  document.getElementById('roles').scrollIntoView({behavior:'smooth',block:'start'});
}
window.scrollToRoles = scrollToRoles;

// ── Smooth Nav Links ──────────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click', e=>{
    const href = link.getAttribute('href');
    if(href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      document.getElementById('nav-links').classList.remove('open');
    }
  });
});

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', ()=>{
  initSlider();
  loadReviews();
  loadTeam();
  loadSettings();
  // Set min date for reservation
  const resTime = document.getElementById('res-time');
  if(resTime) resTime.min = new Date().toISOString().slice(0,16);
});
