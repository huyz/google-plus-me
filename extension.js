/*
# Filename:         extension.js
# Version:          0.1
# Description:
#   This file takes some ideas from https://github.com/mohamedmansour/google-plus-extension/
#   and https://github.com/wittman/googleplusplus_hide_comments .
#
# Platforms:        Google Chrome, Firefox, Internet Explorer
# Depends:          
# Source:           https://github.com/huyz/googleplus-navigation
# Author:           Huy Z  http://huyz.us/
# Updated on:       2011-07-11
# Created on:       2011-07-11
#
# Installation:
#
# Usage:
#   Click on the titlebar of each shared post.
#   Or use the 'o' keyboard shortcut.
#
# Bugs:
# - keyboard scrolling can be messed up sometimes; i think that the code caches the height of the posts
# - automatic window scrolling doesn't work (for clicks and keystrokes).
# - doesn't stop youtube from playing
# - text snippet cleaning won't work in non-English

# Copyright (C) 2011 Huy Z
# 
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
# 
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/************************************************************************************
  This is your main app code.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/

/****************************************************************************
 * Constants
 ***************************************************************************/

var C_FEEDBACK = 'tk3N6e-e-vj';
var _C_SELECTED = '.a-f-oi-Ai';
var _C_CONTAINER = '.a-b-f-i-oa';
var _C_POST = '.a-b-f-i';
var _C_CONTENT = '.a-b-f-i-p';
var _C_TITLE = '.gZgCtb';
var _C_PERMS = '.a-b-f-i-aGdrWb'; // Candidates: a-b-f-i-aGdrWb a-b-f-i-lj62Ve
var _C_DATE = '.a-b-f-i-Ad-Ub';
var _C_DATE_CSS = '.a-f-i-Ad-Ub';
// For more, see foldItem() in classes array

/****************************************************************************
 * Init & Utility
 ***************************************************************************/

// list or expanded mode (like on GReader)
var gpnMode;

// Shared DOM.
var titlebarTpl = document.createElement('div');
titlebarTpl.setAttribute('class', 'gpn-posttitlebar');
titlebarTpl.innerHTML = '<div class="' + C_FEEDBACK + '"><span class="gpn-title"></span></div>';
var $titlebarTpl = $jquery(titlebarTpl);
$titlebarTpl.click(onTitleBarClick);

/**
 * For debugging
 */
function log(msg) {
  console.log("gpn." + msg);
}

/****************************************************************************
 * Event Handlers
 ***************************************************************************/

/**
 * Responds to click on post titlebar.
 * Calls toggleItemFolded()
 */
function onTitleBarClick() {
  // NOTE: event arg doesn't work
  var $item = $jquery(this).parent();
  log("onTitleBarClick: " + $item.attr('id'));

  toggleItemFolded($item);
}

/**
 * Responds to the keypress for open/close item.
 * Calls toggleItemFolded()
 */
function onFoldKey(e, attempt) {
  log("onFoldKey attempt=" + (typeof attempt == 'undefined' ? 0 : attempt));
  // Find selected item
  var $selectedItem = $jquery(_C_SELECTED);
  if ($selectedItem.length == 1) {
    if (! toggleItemFolded($selectedItem.first())) {
      // If we couldn't fold, then movement was in motion, we try again in a bit
      if (typeof(attempt) == 'undefined')
        attempt = 0;
      if (attempt < 4) {
        setTimeout(function() {
          onFoldKey(e, attempt + 1);
        }, 200);
      }
    } else {
      // XXX This is a recovery feature in case an item hasn't been enhanced
      // for some reason.  Only needed when there's a bug.
      //enhanceItem($selectedItem.get(0));
      "";
    }
  }
}

/**
 * Responds to DOM updates from Google.
 * Calls enhanceItem()
 */
function onContainerModified(e) {
  if (e.target.id.indexOf('update-') === 0) {
    log("onContainerModified: e.target=" + e.target.id);
    enhanceItem(e.target);
  }
}

/**
 * Responds to changes in the history state
 */
function onTabUpdated() {
  log("onTabUpdated");

  // Restrict to Google+ pages
  if (!appAPI.matchPages("plus.google.com/*"))
    return;  //quit if we are not on google.com pages
  enhanceAllItems();

  // Make sure we still have an event handler for DOM changes
  var $container = $jquery(_C_CONTAINER);
  if ($container.length === 0)
    log("onRequest: Can't find content pane");
  else  {
    // Make sure we only have one
    $container.unbind('DOMSubtreeModified', onContainerModified);
    $container.bind('DOMSubtreeModified', onContainerModified);
  }
}

