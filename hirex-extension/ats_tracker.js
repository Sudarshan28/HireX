// HireX ATS Auto-Tracker Content Script
// Automatically detects form submissions on Greenhouse, Lever, and Workday

// Parse URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const hirexJobId = urlParams.get('hirex_job_id');

if (hirexJobId) {
  // Store the job ID in storage under the current domain name
  const domain = window.location.hostname;
  chrome.storage.local.get(['pending_apps'], (result) => {
    const pending = result.pending_apps || {};
    pending[domain] = hirexJobId;
    chrome.storage.local.set({ pending_apps: pending }, () => {
      console.log('HireX Extension: Registered pending job ID ' + hirexJobId + ' for domain ' + domain);
    });
  });
}

// Check if we are on a thank you / success page
const checkSuccess = () => {
  const pageText = document.body ? document.body.innerText.toLowerCase() : '';
  const url = window.location.href.toLowerCase();
  
  const isThankYouPage = 
    url.includes('thanks') || 
    url.includes('thank-you') || 
    url.includes('success') || 
    url.includes('confirmation') ||
    pageText.includes('thank you for applying') ||
    pageText.includes('application submitted') ||
    pageText.includes('application received') ||
    pageText.includes('your application has been') ||
    pageText.includes('congratulations');

  if (isThankYouPage) {
    const domain = window.location.hostname;
    chrome.storage.local.get(['pending_apps', 'token'], (result) => {
      const pending = result.pending_apps || {};
      const jobId = pending[domain];
      const token = result.token;
      
      if (jobId && token) {
        console.log('HireX Extension: Success page detected! Submitting application ' + jobId + ' to HireX server...');
        
        fetch('http://localhost:5000/api/student/apply-external', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ jobId })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('HireX Extension: Application successfully logged on HireX!');
            // Remove from pending
            delete pending[domain];
            chrome.storage.local.set({ pending_apps: pending });
            
            // Show a visual floating banner on the page that HireX has tracked it!
            showTrackedBanner(data.company || 'Company');
          } else {
            console.error('HireX Extension: Failed to log application on HireX:', data.message);
          }
        })
        .catch(err => {
          console.error('HireX Extension: Network error calling HireX api:', err);
        });
      }
    });
  }
};

// Create a nice floating tracked banner on the success page
const showTrackedBanner = (company) => {
  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.bottom = '20px';
  banner.style.right = '20px';
  banner.style.backgroundColor = '#202A36';
  banner.style.color = '#FFFFFF';
  banner.style.padding = '16px 24px';
  banner.style.borderRadius = '12px';
  banner.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
  banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  banner.style.fontSize = '14px';
  banner.style.fontWeight = 'bold';
  banner.style.zIndex = '999999';
  banner.style.display = 'flex';
  banner.style.alignItems = 'center';
  banner.style.gap = '10px';
  banner.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  banner.style.animation = 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes slideIn {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  banner.innerHTML = `
    <span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background-color: #10B981; color: white; font-size: 12px;">✓</span>
    <span>Auto-tracked on HireX for ${company}!</span>
  `;

  document.body.appendChild(banner);
  setTimeout(() => {
    banner.style.transition = 'all 0.5s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    setTimeout(() => banner.remove(), 500);
  }, 6000);
};

// Check on load
setTimeout(checkSuccess, 1000);

// Also check after a brief delay to catch dynamic single page application routing
setTimeout(checkSuccess, 3000);
setTimeout(checkSuccess, 5000);

// Also listen for form submit button clicks to verify confirmation pages
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target && (target.innerText?.toLowerCase().includes('submit') || target.value?.toLowerCase().includes('submit'))) {
    console.log('HireX Extension: Submit click detected, checking for redirect success...');
    // Periodically inspect URL for success indicators
    let checks = 0;
    const interval = setInterval(() => {
      checkSuccess();
      checks++;
      if (checks > 12) clearInterval(interval);
    }, 1000);
  }
});
