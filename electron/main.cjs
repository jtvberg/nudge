const { log, clear } = require('console')
const { app, BrowserWindow } = require('electron')
const path = require('path')

if (require('electron-squirrel-startup')) app.quit()

const isDevEnvironment = process.env.DEV_ENV === 'true'

if (isDevEnvironment) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    })
}

let mainWindow

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 400,
        transparent: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    let timeoutFocus = undefined
    mainWindow.on('blur', () => {
        setupTimeout()
    })

    const setupTimeout = () => {
        clearTimeout(timeoutFocus)
        timeoutFocus = setTimeout(showWindow, 3600000)
    }

    const showWindow = () => {
        mainWindow.show()
        app.focus()
    }

    if (isDevEnvironment) {
        mainWindow.loadURL('http://localhost:5173/')
        mainWindow.webContents.on("did-frame-finish-load", () => {
            mainWindow.webContents.openDevTools()
        })
        log('Electron running in dev mode: 🧪')

    } else {
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'))
        log('Electron running in prod mode: 🚀')
    }
}

app.on('ready', createWindow)

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
