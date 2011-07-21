/*
# Filename:         gpme.js
#
# Platforms:        Google Chrome
# Depends:          
* Web:              http://huyz.us/google-plus-me/
# Source:           https://github.com/huyz/google-plus-me
# Author:           Huy Z  http://huyz.us/
# Updated on:       2011-07-20
# Created on:       2011-07-11
#
# Installation:
#   Like any other browser extension.
#
# Usage:
#   Click on the titlebar of each shared post.
#   [NOT YET ENABLED: Or use the 'o' keyboard shortcut.]
#
# Thanks:
#   This extension takes some ideas from https://github.com/mohamedmansour/google-plus-extension/
#   and https://github.com/wittman/googleplusplus_hide_comments .

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
var _FEEDBACK_LINK = '.a-eo-eg';
var C_FEEDBACK = 'tk3N6e-e-vj';
var _C_SELECTED = '.a-f-oi-Ai';
var _C_ITEM = '.a-b-f-i';
var _C_CONTENT = '.a-b-f-i-p';
var P_PHOTO = '.a-f-i-p-U > a.a-f-i-do';
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


var C_COMMENTCOUNT_NOHILITE = 'gpme-comment-count-nohilite';

/****************************************************************************
 * Init & Utility
 ***************************************************************************/

// list or expanded mode (like on GReader)
var displayMode;

// In list mode, an item that was opened but may need to be reclosed
// once the location.href is corrected
var $lastTentativeOpen = null;

var $lastPreviewedItem = null;

// Shared DOM: the titlebar
var titlebarTpl = document.createElement('div');
titlebarTpl.setAttribute('class', 'gpme-titlebar');
titlebarTpl.innerHTML = '<div class="' + C_FEEDBACK + '"><div class="gpme-fold-icon gpme-fold-icon-unfolded-left">\u25bc</div><div class="gpme-fold-icon gpme-fold-icon-unfolded-right">\u25bc</div><span class="gpme-title"></span></div>';
var $titlebarTpl = $(titlebarTpl);
$titlebarTpl.click(onTitleBarClick);

// Shared DOM: the preview triangle
var postWrapperTpl = document.createElement('div');
postWrapperTpl.className = 'gpme-post-wrapper';
var clickWall = document.createElement('div');
clickWall.className = 'gpme-disable-clicks';
clickWall.style.position = 'absolute';
clickWall.style.height = '100%';
clickWall.style.width = '100%';
clickWall.style.zIndex = '12'; // higher than .gpme-folded .a-f-i-Ia-D
clickWall.style.display = 'none';
var previewTriangleSpan = document.createElement('span');
previewTriangleSpan.className = 'gpme-preview-triangle';
previewTriangleSpan.style.backgroundImage = 'url(' + chrome.extension.getURL('/images/preview-triangle.png') + ')';
postWrapperTpl.appendChild(clickWall);
postWrapperTpl.appendChild(previewTriangleSpan);
var $postWrapperTpl = $(postWrapperTpl);

// For instant previews, hoverIntent
var hoverIntentConfig = {    
  handlerIn: showPreview, // function = onMouseOver callback (REQUIRED)    
  delayIn: 400, // number = milliseconds delay before onMouseOver
  handlerOut: hidePreview, // function = onMouseOut callback (REQUIRED)    
  delayOut: 350, // number = milliseconds delay before onMouseOut    
  exclusiveSet: null // name of exclusiveSet to which the target belongs
};

// Duration of clickwall.
// NOTE: timeout must be less than jquery.hoverIntent's overTimeout, otherwise
// the preview will go away.
var clickWallTimeout = 300;

/**
 * For debugging
 */
function log(msg) {
  console.log("g+me." + msg);
}
function trace(msg) {
  console.log("g+me: " + msg);
}
function error(msg) {
  console.log("ERROR: g+me." + msg);
}

/**
 * Check if should enable on certain pages
 */
