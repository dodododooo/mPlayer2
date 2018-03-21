
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

var mDB = {
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
  version: 2,
  DB_NAME: 'mDB',
  plsyListStore: 'playList',
  upvoteListStore: 'upvoteList',
  objectIndex: 'songId',
  instance: {},

  upgrade: function (e) {
    let _db = e.target.result
    let names = _db.objectStoreNames

    if (!names.contains(mDB.playListStore)) {
      var playObjectStore = _db.createObjectStore(mDB.plsyListStore, { keyPath: 'id', autoIncrement: true, unique: true })
      playObjectStore.createIndex(mDB.objectIndex, mDB.objectIndex, { unique: true })
    }
    if (!names.contains(mDB.upvoteListStore)) {
      var upvoteListStore = _db.createObjectStore(mDB.upvoteListStore, { keyPath: 'id', autoIncrement: true, unique: true })
      upvoteListStore.createIndex(mDB.objectIndex, mDB.objectIndex, { unique: true })
    }
  },

  errorHandler: function (error) {
    console.log(error)
    // debugger;
  },

  open: function (callback) {
    var request = mDB.indexedDB.open(mDB.DB_NAME, mDB.version)

    request.onerror = mDB.errorHandler

    request.onupgradeneeded = mDB.upgrade

    request.onsuccess = function (e) {
      mDB.instance = request.result

      mDB.instance.onerror = mDB.errorHandler

      callback()
    }
  },

  getObjectStore: function (storeName, mode) {
    var txn, store
    mode = mode || 'readonly'

    txn = mDB.instance.transaction([storeName], mode)

    store = txn.objectStore(storeName)

    return store
  },

  save: function (storeName, data, callback) {
    mDB.open(function () {
      let mode = 'readwrite'

      let store = mDB.getObjectStore(storeName, mode)

      let request = data.id ? store.put(data) : store.add(data)

      request.onsuccess = function (e) {
        callback(e.target.result)
      }
    })
  },

  saveAll: function (storeName, data, callback) {
    mDB.open(function () {
      let mode = 'readwrite'
      let txn = mDB.instance.transaction([storeName], mode)

      let store = txn.objectStore(storeName)

      let result = []
      txn.oncomplete = function (e) {
        callback(result)
      }
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          let request = store.put(item)
          request.onsuccess = function (e) {
            let id = e.target.result
            item.id = id
            result.push(item)
          }
        })
      } else {
        callback(result)
      }
    })
  },

  getAll: function (storeName, callback) {
    mDB.open(function () {
      let store = mDB.getObjectStore(storeName)
      let cursor = store.openCursor()
      let data = []

      cursor.onsuccess = function (e) {
        var result = e.target.result

        if (result && result !== null) {
          data.push(result.value)
          result.continue()
        } else {
          callback(data)
        }
      }
    })
  },

  get: function (storeName, id, callback) {
    id = parseInt(id)

    mDB.open(function () {
      var store = mDB.getObjectStore(storeName)
      let request = store.get(id)

      request.onsuccess = function (e) {
        callback(e.target.result)
      }
    })
  },

  deleteOne: function (storeName, id, callback) {
    id = parseInt(id)

    mDB.open(function () {
      var mode = 'readwrite'

      let store = mDB.getObjectStore(storeName, mode)

      let request = store.delete(id)

      request.onsuccess = callback
    })
  },

  deleteAll: function (storeName, callback) {
    mDB.open(function () {
      var mode, store, request

      mode = 'readwrite'
      store = mDB.getObjectStore(storeName, mode)
      request = store.clear()

      request.onsuccess = callback
    })
  }
}

export default mDB
