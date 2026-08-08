const urlInput = document.getElementById('urlInput');
const addBtn = document.getElementById('addBtn');
const appList = document.getElementById('appList');
const checkAllBtn = document.getElementById("checkAllBtn");

checkAllBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({ type: "CHECK_NOW" });
});

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

    const label = document.createElement("span");
    const statusText = app.status || "unknown";
    label.textContent = app.url + " — " + statusText;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", function () {
      removeApp(index);
    });

    li.appendChild(label);
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
