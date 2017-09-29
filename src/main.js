const electron = require('electron');
const path = require('path');
const { app, clipboard, Tray, Menu } = electron;

const STACK_SIZE = 5;

function addToStack(item, stack ) {
    if (stack.length >= STACK_SIZE)
    {
        stack.splice(0,1);
    }
    stack.push(item);
}
function checkClipBoardForChange(clipboard, onChange) {
    let cache = clipboard.readText();
    let latest;
    setInterval(_ => {
        latest = clipboard.readText();
        if (latest !== cache ) {
            cache = latest;
            onChange(cache);
        }
    }, 1000);
}
app.on('ready', _ => {
    let stack = [];
    const tray = new Tray (path.join('src','icon.png'))
    tray.setContextMenu(Menu.buildFromTemplate([{
        label:'<Empty>',
        enabled:false
    }]));

    checkClipBoardForChange(clipboard, text => {
        addToStack(text, stack);
        console.log("stack", stack);
    });
})