function isEnabledOnThisPage() {
  return ! window.location.href.match(/\/(posts|notifications|sparks)\//);
}

/**
 * Shorten date text to give more room for snippet
 * FIXME: English-specific
 */
function abbreviateDate(text) {
  return text.replace(/\s*\(edited.*?\)/, '').replace(/Yesterday/g, 'Yest.');
}

/**
 * Queries background page for options
 */
function getOptionsFromBackground(callback) {
  chrome.extension.sendRequest({action: 'gpmeGetModeOption'}, function(response) {
    displayMode = response;
    callback();
  });
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
  var $item = $(this).parent();
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
  var $selectedItem = $(_C_SELECTED);
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
    }
  }
}

/**
 * Responds to changes in the history state
 */
function onTabUpdated() {
  trace("event: Chrome says that tab was updated");

  // Restrict to non-single-post Google+ pages
  if (!isEnabledOnThisPage())
    return;

  updateAllItems();

  /*
  // Make sure we still have an event handler for DOM changes.
  var $contentPane = $(_ID_CONTENT_PANE);
  if ($contentPane.length === 0) {
    log("onRequest: Can't find content pane");
  } else  {
    // Make sure we only have one
    $contentPane.unbind('DOMSubtreeModified', onContainerModified);
    $contentPane.bind('DOMSubtreeModified', onContainerModified);
  }
  */
}

/**
 * Responds to changes in mode option
 */
function onModeOptionUpdated(newMode) {
  log("onModeOptionUpdated: new mode=" + newMode);

  // Restrict to non-single-post Google+ pages
  if (! isEnabledOnThisPage())
    return;

  // If mode has changed
  var oldMode = displayMode;
  displayMode = newMode;
  if (typeof(oldMode) == 'undefined' || displayMode != oldMode)
    refreshAllFolds();
}

/**
 * Responds to reset all
 */
function onResetAll() {
  log("onResetAll");

  var oldMode = displayMode;
  for (var i in localStorage) {
    if (i.indexOf('gpme_') === 0)
      localStorage.removeItem(i);
  }

  getOptionsFromBackground(function() {
    // If mode has changed
    log("onResetAll: oldMode=" + oldMode + " newMode=" + displayMode);
    if (typeof(oldMode) == 'undefined' || displayMode != oldMode)
      refreshAllFolds();
  });
}

/**
 * Responds to DOM updates from G+ to handle incoming items.
 * Calls updateItem()
 */
function onContainerModified(e) {
  var id = e.target.id;
  // Some weak optimization attempts
  if (! id || id.charAt(0) == ':' || id.indexOf('update-') !== 0 || ! isEnabledOnThisPage())
    return;

  log("onContainerModified: id=" + e.target.id);

  trace("event: DOMSubtreeModified for item id=" + e.target.id);
  updateItem(e.target);
}

/**
 * Responds to DOM updates from G+ to handle changes to old comment counts
 */
function onCommentsUpdated(e) {
  var id = e.target.id;
  // Some weak optimization attempts to prevent lag when typing comments.
  if (id && id.charAt(0) == ':')
    return;

  log("onCommentsUpdated: id=" + e.target.id);
  var $item = $(e.target).closest(_C_ITEM);
  if (! $item) {
    error("onCommentsUpdated: Can't find ancestor of comments");
    return;
  }

  id = $item.attr('id');
  //log("onCommentsUpdated: id=" + id);
  updateCommentCount(id, $item, countComments($item));
}

/**
 * Responds to DOM updates from G+ to handle change in status of new notifications shown to the user
 */
function onStatusUpdated(e) {
  log("onStatusUpdated");
  chrome.extension.sendRequest({action: 'gpmeStatusUpdate', count: parseInt(e.target.innerText, 10)});
}

/****************************************************************************
 * DOM enhancements & folding according to state
 ***************************************************************************/

/**
 * Injects styles in current document
 */
