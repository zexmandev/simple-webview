const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const prompt = require("electron-prompt");

let win, winURL;

function createWindow() {
  // Cria uma janela de navegação.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    //titleBarStyle: "hidden",
    //frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,

    webPreferences: {
      nodeIntegration: true,
    },
  });

  //win.webContents.openDevTools();

  // Attach event listener to event that requests to update something in the second window
  // from the first window
  ipcMain.on("requestURl", (event, arg) => {
    // Request to update the label in the renderer process of the second window
    // and load the index.html of the app.
    winURL.close();
    win.loadURL(arg.url);
  });

  win.loadFile("index.html");
}

function toggleDevTools() {
  win.webContents.toggleDevTools();
}

function createShortcuts() {
  globalShortcut.register("CmdOrCtrl+J", toggleDevTools);
  globalShortcut.register("CmdOrCtrl+l", createChildWindow);
}

function createChildWindow() {
  winURL = new BrowserWindow({
    parent: win,
    width: 300,
    height: 40,
    //titleBarStyle: "hidden",
    //frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //child.webContents.openDevTools();
  winURL.loadFile("url.html");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app
  .whenReady()
  .then(createWindow)
  //.then(createChildWindow)
  .then(createShortcuts);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // No macOS é comum para aplicativos e sua barra de menu
  // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
