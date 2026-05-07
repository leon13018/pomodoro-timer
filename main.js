'use strict'

const { app, BrowserWindow, ipcMain, Notification, nativeTheme } = require('electron')
const path = require('path')

app.setAppUserModelId('com.pomodoro.app')
nativeTheme.themeSource = 'light'

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 580,
    resizable: false,
    alwaysOnTop: false,
    backgroundColor: '#F7F2EC',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  win.setMenuBarVisibility(false)
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('show-notification', (_event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body, silent: true }).show()
  }
})

ipcMain.handle('toggle-always-on-top', (_event, value) => {
  const wins = BrowserWindow.getAllWindows()
  if (wins.length > 0) wins[0].setAlwaysOnTop(value)
})
