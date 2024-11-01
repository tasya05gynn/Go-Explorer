// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

// load the data that had been input from user

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: (channel, data) => ipcRenderer.send(channel, data),
  receiveFromMain: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
window.electronAPI.sendToMain('someChannel', { key: 'value' });
window.electronAPI.receiveFromMain('someChannel', (data) => {
    console.log('Data from main:', data);
  });
