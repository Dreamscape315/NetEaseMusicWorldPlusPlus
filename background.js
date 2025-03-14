let mode;
const title = ['closed', 'normal', 'enhanced'];
const icon = [
	{ 16: 'images/logo16.png', 48: 'images/logo48.png', 128: 'images/logo128.png' }, // grey
	{ 16: 'images/logo16.png', 48: 'images/logo48.png', 128: 'images/logo128.png' }, // red
	{ 16: 'images/logo16.png', 48: 'images/logo48.png', 128: 'images/logo128.png' }  // blue
];
//const icon = ['images/grey.svg', 'images/red.svg', 'images/blue.svg'];


const createRules = () => {
	chrome.storage.local.get('mode', data => {
		mode = data.mode == null ? 2 : data.mode;
		updateRules();
		sync();
	});
};

const updateRules = () => {
	chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [1, 2] 
	}).then(() => {
		if (mode > 0) {
			const rules = [
				{
					id: 1,
					priority: 1,
					action: {
						type: 'modifyHeaders',
						requestHeaders: [
							{ header: 'X-Real-IP', operation: 'set', value: '211.161.244.70' }
						]
					},
					condition: {
						urlFilter: '||music.163.com',
						resourceTypes: ['xmlhttprequest', 'main_frame', 'sub_frame', 'script', 'other']
					}
				},
				{
					id: 2,
					priority: 1,
					action: {
						type: 'modifyHeaders',
						requestHeaders: [
							{ header: 'Cache-Control', operation: 'set', value: 'no-cache' }
						]
					},
					condition: {
						urlFilter: '*m*c*||music.126.net',
						resourceTypes: ['xmlhttprequest', 'main_frame', 'sub_frame', 'script', 'image', 'other']
					}
				}
			];

			chrome.declarativeNetRequest.updateDynamicRules({
				addRules: rules
			});
		}
	});
};

const sync = () => {
	chrome.storage.local.set({ mode });
	chrome.action.setIcon({ path: icon[mode] });
	chrome.action.setTitle({ title: `${chrome.i18n.getMessage('name')} [${chrome.i18n.getMessage(title[mode])}]` });
};

chrome.action.onClicked.addListener(() => {
	mode = (mode + 1) % 3;
	sync();
	updateRules(); 
});

createRules();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	sendResponse({});
	return true;
});
