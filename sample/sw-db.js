const DB_NAME = "ej";
const DB_VERSION = 1;

const request = indexedDB.open(DB_NAME, DB_VERSION);

// On success
request.onsuccess = function(event) {
    const db = event.target.result;
    console.log("Database opened successfully");
};
// On error
request.onerror = function(event) {
    console.log("Failed to open database");
};

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore("objects", { keyPath: "@id" });
    objectStore.createIndex("@type", "@type", { unique: false });
};

