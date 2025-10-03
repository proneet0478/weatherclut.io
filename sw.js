// Service Worker

self.addEventListener("install", event => {
    self.skipWaiting(); // Activate immediately
  });
  
  self.addEventListener("activate", event => {
    console.log("Service Worker activated");
  });
  
  // For handling push notifications (if added later)
  self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Weather Alert";
    const body = data.body || "Hazardous weather detected!";
  
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: "/weather-icon.png",  // make a small PNG icon
        vibrate: [200, 100, 200],   // vibration pattern for Android
        requireInteraction: true,  // stays until dismissed
      })
    );
  });
  