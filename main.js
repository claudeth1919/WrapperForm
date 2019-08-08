// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')
const { ipcMain } = require('electron')


let urlParam = process.argv[2];
if (urlParam != undefined) {
  setUrl(urlParam);
} else {
  getUrlByFile();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  let option = {
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
    , frame: false
  }
  
  mainWindow = new BrowserWindow(option)
  mainWindow.loadFile('index.html')
  mainWindow.setMenu(null)
  // and load the index.html of the app.

  //mainWindow.maximize()

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()



  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
  mainWindow = null
  
  })
}

//FILES READING



function getUrlByFile() {
  let content = "{\n\t \"url\" : \"https://github.com/claudeth1919/WrapperForm\"\n}";

  try {
    console.log(__dirname + '\\configuration.json');
    if (!fs.existsSync(__dirname + '\\configuration.json')) {
      fs.writeFileSync('configuration.json', content, 'utf-8');
    }
  }
  catch (e) {
    console.log('Failed to create the file !');
  }

  fs.readFile(__dirname + "\\configuration.json", "utf-8", (err, data) => {
    if (err) {
      console.log("error reading file");
      return;
    }
    let json = JSON.parse(data)
    console.log(json.url);
    setUrl(json.url);
  })
}


function setUrl(url){
  ipcMain.on('get-url', (event, arg) => {
    console.log("url request");
    event.returnValue = url
  })
}






// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
