chrome.action.onClicked.addListener(async (tab) => {
    // This can be expanded based on more specific actions if needed
  });
  
  async function fetchAllCookies() {
    return await chrome.cookies.getAll({});
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "exportCookies") {
      fetchAllCookies().then(cookies => {
        let cookieData = 'Name\tValue\tDomain\tPath\tExpires\tSession\n';
        cookies.forEach(cookie => {
          const isSession = !cookie.expirationDate ? 'Yes' : 'No';
          cookieData += `${cookie.name}\t${cookie.value}\t${cookie.domain}\t${cookie.path}\t${new Date(cookie.expirationDate * 1000).toISOString()}\t${isSession}\n`;
        });
        const blob = new Blob([cookieData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({ url: url, filename: 'cookies.txt' });
        URL.revokeObjectURL(url);
      });
    } else if (request.action === "editCookie") {
      chrome.cookies.set(request.cookie).then(() => {
        sendResponse({ status: 'Cookie updated successfully' });
      });
    }
    return true;
  });
  