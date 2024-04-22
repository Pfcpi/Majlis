'use strict'

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const ExpressApp = require('../../Backend/ExpressApp.js')
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  ExpressApp.listen(3000, () => {
    console.log('Express server running on port 3000')
  })
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//handle print
const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea'
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Page header',
  footer: 'Page footer'
}

ipcMain.handle('printComponent', (event, url) => {
  let win = new BrowserWindow({ show: false })
  win.loadURL(url)

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(printOptions, (success, failureReason) => {
      console.log('Print Initiated in Main...')
      if (!success) console.log(failureReason)
    })
  })
  return 'done with main'
})

//handle preview
ipcMain.handle('previewComponent', async (event, url) => {
  let win = new BrowserWindow({
    title: 'Print Preview',
    show: false,
    autoHideMenuBar: true
  })

  win.webContents.once('did-finish-load', () => {
    win.webContents
      .printToPDF(printOptions)
      .then((data) => {
        const buf = Buffer.from(data)
        data = buf.toString('base64')
        const url = 'data:application/pdf;base64,' + data

        win.webContents.on('ready-to-show', () => {
          win.once('page-title-updated', (e) => e.preventDefault())
          win.show()
        })

        win.webContents.on('closed', () => (win = null))
        win.loadURL(url)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  await win.loadURL(url)
  return 'shown preview window'
})
