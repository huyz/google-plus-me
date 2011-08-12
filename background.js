/*
 * Filename:         background.js
 * More info, see:   gpme.js
 *
 * Web:              http://huyz.us/google-plus-me/
 * Source:           https://github.com/huyz/google-plus-me
 * Author:           Huy Z  http://huyz.us/
 */

// If true, won't need the 'tabs' permission
// NOTE: Keep format the same as it is programmatically changed by package.sh
var PARANOID = false;

/****************************************************************************
 * Constants
 ***************************************************************************/

var GPLUS_URL_REGEXP = /^https?:\/\/plus\.google\.com\//;

/****************************************************************************
 * Init
 ***************************************************************************/

// i18n messages
var i18nMessages = {};

var defaultSettings = {
  /*
   * General
   */
  'nav_summaryLines': 1,
  'nav_summaryIncludeThumbnails': false,
  'nav_summaryIncludeTime': false,
  'nav_previewEnableInExpanded': false,
  'nav_previewEnableInList': true,
  'nav_browserActionOpensNewTab': false,
  'nav_alwaysShowCollapseBarInExpanded': false,

  /*
   * Pages
   */
  'nav_global_postsDefaultMode': 'expanded',
  'nav_global_commentsDefaultCollapsed': false,

  /*
   * Compatibility
   */
  'nav_compatSgp': true,
  'nav_compatSgpComments': false,
  'nav_compatSgpCache': false
};

var settingStore = new Store("settings", defaultSettings);


/*
// Default options
if (localStorage.getItem('gpme_options_mode') === null)
  localStorage.setItem('gpme_options_mode', 'expanded');
*/

// Migration: option -> fancy-settings
var displayMode = localStorage.getItem('gpme_options_mode');
if (displayMode !== null) {
  settingStore.set('nav_global_postsDefaultMode', displayMode);
  localStorage.removeItem('gpme_options_mode');
}

/****************************************************************************
 * Version check
 ***************************************************************************/

// Check installed version
var oldVersion = localStorage.getItem('version');
var version = chrome.app.getDetails().version;
if (version != oldVersion) {
  // NOTE: we don't use the prefix 'gpme_' so that it doesn't get wiped out by a reset
  localStorage.setItem('version', version);

  // If first-time install, inject into any currently-open pages so that the
  // user isn't confused.  Later users are only updating and should already have
  // a running version (unless G+ changed its layout) and also know what to expect.
  if (oldVersion === null) {
    console.log("gpme: looks like first-time install");
    if (! PARANOID) {
      chrome.windows.getAll({populate: true}, function(windows) {
        windows.forEach(function(w) {
          w.tabs.forEach(function(tab) {
            if (tab.url.match(/^https?:\/\/plus\.google\.com\//)) {
              //chrome.tabs.insertCSS(tab.id, {file: 'gpme.css', allFrames: true});
              chrome.tabs.executeScript(tab.id, {file: 'jquery.js', allFrames: true});
              chrome.tabs.executeScript(tab.id, {file: 'jquery.ba-throttle-debounce.js', allFrames: true});
              chrome.tabs.executeScript(tab.id, {file: 'jquery.hoverIntent.js', allFrames: true});
              chrome.tabs.executeScript(tab.id, {file: 'jquery.scrollintoview.js', allFrames: true});
              chrome.tabs.executeScript(tab.id, {file: 'jquery.actual.js', allFrames: true});
              chrome.tabs.executeScript(tab.id, {file: 'lscache.js', allFrames: true});
              chrome.tabs.executeScript(tab.id, {file: 'gpme.js', allFrames: true});
            }
          });
        });
      });
    }
  }
}

/****************************************************************************
 * Settings
 ***************************************************************************/

function reset() {
  settingStore.fromObject(defaultSettings);
}

/****************************************************************************
 * Event handlers
 ***************************************************************************/

// Listen to incoming messages from content scripts
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case 'gpmeStatusUpdate':
      chrome.browserAction.setBadgeText({text: (request.count ? request.count.toString() : "")});
      break;
    case 'gpmeGetModeOption':
      sendResponse(settingStore.get('nav_global_postsDefaultMode'));
      break;
    case 'gpmeGetSettings':
      sendResponse(settingStore.toObject());
      break;
    case 'gpmeGetMessages':
      MESSAGE_NAMES.forEach(function(name) {
        i18nMessages[name] = chrome.i18n.getMessage(name);
      });
      sendResponse(i18nMessages);
      break;
    default: break;
  }
});

// Listen to browser action clicks
chrome.browserAction.onClicked.addListener(function(selectedTab) {
  function sendClick(tabId) {
    // Click on the notification
    chrome.tabs.sendRequest(tabId, {action: 'gpmeBrowserActionClick'});
  }
  
  /**
   * Opens G+ in current tab or new tab.
   * NOTE: none of these chrome.tabs require the 'tabs' (Browsing History) permission
   */
  function openGPlus(selectedTab) {
    // Re-use existing tab
    if (settingStore.get('nav_browserActionOpensNewTab') === false ||
        typeof selectedTab != 'undefined' && (
          typeof selectedTab.url == 'undefined' || selectedTab.url === null || selectedTab.url === '' ||
          selectedTab.url == 'chrome://newtab/'))
      chrome.tabs.update(selectedTab.id, {url: 'https://plus.google.com/'});
    else // Open a new tab
      chrome.tabs.create({url: 'https://plus.google.com/'});
    // NOTE: can't send click because it takes a while for the page
    // to set up.  The best we could do is have the content script
    // query and ask us whether it should open the notification status
    // on startup.  But not worth it and the user may have already clicked
    // on it by then.
  }

  // Check that the selected tab is Google+
  if (typeof selectedTab != 'undefined' && GPLUS_URL_REGEXP.test(selectedTab.url)) {
    sendClick(selectedTab.id);
  } else if (PARANOID) {
    // In paranoid mode, just open G+
    openGPlus(selectedTab);
  } else {
    // CHeck all the tabs for G+
    chrome.tabs.getAllInWindow(null, function(tabs) {
      var found = false;
      tabs.forEach(function(tab) {
      // If not, let's switch to the first one we can find
        if (! found && GPLUS_URL_REGEXP.test(tab.url)) {
          chrome.tabs.update(tab.id, { selected: true }, function() {
            sendClick(tab.id);
          });
          found = true;
        }
      });

      // Otherwise, let's open G+
      if (! found)
        openGPlus(selectedTab);
    });
  }
});

// Listen to tab updates from Chrome, e.g. back and forward buttons
if (! PARANOID) {
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.url.match(/plus\.google\.com\//i)) {
      chrome.tabs.sendRequest(tabId, {action: 'gpmeTabUpdateComplete'});
    }
  });
}