/**
 * Responds to changes in mode option
 */
function onOptionsModeUpdated(newMode) {
  log("onOptionsModeUpdated: new mode=" + newMode);

  // If mode has changed
  var oldMode = appAPI.db.get("gpn_options_mode");
  if (! oldMode || newMode !== oldMode) {
    gpnMode = newMode;

    // Persist
    appAPI.db.set("gpn_options_mode", newMode);

    // Force refresh
    enhanceAllItems(true);

    // If going to expanded mode, we want to unfold the last item opened in list mode
    if (newMode == 'expanded') {
      var id = appAPI.db.get("post_last_open_" + window.location.href);
      if (typeof(id) != 'undefined' && id !== null) {
        var $item = $jquery('#' + id);
        //log("onOptionsModeUpdated: last open id=" + id + " $item.length=" + $item.length);
        if ($item.length == 1) {
          unfoldItem($item);
        }
      }
    }
  }
}

/****************************************************************************
 * Folding/unfolding logic
 ***************************************************************************/

/**
 * Toggle viewable state of the content of an item.
 * This is only called as a result of a user action.
 * Calls foldItem() or unfoldItem().
 */
function toggleItemFolded($item) {
  var $posts = $item.find(_C_CONTENT);
  //log("toggleItemFolded: length=" + $posts.length);
  if ($posts.length != 1) {
    // It is possible to not have a proper match during keyboard scrolling
    //log("toggleItemFolded: improper match: " + $posts.length);
    return false;
  }
  var $post = $posts.first();

  var id = $item.attr('id');
  if (! $item.hasClass('gpn-folded')) {
    foldItem($item, $post);
    // Since this thread is a result of an interactive toggle, we delete last open
    if (appAPI.db.get("post_last_open_" + window.location.href) == id)
      appAPI.db.set("post_last_open_" + window.location.href, undefined, appAPI.time.minutesFromNow(5));

  } else {
    unfoldItem($item, $post);

    // Since this thread is a result of an interactive toggle, we record last open
    appAPI.db.set("post_last_open_" + window.location.href, id, appAPI.time.daysFromNow(10));
  }

  return true;
}

/**
 * Fold item
 */