function injectCSS() {
  var linkNode  = document.createElement('link');
  linkNode.rel = 'stylesheet';
  linkNode.type = 'text/css';
  linkNode.href = chrome.extension.getURL('gpme.css') + '?' + new Date().getTime();
  document.getElementsByTagName('head')[0].appendChild(linkNode);

  // Copy G+ notification status bg style because original is by ID.
  // We use a convoluted manner of copying styles in case G+ changes
  // the CSS image sprite.
  // XXX There must be an easier way than to getComputedStyle()
  var styleNode = document.createElement('style');
  styleNode.setAttribute('type', 'text/css');
  var statusNode, statusOff;
  $statusNode = $(_ID_STATUS_BG);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbid' (turns bg to
    // gray), which seems to be there by default.
    statusOff = $statusNode.hasClass(C_STATUS_BG_OFF);
    if (statusOff)
      $statusNode.removeClass(C_STATUS_BG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-bg { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    $statusNode.addClass(C_STATUS_BG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-bg.' + C_COMMENTCOUNT_NOHILITE + ' { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    if (! statusOff)
      $statusNode.removeClass(C_STATUS_BG_OFF);
  }

  // Copy G+ notification status fg style because original is by ID
  $statusNode = $(_ID_STATUS_FG);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbid' (turns bg to
    // gray), which seems to be there by default.
    statusOff = $statusNode.hasClass(C_STATUS_FG_OFF);
    if (statusOff)
      $statusNode.removeClass(C_STATUS_FG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-fg { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    $statusNode.addClass(C_STATUS_FG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-fg.' + C_COMMENTCOUNT_NOHILITE + ' { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    if (! statusOff)
      $statusNode.removeClass(C_STATUS_FG_OFF);
  }

  document.getElementsByTagName('head')[0].appendChild(styleNode);
}

/**
 * Injects code to make the Feedback button work
 */
function injectNewFeedbackLink() {
  //var $link = $('.a-eo-eg');
  //alert($link.attr('onclick'));
  //$link.attr('onclick', 'alert("shit");');
  //$link.click(function(event) { alert("yes"); if (confirm("sheeet")) return appfeedback.startFeedback(event); else return false; });
  //$link.click(function(event) { alert("yes") });
  //$link.attr('onclick', 'alert("yes");');
  //alert($link.attr('onclick'));
}

/**
 * Refresh fold/unfolded display of items.
 * Called by onModeOptionUpdated() and onResetAll()
 */
function refreshAllFolds() {
  // Force refresh of folding
  updateAllItems(true);

  // If going to expanded mode, we want to unfold the last item opened in list mode
  if (displayMode == 'expanded') {
    var id = localStorage.getItem("gpme_post_last_open_" + window.location.href);
    if (typeof(id) != 'undefined' && id !== null) {
      var $item = $('#' + id);
      //log("onModeOptionUpdated: last open id=" + id + " $item.length=" + $item.length);
      if ($item.length == 1) {
        unfoldItem($item);
      }
    }
  }
}

/**
 * Enhance all the items in the current page.
 * Is called by main(), onTabUpdated(), and onModeOptionUpdated()
 * @param {Boolean<force>} Forces a refresh of folding status in case
 *   user switches from one display mode to another
 */
function updateAllItems(force) {
  //log("updateAllItems");
  
  // Update all items
  $(_C_ITEM).each(function(i, val) {
    log("updateAllItems #" + i);
    i++;
    updateItem(val, force);
  });

  // If list mode, make sure the correct last opened entry is unfolded, now that
  // we know that window.location.href is correct
  if (displayMode == 'list') {
    unfoldLastOpenInListMode();
  }
}


/**
 * In list mode, unfold the last opened entry, refolding any wrongly unfolded entry
 * NOTE: At this point, location.href may or may not be correct.
 */
function unfoldLastOpenInListMode() {
  //log("unfoldLastOpenInListMode: href=" + window.location.href);
  var lastOpenId = localStorage.getItem("gpme_post_last_open_" + window.location.href);

  // Undo any incorrectly-unfolded item
  // NOTE: lastOpenId could be null, which means this is a page that wasn't visited
  // before in list mode or a page that had all items closed; we still want to close
  // the incorrectly-opened item
  // FIXME: we still get the flash of an open-then-closed item
  // XXX Strange: if I search lastTentativeOpen by id, I may be hiding an entry that
  // won't be shown.  Would be interesting to investigate further, as it probably
  // has to do with the way the DOM updates happen with G+.
  if ($lastTentativeOpen !== null && $lastTentativeOpen.attr('id') != lastOpenId) {
    //log("unfoldLastOpenInListMode: # tentative opens =" + $('#' + lastTentOpenId).length);
    foldItem($lastTentativeOpen);
    $lastTentativeOpen = null;
  }

  if (lastOpenId !== null) {
    // We explicitly open in order to close any previously opened item
    // FIXME: this favors the oldest instead of the most recent opened item
    unfoldItem($('#' + lastOpenId));
  }
}

/**
 * Enhance item with a foldable title bar.
 * Also fold/unfold appropriately, except in list mode where the
 * caller is responsible for unfolding the appropriate item.
 *
 * @param {Object<item>} post item
 * @param {Boolean<force>} Forces a folding refresh
 */
function updateItem(item, force) {
  if (! item)
    return;
  var refreshFold = force;

  log("updateItem: " + item.id);
  var $item = $(item);

  if (! $item.hasClass('gpme-enh')) {
    // Add titlebar
    var $itemContent = $item.find(_C_CONTENT);
    if ($itemContent.length != 1) {
      error("updateItem: Can't find content of item " + $item.attr('id'));
      return;
    }
    // NOTE: we have to change the class before inserting or we'll get more
    // events and infinite recursion.
    //log("updateItem: enhancing");
    $item.addClass('gpme-enh');

    // Add hover event handler
    $item.hoverIntent(hoverIntentConfig);
    //$item.hover(showPreview, hidePreview);

    var $titlebar = $item.find('.gpme-titlebar');
    if ($titlebar.length === 0) {
      $titlebar = $titlebarTpl.clone(true);
      $titlebar.insertBefore($itemContent);
    }

    // Insert container for post content so that we can turn it into an instant
    // preview
    var $wrapper = $postWrapperTpl.clone().insertAfter($titlebar);
    $wrapper.append($itemContent);

    refreshFold = true;
  }

  if (refreshFold) {
    if (displayMode == 'list') {
      // Check if it's supposed to be unfolded
      // NOTE: the href may be incorrect at this point if the user is clicking on a new
      // stream link and the updates are coming in through AJAX *before* a tabUpdated event
      var lastOpenId = localStorage.getItem("gpme_post_last_open_" + window.location.href);

      if (lastOpenId !== null && item.id == lastOpenId) {
        unfoldItem($item);

        // Record this operation because we may have to undo it once location.href is
        // known to be correct
        $lastTentativeOpen = $item;
      } else {
        foldItem($item);
      }
    } else if (displayMode == 'expanded') {
      var itemFolded = localStorage.getItem("gpme_post_folded_" + $item.attr('id'));
      // Fold if necessary
      if (itemFolded !== null) {
        foldItem($item);
      } else {
        unfoldItem($item);
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
 * @return true if toggling worked
 */
function toggleItemFolded($item) {
  var $post = $item.find('.gpme-post-wrapper');
  //log("toggleItemFolded: length=" + $posts.length);
  if ($post.length != 1) {
    // It is possible to not have a proper match during keyboard scrolling
    // (hit 'j' and 'o' in quick succession)
    //log("toggleItemFolded: improper match: " + $posts.length);
    return false;
  }

  var id = $item.attr('id');
  if ($item.hasClass('gpme-folded')) {
    // If in list mode, we need to fold the previous one
    if (displayMode == 'list') {
      lastOpenId = localStorage.getItem('gpme_post_last_open_' + window.location.href);
      //log("unfoldItem: last open id=" + lastOpenId);
      if (lastOpenId !== null && lastOpenId != id) {
        //log("unfoldItem: href=" + window.location.href + " id =" + id + " lastOpenId=" + lastOpenId);
        var $lastItem = $('#' + lastOpenId);
        if ($lastItem.length && $lastItem.hasClass('gpme-enh')) {
          foldItem($lastItem);
        }
      }
    }

    unfoldItem($item, $post);

    // Since this thread is a result of an interactive toggle, we record last open
    log("toggleItemFolded: href=" + window.location.href);
    log("toggleItemFolded: gpme_post_last_open_" + window.location.href + "->id = " + id);
    localStorage.setItem("gpme_post_last_open_" + window.location.href, id);
  } else {
    foldItem($item, $post);

    // Since this thread is a result of an interactive toggle, we delete last open
    if (localStorage.getItem("gpme_post_last_open_" + window.location.href) == id)
      localStorage.removeItem("gpme_post_last_open_" + window.location.href);
  }

  return true;
}

/**
 * Fold item, and give titlebar summary content if necessary
 * @param $post Optional if you have it
 */
function foldItem($item, $post) {
  if (typeof($post) == 'undefined') {
    $post = $item.find('.gpme-post-wrapper');
    if ($post.length != 1) {
      error("foldItem: Can't find post content node");
      return;
    }
  }

  var id = $item.attr('id');

  // Persist for expanded mode
  log("foldItem: id=" + id);
  if (displayMode == 'expanded')
    localStorage.setItem("gpme_post_folded_" + id, true);

  // Visual changes
  //$post.fadeOut().hide(); // This causes race-condition when double-toggling quickly.
  $post.hide();
  $item.addClass('gpme-folded');
  //log("foldItem: id=" + id + " folded=" + $item.hasClass('gpme-folded') + " post.class=" + $post.attr('class') + " should be folded!");

  // Update the comment count
  var commentCount = countComments($item);
  // Only update the comment count in storage if not already set
  var oldCount = localStorage.getItem('gpme_post_old_comment_count_' + id);
  if (typeof(oldCount) == 'undefined' || oldCount === null)
    // For nice screenshots
    //localStorage.setItem('gpme_post_old_comment_count_' + id, Math.floor(commentCount / 2));
    localStorage.setItem('gpme_post_old_comment_count_' + id, commentCount);

  // Attached or pending title
  var $subtree;

  // If not yet done, put content in titlebar
  var $title = $subtree = $item.find('.gpme-title');
  if (! $title.hasClass('gpme-has-content')) {
    $title.addClass('gpme-has-content');

    var $srcTitle = $item.find(_C_TITLE);
    if ($srcTitle.length != 1) {
      error("foldItem: can't find post content title node");
    } else {
      // NOTE: don't just take the first div inside post content title because
      // sometimes the hangout 'Live' icons is there
      var $clonedTitle = $subtree = $srcTitle.clone();

      var $srcPhoto = $item.find(P_PHOTO);
      if ($srcPhoto.length) {
        $clonedTitle.prepend($srcPhoto.clone());
      }

      // Insert fold icon
      $clonedTitle.prepend('<span class="gpme-fold-icon">\u25b6</span>');

      // Take out permissions
      var $perms = $clonedTitle.find(_C_PERMS);
      if ($perms.length > 0) {
        $perms.remove();
      } else {
        error("foldItem: can't find permissions div");
      }

      // Put in snippet, trying differing things
      var classes = [
        '.a-b-f-i-u-ki', // poster text
        '.a-b-f-i-p-R', // original poster text (and for one's own post, just "Edit")
        '.a-b-f-S-oa', // poster link (must come after .a-b-f-i-p-R, which sometimes it's just "Edit")
        '.a-f-i-ie-R', // hangout text
        '.w0wKhb', // "A was tagged in B"
        '.ea-S-pa-qa', // photo caption
        '.a-f-i-p-qb .a-b-h-Jb', // photo album
        '.ea-S-R-h', // title of shared link
        '.ea-S-Xj-Cc' // text of shared link
      ];
      for (var c in classes) {
        var $snippet = $item.find(classes[c]);
        if (! $snippet.length)
          continue;

        // We want to ignore link shares that only have the text Edit
        // <span class="a-Ja-h a-f-i-Ka-Ja a-b-f-i-Ka">Edit</span>
        if (classes[c] == '.a-b-f-i-u-ki' || classes[c] == '.a-b-f-i-p-R') {
          $snippet = $snippet.clone();
          $snippet.find('.a-b-f-i-Ka').remove();
        }
        var text = $snippet.text();
        if (text.match(/\S/)) {
          if (classes[c] == '.a-f-i-ie-R') {
            // FIXME: English-specific
            text = text.replace(/.*hung out\s*/, '');
          }
          $snippet = $('<span class="gpme-snippet"></span');
          $snippet.text(text); // We have to add separately to properly escape HTML tags
          $clonedTitle.append($snippet);
          break;
        }
      }

      // Add comment-count container
      $clonedTitle.prepend('<div class="gpme-comment-count-container" style="display:none">' +
        '<span class="gpme-comment-count-bg ' + C_COMMENTCOUNT_NOHILITE + '"></span>' +
        '<span class="gpme-comment-count-fg ' + C_COMMENTCOUNT_NOHILITE + '"></span></div>');
      // Listen for updates to comment counts
      var $container = $item.find(_C_COMMENTS_ALL_CONTAINER);
      if ($container.length)
        $container.bind('DOMSubtreeModified', onCommentsUpdated);

      // Take out date marker
      var $clonedDate = $clonedTitle.find(_C_DATE);
      if ($clonedDate.length) {
        $clonedDate.removeClass(C_DATE);
      } else {
        error("foldItem: Can't find date marker");
      }

      // For first page display, the date is there, but for updates, the date isn't there yet.
      // So check, and delay the copying in case of updates.
      var $clonedDateA = $clonedDate.find('a');
      if ($clonedDateA.length && $clonedDateA.text() != '#') {
        // Strip out the A link because we don't want to make it clickable
        // Not only does clicking it somehow opens a new window, but we need
        // the clicking space especially with instant previews
        $clonedDate.text(abbreviateDate($clonedDate.text()));
        $title.append($clonedTitle);

        // Stop propagation of click from the name
        $clonedTitle.find('a').click(function(e) {
          e.stopPropagation();
        });
      } else {
        console.log("foldItem: clonedDateA " + $clonedDateA.text());
        // In a few ms, the date should be ready to put in
        setTimeout(function() {
          var $srcDateA = $item.find(_C_DATE + ' a');
          // Find date by CSS class, coz we nuked the date marker
          var $date = $clonedTitle.find(_C_DATE_CSS);

          // Copy the localized date from content
          if ($srcDateA.length) {
            $date.text(abbreviateDate($srcDateA.text()));
          } else {
            error("folditem.timeout: can't find the source date div");
          }

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
 * @param $post Optional if you have it
 */
function unfoldItem($item, $post) {
  if (typeof($post) == 'undefined') {
    $post = $item.find('.gpme-post-wrapper');
    if ($post.length != 1) {
      //log("unfoldItem: $posts.length=" + $posts.length);
      return;
    }
  }

  var id = $item.attr('id');

  // Persist for expanded mode
  if (displayMode == 'expanded')
    localStorage.removeItem("gpme_post_folded_" + id);

  // Visual changes
  $post.show();
  $item.removeClass('gpme-folded');

  // Remove the stored comment count
  localStorage.removeItem('gpme_post_old_comment_count_' + id);
  localStorage.removeItem('gpme_post_old_comment_count_changed_' + id);
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
  var $container = $subtree.find(".gpme-comment-count-container");
  var $countBg = $container.find(".gpme-comment-count-bg");
  var $countFg = $container.find(".gpme-comment-count-fg");

  // Change background of count
  var oldCount = localStorage.getItem('gpme_post_old_comment_count_' + id);
  if (oldCount !== null &&
      (count != oldCount || localStorage.getItem('gpme_post_old_comment_count_changed_' + id) !== null)) {
    $countBg.removeClass(C_COMMENTCOUNT_NOHILITE);
    $countFg.removeClass(C_COMMENTCOUNT_NOHILITE);
    $countFg.text(count - oldCount);
    $container.show();

    // Keep track of comment count changes, so that "0" stays red (when
    // someone deletes a comment)
    localStorage['gpme_post_old_comment_count_changed_' + id] = true;
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
 * Preview
 ***************************************************************************/

function showPreview(e) {
  //log("showPreview: this=" + this.className);

  // Skip if this is expanded mode
  if (displayMode == 'expanded')
    return;

  // Sometimes if you switch windows, there might be some preview remaining
  // that hoverIntent will not catch.
  if ($lastPreviewedItem)
    hidePostItemPreview($lastPreviewedItem);

  var $item = $(this);

  var $post = $item.find('.gpme-post-wrapper');
  if ($post.length) {
    // Block clicks temporarily
    var $clickWall = $item.find('.gpme-disable-clicks');
    $clickWall.show();
    setTimeout(function() { $clickWall.hide(); } , clickWallTimeout);

    $post.show();
    $lastPreviewedItem = $item;

    // Detect fixed topbar for compatibility (from "Replies and more for Google+")
    var $topbar = $('#gb');
    var isTopbarFixed = $topbar.length && ($topbar.parent().css('position') == 'fixed');

    // Move to the right edge and as far up as possible
    // 303px = (31+60+32) cropping + 195 width of sidebar - 15 slack
    // NOTE: need lots of slack coz the horizontal scrollbar flashes on OSX for some rason
    $post.css('left',
      '' + (295 + Math.max(0, Math.floor((document.body.clientWidth - 960) / 2))) + 'px');
    // Move to the top, leaving room for the top bar
    // NOTE: first '30' is the height of triangle; second '30' is height of Google status bar.
    var offsetY = Math.max(/* post-wrapper's padding-top */ 6,
        Math.min($post.outerHeight() - /* height of triangle */ 30 - /* post-wrapper's padding-bottom */ 6,
          $item.offset().top -
          (isTopbarFixed ? document.body.scrollTop + 30
            : Math.max(document.body.scrollTop, /* height of Google statusbar */ 30 )) - /* breathing room */ 7));
    $post.css('top', '' + (-offsetY) + 'px');
    //$post.css('max-height', '' + (window.innerHeight - 14) + 'px');
    var $triangle = $item.find('.gpme-preview-triangle');
    $triangle.css('top',  '' + offsetY + 'px');
  } else {
    error("showPreview: Can't find post wrapper");
  }
}

function hidePreview(e) {
  //log("hidePreview: this=" + this.className);
  hidePostItemPreview($(this));
}

function hidePostItemPreview($item) {
  if (!$item || ! $item.hasClass("gpme-folded"))
    return;

  var $post = $item.find('.gpme-post-wrapper');
  if ($post.length) {
    $post.hide();
  } else {
    error("showPreview: Can't find post wrapper");
  }

  $lastPreviewedItem = null;
}

/****************************************************************************
 * Main
 ***************************************************************************/

$(document).ready(function() {
  trace("event: initial page load.");

  //Place your code here (you can also define new functions above this scope)

  //alert("Google+ Navigation (unpacked)");
  
  injectCSS();

  // Get options and then modify the page
  getOptionsFromBackground(function() {
    // Listen when the subtree is modified for new posts.
    // WARNING: DOMSubtreeModified is deprecated and degrades performance:
    //   https://developer.mozilla.org/en/Extensions/Performance_best_practices_in_extensions
    var $contentPane = $(_ID_CONTENT_PANE);
    if ($contentPane.length)
      $contentPane.bind('DOMSubtreeModified', onContainerModified);
    else 
      log("main: Can't find post container");

    // Listen when status change
    var $status = $(_ID_STATUS_FG);
    if ($status.length)
      $status.bind('DOMSubtreeModified', onStatusUpdated);
    else
      log("main: Can't find status node");

    // Listen to incoming messages from background page
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
      if (request.action == "gpmeTabUpdateComplete") {
        // Handle G+'s history state pushing when user clicks on different streams (and back)
        onTabUpdated();
      } else if (request.action == "gpmeModeOptionUpdated") {
        // Handle options changes
        onModeOptionUpdated(request.mode);
      } else if (request.action == "gpmeResetAll") {
        onResetAll();
      }
    });

    injectNewFeedbackLink();

    if (isEnabledOnThisPage())
      updateAllItems();
  });
});
