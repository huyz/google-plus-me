/*
# Filename:         gpme.js
#
# Platforms:        Google Chrome
# Depends:          
# Web:              http://huyz.us/google-plus-me/
# Source:           https://github.com/huyz/google-plus-me
# Author:           Huy Z  http://huyz.us/
# Updated on:       2011-07-25
# Created on:       2011-07-11
#
# Installation:
#   Like any other browser extension.
#
# Usage:
#   Click on the titlebar of each shared post.
#
# Thanks:
#   This extension takes some ideas from
#   https://github.com/mohamedmansour/google-plus-extension/
#   http://code.google.com/p/buzz-plus/
#   https://github.com/wittman/googleplusplus_hide_comments .

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

/****************************************************************************
 * Config
 ***************************************************************************/

// Set to true to enable compatibility with Start G+, a.k.a. SGPlus
var COMPAT_SGP = false;

/****************************************************************************
 * Constants
 ***************************************************************************/

//// For more class constants, see foldItem() in classes array

var _ID_GBAR                    = '#gb';
var _ID_STATUS_BG               = '#gbi1a';
var _ID_STATUS_FG               = '#gbi1';
var C_STATUS_BG_OFF             = 'gbid';
var C_STATUS_FG_OFF             = 'gbids';
var _C_HEADER                   = '.a-U-T';
var _ID_CONTENT                 = '#content';
// For stream, we  have to use #contentPane; we can't just use '.a-b-f-i-oa' cuz
// clicking link to the *current* page will refresh the contentPane
var _ID_CONTENT_PANE            = '#contentPane';
var _C_COPYRIGHT                = '.a-b-Xa-T';
var _FEEDBACK_LINK              = '.a-eo-eg';
var C_FEEDBACK                  = 'tk3N6e-e-vj';

// Pages and streams
var C_NOTIFICATIONS_MARKER      = 'MJI2hd';
var _C_NOTIFICATION_STREAM      = '.a-b-l-Kc-Ze';
var C_SPARKS_MARKER             = 'a-b-OL';
var C_SINGLE_POST_MARKER        = 'a-Wf-i-M';
var C_PROFILE_PANE              = 'a-p-M-T-hk-xc';
var C_STREAM                    = 'a-b-f-i-oa';
var _C_STREAM                   = '.a-b-f-i-oa';
var S_PROFILE_POSTS             = 'div[id$="-posts-page"]';
var _C_MORE_BUTTON              = '.a-b-f-zd-gb-h';

// Item
var C_SELECTED                  = 'a-f-oi-Ai';
var _C_SELECTED                 = '.a-f-oi-Ai';
var _C_ITEM                     = '.a-b-f-i';
var C_IS_MUTED                  = 'a-f-i-za'; // Candidates: a-f-i-za a-f-i-Fb-Un
var _C_CONTENT                  = '.a-b-f-i-p';
var _C_CONTENT_PLACEHOLDER      = '.a-b-f-i-Qi-Nd'; // For hangout and photo albums
var S_PHOTO                     = '.a-f-i-p-U > a.a-f-i-do';
// _C_TITLE:
// Watch out for these divs:
// - hangout 'Live' icon (.a-lx-i-ie-ms-Ha-q), which comes before post
// - "Shared by ..." in Incoming page ("a-f-i-Jf-Om a-b-f-i-Jf-Om")
// - Google Plus Reply+
//var _C_TITLE                    = '.a-f-i-p-U > div:not(.a-lx-i-ie-ms-Ha-q):not(.gpr_tools)'; // This will work with StartG+ as well
var _C_TITLE                    = '.gZgCtb';
//var _C_TITLE2                   = '.a-f-i-p-U > div:not(.a-lx-i-ie-ms-Ha-q):not(' + _C_CONTENT_PLACEHOLDER + ')';
var C_TITLE                     = 'gZgCtb';
var _C_PERMS                    = '.a-b-f-i-aGdrWb'; // Candidates: a-b-f-i-aGdrWb a-b-f-i-lj62Ve
var _C_MUTED                    = '.a-b-f-i-gg-eb';
var C_DATE                      = 'a-b-f-i-Ad-Ub';
var _C_DATE                     = '.a-b-f-i-Ad-Ub';
var _C_DATE_CSS                 = '.a-f-i-Ad-Ub';
var _C_EXPAND_POST              = '.a-b-f-i-p-gc-h';

// Comments
var _C_COMMENTS_ALL_CONTAINER   = '.a-b-f-i-Xb';
var C_COMMENTS_ALL_CONTAINER    = 'a-b-f-i-Xb';
var C_COMMENTS_OLD_CONTAINER    = 'a-b-f-i-cf-W-xb';
var _C_COMMENTS_OLD_CONTAINER   = '.a-b-f-i-cf-W-xb';
var _C_COMMENTS_OLD             = '.a-b-f-i-gc-cf-Xb-h';
var _C_COMMENTS_OLD_NAMES       = '.a-b-f-i-cf-W-xb .a-b-f-i-je-oa-Vb';
var C_COMMENTS_SHOWN_CONTAINER  = 'a-b-f-i-Xb-oa';
var _C_COMMENTS_SHOWN_CONTAINER = '.a-b-f-i-Xb-oa';
var _C_COMMENTS_SHOWN           = '.a-b-f-i-W-r';
var _C_COMMENTS_SHOWN_NAMES     = '.a-b-f-i-W-r a.a-f-i-W-Zb';
var C_COMMENTS_SHOWN_CONTENT    = 'a-f-i-ZP25p';
var C_COMMENTS_MORE_CONTAINER   = 'a-b-f-i-Sb-W-xb';
var _C_COMMENTS_MORE_CONTAINER  = '.a-b-f-i-Sb-W-xb';
var _C_COMMENTS_MORE            = '.a-b-f-i-gc-Sb-Xb-h';
var _C_COMMENTS_MORE_NAMES      = '.a-b-f-i-Sb-W-xb .a-b-f-i-je-oa-Vb';
//var _C_COMMENTS_CONTAINER     = '.a-b-f-i-Xb-oa';
var _C_COMMENT_EDITOR           = '.a-b-f-i-Pb-W-t';
var _C_SHARE_LINE               = '.a-f-i-bg';
var _C_EMBEDDED_VIDEO           = '.ea-S-Bb-jn > div';

// Menu
var _C_MENU_MUTE                = '.a-b-f-i-Fb-C';
var _C_MENU_UNMUTE              = '.a-b-f-i-kb-C'; // Displayed on user's posts page
var _C_LINK_UNMUTE              = '.a-b-f-i-kb-h';

var _C_COMMENT_CONTAINERS =
  [ _C_COMMENTS_OLD_CONTAINER, _C_COMMENTS_SHOWN_CONTAINER, _C_COMMENTS_MORE_CONTAINER ];