function foldItem($item, $post) {
  if (typeof($post) == 'undefined') {
    var $posts = $item.find(_C_CONTENT);
    if ($posts.length != 1) {
      //log("foldItem: $posts.length=" + $posts.length);
      return;
    }
    $post = $posts.first();
  }

  // Persist
  var id = $item.attr('id');
  log("foldItem: id=" + id);
  if (gpnMode == 'expanded')
    appAPI.db.set("post_folded_" + id, true);

  // Visual changes
  //$post.fadeOut().hide(); // This causes race-condition when double-toggling quickly.
  $post.hide();
  $item.addClass('gpn-folded');

  // If not yet done, put content in titlebar
  var $title = $item.find('.gpn-title');
  if (! $title.hasClass('gpn-has-content')) {
    $title.addClass('gpn-has-content');

    var $srcTitle = $item.find(_C_TITLE);
    if ($srcTitle.length != 1) {
      log("foldItem: can't find post content title node");
    } else {
      // NOTE: don't just take the first div inside post content title because
      // sometimes the hangout 'Live' icons is there
      var $clonedTitle = $srcTitle.clone();

      // Take out date marker
      var $clonedDate = $clonedTitle.find(_C_DATE);
      if ($clonedDate.length) {
        $clonedDate.removeClass(_C_DATE);
      } else {
        log("foldItem: Can't find date marker");
      }

      // Take out permissions
      var $perms = $clonedTitle.find(_C_PERMS);
      if ($perms.length > 0) {
        $perms.remove();
      } else {
        log("foldItem: can't find permissions div");
      }

      // Put in snippet, trying differing things
      var classes = [
        '.a-b-f-i-u-ki', // poster text
        '.a-b-f-i-p-R', // original poster text
        '.a-f-i-ie-R', // hangout text
        '.ea-S-pa-qa', // photo caption
        '.a-f-i-p-qb .a-b-h-Jb', // photo album
        '.w0wKhb', // "A was tagged in B"
        '.ea-S-R-h', // title of shared link
        '.ea-S-Xj-Cc' // text of shared link
      ];
      for (var c in classes) {
        var $snippet = $item.find(classes[c]);
        var text;
        if ($snippet.length && (text = $snippet.text()).match(/\S/)) {
          if (classes[c] == '.a-f-i-ie-R') {
            // FIXME: English-specific
            text = text.replace(/.*hung out\s*/, '');
          }
          $clonedTitle.append('<span class="gpn-snippet">' + text + '</span>');
          break;
        }
      }

      // For first page display, the date is there, but for AJAX updates, the date isn't there yet.
      // So check, and delay the copying in case of updates.
      var $clonedDateA = $clonedTitle.find(_C_DATE + ' a');
      if ($clonedDateA.length) {
        // FIXME: English-specific
        $clonedDateA.text($clonedDateA.text().replace(/\s*\(edited.*?\)/, '').replace(/Yesterday/g, 'Yest.'));
        $title.append($clonedTitle);
      } else {
        // In a few ms, the date should be ready to put in
        setTimeout(function() {
          var $srcDateA = $item.find(_C_DATE + ' a');
          var $date = $clonedTitle.find(_C_DATE_CSS);

          // Copy the localized date from content
          if ($srcDateA.length) {
            $date.append($srcDateA.clone());
          } else {
            log("folditem.timeout: can't find the source date div");
          }

          // Take out (edited.*)
          var $dateA = $date.find('a');
          if ($dateA.length) {
            // FIXME: English-specific
            $dateA.text($dateA.text().replace(/\s*\(edited.*?\)/, '').replace(/Yesterday/g, 'Yest.'));
          }

          // Finally, inject content into the titlebar
          $title.append($clonedTitle);
        }, 500);
      }
    }
  }
}

/**
 * For both list and expanded mode, unfolds the item.
 * May call listCloseItem().
 */
function unfoldItem($item, $post) {
  if (typeof($post) == 'undefined') {
    var $posts = $item.find(_C_CONTENT);
    if ($posts.length != 1) {
      //log("unfoldItem: $posts.length=" + $posts.length);
      return;
    }
    $post = $posts.first();
  }

  // In list mode, we close the previous opened item
  var id = $item.attr('id');
  //log("unfoldItem: id=" + id);
  if (gpnMode == 'list') {
    lastOpenId = appAPI.db.get("post_last_open_" + window.location.href);
    //log("unfoldItem: last open id=" + lastOpenId);
    // NOTE: we check for undefined because of our bug workaround
    if (typeof(lastOpenId) != "undefined" && lastOpenId !== null && lastOpenId != id) {
      //log("unfoldItem: href=" + window.location.href + " id =" + id + " lastOpenId=" + lastOpenId);
      var $lastItem = $jquery('#' + lastOpenId);
      if ($lastItem.length > 0 && $lastItem.hasClass('gpn-enh')) {
        listCloseItem(lastOpenId);
      }
    }
  }

  // Persist
  if (gpnMode == 'expanded') {
    appAPI.db.set("post_folded_" + id, undefined, appAPI.time.minutesFromNow(5));
  }

  // Visual changes
  $post.show();
  $item.removeClass('gpn-folded');
}

/**
 * Assuming list mode, given an ID, close the item, if possible.
 * Is called by enhanceItem() and calls foldItem().
 * XXX Doesn't do much; may just inline it inside unfoldItem()
 */
function listCloseItem(id) {
  //log("listCloseItem: id=" + id);
  var $openItem = $jquery('#' + id);
  if ($openItem.length > 0) {
    foldItem($openItem.first());
  } else {
    log("listCloseItem: can't find it: matches=" + $openItem.length);
  }
}

/****************************************************************************
 * DOM enhancements
 ***************************************************************************/

/**
 * Enhance all the items in the current page.
 * @param {Boolean<force>} Forces a refresh
 */
function enhanceAllItems(force) {
  var i = 0;
  //log("enhanceAllItems");
  $jquery(_C_POST).each(function(i, val) {
    //log("enhanceAllItems #" + i++);
    enhanceItem(val, force);
  });
}

