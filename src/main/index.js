'use strict'

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { dirname, join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
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
  console.log('used_port: ', used_port)
  ipcMain.handle('get-Port', async (ev, args) => {
    return used_port
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
    const port = await portfinder.getPortPromise();

    // Listen on the port returned by portfinder
    ExpressApp.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Update the global_port variable with the obtained port

    return port;
  } catch (err) {
    console.error('Error finding an available port:', err);
    // Return the original global_port if an error occurs
    return 3000;
  }
}

async function getUrl() {
  const browser = await pie.connect(app, puppeteer)

  const window = new BrowserWindow()

  window.on('ready-to-show', () => {
    window.maximize()
  })
  const url = __dirname + '../../s.pdf'
  console.log('url:', url)
  await window.loadURL(url)

  const page = await pie.getPage(browser, window)
  console.log(page.url())
  return page.url()
}

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

//-------------------- print function -----------------

// List of all options at -
// https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback
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

//handle print
ipcMain.handle('printComponent', (event, url) => {
  let win = new BrowserWindow({ show: false })

  win.loadURL(url)

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(printOptions, (success, failureReason) => {
      console.log('Print Initiated in Main...')
      if (!success) console.log(failureReason)
    })
  })
  return 'shown print dialog'
})

//handle preview
ipcMain.handle('previewComponent', (event, url) => {
  let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true })
  win.loadURL(url)

  win.webContents.once('did-finish-load', () => {
    win.webContents
      .printToPDF(printOptions)
      .then((data) => {
        /*let buf = Buffer.from(data)
        var data = buf.toString('base64')
        let url = 'data:application/pdf;base64,' + data*/

        win.webContents.on('ready-to-show', () => {
          win.show()
          win.setTitle('Preview')
        })

        win.webContents.on('closed', () => (win = null))
        win.loadURL(url)
      })
      .catch((error) => {
        console.log(error)
      })
  })
  return 'shown preview window'
})
