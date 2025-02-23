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
    const mutationStore = db.createObjectStore("mutations");
    mutationStore.createIndex("@id", "@id", { unique: false });
};

const isObject = function(obj) {
   return obj.constructor === Object;
}

const create = function(data) {
   if (!isObject(data)) throw new TypeError("object expected");
   if (!data.@type) throw new Error("Missing @type");
   data.@id ??= self.crypto.randomUUID();

   const transaction = db.transaction("objects", "readwrite");
   transaction.onerror = () => {
   }
   transaction.oncomplete = () => {
   }
   const objectStore = transaction.objectStore("objects");
   const request = store.add(data);
}

const update = function(id, data) {
   if (!id) throw new Error("Missing first argument");
   if (!isObject(data)) throw new TypeError("object expected");
   if (data.@id) throw new Error("Unable to update @id");
}

const delete = function(id) {
   update(id, {});
}