/**
 * Enhance item with a foldable title bar
 *
 * @param {Object<item>} post item
 * @param {Boolean<force>} Forces a refresh
 */
function enhanceItem(item, force) {
  if (! item)
    return;

  //log("enhanceItem: " + item.id);
  var $item = $jquery(item);

  if (force || ! $item.hasClass('gpn-enh')) {
    // Add titlebar
    var $itemContent = $item.find(_C_CONTENT);
    if ($itemContent.length != 1) {
      log("enhanceItem: Can't find child of item " + $item.attr('id'));
      return;
    }
    // NOTE: we have to change the class before inserting or we'll get more
    // events and infinite recursion.
    //log("enhanceItem: enhancing");
    if (! $item.hasClass('gpn-enh'))
      $item.addClass('gpn-enh');

    var $titlebar = $item.find('.gpn-posttitlebar');
    if ($titlebar.length === 0) {
      $titlebar = $titlebarTpl.clone(true);
      $titlebar.insertBefore($itemContent);
    }

    if (gpnMode == 'list') {
      // If list-mode, find the expanded one
      var lastOpenId = appAPI.db.get("post_last_open_" + window.location.href);
      if (typeof(lastOpenId) != "undefined" && lastOpenId !== null && lastOpenId == item.id) {
        //log("enhanceItem: post_open match on " + itemOpenId);
        // We explicitly open in order to close any previously opened item
        // FIXME: this favors the oldest instead of the most recent opened item
        unfoldItem($item);
      } else {
        //log("enhanceItem: post_open no match " + itemOpenId + " != " + $item.attr('id'));
        foldItem($item);
      }
    } else {
      var itemFolded = appAPI.db.get("post_folded_" + $item.attr('id'));
      // Fold if necessary
      if (itemFolded) {
        foldItem($item);
      } else {
        unfoldItem($item);
      }
    }
  }
}

/**
 * Injects reference to stylesheet in current document
 */
function injectCssLink(cssURL) {
  var linkNode  = document.createElement('link');
  linkNode.rel = 'stylesheet';
  linkNode.type = 'text/css';
  linkNode.href = cssURL;
  document.getElementsByTagName('head')[0].appendChild(linkNode);
}

/****************************************************************************
 * Main
 ***************************************************************************/

$jquery(document).ready(function() {
  //Place your code here (you can also define new functions above this scope)

  // Restrict to Google+ pages
  if (!appAPI.matchPages("plus.google.com/*")) return;  //quit if we are not on google.com pages

  //alert("Google+ Navigation (unpacked)");
  
  // Read in options and save default
  if (! (gpnMode = appAPI.db.get("gpn_options_mode"))) {
    appAPI.db.set("gpn_options_mode", gpnMode = "expanded");
  }

  // Inject stylesheet
  // FIXME: Chrome-specific
  injectCssLink(chrome.extension.getURL("googleplus-navigation.css"));

  // Listen when the subtree is modified for new posts.
  // WARNING: DOMSubtreeModified is deprecated and degrades performance:
  //   https://developer.mozilla.org/en/Extensions/Performance_best_practices_in_extensions
  var $container = $jquery(_C_CONTAINER);
  if ($container.length === 0)
    log("main: Can't find post container");
  else 
    $container.bind('DOMSubtreeModified', onContainerModified);

  // Listen for history state changes
  // http://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate
  /* Doesn't work on Chrome
  (function(history){
      var pushState = history.pushState;
      history.pushState = function(state) {
          if (typeof history.onpushstate == "function") {
              history.onpushstate({state: state});
          }
          alert("pushstate");
          // Call default
          return pushState.apply(history, arguments);
      }
  })(window.history);
  window.onpopstate = history.onpushstate = function(e) {
    enhanceAllItems();
  };
  */

  //listen to incoming messages 
  appAPI.message.addListener(function(msg) {
    if (msg.action == "gpnTabUpdateComplete") {
      // Handle G+'s history state pushing when user clicks on different streams (and back)
      onTabUpdated();
    } else if (msg.action == "gpnModeOptionUpdated") {
      // Handle options changes
      onOptionsModeUpdated(msg.mode);
    }
  }, document);


  // Listen for keystrokes
  appAPI.shortcut.add("o", onFoldKey, {
    'disable_in_input':true,
    'type':'keypress',
    'propagate':true
  });

  enhanceAllItems();
});
