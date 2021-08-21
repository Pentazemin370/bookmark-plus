chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.sendMessage(tab.id, { name: 'toggle' });
});


chrome.commands.onCommand.addListener(() => {
	chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
		if (tab[0] && tab[0].id) {
			chrome.tabs.sendMessage(tab[0].id, { name: 'toggle' });
		}
	});
});

chrome.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => {
	if (tab.url === "chrome://newtab/" || tab.pendingUrl === "chrome://newtab/") {
		chrome.tabs.update(tabId, { url: chrome.runtime.getURL("landing.html") });
	}
});