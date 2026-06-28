// ============================================================
// SHARED UTILITIES - Hotel Management System
// ============================================================

// ── Toast Notifications ─────────────────────────────────────
window.showToast = function(msg, type='info') {
  let c = document.getElementById('toast-container');
  if(!c){ c=document.createElement('div'); c.id='toast-container'; c.style.cssText='position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;'; document.body.appendChild(c); }
  const t = document.createElement('div');
  const icons = {success:'✅', error:'❌', info:'ℹ️', warning:'⚠️'};
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.animation='slideOut 0.4s ease forwards'; setTimeout(()=>t.remove(), 400); }, 3500);
};

// ── Modal Helpers ────────────────────────────────────────────
window.openModal  = id => document.getElementById(id)?.classList.add('active');
window.closeModal = id => document.getElementById(id)?.classList.remove('active');

// ── Format Currency ──────────────────────────────────────────
window.formatCurrency = n => {
  const general = (window.HotelDB?.cache?.settings || []).find(s => s.id === 'general');
  const symbol = general?.currency || '₹';
  return `${symbol}${Number(n||0).toLocaleString('en-IN')}`;
};

// ── Format Date ──────────────────────────────────────────────
window.formatDate = iso => iso ? new Date(iso).toLocaleString('en-IN', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';

// ── WhatsApp Notification ────────────────────────────────────
window.sendWhatsApp = function(role, message) {
  const numbers = { owner:'919876543210', manager:'919876543211', chef:'919876543212' };
  const num = numbers[role] || numbers.manager;
  // Uncomment below to actually open WhatsApp:
  // window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  console.log(`📲 WhatsApp [${role}]:`, message);
};

// ── Generate PDF & Print Billing Helpers ──────────────────────────
window.getBillHTML = function(orderId) {
  const orders = window.HotelDB?.cache?.orders || [];
  const order = orders.find(o => o.id === orderId);
  if(!order) return '';
  
  const general = (window.HotelDB?.cache?.settings || []).find(s => s.id === 'general') || {
    name: 'The Grand Mehta Palace',
    logo: '✦',
    address: '123 Palace Road, Navrangpura, Ahmedabad, Gujarat 380009',
    phone: '+91 79 2630 0000 / +91 98765 43210',
    email: 'info@grandmehtapalace.com / reservations@grandmehtapalace.com',
    timings: '6:00 AM – 12:00 AM',
    tax_percentage: 5,
    currency: '₹'
  };

  const symbol = general.currency || '₹';
  const taxRate = general.tax_percentage || 5;

  const items = (order.items||[]).map(i=>`
    <tr>
      <td style="padding: 6px 0; border-bottom: 1px dashed #ddd; text-align: left; color:#000;">${i.name}</td>
      <td style="padding: 6px 0; border-bottom: 1px dashed #ddd; text-align: center; color:#000;">${i.qty}</td>
      <td style="padding: 6px 0; border-bottom: 1px dashed #ddd; text-align: right; color:#000;">${symbol}${i.price}</td>
      <td style="padding: 6px 0; border-bottom: 1px dashed #ddd; text-align: right; color:#000;">${symbol}${i.price*i.qty}</td>
    </tr>`).join('');
    
  const sub = order.subtotal || order.total || 0;
  const tax = order.tax || Math.round(sub * (taxRate / 100));
  const total = sub + tax;
  const invoiceNo = order.id.slice(-6).toUpperCase();
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');

  return `
    <div style="font-family:'Courier New',Courier,monospace;line-height:1.4;color:#000;padding:10px;background:#fff;">
      <div style="text-align:center;margin-bottom:12px;">
        <span style="font-size:2rem;font-weight:bold;color:#000;">${general.logo || '✦'}</span>
        <h2 style="margin:4px 0 2px 0;font-size:1.3rem;text-transform:uppercase;color:#000;font-weight:bold;">${general.name || 'The Grand Mehta Palace'}</h2>
        <div style="font-size:0.75rem;color:#333;">Luxury Hotel & Fine Dining</div>
        <div style="font-size:0.75rem;color:#333;margin-top:2px;max-width:300px;margin-left:auto;margin-right:auto;">${general.address || ''}</div>
        <div style="font-size:0.75rem;color:#333;margin-top:2px;">Phone: ${general.phone || ''}</div>
      </div>
      
      <div style="border-top:1px dashed #000;border-bottom:1px dashed #000;padding:8px 0;margin-bottom:12px;font-size:0.8rem;color:#000;">
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Invoice No:</span><strong>#${invoiceNo}</strong></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Order ID:</span><span style="font-size:0.75rem;font-weight:bold;">${order.id}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Table:</span><strong>Table ${order.tableNumber}</strong></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Date:</span><span>${dateStr}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Payment Status:</span><strong>${order.paid ? 'PAID' : 'UNPAID'}</strong></div>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:0.8rem;margin-bottom:12px;color:#000;">
        <thead>
          <tr style="border-bottom:1px solid #000;">
            <th style="text-align:left;padding-bottom:4px;color:#000;">Item</th>
            <th style="text-align:center;padding-bottom:4px;width:40px;color:#000;">Qty</th>
            <th style="text-align:right;padding-bottom:4px;width:70px;color:#000;">Rate</th>
            <th style="text-align:right;padding-bottom:4px;width:70px;color:#000;">Amt</th>
          </tr>
        </thead>
        <tbody>
          ${items}
        </tbody>
      </table>

      <div style="font-size:0.82rem;margin-bottom:16px;color:#000;">
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>Subtotal:</span><span>${symbol}${sub.toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span>GST (${taxRate}%):</span><span>${symbol}${tax.toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:1rem;border-top:1px double #000;padding-top:4px;margin-top:4px;color:#000;"><span>Grand Total:</span><span>${symbol}${total.toLocaleString()}</span></div>
      </div>

      <div style="text-align:center;margin-top:20px;font-size:0.8rem;border-top:1px dashed #000;padding-top:12px;color:#000;">
        <div style="margin-bottom:8px;font-weight:bold;color:#000;">Scan to Pay via UPI</div>
        <div style="display:inline-block;padding:8px;background:#fff;border:1px solid #ccc;border-radius:4px;margin-bottom:8px;">
          <svg width="100" height="100" viewBox="0 0 29 29" style="display:block;margin:0 auto;shape-rendering:crispEdges;fill:#000;">
            <path d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 1h1v1h-1zm1 1h1v1h-1zm-2 1h1v1H9zm3 0h1v1h-1zm1 1h1v1h-1zm-4 1h1v1H9zm3 1h1v1h-1zM0 9h7v7H0zm1 1v5h5v-5zm11 0h1v1h-1zm-1 1h1v1h-1zm2 1h1v1h-1zm-2 2h1v1h-1zm1 1h1v1h-1zm-8 2h7v7H0zm1 1v5h5v-5zm11 0h1v1h-1zm-1 1h1v1h-1zm2 1h1v1h-1zm-2 2h1v1h-1zm1 1h1v1h-1zm10-18h7v7h-7zm1 1v5h5V1zm-2 8h1v1h-1zm2 0h1v1h-1zm1 1h1v1h-1zm1 1h1v1h-1zm-2 2h1v1h-1zm2 1h1v1h-1zm-4 2h1v1h-1zm1 1h1v1h-1zm1 1h1v1h-1zm1 1h1v1h-1z"/>
          </svg>
        </div>
        <div style="font-style:italic;margin-top:6px;color:#000;">Thank you for visiting.</div>
      </div>
    </div>
  `;
};

window.printBillDirectly = function(orderId) {
  const content = window.getBillHTML(orderId);
  if(!content) return;
  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>Receipt - ${orderId}</title>
        <style>
          @page { size: auto; margin: 0mm; }
          body { padding: 20px; background: #fff; color: #000; }
          @media print {
            body { padding: 10px; }
          }
        </style>
      </head>
      <body onload="window.print();window.close();">
        ${content}
      </body>
    </html>
  `);
  win.document.close();
};

window.downloadBillPDF = function(orderId) {
  const content = window.getBillHTML(orderId);
  if(!content) return;
  
  const element = document.createElement('div');
  element.style.padding = '20px';
  element.style.background = '#fff';
  element.innerHTML = content;
  
  const opt = {
    margin:       10,
    filename:     `bill_${orderId.slice(-6).toUpperCase()}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().from(element).set(opt).save();
  window.showToast('PDF downloaded successfully!', 'success');
};

window.shareBill = function(orderId) {
  const url = `${window.location.origin}/pages/bill_view.html?orderId=${orderId}`;
  navigator.clipboard.writeText(url);
  window.showToast('Bill link copied to clipboard! (Future-Ready)', 'success');
};

window.generateBill = window.printBillDirectly;

// ── Clock Helper ─────────────────────────────────────────────
window.startClock = function(elementId) {
  function tick(){ const el=document.getElementById(elementId); if(el) el.textContent=new Date().toLocaleTimeString('en-IN',{hour12:true,hour:'2-digit',minute:'2-digit',second:'2-digit'}); }
  tick(); return setInterval(tick, 1000);
};

// ── Theme Toggle ──────────────────────────────────────────────
window.toggleTheme = function() {
  const h = document.documentElement;
  const isDark = h.getAttribute('data-theme')==='dark';
  h.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('hotelTheme', isDark ? 'light' : 'dark');
};
// Apply saved theme on load
(()=>{
  const saved = localStorage.getItem('hotelTheme');
  if(saved) document.documentElement.setAttribute('data-theme', saved);
})();

// ── Order Status Colors ───────────────────────────────────────
window.statusColor = {
  preparing: '#F59E0B', cooking: '#F97316', ready: '#22C55E',
  served: '#6366F1', rejected: '#EF4444', paid: '#22C55E'
};

console.log('✅ Utils loaded');
