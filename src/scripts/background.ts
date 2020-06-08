chrome.runtime.onInstalled.addListener(() => {
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
      if (!tabs[0].id) throw new Error('active tab id not found');

      chrome.tabs.sendMessage(
        tabs[0].id,
        {action: 'search', url: tabs[0].url},
        (res: any) => {
          console.log(res);
        },
      );
    });
  }
});
