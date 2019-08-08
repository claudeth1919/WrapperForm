// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } 

  const { ipcRenderer } = require('electron')
  let url = ipcRenderer.sendSync('get-url', null);
  console.log(url);
  var webview = document.getElementById('wrapper');
  if(url==''||url==undefined){
    webview.src = "https://github.com/claudeth1919/WrapperForm";
  }
  webview.src = url;
  
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
