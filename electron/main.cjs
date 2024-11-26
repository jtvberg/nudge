const { log } = require('console')
const { app, BrowserWindow, Tray, nativeTheme } = require('electron')
const path = require('path')

if (require('electron-squirrel-startup')) app.quit()

const isDevEnvironment = process.env.DEV_ENV === 'true'
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'

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

    let autoFocus = true
    let timeoutFocus = undefined
    mainWindow.on('blur', () => {
        if (autoFocus) {
            resetTimeout()
            setupTimeout()
        }
    })

    const setupTimeout = () => {
        timeoutFocus = setTimeout(showWindow, 1000 * 60 * 60)
    }

    const resetTimeout = () => {
        clearTimeout(timeoutFocus)
    }

    const showWindow = () => {
        mainWindow.show()
        app.focus()
    }

    mainWindow.setAlwaysOnTop(true, 'floating')

    if (isMac) {
        app.dock.hide()
    }

    if (isWin) {
        mainWindow.setSkipTaskbar(true)
    }

    if (isDevEnvironment) {
        mainWindow.loadURL('http://localhost:5173/')
        mainWindow.webContents.on('did-frame-finish-load', () => {
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
    setTrayTheme()
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
    tray.on('right-click', () => {
        app.quit()
    })
}

// set tray icon based on system theme and OS
const setTrayTheme = () => {
    if (!isMac) {
        if (nativeTheme.shouldUseDarkColors) {
            tray.setImage(path.join(__dirname, '../src/assets/icon_tray_white_32.png'))
        } else {
            tray.setImage(path.join(__dirname, '../src/assets/iconTemplate@2x.png'))
        }
    }
}

app.on('ready', () => {
    createWindow()
    createTray()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
