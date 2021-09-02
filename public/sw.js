
chrome.runtime.onInstalled.addListener(() => { console.log('hello world'); });



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