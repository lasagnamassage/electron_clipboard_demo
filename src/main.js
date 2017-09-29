const electron = require('electron');
const path = require('path');
const { app, clipboard, Tray, Menu, globalShortcut } = electron;

const STACK_SIZE = 5;
const MAX_STRING_SIZE = 20;

function addToStack(item, stack ) {
    return [item].concat(stack.length >= STACK_SIZE 
            ? stack.slice(0,stack.length-1)
            : stack )
}

function formatItem(item) {
    return item && item.length > MAX_STRING_SIZE
        ? item.substr(0,MAX_STRING_SIZE) + '...'
        : item
}

function formatMenuTemplateForStack(clipboard, stack) {
    return stack.map((item,i) => {
        return {
            label: `Copy: ${formatItem(item)}`,
            click: _ => clipboard.writeText(item),
            accelerator: `CommandOrControl+Alt+${i+1}`
        }
    })
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

function registerShortcuts(globalShortcut, clipboard, stack) {
    globalShortcut.unregisterAll();
    for (let i = 0; i < STACK_SIZE; ++i) {
        globalShortcut.register(`CommandOrControl+Alt+${i+1}`, _ => {
            clipboard.writeText(stack[i]);
        })
    }
}


app.on('ready', _ => {
    let stack = [];
    const tray = new Tray (path.join('src','icon.png'))
    tray.setContextMenu(Menu.buildFromTemplate([{
        label:'<Empty>',
        enabled:false
    }]));

    checkClipBoardForChange(clipboard, text => {
        stack = addToStack(text, stack);
        tray.setContextMenu(Menu.buildFromTemplate(formatMenuTemplateForStack(clipboard, stack)));
        registerShortcuts(globalShortcut, clipboard, stack);
    });
})

app.on('will-quit', _ => {
    globalShortcut.unregisterAll();
});