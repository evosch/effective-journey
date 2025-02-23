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

const transaction = function(stores, mode, callback) {
   return new Promise((resolve, reject) => {
      const transaction = db.transaction("objects", "readwrite");
      transaction.onerror = () => {
         reject();
   }
      transaction.oncomplete = () => {
         resolve();
      }
      callback(transaction);
   }
}

const IDBRequestPromise = function(method) {
   return (store, ...args) => {
   return new Promise((resolve, reject) => {
      const request = store[method](...args);
      request.onsuccess = () => {
         resolve(request.result);
      }
      request.onerror = () => {
         reject();
      }
   });
}

const getRecord = IDBRequestPromise("get");

const addRecord = IDBRequestPromise("add");

const updateRecord = IDBRequestPromise("put");

const create = async function(data) {
   if (!isObject(data)) throw new TypeError("object expected");
   if (!data.@type) throw new Error("Missing @type");
   data.@id ??= self.crypto.randomUUID();
   
   await transaction(["objects", "mutations"], "readwrite", async (trans) => {
            const store = return new Promise((resolve, reject) => {
      await addRecord(
        trans.objectStore("objects"),
        data,
      );
      await addRecord(
        trans.objectStore("mutations"),
        data,
      );
   });
}

const update = function(id, data) {
   if (!id) throw new Error("Missing first argument");
   if (!isObject(data)) throw new TypeError("object expected");
   if (data.@id) throw new Error("Unable to update @id");

   await transaction(["objects", "mutations"], "readwrite", async (trans) => {
       const objectStore = trans.objectStore("objects");
       const record = await getRecord(
         objectStore,
         id,
       );
       await putRecord(
         trans.objectStore("objects"),
         data,
       );
       await addRecord(
         trans.objectStore("mutations"),
         data,
       );
   });
}

const delete = function(id) {
   update(id, {});
}

