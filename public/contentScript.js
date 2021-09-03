
let style = document.createElement('style');
style.innerHTML = `
:host { 
        position:fixed;
        height:100%;
        width:398px;
        z-index:999999;
        top:0;
        background-color:transparent;
        transition: all 0.2s ease-out;
    }
iframe {
        width:100%;
        height:100%;
        border-radius: 4px;
        border:1px solid gray;
        z-index:1;
}
.frame {
        width:100%;
        height:100%;
        border-radius: 4px;
        border:1px solid gray;
        z-index:1;
}
.bookmark-toggle-container {
        left:-20px;        
        width:31px;
        height:100%;
        transition: all 0.2s;
        position:fixed;
}
.bookmark-toggle-container:hover {
        left:0px;
}
.bookmark-toggle-button {
        height:100%;
        width:21px;
        background-color:black;
        opacity:0.7;
        border:none;

}

`;

let direction = 'left';

const iframe = document.createElement('iframe');
iframe.classList.add('container');
iframe.src = chrome.runtime.getURL("index.html");
iframe.name = "bookmarkFrame";

const buttonContainer = document.createElement('div');
buttonContainer.classList = ['bookmark-toggle-container'];

const container = document.createElement('div');
container.id = "bookmark-container";
container.style.left = "-400px";

const toggleButton = document.createElement('button');
toggleButton.classList = ['bookmark-toggle-button'];
toggleButton.onclick = () => {
        container.style.left = container.style.left === "-400px" ? "0px" : "-400px";
        if (toggleButton.classList.contains('active')) {
                toggleButton.classList.remove('active');
        } else {
                toggleButton.classList.add(['active']);
        }
};
buttonContainer.appendChild(toggleButton);

const toggleImg = document.createElement('img');
toggleImg.type = "image/svg+xml";
toggleImg.src = chrome.runtime.getURL('mouse.svg');
toggleButton.appendChild(toggleImg);

document.body.appendChild(container);

const shadowDom = container.attachShadow({ mode: "open" });
shadowDom.appendChild(style);
shadowDom.appendChild(buttonContainer);
shadowDom.appendChild(iframe);

chrome.runtime.onMessage.addListener((msg) => {
        if (msg.name === "toggle") {
                console.log(direction);
                container.style[direction] = container.style[direction] === "-400px" ? "0px" : "-400px";
                if (toggleButton.classList.contains('active')) {
                        toggleButton.classList.remove('active');
                } else {
                        toggleButton.classList.add(['active']);
                }
        }
});

const updateDirection = (dir) => {
        if (dir) {
                direction = dir;
                if (direction === 'left') {
                        container.style.left = "-400px";
                        container.style.right = "";
                        toggleButton.onclick = () => {
                                container.style.left = container.style.left === "-400px" ? "0px" : "-400px";
                                if (toggleButton.classList.contains('active')) {
                                        toggleButton.classList.remove('active');
                                } else {
                                        toggleButton.classList.add(['active']);
                                }
                        };
                } else {
                        container.style.right = "-400px";
                        container.style.left = "";
                        toggleButton.onclick = () => {
                                container.style.right = container.style.right === "-400px" ? "0px" : "-400px";
                                if (toggleButton.classList.contains('active')) {
                                        toggleButton.classList.remove('active');
                                } else {
                                        toggleButton.classList.add(['active']);
                                }
                        };
                }
        }
}
if (chrome.storage) {
        console.log('storage found');
        chrome.storage.local.get('barOrientation', (res) => {
                console.log(res.barOrientation);
                updateDirection(res.barOrientation);
        });

        chrome.storage.onChanged.addListener((changes) => {
                if (changes.barOrientation) {
                        updateDirection(changes.barOrientation.newValue);
                }
        });
}






