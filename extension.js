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

//// For more class constants, see foldItem() in classes array

// We can't just use '.a-b-f-i-oa' cuz clicking link to the *current* page will
// refresh the contentPane
var _ID_CONTENT_PANE = '#contentPane';
//var _C_CONTAINER = '.a-b-f-i-oa';
var C_FEEDBACK = 'tk3N6e-e-vj';
var _C_SELECTED = '.a-f-oi-Ai';
var _C_ITEM = '.a-b-f-i';
var _C_CONTENT = '.a-b-f-i-p';
var _C_TITLE = '.gZgCtb';
var _C_PERMS = '.a-b-f-i-aGdrWb'; // Candidates: a-b-f-i-aGdrWb a-b-f-i-lj62Ve
var C_DATE = 'a-b-f-i-Ad-Ub';
var _C_DATE = '.a-b-f-i-Ad-Ub';
var _C_DATE_CSS = '.a-f-i-Ad-Ub';
var _C_COMMENTS_ALL_CONTAINER = '.a-b-f-i-Xb';
//var _C_COMMENTS_OLD_CONTAINER = '.a-b-f-i-W-xb'; //
var _C_COMMENTS_OLD = '.a-b-f-i-gc-cf-Xb-h';
var _C_COMMENTS = '.a-b-f-i-W-r';
var _C_COMMENTS_MORE = '.a-b-f-i-gc-Sb-Xb-h';
var _ID_STATUS_BG = '#gbi1a';
var _ID_STATUS_FG = '#gbi1';
var C_STATUS_BG_OFF = 'gbid';
var C_STATUS_FG_OFF = 'gbids';


var C_COMMENTCOUNT_NOHILITE = 'gpn-comment-count-nohilite';

/****************************************************************************
 * Init & Utility
 ***************************************************************************/

// list or expanded mode (like on GReader)
var gpnMode;

// Shared DOM.
var titlebarTpl = document.createElement('div');
titlebarTpl.setAttribute('class', 'gpn-titlebar');
titlebarTpl.innerHTML = '<div class="' + C_FEEDBACK + '"><span class="gpn-title"></span></div>';
var $titlebarTpl = $jquery(titlebarTpl);
$titlebarTpl.click(onTitleBarClick);

/**
 * For debugging
 */
function log(msg) {
  console.log("gpn." + msg);
}

/**
 * Check if should enable on certain pages
 */
