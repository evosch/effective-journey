const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }

      const registration = await navigator.serviceWorker.ready;
      try {
         await registration.periodicSync.register("get-latest-news", {
      minInterval: 15 * 60 * 1000,
    });
  } catch {
    console.log("Periodic Sync could not be registered!");
  }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();
