import 'chrome-extension-async';
export const getActiveTabId = async (): Promise<number> => {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tabs) throw new Error('invalid active tab');
  if (!tabs[0].id) throw new Error('active tab id not found');
  return tabs[0].id;
};
