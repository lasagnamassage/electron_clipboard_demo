const electron = require('electron');
const path = require('path');
const { app, clipboard, Tray, Menu } = electron;

const STACK_SIZE = 5;
const MAX_STRING_SIZE = 20;

function addToStack(item, stack ) {
    if (item.length > MAX_STRING_SIZE) {
        //supply truncated version of attempted copied string
        item = item.substr(0,MAX_STRING_SIZE) + '...';
    }
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