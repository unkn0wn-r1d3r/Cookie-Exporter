document.getElementById('exportButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "exportCookies" });
  });
  
  document.getElementById('editButton').addEventListener('click', () => {
    const table = document.getElementById('cookieTable');
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const name = row.querySelector('.name').textContent;
      const value = row.querySelector('.value').textContent;
      const domain = row.querySelector('.domain').textContent;
      const path = row.querySelector('.path').textContent;
      const expirationDate = row.querySelector('.expires').textContent;
  
      chrome.runtime.sendMessage({
        action: 'editCookie',
        cookie: {
          name: name,
          value: value,
          domain: domain,
          path: path,
          expirationDate: new Date(expirationDate).getTime() / 1000
        }
      }, response => {
        alert(response.status);
      });
    });
  });
  
  async function populateCookieTable() {
    const cookies = await chrome.runtime.sendMessage({ action: "fetchAllCookies" });
    const tbody = document.querySelector('#cookieTable tbody');
    tbody.innerHTML = '';
    cookies.forEach(cookie => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="name">${cookie.name}</td>
        <td class="value">${cookie.value}</td>
        <td class="domain">${cookie.domain}</td>
        <td class="path">${cookie.path}</td>
        <td class="expires">${new Date(cookie.expirationDate * 1000).toISOString()}</td>
        <td class="session">${cookie.expirationDate ? 'No' : 'Yes'}</td>
        <td><button class="editBtn">Edit</button></td>
      `;
      tbody.appendChild(row);
    });
  
    // Attach event listeners to Edit buttons
    document.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        const name = row.querySelector('.name').textContent;
        const value = prompt('New value for ' + name, row.querySelector('.value').textContent);
        if (value !== null) {
          row.querySelector('.value').textContent = value;
          chrome.runtime.sendMessage({
            action: 'editCookie',
            cookie: {
              name: name,
              value: value,
              domain: row.querySelector('.domain').textContent,
              path: row.querySelector('.path').textContent,
              expirationDate: new Date(row.querySelector('.expires').textContent).getTime() / 1000
            }
          }, response => {
            alert(response.status);
          });
        }
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', populateCookieTable);
  