// XXX We assume there is no substring match problem because
// it doesn't look like any class names would be a superstring of these
var COMMENT_CONTAINER_REGEXP = new RegExp('\\b(?:' + C_COMMENTS_OLD_CONTAINER + '|' + C_COMMENTS_SHOWN_CONTAINER + '|' + C_COMMENTS_MORE_CONTAINER + '|' + C_COMMENTS_SHOWN_CONTENT + ')\\b');
var DISABLED_PAGES_URL_REGEXP = new RegExp(/\/(posts|notifications|sparks)\//);
var DISABLED_PAGES_CLASSES = [
  C_NOTIFICATIONS_MARKER,
  C_SPARKS_MARKER,
  C_SINGLE_POST_MARKER
];

// G+me
var C_GPME_COMMENTCOUNT_NOHILITE = 'gpme-comment-count-nohilite';

// Usability Boost
var _C_UBOOST_MUTELINK = '.mute_link';

// Circlestars
var _C_CIRCLESTARS = '.circlestars';

// Start G+, a.k.a. SGPlus
var ID_SGP_POST_PREFIX = 'sgp-post-';
var C_SGP_UPDATE = 'sgp_update';
var _C_SGP_TITLE = '.a-f-i-p-U > div'; // SGP doesn't have a 'gZgCtb' class as it should
var S_SGP_ORIGPOST_LINK = 'span[style^="font-size"]';
var _C_SGP_COMMENT = '.a-b-f-i-W-r';

// Google+ Tweaks
var _C_TWEAK_EZMNTN = '.bcGTweakEzMntn';

// Values shared with our CSS file
var GBAR_HEIGHT = 30;
var TRIANGLE_HEIGHT = 30;
var POST_WRAPPER_PADDING_TOP = 6;
var POST_WRAPPER_PADDING_BOTTOM = 6;
var HEADER_BAR_HEIGHT = 60; // This changes to 45 depending on Google+ Ultimate's options
var COLLAPSED_ITEM_HEIGHT = 32; // Not sure exactly how it ends up being that.
var MAX_DIST_FROM_COPYRIGHT_TO_BOTTOM_OF_VIEWPORT = 30; // about the same as height as feedback button
var GAP_ABOVE_ITEM_AT_TOP = 2;
var MUTED_ITEM_HEIGHT = 45;

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

/****************************************************************************
 * Init
 ***************************************************************************/

// list or expanded mode (like on GReader)
var displayMode;

// In list mode, an item that was opened but may need to be reclosed
// once the location.href is corrected
var $lastTentativeOpen = null;

// We track what's open so that we can close it
var $lastPreviewedItem = null;

// Timers to handle G+'s G+ dynamic comment list reconstruction
var lastCommentCountUpdateTimers = {};

// Shared DOM: the titlebar
var titlebarTpl = document.createElement('div');
titlebarTpl.setAttribute('class', 'gpme-titlebar');
titlebarTpl.innerHTML = '<div class="' + C_FEEDBACK + '"><div class="gpme-fold-icon gpme-fold-icon-unfolded-left">\u25bc</div><div class="gpme-fold-icon gpme-fold-icon-unfolded-right">\u25bc</div><span class="gpme-title"></span></div>';
var $titlebarTpl = $(titlebarTpl);
$titlebarTpl.click(onTitlebarClick);

var commentbarTpl = document.createElement('div');
commentbarTpl.setAttribute('class', 'gpme-commentbar');
commentbarTpl.innerHTML = '<div class="' + C_FEEDBACK + '"><div class="gpme-fold-icon gpme-comments-fold-icon-unfolded gpme-comments-fold-icon-unfolded-top">\u25bc</div><div class="gpme-fold-icon gpme-comments-fold-icon-unfolded-bottom">\u25bc</div><span class="gpme-comments-title"></span></div>';
var $commentbarTpl = $(commentbarTpl);
$commentbarTpl.click(onCommentbarClick);

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

var commentsWrapperTpl = document.createElement('div');
commentsWrapperTpl.className = 'gpme-comments-wrapper';
var $commentsWrapperTpl = $(commentsWrapperTpl);

/****************************************************************************
 * Utility
 ***************************************************************************/

/**
 * For debugging
 */
function trace(msg) {
  console.log(typeof msg == 'object' ? msg instanceof jQuery ? msg.get() : msg : 'g+me: ' + msg);
}
function debug(msg) {
  console.debug(typeof msg == 'object' ? msg instanceof jQuery ? msg.get() : msg : 'g+me.' + msg);
}
function warn(msg) {
  console.warn(typeof msg == 'object' ? msg instanceof jQuery ? msg.get() : msg : 'g+me.' + msg);
}
function error(msg) {
  console.error(typeof msg == 'object' ? msg instanceof jQuery ? msg.get() : msg : 'g+me.' + msg);
}

/**
 * Check if should enable on certain pages
 * @param $subtree: Optional, to force checking of DOM in cases when the
 *   href is not yet correct and the Ajax updates are pending
 */
function isEnabledOnThisPage($subtree) {
  if (typeof $subtree == 'undefined')
    return ! DISABLED_PAGES_URL_REGEXP.test(window.location.href);

  for (var c in DISABLED_PAGES_CLASSES) {
    if ($subtree.hasClass(DISABLED_PAGES_CLASSES[c]) || $subtree.find('.' + DISABLED_PAGES_CLASSES[c]).length) {
      debug("isEnabledOnThisPage: disabling because match on " + DISABLED_PAGES_CLASSES[c]);
      return false;
    }
  }
  return true;
}

/**
 * Shorten date text to give more room for snippet
 * FIXME: English-specific
 */
function abbreviateDate(text) {
  return text.replace(/\s*\(edited.*?\)/, '').replace(/Yesterday/g, 'Yest.');
}

/**
 * Iterates through all the comment containers and calls the callback
 */
function foreachCommentContainer($subtree, callback) {
  for (var container in _C_COMMENT_CONTAINERS) {
    var $container = $subtree.find(_C_COMMENT_CONTAINERS[container]);
    if ($container.length)
      callback($container);
  }
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

/**
 * Returns the height of any fixed bars at the top, if
 * applicable.
 * This is for compatibility with other extensions.
 */
function fixedBarsHeight() {
  return isGbarFixed() ? GBAR_HEIGHT + (isHeaderBarFixed() ? getHeaderBarHeight() : 0) : 0;
}

/**
 * Returns the header bar height, which changes according to Google+ Ultimate settings
 * (Compatc or Ultra Compact navigation)
 */
function getHeaderBarHeight() {
  var $header = $(_C_HEADER);
  return $header.length ? $header.height() : HEADER_BAR_HEIGHT;
}

/**
 * Returns true if Gbar is fixed in place
 */
function isGbarFixed() {
  // Detect fixed gbar for compatibility (with "Replies and more for Google+",
  // Usability Boost, and Google+ Ultimate)
  var $gbar = $(_ID_GBAR);
  return $gbar.length && $gbar.parent().css('position') == 'fixed';
}

/**
 * Returns true if header bar (the part below Gbar) is fixed in place
 */
function isHeaderBarFixed() {
  // Detect fixed gbar for compatibility (with "Google+ Ultimate")
  var $header = $(_C_HEADER);
  return $header.length && $header.css('position') == 'fixed';
}

/**
 * Returns the height of any bars at the top that would overlap
 * our popup preview, i.e. anythings that's outside the #content area,
 * which may overflow-hidden or have a high z-index
 */
function overlappingBarsHeight() {
  var result = GBAR_HEIGHT;

  // 2011-07-29 Usability Boost messes up the overflow of the content area
  // to fix something that it breaks.  So we have to adjust
  var $content = $(_ID_CONTENT);
  if ($content.length) {
    var styles = window.getComputedStyle($content.get(0));
    if (styles.overflowX == 'hidden')
      result += getHeaderBarHeight();
  }

  return result;
}

/****************************************************************************
 * Event Handlers
 ***************************************************************************/

/**
 * Responds to DOM updates from G+ to handle change in status of new notifications shown to the user
 */
function onStatusUpdated(e) {
  debug("onStatusUpdated");
  chrome.extension.sendRequest({action: 'gpmeStatusUpdate', count: parseInt(e.target.innerText, 10)});
}

/**
 * Responds to changes in the history state
 */
function onTabUpdated() {
  trace("event: Chrome says that tab was updated");

  // Restrict to non-single-post Google+ pages
  if (!isEnabledOnThisPage())
    return;

  // If list mode, make sure the correct last opened entry is unfolded, now
  // that we know that window.location.href is correct
  if (displayMode == 'list')
    unfoldLastOpenInListMode();
}

/**
 * Responds to a reconstruction of the content pane, e.g.
 * when the user clicks on the link that points to the same
 * page we're already on, or when switching from About to Posts
 * on a profile page.
 */
function onContentPaneUpdated(e) {
  // We're only interested in the insertion of entire content pane
  trace("event: DOMNodeInserted within onContentPaneUpdated");

  var $subtree = $(e.target);
  if (isEnabledOnThisPage($subtree))
    updateAllItems($subtree);

  // (Re-)create handler for insertions into the stream
  // No longer needed: we'll just handle it in the single DOMNodeInserted event handler
  //$stream = $(e.target).find(_C_STREAM).bind('DOMNodeInserted', onItemInserted);
}

/**
 * Responds to DOM updates from G+ to handle incoming items.
 * Calls updateItem()
 */
function onItemInserted(e) {
  if (! isEnabledOnThisPage())
    return;

  trace("event: DOMNodeInserted of item into stream");
  debug("onItemInserted: DOMNodeInserted for item id=" + e.target.id + " class='" + e.target.className);
  updateItem($(e.target));
}

/**
 * Responds to DOM updates from G+ to handle incoming menus
 */
function onItemMenuInserted(e) {
  if (! isEnabledOnThisPage())
    return;

  //trace("event: DOMNodeInserted of menu into post");
  // We want to make sure the menu is inserted in the right place,
  // not only so that the position is correct in the popup, but also
  // for Google+ Tweaks to insert its mute button in the right place
  $(e.target).prev('.gpme-post-wrapper').append($(e.target));
}

/**
 * Responds to DOM updates from G+ to handle changes to old comment counts
 */
function onCommentsUpdated(e, $item) {
  var id = e.target.id;
  var className = e.target.className;

  //trace("event: DOM insertion or deletion of comments");
  debug("onCommentsUpdated: DOM insertion/deletion of comments for item id=" + id + " class='" + e.target.className + "'");

  // We may be getting events just from a jquery find for comments,
  // before things are set up.
  if (! $item.hasClass('gpme-enh'))
    return;

  /*
  // If the user is editing, we should unfold comments
  if ($target.hasClass(C_COMMENTS_ALL_CONTAINER) && $target.find(_C_COMMENT_EDITOR).length && $item.hasClass('gpme-comments-folded')) {
    unfoldComments(true, $item);
  }
  */

  updateItemComments($item);
}

/**
 * Responds to click on post titlebar.
 * Calls toggleItemFolded()
 */
function onTitlebarClick() {
  var $item = $(this).parent();
  debug("onTitlebarClick: " + $item.attr('id'));

  toggleItemFolded($item, true);
}

/**
 * Responds to click on post titlebar.
 * Calls toggleItemFolded()
 */
function onCommentbarClick() {
  var $item = $(this).closest(_C_ITEM);
  debug("onCommentbarClick: " + $item.attr('id'));

  toggleCommentsFolded($item);
}

/**
 * Responds to all keypresses
 */
function onKeydown(e) {
  debug("onKeydown: which=" + e.which + " activeElement.id=" + document.activeElement.id);
  // We're not interested in these
  if (e.target.id && (e.target.id.charAt(0) == ':' || e.target.id == 'oz-search-box') ||
      e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA')
    return;

  /*
  // Start catching key sequences
  // 71 = 'g'
  if (e.which == 71) {
    setTimeout
  }
  */

  // First, try the activeElement instead of C_SELECTED because it's already set before the
  // scroll; but if that fails (e.g. when the user cancels the editing of a comment
  // or clicks on area outside of contentpane), then we go look at C_SELECTED
  var $selectedItem =
    document.activeElement !== null && document.activeElement.tagName !== 'BODY' &&
    document.activeElement.id !== null && document.activeElement.id.substring(0,7) == 'update-' ?
      $(document.activeElement) : $(_C_SELECTED);

  // Skip all these modifiers
  // XXX Is there a jQuery method for this?
  if ((e.which == 38 || e.which == 40 || e.which == 67 || e.which == 77) && (e.ctrlKey || e.altKey || e.metaKey) ||
      (e.which != 38 && e.which != 40 && e.which != 67 && e.which != 77) && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey))
    return;

  // If we still don't have a selected item, then e.g. the page must have just loaded,
  // so just pick the first item.
  if (! $selectedItem.length) {
    $selectedItem = $(_C_ITEM).filter(':first');
    if ($selectedItem.length) {
      switch (e.which) {
        case 80: // 'p'
        case 78: // 'n'
          click($selectedItem);
          break;
        case 38: // shift-up
        case 40: // shift-down
          if (e.shiftKey)
            navigateUnfolding($selectedItem);
          break;
        default: break;
      }
    }
    return;
  }

  var $sibling, $moreButton;
  switch (e.which) {
    case 13: // <enter>
      // If user hits <enter>, we'll open so that they can type a comment
      if (! isItemMuted($selectedItem) && isItemFolded($selectedItem))
        toggleItemFolded($selectedItem);
      break;
    case 77: // 'm' and 'M'
      toggleItemMuted($selectedItem, e.shiftKey);
      break;
    case 67: // 'c' and 'C'
      if (! isItemFolded($selectedItem)) {
        // For 'C' we want to unfold comments > get more comments > get older comments
        if (e.shiftKey) {
          if (areItemCommentsFolded($selectedItem)) {
            toggleCommentsFolded($selectedItem);
          } else {
            clickMoreCommentsButton($selectedItem);
          }
        } else {
          // For 'c' we want to unfold or fold comments 
          toggleCommentsFolded($selectedItem);
        }
      }
      break;
    case 79: // 'o'
      if (! isItemMuted($selectedItem)) {
        toggleItemFolded($selectedItem);
        if (! isItemFolded($selectedItem))
          scrollToTop($selectedItem);
          // NOTE: if folded, we don't want to scroll to top.
          // and toggleItemFolded already scrolls into view.
      }
      break;
    case 88: // 'x'
      if (! isItemMuted($selectedItem) && ! isItemFolded($selectedItem)) {
        togglePostExpansion($selectedItem);
      }
      break;
    case 80: // 'p'
      hideAnyPostItemPreview();
      $sibling = getPrevItem($selectedItem);
      if ($sibling.length) {
        click($sibling);
        // NOTE: G+ already scrolls everything for us
      }
      break;
    case 78: // 'n'
      hideAnyPostItemPreview();
      $sibling = getNextItem($selectedItem);
      if ($sibling.length) {
        click($sibling);
        // NOTE: G+ already scrolls everything for us
      } else {
        // If we're at the bottom, trigger the more button
        clickMoreButton();
      }
      break;
    case 38: // shift-up
      if (e.shiftKey) {
        $sibling = getPrevItem($selectedItem);
        if ($sibling.length)
          navigateUnfolding($sibling, $selectedItem);
      }
      break;
    case 40: // shift-down
      if (e.shiftKey) {
        $sibling = getNextItem($selectedItem);
        if ($sibling.length) {
          navigateUnfolding($sibling, $selectedItem);
        } else {
          // If we're at the bottom, trigger the more button
          clickMoreButton();
        }
      }
      break;
    case 75: // 'k'
      /*
      hideAnyPostItemPreview();
      setTimeout(function() {
        if (isItemFolded($selectedItem))
          toggleItemFolded($selectedItem);
      }, 200);
      */
      /*
      // Delay a little bit to give priority to G+'s handling of 'k'
      setTimeout(function() {
        $sibling = $selectedItem.prev();
        // We duplicate the handling by default G+ because sometimes G+
        // gets confused about which post it's on -- maybe it doesn't
        // expect such short posts?
        click($sibling);
        if ($sibling.length && $sibling.hasClass('gpme-folded'))
          toggleItemFolded($sibling);
      }, 200);
      */
      break;
    case 74: // 'j'
      /*
      hideAnyPostItemPreview();
      // Delay a little bit to give priority to G+'s handling of 'j'
      setTimeout(function() {
        if (isItemFolded($selectedItem))
          toggleItemFolded($selectedItem);
      }, 200);
      */
      /*
      setTimeout(function() {
        $sibling = $selectedItem.next();
        // We duplicate the handling by default G+ because sometimes G+
        // gets confused about which post it's on -- maybe it doesn't
        // expect such short posts?
        click($sibling);
        if ($sibling.length && $sibling.hasClass('gpme-folded'))
          toggleItemFolded( $sibling);
      }, 200);
      */
      break;
    default: break;
  }
}

/**
  * Navigates to and unfolds the specified item
  * @param scrollPreviousItem: Optional, makes previous item top item
  */
function navigateUnfolding($item, $previousItem, scrollPreviousItem) {
  hideAnyPostItemPreview();

  // In expanded mode, we want these shortcuts fold the previous item, unlike with the mouse.
  if (typeof $previousItem != 'undefined' && $previousItem !== null &&
      $previousItem.length && displayMode == 'expanded' && ! isItemMuted($previousItem))
    foldItem(true, $previousItem);

  click($item);
  toggleItemFoldedVariant('list-like-unfold', $item);
  scrollToTop(scrollPreviousItem ? $previousItem : $item);
}

/**
 * Responds to our keypresses, while handling cases when scrolling is in motion
 * Calls toggleItemFolded() and unfoldItem()
 */
/*
function onSmartKeydown(e, attempt) {
  var $selectedItem = $(_C_SELECTED);
  if (! $selectedIt && ! noscrollem.length)
    return;

  var tryAgain = false;

  // The active element may be the previous post while scrolling is in motion (i.e. hit 'j' and 'o' quickly)
  // or it may be in some input field.
  if (document.activeElement !== null && document.activeElement.tagName != 'BODY' &&
      document.activeElement !== $selectedItem.get(0)) {
    debug("onKeydown: activeElement is different: tagname=" + document.activeElement.tagName + " id=" + document.activeElement.id);
    tryAgain = true;
  }

  var $sibling;
  if (! tryAgain) {
    switch (e.which) {
      case 74: // 'j'
        $sibling = $selectedItem.next();
        if ($sibling.length) {
          // We duplicate the handling by default G+ because sometimes G+
          // gets confused about which post it's on -- maybe it doesn't
          // expect such short posts?
          click($sibling);
        }
        if ($sibling.hasClass('gpme-folded'))
          toggleItemFolded($sibling);
        break;
      case 75: // 'k'
        $sibling = $selectedItem.prev();
        if ($sibling.length) {
          // We duplicate the handling by default G+ because sometimes G+
          // gets confused about which post it's on -- maybe it doesn't
          // expect such short posts?
          click($sibling);
        }
        if ($sibling.hasClass('gpme-folded'))
          toggleItemFolded($sibling);
        break;
      default: break;
    }
  }

  // Try again in a little bit
  if (tryAgain && attempt < 20)
    setTimeout(function() { onSmartKeydown(e, attempt + 1); }, 50);
}
*/

/** * Simulate clicks on the page.
 */
/* Deprecated
function click($elem) {
  // We have to inject script because the content script doesn't have
  // direct access to the page's event handlers.
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'gpme-dispatch-event';
  script.innerText = ' \
    var evt = document.createEvent("MouseEvents"); \
    evt.initMouseEvent("click", true, true, window, \
                      0, 0, 0, 0, 0, false, false, false, false, 0, null); \
    document.getElementById("' + $elem.attr('id') + '").dispatchEvent(evt); \
    var gpmeNode = document.getElementById("gpme-dispatch-event"); \
    gpmeNode.parentNode.removeChild(gpmeNode);';
  document.getElementsByTagName('body')[0].appendChild(script);
}
*/

/**
 * Responds to changes in mode option
 */
function onModeOptionUpdated(newMode) {
  debug("onModeOptionUpdated: new mode=" + newMode);

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
  debug("onResetAll");

  var oldMode = displayMode;
  for (var i in localStorage) {
    if (i.substring(0,5) == 'gpme_')
      localStorage.removeItem(i);
  }

  getOptionsFromBackground(function() {
    // If mode has changed
    debug("onResetAll: oldMode=" + oldMode + " newMode=" + displayMode);
    if (typeof(oldMode) == 'undefined' || displayMode != oldMode)
      refreshAllFolds();
  });
}

/****************************************************************************
 * DOM enhancements & post folding according to state
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

  // Apparently, the background-position is incorrect for a user.
  // Maybe the notification status displays something differently for him
  // early in the loading of the page.
  // Let's hardcode the coords, only in this situation.
  /* Damn, Guy Kawasaki needs to have it really hardcoded.
  function hardcodeCoords($node) {
    return window.getComputedStyle($node.get(0)).cssText.
      replace(/(background-position:)\s+-?0\s*(?:px)?\s+-394\s*px/, '$1 0 -274px').
      replace(/(background-position:)\s+-37\s*px\s+-394\s*px/, '$1 -26px -274px');
  }
  */
  function hardcodeCoordsHilite($node) {
    return window.getComputedStyle($node.get(0)).cssText.
      replace(/(background-position:)[^;]*/, '$1 0 -274px');
  }
  function hardcodeCoordsNohilite($node) {
    return window.getComputedStyle($node.get(0)).cssText.
      replace(/(background-position:)[^;]*/, '$1 -26px -274px');
  }

  // Copy G+ notification status bg style because original is by ID.
  // We use a convoluted manner of copying styles in case G+ changes
  // the CSS image sprite.
  // XXX There must be an easier way than to getComputedStyle()
  var styleNode = document.createElement('style');
  styleNode.setAttribute('type', 'text/css');
  var statusNode, statusOff, cssText;
  $statusNode = $(_ID_STATUS_BG);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbid' (turns bg to
    // gray), which seems to be there by default.
    statusOff = $statusNode.hasClass(C_STATUS_BG_OFF);
    if (statusOff)
      $statusNode.removeClass(C_STATUS_BG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-bg { ' +
      hardcodeCoordsHilite($statusNode) + ' } '));
    $statusNode.addClass(C_STATUS_BG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-bg.' + C_GPME_COMMENTCOUNT_NOHILITE + ' { ' +
      hardcodeCoordsNohilite($statusNode) + ' } '));
    if (! statusOff)
      $statusNode.removeClass(C_STATUS_BG_OFF);
  }

  // Copy G+ notification status fg style because original is by ID
  $statusNode = $(_ID_STATUS_FG);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbids' (turns bg to
    // gray), which seems to be there by default.
    statusOff = $statusNode.hasClass(C_STATUS_FG_OFF);
    if (statusOff)
      $statusNode.removeClass(C_STATUS_FG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-fg { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    $statusNode.addClass(C_STATUS_FG_OFF);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-fg.' + C_GPME_COMMENTCOUNT_NOHILITE + ' { ' +
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

/****************************************************************************
 * Post DOM enhancements
 ***************************************************************************/

/**
 * Refresh fold/unfolded display of items.
 * Called by onModeOptionUpdated() and onResetAll()
 */
function refreshAllFolds() {
  // Force refresh of folding
  updateAllItems();

  // If going to expanded mode, we want to unfold the last item opened in list mode
  if (displayMode == 'expanded') {
    var id = localStorage.getItem("gpme_post_last_open_" + window.location.href);
    if (id !== null) {
      var $item = $('#' + id);
      //debug("onModeOptionUpdated: last open id=" + id + " $item.length=" + $item.length);
      if ($item.length == 1) {
        unfoldItem(false, $item);
        click($item);
      }
    }
  }
}

/**
 * Update all the items in the current page.
 * Is called by main() and onModeOptionUpdated()
 */
function updateAllItems($subtree) {
  //debug("updateAllItems");
  
  // Default to updating all divs in contentpane,
  // but sometimes we know which one was just inserted by
  // an Ajax refresh
  if (typeof $subtree == 'undefined')
    $subtree = $(_C_STREAM);
  
  // Update all items
  $subtree.find(_C_ITEM).each(function(i, item) {
    debug("updateAllItems #" + i);
    i++;
    updateItem($(item));
  });

  // If list mode, make sure the correct last opened entry is unfolded, but
  // only when we know that window.location.href is correct
  if (typeof $subtree == 'undefined' && displayMode == 'list')
    unfoldLastOpenInListMode();
}

/**
 * Updates fold/unfold appropriately
 */
function updateItem($item, attempt) {
  var id = $item.attr('id');
  debug("updateItem: " + id);

  var enhanceItem = ! $item.hasClass('gpme-enh');

  if (enhanceItem) {
    // Add titlebar
    // For Tweak, we also need the menu in there
    //var $itemContent = $item.find(_C_CONTENT);
    var $itemContent = $item.children('div:not(' + _C_CONTENT_PLACEHOLDER + ')');
    if (! $itemContent.length) {
      // The content comes a bit later
      if ($item.find(_C_CONTENT_PLACEHOLDER).length) {
        if (typeof attempt === 'undefined')
          attempt = 0;
        if (attempt < 29) {
          setTimeout(function() { updateItem($item, attempt + 1); }, 100 );
        } else {
          error("updateItem: Can't get any content within 3 seconds. Giving up");
        }
      } else {
        error("updateItem: Can't find content of item " + id + " hits=" + $itemContent.length);
        console.error($item.get(0));
      }
      return;
    }
    // NOTE: we have to change the class before inserting or we'll get more
    // events and infinite recursion if we listen to DOMSubtreeModified.
    //debug("updateItem: enhancing");
    $item.addClass('gpme-enh');

    // Add hover event handler
    $item.hoverIntent(hoverIntentConfig);
    //$item.hover(showPreview, hidePreview);

    var $titlebar = $titlebarTpl.clone(true);
    $titlebar.insertBefore($itemContent.first());

    // Insert container for post content so that we can turn it into an instant
    // preview
    var $wrapper = $postWrapperTpl.clone().insertAfter($titlebar);
    $wrapper.append($itemContent);

    // If this is SGPlus post
    var isSgpPost = false;
    if (COMPAT_SGP)
      isSgpPost = $item.hasClass(C_SGP_UPDATE);

    var $commentbar;
    if (! isSgpPost) {
      // Structure commentbar:
      // "a-b-f-i-Xb"
      //   "gpme-commentbar"
      var $allCommentContainer = $item.find(_C_COMMENTS_ALL_CONTAINER);
      // It's possible not to have comments at all on posts with comments
      // disabled or on photo-tagging posts
      if ($allCommentContainer.length) {
        $commentbar = $commentbarTpl.clone(true);
        $allCommentContainer.prepend($commentbar);

        // Insert wrapper for comments container so that we can hide it without
        // triggering DOMSubtreeModified events on the container
        $wrapper = $commentsWrapperTpl.clone().insertAfter($commentbar);
        foreachCommentContainer($allCommentContainer, function($container) {
          $wrapper.append($container);
        });
      }

    } else { // If SGP post, as of SGP 1.4.0
      // We have to move the comments into the container

      var $comments = $item.find(_C_SGP_COMMENT);
      if ($comments.length) {
        $commentbar = $commentbarTpl.clone(true);
        $commentbar.insertBefore($comments.first());
        $wrapper = $commentsWrapperTpl.clone().insertAfter($commentbar).append($comments);
      }
    }
  }

  // Refresh fold of post
  var itemFolded = false;
  if (displayMode == 'list') {
    // Check if it's supposed to be unfolded
    // NOTE: the href may be incorrect at this point if the user is clicking on a new
    // stream link and the updates are coming in through AJAX *before* a tabUpdated event
    var lastOpenId = localStorage.getItem("gpme_post_last_open_" + window.location.href);

    if (lastOpenId !== null && id == lastOpenId) {
      unfoldItem(false, $item);

      // Record this operation because we may have to undo it once location.href is
      // known to be correct
      $lastTentativeOpen = $item;
    } else {
      foldItem(false, $item);
      itemFolded = true;
    }
  } else if (displayMode == 'expanded') {
    itemFolded = localStorage.getItem("gpme_post_folded_" + id);
    // Fold if necessary
    if (itemFolded !== null) {
      foldItem(false, $item);
    } else {
      unfoldItem(false, $item);
    }
  }

  // Refresh fold of comments if visible
  if (! itemFolded) {
    if (localStorage.getItem("gpme_comments_folded_" + id))
      foldComments(false, $item);
    else
      unfoldComments(false, $item);
  }

  // Start listening to updates to comments.
  // We need to listen all the time since comments can come in or out.
  if (enhanceItem) {
    // We must have one throttle function per comment section within item.
    var commentsUpdateHandler = $.throttle(200, 50, function(e) { onCommentsUpdated(e, $item); });

    //var commentsUpdateHandler = function(e) { onCommentsUpdated(e, $item) };
    foreachCommentContainer($item.find('.gpme-comments-wrapper'), function($container) {
      $container.bind('DOMSubtreeModified', function(e) {
        // We have to filter out junk before we call the throttle function; otherwise
        // the last callback call will have junk arguments.
        var id = e.target.id;
        // Some optimizations, especially to prevent lag when typing comments.
        if (id && id.charAt(0) == ':' || ! isEnabledOnThisPage())
          return;

        var className = e.target.className;
        // If the target has id, then it's probably a comment
        if (! id && ! COMMENT_CONTAINER_REGEXP.test(className))
          return;

        // Finally call our throttled callback
        commentsUpdateHandler(e);
      });
    });
  }
}

/**
 * Updates the display of comments
 */
function updateItemComments($item) {
  if ($item.hasClass('gpme-comments-folded')) {
    foldComments(false, $item);
  } else {
    unfoldComments(false, $item);
  }
}

/****************************************************************************
 * Post Folding/unfolding logic
 ***************************************************************************/

/**
 * Returns true if specified item is folded
 */
function isItemFolded($item) {
  return $item.hasClass('gpme-folded');
}

/**
 * Toggle folding state of the content of an item.
 * This is only called as a result of a user action.
 * Calls setOrToggleItemFolded()
 */
function toggleItemFolded($item, animated) {
  toggleItemFoldedVariant('toggle', $item, animated);
}

/**
 * Either toggles the folding state of an item or sets to unfolded,
 * while making sure in list mode that any previously-unfolded item
 * is folded.
 * This function handles different seemingly-conflicting modes because
 * it handles complex scrolling animation that needs to be in one place.
 * Is called by toggleItemFolded() and navigateUnfolding().
 * Calls foldItem() or unfoldItem().
 * @param action: toggle, unfold, list-like-unfold.
 *   'toggle': what happens when the user hits a title bar, adapting to both the mode
 *             and to the current folding state of the item
 *   'unfold': forces an unfold on the item
 *   'list-like-unfold': forces an unfold on the item as if the mode were 'list'
 * @param animatedScroll: Optional
 */
function toggleItemFoldedVariant(action, $item, animated) {
  var $post = $item.find('.gpme-post-wrapper');
  //debug("toggleItemFolded: length=" + $posts.length);
  if ($post.length != 1) {
    error("toggleItemFolded: can't find post");
    return;
  }

  var id = $item.attr('id');

  var lastItemOffset = -1;
  var lastItemHeightLoss = 0;
  var predictedItemHeight = -1;

  var $body = $('body');

  // If the item is folded, we unfold it (and possibly fold back the previous unfolded
  // item in list mode)
  if (action == 'unfold' || action == 'list-like-unfold' || isItemFolded($item)) {
    // If in list mode, we need to fold the previous one
    if (displayMode == 'list' || action == 'list-like-unfold') {
      lastOpenId = localStorage.getItem('gpme_post_last_open_' + window.location.href);
      //debug("unfoldItem: last open id=" + lastOpenId);
      if (lastOpenId !== null && lastOpenId != id) {
        //debug("unfoldItem: href=" + window.location.href + " id =" + id + " lastOpenId=" + lastOpenId);
        var $lastItem = $('#' + lastOpenId);
        if ($lastItem.length && $lastItem.hasClass('gpme-enh') && ! isItemMuted($lastItem)) {
          // Prepare for scrolling animation
          if (animated) {
            // If we're animating, we have to do our own calculations because
            // two opposing animations are going simultaneously, which is too
            // complex for regular animations to calculate.
            lastItemHeightLoss = $lastItem.outerHeight() - COLLAPSED_ITEM_HEIGHT;
            lastItemOffset = $lastItem.offset().top;
          }

          // Fold the last opened item
          foldItem(true, $lastItem, animated);
        }
      }
    }

    // Predict the height of the item
    if (animated) {
      // Temporarily unfold the item in order to calculate its height
      $item.removeClass('gpme-folded');
      $item.addClass('gpme-unfolded');
      $post.show();
      predictedItemHeight = $item.outerHeight();
      $item.removeClass('gpme-unfolded');
      $item.addClass('gpme-folded');
      $post.hide();
    }

    if (isItemMuted($item)) {
      localStorage.removeItem('gpme_post_last_open_' + window.location.href);
    } else {
      // Unfold the selected item
      unfoldItem(true, $item, animated, $post);
      // Since this thread is a result of an interactive toggle, we record last open
      debug("toggleItemFolded: href=" + window.location.href);
      debug("toggleItemFolded: gpme_post_last_open_" + window.location.href + "->id = " + id);
      localStorage.setItem("gpme_post_last_open_" + window.location.href, id);
    }

  } else { // For 'toggle' action, if the item is unfolded, we fold it.

    if (isItemMuted($item)) {
      if (animated)
        predictedItemHeight = $item.height();
    } else {
      // Predict the height of the item
      if (animated)
        predictedItemHeight = COLLAPSED_ITEM_HEIGHT;

      // Fold the selected item
      foldItem(true, $item, animated, $post);

      // Since this thread is a result of an interactive toggle, we delete last open
      if (localStorage.getItem("gpme_post_last_open_" + window.location.href) == id)
        localStorage.removeItem("gpme_post_last_open_" + window.location.href);
    }
  }

  // Scrolling animation.
  // XXX As of 4.0.5, there are still some bugs in scrolling animation,
  // e.g. G+ seems to add whitespace under the More button;
  // but the current result is good enough -- users shouldn't // notice.
  // These are the cases when we'd need to scroll:
  // - In expanded and list mode, an item is folded which shortens the document
  // and pulls the document bottom above the bottom of the screen; we want
  // to avoid the jarring scroll back down that would ensue.
  // - In list mode, the last open item is above the selected item and it is closed
  // which causes the top of the selected item to go out of view above; we
  // want to counteract the upward motion of the selected item as the
  // two items are changing size.
  // - Combination of the two above cases.
  if (animated) {
    // Calc the new item offset once the last item is folded (without yet
    // taking account the bottom of the document)
    predictedItemOffset = $item.offset().top;
    // If we folded an item above the selected item, then we need to shift
    // the predicted offset
    if (lastItemOffset != -1 && lastItemOffset < predictedItemOffset)
      predictedItemOffset -= lastItemHeightLoss;

    // Calc the body height once the last item is folded and the selected
    // item is unfolded
    predictedBodyHeight = $body.height() - lastItemHeightLoss + (predictedItemHeight - COLLAPSED_ITEM_HEIGHT);

    // There are two forces that make the page scroll up:
    // 1) getting the top of the selected item within view
    // 2) the bottom of the document must be no higher than the bottom of hte viewport.
    // So we calculate the minimum of this to figure out the scrolling distance.
    var currentScrollTop = $body.scrollTop();
    var scrollDist = Math.max(0,
      Math.max(currentScrollTop - (predictedItemOffset - fixedBarsHeight() - GAP_ABOVE_ITEM_AT_TOP),
               window.innerHeight - 30 - (predictedBodyHeight - currentScrollTop)));
    /*
    debug("foldItem: currentScrollTop=" + currentScrollTop);
    debug("foldItem: predictedItemOffset=" + predictedItemOffset);
    debug("foldItem: window.height=" + window.innerHeight);
    debug("foldItem: predictedItemHeight=" + predictedItemHeight);
    debug("foldItem: predictedBodyHeight=" + predictedBodyHeight);
    debug("foldItem: scrollDist=" + scrollDist);
    */
    // Only scroll if necessary
    if (scrollDist > 0) {
      // XXX G+ seems to have an autoscroll that's acting faster than mine
      // and is shifting the page faster
      $body.animate({scrollTop: $body.scrollTop() - scrollDist }, 'fast');
    }
  } else {
    $item.find('.gpme-titlebar').scrollintoview({duration: 0, direction: 'y'});
  }
}

/**
 * Fold item, and give titlebar summary content if necessary
 * @param animated: Optional
 * @param $post: Optional if you have it
 */
function foldItem(interactive, $item, animated, $post) {
  if (typeof($post) == 'undefined') {
    $post = $item.find('.gpme-post-wrapper');
    if ($post.length != 1) {
      error("foldItem: Can't find post content node");
      error($item);
      return;
    }
  }

  var id = $item.attr('id');

  // Persist for expanded mode
  debug("foldItem: id=" + id);
  if (interactive && displayMode == 'expanded')
    localStorage.setItem("gpme_post_folded_" + id, true);

  // Visual changes
  // Can't fold muted items
  /*
  if (isItemMuted($item))
    return;
  */

  //$post.fadeOut().hide(); // This causes race-condition when double-toggling quickly.
  if (animated)
    $post.slideUp('fast', function() {
      $item.addClass('gpme-folded');
      $item.removeClass('gpme-unfolded');
    });
  else {
    $post.hide();
    $item.addClass('gpme-folded');
    $item.removeClass('gpme-unfolded');
  }
  //debug("foldItem: id=" + id + " folded=" + $item.hasClass('gpme-folded') + " post.class=" + $post.attr('class') + " should be folded!");

  // If interactive folding and comments are showing, record the comment count
  var commentCount = countComments($item.find('.gpme-comments-wrapper'));
  if (interactive && ! areItemCommentsFolded($item))
    saveSeenCommentCount(id, commentCount);

  // Attached or pending title
  var $subtree;

  // If this is SGPlus post
  var isSgpPost = false;
  if (COMPAT_SGP)
    isSgpPost = $item.hasClass(C_SGP_UPDATE);

  // If not yet done, put content in titlebar
  var $title = $subtree = $item.find('.gpme-title');
  if (! $title.hasClass('gpme-has-content')) {
    $title.addClass('gpme-has-content');

    var $srcTitle;

    $srcTitle = $item.find(_C_CONTENT + " " + (isSgpPost ? _C_SGP_TITLE : _C_TITLE));
    if ($srcTitle.length !== 1) {
      error("foldItem: can't find (unique) post content title node");
      error($item);
    } else {
      var $clonedTitle = $subtree = $srcTitle.clone();

      // 2011-07-30 Google Ultimate+ changes the overflow for .gZgCtb to visible.
      // Let's just remove that class, since we've already copied its styles to
      // ".gpme-title > div" for Start G+
      $clonedTitle.removeClass(C_TITLE);

      var $srcPhoto = $item.find(S_PHOTO);
      if ($srcPhoto.length) {
        $clonedTitle.prepend($srcPhoto.clone());
      }

      // Insert fold icon
      $clonedTitle.prepend('<span class="gpme-fold-icon">\u25b6</span>');

      // Take out permissions
      var $perms = $clonedTitle.find(_C_PERMS);
      if ($perms.length) {
        $perms.remove();
      } else if (! isSgpPost) {
        error("foldItem: can't find permissions div");
        error($clonedTitle);
      }

      // Take out Google+ Tweak's Easy mention feature
      // Doesn't work, it looks for: #contentPane  div[id^="update"] a[oid] which includes mine
      //$clonedTitle.find(_C_TWEAK_EZMNTN).remove();

      // Take out Usability Boost's "- Mute"
      var $muteLink = $clonedTitle.find(_C_UBOOST_MUTELINK);
      if ($muteLink.length) {
        var $muteDash = $muteLink.prev();
        if ($muteDash.length && $muteDash.text() == '-')
          $muteDash.remove();
        $muteLink.remove();
      }

      // Take out CircleStars
      var $stars = $clonedTitle.find(_C_CIRCLESTARS);
      if ($stars.length) {
        var $starsDash = $stars.prev();
        if ($starsDash.length && $starsDash.text() == ' - ')
          $starsDash.remove();
        $stars.remove();
      }

      // Take out Start G+'s original post link
      if (isSgpPost) {
        //console.debug("foldItem: SG+", $clonedTitle.find('span[style^="font-size"]'));
        $clonedTitle.find(S_SGP_ORIGPOST_LINK ).remove();
      }

      // Put in snippet, trying differing things
      var classes = [
        '.a-b-f-i-u-ki', // poster text
        '.a-b-f-i-p-R', // original poster text (and for one's own post, just "Edit")
        '.a-b-f-S-oa', // poster link (must come after .a-b-f-i-p-R, which sometimes it's just "Edit")
        '.a-f-i-ie-R', // hangout text
        '.ea-S-pa-qa', // photo caption
        '.a-f-i-p-qb .a-b-h-Jb', // photo album
        '.w0wKhb', // "A was tagged in B", or "4 people commented on this photo", or Start G+'s tweets
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
        '<span class="gpme-comment-count-bg ' + C_GPME_COMMENTCOUNT_NOHILITE + '"></span>' +
        '<span class="gpme-comment-count-fg ' + C_GPME_COMMENTCOUNT_NOHILITE + '"></span></div>');

      // For Start G+ post, we're done
      if (isSgpPost) {
          // Inject the summary title
          $title.append($clonedTitle);

      } else { // Regular G+ posts

        // Take out date marker so that G+ doesn't update the wrong copy
        var $clonedDate = $clonedTitle.find(_C_DATE);
        if (! $clonedDate.length) {
          error("foldItem: Can't find date marker");
          error($clonedTitle);
        } else {
          $clonedDate.removeClass(C_DATE);

          // If any, move "- Muted" to right after date and before the " - "
          $clonedTitle.find(_C_MUTED).insertAfter($clonedDate);

          // Inject the summary title
          $title.append($clonedTitle);

          // Stop propagation of click from the name
          // NOTE: done here coz it can't be done on a detached node.
          $clonedTitle.find('a').click(function(e) {
            e.stopPropagation();
          });

          // For first page display, the date is there, but for updates, the date isn't there yet.
          // So check, and try again later in case of updates.
          var attempt = 40;
          (function insertTitleWhenDateUpdated($date) {
            attempt--;
            if ($date.length && $date.text() != '#' || attempt < 0) {
              var dateText = '';
              if (attempt < 0) {
                error("insertTitleWhenDateUpdated: gave up on getting the date for id=" + id);
              } else {
                dateText = abbreviateDate($date.text());
              }
              // Strip out the A link because we don't want to make it clickable
              // Not only does clicking it somehow opens a new window, but we need
              // the clicking space especially with instant previews
              $clonedDate.text(dateText);

            } else {
              var $srcDateA = $item.find(_C_DATE + ' a');

              if ($srcDateA.length) {
                // Try again later in a little bit
                setTimeout(function() { insertTitleWhenDateUpdated($srcDateA); }, 50);
              } else {
                error("insertTitleWhenDateUpdated: can't find the source date div");
                error($srcDateA);
              }
            }
          })($clonedDate.find('a'));
        }
      }
    }
  }

  /* Gonna be harder than this :)
  // If interactive, then we want to stop any playing youtube video
  // by undoing what clicking play does
  var $embed = $post.find(_C_EMBEDDED_VIDEO + '> iframe');
  if ($embed.length) {
    var $embedParent = $embed.parent();
    $embedParent.find('img').show();
    $embedParent.find('div').show();
    $embedParent.attr({ 'aria-pressed': '', 'aria-selected': '', 'aria-expanded': '' }).
      removeClass('ea-S-Pa ea-S-Ya'); // Classes not important -- probably on affects iframe
    $embed.remove();
  }
  */

  // Show possibly-hidden comments so that they appear in the preview (but don't persist)
  var $comments = $item.find('.gpme-comments-wrapper');
  if ($comments.length) {
    $comments.show();
  }

  // Updated the count in the subtree
  updateCommentCount(id, $subtree, commentCount);
}

/**
 * For both list and expanded mode, unfolds the item.
 * @param animated: Optional
 * @param $post: Optional if you have it
 */
function unfoldItem(interactive, $item, animated, $post) {
  if (typeof($post) == 'undefined') {
    $post = $item.find('.gpme-post-wrapper');
    if ($post.length != 1) {
      // It is possible to not have a proper match during keyboard scrolling
      // (hit 'j' and 'o' in quick succession)
      //debug("unfoldItem: $posts.length=" + $posts.length);
      return false;
    }
  }

  var id = $item.attr('id');
  debug("unfoldItem: id=" + id);

  // Persist for expanded mode
  if (interactive && displayMode == 'expanded')
    localStorage.removeItem("gpme_post_folded_" + id);

  // Visual changes
  hidePostItemPreview($item);
  if (animated) {
    // NOTE: changing of classes must be done after hidePostItemPreview()
    $item.removeClass('gpme-folded');
    $item.addClass('gpme-unfolded');
    $post.slideDown('fast');
  } else {
    $item.removeClass('gpme-folded');
    $item.addClass('gpme-unfolded');
    $post.show();
  }

  // Refresh fold of comments
  // NOTE: this must be done after the CSS classes are updated
  if (localStorage.getItem("gpme_comments_folded_" + id))
    foldComments(false, $item);
  else
    unfoldComments(false, $item);

  if (interactive && ! areItemCommentsFolded($item))
    deleteSeenCommentCount(id);

  return true;
}

/**
 * In list mode, unfold the last opened entry, refolding any wrongly unfolded entry
 * NOTE: At this point, location.href may or may not be correct.
 */
function unfoldLastOpenInListMode() {
  //debug("unfoldLastOpenInListMode: href=" + window.location.href);
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
    //debug("unfoldLastOpenInListMode: unfolding " + $lastTentativeOpen.attr('id'));
    foldItem(false, $lastTentativeOpen);
    $lastTentativeOpen = null;
  }

  if (lastOpenId !== null) {
    var $item = $('#' + lastOpenId);
    // We explicitly unfold in order to fold any previously opened item
    // FIXME: this favors the oldest instead of the most recent opened item
    unfoldItem(false, $item);
    click($item);
  }
}

/****************************************************************************
 * Misc. operations on posts
 ***************************************************************************/

/**
 * Returns the previous item
 */
function getPrevItem($item) {
  return $item.prevAll('[id^="update-"]').first(); // We want to skip over Start G+'s items
}
/**
 * Returns the next item
 */
function getNextItem($item) {
  return $item.nextAll('[id^="update-"]').first(); // We want to skip over Start G+'s items
}

/**
 * Click the specified element
 * Better to simulate clicks than keyboard right now because 'j' and 'k'
 * are messed up.
 * Note: clicking an item doesn't act like a real user click on G+:
 *   in this case, G+ actually scrolls the item without animation.
 *   And since we have to correct that scrolling, we can't animate
 *   either or it would sometimes look reversed.
 */
function click($element) {
  var e, elem = $element.get(0);
  e = document.createEvent("MouseEvents");
  e.initEvent("mousedown", true, true);
  elem.dispatchEvent(e);
  e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  elem.dispatchEvent(e);
  e = document.createEvent("MouseEvents");
  e.initEvent("mouseup", true, true);
  elem.dispatchEvent(e);
}

/**
 * Scroll item to top, without animation.
 */
function scrollToTop($item) {
  if (typeof $item === 'undefined' || ! $item.length)
    return;

  var $body = $('body');
  var itemOffsetY = $item.offset().top - fixedBarsHeight() - GAP_ABOVE_ITEM_AT_TOP;
  var scrollDist = itemOffsetY - $body.scrollTop();
  //debug("scrollToTop: itemOffsetY=" + itemOffsetY + " scrollDist=" + scrollDist);

  if (scrollDist !== 0) {
    var $copyright = $(_C_COPYRIGHT);

    // To prevent the page from jumping back down, we have to have a spacer
    // at the bottom of the page.
    var $spacer = $('#gpme-bottom-spacer');

    if ($copyright.length != 1) {
      error("scrollTop: Can't find copyright line");
      $spacer.height(0); // If any
    } else {
      // XXX Probably could have used the body height instead of the bottom of the copyright.
      var copyrightBottom = $copyright.get(0).getBoundingClientRect().bottom + MAX_DIST_FROM_COPYRIGHT_TO_BOTTOM_OF_VIEWPORT;
      //debug("scrollToTop: copyrightBottom=" + copyrightBottom + " window.innerHeight=" + window.innerHeight);

      if (! $spacer.length) {
        $spacer = $('<div id="gpme-bottom-spacer"></div>');
        $spacer.insertAfter($copyright);
      }

      //debug("scrollToTop: spacer height" + Math.max(0, window.innerHeight - copyrightBottom + scrollDist));
      $spacer.height(Math.max(0, window.innerHeight - copyrightBottom + scrollDist));
    }

    // Scroll item
    $body.scrollTop(itemOffsetY);
  }
}

/**
 * Toggle muting on specified item.
 * This is how muted items are treated differently:
 * - we preserve their last fold/unfold state, so that when we unmute, it goes back to what it was.
 *   That means other fold/unfold operations have no effect on that state.
 * - the post-wrapper must be unhidden for G+'s muted div to display.
 * @param goUp: optional, tries to go up after mute instead of down
 */
function toggleItemMuted($item, goUp) {
  if (typeof $item === 'undefined' || $item === null)
    return;

  // Try unmute link first, then unmute menu entry, then mute menu entry
  // NOTE: the unmute link could be there but hidden as a result of a prior
  // mute-unmute operation
  var $unmuteLink = $item.find(_C_LINK_UNMUTE);
  var unmuteFound = false;
  if ($unmuteLink.length && $unmuteLink.is(':visible')) {
    unmuteFound = true;
  } else {
    $unmuteLink = $item.find(_C_MENU_UNMUTE);
    if ($unmuteLink.length)
      unmuteFound = true;
  }

  var $post;

  // Unmute
  if (unmuteFound) {
    click($unmuteLink);

    // If folded, we have to undo the show we did when muting
    // NOTE: unlike when clicking G+'s "unmute" link, this will not automatically
    // re-show the preview, but that's not important.
    if (isItemFolded($item)) {
      $post = $item.find('.gpme-post-wrapper');
      if ($post.length != 1) {
        error("toggleItemMuted: can't find post content for id=" + $item.attr('id'));
      } else {
        $post.hide();
      }
    } else { // If unfolded, this may mean we need to fold the last open item and animate scrolling
      toggleItemFoldedVariant('unfold', $item);
    }

  } else { // Mute
    var $muteMenu = $item.find(_C_MENU_MUTE);
    if ($muteMenu.length) {
      // If the item is folded, we need to set a max-height so that G+'s muting
      // scrolling animation doesn't start from so low
      if (isItemFolded($item)) {
        $item.css('max-height', MUTED_ITEM_HEIGHT);
        setTimeout(function() { $item.css('max-height', ''); }, 500);
      }

      click($muteMenu);

      if (isItemFolded($item)) {
        // We have to show the post content in order to display the "muted" message
        $post = $item.find('.gpme-post-wrapper');
        if ($post.length != 1) {
          error("toggleItemMuted: can't find post content for id=" + $item.attr('id'));
        } else {
          $post.show();
        }
      }

      // Now automatically go to the next message, just like in gmail
      // This code is just like for shift-down
      if (goUp)
        $sibling = getPrevItem($item);
      else
        $sibling = getNextItem($item);
      if ($sibling.length) {
        navigateUnfolding($sibling, $item, ! goUp);
      } else if (! goUp) {
        // If we're at the bottom, trigger the more button
        clickMoreButton();
      }
    }
  }
}

/**
 * Returns true if specified item is muted
 */
function isItemMuted($item) {
  return $item.hasClass(C_IS_MUTED);
}

/**
  * Trigger the more button
  */
function clickMoreButton() {
  // Scroll it into view
  $moreButton = $(_C_MORE_BUTTON);
  if ($moreButton.length) {
    $moreButton.scrollintoview();
    click($moreButton);
  }
}

/**
 * Trigger the "More comments" button, or "Older comments" button
 */
function clickMoreCommentsButton($item) {
  var $commentsButton = $item.find(_C_COMMENTS_MORE_CONTAINER);
  if ($commentsButton.length && $commentsButton.is(':visible')) {
    click($commentsButton);
  } else {
    $commentsButton = $item.find(_C_COMMENTS_OLD_CONTAINER);
    if ($commentsButton.length && $commentsButton.is(':visible')) {
      click($commentsButton);
    }
  }
}

/**
 * Expand the text of the post by clicking on "Expand this post"
 */
function togglePostExpansion($item) {
  if (typeof $item !== 'undefined' && $item.length) {
    var $expandLink = $item.find(_C_EXPAND_POST);
    if ($expandLink.length) {
      click($expandLink);
    }
  }
}

/****************************************************************************
 * Comment folding/unfolding logic
 ***************************************************************************/

/**
 * Returns true if comments for specified item are folded
 */
function areItemCommentsFolded($item) {
  return $item.hasClass('gpme-comments-folded');
}

/**
 * Toggle viewable state of the comments of an item.
 * This is only called as a result of a user action.
 * Calls foldComments() or unfoldComments().
 * @return true if toggling worked
 */
function toggleCommentsFolded($item) {
  var $comments = $item.find('.gpme-comments-wrapper');
  //debug("toggleCommentsFolded: length=" + $posts.length);
  if ($comments.length != 1) {
    error("toggleCommentsFolded: Can't find comments");
    error($item);
    return false;
  }

  var id = $item.attr('id');
  if (areItemCommentsFolded($item)) {
    unfoldComments(true, $item, $comments);
  } else {
    foldComments(true, $item, $comments);
  }

  return true;
}

/**
 * Fold comments and show some content in the bar
 * @param $comments: Optional
 */
function foldComments(interactive, $item, $comments) {
  if (typeof($comments) == 'undefined') {
    $comments = $item.find('.gpme-comments-wrapper');
    if ($comments.length != 1) {
      // Photo-tagging posts don't have comments
      //error("foldComments: Can't find comments container node for " + $item.attr('id'));
      //error($item);
      return;
    }
  }

  var id = $item.attr('id');
  debug("foldComments: id=" + id);
  var commentCount = countComments($comments);

  // If result of user action
  if (interactive) {
    // Persist
    localStorage.setItem("gpme_comments_folded_" + id, true);

    saveSeenCommentCount(id, commentCount);

    // Visual changes
    var shownCommentCount = countShownComments($item);
    var duration = shownCommentCount <= 4 ? 50 : shownCommentCount <= 10 ? 150 : 250;
    var $commentbar = $item.find('.gpme-commentbar > div');
    $commentbar.slideUp(duration);
    $comments.css('min-height', '27px').slideUp(duration, function() {
      $item.addClass('gpme-comments-folded');
      $item.removeClass('gpme-comments-unfolded');
      updateCommentbar(id, $item, commentCount);
      $commentbar.show(); // undo the hiding of sliding up
    });

    // Favor the share line first so there's no unnecessary motion
    var $shareLine = $item.find(_C_SHARE_LINE);
    ($shareLine.length? $shareLine : $commentbar).scrollintoview({ duration: duration, direction: 'y' });

  } else {
    // Visual changes
    $comments.hide();
    $item.addClass('gpme-comments-folded');
    $item.removeClass('gpme-comments-unfolded');
  }

  // If not yet done, put content in titlebar
  var $title = $item.find('.gpme-comments-title');
  if (! $title.hasClass('gpme-comments-has-content')) {
    $title.addClass('gpme-comments-has-content');

    // Insert placeholder for snippet
    $title.prepend('<span class="gpme-comments-snippet"></span>');

    // Insert fold icon
    $title.prepend('<span class="gpme-fold-icon">\u25b6</span>');

    // Add comment-count container
    $title.prepend('<div class="gpme-comment-count-container" style="display:none">' +
      '<span class="gpme-comment-count-bg ' + C_GPME_COMMENTCOUNT_NOHILITE + '"></span>' +
      '<span class="gpme-comment-count-fg ' + C_GPME_COMMENTCOUNT_NOHILITE + '"></span></div>');
  }

  updateCommentbar(id, $item, commentCount);
}

/**
 * Unfold comments
 * @param $comments: Optional
 */
function unfoldComments(interactive, $item, $comments) {
  if (typeof($comments) == 'undefined') {
    $comments = $item.find('.gpme-comments-wrapper');
    if ($comments.length != 1) {
      // Photo-tagging posts don't have comments
      //error("foldItem: Can't find comments container node");
      //error($item);
      return;
    }
  }

  var id = $item.attr('id');
  debug("unfoldComments: id=" + id);
  var commentCount = countComments($comments);

  if (interactive) {
    // Persist
    localStorage.removeItem("gpme_comments_folded_" + id);

    // Interactive visual changes
    var shownCommentCount = countShownComments($item);
    var duration = shownCommentCount <= 4 ? 50 : shownCommentCount <= 10 ? 150 : 250;
    var $commentbar = $item.find('.gpme-commentbar > div');
    $commentbar.hide();
    $comments.slideDown(duration, function() {
      $item.removeClass('gpme-comments-folded');
      $item.addClass('gpme-comments-unfolded');
      // NOTE: updateCommentbar needs to be done after updating classes
      updateCommentbar(id, $item, commentCount);
      $commentbar.fadeIn('fast');
    });

    deleteSeenCommentCount(id);
  } else {
    // Automated visual changes
    $comments.show();
    $item.removeClass('gpme-comments-folded');
    $item.addClass('gpme-comments-unfolded');
    // NOTE: updateCommentbar needs to be done after updating classes
    updateCommentbar(id, $item, commentCount);
  }
}

/****************************************************************************
 * Comment counting & snippet
 ***************************************************************************/

/**
 * Update the commentbar
 */
function updateCommentbar(id, $item, commentCount) {
  updateCommentCount(id, $item, commentCount);
  updateCommentsSnippet(id, $item);
  updateCommentbarHeight(id, $item, commentCount);
}

/**
 * Update the displayed comment count.
 * NOTE: this can display negative counts if someone deletes a comment;
 * FIXME: there's no handling for the deletion of a comment and then
 *   the adding of a comment -- that just looks like there was no change
 */
function updateCommentCount(id, $subtree, count) {
  //debug("updateCommentCount: id=" + id + " count=" + count);
  //
  var $container = $subtree.find(".gpme-comment-count-container");
  var $countBg = $container.find(".gpme-comment-count-bg");
  var $countFg = $container.find(".gpme-comment-count-fg");

  // Clear any old timers we may have
  if (id in lastCommentCountUpdateTimers) {
    clearTimeout(lastCommentCountUpdateTimers[id]);
    delete lastCommentCountUpdateTimers[id];
  }

  // Change background of count
  var seenCount = localStorage.getItem('gpme_post_seen_comment_count_' + id);
  // seenCount === null && count > 0 : in list mode, there is no seen count on new folded posts
  // seenCount !== null && count != seenCount : count has changed since last seen
  // 'gpme_post_seen_comment_count_changed_' + id in localStorage : count is the same but was
  //    different before, which means e.g. a comment was deleted and another inserted
  if ((seenCount === null && count > 0 ) || (seenCount !== null && count != seenCount) ||
      'gpme_post_seen_comment_count_changed_' + id in localStorage) {
    $countBg.removeClass(C_GPME_COMMENTCOUNT_NOHILITE);
    $countFg.removeClass(C_GPME_COMMENTCOUNT_NOHILITE);
    $countFg.text(count - (seenCount !== null ? seenCount : 0));
    $container.show();

    // Keep track of comment count changes, so that "0" stays red (when
    // someone deletes a comment)
    if (seenCount !== null && ! ('gpme_post_seen_comment_count_changed_' + id in localStorage)) {
      lastCommentCountUpdateTimers[id] = setTimeout(function() {
        debug("lastCommentCountUpdateTimers: setting id=" + id);
        localStorage['gpme_post_seen_comment_count_changed_' + id] = true;
        delete lastCommentCountUpdateTimers[id];
      }, 200);
    }
  } else {
    $countBg.addClass(C_GPME_COMMENTCOUNT_NOHILITE);
    $countFg.addClass(C_GPME_COMMENTCOUNT_NOHILITE);
    if (count) {
      $countFg.text(count);
      $container.show();
    } else {
      $container.hide();
    }
  }
}

/**
 * Update the summary of comments with names of commenters.
 * NOTE: due to the way Google orders the names (oldest to most recent)
 * and cuts off past a number of names, we have to stick to that order.
 */
function updateCommentsSnippet(id, $item) {
  // Skip if the comments are unfolded
  if (! areItemCommentsFolded($item))
    return;

  var text = '';
  var $snippet = $item.find('.gpme-comments-snippet');

  // Get the shown names
  var names = new Array();
  var namesHash = new Object();

  function addNameUnique(name) {
    if (typeof namesHash[name] == 'undefined') {
      names.push(name);
      namesHash[name] = true;
    }
    return namesHash.length;
  }

  var $commentWrapper = $item.find('.gpme-comments-wrapper');
  // It's possible not to have comments at all on posts with comments
  // disabled or on photo-tagging posts
  if (! $commentWrapper.length) {
    return;
  }

  var $shownNames = $commentWrapper.find(_C_COMMENTS_SHOWN_NAMES);
  $shownNames.each(function() { if (addNameUnique($(this).text()) > 15) return false; });
  // Pad with some more recent names
  if (names.length < 15) {
    var $moreNames = $commentWrapper.find(_C_COMMENTS_MORE_NAMES);
    $moreNames.each(function() { if (addNameUnique($(this).text()) > 15) return false; });
  }
  text = names.join(', ');

  var $oldNames = $commentWrapper.find(_C_COMMENTS_OLD_NAMES);
  if ($oldNames.length) {
    // If nothing, then just get the old names.
    if (! text.match(/\S/))
      text = $oldNames.text();
    else
      text = '…, ' + text;
  }
  $snippet.text(text);
}

/**
 * Update the commentbar's height
 * @param commentCount Optionally provide the commentcount
 */
function updateCommentbarHeight(id, $item, commentCount) {
  // Skip if entire post is folded
  if (isItemFolded($item))
    return;

  var $commentWrapper = $item.find('.gpme-comments-wrapper');
  if (! $commentWrapper.length) {
    error("updateCommentbarHeight: can't find comments wrapper");
    error($item);
    return;
  }

  if (typeof commentCount == 'undefined')
    commentCount = countComments($commentWrapper);

  var $commentbar = $item.find('.gpme-commentbar > div');

  // If no comments, no need for a bar
  if (commentCount === 0) {
    $commentbar.hide();
  } else {
    $commentbar.show();
    // If folded, Remove any dynamically-set height
    if (areItemCommentsFolded($item)) {
      $commentbar.css('height', '');
    } else {
      // Update the height
      // Despite advertisements, jQuery 1.6.2 still cannot calculate
      // height within a hidden tree
      $commentbar.height($commentWrapper.actual('outerHeight') - 2);
    }
  }
}

/** 
 * Count comments for item
 */
function countComments($subtree) {
  if (typeof $subtree === 'undefined' || ! $subtree.length)
    return 0;

  var commentCount = 0, text;
  var $comments = $subtree.find(_C_COMMENTS_OLD);
  if ($comments.length)
    commentCount += parseTextCount($comments.text());
  commentCount += countShownComments($subtree);
  $comments = $subtree.find(_C_COMMENTS_MORE);
  if ($comments.length)
    commentCount += parseTextCount($comments.text());

  //debug("countComments: " + commentCount);
  return commentCount;
}

/**
 * Extracts count from text in multiple languages
 */
function parseTextCount(text) {
  var num = parseInt(text, 10); // Try faster method first
  if (isNaN(num)) {
    num = parseInt(text.replace(/.*?(\d+).*/, '$1'), 10);
    if (isNaN(num)) {
      error("parseTextCount: can't parse count of text");
      num = 0;
    }
  }
  return num;
}

/**
 * Returns the number of shown comments
 */
function countShownComments($subtree) {
  return $subtree.find(_C_COMMENTS_SHOWN).length;
}

/**
 * Stores seen comment count
 */
function saveSeenCommentCount(id, commentCount) {
  debug("saveSeenCommentCount: id=" + id + " saving count=" + commentCount);
  // Update the shown comment count, only if not already set.
  var oldCount = localStorage.getItem('gpme_post_seen_comment_count_' + id);
  if (typeof(oldCount) == 'undefined' || oldCount === null)
    localStorage.setItem('gpme_post_seen_comment_count_' + id, commentCount);
}

/**
 * Deletes seen comment count
 */
function deleteSeenCommentCount(id) {
  // Remove the stored comment count
  localStorage.removeItem('gpme_post_seen_comment_count_' + id);
  localStorage.removeItem('gpme_post_seen_comment_count_changed_' + id);
}

/****************************************************************************
 * Preview popup
 ***************************************************************************/

/**
 * Pops up the preview of the hovered item
 */
function showPreview(e) {
  debug("showPreview: this=" + this.className);

  // Skip if this is expanded mode
  if (displayMode == 'expanded')
    return;

  var $item = $(this);

  if (!$item || ! isItemFolded($item))
    return;

  // Sometimes if you switch windows, there might be some preview remaining
  // that hoverIntent will not catch.
  hideAnyPostItemPreview();

  // Skip if this is a muted item
  if (isItemMuted($item))
    return;

  var $post = $item.find('.gpme-post-wrapper');
  if ($post.length) {
    // Block clicks temporarily
    var $clickWall = $item.find('.gpme-disable-clicks');
    $clickWall.show();
    setTimeout(function() { $clickWall.hide(); } , clickWallTimeout);

    var fixedHeight = fixedBarsHeight();
    var overlappingHeight = overlappingBarsHeight();

    // Move to the right edge and as far up as possible
/* Disabled: we now move based on right-edge instead of left-edge
    // 430px = (31+60+26) cropping + 135 shriking + 195 width of sidebar - 17 slack
    // NOTE: need lots of slack coz the horizontal scrollbar flashes on OSX for some rason
    $post.css('left',
      '' + (430 + Math.max(0, Math.floor((document.body.clientWidth - 960) / 2))) + 'px');
*/
    $post.css('left', '0');
    // We give slack of 10 coz otherwise you get the horizontal bar flashing on Chrome OSX.
    // The width of the popup is reduced by 5 in CSS to leave a bit of a gap between posts and the popup so
    // that the popup triangle can nicely overlay a big commentcount.
    $post.css('right', '' +
      -Math.min($post.outerWidth() + 5,
        ($(document).width() - $(window).scrollLeft() - $item.get(0).getBoundingClientRect().right - 10)) +
      'px');
    $post.css('left', 'auto');
    var offsetY = Math.max(POST_WRAPPER_PADDING_TOP,
      Math.min($post.outerHeight() - TRIANGLE_HEIGHT - POST_WRAPPER_PADDING_BOTTOM,
        $item.offset().top -
         Math.max(document.body.scrollTop + fixedHeight, overlappingHeight) -
        /* breathing room */ 7));
    $post.css('top', '' + (-offsetY) + 'px');
    //$post.css('max-height', '' + (window.innerHeight - 14) + 'px');
    var $triangle = $post.children('.gpme-preview-triangle');
    $triangle.css('top',  '' + offsetY + 'px');

    // Change the max-height of the post content
    var $postContent = $post.children(_C_CONTENT);
    if (! $postContent.length) {
      error("showPreview: Can't find post content style class");
    } else {
      $postContent.css(
        'max-height',
          '' + (window.innerHeight - Math.max(document.body.scrollTop + fixedHeight, overlappingHeight) -
                /* breathing room */ 7*2) +
          'px');

      // Workaround for scroll-position loss bug in Chrome
      // http://code.google.com/p/chromium/issues/detail?id=36428
      var lastScrollTop = $postContent.attr('gpme-last-scrollTop');
      if (typeof lastScrollTop !== undefined && lastScrollTop !== '')
        $postContent.scrollTop(lastScrollTop);
    }

    // Only show the scrollbar when the mouse is inside
    $post.hover(function() { $(this).addClass('gpme-hover'); },
                function() { $(this).removeClass('gpme-hover'); });

    // Show the preview
    $post.show();
    $lastPreviewedItem = $item;
  } else {
    error("showPreview: Can't find post wrapper");
    error($item);
  }
}

/**
 * Hides the preview of the item that was moused-out
 */
function hidePreview(e) {
  debug("hidePreview: this=" + this.className);
  hidePostItemPreview($(this));
}

/**
 * Hides the preview of the specified item
 */
function hidePostItemPreview($item) {
  debug("hidePostItemPreview:");
  if (!$item || ! isItemFolded($item))
    return;

  // Skip if this is a muted item
  if (isItemMuted($item))
    return;

  var $post = $item.find('.gpme-post-wrapper');
  if ($post.length) {
    // Change the max-height of the post content
    var $postContent = $post.children(_C_CONTENT);
    if (! $postContent.length) {
      error("showPreview: Can't find post content style class");
    } else {
      // Workaround for scroll-position loss bug in Chrome
      // http://code.google.com/p/chromium/issues/detail?id=36428
      $postContent.attr('gpme-last-scrollTop', $postContent.scrollTop());

      $postContent.css('max-height', '');
    }

    // Remove class just in case but not necessary
    $post.hide().removeClass('gpme-hover').unbind('mouseenter mouseleave');
  } else {
    error("showPreview: Can't find post wrapper");
    error($item);
  }

  $lastPreviewedItem = null;
}

/**
 * Hides the last preview that was popped up
 */
function hideAnyPostItemPreview() {
  debug("hideAnyPostItemPreview");
  if ($lastPreviewedItem !== null)
    hidePostItemPreview($lastPreviewedItem);
}

/****************************************************************************
 * Main
 ***************************************************************************/

$(document).ready(function() {
  trace("event: initial page load.");

  injectCSS();
  
  // Get options and then modify the page
  getOptionsFromBackground(function() {
    // Listen for when there's a total AJAX refresh of the stream,
    // on a regular page
    var $contentPane = $(_ID_CONTENT_PANE);
    if ($contentPane.length) {
      var contentPane = $contentPane.get(0);
      $contentPane.bind('DOMNodeInserted', function(e) {
        // This happens when a new stream is selected
        if (e.relatedNode.parentNode == contentPane) {
          onContentPaneUpdated(e);
          return;
        }

        var id = e.target.id;
        // ':' is weak optimization attempt for comment editing
        if (id && id.charAt(0) == ':')
          return;

        // This happens when posts' menus get inserted
        if (e.target.className == 'a-f-i-Ia-D' || e.target.className == 'a-f-i-Ia-D d-D')
          onItemMenuInserted(e);
        // This happens when a new post is added, either through "More"
        // or a new recent post.
        // Or it's a Start G+ post
        if (id && (id.substring(0,7) == 'update-' ||
            COMPAT_SGP && id.substring(0,9) == ID_SGP_POST_PREFIX ))
          onItemInserted(e);
        // This happens when switching from About page to Posts page
        // on profile
        else if (e.relatedNode.id.indexOf('-posts-page') > 0)
          onContentPaneUpdated(e);
      });
    } else  {
      // This can happen if we're in the settings page for example
      warn("main: Can't find content pane");
    }

    // Listen when status change
    // WARNING: DOMSubtreeModified is deprecated and degrades performance:
    //   https://developer.mozilla.org/en/Extensions/Performance_best_practices_in_extensions
    var $status = $(_ID_STATUS_FG);
    if ($status.length)
      $status.bind('DOMSubtreeModified', onStatusUpdated);
    else
      debug("main: Can't find status node");

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

    // The initial update
    if (isEnabledOnThisPage()) {
      updateAllItems();

      // Listen to keyboard shortcuts
      $(window).keydown(onKeydown);
    }
  });
});

// vim:set iskeyword+=-,36:
