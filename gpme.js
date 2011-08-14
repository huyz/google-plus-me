/*
# Filename:         gpme.js
#
# Platforms:        Google Chrome
# Depends:          
# Web:              http://huyz.us/google-plus-me/
# Source:           https://github.com/huyz/google-plus-me
# Author:           Huy Z  http://huyz.us/
# Updated on:       2011-08-09
# Created on:       2011-07-11
#
# Installation:
#   Like any other browser extension.
#
# Usage:
#   See http://huyz.us/google-plus-me/
#
# Thanks:
#   This extension originally took some ideas from
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

// NOTE: Keep format the same as it is programmatically changed by package.sh
var DEBUG = true;
// If true, won't need the 'tabs' permission
// NOTE: Keep format the same as it is programmatically changed by package.sh
var PARANOID = false;

/****************************************************************************
 * Utility for constants
 ***************************************************************************/

// http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
RegExp.quote = function(str) {
  return str.replace(/([.?*+^$[\]\\(){}-])/g, "\\$1");
};

/****************************************************************************
 * Constants
 ***************************************************************************/

// NOTE: For more class constants, see foldItem() in classes array

var _ID_GBAR                    = '#gb';
var _ID_GBAR_TOP                = '#gbw';
var _ID_STATUS                  = '#gbg1';
var _ID_STATUS_BG               = '#gbi1a';
var _ID_STATUS_FG               = '#gbi1';
var C_STATUS_BG_OFF             = 'gbid';
var C_STATUS_FG_OFF             = 'gbids';
var _C_HEADER                   = '.a-c-aa-S';
var _ID_CONTENT                 = '#content';
// For stream, we  have to use #contentPane; we can't just use '.a-b-f-i-oa' cuz
// clicking link to the *current* page will refresh the contentPane
var _ID_CONTENT_PANE            = '#contentPane';
var _C_COPYRIGHT                = '.a-c-Sa-S';
var _C_FEEDBACK_LINK            = '.a-Wj-Lh';
var C_FEEDBACK                  = 'j-e-Pa';

// Icons
var _C_HANGOUT_LIVE_ICON        = '.x5MY5e'; // https://plus.google.com/100512649718649402368/posts/1u32KN5UzUR
var C_HANGOUT_LIVE_ICON         = 'x5MY5e'; // https://plus.google.com/116805285176805120365/posts/8eJMiPs5PQW
// C_CAMERA_ICON*
var C_POST_CONTENT_ICON_CONTAINER = 'h-na-xe-Ua-N'; // Use the last one; don't use the first one 'h-Ac' otherwise hovers works
var C_CAMERA_ICON               = 'h-na-o-z';
var C_VIDEO_ICON                = 'h-na-o-Ja';
var C_LINK_ICON                 = 'h-na-o-k';
var C_CHECKIN_ICON              = 'h-na-o-Jf-N';
var C_GAME_ICON                 = 'pm';

// Pages and streams
var C_NOTIFICATIONS_MARKER      = 't6';
var _C_NOTIFICATION_STREAM      = '.a-c-A-ve-jo';
var C_SPARKS_MARKER             = 'c1';
var C_SINGLE_POST_MARKER        = 'a-Bh-fc-K';
var C_STREAM                    = 'Wq';
var _C_STREAM                   = '.Wq';
var S_PROFILE_POSTS             = 'div[id$="-posts-page"]';
var _C_MORE_BUTTON              = '.Ml';

var _C_CONTENT_PANE_HEADING     = '.kp';
var _C_PROFILE_HEADING          = '.fn';

// Item
var C_SELECTED                  = 'Lj';
var _C_SELECTED                 = '.Lj';
var _C_ITEM                     = '.tf';
var _C_ITEM_GUTS                = '.zh';
var _C_ITEM_GUTS_PLACEHOLDER    = '.my'; // For hangout and photo albums
var C_IS_MUTED                  = 'vp'; // Style is: nk
var _C_LINK_UNMUTE              = '.Pi';
var C_TITLE_COLOR               = 'Mn';
// _C_TITLE:
// Watch out for these divs:
// - hangout 'Live' icon (.a-lx-i-ie-ms-Ha-q), which comes before post
// - "Shared by ..." in Incoming page ("a-f-i-Jf-Om a-b-f-i-Jf-Om")
// - Google Plus Reply+
//var _C_TITLE                    = '.a-f-i-p-U > div:not(.a-lx-i-ie-ms-Ha-q):not(.gpr_tools)'; // This will work with StartG+ as well
var _C_TITLE                    = '.Uy';
//var _C_TITLE2                   = '.a-f-i-p-U > div:not(.a-lx-i-ie-ms-Ha-q):not(' + _C_CONTENT_PLACEHOLDER + ')';
var C_TITLE                     = 'Uy';
var S_PHOTO                     = '.Bu > a.xp';
var _C_NAME                     = '.IE';
// S_SOURCE:
// - checkin: https://plus.google.com/112543001180298325686/posts/1hJCin8mTaV
// - hangout: https://plus.google.com/100512649718649402368/posts/1u32KN5UzUR
// - mobile: https://plus.google.com/115404182941170857382/posts/ZUiCSs9Qteq
var S_SOURCE                    = '.tz.d-q-p';
var _C_CONTENT                  = '.Qy';
var _C_PERMS                    = '.gl'; // Candidates: gl rr Cp
var _C_MUTED                    = '.Zq'; // "- Muted" text in profile page
var C_DATE                      = 'fl'; // Candidates: fl Br
var _C_DATE                     = '.fl';
var _C_EXPAND_POST              = '.Kq';
//var _C_EMBEDDED_VIDEO           = '.ea-S-Bb-jn > div';

// Parts of content relevant for the summary
var _C_QUOTE_IMG                = '.ea-S-qg'; // This is an image of a blown quote: ``
// _C_QUOTED_PHOTO:
// - re-sharing your own post: https://plus.google.com/116805285176805120365/posts/3vKNMqMsYrc
var _C_QUOTED_PHOTO             = '.sz > img';
// Various images:
// - Web page image: O-F-Th-la
// - Posted image: https://plus.google.com/107590607834908463472/posts/VfD8zwSq5yv
// - Posted album: O-F-Bj-la  https://plus.google.com/100410400068186344529/posts/L4JRFFK2e87 [limited]
// - Main image in album: O-F-Nf-la https://plus.google.com/103450266544747516806/posts/f8RKcEssKwL [limited]
// - Smaller image thumbnails in album: O-F-nd-la https://plus.google.com/103450266544747516806/posts/f8RKcEssKwL [limited]
var S_CONTENT_IMG               = '.O-F-Dl-la > img, .O-F-Bj-la > img, .O-F-Nf-la > img, .O-F-nd-la > img';
var _C_CONTENT_VIDEO            = '.O-F-Ja-vl';
var _C_CONTENT_LINK             = '.O-F-Q-k';
var _C_CONTENT_ANY_LINK         = _C_CONTENT + ' a.ot-anchor'; // This also includes links that are embedded in the text https://plus.google.com/112374836634096795698/posts/KryDaNYMQLF
var _C_MAP_IMG                  = 'img.LZkmfe';

// Comments
var _C_COMMENTS_ALL_CONTAINER   = '.Ol';
var C_COMMENTS_ALL_CONTAINER    = 'Ol';
var C_COMMENTS_OLD_CONTAINER    = 'al';
var _C_COMMENTS_OLD_CONTAINER   = '.al';
var _C_COMMENTS_OLD_COUNT       = '.Dk';
var _C_COMMENTS_OLD_NAMES       = '.al .er';
var C_COMMENTS_SHOWN_CONTAINER  = 'Gq';
var _C_COMMENTS_SHOWN_CONTAINER = '.Gq';
var _C_COMMENTS_SHOWN           = '.Tk';
var _C_COMMENTS_SHOWN_NAMES     = '.Tk a.yq'; // Candidate: yq Ky
var C_COMMENTS_SHOWN_CONTENT    = 'tp'; // The div below the first <a> within the comment, for when the comment is expanded (.tp.sp becomes .tp): https://plus.google.com/105190043964183708400/posts/f6gDun2334n b
var C_COMMENTS_EDITOR           = 'Ah';
var C_COMMENTS_MORE_CONTAINER   = 'Zk';
var _C_COMMENTS_MORE_CONTAINER  = '.Zk';
var _C_COMMENTS_MORE_COUNT      = '.Ck';
var _C_COMMENTS_MORE_NAMES      = '.Zk .er';
var _C_EXPAND_COMMENT           = '.sp + .Wk';

var _C_SHARE_LINE               = '.Jn';
var _C_LINK_COMMENT             = '.wf';
var C_LINK_COMMENT              = 'wf';
var _C_FAKEINPUT_COMMENT        = '.Uk'; // Fake box that says "Add a comment...
var C_FAKEINPUT_COMMENT         = 'Uk';
//var _C_INPUTBOX_COMMENT         = '[id^=":"] .editable';
//var _C_COMMENT_EDITOR           = '.u-o-h-i-lc';

// Menu
var C_MENU                      = 'yp d-L';
var _C_MENU_MUTE                = '.Sl'; // Candidates: Sl Ki
var _C_MENU_UNMUTE              = '.or'; // Candidates: or Ki; Displayed on user's posts page

var _C_COMMENT_CONTAINERS =
  [ _C_COMMENTS_OLD_CONTAINER, _C_COMMENTS_SHOWN_CONTAINER, _C_COMMENTS_MORE_CONTAINER ];

// XXX We assume there is no substring match problem because
// it doesn't look like any class names would be a superstring of these
var COMMENT_MODIFIED_REGEXP = new RegExp('\\b(?:' + C_COMMENTS_OLD_CONTAINER + '|' + C_COMMENTS_SHOWN_CONTAINER + '|' + C_COMMENTS_MORE_CONTAINER + '|' + C_COMMENTS_SHOWN_CONTENT + '|' + C_COMMENTS_EDITOR + ')\\b');
var DISABLED_PAGES_URL_REGEXP = /\/(posts|notifications|sparks)\//;
var DISABLED_PAGES_CLASSES = [
  C_NOTIFICATIONS_MARKER,
  C_SPARKS_MARKER,
  C_SINGLE_POST_MARKER
];

var DATE_JUNK_REGEXP, DATE_LONG_REGEXP; // Due to Chrome bug, defined later, after response from background

// G+me
var C_GPME_COMMENTCOUNT_NOHILITE = 'gpme-comment-count-nohilite';

// Usability Boost
var _C_UBOOST_MUTELINK           = '.mute_link';
var C_UBOOST_STAR                = 'post_star';

// Circlestars
var _C_CIRCLESTARS               = '.circlestars';

// Start G+, a.k.a. SGPlus
var ID_SGP_POST_PREFIX           = 'sgp-post-';
var C_SGP_UPDATE                 = 'sgp_update';
var C_SGP_UPDATE_FB              = 'sgp_update_facebook';
var C_SGP_UPDATE_TWITTER         = 'sgp_update_twitter';
var _C_SGP_TITLE                 = _C_TITLE; // Same as G+ now
var _C_SGP_CONTENT               = _C_CONTENT; // Same as G+ now (but doesn't matter coz not relevant to SGPlus posts
var _C_SGP_TEXT1                 = _C_CONTENT; // .Qy
var _C_SGP_TEXT2                 = '.ea-S-R';
var S_SGP_ORIGPOST_LINK          = 'span[style                                                                       ^= "font-size"]';
var _C_SGP_COMMENT               = '.sgp_comments_wrapper';
var _C_SGP_DATE                  = '.a-b-f-i-Ad-Ub';

// Google+ Tweaks
var _C_TWEAK_EZMNTN              = '.bcGTweakEzMntn';

