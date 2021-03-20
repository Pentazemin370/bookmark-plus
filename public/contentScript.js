
var style = document.createElement('style');
style.type = "text/css";
style.innerHTML = `
:host { 
        position:fixed;
        height:100%;
        width:400px;
        z-index:999999;
        top:0;
        background-color:transparent;
        transition: all 0.2s;
    }
iframe {
        width:100%;
        height:100%;
}

`;


var iframe = document.createElement('iframe'); 
iframe.classList.add('container');
// iframe.frameBorder = "none"; 

iframe.src = chrome.extension.getURL("index.html");
let container = document.createElement('div');
container.id = "bookmark-container";
container.style.right = "-400px";
document.body.appendChild(container);
let shadowDom = container.attachShadow({mode:"closed"});
shadowDom.appendChild(style);
shadowDom.appendChild(iframe);

console.log('logs occur here');

chrome.runtime.onMessage.addListener((msg,sender)=>{
        if(msg==="toggle"){
             container.style.right = container.style.right==="-400px" ? "0px" : "-400px";
        }
});