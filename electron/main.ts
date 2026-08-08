import {app, BrowserWindow} from "electron";
import path from "path";

function createWindow() {
    const window = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (app.isPackaged) {
        window.loadFile(
            path.join(
                app.getAppPath(),
                "frontend",
                "dist",
                "index.html"
            )
        );
    } else {
        window.loadURL("http://localhost:5173");
    }
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