// CSS values shared with our CSS file
var TRIANGLE_HEIGHT                               = 30;
var POST_WRAPPER_PADDING_TOP                      = 6;
var POST_WRAPPER_PADDING_BOTTOM                   = 6;
var ITEM_LINE_HEIGHT                              = 22;
var FOLDED_ITEM_OUTER_HEIGHT_EXTRAS               = 2 * (4 + 1);
var MUTED_ITEM_HEIGHT                             = 45;
// Other CSS values
var GBAR_HEIGHT                                   = 30;
var HEADER_BAR_HEIGHT                             = 60; // This changes to 45 depending on Google+ Ultimate's options
var MAX_DIST_FROM_COPYRIGHT_TO_BOTTOM_OF_VIEWPORT = 30; // about the same as height as feedback button
var ROOM_FOR_COMMENT_AREA                         = 70;
// Independent CSS values that affect on this file
var GAP_ABOVE_ITEM_AT_TOP                         = 2;
var GAP_ABOVE_PREVIEW                             = 7;
var SLACK_BELOW_PREVIEW                           = 77; // Needed to prevent G+ from jumping page when user adds comment

// Duration of clickwall.
// NOTE: timeout must be less than jquery.hoverIntent's overTimeout, otherwise
// the preview will go away.
var clickWallTimeout = 300;

// lscache key prefixes
var LS_HISTORY_                    = 'gpme_h_';
var LS_POST_                       = LS_HISTORY_ + 'p';
var LS_READ                        = LS_POST_ + 'r_'; // Applies in list/expanded mode, but only useful in list
var LS_FOLDED                      = LS_POST_ + 'f_'; // Applies in expanded mode
var LS_COMMENTS_                   = LS_POST_ + 'c';
var LS_COMMENTS_FOLDED             = LS_COMMENTS_ + 'f_'; // Applies by default
var LS_COMMENTS_UNFOLDED           = LS_COMMENTS_ + 'u_'; // Applies if comments are collapsed by default
var LS_COMMENTS_READ_COUNT         = LS_COMMENTS_ + 'rc_';
var LS_COMMENTS_READ_COUNT_CHANGED = LS_COMMENTS_ + 'rcc_';
var LS_URL_LIST_LAST_UNFOLDED      = LS_HISTORY_ + 'ullu_'; // Applies in list mode
// DEPRECATED: old localStorage keys
var OLD_KEYS = {};
OLD_KEYS[LS_FOLDED]                 = 'gpme_post_folded_';
OLD_KEYS[LS_COMMENTS_FOLDED]        = 'gpme_comments_folded_';
OLD_KEYS[LS_COMMENTS_UNFOLDED]      = 'gpme_comments_unfolded_';
OLD_KEYS[LS_COMMENTS_READ_COUNT]    = 'gpme_post_seen_comment_count_';
OLD_KEYS[LS_COMMENTS_READ_COUNT_CHANGED] = 'gpme_post_seen_comment_count_changed_';
OLD_KEYS[LS_URL_LIST_LAST_UNFOLDED] = 'gpme_post_last_open_';

/****************************************************************************
 * Pre-created DOM elements
 ***************************************************************************/

//
// Inside both post and comment title
//

var $commentCountBgTpl = $('<span class="gpme-comment-count-bg"></span>');
var $commentCountFgTpl = $('<span class="gpme-comment-count-fg"></span>');
var $commentCountContainerTpl = $('<div class="gpme-comment-count-container ' + C_GPME_COMMENTCOUNT_NOHILITE + '"></div>').append($commentCountBgTpl).append($commentCountFgTpl).click(onCommentCountClick);
var $markReadButtonTpl = $('<div class="gpme-mark-read-button"></div>').click(onMarkReadClick);
var $muteButtonTpl = $('<div class="gpme-mute-button"></div>').click(onMuteClick);
// NOTE: order matters.
// - if commentCount comes before mutebutton, it takes precedence in clicking
// - actually, we put commentCount later, now that we have the markread button
var $buttonAreaTpl = $('<div class="gpme-button-area"></div>').
  append($markReadButtonTpl).
  append($muteButtonTpl).
  append($commentCountContainerTpl);

//
// Inside item title
//

// C_TITLE is no longer necessary now that copied styles over from C_TITLE for SGPlus
//var $titleTpl = $('<div class="' + C_TITLE + '"></div>').click(onTitleClick);
var $titleTpl = $('<div class="gpme-title-clickarea"></div>').click(onTitleClick);
var $titleSenderTpl = $('<span class="gpme-title-sender"></span>');
var $titleDashTpl = $('<span class="gpme-sep ' + C_TITLE_COLOR + '">  -  </span>');
var $titleQuoteTpl = $('<span class="gpme-sep ' + C_TITLE_COLOR + '">  +  </span>');
var $hangoutLiveIconTpl = $('<span class="gpme-title-icons ' + C_HANGOUT_LIVE_ICON + '" style="margin-left: 5px"></span>');
var $hangoutPastIconTpl = $hangoutLiveIconTpl.clone().css('width', '21px');
// $cameraIconTpl: need container so it doesn't have the green of hover
var $cameraIconTpl = $('<span class="' + C_POST_CONTENT_ICON_CONTAINER + '"><span class="gpme-title-icons ' + C_CAMERA_ICON + '" style="margin: 0 4px"></span></span>');
var $videoIconTpl = $('<span class="' + C_POST_CONTENT_ICON_CONTAINER + '"><span class="gpme-title-icons ' + C_VIDEO_ICON + '" style="margin: 0 4px"></span></span>');
var $linkIconTpl = $('<span class="' + C_POST_CONTENT_ICON_CONTAINER + '"><span class="gpme-title-icons ' + C_LINK_ICON + '" style="margin: 0 4px"></span>');
var $checkinIconTpl = $('<span class="gpme-title-icons ' + C_CHECKIN_ICON + '" style="margin-right: -5px;"></span>');
var $mobileIconTpl = $('<span class="gpme-title-icons ' + C_CHECKIN_ICON + '" style="margin-left: 2px; margin-right: -3px; background-position: 0 -34px"></span>');
var $gameIconTpl = $('<span class="gpme-title-icons ' + C_GAME_ICON + '" style="margin-left: 2px; margin-right: -3px; background-size: 80%; background-position: 0 -221px; height: 14px"></span>');
var $titleDateTpl = $('<span class="gpme-title-date"></span>');
var $titleThumbnailsTpl = $('<span class="gpme-title-thumbnails"></span>');
var $titleSnippetTpl = $('<span class="gpme-snippet"></span');

//  ('<div class="gpme-title-folded"><div class="gpme-fold-icon">\u25cf</div></div>');
var $titlebarFolded = $('<div class="gpme-title-folded gpme-bar"><div class="gpme-button-area-left"><div class="gpme-circle-icon"></div></div></div>');
var $titlebarTpl = $('<div class="gpme-titlebar"></div>').append(
    $('<div class="gpme-title-unfolded gpme-bar" style="opacity: 0">\
      <div class="gpme-fold-icon gpme-fold-icon-unfolded-left">\u25bc</div>\
      <div class="gpme-fold-icon gpme-fold-icon-unfolded-right">\u25bc</div>\
    </div>').click(onTitleClick)).append($titlebarFolded);

//
// Inside item's guts
//

// NOTE: started using regular DOM, then switched to using jQuery; no grand master plan
// behind the dual usage.
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
/*
.hoverIntent({
  handlerIn: showTopCollapseBar, // function = onMouseOver callback (REQUIRED)    
  delayIn: 0, // number = milliseconds delay before onMouseOver
  handlerOut: hideTopCollapseBar, // function = onMouseOut callback (REQUIRED)    
  delayOut: 0 // number = milliseconds delay before onMouseOut    
});
*/


//
// Inside item's comments title
//

var $commentSnippetTpl = $('<span class="gpme-comments-snippet"></span>');
var $commentTitleTpl = $('<div class="gpme-comments-title-clickarea"></div>').click(onCommentTitleClick).append($commentSnippetTpl);

var $commentbarTpl = $('<div class="gpme-commentbar"></div>').append(
    $('<div class="gpme-comments-title-unfolded gpme-bar">\
      <div class="gpme-fold-icon gpme-comments-fold-icon-unfolded gpme-comments-fold-icon-unfolded-top">\u25bc</div>\
      <div class="gpme-fold-icon gpme-comments-fold-icon-unfolded gpme-comments-fold-icon-unfolded-bottom">\u25bc</div>\
    </div>').click(onCommentTitleClick)).
  append('<div class="gpme-comments-title-folded gpme-bar"></div>');
//  append('<div class="gpme-comments-title-folded gpme-bar"><div class="gpme-fold-icon" style="visibility: hidden">\u25b6</div></div>');

//
// Inside item's comments guts
//

var $commentsWrapperTpl = $('<div class="gpme-comments-wrapper"></div>');

//
// Inside item bottombar
//

var $bottombarTpl = $('<div class="gpme-bottombar gpme-bar" style="opacity:0"></div>').append(
    $('<div class="gpme-title-unfolded">\
      <div class="gpme-fold-icon gpme-fold-icon-unfolded-left">\u25b2</div>\
      <div class="gpme-fold-icon gpme-fold-icon-unfolded-right">\u25b2</div>\
    </div>')).hoverIntent({
      handlerIn: showBottomCollapseBar,
      delayIn: 0,
      handlerOut: hideBottomCollapseBar,
      delayOut: 0
});

//
// Content Pane butotns
//

var $collapseAllButtonTpl = $('<span class="gpme-button-collapse-all gpme-content-button"></span>').click(foldAllItems);
var $expandAllButtonTpl = $('<span class="gpme-button-expand-all gpme-content-button"></span>').click(unfoldAllItems);
var $markAllReadButtonTpl = $('<span class="gpme-button-mark-all-read gpme-content-button"></span>').click(markAllItemsAsRead);
var $contentPaneButtonsTpl = $('<div class="gpme-content-buttons"></div>').
  append($markAllReadButtonTpl).
  append($('<div class="gpme-button-expand-or-collapse-all"></div>').
    append($collapseAllButtonTpl).
    append($expandAllButtonTpl));


/****************************************************************************
 * Init
 ***************************************************************************/

// Settings, according to fancy-settings
var settings;

// Hold all the messages from background
// Workaround for http://code.google.com/p/chromium/issues/detail?id=53628
if (DEBUG)
  var i18nMessages;

// list or expanded mode (like on GReader)
var displayMode;

// In list mode, an item that was opened but may need to be reclosed
// once the location.href is corrected
var $lastTentativeOpen = null;

// We track what's open so that we can close it
var $lastPreviewedItem = null;

// Timers to handle G+'s dynamic comment list reconstruction
var lastCommentCountUpdateTimers = {};

// Cache the year
var yearRegexp = new RegExp('(,? *|[/-]?| de )' + new Date().getFullYear() + '[/-]?');

// SGPlus update timer
var sgpUpdateTimer = null;
// SGPlus cached DOM
var $sgpCachedItems = new Object();


/****************************************************************************
 * Persistence
 ***************************************************************************/

/**
 * Gets the specified key from lscache.
 * This helps in the transition period from the old scheme to the new scheme
 */
function lsGet(type, key) {
  var result = lscache.get(type + stripKey(type, key));

  // Fallback to old data
  if (result === null)
    result = localStorage.getItem(OLD_KEYS[type] + key);

  return result;
}

/**
 * Sets the specified key into lscache
 */
function lsSet(type, key, value) {
  lscache.set(type + stripKey(type, key), value);
  //localStorage.setItem(OLD_KEYS[type] + key, value);
}

/**
 * Removs the specified key from lscache
 */
function lsRemove(type, key) {
  lscache.remove(type + stripKey(type, key));
  localStorage.removeItem(OLD_KEYS[type] + key);
}