function isEnabledOnThisPage() {
  return appAPI.matchPages("plus.google.com/*") && ! appAPI.matchPages(/\/posts\//);
}

/**
 * Shorten date text to give more room for snippet
 * FIXME: English-specific
 */
function abbreviateDate(text) {
  return text.replace(/\s*\(edited.*?\)/, '').replace(/Yesterday/g, 'Yest.');
}

/****************************************************************************
 * Event Handlers
 ***************************************************************************/

/**
 * Responds to click on post titlebar.
 * Calls toggleItemFolded()
 */
function onTitleBarClick() {
  // NOTE: event arg doesn't seem to work for me
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
  // Restrict to non-single-post Google+ pages
  if (!isEnabledOnThisPage())
    return;

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

  // Restrict to non-single-post Google+ pages
  if (!isEnabledOnThisPage())
    return;

  enhanceAllItems();

  // Make sure we still have an event handler for DOM changes
  var $contentPane = $jquery(_ID_CONTENT_PANE);
  if ($contentPane.length === 0)
    log("onRequest: Can't find content pane");
  else  {
    // Make sure we only have one
    $contentPane.unbind('DOMSubtreeModified', onContainerModified);
    $contentPane.bind('DOMSubtreeModified', onContainerModified);
  }
}

/**
 * Responds to changes in mode option
 */
function onOptionsModeUpdated(newMode) {
  log("onOptionsModeUpdated: new mode=" + newMode);

  // Restrict to non-single-post Google+ pages
  if (!isEnabledOnThisPage())
    return;

  // If mode has changed
  var oldMode = appAPI.db.get("gpn_options_mode");
  if (! oldMode || newMode !== oldMode) {
    gpnMode = newMode;

    // Persist
    appAPI.db.set("gpn_options_mode", newMode);

    // Force refresh of folding
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

/**
 * Handles changes to old comment counts
 */
function onCommentsUpdate(e) {
  var $item = $jquery(e.target).closest(_C_ITEM);
  var id = $item.attr('id');
  log("onCommentsUpdate: id=" + id);
  updateCommentCount(id, $item, countComments($item));
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
      appAPI.db.set("post_last_open_" + window.location.href, undefined, appAPI.time.minutesFromNow(1));

  } else {
    unfoldItem($item, $post);

    // Since this thread is a result of an interactive toggle, we record last open
    appAPI.db.set("post_last_open_" + window.location.href, id, appAPI.time.daysFromNow(30));
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
  //log("foldItem: id=" + id);
  if (gpnMode == 'expanded')
    appAPI.db.set("post_folded_" + id, true, appAPI.time.daysFromNow(30));

  // Visual changes
  //$post.fadeOut().hide(); // This causes race-condition when double-toggling quickly.
  $post.hide();
  $item.addClass('gpn-folded');

  // Update the comment count
  var commentCount = countComments($item);
  // Only update the comment count in storage if not already set
  var oldCount = appAPI.db.get('post_old_comment_count_' + id);
  if (typeof(oldCount) == 'undefined' || oldCount == null)
    appAPI.db.set('post_old_comment_count_' + id, commentCount, appAPI.time.daysFromNow(30));

  // Attached or pending title
  var $subtree;

  // If not yet done, put content in titlebar
  var $title = $subtree = $item.find('.gpn-title');
  if (! $title.hasClass('gpn-has-content')) {
    $title.addClass('gpn-has-content');

    var $srcTitle = $item.find(_C_TITLE);
    if ($srcTitle.length != 1) {
      log("foldItem: can't find post content title node");
    } else {
      // NOTE: don't just take the first div inside post content title because
      // sometimes the hangout 'Live' icons is there
      var $clonedTitle = $subtree = $srcTitle.clone();

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

      // Add comment-count container
      $clonedTitle.prepend('<div class="gpn-comment-count-container" style="display:none">' +
        '<span class="gpn-comment-count-bg ' + C_COMMENTCOUNT_NOHILITE + '"></span>' +
        '<span class="gpn-comment-count-fg ' + C_COMMENTCOUNT_NOHILITE + '"></span></div>');
      // Listen for updates to comment counts
      var $container = $item.find(_C_COMMENTS_ALL_CONTAINER);
      if ($container.length)
        $container.bind('DOMSubtreeModified', onCommentsUpdate);

      // Take out date marker
      var $clonedDate = $clonedTitle.find(_C_DATE);
      if ($clonedDate.length) {
        $clonedDate.removeClass(C_DATE);
      } else {
        log("foldItem: Can't find date marker");
      }

      // For first page display, the date is there, but for AJAX updates, the date isn't there yet.
      // So check, and delay the copying in case of updates.
      var $clonedDateA = $clonedDate.find('a');
      if ($clonedDateA.length) {
        // FIXME: English-specific
        $clonedDateA.text(abbreviateDate($clonedDateA.text()));
        $title.append($clonedTitle);

        // Stop propagation of click from the name
        $clonedTitle.find('a').click(function(e) {
          e.stopPropagation();
        });
      } else {
        // In a few ms, the date should be ready to put in
        setTimeout(function() {
          var $srcDateA = $item.find(_C_DATE + ' a');
          // Find date by CSS class, coz we nuked the date marker
          var $date = $clonedTitle.find(_C_DATE_CSS);

          // Copy the localized date from content
          if ($srcDateA.length) {
            $date.append($srcDateA.clone());
          } else {
            log("folditem.timeout: can't find the source date div");
          }

          // Take out (edited.*)
          var $dateA = $date.find('a');
          if ($dateA.length)
            $dateA.text(abbreviateDate($dateA.text()));

          // Finally, inject content into the titlebar
          $title.append($clonedTitle);

          // Stop propagation of click from the name
          // NOTE: this can't be done on a detached node.
          $clonedTitle.find('a').click(function(e) {
            e.stopPropagation();
          });
        }, 200);
      }
    }
  }

  // Updated the count in the subtree
  updateCommentCount(id, $subtree, commentCount);
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
  if (gpnMode == 'expanded')
    appAPI.db.set("post_folded_" + id, undefined, appAPI.time.minutesFromNow(1));

  // Visual changes
  $post.show();
  $item.removeClass('gpn-folded');

  // Remove the stored comment count
  appAPI.db.set('post_old_comment_count_' + id, undefined, appAPI.time.minutesFromNow(1));
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
 * Comment counting
 ***************************************************************************/

/** 
 * Count comments for item
 */
function countComments($item) {
  var commentCount = 0;
  var $oldComments = $item.find(_C_COMMENTS_OLD);
  if ($oldComments.length)
    commentCount += parseInt($oldComments.text(), 10);
  commentCount += $item.find(_C_COMMENTS).length;
  var $moreComments = $item.find(_C_COMMENTS_MORE);
  if ($moreComments.length)
    commentCount += parseInt($moreComments.text(), 10);

  //log("countComments: " + commentCount);
  return commentCount;
}

/**
 * Update the displayed comment count.
 * NOTE: this can display negative counts if someone deletes a comment;
 * FIXME: there's no handling for the deletion of a comment and then
 *   the adding of a comment -- that just looks like there was no change
 */
function updateCommentCount(id, $subtree, count) {
  //log("updateCommentCount: id=" + id + " count=" + count);
  //
  var $container = $subtree.find(".gpn-comment-count-container");
  var $countBg = $container.find(".gpn-comment-count-bg");
  var $countFg = $container.find(".gpn-comment-count-fg");

  // Change background of count
  var oldCount = appAPI.db.get('post_old_comment_count_' + id);
  if (typeof(oldCount) != 'undefined' && oldCount !== null && count != oldCount) {
    $countBg.removeClass(C_COMMENTCOUNT_NOHILITE);
    $countFg.removeClass(C_COMMENTCOUNT_NOHILITE);
    $countFg.text(count - oldCount);
    $container.show();
  } else {
    $countBg.addClass(C_COMMENTCOUNT_NOHILITE);
    $countFg.addClass(C_COMMENTCOUNT_NOHILITE);
    if (count) {
      $countFg.text(count);
      $container.show();
    } else {
      $container.hide();
    }
  }
}

/****************************************************************************
 * DOM enhancements
 ***************************************************************************/

/**
 * Enhance all the items in the current page.
 * @param {Boolean<force>} Forces a refresh of folding status in case
 *   user switches from one display mode to another
 */
function enhanceAllItems(force) {
  var i = 0;
  //log("enhanceAllItems");
  $jquery(_C_ITEM).each(function(i, val) {
    log("enhanceAllItems #" + i++);
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

    var $titlebar = $item.find('.gpn-titlebar');
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
 * Injects styles in current document
 */
function injectCss(styleUrl) {
  var head = document.getElementsByTagName('head')[0];
  var linkNode  = document.createElement('link');
  linkNode.rel = 'stylesheet';
  linkNode.type = 'text/css';
  linkNode.href = styleUrl;
  head.appendChild(linkNode);

  // Copy G+ notification status bg style because original is by ID.
  // We use a convoluted manner of copying styles in case G+ changes
  // the CSS image sprite.
  // XXX There must be an easier way than to getComputedStyle()
  var styleNode = document.createElement('style');
  styleNode.setAttribute('type', 'text/css');
  var statusNode, statusOff;
  $statusNode = $jquery(_ID_STATUS_BG);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbid' (turns bg to
    // gray), which seems to be there by default.
    if (statusOff = $statusNode.hasClass(C_STATUS_BG_OFF))
      $statusNode.removeClass(C_STATUS_BG_OFF);
    styleNode.appendChild(document.createTextNode('.gpn-comment-count-bg { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    $statusNode.addClass(C_STATUS_BG_OFF);
    styleNode.appendChild(document.createTextNode('.gpn-comment-count-bg.' + C_COMMENTCOUNT_NOHILITE + ' { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    if (! statusOff)
      $statusNode.removeClass(C_STATUS_BG_OFF);
  }

  // Copy G+ notification status fg style because original is by ID
  $statusNode = $jquery(_ID_STATUS_FG);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbid' (turns bg to
    // gray), which seems to be there by default.
    if (statusOff = $statusNode.hasClass(C_STATUS_FG_OFF))
      $statusNode.removeClass(C_STATUS_FG_OFF);
    styleNode.appendChild(document.createTextNode('.gpn-comment-count-fg { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    $statusNode.addClass(C_STATUS_FG_OFF);
    styleNode.appendChild(document.createTextNode('.gpn-comment-count-fg.' + C_COMMENTCOUNT_NOHILITE + ' { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    if (! statusOff)
      $statusNode.removeClass(C_STATUS_FG_OFF);
  }
  head.appendChild(styleNode);
}

/****************************************************************************
 * Main
 ***************************************************************************/

$jquery(document).ready(function() {
  //Place your code here (you can also define new functions above this scope)

  // Restrict to Google+ pages
  if (!appAPI.matchPages("plus.google.com/*"))
    return;  //quit if we are not on google.com pages

  //alert("Google+ Navigation (unpacked)");
  
  // Read in options and save default
  if (! (gpnMode = appAPI.db.get("gpn_options_mode"))) {
    appAPI.db.set("gpn_options_mode", gpnMode = "expanded");
  }

  // Inject CSS
  // FIXME: Chrome-specific
  injectCss(chrome.extension.getURL("googleplus-navigation.css"));

  // Listen when the subtree is modified for new posts.
  // WARNING: DOMSubtreeModified is deprecated and degrades performance:
  //   https://developer.mozilla.org/en/Extensions/Performance_best_practices_in_extensions
  var $contentPane = $jquery(_ID_CONTENT_PANE);
  if ($contentPane.length === 0)
    log("main: Can't find post container");
  else 
    $contentPane.bind('DOMSubtreeModified', onContainerModified);

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
/*
  appAPI.shortcut.add("o", onFoldKey, {
    'disable_in_input':true,
    'type':'keypress',
    'propagate':true
  });
*/

  if (isEnabledOnThisPage())
    enhanceAllItems();
});
