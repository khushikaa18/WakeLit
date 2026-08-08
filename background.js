chrome.runtime.onInstalled.addListener(function () {
  chrome.alarms.create("checkApps", {
    periodInMinutes: 360
  });
  console.log("WakeLit: alarm scheduled.");
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "checkApps") {
    checkAllApps();
  }
});

// Lookup table: which tab belongs to which app's URL
const tabToUrl = {};

function checkAllApps() {
  chrome.storage.local.get("apps", function (result) {
    const apps = result.apps || [];

    apps.forEach(function (app) {
      updateAppStatus(app.url, "checking");

      chrome.tabs.create({ url: app.url, active: false }, function (tab) {
        tabToUrl[tab.id] = app.url;

        // Safety net: if content.js never responds within 20s, close anyway
        setTimeout(function () {
          if (tabToUrl[tab.id]) {
            chrome.tabs.remove(tab.id);
            delete tabToUrl[tab.id];
          }
        }, 20000);
      });
    });
  });
}

// Update one app's status + lastChecked time inside storage
function updateAppStatus(url, status) {
  chrome.storage.local.get("apps", function (result) {
    const apps = result.apps || [];
    const updated = apps.map(function (app) {
      if (app.url === url) {
        return { ...app, status: status, lastChecked: Date.now() };
      }
      return app;
    });
    chrome.storage.local.set({ apps: updated });
  });
}

// Hear back from content.js
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.type === "CHECK_NOW") {
    checkAllApps();
    return;
  }

  const tabId = sender.tab ? sender.tab.id : null;
  const url = tabToUrl[tabId];
  if (!url) return;

  if (message.type === "WOKE_APP") {
    updateAppStatus(url, "awake");
  } else if (message.type === "ALREADY_AWAKE") {
    updateAppStatus(url, "awake");
  }

  chrome.tabs.remove(tabId);
  delete tabToUrl[tabId];
});
