// ✅ Register service worker so browser connects index.html <-> sw.js
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.error("SW registration failed:", err));
  }
  