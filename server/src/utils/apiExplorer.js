export function renderApiExplorerHtml(baseUrl, catalog) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LabGuard REST API Explorer • SFIT INFT</title>
  <style>
    :root {
      --bg-page: #eef2f6;
      --bg-panel: #ffffff;
      --border: #d0d7de;
      --text: #0f172a;
      --text-muted: #64748b;
      --accent-get: #16a34a;
      --accent-get-bg: #dcfce7;
      --accent-post: #0284c7;
      --accent-post-bg: #e0f2fe;
      --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg-page);
      color: var(--text);
      line-height: 1.5;
      padding: 1.5rem 1rem 3rem;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    header {
      background: #0f172a;
      color: #ffffff;
      padding: 1.25rem 1.5rem;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .header-title h1 {
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header-title p {
      font-size: 0.76rem;
      color: #94a3b8;
      margin-top: 0.2rem;
    }
    .header-links a {
      color: #38bdf8;
      font-size: 0.78rem;
      text-decoration: none;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      background: #1e293b;
      border: 1px solid #334155;
      font-family: var(--font-mono);
    }
    .header-links a:hover {
      background: #334155;
    }
    .main-grid {
      display: grid;
      grid-template-columns: 340px 1fr;
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-top: none;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
    }
    .sidebar {
      background: #f8fafc;
      border-right: 1px solid var(--border);
      padding: 1rem;
      overflow-y: auto;
      max-height: 75vh;
    }
    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0.75rem 0 0.4rem;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.78rem;
      margin-bottom: 0.3rem;
      border: 1px solid transparent;
      transition: all 0.12s;
    }
    .endpoint-item:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    .endpoint-item.active {
      background: #ffffff;
      border-color: #0f172a;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .method-badge {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
    }
    .method-get {
      background: var(--accent-get-bg);
      color: var(--accent-get);
    }
    .method-post {
      background: var(--accent-post-bg);
      color: var(--accent-post);
    }
    .method-delete {
      background: #fee2e2;
      color: #dc2626;
    }
    .endpoint-path {
      font-family: var(--font-mono);
      color: #334155;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .console-area {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .request-bar {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .url-input {
      flex: 1;
      font-family: var(--font-mono);
      font-size: 0.84rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #f8fafc;
      color: #0f172a;
    }
    .url-input:focus {
      outline: none;
      border-color: #0f172a;
      background: #ffffff;
    }
    .btn-send {
      background: #0f172a;
      color: #ffffff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .btn-send:hover {
      background: #1e293b;
    }
    .response-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .status-badge {
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 0.1rem 0.45rem;
      border-radius: 4px;
      font-size: 0.72rem;
    }
    .status-200 { background: #dcfce7; color: #15803d; }
    .status-error { background: #fee2e2; color: #b91c1c; }
    .response-box {
      background: #0f172a;
      color: #f8fafc;
      border-radius: 6px;
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      max-height: 480px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.4;
      border: 1px solid #1e293b;
    }
    .btn-copy {
      background: #e2e8f0;
      border: 1px solid #cbd5e1;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.72rem;
      cursor: pointer;
    }
    .btn-copy:hover { background: #cbd5e1; }
    .creds-panel {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0.65rem 0.85rem;
      font-size: 0.75rem;
      color: #475569;
    }
    @media (max-width: 820px) {
      .main-grid { grid-template-columns: 1fr; }
      .sidebar { max-height: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-title">
        <h1><span>⚡</span> LabGuard Interactive REST API Console</h1>
        <p>St. Francis Institute of Technology (SFIT) • Department of Information Technology (INFT)</p>
      </div>
      <div class="header-links">
        <a href="${baseUrl}/api?format=json" target="_blank">📄 Raw JSON Feed</a>
        <a href="http://localhost:5173" target="_blank">💻 Open Web App (5173) &rarr;</a>
      </div>
    </header>

    <div class="main-grid">
      <!-- Sidebar Endpoints -->
      <div class="sidebar">
        <div class="section-label">Core Resources</div>
        
        <div class="endpoint-item active" onclick="selectEndpoint('GET', '/api/tickets')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/tickets</span>
        </div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/assets')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/assets</span>
        </div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/analytics')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/analytics</span>
        </div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/users')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/users</span>
        </div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/health')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/health</span>
        </div>

        <div class="section-label">Filtered Queries & Details</div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/tickets/TKT26-CRIT14')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/tickets/:idOrTag</span>
        </div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/tickets/my')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/tickets/my</span>
        </div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/tickets?priority=Critical')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/tickets?priority=Critical</span>
        </div>

        <div class="endpoint-item" onclick="selectEndpoint('GET', '/api/assets?labRoom=Lab 304 - Computer Center 3')">
          <span class="method-badge method-get">GET</span>
          <span class="endpoint-path">/api/assets?labRoom=CC3</span>
        </div>

        <div class="section-label">Fraudulent Ticket Triage (Admin/Tech)</div>

        <div class="endpoint-item" onclick="selectEndpoint('DELETE', '/api/tickets/:id')">
          <span class="method-badge method-delete">DEL</span>
          <span class="endpoint-path">/api/tickets/:id (Purge Fraud)</span>
        </div>

        <div class="section-label">Demo Credentials</div>
        <div class="creds-panel">
          <div><strong>Student:</strong> Veer • PID-241034</div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #64748b;">veer@sfit.ac.in | student123</div>
          <div style="margin-top: 0.3rem;"><strong>Technician:</strong> Ramesh Kumar</div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #64748b;">ramesh.tech@sfit.ac.in | tech123</div>
          <div style="margin-top: 0.3rem;"><strong>HOD Admin:</strong> Dr. S. N. Sharma</div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #64748b;">hod.inft@sfit.ac.in | admin123</div>
        </div>
      </div>

      <!-- Console Area -->
      <div class="console-area">
        <div class="request-bar">
          <span id="currentMethod" class="method-badge method-get" style="font-size: 0.8rem; padding: 0.4rem 0.6rem;">GET</span>
          <input type="text" id="urlInput" class="url-input" value="${baseUrl}/api/tickets" />
          <button class="btn-send" onclick="executeRequest()">
            <span>▶</span> Execute
          </button>
        </div>

        <div class="response-header">
          <div>
            Response: <span id="statusBadge" class="status-badge status-200">200 OK</span>
            <span id="timingBadge" style="margin-left: 0.5rem; font-family: var(--font-mono);">0 ms</span>
          </div>
          <button class="btn-copy" onclick="copyResponse()">Copy JSON</button>
        </div>

        <div id="responseBox" class="response-box">Loading initial data...</div>
      </div>
    </div>
  </div>

  <script>
    const baseUrl = '${baseUrl}';

    function selectEndpoint(method, path) {
      document.querySelectorAll('.endpoint-item').forEach(el => el.classList.remove('active'));
      event.currentTarget.classList.add('active');
      document.getElementById('currentMethod').textContent = method;
      document.getElementById('urlInput').value = baseUrl + path;
      executeRequest();
    }

    async function executeRequest() {
      const url = document.getElementById('urlInput').value;
      const statusBadge = document.getElementById('statusBadge');
      const timingBadge = document.getElementById('timingBadge');
      const box = document.getElementById('responseBox');

      box.textContent = 'Executing request...';
      const start = performance.now();

      try {
        const res = await fetch(url);
        const duration = Math.round(performance.now() - start);
        timingBadge.textContent = duration + ' ms';

        statusBadge.textContent = res.status + ' ' + (res.statusText || 'OK');
        statusBadge.className = 'status-badge ' + (res.ok ? 'status-200' : 'status-error');

        const data = await res.json();
        box.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        statusBadge.textContent = 'Error';
        statusBadge.className = 'status-badge status-error';
        box.textContent = '// Failed to fetch: ' + err.message;
      }
    }

    function copyResponse() {
      const text = document.getElementById('responseBox').textContent;
      navigator.clipboard.writeText(text);
      alert('Response copied to clipboard!');
    }

    // Auto-execute on page load
    window.onload = executeRequest;
  </script>
</body>
</html>`;
}
