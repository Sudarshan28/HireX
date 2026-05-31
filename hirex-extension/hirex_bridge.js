// HireX Bridge Content Script
// Securely syncs local auth credentials into extension storage

const syncAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token) {
    chrome.storage.local.set({ token, user: user ? JSON.parse(user) : null }, () => {
      console.log('HireX Extension: Credentials synchronized successfully.');
    });
  } else {
    chrome.storage.local.remove(['token', 'user'], () => {
      console.log('HireX Extension: Credentials cleared.');
    });
  }
};

// Sync on load
syncAuth();

// Periodically check or listen to changes to keep it fresh
window.addEventListener('storage', (e) => {
  if (e.key === 'token' || e.key === 'user') {
    syncAuth();
  }
});

// Also check periodically in case of inline spa changes
setInterval(syncAuth, 2500);
