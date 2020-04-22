// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
    switch (req.command) {
    case 'get-selection':
        {
            document.addEventListener('copy', e => {
                e.preventDefault();
                let text = e.clipboardData.getData('text/plain');
                if (text.trim() === '') {
                    text = document.getSelection().toString();
                }
                sendResponse({ text });
            }, { once: true });
            document.execCommand('copy');
        }
        break;
    case 'write-clipboard':
        {
            document.addEventListener('copy', (e) => {
                e.preventDefault();
                e.clipboardData.setData('text/plain', req.text);
                sendResponse({});
            }, { once: true });
            document.execCommand('copy');
        }
        break;
    }
});
