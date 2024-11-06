const { log, clear } = require('console')
const { app, BrowserWindow, Tray } = require('electron')
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
        minWidth: 320,
        minHeight: 350,
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
        timeoutFocus = setTimeout(showWindow, 1000 * 60 * 60)
    }

    const showWindow = () => {
        mainWindow.show()
        app.focus()
    }

    mainWindow.setAlwaysOnTop(true, 'floating')

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

let tray = null
const createTray = () => {
  tray = new Tray(path.join(__dirname, '../src/assets/iconTemplate@2x.png'))
  tray.setToolTip('Nudge')
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  tray.on('right-click', () => {
    app.quit()
  })
}

app.dock.hide()

app.on('ready', () => {
    createWindow()
    createTray()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