/**
 * Strips key to essentials.
 * 2 usages:
 * - when called from ls*(), this takes a key and strips it based on the
 *   lscache types that we've created.
 * - when called with the following special types:
 *   'url': removes the scheme and domain names
 *   'postId': removes the 'update-'
 *   This is meant to save space, but it's not useful yet as we don't write
 *   out many IDs.
 */
function stripKey(type, key) {
  switch(type) {
    case 'postId':
    case LS_READ:
    case LS_FOLDED:
    case LS_COMMENTS_FOLDED:
    case LS_COMMENTS_UNFOLDED:
    case LS_COMMENTS_READ_COUNT:
    case LS_COMMENTS_READ_COUNT_CHANGED:
      return key.replace(/^update-/, '');
    case 'url':
    case LS_URL_LIST_LAST_UNFOLDED:
      return key.replace(/^https:\/\/plus\.google\.com/, '');
    default:
      return key;
  }
}

/**
 * Resets persisted history
 */
function resetHistory() {
  for (var i = 0; i < localStorage.length; i++) {
    var storedKey = localStorage.key(i);
    if (storedKey.indexOf(LS_HISTORY_) === 0) {
      localStorage.removeItem(storedKey);
    }
  }
}

/****************************************************************************
 * Utility
 ***************************************************************************/

/**
 * For debugging
 */
function info() {
  if (DEBUG) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('g+me');
    console.log.apply(console, args);
  }
}
function debug() {
  if (DEBUG) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('g+me');
    console.debug.apply(console, args);
  }
}
function warn() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('g+me');
  console.warn.apply(console, args);
  console.trace();
}
function error() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('g+me');
  console.error.apply(console, args);
  console.trace();
}

/**
 * Unescape HTML entities.
 * WARNING: make sure that you add the result careful, e.g. with jQuery.text(),
 * to avoid XSS security problems.
 */
function htmlDecode(str) {
  return $("<div/>").html(str).text();
}

/**
 * Mod jQuery
 */
$.fn.reverse = [].reverse;

/**
 * Check if should enable on certain pages
 * @param $subtree: Optional, to force checking of DOM in cases when the
 *   href is not yet correct and the Ajax updates are pending
 */
function isEnabledOnThisPage($subtree) {
  if (typeof $subtree == 'undefined')
    return ! DISABLED_PAGES_URL_REGEXP.test(window.location.href);

  for (var i in DISABLED_PAGES_CLASSES) {
    if (DISABLED_PAGES_CLASSES.hasOwnProperty(i)) {
      if ($subtree.hasClass(DISABLED_PAGES_CLASSES[i]) ||
          $subtree.find('.' + DISABLED_PAGES_CLASSES[i]).length) {
        debug("isEnabledOnThisPage: disabling because match on " + i);
        return false;
      }
    }
  }
  return true;
}

/**
 * Shorten date text to give more room for snippet
 * FIXME: English-specific
 */
function abbreviateDate(text) {
  return text.replace(DATE_JUNK_REGEXP, '').replace(DATE_LONG_REGEXP, getMessage('gplus_dateLongSuffixReplacement')).replace(/ PM/, 'p').replace(/ AM/, 'a').replace(yearRegexp, '');
}

/**
 * Iterates through all the comment containers and calls the callback
 */
function foreachCommentContainer($subtree, callback) {
  _C_COMMENT_CONTAINERS.forEach(function(i) {
    var $container = $subtree.find(i);
    if ($container.length)
      callback($container);
  });
}

/**
 * Iterates through all the posts and calls the callback
 */
function foreachItem(callback) {
  var $stream = $(_C_STREAM);
  if (! $stream.length) {
    error("forEachItem: Can't find stream");
    return;
  }
  
  $stream.find(_C_ITEM).each(function(i, item) {
    callback($(item));
  });
}

/**
 * Queries background page for options
 */
