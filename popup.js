const urlInput = document.getElementById('urlInput');
const addBtn = document.getElementById('addBtn');
const appList = document.getElementById('appList');
const checkAllBtn = document.getElementById("checkAllBtn");

checkAllBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({ type: "CHECK_NOW" });
});
function timeAgo(timestamp) {
  if (!timestamp) return "never checked";

  const diffMs = Date.now() - timestamp;
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return diffMins + "m ago";

  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return diffHours + "h ago";

  const diffDays = Math.round(diffHours / 24);
  return diffDays + "d ago";
}

function loadApps() {
    chrome.storage.local.get("apps",function (result){
        const apps = result.apps || [];
        renderApps(apps);
    })
}

function renderApps(apps) {
  appList.innerHTML = "";

  apps.forEach(function (app, index) {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "app-info";

    const urlLine = document.createElement("div");
    urlLine.className = "app-url";
    urlLine.textContent = app.url;

    const statusLine = document.createElement("div");
    const statusText = app.status || "unknown";
    statusLine.className = "app-status status-" + statusText;
    statusLine.textContent = statusText + " · " + timeAgo(app.lastChecked);

    info.appendChild(urlLine);
    info.appendChild(statusLine);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", function () {
      removeApp(index);
    });

    li.appendChild(info);
    li.appendChild(removeBtn);
    appList.appendChild(li);
  });
}

addBtn.addEventListener('click', function() {
    const url = urlInput.value.trim();
    if(!url) return;

    chrome.storage.local.get("apps", function(result) {
        const apps = result.apps || [];
        apps.push({ url: url });
        chrome.storage.local.set({ apps: apps }, function() {
            urlInput.value = '';
            renderApps(apps);
        });
    });
});

function removeApp(index) {
    chrome.storage.local.get("apps", function(result) {
        const apps = result.apps || [];
        apps.splice(index, 1);
        chrome.storage.local.set({ apps: apps }, function() {
            renderApps(apps);
        });
    });
}
chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "local" && changes.apps) {
    renderApps(changes.apps.newValue || []);
  }
});

loadApps();
