
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

var mDB = {
  version: 1,
  DB_NAME: 'mDB',
  store: 'playList',
  objectIndex: 'songId',
  instance: {},

  upgrade: function (e) {
    let _db = e.target.result
    let names = _db.objectStoreNames

    if (!names.contains(mDB.playListStore)) {
      var playObjectStore = _db.createObjectStore(mDB.store, { keyPath: 'id', autoIncrement: true, unique: true })
      playObjectStore.createIndex(mDB.objectIndex, mDB.objectIndex, { unique: true })
    }
  },

  errorHandler: function (error) {
    console.log(error)
    // debugger;
  },

  open: function (callback) {
    var request = window.indexedDB.open(mDB.DB_NAME, mDB.version)

    request.onerror = mDB.errorHandler

    request.onupgradeneeded = mDB.upgrade

    request.onsuccess = function (e) {
      mDB.instance = request.result

      mDB.instance.onerror = mDB.errorHandler

      callback()
    }
  },

  getObjectStore: function (mode) {
    var txn, store
    mode = mode || 'readonly'

    txn = mDB.instance.transaction([mDB.store], mode)

    store = txn.objectStore(mDB.store)

    return store
  },

  save: function (data, callback) {
    mDB.open(function () {
      let mode = 'readwrite'

      let store = mDB.getObjectStore(mode)

      let request = data.id ? store.put(data) : store.add(data)

      request.onsuccess = callback
    })
  },

  getAll: function (callback) {
    mDB.open(function () {
      let store = mDB.getObjectStore(mDB.store)
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

  get: function (id, callback) {
    id = parseInt(id)

    mDB.open(function () {
      var store = mDB.getObjectStore(mDB.store)
      let request = store.get(id)

      request.onsuccess = function (e) {
        callback(e.target.result)
      }
    })
  },

  deleteOne: function (id, callback) {
    id = parseInt(id)

    mDB.open(function () {
      var mode = 'readwrite'

      let store = mDB.getObjectStore(mDB.store, mode)

      let request = store.delete(id)

      request.onsuccess = callback
    })
  },

  deleteAll: function (callback) {
    mDB.open(function () {
      var mode, store, request

      mode = 'readwrite'
      store = mDB.getObjectStore(mDB.store, mode)
      request = store.clear()

      request.onsuccess = callback
    })
  }
}