function getOptionsFromBackground(callback) {
  chrome.extension.sendRequest({action: 'gpmeGetSettings'}, function(theSettings) {
    settings = theSettings;
    displayMode = settings.nav_global_postsDefaultMode;
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
  var result = false;
  // Detect fixed gbar for compatibility (with "Replies and more for Google+",
  // Usability Boost, and Google+ Ultimate)
  var $gbar = $(_ID_GBAR);
  if ($gbar.length && $gbar.parent().css('position') == 'fixed') {
    result = true;
  } else {
    // Detect for Google+ Tweaks
    var styles = window.getComputedStyle($gbar.get(0));
    if (styles.position == 'fixed')
      result = true;
  }
  return result;
}

/**
 * Returns true if header bar (the part below Gbar) is fixed in place
 */
function isHeaderBarFixed() {
  // Detect fixed gbar for compatibility (with "Google+ Ultimate" and "Google+ Tweaks")
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

/**
 * Returns the height of a folded item, i.e. gpme-title-folded
 */
function foldedItemHeight() {
  return settings.nav_summaryLines * ITEM_LINE_HEIGHT + FOLDED_ITEM_OUTER_HEIGHT_EXTRAS;
}

/**
 * Update the folding status maybe title of an SGP post in the cache
 */
function updateCachedSgpItem($item, $titleContent) {
  var id = $item.attr('id');
  if (settings.nav_compatSgp && settings.nav_compatSgpCache && id.substring(0,9) == ID_SGP_POST_PREFIX ) {
    var $copy = $sgpCachedItems[id];
    if (typeof $copy !== 'undefined') {
      if (isItemFolded($item)) {
        $copy.addClass('gpme-folded');
        $copy.removeClass('gpme-unfolded');
        $copy.children('gpme-post-wrapper').hide();
      } else {
        $copy.addClass('gpme-unfolded');
        $copy.removeClass('gpme-folded');
        $copy.children('gpme-post-wrapper').show();
      }
      if (settings.nav_compatSgpComments) {
        if (areItemCommentsFolded($item)) {
          $copy.addClass('gpme-comments-folded');
          $copy.removeClass('gpme-comments-unfolded');
        } else {
          $copy.addClass('gpme-comments-unfolded');
          $copy.removeClass('gpme-comments-folded');
        }
      }

      // Preserve the popup settings
      $copy.children('.gpme-post-wrapper').attr('style', $item.children('.gpme-post-wrapper').attr('style'));

      if (typeof $titleContent != 'undefined') {
        $copy.find('.gpme-title-folded').empty().append($titleContent.clone(true, true)).attr('gpme-has-content', 'true');
      }
    }
  }
}

/**
 * Returns height of scrollable element including hidden areas due to overflow
 * From comments in http://api.jquery.com/outerHeight/
 */
jQuery.fn.outerScrollHeight = function(includeMargin) {
  var element = this[0];
  var jElement = $(element);
  var totalHeight = element.scrollHeight; //includes padding
  //totalHeight += parseInt(jElement.css("border-top-width"), 10) + parseInt(jElement.css("border-bottom-width"), 10);
  //if(includeMargin) totalHeight += parseInt(jElement.css("margin-top"), 10) + parseInt(jElement.css("margin-bottom"), 10);
  totalHeight += jElement.outerHeight(includeMargin) - jElement.innerHeight();
  return totalHeight;
};
/*
jQuery.fn.outerScrollWidth = function(includeMargin) {
  var element = this[0];
  var jElement = $(element);
  var totalWidth = element.scrollWidth; //includes padding
  //totalWidth += parseInt(jElement.css("border-left-width"), 10) + parseInt(jElement.css("border-right-width"), 10);
  //if(includeMargin) totalWidth += parseInt(jElement.css("margin-left"), 10) + parseInt(jElement.css("margin-right"), 10);
  totalWidth += jElement.outerWidth(includeMargin) - jElement.innerWidth();
  return totalWidth;
};
*/

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
 * Responds to user click on browser action icon
 */
function onBrowserActionClick() {
  info("event: browser action icon was clicked");
  click($(_ID_STATUS));
}

/**
 * Responds to changes in the history state.
 * NOTE: Will not be called in PARANOID Edition
 */
function onTabUpdated() {
  info("event: Chrome says that tab was updated");

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
  info("event: DOMNodeInserted within onContentPaneUpdated");

  var $subtree = $(e.target);
  if (! isEnabledOnThisPage($subtree))
    return;

  updateAllItems($subtree);
}

/**
 * Responds to DOM updates from G+ to handle incoming items.
 * Calls updateItem()
 */
function onItemInserted(e) {
  if (! isEnabledOnThisPage())
    return;

  info("event: DOMNodeInserted of item into stream");
  debug("onItemInserted: DOMNodeInserted for item id=" + e.target.id + " class='" + e.target.className);
  updateItem($(e.target));

  // We call this manually because otherwise it only happens on interactive
  // folding/unfolding.
  updateContentPaneButtons();
}

/**
 * Responds to DOM updates from SGPlus which refreshes very frequently and broadly.
 * We use several tricks to make up for its inefficiencies:
 * - Since it consumes all the CPU while it refreshes, we want to do our
 *   refreshes a bit later to make the browser more responsive
 * - We cache our enhanced DOM which shouldn't change
 */
function onSgpItemInserted(e) {
  if (! isEnabledOnThisPage())
    return;

  //trace("event: DOMNodeInserted of SGP post into stream");

  // This event results from our inserting our cached DOM
  if (e.target.className.indexOf('gpme-enh') >= 0)
    return;
  
  // Try to find cached DOM
  if (settings.nav_compatSgpCache &&
      typeof e.target.id !== 'undefined' && e.target.id && $sgpCachedItems.hasOwnProperty(e.target.id)) {
    //debug("onSgpItemInserted: hitting cache id=" + e.target.id);
    var $item = $(e.target);
    var $newItem = $sgpCachedItems[e.target.id].clone(true, true);
    $newItem.insertAfter($item);
    $newItem.children('.gpme-post-wrapper').append($item.children());

    // Hide the item and give SGPlus time to use it to insert the next post, and then
    // we can nuke it.
    // "FYI, what I do is to keep the last inserted post stashed as a variable
    // and then use the insertBefore method to insert the next one."
    $item.hide().attr('gpme-nukeme', '1');
    setTimeout(function() {
      $item.remove();
    }, 50);

  } else { // Otherwise, we'll enhance later
    // Get rid of any ongoing timers
    if (sgpUpdateTimer !== null)
      clearTimeout(sgpUpdateTimer);

    // Hide the item until we can enhance it
    $(e.target).hide();

    // Postpone our processing for a little
    sgpUpdateTimer = setTimeout(function() { enhanceAllSgpPosts($(e.target.parentNode)); }, 1500);
  }
}

/**
 * Responds to DOM updates from G+ to handle incoming menus and other
 * similar things that need to be put in the post wrapper
 */
function onItemDivInserted(e) {
  if (! isEnabledOnThisPage())
    return;

  //trace("event: DOMNodeInserted of menu into post");
  // We want to make sure the menu is inserted in the right place,
  // not only so that the position is correct in the popup, but also
  // for Google+ Tweaks to insert its mute button in the right place
  var $target = $(e.target);
  $target.parent().children('.gpme-post-wrapper').append($target);
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
function onTitleClick(e) {
  var $item = $(this).closest(_C_ITEM);
  debug("onTitleClick: " + $item.attr('id'));

  toggleItemFolded($item, true);
  //e.stopImmediatePropagation();
}

/**
 * Responds to clicks on the comment count
 */
function onCommentCountClick(e) {
  info("onCommentCountClick");
  markItemAsRead($(this).closest(_C_ITEM));
}

/**
 * Responds to clicks on mute button
 */
function onMuteClick(e) {
  info("onMuteClick");
  toggleItemMuted($(this).closest(_C_ITEM));
}

/**
 * Responds to clicks on mark-read button
 */
function onMarkReadClick(e) {
  info("onMarkReadClick");
  markItemAsRead($(this).closest(_C_ITEM));
}

/**
 * Responds to click on post titlebar.
 * Calls toggleItemFolded()
 */
function onCommentTitleClick() {
  var $item = $(this).closest(_C_ITEM);
  debug("onCommentTitleClick: " + $item.attr('id'));

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
  // Just to make sure coz we have some user reports despite the above checks
  var contentEditable = e.target.getAttribute('contenteditable');
  if (typeof contentEditable !== 'undefined' && contentEditable !== null && contentEditable !== '')
    return;
  contentEditable = e.target.getAttribute('g_editable');
  if (typeof contentEditable !== 'undefined' && contentEditable !== null && contentEditable !== '')
    return;

  /*
  // Start catching key sequences
  // 71 = 'g'
  if (e.which == 71) {
    setTimeout
  }
  */

  // Skip all these modifiers
  // TODO: Is there a jQuery plugin for this?
  if ((e.which == 38 || e.which == 40 || e.which == 67 || e.which == 73 || e.which == 77 || e.which == 79 || e.which == 85) && (e.ctrlKey || e.altKey || e.metaKey) ||
      (e.which != 38 && e.which != 40 && e.which != 67 && e.which != 73 && e.which != 77 && e.which != 79 && e.which != 85) && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey))
    return;

  var itemHasFocus =
    document.activeElement !== null && document.activeElement.tagName !== 'BODY' &&
    document.activeElement.id !== null && document.activeElement.id.substring(0,7) == 'update-';

  // First, try the activeElement instead of C_SELECTED because it's already set before the
  // scroll; but if that fails (e.g. when the user cancels the editing of a comment
  // or clicks on area outside of contentpane), then we go look at C_SELECTED
  var $selectedItem = itemHasFocus ? $(document.activeElement) : $(_C_SELECTED);

  // Use a key code that works with a switch statement
  var key = e.which + (e.shiftKey ? 1000 : 0);

  // If we still don't have a selected item, then e.g. the page must have just loaded,
  // so just pick the first item.
  if (! $selectedItem.length) {
    $selectedItem = $(_C_ITEM).filter(':first');
    if ($selectedItem.length) {
      switch (key) {
        case 80: // 'p'
        case 78: // 'n'
          click($selectedItem);
          break;
        case 1038: // shift-up
        case 1040: // shift-down
        case 73: // 'i'
        case 85: // 'u'
          navigateUnfolding($selectedItem);
          break;
        default: break;
      }
    }
    return;
  }

  var $sibling, $moreButton;
  switch (key) {
    case 13: // <enter>
      // If user hits <enter>, we'll open so that they can type a comment
      if (! isItemMuted($selectedItem) && isItemFolded($selectedItem))
        toggleItemFolded($selectedItem);
      break;
    case 1073: // shift-I, like Gmail
      markItemAsRead($selectedItem);
      break;
    case 1085: // shift-U, like Gmail
      markItemAsUnread($selectedItem);
      break;
    case 77: // 'm', like Gmail
    case 1077: // shift-M; shift for reversing direction is similar to shift-SPACE
      toggleItemMuted($selectedItem, e.shiftKey ? 'up' : 'down');
      break;
    case 67: // 'c'
    case 1067: // shift-c
      if (! isItemFolded($selectedItem)) {
        // For shift-C we want to unfold comments > "Expand" long comments & get more comments >
        //   "Expand" long comments & get older comments > "expand" long comments
        if (e.shiftKey) {
          if (areItemCommentsFolded($selectedItem)) {
            toggleCommentsFolded($selectedItem);
          } else {
            expandComments($selectedItem);
          }
        } else {
          // For 'c' we want to unfold or fold comments 
          toggleCommentsFolded($selectedItem);
        }
      }
      break;
    case 79: // 'o', like Greader
      if (! isItemMuted($selectedItem)) {
        toggleItemFolded($selectedItem);
        if (! isItemFolded($selectedItem))
          scrollToTop($selectedItem);
          // NOTE: if folded, we don't want to scroll to top.
          // and toggleItemFolded already scrolls into view.
      }
      break;
    case 86: // 'v', a bit like GReader
      openLinkInContent($selectedItem);
      break;
    case 1079: // shift-O
      if (! isItemMuted($selectedItem) && ! isItemFolded($selectedItem)) {
        togglePostExpansion($selectedItem);
      }
      break;
    case 80: // 'p', like Greader
      hideAnyPostItemPreview();
      $sibling = getPrevItem($selectedItem);
      if ($sibling.length) {
        click($sibling);
        // NOTE: G+ already scrolls everything for us
      }
      break;
    case 78: // 'n', like Greader
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
    //case 1032: // shift-space, like Greader
    //case 38: // up (restrict use of up only when item has focus)
    case 1038: // shift-up
    case 73: // 'i', similar to what 'k' would be in Greader
      if (key != 38 || itemHasFocus) {
        $sibling = getPrevItem($selectedItem);
        if ($sibling.length) {
          if (e.shiftKey)
            navigateUnfolding($sibling, $selectedItem);
          else
            // We want to navigate after the browser has responded to up/down
            setTimeout(function() { navigateUnfolding($sibling, $selectedItem); }, 0);
        }
      }
      break;
    //case 32: // space, like Greader.
    //case 40: // down (restrict use of up only when item has focus)
    case 1040: // shift-down
    case 85: // 'u', similar to what 'j' would be in Greader
      if (key != 40 || itemHasFocus) {
        $sibling = getNextItem($selectedItem);
        if ($sibling.length) {
          if (e.shiftKey)
            navigateUnfolding($sibling, $selectedItem);
          else
            // We want to navigate after the browser has responded to up/down
            setTimeout(function() { navigateUnfolding($sibling, $selectedItem); }, 0);
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
    foldItem({interactive: true}, $previousItem);

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
    if (localStorage.hasOwnProperty(i) && i.substring(0,5) == 'gpme_')
      localStorage.removeItem(i);
  }

  getOptionsFromBackground(function() {
    // If mode has changed
    debug("onResetAll: oldMode=" + oldMode + " newMode=" + displayMode);
    if (typeof(oldMode) == 'undefined' || displayMode != oldMode)
      refreshAllFolds();
  });
}

/**
 * Responds to scrolling events
 */

function onScroll(e) {
  debug("event: scrolling");
  // Figure out which item is at the top
  var $body = $('body');
  var x = $body.width() / 2;
  var el = document.elementFromPoint(x, 0);
  var $item = $(el).closest(_C_ITEM);

  if ($item.length) {
    console.log("Item id=" + $item.attr('id'));
  }
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
    styleNode.appendChild(document.createTextNode('.' + C_GPME_COMMENTCOUNT_NOHILITE + ' > .gpme-comment-count-bg' + ' { ' +
      hardcodeCoordsNohilite($statusNode) + ' } '));
    if (! statusOff)
      $statusNode.removeClass(C_STATUS_BG_OFF);
  } else {
    // Sometimes this happens with G+ for some reason.  Happened at times when I was
    // reloading a profile page.
    error("injectCSS: Can't find status bg node.");
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
    styleNode.appendChild(document.createTextNode('.' + C_GPME_COMMENTCOUNT_NOHILITE + ' > .gpme-comment-count-fg' + ' { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    if (! statusOff)
      $statusNode.removeClass(C_STATUS_FG_OFF);
  } else {
    // Sometimes this happens with G+ for some reason.  Happened at times when I was
    // reloading a profile page.
    error("injectCSS: Can't find status fg node.");
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
    var id = lsGet(LS_URL_LIST_LAST_UNFOLDED, window.location.href);
    if (id !== null) {
      var $item = $('#' + id);
      //debug("onModeOptionUpdated: last open id=" + id + " $item.length=" + $item.length);
      if ($item.length == 1) {
        unfoldItem({interactive: false}, $item);
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
  
  // Update all items
  // Default to updating all divs in contentpane,
  // but sometimes we know which one was just inserted by
  // an Ajax refresh
  ( typeof $subtree != 'undefined' ? $subtree : $(_C_STREAM) ).find(_C_ITEM).each(function(i, item) {
    debug("updateAllItems #" + i);
    i++;
    updateItem($(item));
  });

  // If list mode, make sure the correct last opened entry is unfolded, but
  // only when we know that window.location.href is correct
  if (typeof $subtree == 'undefined' && displayMode == 'list')
    unfoldLastOpenInListMode();

  // Update the buttons accordingly
  updateContentPaneButtons($subtree);
}

/**
 * Enhance all the SGP items in the current page
 */
function enhanceAllSgpPosts($stream) {
  $stream.children(_C_ITEM + '[id^="' + ID_SGP_POST_PREFIX + '"]:not(.gpme-enh):not([gpme-nukeme])').each(function(i, item) {
    debug("enhanceAllSgpPosts #" + i);
    i++;
    var $item = $(item);
    updateItem($item);

    // We have to show because we temporarily hid in onSgpItemInserted()
    $item.show();
    //console.debug("enhanceAllSgpPosts inserting id=" + item.id, $item);

    // Cache the DOM for re-use
    if (settings.nav_compatSgpCache) {
      $item = $item.clone(true, true);
      $item.children('.gpme-post-wrapper').children(':not([class^="gpme-"])').remove();
      $sgpCachedItems[item.id] = $item;
    }
  });
}

/**
 * Updates fold/unfold appropriately
 */
function updateItem($item, attempt) {
  var id = $item.attr('id');
  debug("updateItem: " + id);

  var canHaveComments = true;
  // If this is SGPlus post
  var isSgpPost = false;
  if (settings.nav_compatSgp) {
    isSgpPost = $item.hasClass(C_SGP_UPDATE);
    if (isSgpPost)
      canHaveComments = settings.nav_compatSgpComments ? $item.hasClass(C_SGP_UPDATE_FB) : false;
  }

  var enhanceItem = ! $item.hasClass('gpme-enh');

  if (enhanceItem) {
    // Add titlebar
    // For Tweak, we also need the menu in there, not just the guts
    //var $itemGuts = $item.children(_C_ITEM_GUTS);
    var $itemGuts = $item.children('div:not(' + _C_ITEM_GUTS_PLACEHOLDER + ')');
    if (! isSgpPost && ! $itemGuts.length) {
      // The content comes a bit later
      if ($item.find(_C_ITEM_GUTS_PLACEHOLDER).length) {
        if (typeof attempt === 'undefined')
          attempt = 0;
        if (attempt < 29) {
          setTimeout(function() { updateItem($item, attempt + 1); }, 100 );
        } else {
          error("updateItem: Can't get any content within 3 seconds. Giving up");
        }
      } else {
        error("updateItem: Can't find content of item " + id + " hits=" + $itemGuts.length);
        console.error($item.get(0));
      }
      return;
    }
    // NOTE: we have to change the class before inserting or we'll get more
    // events and infinite recursion if we listen to DOMSubtreeModified.
    //debug("updateItem: enhancing");
    $item.addClass('gpme-enh');

    var $titlebar = $titlebarTpl.clone(true);
    $titlebar.insertBefore($itemGuts.first());

    // Insert container for post content so that we can turn it into an instant
    // preview
    var $wrapper = $postWrapperTpl.clone(true).insertAfter($titlebar);
    $wrapper.append($itemGuts);

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

      if (canHaveComments) {
        var $comments = $item.find(_C_SGP_COMMENT);
        if ($comments.length) {
          $commentbar = $commentbarTpl.clone(true);
          $commentbar.insertBefore($comments.first());
          $wrapper = $commentsWrapperTpl.clone().insertAfter($commentbar).append($comments);
        }
      }
    }

    // Add hover event handler
    $item.hoverIntent({
      handlerIn: showPreview, // function = onMouseOver callback (REQUIRED)    
      delayIn: 400, // number = milliseconds delay before onMouseOver
      handlerOut: hidePreview, // function = onMouseOut callback (REQUIRED)    
      delayOut: 350, // number = milliseconds delay before onMouseOut    
      immediateHandlerIn: showTopCollapseBar, // G+me-specific functionality
      immediateHandlerOut: hideTopCollapseBar // G+me-specific functionality
    });
  }

  // Refresh opacity of titlebar
  var $unfoldTitlebar = $item.find('.gpme-title-unfolded');
  if (settings.nav_showTopCollapseBarWhen == 'always') {
    $unfoldTitlebar.css('opacity', 1);
  } else {
    $unfoldTitlebar.css('opacity', 0);
  }

  // Refresh fold of post
  var itemFolded = false;
  if (displayMode == 'list') {
    // In paranoid mode, there's no way to know to re-fold the tentatively open item.
    // So we fold everything.
    // NOTE: unfoldLastOpenInListMode() will still work when first loading, just not
    // during ajax navigation
    if (PARANOID) {
      foldItem({interactive: false}, $item);
      itemFolded = true;
    } else {

      // Check if it's supposed to be unfolded
      // NOTE: the href may be incorrect at this point if the user is clicking on a new
      // stream link and the updates are coming in through AJAX *before* a tabUpdated event
      var lastOpenId = lsGet(LS_URL_LIST_LAST_UNFOLDED, window.location.href);

      if (lastOpenId !== null && id == lastOpenId) {
        unfoldItem({interactive: false}, $item);
        click($item);

        // Record this operation because we may have to undo it once location.href is
        // known to be correct
        $lastTentativeOpen = $item;
      } else {
        foldItem({interactive: false}, $item);
        itemFolded = true;
      }
    }
  } else if (displayMode == 'expanded') {
    itemFolded = lsGet(LS_FOLDED, id);
    // Fold if necessary
    if (itemFolded !== null) {
      foldItem({interactive: false}, $item);
    } else {
      unfoldItem({interactive: false}, $item);
    }
  }

  // Expanded mode has a bottombar
  if (displayMode == 'expanded') {
    if (! $item.children('.gpme-bottombar').length)
      $item.append($bottombarTpl.clone(true));
  }

  // Refresh fold of comments if visible
  if (! itemFolded && canHaveComments) {
    refreshCommentsFold(id, $item);
  }

  // Start listening to updates to comments.
  // We need to listen all the time since comments can come in or out.
  if (enhanceItem && ! isSgpPost) {
    // We must have one throttle function per comment section within item.
    var commentsUpdateHandler = $.throttle(200, 50, function(e) { onCommentsUpdated(e, $item); });

    //var commentsUpdateHandler = function(e) { onCommentsUpdated(e, $item) };
    foreachCommentContainer($item.find('.gpme-comments-wrapper'), function($container) {
      // NOTE: when a truncated comment is expanded, we don't get a DOMAttrModified event
      // (or a non-zero e.attrChange) for some reason even though the class changes.
      $container.bind('DOMSubtreeModified', function(e) {
        // We have to filter out junk before we call the throttle function; otherwise
        // the last callback call will have junk arguments.
        var id = e.target.id;
        // Some optimizations, especially to prevent lag when typing comments.
        // But we are interested in the ':4a.editor' event which happens in the beginning and end
        // of comment editing
        if (id && id.charAt(0) == ':' && id.indexOf('.editor') < 0 || ! isEnabledOnThisPage())
          return;

        // Process when target has an id (it's probably a comment),
        // or the class is one of the divs we want
        var className = e.target.className;
        if (! id && ! COMMENT_MODIFIED_REGEXP.test(className))
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
 * Folds all items.
 * Called after user interaction.
 * (only makes sense in expanded mode)
 */
function foldAllItems() {
  foreachItem(function($item) {
    foldItem({interactive: true, batch: true, animated: false}, $item);
  });

  updateContentPaneButtons();
}

/**
 * Unfolds all items.
 * Called after user interaction.
 * (only makes sense in expanded mode)
 */
function unfoldAllItems() {
  if (displayMode != 'expanded') {
    error("unfoldAllItems: can only unfold in expanded mode");
    return;
  }
  
  foreachItem(function($item) {
    unfoldItem({interactive: true, batch: true, animated: false}, $item);
  });

  updateContentPaneButtons();
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
  var $post = $item.children('.gpme-post-wrapper');
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
      var lastOpenId = lsGet(LS_URL_LIST_LAST_UNFOLDED, window.location.href);
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
            lastItemHeightLoss = $lastItem.outerHeight() - foldedItemHeight();
            lastItemOffset = $lastItem.offset().top;
          }

          // Fold the last opened item
          foldItem({interactive: true, animated: animated}, $lastItem);
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
      lsRemove(LS_URL_LIST_LAST_UNFOLDED, window.location.href);
    } else {
      // Unfold the selected item
      unfoldItem({interactive: true, animated: animated}, $item, $post);
      // Since this thread is a result of an interactive toggle, we record last open
      debug("toggleItemFolded: href=" + window.location.href);
      debug("toggleItemFolded: gpme_post_last_open_" + window.location.href + "->id = " + id);
      lsSet(LS_URL_LIST_LAST_UNFOLDED, window.location.href, id);
    }

  } else { // For 'toggle' action, if the item is unfolded, we fold it.

    if (isItemMuted($item)) {
      if (animated)
        predictedItemHeight = $item.height();
    } else {
      // Predict the height of the item
      if (animated)
        predictedItemHeight = foldedItemHeight();

      // Fold the selected item
      foldItem({interactive: true, animated: animated}, $item, $post);

      // Since this thread is a result of an interactive toggle, we delete last open
      if (lsGet(LS_URL_LIST_LAST_UNFOLDED, window.location.href) == id)
        lsRemove(LS_URL_LIST_LAST_UNFOLDED, window.location.href);
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
    predictedBodyHeight = $body.height() - lastItemHeightLoss + (predictedItemHeight - foldedItemHeight());

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
 * @param $post: Optional if you have it
 */
function foldItem(options, $item, $post) {
  // Legacy aliases
  var interactive = options.interactive;
  var animated = options.animated; // Optional

  if (typeof($post) == 'undefined') {
    $post = $item.children('.gpme-post-wrapper');
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
    lsSet(LS_FOLDED, id, 1);
  // Persist for both list/expanded mode
  if (interactive)
    lsSet(LS_READ, id, 1);

  // Visual changes
  //$post.fadeOut().hide(); // This causes race-condition when double-toggling quickly.
  if (animated)
    $post.slideUp('fast', function() {
      $item.addClass('gpme-folded');
      $item.removeClass('gpme-unfolded');
      if (interactive) {
        updateCachedSgpItem($item);
        if (! options.batch)
          updateContentPaneButtons();
      }
    });
  else {
    $post.hide();
    $item.addClass('gpme-folded');
    $item.removeClass('gpme-unfolded');
    if (interactive) {
      updateCachedSgpItem($item);
      if (! options.batch)
        updateContentPaneButtons();
    }
  }
  //debug("foldItem: id=" + id + " folded=" + $item.hasClass('gpme-folded') + " post.class=" + $post.attr('class') + " should be folded!");

  var canHaveComments = true;
  // If this is SGPlus post
  var isSgpPost = false;
  if (settings.nav_compatSgp) {
    isSgpPost = $item.hasClass(C_SGP_UPDATE);
    if (isSgpPost)
      canHaveComments = settings.nav_compatSgpComments ? $item.hasClass(C_SGP_UPDATE_FB) : false;
  }

  // If interactive folding and comments are showing, record the comment count
  var commentCount = 0;
  if (canHaveComments) {
    commentCount = countComments($item.find('.gpme-comments-wrapper'));
    if (interactive && ! areItemCommentsFolded($item))
      saveSeenCommentCount(id, commentCount);
  }

  var $snippet;
  // Attached or pending title summary
  var $subtree;

  // If not yet done, put hover event handler and put content in titlebar (summary)
  var $title = $subtree = $item.find('.gpme-title-folded');
  if (typeof $title.attr('gpme-has-content') == 'undefined') {
    $title.attr('gpme-has-content', 'true');

    // NOTE: don't just take the first div inside post content title because
    // sometimes the hangout 'Live' icons is there
    var $srcTitle = $item.find(_C_ITEM_GUTS + " " + (isSgpPost ? _C_SGP_TITLE : _C_TITLE));
    if ($srcTitle.length !== 1) {
      error("foldItem: can't find (unique) post content title node");
      error($item);
    } else {
      // Check if the permissions are limited
      // Other possibilities: Public, Extended circles
      var $perms = $srcTitle.find(_C_PERMS);
      if ($perms.length && $perms.text() == getMessage('gplus_permsLimited'))
        $title.addClass('gpme-perms-limited');

      var $clonedTitle = $titleTpl.clone(true);
      var $sender = $titleSenderTpl.clone().click(onTitleClick);
      $clonedTitle.append($sender);
      var $clonedTitleName = $srcTitle.find(_C_NAME).clone();
      $sender.append($clonedTitleName);

      var $srcPhoto = $post.find(S_PHOTO);
      if ($srcPhoto.length)
        $sender.prepend($srcPhoto.clone());
      
      // Insert "mobile"/"check-ins" icons
      var $source = $srcTitle.find(S_SOURCE);
      if ($source.length) {
        // Maybe FIXME: English-only, but so far Google uses only English
        if ($source.text() == 'Google Check-ins')
          $sender.append($checkinIconTpl.clone());
        else if ($source.text() == 'Mobile')
          $sender.append($mobileIconTpl.clone());
        else if ($source.text() == 'Hangout')
          // FIXME: haven't checked what happens when hangout ends
          $clonedTitle.append($post.find(_C_HANGOUT_LIVE_ICON).length ?
            $hangoutLiveIconTpl.clone() :
            $hangoutPastIconTpl.clone()); // https://plus.google.com/116805285176805120365/posts/8eJMiPs5PQW
        else if ($source.text() == 'Photos')
          /* We already picked out photos.  Move code into here?  */ true;
        else if ($source.text() == 'Game Update')
          $sender.append($gameIconTpl.clone());
        else // For non-English
          $clonedTitle.append($source.text());
      }

      var $itemGuts = $post.children(_C_ITEM_GUTS);
      var $content = $itemGuts.children(isSgpPost ? _C_SGP_CONTENT : _C_CONTENT);
      if (! $content.length) {
        error("foldItem: Can't find the item guts or contents for id=" + id);
      } else {

        // Quoted sender's photo plus a dash
        $srcPhoto = $itemGuts.find(_C_QUOTED_PHOTO);
        if ($srcPhoto.length)
          $sender.append($titleQuoteTpl.clone()).append($srcPhoto.clone().attr('style', 'margin: 0'));

        // Photos in content?
        // Possibly-multiple images in the content
        //$srcPhoto = $content.find('img').not(_C_QUOTED_PHOTO).not(_C_MAP_IMG).not(_C_QUOTE_IMG);
        $srcPhoto = $content.find(S_CONTENT_IMG);
        if ($srcPhoto.length) {
          if (settings.nav_summaryIncludeThumbnails) {
            var $titleThumbnails = $titleThumbnailsTpl.clone();
            // NOTE: reverse the order coz we're floating them right
            $titleThumbnails.append($srcPhoto.clone().attr('style', ''));
            $clonedTitle.append($titleThumbnails);
          } else {
            $clonedTitle.append($cameraIconTpl.clone().css('float', 'right'));
          }
        }

        // Video in content?
        var $video = $content.find(_C_CONTENT_VIDEO);
        if ($video.length) {
          $clonedTitle.append($videoIconTpl.clone().css('float', 'right'));
        }
        
        if (! $srcPhoto.length && ! $video.length) { // Don't show link if we already have video
          // Link in content?
          var $link = $content.find(_C_CONTENT_LINK);
          if ($link.length) {
            $clonedTitle.append($linkIconTpl.clone().css('float', 'right'));
          }
        }

        // Insert a little dash
        $clonedTitle.append($titleDashTpl.clone());
        
        // Put in snippet, trying differing things
        var classes = isSgpPost ? [
          _C_SGP_TEXT1,
          _C_SGP_TEXT2
        ] : [
          // poster text https://plus.google.com/111091089527727420853/posts/63tRxMQk7rV
          '.el',
          // poster text that is resharing https://plus.google.com/110901814225194449440/posts/Nr651PmEM8d
          // or original poster text https://plus.google.com/111091089527727420853/posts/63tRxMQk7rV
          // (and for one's own post, just "Edit")
          '.uj', // Goes together with next line
          _C_CONTENT_LINK, // poster link (must come after the above, which sometimes it's just "Edit")
          '.cz > .Ar', // hangout text
          '.O-F-Q > a', // photo album caption, title of shared link
          '.r2 > a', // photo caption
          '.P-I-ri-ic', // text of shared link
          '.tgGRJd' // Checkin location https://plus.google.com/111667704476323287430/posts/MBBwSZiy4nb
        ];
        for (var c in classes) {
          $snippet = $post.find(classes[c]);
          if (! $snippet.length)
            continue;

          // We want to ignore link shares that only have the text Edit -- this is one's own posts
          // <span class="a-da-k ez Xq">Edit</span>
          if (classes[c] == '.el' || classes[c] == '.uj') {
            $snippet = $snippet.clone();
            $snippet.find('.Pq').remove();
          }
          var text = $snippet.html().replace(/(<(br|p)\s*\/?>\s*)+/gi, ' \u2022 ').replace(/<\/?[^>]+?>/g, '');
          if (text.match(/[^\s\u2022]/)) {
            if (classes[c] == '.cz > .Ar') {
              // TODO: test in multiple languages (English, Spanish, Chinese ok)
              text = text.replace(/.*?(\d+)/, '$1');
            }
            $snippet = $titleSnippetTpl.clone();
            $snippet.text(htmlDecode(text.substring(0, 500))); // We have to call() to avoid XSS
            $clonedTitle.append($snippet);
            break;
          }
        }

        // If any, move "- Muted" to right after date and before the " - "
        $srcTitle.find(_C_MUTED).clone().insertAfter($clonedTitleName);

        // Inject the summary title
        $title.append($clonedTitle);
        if (isSgpPost && interactive)
          updateCachedSgpItem($item, $clonedTitle);

        // Add comment-count container
        // NOTE: this must be done after injecting the title
        if (canHaveComments)
          $clonedTitle.before($buttonAreaTpl.clone(true));

        // Stop propagation of click so that clicking the name won't do anything
        // NOTE: done here coz it can't be done on a detached node.
        $clonedTitle.find('a').click(function(e) {
          // Doesn't seem to work on the avatar or name
          e.stopImmediatePropagation();
        });

        // Insert timestamp if applicable and if possible
        if (settings.nav_summaryIncludeTime) {

          // The date for G+ posts comes later, so we need to check several times.
          var attempt = 40;
          (function updateDateWhenReady($dateA) {
            attempt--;
            if (typeof $dateA != 'undefined' && $dateA.length && $dateA.get(0).style.display !== 'none' ||
                attempt < 0) {
              var dateText = '';
              if (attempt < 0) {
                error("updateDateWhenReady: gave up on getting the date for id=" + id);
              } else {
                dateText = abbreviateDate($dateA.text());
              }
              // Strip out the A link because we don't want to make it clickable
              // Not only does clicking it somehow opens a new window, but we need
              // the clicking space especially with instant previews
              $sender.after($titleDateTpl.clone().text(dateText)).after($titleDashTpl.clone());

            } else {
              $dateA = $itemGuts.find(isSgpPost ? _C_SGP_DATE : _C_DATE + ' > a');

              if ($dateA.length) {
                // Try again later in a little bit
                setTimeout(function() { updateDateWhenReady($dateA); }, 50);
              } else {
                error("updateDateWhenReady: can't find the source date div");
                error($dateA);
              }
            }
          })();
        }
      }
    }
  }

  // Show as read
  if (lsGet(LS_READ, id))
    $item.addClass('gpme-read');
  else
    $item.removeClass('gpme-read');

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

  if (canHaveComments) {
    // Show possibly-hidden comments so that they appear in the preview (but don't persist)
    var $comments = $item.find('.gpme-comments-wrapper');
    if ($comments.length) {
      $comments.show();
    }

    // Updated the count in the subtree
    updateCommentCount(id, $subtree, commentCount);
  }
}

/**
 * For both list and expanded mode, unfolds the item.
 * @param $post: Optional if you have it
 */
function unfoldItem(options, $item, $post) {
  // Legacy aliases
  var interactive = options.interactive;
  var animated = options.animated; // Optional

  if (typeof($post) == 'undefined') {
    $post = $item.children('.gpme-post-wrapper');
    if ($post.length != 1) {
      // It is possible to not have a proper match during keyboard scrolling
      // (hit 'j' and 'o' in quick succession)
      //debug("unfoldItem: $posts.length=" + $posts.length);
      return false;
    }
  }

  var id = $item.attr('id');
  debug("unfoldItem: id=" + id);

  var canHaveComments = true;
  // If this is SGPlus post
  var isSgpPost = false;
  if (settings.nav_compatSgp) {
    isSgpPost = $item.hasClass(C_SGP_UPDATE);
    if (isSgpPost)
      canHaveComments = settings.nav_compatSgpComments ? $item.hasClass(C_SGP_UPDATE_FB) : false;
  }

  // Persist for expanded mode
  if (interactive && displayMode == 'expanded')
    lsRemove(LS_FOLDED, id);

  // Visual changes
  hidePostItemPreview($item);
  // NOTE: changing of classes must be done after hidePostItemPreview()
  $item.removeClass('gpme-folded');
  $item.addClass('gpme-unfolded');
  if (animated) {
    $post.slideDown('fast', function() {
      if (interactive)
        updateCachedSgpItem($item);
    });
  } else {
    $post.show();
    if (interactive)
      updateCachedSgpItem($item);
  }
  if (interactive && ! options.batch)
    updateContentPaneButtons();

  if (canHaveComments) {
    // NOTE: this must be done after the CSS classes are updated
    refreshCommentsFold(id, $item);

    if (interactive && ! areItemCommentsFolded($item))
      deleteSeenCommentCount(id);
  }

  return true;
}

/**
 * In list mode, unfold the last opened entry, refolding any wrongly unfolded entry
 * NOTE: At this point, location.href may or may not be correct.
 */
function unfoldLastOpenInListMode() {
  //debug("unfoldLastOpenInListMode: href=" + window.location.href);
  var lastOpenId = lsGet(LS_URL_LIST_LAST_UNFOLDED,  window.location.href);

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
    foldItem({interactive: false}, $lastTentativeOpen);
    $lastTentativeOpen = null;
  }

  if (lastOpenId !== null) {
    var $item = $('#' + lastOpenId);
    // It's possible the last open is no longer in the list of posts after a reload
    if ($item.length) {
      // We explicitly unfold in order to fold any previously opened item
      // FIXME: this favors the oldest instead of the most recent opened item
      unfoldItem({interactive: false}, $item);
      click($item);
    }
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
 * @param {jQuery or DOM element} elem
 */
function click(elem) {
  var e;
  if (elem.jquery)
    elem = elem.get(0);

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
 * @param navigate: optional, 'up' or 'down'
 */
function toggleItemMuted($item, navigate) {
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
      $post = $item.children('.gpme-post-wrapper');
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
        $post = $item.children('.gpme-post-wrapper');
        if ($post.length != 1) {
          error("toggleItemMuted: can't find post content for id=" + $item.attr('id'));
        } else {
          $post.show();
        }
      }

      // Now automatically go to the next message, just like in gmail
      // This code is just like for shift-down
      if (navigate == 'up' || navigate == 'down') {
        if (navigate == 'up')
          $sibling = getPrevItem($item);
        else
          $sibling = getNextItem($item);
        if ($sibling.length) {
          navigateUnfolding($sibling, $item, navigate == 'down');
        } else if (navigate == 'down') {
          // If we're at the bottom, trigger the more button
          clickMoreButton();
        }
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
 * We want to unfold comments > get more comments > get older comments.
 * But always check for truncated comments first, to expand.
 */
function expandComments($item) {
  // Regardless of round, we expand whatever long coments are visible
  var $expandLink = $item.find(_C_EXPAND_COMMENT);
  if ($expandLink.length) {
    click($expandLink);
    return;
  }

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

/**
 * Opens any embedded link
 */
function openLinkInContent($item) {
  var urls = [];
  var $links = $item.find(_C_CONTENT_ANY_LINK);
  $links.each(function(i, item) {
    var url = item.getAttribute('href');
    // Ignore duplicates as in https://plus.google.com/103716847685048716973/posts/bKNjwdNUoRB
    if (urls.indexOf(url) < 0) {
      window.open(url); // Force a tab to be opened
      urls.push(url);
    }
  });
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
 * Refreshes the fold state depending on settings and saved history
 */
function refreshCommentsFold(id, $item) {
  if (settings.nav_global_commentsDefaultCollapsed) {
    if (lsGet(LS_COMMENTS_UNFOLDED, id))
      unfoldComments(false, $item);
    else
      foldComments(false, $item);
  } else {
    if (lsGet(LS_COMMENTS_FOLDED, id))
      foldComments(false, $item);
    else
      unfoldComments(false, $item);
  }
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
    if (! settings.nav_global_commentsDefaultCollapsed)
      lsSet(LS_COMMENTS_FOLDED, id, 1);
    lsRemove(LS_COMMENTS_UNFOLDED, id);

    saveSeenCommentCount(id, commentCount);

    // Visual changes
    var shownCommentCount = countShownComments($item);
    var duration = shownCommentCount <= 4 ? 50 : shownCommentCount <= 10 ? 150 : 250;
    var $commentsTitleUnfolded = $item.find('.gpme-comments-title-unfolded');
    $commentsTitleUnfolded.slideUp(duration);
    $comments.css('min-height', '27px').slideUp(duration, function() {
      $item.addClass('gpme-comments-folded');
      $item.removeClass('gpme-comments-unfolded');
      updateCommentbar(id, $item, commentCount);
      updateCachedSgpItem($item);
    });

    // Favor the share line first so there's no unnecessary motion
    var $shareLine = $item.find(_C_SHARE_LINE);
    ($shareLine.length? $shareLine : $item.find('gpme-commentbar')).scrollintoview({ duration: duration, direction: 'y' });

  } else {
    // Visual changes
    $comments.hide();
    $item.addClass('gpme-comments-folded');
    $item.removeClass('gpme-comments-unfolded');
  }

  // If not yet done, put content in titlebar
  var $title = $item.find('.gpme-comments-title-folded');
  if (typeof $title.attr('gpme-comments-has-content') == 'undefined') {
    $title.attr('gpme-comments-has-content', 'true');

    // Add floating comment-count container
    $title.prepend($buttonAreaTpl.clone(true));

    // Insert title/snippet after the fold icon
    $title.append($commentTitleTpl.clone(true));
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
    if (settings.nav_global_commentsDefaultCollapsed)
      lsSet(LS_COMMENTS_UNFOLDED, id, 1);
    lsRemove(LS_COMMENTS_FOLDED, id);

    // Interactive visual changes
    var shownCommentCount = countShownComments($item);
    var duration = shownCommentCount <= 4 ? 50 : shownCommentCount <= 10 ? 150 : 250;
    var $commentsTitleFolded = $item.find('.gpme-comments-title-folded');
    var $commentsTitleUnfolded = $item.find('.gpme-comments-title-unfolded');
    $commentsTitleFolded.hide(); // hide a bit early
    $comments.slideDown(duration, function() {
      $item.removeClass('gpme-comments-folded');
      $item.addClass('gpme-comments-unfolded');
      $commentsTitleFolded.css('display', ''); // Undo the hide above
      // NOTE: updateCommentbar needs to be done after updating classes
      updateCommentbar(id, $item, commentCount);
      $commentsTitleUnfolded.fadeIn('fast');
      updateCachedSgpItem($item);
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

  var $container = $subtree.find(".gpme-comment-count-container");
  var $buttonArea = $container.parent();
  //var $countBg = $container.children(".gpme-comment-count-bg");
  var $countFg = $container.children(".gpme-comment-count-fg");

  // Clear any old timers we may have
  if (lastCommentCountUpdateTimers.hasOwnProperty(id)) {
    clearTimeout(lastCommentCountUpdateTimers[id]);
    delete lastCommentCountUpdateTimers[id];
  }

  // Change background of count
  var seenCount = lsGet(LS_COMMENTS_READ_COUNT, id);
  var seenCountChanged = false;
  // seenCount === null && count > 0 : in list mode, there is no seen count on new folded posts
  // seenCount !== null && count != seenCount : count has changed since last seen
  // 'gpme_post_seen_comment_count_changed_' + id in localStorage : count is the same but was
  //    different before, which means e.g. a comment was deleted and another inserted
  if ((seenCount === null && count > 0 ) || (seenCount !== null && count != seenCount) ||
      (seenCountChanged = lsGet(LS_COMMENTS_READ_COUNT_CHANGED, id))) {
    $container.removeClass(C_GPME_COMMENTCOUNT_NOHILITE);
    $countFg.text(count - (seenCount !== null ? seenCount : 0));
    $container.removeClass('gpme-hide');
    $buttonArea.addClass('gpme-new-comments');

    // Keep track of comment count changes, so that "0" stays red (when
    // someone deletes a comment)
    if (seenCount !== null && ! seenCountChanged) {
      // But give G+ time to quickly move comments from one section to another
      lastCommentCountUpdateTimers[id] = setTimeout(function() {
        debug("lastCommentCountUpdateTimers: setting id=" + id);
        lsSet(LS_COMMENTS_READ_COUNT_CHANGED, id, 1);
        delete lastCommentCountUpdateTimers[id];
      }, 200);
    }
  } else {
    $container.addClass(C_GPME_COMMENTCOUNT_NOHILITE);
    $buttonArea.removeClass('gpme-new-comments');
    if (count) {
      $countFg.text(count);
      $container.removeClass('gpme-hide');
    } else { // If 0, no need to show
      $container.addClass('gpme-hide');
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
 * Update the commentbar's height, more specifically gpme-comments-title-unfolded
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

  var $commentbar = $item.find('.gpme-commentbar');
  var $commentsTitleUnfolded = $item.find('.gpme-comments-title-unfolded');

  // If no comments, no need for a bar
  if (commentCount === 0) {
    $commentbar.hide();
  } else {
    $commentbar.show();
    // If folded, Remove any dynamically-set height
    if (areItemCommentsFolded($item)) {
      $commentsTitleUnfolded.css('height', '');
    } else {
      // Update the height
      // Despite advertisements, jQuery 1.6.2 still cannot calculate
      // height within a hidden tree
      $commentsTitleUnfolded.height($commentWrapper.actual('outerHeight') - 2);
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
  var $comments = $subtree.find(_C_COMMENTS_OLD_COUNT);
  if ($comments.length)
    commentCount += parseTextCount($comments.text());
  commentCount += countShownComments($subtree);
  $comments = $subtree.find(_C_COMMENTS_MORE_COUNT);
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
  /* Why only if not already set?
  // Update the shown comment count, only if not already set.
  var oldCount = lsGet(LS_COMMENTS_READ_COUNT, id);
  if (oldCount === null)
  */
  lsSet(LS_COMMENTS_READ_COUNT, id, commentCount);
  lsRemove(LS_COMMENTS_READ_COUNT_CHANGED, id);
}

/**
 * Deletes seen comment count
 */
function deleteSeenCommentCount(id) {
  // Remove the stored comment count
  lsRemove(LS_COMMENTS_READ_COUNT, id);
  lsRemove(LS_COMMENTS_READ_COUNT_CHANGED, id);
}

/**
 * Mark all items as read
 */
function markAllItemsAsRead() {
  foreachItem(function($item) {
    markItemAsRead($item);
  });

  updateContentPaneButtons();
}

/**
 * Mark item as read
 */
function markItemAsRead($item) {
  var commentCount = countComments($item);
  var id = $item.attr('id');

  // Mark post as read
  lsSet(LS_READ, id, 1);
  $item.addClass('gpme-read');

  // Mark comments as read
  //deleteSeenCommentCount(id);
  saveSeenCommentCount(id, commentCount);
  updateCommentCount(id, $item, commentCount);
}

/**
 * Mark item as unread
 */
function markItemAsUnread($item) {
  var id = $item.attr('id');

  lsRemove(LS_READ, id);
  $item.removeClass('gpme-read');
}

/****************************************************************************
 * Preview popup
 ***************************************************************************/

/**
 * Pops up the preview of the hovered item
 */
function showPreview(e) {
  // Skip depending on options
  if (!( settings.nav_previewEnableInExpanded && displayMode == 'expanded' ||
          settings.nav_previewEnableInList && displayMode == 'list'))
    return;

  var $item = $(this);
  debug("showPreview: this=" + $item.attr('class'));

  if (!$item || ! isItemFolded($item))
    return;

  // Sometimes if you switch windows, there might be some preview remaining
  // that hoverIntent will not catch.
  hideAnyPostItemPreview();

  // Skip if this is a muted item
  if (isItemMuted($item))
    return;

  var $post = $item.children('.gpme-post-wrapper');
  if ($post.length) {
    // Block clicks temporarily
    var $clickWall = $item.find('.gpme-disable-clicks');
    $clickWall.show();
    setTimeout(function() { $clickWall.hide(); } , clickWallTimeout);

    // Enhance with our own commenting links
    if (! $item.hasClass('gpme-preview-enh')) {
      var $commentLink = $item.find(_C_LINK_COMMENT + ',' + _C_FAKEINPUT_COMMENT);
      // NOTE: Comments could be disabled for that post
      if ($commentLink.length) {
        // NOTE: Replies and More incorrectly injects the same 'a-b' class
        // But this code will work for both G+ and Replies and More (if they've
        // injected before the first preview pops up)
        $commentLink.each(function(i, value) {
          var $value = $(value);
          // NOTE: we leave the C_FAKEINPUT_COMMENT so that G+ hides our box when
          // user starts editing
          $value.clone().removeClass(C_LINK_COMMENT).
            addClass('gpme-link-comment').
            click(function() { startCommentInPreview($item, $value); }).
          /* Let's try something else
            // If G+ hides our box, then we have to hide theirs
            bind('DOMAttrModified', function(e) {
              debug("DOMAttrModified e.target.className=" + e.target.className);
              if (e.attrName == 'display')
                $value.css(e.attrName, e.newValue);
            }).
            */
            insertBefore($value);
        });
        $item.addClass('gpme-preview-enh');
      }
    }

    var fixedHeight = fixedBarsHeight();
    var overlappingHeight = overlappingBarsHeight();

    // Move to the right edge and as far up as possible
/* Disabled: we now move based on right-edge instead of left-edge
    // 430px = (31+60+26) cropping + 135 shriking + 195 width of sidebar - 17 slack
    // NOTE: need lots of slack coz the horizontal scrollbar flashes on OSX for some rason
    $post.css('left',
      '' + (430 + Math.max(0, Math.floor((document.body.clientWidth - 960) / 2))) + 'px');
*/
    // We give slack of 10 coz otherwise you get the horizontal bar flashing on Chrome OSX.
    // The width of the popup is reduced by 8 in CSS to leave a bit of a gap between posts and the popup so
    // that the popup triangle can nicely overlay a big commentcount.
    $post.css('right', '' +
      -Math.min($post.outerWidth() + 8,
        ($(document).width() - $(window).scrollLeft() - $item.get(0).getBoundingClientRect().right - 10)) +
      'px');
    $post.css('left', 'auto');
    var offsetY = Math.max(POST_WRAPPER_PADDING_TOP,
      Math.min($post.outerHeight() - TRIANGLE_HEIGHT - POST_WRAPPER_PADDING_BOTTOM,
        $item.offset().top -
         Math.max(document.body.scrollTop + fixedHeight, overlappingHeight) - GAP_ABOVE_PREVIEW));
    $post.css('top', '' + (-offsetY) + 'px');
    //$post.css('max-height', '' + (window.innerHeight - 14) + 'px');
    var $triangle = $post.children('.gpme-preview-triangle');
    $triangle.css('top',  '' + offsetY + 'px');

    // Show the preview
    $post.show();
    $lastPreviewedItem = $item;

    // Change the max-height of the post content
    var $itemGuts = $post.children(_C_ITEM_GUTS);
    if (! $itemGuts.length) {
      error("showPreview: Can't find post content style class");
    } else {
      $itemGuts.css(
        'max-height',
          '' + (window.innerHeight - Math.max(fixedHeight, overlappingHeight - document.body.scrollTop) -
                GAP_ABOVE_PREVIEW * 2 - POST_WRAPPER_PADDING_TOP - POST_WRAPPER_PADDING_BOTTOM) +
          'px');
      // Prevent mousewheel from scrolling entire page when hitting the ends
/*
      $itemGuts.mousewheel(function(e, delta) {
        $itemGuts.scrollTop($itemGuts.scrollTop() - delta * 5);
        return false; // This is what we're after
      });
*/

      // Workaround for scroll-position loss bug in Chrome
      // http://code.google.com/p/chromium/issues/detail?id=36428
      var lastScrollTop = $itemGuts.attr('gpme-last-scrolltop');
      if (typeof lastScrollTop !== undefined && lastScrollTop > 0 ) {
        // NOTE: this must be done after show()
        $itemGuts.scrollTop(lastScrollTop);
      }
    }

    // Only show the scrollbar when the mouse is inside
    $post.hover(showPreviewScrollbar, hidePreviewScrollbar);

    updateCachedSgpItem($item);
  } else {
    error("showPreview: Can't find post wrapper");
    error($item);
  }
}

/**
 * This indirect link prevents G+ from scrolling the page (the original direct link
 * does the scrolling).
 * We scroll the preview pane instead.
 */
function startCommentInPreview($item, $origLink) {
  var $itemGuts = $item.children('.gpme-post-wrapper').children(_C_ITEM_GUTS);

  // Hide so that there's no scrolling
  $itemGuts.hide();
  click($origLink);
  $itemGuts.show();
  // Scroll to bottom
  $itemGuts.animate({ scrollTop: $itemGuts.outerScrollHeight()  }, 'fast');

  // Get focus into the box
  getFocusInCommentEditable($itemGuts);
}

/**
 * Waits until there's a comment editing box and give keyboard focus to it
 */
function getFocusInCommentEditable($itemGuts, attempt) {
  var $commentEditor = $itemGuts.find('div.editable[contenteditable="plaintext-only"]');
  if ($commentEditor.length) {
    $commentEditor.focus();
  } else {
    if (typeof attempt === 'undefined')
      attempt = 0;
    if (attempt < 20)
      setTimeout(function() { getFocusInCommentEditable($itemGuts, attempt + 1); }, 50);
  }
}

/**
 * Show the preview's scrollbars and hide the body's
 */
function showPreviewScrollbar() {
  $(this).closest(_C_ITEM).addClass('gpme-hover');
  disableBodyScrollbarY();
}

/**
 * Show the preview's scrollbars and hide the body's
 */
function hidePreviewScrollbar() {
  $(this).closest(_C_ITEM).removeClass('gpme-hover');
  enableBodyScrollbarY();
}


/**
 * Disable the document's scrolling so that we can freely scroll inside the preview
 */
function disableBodyScrollbarY() {
  var $body = $('html');
  var width = $body.first().width();
  $body.css('overflow-y', 'hidden');
  var newWidth = $body.first().width();
  $body.css({'overflow-y': 'hidden', 'max-width': '' + width + 'px' });
  // Relative position is for the absolute-positioned #gbg to stay put
  $(_ID_GBAR_TOP).css({'max-width': '' + width + 'px', 'position': 'relative'});
  // XXX Can't get the header stretched out
  //$(_C_HEADER).css('padding-right', '' + (newWidth - width) + 'px');
  $(_ID_CONTENT).css('max-width', '' + width + 'px');
  $(_C_FEEDBACK_LINK).css('right', '' + (newWidth - width) + 'px');
}

/**
 * Re-enable the document's scrolling.  See disableBodyScrollbarY();
 */
function enableBodyScrollbarY() {
  var $body = $('html');
  $body.css({'overflow-y': '', 'max-width': ''});
  var $gbar = $(_ID_GBAR);
  $(_ID_GBAR_TOP).css({'max-width': '', 'position': ''});
  // XXX Can't get the header stretched out
  //$(_C_HEADER).css('padding-right', '');
  $(_C_FEEDBACK_LINK).css('right', '');
}

/**
 * Hides the preview of the item that was moused-out
 */
function hidePreview(e) {
  var $item = $(this);
  debug("hidePreview: this=" + $item.attr('class'));
  hidePostItemPreview($item);
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

  var $post = $item.children('.gpme-post-wrapper');
  if ($post.length) {
    // Change the max-height of the post content
    var $itemGuts = $post.children(_C_ITEM_GUTS);
    if (! $itemGuts.length) {
      error("showPreview: Can't find post content style class");
    } else {
      // Workaround for scroll-position loss bug in Chrome
      // http://code.google.com/p/chromium/issues/detail?id=36428
      $itemGuts.attr('gpme-last-scrolltop', $itemGuts.scrollTop());

      $itemGuts.css('max-height', '');
    }

    // Unbind to restore scrollbars
    $post.hide().unbind('mouseenter', showPreviewScrollbar).unbind('mouseleave', hidePreviewScrollbar);
    updateCachedSgpItem($item);
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
 * Top collapse bar (for expanded mode)
 ***************************************************************************/

/**
 * Show top collapse bar if necessary
 */
function showTopCollapseBar(e) {
  if (settings.nav_showTopCollapseBarWhen != 'hover')
    return;
  // NOTE: this must run even when folded; otherwise the top bar won't appear
  // if folded and then user unfolds.

  var $item = $(this);
  debug("showTopCollapseBar: item=" + $item.attr('id'));

  var $topbar = $item.find('.gpme-title-unfolded');
  if ($topbar.length)
    $topbar.animate({opacity: 1}, 100);
}

/**
 * Hide top collapse bar
 */
function hideTopCollapseBar(e) {
  if (settings.nav_showTopCollapseBarWhen != 'hover')
    return;

  var $item = $(this);
  debug("hideTopCollapseBar: item=" + $item.attr('id'));

  var $topbar = $item.find('.gpme-title-unfolded');
  if ($topbar.length)
    $topbar.animate({opacity: 0}, 100);
}

/****************************************************************************
 * Bottom collapse bar (for expanded mode)
 ***************************************************************************/

/**
 * Show bottom collapse bar if necessary
 */
function showBottomCollapseBar(e) {
  if (displayMode != 'expanded' || settings.nav_showTopCollapseBarWhen == 'never')
    return;

  var $item = $(this).parent();
  debug("showBottomCollapseBar: item=" + $item.attr('id'));

  // Only applies to unfolded items
  if (isItemFolded($item))
    return;

/*
  // Only show bottombar if titlebar isn't visible
  var currentScrollTop = $('body').scrollTop();
  var offsetY = $item.offset().top;
  if (currentScrollTop < offsetY)
    return;
*/

  var $bottombar = $item.children('.gpme-bottombar');
  // NOTE: We only bind click just now to avoid some inadvertent clicks
  if ($bottombar.length)
    $bottombar.addClass('gpme-hover').click(onTitleClick).animate({opacity: 1}, 100);
}

function hideBottomCollapseBar(e) {
  if (displayMode != 'expanded' || settings.nav_showTopCollapseBarWhen == 'never')
    return;

  var $item = $(this).parent();
  debug("hideBottomCollapseBar: item=" + $item.attr('id'));

  var $bottombar = $item.children('.gpme-bottombar');
  if ($bottombar.length)
    $bottombar.animate({opacity: 0}, 100, function() {
      $bottombar.removeClass('gpme-hover').unbind('click');
    });
}

/****************************************************************************
 * Buttons for entire page
 ***************************************************************************/

/**
 * Updates display of buttons in the stream
 * TODO: could use some optimization; this gets called for every
 *   fold/unfold of each item as a response to clicking the buttons.
 */
function updateContentPaneButtons($subtree) {
  debug("updateContentPaneButtons");

  // Try for streams
  var $heading = typeof $subtree != 'undefined' ?
    $subtree.find(_C_CONTENT_PANE_HEADING) : $(_C_CONTENT_PANE_HEADING);
  // Try for profile
  if (! $heading.length)
    $heading = typeof $subtree != 'undefined' ?
      $subtree.find(_C_PROFILE_HEADING) : $(_C_PROFILE_HEADING);

  if (! $heading.length) {
    debug("updateContentPaneButtons: Can't find content pane heading");
    return;
  }

  // Add buttons if don't already exist
  var $buttons = $heading.siblings('.gpme-content-buttons');
  if (! $buttons.length)
    $buttons = $contentPaneButtonsTpl.clone(true).insertAfter($heading);

  // Show buttons for expanded mode
  if (displayMode == 'expanded') {
    $buttons.addClass('gpme-expanded-mode');
    $buttons.removeClass('gpme-list-mode');
    // Count how many items are unfolded
    var unfoldedItemsCount = (typeof $subtree != 'undefined' ?
      $subtree.find(_C_ITEM + '.gpme-unfolded') : $(_C_ITEM + '.gpme-unfolded')).length;
    var $expandOrCollapse = $buttons.children('.gpme-button-expand-or-collapse-all');
    if (unfoldedItemsCount)
      $expandOrCollapse.removeClass('gpme-select-expand-all');
    else
      $expandOrCollapse.addClass('gpme-select-expand-all');
  } else {
    $buttons.addClass('gpme-list-mode');
    $buttons.removeClass('gpme-expanded-mode');
  }
}

/****************************************************************************
 * Main
 ***************************************************************************/


/**
 * Initial code run when document is ready.
 * Gets data from background page and then calls main()
 */
$(document).ready(function() {
  info("event: initial page load.");

  injectCSS();
  
  // Get options and then modify the page
  getOptionsFromBackground(function() {
    // Set the height of a folded bar
    $titlebarFolded.css('height', settings.nav_summaryLines * ITEM_LINE_HEIGHT);
    if ( settings.nav_summaryLines > 1)
      $titlebarFolded.css('white-space', 'inherit');

    if (DEBUG)
      getMessagesFromBackground(main);
    else // Get i18n messages
      main();
  });
});

/*
 * Initializations that may depend on the background page
 */
var getMessage;
if (DEBUG) {
  /**
   * Workaround for http://code.google.com/p/chromium/issues/detail?id=53628
   */
  getMessage = function(name) {
    debug('getMessage: from background: ' + name);
    return i18nMessages[name];
  };

  /**
   * Ask the background for all the messages
   * Workaround for http://code.google.com/p/chromium/issues/detail?id=53628
   */
  function getMessagesFromBackground(callback) {
    chrome.extension.sendRequest({action: 'gpmeGetMessages'}, function(response) {
      i18nMessages = response;

      i18nInit();

      callback();
    });
  }
} else {
  getMessage = function(name) {
    debug('getMessage: direct: ' + name);
    return chrome.i18n.getMessage(name);
  };

  i18nInit();
}

/**
 * Initializes constants that depend on i18n messages.
 */
function i18nInit() {
  // Sets the date regexps, based on the user's locale
  DATE_JUNK_REGEXP = new RegExp('\\s*\\(' + RegExp.quote(getMessage('gplus_dateEdited')) + '.*?\\)');
//  DATE_LONG_REGEXP = new RegExp('(' + RegExp.quote(getMessage('gplus_dateLongPrefix')) + ')' +
//                                      RegExp.quote(getMessage('gplus_dateLongSuffix')));
  DATE_LONG_REGEXP = new RegExp(RegExp.quote(getMessage('gplus_dateLongSuffix')));

  $collapseAllButtonTpl.attr('title', getMessage('ui_posts_collapseAllButton'));
  $expandAllButtonTpl.attr('title', getMessage('ui_posts_expandAllButton'));
  $markAllReadButtonTpl.attr('title', getMessage('ui_posts_markAllReadButton'));
  // Disabled because the stupid tooltips overlay the popups.
  //$markReadButtonTpl.attr('title', getMessage('ui_posts_markReadButton'));
  //$muteButtonTpl.attr('title', getMessage('ui_posts_muteButton'));
}


/**
 * Main function that's called after the document is ready and a number
 * of callbacks return from the background page
 */
function main() {
  // Listen for when there's a total AJAX refresh of the stream,
  // on a regular page
  var $contentPane = $(_ID_CONTENT_PANE);
  if ($contentPane.length) {
    var contentPane = $contentPane.get(0);
    $contentPane.bind('DOMNodeInserted', function(e) {
      // This happens when a new stream is selected
      if (e.relatedNode.parentNode == contentPane) {
        // We're only interested in the insertion of entire content pane
        onContentPaneUpdated(e);
        return;
      }

      var id = e.target.id;
      // ':' is weak optimization attempt for comment editing
      if (id && id.charAt(0) == ':')
        return;

      // This happens when posts' menus get inserted.
      // Also Usability Boost's star
      if (e.target.className == C_MENU || e.target.className == C_UBOOST_STAR)
        onItemDivInserted(e);
      // This happens when a new post is added, either through "More"
      // or a new recent post.
      // Or it's a Start G+ post
      else if (id && (id.substring(0,7) == 'update-'))
        onItemInserted(e);
      else if (settings.nav_compatSgp && id.substring(0,9) == ID_SGP_POST_PREFIX )
        onSgpItemInserted(e);
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
    // Sometimes this happens with G+ for some reason.  Happened at times when I was
    // reloading a profile page.
    debug("main: Can't find status node; badges won't work.");

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
    } else if (request.action == "gpmeBrowserActionClick") {
      onBrowserActionClick();
    }
  });

  // Listen for scrolling events
  //$(window).scroll($.throttle(500, 50, function(e) { onScroll(e); }));

  injectNewFeedbackLink();

  // The initial update
  if (isEnabledOnThisPage()) {
    updateAllItems();

    // Listen to keyboard shortcuts
    $(window).keydown(onKeydown);

    // Set up a lscache cleanup in 5 minutes, keeping 30 days of history
    setTimeout(function() { lscache.removeOld(30 * 24 * 60, LS_HISTORY_); }, 5 * 60000);
  }
}

// vim:set iskeyword+=-,36:
