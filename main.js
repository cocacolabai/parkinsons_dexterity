/* Module Imports */
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

/* Maintain window reference to avoid GC */
let mainWindow = null;



//////////////////////////////////////////////////////////
//  Create Window
//////////////////////////////////////////////////////////

function createWindow () {

    const name = "Dexterity Experiment";
    const height = 700;
    const width = 800;
    const resizable = false;

    // Create the browser window.
    mainWindow = new BrowserWindow({ name, height, width, resizable });

    // Load HTML Index File 
    mainWindow.loadURL('file://' + __dirname + "/index.html");
    
    // Open the DevTools.
    //mainWindow.webContents.openDevTools( {detach: false} );

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    });
}


//////////////////////////////////////////////////////////
//  Application Lifecycle Events
//////////////////////////////////////////////////////////

/* Initialization Finished */
app.on('ready', createWindow)

/* Quit when all windows closed */
app.on('window-all-closed', function () {

    /* OSX quit explicitly with Cmd + Q */
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    
    /* OSX Create window when dock icon clicked*/
    if (mainWindow === null) {
        createWindow()
    }
})