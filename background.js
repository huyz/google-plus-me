/*
 * Filename:         background.js
 * More info, see:   gpme.js
 *
 * Web:              http://huyz.us/google-plus-me/
 * Source:           https://github.com/huyz/google-plus-me
 * Author:           Huy Z  http://huyz.us/
 */

// Default options
if (localStorage.getItem('gpme_options_mode') == null)
  localStorage.setItem('gpme_options_mode', 'expanded');

// Check installed version
var oldVersion = localStorage.getItem('version');
var version = chrome.app.getDetails().version;
if (version != oldVersion) {
  // NOTE: we don't use the prefix 'gpme_' so that it doesn't get wiped out by a reset
  localStorage.setItem('version', version);

  // If first-time install, inject into any currently-open pages
  if (oldVersion === null) {
    console.log("gpme: looks like first-time install");
    chrome.windows.getAll({populate: true}, function(windows) {
      windows.forEach(function(w) {
        w.tabs.forEach(function(tab) {
          if (tab.url.match(/^https?:\/\/plus\.google\.com\//)) {
            //chrome.tabs.insertCSS(tab.id, {file: 'gpme.css', allFrames: true});
            chrome.tabs.executeScript(tab.id, {file: 'jquery.js', allFrames: true});
            chrome.tabs.executeScript(tab.id, {file: 'jquery.hoverIntent.js', allFrames: true});
            chrome.tabs.executeScript(tab.id, {file: 'jquery.scrollintoview.js', allFrames: true});
            chrome.tabs.executeScript(tab.id, {file: 'gpme.js', allFrames: true});
          }
        });
      });
    });
  }
}

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
