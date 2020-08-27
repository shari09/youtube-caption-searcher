
//only runs on pages with a youtube video
chrome.runtime.onInstalled.addListener(() => {
  //remove all rules on page change
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'www.youtube.com', schemes: ['https'], pathPrefix: 'watch'},
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()], //get permission
      },
    ]);
  });
});
