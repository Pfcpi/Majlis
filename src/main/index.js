'use strict'

import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const axios = require('axios')
const ExpressApp = require('../../Backend/ExpressApp.js')
import icon from '../../resources/icon.png?asset'
const portfinder = require('portfinder')

const pie = require('puppeteer-in-electron')
const puppeteer = require('puppeteer-core')

async function createWindow() {
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

  let used_port = await handlePort()
  ipcMain.handle('get-Port', async (ev, args) => {
    return used_port
  })

  ipcMain.handle('get-Path', async (ev, args) => {
    return app.getPath('sessionData')
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

  ipcMain.handle('get-url', getUrl)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

async function initialize() {
  await pie.initialize(app)
}
initialize()

async function handlePort() {
  try {
    const port = await portfinder.getPortPromise()

    // Listen on the port returned by portfinder
    ExpressApp.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })

    // Update the global_port variable with the obtained port

    return port
  } catch (err) {
    console.error('Error finding an available port:', err)
    // Return the original global_port if an error occurs
    return 3000
  }
}

async function getUrl() {
  //const browser = await pie.connect(app, puppeteer)

  const window = new BrowserWindow({
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

  window.on('ready-to-show', () => {
    window.maximize()
  })

  const url = path.join(app.getPath('sessionData'), 'sortie.pdf')
  await window.loadURL('http://localhost:3000/sortie.pdf')
  //await window.loadURL('https://usto.madjria.com/sortie.pdf')
  console.log('passed from here under window.loadURL')

  //const page = await pie.getPage(browser, window)
  return
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
