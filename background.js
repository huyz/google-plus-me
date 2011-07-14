/*
 * Filename:         background.js
 * More info, see:   extension.js
 *
 * Source:           https://github.com/huyz/google-plus-me
 * Author:           Huy Z  http://huyz.us/
 */

/************************************************************************************
  This is your background code.
  For more information please visit our wiki site: 
  http://crossrider.wiki.zoho.com/Background-Code.html
*************************************************************************************/

//Place your code here (ideal for handling toolbar button, global timers, etc.)    
/*****************
In Firefox you have two main options:
     1. setting onClick event
     2. change the currently displayed icon
In Chrome you have more options, that includes:
     1. decide whether to work with popup window or set onClick event (you can change it programmatically but to work with popup window you must set it in advance at the "Browser" tab)
     2. change the currently displayed icon
     3. add badge text to the button icon + set the badge color
     4. set button's tooltip
*****************/


// Listen to incoming messages from content scripts
appAPI.message.addListener(function(msg) {
  if (msg.action == "gpmeStatusUpdate") {
    chrome.browserAction.setBadgeText({text: (msg.count ? msg.count.toString() : "")});
  }
});

// Listen to tab updates from Chrome
// FIXME: Chrome-specific
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.url.match(/plus\.google\.com\//i)) {
    //chrome.tabs.sendRequest(tabId, {action: 'tabUpdateComplete'});
    appAPI.message.toActiveTab({action: "gpmeTabUpdateComplete"});
  }
});
