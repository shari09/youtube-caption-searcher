chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'testid',
    title: 'Caption Search',
  });
  //remove all rules on page change
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'www.youtube.com', schemes: ['https']},
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'search') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {action: 'search', url: tabs[0].url},
        (res) => {
          console.log(res);
        },
      );
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab.id, {action: 'search', url: tab.url}, (res) => {
    console.log(res);
  });
});
