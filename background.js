/*
 * Filename:         background.js
 * More info, see:   gpme.js
 *
 * Web:              http://huyz.us/google-plus-me/
 * Source:           https://github.com/huyz/google-plus-me
 * Author:           Huy Z  http://huyz.us/
 */

// Listen to incoming messages from content scripts
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.action == 'gpmeStatusUpdate') {
    chrome.browserAction.setBadgeText({text: (request.count ? request.count.toString() : "")});
  } else if (request.action == 'gpmeGetModeOption') {
    sendResponse(localStorage.getItem('gpme_options_mode'));
  }
});

// Listen to tab updates from Chrome (back and forward buttons)
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.url.match(/plus\.google\.com\//i)) {
    chrome.tabs.sendRequest(tabId, {action: 'gpmeTabUpdateComplete'});
  }
});

// Default to expanded mode
if (localStorage.getItem('gpme_options_mode') == null)
  localStorage.setItem('gpme_options_mode', 'expanded');
