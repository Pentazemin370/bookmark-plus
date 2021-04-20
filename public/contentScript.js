
var style = document.createElement('style');
style.innerHTML = `
:host { 
        position:fixed;
        height:100%;
        width:398px;
        z-index:999999;
        top:0;
        background-color:transparent;
        transition: all 0.2s;
    }
iframe {
        width:100%;
        height:100%;
        border-radius: 4px;
        border:1px solid gray;
        z-index:1;
}
.bookmark-toggle-button {
        background-color:black;
        opacity:0.7;
        position:fixed;
        height:100%;
        left:-20px;
        width:21px;
        border:none;
        transition: all 0.2s;
}
.bookmark-toggle-button:hover {
        left:0px;
}
`;

const iframe = document.createElement('iframe');
iframe.classList.add('container');
iframe.src = chrome.runtime.getURL("index.html");

const toggleButton = document.createElement('button');
toggleButton.classList = ['bookmark-toggle-button'];
toggleButton.onclick = () => {
        container.style.left = container.style.left === "-400px" ? "0px" : "-400px"
        if (toggleButton.classList.contains('active')) {
                toggleButton.classList.remove('active');
        } else {
                toggleButton.classList.add(['active']);
        }

};

const toggleImg = document.createElement('img');
toggleImg.type = "image/svg+xml";
toggleImg.src = chrome.runtime.getURL('mouse.svg');
toggleButton.appendChild(toggleImg);

const container = document.createElement('div');
container.id = "bookmark-container";
container.style.left = "-400px";
document.body.appendChild(container);

const shadowDom = container.attachShadow({ mode: "closed" });
shadowDom.appendChild(style);
shadowDom.appendChild(toggleButton);
shadowDom.appendChild(iframe);


chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg.name === "toggle") {
                container.style.left = container.style.left === "-400px" ? "0px" : "-400px";
                if (toggleButton.classList.contains('active')) {
                        toggleButton.classList.remove('active');
                } else {
                        toggleButton.classList.add(['active']);
                }
        }
});
