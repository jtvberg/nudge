const { contextBridge } = require('electron')

const api = {

}

contextBridge.exposeInMainWorld('api', api)