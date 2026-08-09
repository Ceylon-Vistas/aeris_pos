import {app, BrowserWindow} from "electron";
import path from "path";

function createWindow(): void {
    const win = new BrowserWindow({
        width: 1600,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile(
        path.join(__dirname, "../frontend/dist/index.html")
    );
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});