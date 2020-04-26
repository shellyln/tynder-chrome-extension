// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

{
    const showMessage = (text, color) => {
        chrome.browserAction.setBadgeText({text});
        chrome.browserAction.setBadgeBackgroundColor({color});
        setTimeout(() => {
            chrome.browserAction.setBadgeText({text: ''});
        }, 3000);
    };

    const sendText = (conv) => {
        chrome.browserAction.setBadgeText({text: ''});
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'get-selection' }, (resp) => {
                setTimeout(() => {
                    try {
                        if (resp.text.trim() !== '') {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                command: 'write-clipboard',
                                text: conv(resp.text),
                            }, () => {
                                showMessage('OK', '#4688f1');
                            });
                        } else {
                            showMessage('Blank', '#e85500');
                        }
                    } catch (e) {
                        try {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                command: 'write-clipboard',
                                text: '[Error] Failed to convert:\n' + e.message
                            }, () => {
                                showMessage('Error', '#cc330c');
                            });
                        } catch (e2) {
                            //
                        }
                    }
                }, 30);
            });
        });
    };

    const btnElJsonSchema = document.getElementById('conv-to-json-schema');
    const btnElTs         = document.getElementById('conv-to-ts');
    const btnElCs         = document.getElementById('conv-to-cs');
    const btnElGraphQl    = document.getElementById('conv-to-graph-ql');
    const btnElProto3     = document.getElementById('conv-to-proto3');

    btnElJsonSchema.addEventListener('click', (event) => {
        sendText(text => tynder.generateJsonSchema(tynder.compile(text)));
    });

    btnElTs.addEventListener('click', (event) => {
        sendText(text => tynder.generateTypeScriptCode(tynder.compile(text)));
    });

    btnElCs.addEventListener('click', (event) => {
        sendText(text => tynder.generateCSharpCode(tynder.compile(text)));
    });

    btnElGraphQl.addEventListener('click', (event) => {
        sendText(text => tynder.generateGraphQlCode(tynder.compile(text)));
    });

    btnElProto3.addEventListener('click', (event) => {
        sendText(text => tynder.generateProto3Code(tynder.compile(text)));
    });

    chrome.browserAction.setBadgeText({text: ''});
}
