/*
# Filename:         gpme.js
#
# Platforms:        Google Chrome
# Depends:          
# Web:              http://huyz.us/google-plus-me/
# Source:           https://github.com/huyz/google-plus-me
# Author:           Huy Z  http://huyz.us/
# Updated on:       2011-09-17
# Created on:       2011-07-11
#
# Installation:
#   Like any other browser extension.
#
# Usage:
#   See http://huyz.us/google-plus-me/
#
# TODO:
#   This file is in bad need of refactoring for abstraction and architectural
#   patterns, although there hasn't been a huge need for re-use yet.
#   Since this project was initially a learning tool, I favored getting things done fast over
#   thoughtful design.
#   Still learning JavaScript, so pardon the cruft.
#
# Thanks:
#   This extension initially took some ideas from
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

'use strict';

// If true, won't need the 'tabs' permission
// NOTE: Keep format the same as it is programmatically changed by package.sh
var PARANOID = false;
// If true, this turns on all sorts of debugging output in the JS console.  This is appropriate
// to turn on for both development and beta.
// NOTE: Keep format the same as it is programmatically changed by package.sh
var DEBUG = true;
// If true, this will change the behavior of the app for development.  This is only appropriate
// to turn on for development but not beta.
// NOTE: Keep format the same as it is programmatically changed by package.sh
var DEV = true;

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

// Google+ API dev key
var plusApiDevKey = 'AIzaSyDueLroS1nPftNS3Ts5ik_GmLoYGuDkQaQ';

// FIXME: these will go away
var _ID_GB                      = '#gb';
var C_GBAR                      = 'c-Yd-V c-i-Yd-V'; // 'a-Rf-R a-f-Rf-R'; // Only for checking, sometimes people have extra class, e.g. 'a-rg-M a-e-rg-M a-rg-M-El'
var DISABLED_PAGES_URL_REGEXP   = /\/(?:posts\/|notifications\/|sparks(:?\/|$)|up\/start\/)/;

function defineDomConstants(ns) {
  // NOTE: only cache class names (CN_*) here if we're sure that they will be already mapped very early no
  // matter what page the user first loads G+

  ns.S_notificationsIframe              = '#gbsf'; // FIXME: webx

  ns.S_gbar                             = '%gbar'; // '#gb';
  ns.S_gbarTop                          = '%gbarTop'; // '#gbw';
  ns.S_gbarToolsNotificationA           = '%gbarToolsNotificationA'; // '#gbg1';
  ns.S_gbarToolsNotificationUnitBg      = '%gbarToolsNotificationUnitBg'; // '#gbi1a';
  ns.S_gbarToolsNotificationUnitFg      = '%gbarToolsNotificationUnitFg'; // '#gbi1';
  ns.CN_gbarToolsNotificationUnitBgZero = X.classNames('gbarToolsNotificationUnitBgZero'); // 'gbid';
  ns.CN_gbarToolsNotificationUnitFgZero = X.classNames('gbarToolsNotificationUnitFgZero'); // 'gbids';
  ns.S_gplusBar                         = '%gplusBar'; // '.c-i-cb-V';
  ns.S_content                          = '%content'; // '#content';
  ns.S_contentPane                      = '%contentPane'; // '#contentPane';
  ns.S_copyrightRow                     = '%copyrightRow'; // '.a-f-kb-R';
  ns.S_feedbackLink                     = '%feedbackLink'; // '.a-Vi-Eg';

  // Icons
  ns.CN_hangoutLiveIcon                = X.classNames('hangoutLiveIcon'); // 'kC'
  ns.CN_hangoutLiveInactiveIcon        = X.classNames('hangoutLiveInactiveIcon'); // 'kC'
  ns.S_hangoutLiveIcon                 = '%hangoutLiveIcon';
  // We use backups for these icons because the first page load may have been on a page without share icons
  // and we need these classes for our pre-created DOM elements
  ns.CN_makeChildShareIconNonHoverable = X.classNames('makeChildShareIconNonHoverable') || X.classNames('makeChildShareIconNonHoverable2'); // Look at camera icon matched CSS rules, look for series of 3 pairs, use the last one (don't use the first one '.h-fc' otherwise hovers works)
  ns.CN_shareIconsPhoto                = X.classNames('shareIconsPhoto') || X.classNames('shareIconsPhoto2'); // 'i-wa-m-v';
  ns.CN_shareIconsVideo                = X.classNames('shareIconsVideo') || X.classNames('shareIconsVideo2'); // 'i-wa-m-Ha';
  ns.CN_shareIconsLink                 = X.classNames('shareIconsLink')  || X.classNames('shareIconsLink2'); // 'i-wa-m-j';
  ns.CN_shareIconsLocation             = X.classNames('shareIconsLocation') || X.classNames('shareIconsLocation2'); // 'i-wa-m-Te-D'; // Unlike the other ones, this has a single class for non-hover
  ns.CN_gplusBarNavGamesIcon           = X.classNames('gplusBarNavGamesIcon'); // 'Il';

  // Pages and streams
  ns.S_circleStream           = '%circleStream'; // '.br'
  ns.S_gamesActivitiesStream  = '%gamesActivitiesStream'; // '.BI';
  ns.S_circleStreamMoreButton = '%circleStreamMoreButton'; // '.Uk';

  ns.S_gamesActivitiesStreamHeadingText   = '%gamesActivitiesStreamHeadingText'; // '.Gt';
  ns.S_circleStreamContentPaneHeadingText = '%circleStreamContentPaneHeadingText'; // '.vo';
  ns.S_profileHeadingName                 = '%profileHeadingName'; // '.fn';

  // Item
  ns.S_postIsSelected            = '%postIsSelected'; // '.ki';
  ns.S_post                      = '%post'; // '.ke';
  ns.S_postContainer             = '%postContainer'; // '.Tf';
  ns.S_postIsMutedOrDeleted      = '%postIsMutedOrDeleted_d'; // '.En'
  ns.S_postHead                  = '%postHead'; // '.Nw', div excluding the avatar and menu icon
  ns.S_postBody                  = '%postBody'; // '.Kw'; // 2nd child of S_postContainer
  ns.S_postUserAvatarA           = '%postUserAvatarA'; // '.kr > a.Km'; // 1st child of C_ITEM_GUTS
  ns.S_postUserName              = '%postUserName'; // '.nC'; // span that contains the <a>
  // S_postCategory:
  // - checkin: https://plus.google.com/112543001180298325686/posts/1hJCin8mTaV
  // - hangout: https://plus.google.com/100512649718649402368/posts/1u32KN5UzUR
  // - mobile: https://plus.google.com/115404182941170857382/posts/ZUiCSs9Qteq
  ns.S_postCategory              = '%postCategory'; // '.Uv';
  ns.S_postPermissions           = '%postPermissions'; // '.Ii' from b-j Ii cp Gl
  ns.S_postHeadInfoMuted         = '%postHeadInfoMuted'; // '.Ox'; // "- Muted" text in profile page
  ns.S_postTime                  = '%postTime'; // '.Hi'; // Hi vn. Span that contains the <a>
  ns.S_postContentExpandButton   = '%postContentExpandButton'; // '.ho'; // https://plus.google.com/111775942615006547057/posts/RaZvqBMadoH
  //var _C_EMBEDDED_VIDEO           = '.ea-S-Bb-jn > div';

  // _C_QUOTED_PHOTO:
  // - re-sharing your own post: https://plus.google.com/116805285176805120365/posts/3vKNMqMsYrc
  ns._C_QUOTED_PHOTO             = '.Ux > img';
  // Various images:
  // - [NO NEED] Web page image: O-F-Th-la
  // - Posted image: B-u-zt-ja https://plus.google.com/107590607834908463472/posts/VfD8zwSq5yv
  // - Posted album: B-u-xh-ja  https://plus.google.com/100410400068186344529/posts/L4JRFFK2e87 [limited]
  // - Main image in album: B-u-Nd-ja https://plus.google.com/103450266544747516806/posts/f8RKcEssKwL [limited]
  // - Smaller image thumbnails in album: F-y-Mc-ea https://plus.google.com/103450266544747516806/posts/f8RKcEssKwL [limited]
  ns.S_CONTENT_IMG               = '.B-u-zt-ja > img, .B-u-xh-ja > img, .B-u-Nd-ja > img, .B-u-fc-ja > img';
  // _C_CONTENT_VIDEO: https://plus.google.com/111775942615006547057/posts/YyeAxkSfjTD
  ns._C_CONTENT_VIDEO            = '.B-u-wa-Uj'; // Take the 4-part parent that looks like S_CONTENT_IMG
  ns._C_CONTENT_ANY_LINK         = ns.S_postBody + ' a.ot-anchor'; // This also includes links that are embedded in the text https://plus.google.com/112374836634096795698/posts/KryDaNYMQLF
  ns._C_MAP_IMG                  = 'img.pv'; // https://plus.google.com/112543001180298325686/posts/1hJCin8mTaV

  // poster text https://plus.google.com/111091089527727420853/posts/63tRxMQk7rV
  ns._C_CONTENT_POSTER_TEXT      = '.Ph';
  // poster text #2 https://plus.google.com/110901814225194449440/posts/Nr651PmEM8d
  ns._C_CONTENT_POSTER_TEXT2     = '.vg';
  // or original poster text https://plus.google.com/111091089527727420853/posts/63tRxMQk7rV
  ns._C_CONTENT_QUOTED_TEXT      = '.Tx .vg'; // Look for gray border-left for 1st part, and then the text for 2nd
  ns._C_CONTENT_EDIT             = '.ko'; // Look for edit in content of any of your posts
  ns.S_CONTENT_HANGOUT_TEXT      = '.XD > .fe'; // https://plus.google.com/118328436599489401972/posts/d6pQ162zHZJ
  ns.S_CONTENT_PHOTO_COMMENT     = '.B-u-ja-ea'; // https://plus.google.com/107590607834908463472/posts/VfD8zwSq5yv
  ns.S_CONTENT_PHOTO_CAPTION     = '.N8 > a'; // https://plus.google.com/107590607834908463472/posts/VfD8zwSq5yv
  ns.S_CONTENT_VIDEO_CAPTION     = '.B-u-wa-ea'; // https://plus.google.com/115404182941170857382/posts/dnKJeydFiw5
  // _C_CONTENT_LINK_TITLE:
  // - photo album caption https://plus.google.com/103450266544747516806/posts/f8RKcEssKwL [limited]
  // - title of shared link https://plus.google.com/103981247311324870509/posts/U1iNjkiKYrX
  ns._C_CONTENT_LINK_TITLE       = '.B-u-Y > a';
  ns._C_CONTENT_LINK_TEXT        = '.B-u-Y-j'; // Same post as _C_CONTENT_LINK_TITLE
  ns._C_CONTENT_CHECKIN_LOCATION = '.Gm'; // Checkin location https://plus.google.com/111667704476323287430/posts/MBBwSZiy4nb
  ns.S_CONTENT_PHOTO_TAGGED      = '.xo > a.yn'; // Photo album with live updated tags https://plus.google.com/109342148209917802565/posts/6yXESEyCPtV  XXX Do we need '> a' ?

  // Comments
  ns.S_postComments                     = '%postComments'; // '.zf'
  ns.S_postCommentsToggler              = '%postCommentsToggler'; // '.Vr';
  ns.S_postCommentsTogglerCount         = ns.S_postCommentsToggler + ':not([style*="none"]) ' + '%postCommentsButtonTextCountNumber'; // S_postCommentsToggler + ':not([style *= "none"]) .Fw';
  ns.S_postCommentsButtonChevron_expand = '%postCommentsButtonChevron:not(%postCommentsButtonChevronWouldCollapse)'; // ns.S_postCommentsToggler + ':not(.pk) > :first-child'; // :not grayed out
  ns.S_postCommentsButtonNames          = '%postCommentsButtonTextNamesText'; // ns.S_postCommentsToggler + ' .xo';
  ns.S_postCommentsList                 = '%postCommentsList'; // '.Gw'; // everything but button
  ns.S_postCommentsOlderButton          = '%postCommentsOlderButton'; // '.Kr';
  ns.S_postCommentsOlderButton_count    = ns.S_postCommentsOlderButton + ':not([style*="none"])';
  ns.S_postCommentsStream               = '%postCommentsStream'; // '.Xh'
  ns.S_postComment                      = '%postComment'; // ns.S_postCommentsStream + '> div[id]'; // '.zh'; // Each comment item
  ns.S_postCommentUserNames             = '%postCommentUserNameA'; // ns.S_postComment + ' a[rel]'; // ns.S_postComment + ' a.Qn'; // Qn xw
  ns.S_postCommentContentExpandButton   = '%postCommentContentExpandButton'; // '.tg'

  //ns.S_postActionBar                    = '%postActionBar'; // '.Bl';
  ns.S_postCommentLink                  = '%postCommentLink'; // '.de'
  ns.S_postCommentButton                = '%postCommentButton'; // '.zo' // Fake box that says "Add a comment...

  // Menu
  ns.S_postMenuItemMute   = '%postMenuItemMute'; // '.Zi'; // Zi cf. Look what's diff from other menuitems.
  ns.S_postMenuItemUnmute = '%postMenuItemUnmute'; // '.Eo'; // Candidates: Eo cf; don't take inner div. Displayed on user's posts page.

  ns.SL_COMMENT_CONTAINERS =
    [ S_postCommentsToggler, S_postCommentsList, S_postCommentsStream ];

  // G+me
  ns.CN_gpmeCommentCountNoHilite  = 'gpme-comment-count-nohilite';

  // Usability Boost
  ns._C_UBOOST_MUTELINK           = '.mute_link';
  ns.C_UBOOST_STAR                = 'post_star';

  // Circlestars
  ns._C_CIRCLESTARS               = '.circlestars';

  // Start G+, a.k.a. SGPlus
  ns.ID_SGP_POST_PREFIX           = 'sgp-post-';
  ns.C_SGP_UPDATE                 = 'sgp_update';
  ns.C_SGP_UPDATE_FB              = 'sgp_update_facebook';
  ns.C_SGP_UPDATE_TWITTER         = 'sgp_update_twitter';
  ns._C_SGP_TITLE                 = ns.S_postHead; // Same as G+ now
  ns._C_SGP_CONTENT               = ns.S_postBody; // Same as G+ now (but doesn't matter coz not relevant to SGPlus posts
  ns._C_SGP_TEXT1                 = ns.S_postBody; // .Qy
  ns._C_SGP_TEXT2                 = '.ea-S-R';
  //var S_SGP_ORIGPOST_LINK          = 'span[style^="font-size"]';
  ns._C_SGP_COMMENT               = '.sgp_comments_wrapper';
  ns._C_SGP_DATE                  = '.a-b-f-i-Ad-Ub';

  // Google+ Tweaks
  ns._C_TWEAK_EZMNTN              = '.bcGTweakEzMntn';
}

// CSS values shared with our CSS file
var TRIANGLE_HEIGHT                               = 30;
var TRIANGLE_WIDTH                                = 17;
var RIGHT_BUTTON_AREA_OFFSET_LEFT                 = 20 + 4;
var POST_WRAPPER_PADDING_TOP                      = 6;
var POST_WRAPPER_PADDING_BOTTOM                   = 6;
var ITEM_LINE_HEIGHT                              = 22;
var ITEM_FONT_HEIGHT                              = 15; // Font size is 13, but height is 15
var FOLDED_ITEM_OUTER_HEIGHT_EXTRAS               = 2 * (4 + 1);
var MUTED_ITEM_HEIGHT                             = 45;
// Other CSS values
var GBAR_HEIGHT                                   = 30;
var GPLUSBAR_HEIGHT                               = 60; // This changes to 45 depending on Google+ Ultimate's options
var MAX_DIST_FROM_COPYRIGHT_TO_BOTTOM_OF_VIEWPORT = 30; // about the same as height as feedback button
var ROOM_FOR_COMMENT_AREA                         = 70;
// Independent CSS values that affect on this file
var GAP_ABOVE_ITEM_AT_TOP                         = 2;
var GAP_ABOVE_PREVIEW                             = 7;
var SLACK_BELOW_PREVIEW                           = 77; // Needed to prevent G+ from jumping page when user adds comment
var COMMENTS_TITLE_FOLDED_OUTERHEIGHT             = 36;
var CARD_POSTS_CONTENT_HORIZ_PADDING              = 5;
var NOTIFICATION_FRAME_WIDTH                      = 440;
var NOTIFICATION_FRAME_MAX_HOVERCARD_MAX_OFFSET_LEFT = 210;

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

var LS_CARD_POSTS                  = LS_CARD_POSTS + 'cp_';

// DEPRECATED: old localStorage keys
var OLD_KEYS = {
  LS_FOLDED                      : 'gpme_post_folded_',
  LS_COMMENTS_FOLDED             : 'gpme_comments_folded_',
  LS_COMMENTS_UNFOLDED           : 'gpme_comments_unfolded_',
  LS_COMMENTS_READ_COUNT         : 'gpme_post_seen_comment_count_',
  LS_COMMENTS_READ_COUNT_CHANGED : 'gpme_post_seen_comment_count_changed_',
  LS_URL_LIST_LAST_UNFOLDED      : 'gpme_post_last_open_'
};

// Animation
var JQUERY_DURATION = 400;

// How long does it take for an item to become read when looking at preview
var MARK_ITEM_AS_READ_WHEN_PREVIEW_SHOWN_DELAY = 3000;
var MARK_ITEM_AS_READ_WHEN_PREVIEW_HOVERED_DELAY = 1000;

/****************************************************************************
 * Constant-like variables constructed later or over time
 ***************************************************************************/

var DATE_JUNK_REGEXP, DATE_LONG_REGEXP; // Due to Chrome bug, defined later, after response from background
var commentsHeightChangedClassList;
var commentsHeightChangedRegExp;
var commentsHeightChangedElementsRemaining = 0;

/****************************************************************************
 * Init
 ***************************************************************************/

// Frame; either 'top' or 'notifications'
var frame;

// GPlusX SDK
var gpx;

// Settings, according to fancy-settings
var settings;

// Hold all the messages from background
// Workaround for http://code.google.com/p/chromium/issues/detail?id=53628
if (DEV)
  var i18nMessages;

// chrome.app.getDetails() as returned from the background
var appDetails;

// list or expanded mode (like on GReader)
var displayMode;

// In list mode, an item that was opened but may need to be reclosed
// once the location.href is corrected
var $lastTentativeOpen = null;

// We track what's open so that we can close it
var $lastPreviewedItem = null;

// Timers to handle G+'s dynamic comment list reconstruction
var lastCommentCountUpdateTimers = {};

// Timer for setting an item as read within the popup preview
var markItemAsReadTimer = null;

// Cache the year
var yearRegexp = new RegExp('(,? *|[/-]?| de )' + new Date().getFullYear() + '[/-]?');

// SGPlus update timer
var sgpUpdateTimer = null;
// SGPlus cached DOM
var $sgpCachedItems = new Object();


/****************************************************************************
 * Pre-created DOM elements
 ***************************************************************************/

function precreateElements(ns) {
  //
  // Inside both post and comment title
  //

  var $commentCountBgTpl = $('<span class="gpme-comment-count-bg"></span>');
  var $commentCountFgTpl = $('<span class="gpme-comment-count-fg"></span>');
  var $commentCountContainerTpl = $('<div class="gpme-comment-count-container ' + CN_gpmeCommentCountNoHilite + '"></div>').append($commentCountBgTpl).append($commentCountFgTpl).click(onCommentCountClick);
  ns.$markReadButtonTpl = $('<div class="gpme-mark-read-button"></div>').click(onMarkReadClick);
  ns.$muteButtonTpl = $('<div class="gpme-mute-button"></div>').click(onMuteClick);
  // NOTE: order matters.
  // - if commentCount comes before mutebutton, it takes precedence in clicking
  // - actually, we put commentCount later, now that we have the markread button
  ns.$buttonAreaTpl = $('<div class="gpme-button-area"></div>').
    append($markReadButtonTpl).
    append($muteButtonTpl).
    append($commentCountContainerTpl);

  //
  // Inside item title
  //

  // C_TITLE is no longer necessary now that copied styles over from C_TITLE for SGPlus
  //ns.$titleTpl = $('<div class="' + C_TITLE + '"></div>').click(onTitleClick);
  ns.$titleTpl = $('<div class="gpme-title-clickarea"></div>').click(onTitleClick);
  ns.$titleSenderTpl = $('<span class="gpme-title-sender"></span>');
  ns.$titleDashTpl = $('<span class="gpme-sep">  -  </span>');
  ns.$titleQuoteTpl = $('<span class="gpme-sep">  +  </span>');
  ns.$hangoutLiveIconTpl = $('<span class="gpme-title-icons ' + CN_hangoutLiveIcon + '" style="margin-left: 5px"></span>'); // 
  ns.$hangoutLiveInactiveIconTpl = $('<span class="gpme-title-icons ' + CN_hangoutLiveInactiveIcon + '" style="margin-left: 5px; width: 21px"></span>'); // 
  // $cameraIconTpl: need container so it doesn't have the green of hover
  ns.$cameraIconTpl = $('<span class="' + CN_makeChildShareIconNonHoverable + '"><span class="gpme-title-icons ' + CN_shareIconsPhoto + '" style="margin: 0 4px"></span></span>');
  ns.$videoIconTpl = $('<span class="' + CN_makeChildShareIconNonHoverable + '"><span class="gpme-title-icons ' + CN_shareIconsVideo + '" style="margin: 0 4px"></span></span>');
  ns.$linkIconTpl = $('<span class="' + CN_makeChildShareIconNonHoverable + '"><span class="gpme-title-icons ' + CN_shareIconsLink + '" style="margin: 0 4px"></span>');
  ns.$checkinIconTpl = $('<span class="gpme-title-icons ' + CN_shareIconsLocation + '" style="margin-right: -5px;"></span>');
  ns.$mobileIconTpl = $('<span class="gpme-title-icons ' + CN_shareIconsLocation + '" style="margin-left: 2px; margin-right: -3px; background-position: 0 -34px"></span>');
  ns.$gameIconTpl = $('<span class="gpme-title-icons ' + CN_gplusBarNavGamesIcon + '" style="margin-left: 2px; margin-right: -3px; background-size: 80%; background-position: 0 -221px; height: 14px"></span>');
  ns.$titleDateTpl = $('<span class="gpme-title-date"></span>');
  ns.$titleThumbnailsTpl = $('<span class="gpme-title-thumbnails"></span>');
  ns.$titleSnippetTpl = $('<span class="gpme-snippet"></span');

  //  ('<div class="gpme-title-folded"><div class="gpme-fold-icon">\u25cf</div></div>');
  ns.$titlebarFolded = $('<div class="gpme-title-folded gpme-bar"><div class="gpme-button-area-left"><div class="gpme-circle-icon"></div></div></div>');
  ns.$titlebarTpl = $('<div class="gpme-titlebar"></div>').append(
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
  postWrapperTpl.appendChild(clickWall);
  postWrapperTpl.appendChild(previewTriangleSpan);
  ns.$postWrapperTpl = $(postWrapperTpl);
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
  ns.$commentTitleTpl = $('<div class="gpme-comments-title-clickarea"></div>').click(onCommentTitleClick).append($commentSnippetTpl);

  ns.$commentbarTpl = $('<div class="gpme-commentbar"></div>').append(
      $('<div class="gpme-comments-title-unfolded gpme-bar">\
        <div class="gpme-fold-icon gpme-comments-fold-icon-unfolded gpme-comments-fold-icon-unfolded-top">\u25bc</div>\
        <div class="gpme-fold-icon gpme-comments-fold-icon-unfolded gpme-comments-fold-icon-unfolded-bottom">\u25bc</div>\
      </div>').click(onCommentTitleClick)).
    append('<div class="gpme-comments-title-folded gpme-bar"></div>');
  //  append('<div class="gpme-comments-title-folded gpme-bar"><div class="gpme-fold-icon" style="visibility: hidden">\u25b6</div></div>');

  //
  // Inside item's comments guts
  //

  ns.$commentsWrapperTpl = $('<div class="gpme-comments-wrapper"></div>');

  //
  // Inside item bottombar
  //

  ns.$bottombarTpl = $('<div class="gpme-bottombar gpme-bar" style="opacity:0"></div>').append(
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

  ns.$collapseAllButtonTpl = $('<span class="gpme-button-collapse-all gpme-content-button"></span>').click(foldAllItems);
  ns.$expandAllButtonTpl = $('<span class="gpme-button-expand-all gpme-content-button"></span>').click(unfoldAllItems);
  ns.$markAllReadButtonTpl = $('<span class="gpme-button-mark-all-read gpme-content-button"></span>').click(markAllItemsAsRead);
  ns.$contentPaneButtonsTpl = $('<div class="gpme-content-buttons"></div>').
    append($markAllReadButtonTpl).
    append($('<div class="gpme-button-expand-or-collapse-all"></div>').
      append($collapseAllButtonTpl).
      append($expandAllButtonTpl));

  //
  // Hover cards
  //

  ns.$hoverCardPostsTpl = $('<tr id="gpme-card-posts" style="display:none"><td colspan=2><div id="gpme-card-posts-content" style="display:none"><div id="gpme-card-posts-recent"><div class="gpme-card-posts-loading"><div>Loading...</div></div></div><div id="gpme-card-posts-top" style="display:none"><div class="gpme-card-posts-loading"><div>Loading...</div></div></div><div id="gpme-card-posts-cloud" style="display:none"><div class="gpme-card-posts-loading"><div>Loading...</div></div></div></div></td></tr>');
}



/****************************************************************************
 * Persistence
 ***************************************************************************/

// Memory cache of items shown by profiling to slow things down
var memcache = {
  LS_COMMENTS_READ_COUNT: {},
  LS_COMMENTS_READ_COUNT_CHANGED: {}
};

/**
 * Gets the specified key from lscache.
 * This helps in the transition period from the old scheme to the new scheme
 */
function lsGet(type, key) {
  // NOTE: for efficiency, we don't strip the key in memory
  if (memcache[type] && typeof memcache[type][key] != 'undefined')
    return memcache[type][key];

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
  // NOTE: for efficiency, we don't strip the key in memory
  if (memcache[type])
    memcache[type][key] = value;

  lscache.set(type + stripKey(type, key), value);
  //localStorage.setItem(OLD_KEYS[type] + key, value);
}

/**
 * Removs the specified key from lscache
 */
function lsRemove(type, key) {
  // NOTE: for efficiency, we don't strip the key in memory
  if (memcache[type] && typeof memcache[type][key] != 'undefined')
    delete memcache[type][key];

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
 * Mod jQuery
 */
$.fn.reverse = [].reverse;

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
  //console.trace();
}
function error() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('g+me');
  console.error.apply(console, args);
  console.trace();
}

/**
  * Returns a function that catches exceptions to print them out to console.
  * Useful for chrome event listeners and other chrome callbacks.
  * Otherwise we get unhelpful messages like:
  *   Error in event handler for 'undefined': undefined
  * @param {string=} Optional with name of function.
  * @param {Function} Required function to be wrapped
  * @return {Function}
  */
function wrapTryCatch(name, func) {
  return function() {
    if (typeof name == 'function') {
      func = name;
      name = undefined;
    }
    try {
      return func.apply(undefined, arguments);
    } catch (e) {
      var fname = name || (func && func.name) || 'wrapTryCatch';
      error(fname + ': exception bubbling up:', e, e.stack);
      throw e;
    }
  };
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
 * Escapes HTML entities
 * http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery/374176#374176
 **/
function htmlEncode(str) {
  return $("<div/>").text(str).html();
}

/**
 * Check if should enable on certain pages.
 * @param $subtree: Optional, to force checking of DOM in cases when the
 *   href is not yet correct and the Ajax updates are pending
 */
function isEnabledOnThisPage($subtree) {
  if (typeof $subtree == 'undefined')
    return ! DISABLED_PAGES_URL_REGEXP.test(window.location.href);

  return !
    ['%notificationsPageMarker', // gwa // Look for the notifications stream
     '%sparkPageMarker', // wja // Look for 3rd div in blank one, ancestor of stream
     //'%sparksPageMarker', FIXME: right now sparksPageMarker picks up sparksPageMarker as well, which is faster anyway.
     '%singlePostPageMarker' // 'c-ng-L1-P'; // grandchild of #contentPane
    ].some(function(marker) {
      if ($subtree.is(marker) || $subtree.find(marker).length) {
        debug('isEnabledOnThisPage: disabling because match on page marker selector \'' + marker + '\'');
        return true;
      }
    });
}

/**
 * Shorten date text to give more room for snippet
 * FIXME: English-specific
 */
function abbreviateDate(text) {
  return text.replace(DATE_JUNK_REGEXP, '').replace(DATE_LONG_REGEXP, getMessage('gplus_dateLongSuffixReplacement')).replace(/ PM/, ' pm').replace(/ AM/, ' am').replace(yearRegexp, '');
}

/**
 * Iterates through all the comment containers and calls the callback
 */
function foreachCommentContainer($subtree, callback) {
  SL_COMMENT_CONTAINERS.forEach(function(i) {
    var $container = $subtree.find(i);
    if ($container.length)
      callback($container);
  });
}

/**
 * Iterates through all the posts and calls the callback
 */
function foreachItem(callback) {
  var $stream = $(S_circleStream).filter(':visible');
  if (! $stream.length) {
    $stream = $(S_gamesActivitiesStream).filter(':visible');
    if (! $stream.length) {
      error("forEachItem: Can't find stream");
      return;
    }
  }
  
  $stream.children(S_post).each(function(i, item) {
    callback($(item));
  });
}

/**
 * Queries background page for options
 */
function getOptionsFromBackground(callback) {
  chrome.extension.sendRequest({action: 'gpmeGetSettings'},
    wrapTryCatch('getOptionsFromBackground', function(theSettings) {
      settings = theSettings;
      displayMode = settings.nav_global_postsDefaultMode;

      // Override the built-in key with the options
      var newKey = settings.apiKey;
      if (newKey) {
        newKey = newKey.replace(/\W/g, '');
        if (newKey)
          plusApiDevKey = newKey;
      }

      callback();
    }));
}

/**
 * Queries background page for extension ID
 */
function getAppDetailsFromBackground(callback) {
  chrome.extension.sendRequest({action: 'gpmeGetAppDetails'},
    wrapTryCatch('getAppDetailsFromBackground', function(appDetails) {
      callback(appDetails);
    }));
}

/**
 * Returns the height of any fixed bars at the top, if
 * applicable.
 * This is for compatibility with other extensions.
 */
function fixedBarsHeight() {
  return isGbarFixed() ? GBAR_HEIGHT + (isGplusBarFixed() ? getGplusBarHeight() : 0) : 0;
}

/**
 * Returns the Gplus bar height, which changes according to Google+ Ultimate settings
 * (Compatc or Ultra Compact navigation)
 */
function getGplusBarHeight() {
  var $gplusbar = $(S_gplusBar);
  return $gplusbar.length ? $gplusbar.height() : GPLUSBAR_HEIGHT;
}

/**
 * Returns true if Gbar is fixed in place
 */
function isGbarFixed() {
  var result = false;
  // Detect fixed gbar for compatibility (with "Replies and more for Google+",
  // Usability Boost, and Google+ Ultimate)
  var $gbar = $(S_gbar);
  var $gbarParent = $gbar.parent();
  // Google+ now fixes the gbar using a CSS class
  // XXX Temporary until Webx supports media queries
  //if ($gbarParent.length && ($gbarParent.is('%gbarParentIsFixed') || $gbarParent.css('position') == 'fixed')) {
  if ($gbarParent.length && (window.innerHeight >= 528 || $gbarParent.css('position') == 'fixed')) {
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
 * Returns true if gplus bar (the part below Gbar) is fixed in place
 */
function isGplusBarFixed() {
  // Detect fixed gbar for compatibility (with "Google+ Ultimate" and "Google+ Tweaks")
  var $gplusbar = $(S_gplusBar);
  // XXX Temporary until Webx supports media queries
  //return $gplusbar.length && ($gplusbar.is('%gplusBarIsFixed') || $gplusbar.css('position') == 'fixed');
  return $gplusbar.length && (window.innerHeight >= 800 || $gplusbar.css('position') == 'fixed');
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
  var $content = $(S_content);
  if ($content.length) {
    var styles = window.getComputedStyle($content.get(0));
    if (styles.overflowX == 'hidden')
      result += getGplusBarHeight();
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

function slideUpFromTop($elem, minHeight, duration, easing, callback) {
  $elem.animate({height: minHeight, scrollTop: $elem.height() - minHeight}, duration, easing, function() {
    $elem.css('height', '');
    callback();
  });
}

/* This is not symmetric with slideUpFromTop because we actually want to show users non-moving content asap
 * so they can start reading while the animation is going on.
 * Google+ animates the way they do because they want to show the last comment at all times.
 */
function slideDown($elem, minHeight, duration, easing, callback) {
  // NOTE: actual() only works properly when element is hidden
  var height = $elem.hide().actual('height');
  $elem.css('display', '');
  $elem.height(minHeight);
  $elem.animate({height: height}, duration, easing, function() {
    $elem.css('height', '');
    callback();
  });
}

// http://dansnetwork.com/javascript-iso8601rfc3339-date-parser/
Date.prototype.setISO8601 = function(dString) {
  var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;

  if (dString.toString().match(new RegExp(regexp))) {
    var d = dString.match(new RegExp(regexp));
    var offset = 0;

    this.setUTCDate(1);
    this.setUTCFullYear(parseInt(d[1],10));
    this.setUTCMonth(parseInt(d[3],10) - 1);
    this.setUTCDate(parseInt(d[5],10));
    this.setUTCHours(parseInt(d[7],10));
    this.setUTCMinutes(parseInt(d[9],10));
    this.setUTCSeconds(parseInt(d[11],10));
    if (d[12])
      this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    else
      this.setUTCMilliseconds(0);
    if (d[13] != 'Z') {
      offset = (d[15] * 60) + parseInt(d[17],10);
      offset *= ((d[14] == '-') ? -1 : 1);
      this.setTime(this.getTime() - offset * 60 * 1000);
    }
  } else {
    this.setTime(Date.parse(dString));
  }
  return this;
};

/****************************************************************************
 * Event Handlers
 ***************************************************************************/

/**
 * Responds to DOM updates from G+ to handle change in status of new notifications shown to the user
 */
function onStatusUpdated(e) {
  debug("onStatusUpdated");
  // Since G+ animated the status count, for some reason innerHTML is set correctly whey innerText lags.
  var statusCount = parseInt( e.target.innerHTML.replace(/<[^>]*?>/g, ''), 10 );
  chrome.extension.sendRequest({action: 'gpmeStatusUpdate', count: statusCount});
}

/**
 * Responds to user click on browser action icon
 */
function onBrowserActionClick() {
  info("event: browser action icon was clicked");
  click($(S_gbarToolsNotificationA));
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

  // If switching between Streams to Games, we need to inject the content pane buttons.
  // At this time, one of the content panes will be hidden -- we need to pick out the correct
  // subtree
  var $contentPaneDiv = $(S_contentPane + ' > :not([style*="none"])');
  updateContentPaneButtons($contentPaneDiv);
}

/**
 * Responds to a reconstruction of the content pane, e.g.
 * when the user clicks on the link that points to the same
 * page we're already on, or when switching from About to Posts
 * on a profile page.
 */
function onContentPaneUpdated(e) {
  info("event: DOMNodeInserted within onContentPaneUpdated");

//  gpx.automapPage();

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

  // We may not be done constructing the regexp because we have yet to meet an expandable comment.
  // If more posts come in, we may find one.
  constructCommentHeightChangedRegExp();

  //info("event: DOMNodeInserted of item into stream");
  //debug("onItemInserted: DOMNodeInserted for item id=" + e.target.id + " class='" + e.target.className);
  updateItem($(e.target));

  // We call this manually because otherwise it only happens on interactive
  // folding/unfolding.
  updateContentPaneButtonsThrottled();
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
  var $item = $target.parent();
  $item.children('.gpme-post-wrapper').append($target);

  // Update the buttons.
  // Right now, only the mute button matters
  updateButtonArea($item);
}

/**
 * Responds to DOM updates from G+ to handle changes to old comment counts
 */
function onCommentsUpdated(e, $item) {
  var id = e.target.id;
  var className = e.target.className;

  //trace("event: DOM insertion or deletion of comments");
  //debug("onCommentsUpdated: DOM insertion/deletion of comments for item id=" + id + " class='" + e.target.className + "'");

  // We may not be done constructing the regexp because we have yet to meet an expandable comment.
  // If the user opens up comments, we may one.
  constructCommentHeightChangedRegExp();

  // We may be getting events just from a jquery find for comments,
  // before things are set up.
  if (! $item.hasClass('gpme-enh'))
    return;

  updateItemComments($item);
}

/**
 * Responds to click on post titlebar.
 * Calls toggleItemFolded()
 */
function onTitleClick(e) {
  var $item = $(this).closest(S_post);
  debug("onTitleClick: " + $item.attr('id'));

  toggleItemFolded($item, true);
  //e.stopImmediatePropagation();
}

/**
 * Responds to clicks on the comment count
 */
function onCommentCountClick(e) {
  info("onCommentCountClick");
  markItemAsRead($(this).closest(S_post));
}

/**
 * Responds to clicks on mute button
 */
function onMuteClick(e) {
  info("onMuteClick");
  toggleItemMuted($(this).closest(S_post));
}

/**
 * Responds to clicks on mark-read button
 */
function onMarkReadClick(e) {
  info("onMarkReadClick");
  markItemAsRead($(this).closest(S_post));
}

/**
 * Responds to click on post titlebar.
 * Calls toggleItemFolded()
 */
function onCommentTitleClick() {
  var $item = $(this).closest(S_post);
  debug("onCommentTitleClick: " + $item.attr('id'));

  toggleCommentsFolded($item);
}

/**
 * Responds to all keypresses
 */
function onKeydown(e) {
  //debug("onKeydown: which=" + e.which + " activeElement.id=" + document.activeElement.id);

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

  // We may be getting events on disabled pages, e.g. notifications, sparks
  if (! isEnabledOnThisPage())
    return;

  /*
  // Start catching key sequences
  // 71 = 'g'
  if (e.which == 71) {
    setTimeout
  }
  */

  // Ignore keystrokes with only modifiers
  if (e.which < 32 || e.ctrlKey || e.altKey)
    return;

  // Ignore all keystrokes with the wrong modifiers
  // NOTE: on Chrome for OSX, ctrlKey = metaKey
  // TODO: Is there a jQuery plugin for this?
  //debug('onKeyUp: which=' + e.which + ' shift=' + e.shiftKey + ' ctrl=' + e.ctrlKey + ' alt=' + e.altKey + ' meta=' + e.metaKey);
  if ([38, 40, 67, 73, 77, 79, 85].indexOf(e.which) < 0 && (e.shiftKey || e.ctrlKey || e.altKey)) // Anything other than keys allowed to have shift or control
    return;

  // Use a key code that works with a switch statement
  var key = e.which;
  if (e.shiftKey)
    key += 1000;
  if (e.ctrlKey)
    key += 2000;

  var itemHasFocus =
    document.activeElement !== null && document.activeElement.tagName !== 'BODY' &&
    document.activeElement.id !== null && document.activeElement.id.substring(0,7) == 'update-';

  // First, try the activeElement instead of C_SELECTED because it's already set before the
  // scroll; but if that fails (e.g. when the user cancels the editing of a comment
  // or clicks on area outside of contentpane), then we go look at C_SELECTED
  var $selectedItem = itemHasFocus ? $(document.activeElement) : $(S_postIsSelected);

  // If we still don't have a selected item, then e.g. the page must have just loaded,
  // so just pick the first item.
  if (! $selectedItem.length) {
    $selectedItem = $(S_post).filter(':first');
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
      if (! isItemMutedOrDeleted($selectedItem) && isItemFolded($selectedItem))
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
      if (! isItemMutedOrDeleted($selectedItem)) {
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
      if (! isItemMutedOrDeleted($selectedItem) && ! isItemFolded($selectedItem)) {
        togglePostExpansion($selectedItem);
      }
      break;
    case 80: // 'p', like Greader
      hideAnyPostItemPreview();
      $sibling = getPrevItem($selectedItem);
      if ($sibling.length) {
        click($sibling);
        // NOTE: G+ no longer scrolls for us
        if ($sibling.offset().top < $('body').scrollTop() + fixedBarsHeight())
          scrollToTop($sibling);
      }
      break;
    case 78: // 'n', like Greader
      hideAnyPostItemPreview();
      $sibling = getNextItem($selectedItem);
      if ($sibling.length) {
        click($sibling);
        // NOTE: G+ no longer scrolls for us
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
          /*
          if (e.shiftKey)
          */
            navigateUnfolding($sibling, $selectedItem);
            /*
          else
            // We want to navigate after the browser has responded to up/down
            setTimeout(function() { navigateUnfolding($sibling, $selectedItem); }, 0);
            */
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
          /*
          if (e.shiftKey)
          */
            navigateUnfolding($sibling, $selectedItem);
          /*
          else
            // We want to navigate after the browser has responded to up/down
            setTimeout(function() { navigateUnfolding($sibling, $selectedItem); }, 0);
            */
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
      $previousItem.length && displayMode == 'expanded' && ! isItemMutedOrDeleted($previousItem))
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
  var $selectedItem = $(S_postIsSelected);
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
  var $item = $(el).closest(S_post);

  if ($item.length) {
    console.log("Item id=" + $item.attr('id'));
  }
}

/****************************************************************************
 * DOM enhancements & post folding according to state
 ***************************************************************************/

/**
 * Injects styles in current document.
 * This should be run early.
 */
function injectStylesheet(doc) {
  doc = doc || document;

  var linkNode  = doc.createElement('link');
  linkNode.rel = 'stylesheet';
  linkNode.type = 'text/css';
  linkNode.href = chrome.extension.getURL('gpme.css') + '?' + new Date().getTime();
  doc.getElementsByTagName('head')[0].appendChild(linkNode);
}

/**
 * Injects individual styles into current document
 */
function injectSomeStyles() {
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
  var $statusNode, statusOff, cssText;
  $statusNode = $(S_gbarToolsNotificationUnitBg);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbid' (turns bg to
    // gray), which seems to be there by default.
    statusOff = $statusNode.hasClass(CN_gbarToolsNotificationUnitBgZero);
    if (statusOff)
      $statusNode.removeClass(CN_gbarToolsNotificationUnitBgZero);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-bg { ' +
      hardcodeCoordsHilite($statusNode) + ' } '));
    $statusNode.addClass(CN_gbarToolsNotificationUnitBgZero);
    styleNode.appendChild(document.createTextNode('.' + CN_gpmeCommentCountNoHilite + ' > .gpme-comment-count-bg' + ' { ' +
      hardcodeCoordsNohilite($statusNode) + ' } '));
    if (! statusOff)
      $statusNode.removeClass(CN_gbarToolsNotificationUnitBgZero);
  } else {
    // Sometimes this happens with G+ for some reason.  Happened at times when I was
    // reloading a profile page.
    error("injectSomeStyles: Can't find status bg node.");
  }

  // Copy G+ notification status fg style because original is by ID
  $statusNode = $(S_gbarToolsNotificationUnitFg);
  if ($statusNode.length) {
    // We have to temporarily remove the class 'gbids' (turns bg to
    // gray), which seems to be there by default.
    statusOff = $statusNode.hasClass(CN_gbarToolsNotificationUnitFgZero);
    if (statusOff)
      $statusNode.removeClass(CN_gbarToolsNotificationUnitFgZero);
    styleNode.appendChild(document.createTextNode('.gpme-comment-count-fg { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    $statusNode.addClass(CN_gbarToolsNotificationUnitFgZero);
    styleNode.appendChild(document.createTextNode('.' + CN_gpmeCommentCountNoHilite + ' > .gpme-comment-count-fg' + ' { ' +
      window.getComputedStyle($statusNode.get(0)).cssText + ' } '));
    if (! statusOff)
      $statusNode.removeClass(CN_gbarToolsNotificationUnitFgZero);
  } else {
    // Sometimes this happens with G+ for some reason.  Happened at times when I was
    // reloading a profile page.
    error("injectSomeStyles: Can't find status fg node.");
  }

  document.getElementsByTagName('head')[0].appendChild(styleNode);
}

/**
 * Injects code to make the Feedback button work
 */
/*
function injectNewFeedbackLink() {
  var $link = $('.a-eo-eg');
  alert($link.attr('onclick'));
  $link.attr('onclick', 'alert("crap");');
  $link.click(function(event) { alert("yes"); if (confirm("sheeet")) return appfeedback.startFeedback(event); else return false; });
  $link.click(function(event) { alert("yes") });
  $link.attr('onclick', 'alert("yes");');
  alert($link.attr('onclick'));
}
*/

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
  ( typeof $subtree != 'undefined' ? $subtree : $(S_circleStream) ).find(S_post).each(function(i, item) {
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
  $stream.children(S_post + '[id^="' + ID_SGP_POST_PREFIX + '"]:not(.gpme-enh):not([gpme-nukeme])').each(function(i, item) {
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

    var $itemGuts = $item.children();
    var isPostEmpty = false;
    if (! $itemGuts.length) {
      isPostEmpty = true;
      error("updateItem: Can't find any content of item " + id);
      console.error($item.get(0));
      return;
    } else if ($itemGuts.is(':empty')) { // Placeholder, for hangouts and photo albums
      isPostEmpty = true;
    }
    if (! isSgpPost && isPostEmpty) {
      // The content may come a bit later
      if (typeof attempt == 'undefined')
        attempt = 0;
      if (attempt < 29) {
        setTimeout(function() { updateItem($item, attempt + 1); }, 100 );
      } else {
        error("updateItem: Can't get any content within 3 seconds. Giving up");
      }
      return;
    }

    // NOTE: Check for S_postContainer because we want to make sure that our CSS class names are correct
    if (! $itemGuts.filter(S_postContainer).length) {
      error("updateItem: Can't find the right content inside item " + id + "; has Google+ changed its CSS class names?");
      console.error($item.get(0));
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
      var $allCommentContainer = $item.find(S_postComments);
      // It's possible not to have comments at all on posts with comments
      // disabled or on photo-tagging posts
      if ($allCommentContainer.length) {
        $commentbar = $commentbarTpl.clone(true);
        $allCommentContainer.prepend($commentbar);

        // Insert wrapper for comments container so that we can hide it without
        // triggering DOMSubtreeModified events on the container
        $wrapper = $commentsWrapperTpl.clone().insertAfter($commentbar);
        [ S_postCommentsToggler, S_postCommentsList ].forEach(function(item) {
          $wrapper.append($allCommentContainer.find(item));
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

  // Bottom bar for all modes
  var $bottombar = $item.children('.gpme-bottombar');
  if (! $bottombar.length) {
    $bottombar = $bottombarTpl.clone(true);
    $item.append($bottombar);

    // We used to only have the bottombar enabled at times; now users want it all the time
    enableBottombar($bottombar);
  }

  // Refresh opacity of collapse bars
  var $unfoldedTitlebar = $item.find('.gpme-titlebar > .gpme-title-unfolded');
  if (settings.nav_showTopCollapseBarWhen == 'always') {
    $unfoldedTitlebar.css('opacity', 1);
  } else {
    $unfoldedTitlebar.css('opacity', 0);
  }
  // If we have a bottombar.
  // NOTE: there may still be a remnant of a bottombar if user switches from expanded mode to list mode
  if ($bottombar.length) {
    if (settings.nav_showBottomCollapseBarWhen == 'always') {
//      enableBottombar($bottombar);
      $bottombar.css('opacity', 1);
    } else {
//      disableBottombar($bottombar);
      $bottombar.css('opacity', 0);
    }
  }

  // Refresh fold of comments if visible
  if (! itemFolded && canHaveComments) {
    refreshCommentsFold(id, $item);
  }

  // Start listening to updates to comments.
  // We need to listen all the time since comments can come in or out.
  if (enhanceItem && ! isSgpPost) {
    constructCommentHeightChangedRegExp();

    // We must have one throttle function per comment section within item.
    // Test: 500 comments https://plus.google.com/112063946124358686266/posts/PiLy9zLpd3j
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
        if (id && id.charAt(0) == ':' && id.indexOf('.editor') < 0)
          return;

        // If it doesn't have an id (a comment being updated or the comment editor), then
        // check for specific class names.
        if (! id) {
          // or the class is one of the divs we want
          var className = e.target.className;
          if (! commentsHeightChangedRegExp || ! commentsHeightChangedRegExp.test(className))
            return;
        }

        //debug("DOMSubtreeModified PASSED for comments id=" + id + " class=" + className);

        // Finally call our throttled callback
        commentsUpdateHandler(e);
      });
    });
  }
}

/**
 * Progressively constructs a regular expression that catches the elements in the comments
 * section that we care about, i.e. which impact the height of the comment sidebar.
 * For performance, we don't go seeking to automap these elements, except for the first time
 * this function is run.  We assume that foreachCommentContainer would have already triggered the
 * automapping of the elements, except for postCommentContentExpandable, by the time the regexp gets used.
 */
function constructCommentHeightChangedRegExp() {
  /**
    * Add the classNames in the classList and reconstructs an updated regexp
    */
  function addToCommentsHeightChangedClassList(classList) {
    var i;
    for (i = classList.length; i--; )
      commentsHeightChangedClassList.push(classList[i]);

    // it doesn't look like any class names would be a superstring of these
    var regexpString = '';
    for (i = commentsHeightChangedClassList.length; i--; ) {
      if (regexpString !== '')
        regexpString += '|';
      regexpString += commentsHeightChangedClassList[i].split(/\s+/).join('|');
    }
    commentsHeightChangedRegExp = new RegExp('(?:^|\\s)(?:' + regexpString + ')(?:\\s|$)');
    commentsHeightChangedElementsRemaining--;
    //debug('addToCommentsHeightChangedClassList: regexp=' + commentsHeightChangedRegExp);
  }

  // If this is the first time we're running, initialize
  if (! commentsHeightChangedClassList) {
    commentsHeightChangedClassList = [];
    // Get the class names for each of these elements on promise
    ['postCommentsToggler',
     'postCommentsList',
     'postCommentsStream',
     'postCommentContentExpandable'].forEach(function(key) {
      commentsHeightChangedElementsRemaining++;
      X.classList(key, X.QUERY_PROMISE).done(addToCommentsHeightChangedClassList);
    });
  }

  // If we're not done constructing the regexp, let's keep looking for expandable comments
  if (commentsHeightChangedElementsRemaining > 0)
    X.classList('postCommentContentExpandable');
}


/**
 * Updates the display of comments
 */
function updateItemComments($item) {
  var id = $item.attr('id');

  var $comments = $item.find('.gpme-comments-wrapper');
  // Photo-tagging posts don't have comments
  if ($comments.length != 1) {
    return;
  }

  var commentCount = countComments($comments);
  updateCommentbar(id, $item, commentCount);
  /*
  if ($item.hasClass('gpme-comments-folded')) {
    foldComments(false, $item);
  } else {
    unfoldComments(false, $item);
  }
  */
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
        if ($lastItem.length && $lastItem.hasClass('gpme-enh') && ! isItemMutedOrDeleted($lastItem)) {
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

    if (isItemMutedOrDeleted($item)) {
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

    if (isItemMutedOrDeleted($item)) {
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
    var predictedItemOffset = $item.offset().top;
    // If we folded an item above the selected item, then we need to shift
    // the predicted offset
    if (lastItemOffset != -1 && lastItemOffset < predictedItemOffset)
      predictedItemOffset -= lastItemHeightLoss;

    // Calc the body height once the last item is folded and the selected
    // item is unfolded
    var predictedBodyHeight = $body.height() - lastItemHeightLoss + (predictedItemHeight - foldedItemHeight());

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
      $body.animate({scrollTop: $body.scrollTop() - scrollDist }, 'fast', 'jswing');
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
  //debug("foldItem: id=" + id);
  if (interactive && displayMode == 'expanded')
    lsSet(LS_FOLDED, id, 1);
  // Persist for both list/expanded mode
  if (interactive)
    lsSet(LS_READ, id, 1);

  // Visual changes
  //$post.fadeOut().hide(); // This causes race-condition when double-toggling quickly.
  if (animated) {
    $item.css('min-height', '' + foldedItemHeight() + 'px');
    $post.slideUp('fast', 'jswing', function() {
      $item.css('min-height', '');
      $item.addClass('gpme-folded');
      $item.removeClass('gpme-unfolded');
      if (interactive) {
        updateCachedSgpItem($item);
        if (! options.batch)
          updateContentPaneButtonsThrottled();
      }
    });
  } else {
    $post.hide();
    $item.addClass('gpme-folded');
    $item.removeClass('gpme-unfolded');
    if (interactive) {
      updateCachedSgpItem($item);
      if (! options.batch)
        updateContentPaneButtonsThrottled();
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

  // Attached or pending title summary
  var $subtree;

  // If not yet done, put hover event handler and put content in titlebar (summary)
  var $title = $subtree = $item.find('.gpme-title-folded');
  if (typeof $title.attr('gpme-has-content') == 'undefined') {
    $title.attr('gpme-has-content', 'true');

    // NOTE: don't just take the first div inside post content title because
    // sometimes the hangout 'Live' icons is there
    var $srcTitle = $item.find(S_postContainer + " " + (isSgpPost ? _C_SGP_TITLE : S_postHead));
    if ($srcTitle.length != 1) {
      error("foldItem: can't find (unique) post content title node");
      error($item);
    } else {
      // Check if the permissions are limited
      // Other possibilities: Public, Extended circles
      var $perms = $srcTitle.find(S_postPermissions);
      if ($perms.length && $perms.text() == getMessage('gplus_permsLimited'))
        $title.addClass('gpme-perms-limited');

      var $clonedTitle = $titleTpl.clone(true);
      var $sender = $titleSenderTpl.clone().click(onTitleClick);
      $clonedTitle.append($sender);
      var $clonedTitleName = $srcTitle.find(S_postUserName).clone();
      $sender.append($clonedTitleName);

      var $srcPhoto = $post.find(S_postUserAvatarA);
      if ($srcPhoto.length)
        $sender.prepend($srcPhoto.clone());
      
      // Insert "mobile"/"check-ins" icons
      var $source = $srcTitle.find(S_postCategory);
      if ($source.length) {
        var sourceText = $source.text();
        // Maybe FIXME: English-only, but so far Google uses only English
        switch (sourceText) {
        case 'Google Check-ins':
          $sender.append($checkinIconTpl.clone());
          break;
        case 'Mobile':
          $sender.append($mobileIconTpl.clone());
          break;
        case 'Hangout':
          var $hangoutJoinButton = $post.find('%hangoutJoinButton');
          // FIXME: haven't checked what happens when hangout ends
          $clonedTitle.append($post.find('%hangoutJoinButton').length ?
            $hangoutLiveIconTpl.clone() :
            $hangoutLiveInactiveIconTpl.clone()); // https://plus.google.com/116805285176805120365/posts/8eJMiPs5PQW
          break;
        case 'Photos':
          /* We already picked out photos.  Move code into here?  */ true;
          break;
        case 'Game Update':
          $sender.append($gameIconTpl.clone());
          break;
        default:
          if (sourceText.indexOf('+1') >= 0) {
            $sender.append('\u00a0+1');
          } else { // For non-English or new unrecognized things
            $clonedTitle.append($titleDashTpl.clone());
            $clonedTitle.append($source.text());
          }
          break;
        }
      }

      var $itemGuts = $post.children(S_postContainer);
      var $content = $itemGuts.children(isSgpPost ? _C_SGP_CONTENT : S_postBody);
      if (! $content.length) {
        error("foldItem: Can't find the item guts or contents for id=" + id);
      } else {

        // Quoted sender's photo plus a dash
        $srcPhoto = $itemGuts.find(_C_QUOTED_PHOTO);
        if ($srcPhoto.length)
          $sender.append($titleQuoteTpl.clone()).append($srcPhoto.clone().attr('style', 'margin: 0'));

        // Photos in content?
        // Possibly-multiple images in the content
        //$srcPhoto = $content.find('img').not(_C_QUOTED_PHOTO).not(_C_MAP_IMG);
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
          var $link = $content.find(_C_CONTENT_LINK_TITLE);
          if ($link.length) {
            $clonedTitle.append($linkIconTpl.clone().css('float', 'right'));
          }
        }

        // Insert a little dash
        $clonedTitle.append($titleDashTpl.clone());

        // Inject the summary title
        $title.append($clonedTitle);
        if (isSgpPost && interactive)
          updateCachedSgpItem($item, $clonedTitle);

        // Put in snippet, trying differing things
        // NOTE: this must be done after injecting the title so that we can get the height of the snippet
        var $snippet = $titleSnippetTpl.clone(), snippetHtml = '';
        $clonedTitle.append($snippet);
        var classes = isSgpPost ? [
          _C_SGP_TEXT1,
          _C_SGP_TEXT2
        ] : [
          _C_CONTENT_POSTER_TEXT,
          _C_CONTENT_QUOTED_TEXT, // This must come before _C_CONTENT_POSTER_TEXT2 to differentiate
          _C_CONTENT_POSTER_TEXT2, // Goes together with next line
          _C_CONTENT_LINK_TITLE, // Link (must come after _C_CONTENT_POSTER_TEXT2
          _C_CONTENT_LINK_TEXT,
          S_CONTENT_HANGOUT_TEXT,
          S_CONTENT_PHOTO_COMMENT,
          S_CONTENT_PHOTO_CAPTION,
          S_CONTENT_VIDEO_CAPTION,
          _C_CONTENT_CHECKIN_LOCATION
        ];
        for (var c in classes) {
          var $candidate = $post.find(classes[c]);
          if (! $candidate.length)
            continue;

          // We want to ignore link shares that only have the text Edit -- this is one's own posts
          // <span class="a-da-k ez Xq">Edit</span>
          if (classes[c] == _C_CONTENT_POSTER_TEXT || classes[c] == _C_CONTENT_POSTER_TEXT2) {
            $candidate = $candidate.clone();
            $candidate.find(_C_CONTENT_EDIT).remove();
          }
          var text = $candidate.html().replace(/(<(br|p)\s*\/?>\s*)+/gi, ' \u2022 ').replace(/<\/?[^>]+?>/g, '').replace(/ \u2022\s*$/, '');
          if (text.match(/[^\s\u2022]/)) {
            if (classes[c] == S_CONTENT_HANGOUT_TEXT) {
              // TODO: test in multiple languages (English, Spanish, Chinese ok)
              text = text.replace(/.*?(\d+)/, '$1');
            }
            if (snippetHtml !== '') {
              snippetHtml += ' \u2022 ';
              // Skip _C_CONTENT_POSTER_TEXT2 if _C_CONTENT_QUOTED_TEXT already gave us text
              // because we don't want to duplicates and the two class names are hard to differentiate
              if (classes[c] == _C_CONTENT_POSTER_TEXT2)
                continue;
            }
            text = htmlDecode(text).substring(0, 500); // We have to call() to avoid XSS
            if (classes[c] == _C_CONTENT_CHECKIN_LOCATION)
              snippetHtml += '<i>@&nbsp;' + htmlEncode(text) + '</i> ';
            else if (classes[c] == _C_CONTENT_POSTER_TEXT || classes[c] == _C_CONTENT_POSTER_TEXT2 || classes[c] == S_CONTENT_PHOTO_COMMENT)
              snippetHtml += htmlEncode(text) + ' ';
            else 
              snippetHtml += '<i>' + htmlEncode(text) + '</i> ';
            $snippet.html(snippetHtml);
            //debug("snippet height = " + $snippet.height());

            // If we have enough content break
            if (($snippet.height() - ITEM_FONT_HEIGHT) / ITEM_LINE_HEIGHT + 1 > settings.nav_summaryLines)
              break;
          }
        }

        // If any, move "- Muted" to right after date and before the " - "
        $srcTitle.find(S_postHeadInfoMuted).clone().insertAfter($clonedTitleName);

        // Add buttons & comment-count container
        // NOTE: this must be done after injecting the title
        var $buttonArea = newButtonArea($item);
        $clonedTitle.before($buttonArea);
        updateButtonArea($item, $buttonArea);

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
              $dateA = $itemGuts.find(isSgpPost ? _C_SGP_DATE : S_postTime + ' > a');

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
      $comments.css({'height': '', 'overflow': ''});
    }

    // Updated the counts
    updateCommentCount(id, $item, commentCount);
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
  //debug("unfoldItem: id=" + id);

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

  if (canHaveComments) {
    // NOTE: this must be done after the CSS classes are updated, but
    // before animation (otherwise the height is wrong)
    refreshCommentsFold(id, $item);

    if (interactive && ! areItemCommentsFolded($item))
      deleteSeenCommentCount(id);
  }

  if (animated) {
    $post.slideDown('fast', 'jswing', function() {
      if (interactive)
        updateCachedSgpItem($item);
    });
  } else {
    $post.show();
    if (interactive)
      updateCachedSgpItem($item);
  }
  if (interactive && ! options.batch)
    updateContentPaneButtonsThrottled();

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
    var $copyright = $(S_copyrightRow);

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
  var $unmuteLink = $item.filter(S_postIsMutedOrDeleted).find('[role="button"]');
  var unmuteFound = false;
  if ($unmuteLink.length && $unmuteLink.is(':visible')) {
    unmuteFound = true;
  } else {
    $unmuteLink = $item.find(S_postMenuItemUnmute);
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
    var $muteMenu = $item.find(S_postMenuItemMute);
    if ($muteMenu.length) {
      // If the item is folded, we need to set a max-height so that G+'s muting
      // scrolling animation doesn't start from so low
      if (isItemFolded($item)) {
        $item.css('max-height', '' + MUTED_ITEM_HEIGHT + 'px');
        setTimeout(function() { $item.css('max-height', ''); }, 2000);
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
        var $sibling;
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
function isItemMutedOrDeleted($item) {
  return $item.is(S_postIsMutedOrDeleted);
}

/**
  * Trigger the more button
  */
function clickMoreButton() {
  // Scroll it into view
  var $moreButton = $(S_circleStreamMoreButton);
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
  var $expandLink = $item.find(S_postCommentContentExpandButton);
  if ($expandLink.length) {
    $expandLink.each(function(i, item) {
      click(item);
    });
    return;
  }

  var $commentsButton = $item.find(S_postCommentsOlderButton);
  if ($commentsButton.length && $commentsButton.is(':visible')) {
    click($commentsButton);
  } else {
    $commentsButton = $item.find(S_postCommentsButtonChevron_expand);
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
    var $expandLink = $item.find(S_postContentExpandButton);
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
 * Post buttons
 ***************************************************************************/

/**
 * Returns button area, modified to fit the post type
 */
function newButtonArea($item) {
  var $buttonArea = $buttonAreaTpl.clone(true);
  return $buttonArea;
}

/**
 * Shows/hides buttons as needed
 * @param $subtree: Optional
 */
function updateButtonArea($item, $subtree) {
  if (typeof $subtree == 'undefined')
    $subtree = $item;

  var $muteButton = $subtree.find('.gpme-mute-button');
  var $muteMenu = $item.find(S_postMenuItemMute);
  if ($muteMenu.length) {
    return $muteButton.show();
  } else {
    return $muteButton.hide();
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
  //debug("foldComments: id=" + id);
  var commentCount = countComments($comments);

  // If result of user action
  if (interactive) {
    // Persist
    if (! settings.nav_global_commentsDefaultCollapsed)
      lsSet(LS_COMMENTS_FOLDED, id, 1);
    lsRemove(LS_COMMENTS_UNFOLDED, id);

    saveSeenCommentCount(id, commentCount);

    // Visual changes

    // If there's a G+ comment button, then we're set; otherwise, we have keep a minimum height
    // to smoothly transition to gpme-comments-title-folded
    var minHeight = 0;
    var $commentsButton = $comments.find(S_postCommentsToggler);
    if (! $commentsButton.length || ! $commentsButton.is(':visible'))
      minHeight = COMMENTS_TITLE_FOLDED_OUTERHEIGHT;

    var shownCommentCount = countShownComments($item);
    var duration = shownCommentCount <= 4 ? JQUERY_DURATION / 2  : shownCommentCount <= 10 ? JQUERY_DURATION : JQUERY_DURATION * 1.5;
    var easing = 'easeOutQuart';

    var $commentsTitleUnfolded = $item.find('.gpme-comments-title-unfolded');
    $commentsTitleUnfolded.css('min-height', COMMENTS_TITLE_FOLDED_OUTERHEIGHT).
      animate({height: 0, opacity: 0}, duration, easing, function() {
        $commentsTitleUnfolded.css({'min-height': '', 'height': '', 'opacity': ''});
      });

// No need for min-height if there's CN_postCommentsToggler there anyway
//    $comments.css('min-height', '27px').slideUp(duration, function() {
    var $shownOrOlderComments = $comments.find(S_postCommentsList);
    slideUpFromTop($shownOrOlderComments, minHeight, duration, easing, function() {
      // 2011-08-17 Due to G+'s new comment refresh, the page auto scrolls if display:none
      $comments.css({height: 0, overflow: 'hidden'}); //$comments.hide();
      $item.addClass('gpme-comments-folded');
      $item.removeClass('gpme-comments-unfolded');
      var $commentsSnippet = $item.find('.gpme-comments-snippet');
      $commentsSnippet.hide().fadeIn(JQUERY_DURATION);
      updateCommentbar(id, $item, commentCount);
      updateCachedSgpItem($item);
    });

    // Scroll the page properly in parallel
    /* Doesn't work well since G+'s comment toggling and our new easing.
    // Favor the share line first so there's no unnecessary motion
    var $ = $item.find(S_postActionBar);
    ($shareLine.length? $shareLine : $item.find('gpme-commentbar')).scrollintoview({ duration: duration, easing: 'linear', direction: 'y' });
    */
    var commentsTop = $comments.offset().top;
    if (commentsTop < $('body').scrollTop())
      $('body, html').animate({scrollTop: commentsTop - 100}, duration, easing);

  } else {
    // Visual changes

    // Hide the comments, but only if the item is not folded.
    // Otherwise, when comments come in, DOMSubtreeModified will be triggered which
    // calls this function and then re-hides the comments; the comments will disappear
    // from the preview.
    if (! $item.hasClass('gpme-folded')) {
      // 2011-08-17 Due to G+'s new comment refresh, the page auto scrolls if display:none
      $comments.css({height: 0, overflow: 'hidden'}); //$comments.hide();
    }

    $item.addClass('gpme-comments-folded');
    $item.removeClass('gpme-comments-unfolded');
  }

  // If not yet done, put content in titlebar
  var $title = $item.find('.gpme-comments-title-folded');
  if (typeof $title.attr('gpme-comments-has-content') == 'undefined') {
    $title.attr('gpme-comments-has-content', 'true');

    // Add floating comment-count container
    var $buttonArea = newButtonArea($item);
    $title.prepend($buttonArea);
    updateButtonArea($item, $buttonArea);

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
  //debug("unfoldComments: id=" + id);
  var commentCount = countComments($comments);

  if (interactive) {
    // Persist
    if (settings.nav_global_commentsDefaultCollapsed)
      lsSet(LS_COMMENTS_UNFOLDED, id, 1);
    lsRemove(LS_COMMENTS_FOLDED, id);

    // Interactive visual changes

    // Variables depending on number of visible comments
    var shownCommentCount = countShownComments($item);
    // No matter how many comments there are, we want a consistent speed for the initial part of the slide down.
    var duration = JQUERY_DURATION * (
        shownCommentCount < 10 ? 0.5 :
        shownCommentCount < 50 ? 1 :
        shownCommentCount > 150 ? 2 :
          1 + (shownCommentCount - 50) / 100);
    var easing = shownCommentCount > 50 ? 'easeInQuart' : 'easeInOutQuart';
    /*
    var commentsTitleUnfoldedIndependently = false;
    if (duration > JQUERY_DURATION * 2) {
      commentsTitleUnfoldedIndependently = true;
      setTimeout(function() {
        $commentsTitleUnfolded.height($comments.outerHeight()).fadeIn(JQUERY_DURATION);
      }, JQUERY_DURATION * 2);
    }
    */

    // If there's a G+ comment button, then we're set; otherwise, we have start from a minimum height
    // to smoothly transition from gpme-comments-title-folded
    var minHeight = 0;
    var $commentsButtonContainer = $comments.find(S_postCommentsToggler);
    if (! $commentsButtonContainer.length || ! $commentsButtonContainer.is(':visible'))
      minHeight = COMMENTS_TITLE_FOLDED_OUTERHEIGHT;

    var $commentsTitleFolded = $item.find('.gpme-comments-title-folded');
    var $commentsTitleUnfolded = $item.find('.gpme-comments-title-unfolded');
    var $shownOrOlderComments = $comments.find(S_postCommentsList);
    if (! $shownOrOlderComments.length) {
      error("unfoldComments: can't find shownOrOldeComments container");
      error($item);
      return;
    }

    $commentsTitleFolded.hide(); // hide a bit early
    $comments.css({height: '', overflow: ''}); //$comments.show();

//    $comments.slideDown(duration, function() {
    slideDown($shownOrOlderComments, minHeight, duration, easing, function() {
      $item.removeClass('gpme-comments-folded');
      $item.addClass('gpme-comments-unfolded');
      $commentsTitleFolded.css('display', ''); // Undo the hide above
      // NOTE: updateCommentbar needs to be done after updating classes
      updateCommentbar(id, $item, commentCount);
      //if (! commentsTitleUnfoldedIndependently)
      $commentsTitleUnfolded.fadeIn(Math.min(JQUERY_DURATION, duration));
      updateCachedSgpItem($item);

      // Start loading any hidden comments.
      var $commentsButton = $item.find(S_postCommentsButtonChevron_expand);
      if ($commentsButton.length && $commentsButton.is(':visible'))
        click($commentsButton);
    });

    deleteSeenCommentCount(id);
  } else {
    // Automated visual changes
    $comments.css({height: '', overflow: ''}); //$comments.show();
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
  //debug("updateCommentbar");
  updateCommentCount(id, $item, commentCount);
  updateCommentsSnippet(id, $item, commentCount);
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
  var $countBg = $container.children(".gpme-comment-count-bg");
  var $countFg = $container.children(".gpme-comment-count-fg");

  // Clear any old timers we may have
  if (lastCommentCountUpdateTimers.hasOwnProperty(id)) {
    clearTimeout(lastCommentCountUpdateTimers[id]);
    delete lastCommentCountUpdateTimers[id];
  }

  // NOTE: we have 2 comment counts
  var oldCount = $countFg.first().html();
  if (typeof oldCount != 'undefined' && oldCount !== null && oldCount !== '')
    oldCount = oldCount.replace(/.*>/, ''); // In case of middle of another animation
  var oldNoHilite = $countBg.first().hasClass(CN_gpmeCommentCountNoHilite);

  // Change background of count
  var seenCount = lsGet(LS_COMMENTS_READ_COUNT, id);
  var seenCountChanged = false;
  // seenCount === null && count > 0 : in list mode, there is no seen count on new folded posts
  // seenCount !== null && count != seenCount : count has changed since last seen
  // 'gpme_post_seen_comment_count_changed_' + id in localStorage : count is the same but was
  //    different before, which means e.g. a comment was deleted and another inserted
  if ((seenCount === null && count > 0 ) || (seenCount !== null && count != seenCount) ||
      (seenCountChanged = lsGet(LS_COMMENTS_READ_COUNT_CHANGED, id))) {
    var newCount = count - (seenCount !== null ? seenCount : 0);
    animateCount($countFg, oldCount, newCount, function() {
      $container.removeClass(CN_gpmeCommentCountNoHilite);
      $container.removeClass('gpme-hide');
      $buttonArea.addClass('gpme-new-comments');
    });

    // Keep track of comment count changes, so that "0" stays red (when
    // someone deletes a comment)
    if (seenCount !== null && ! seenCountChanged) {
      // But give G+ time to quickly move comments from one section to another
      lastCommentCountUpdateTimers[id] = setTimeout(function() {
        //debug("lastCommentCountUpdateTimers: setting id=" + id);
        lsSet(LS_COMMENTS_READ_COUNT_CHANGED, id, 1);
        delete lastCommentCountUpdateTimers[id];
      }, 200);
    }
  } else {
    $container.addClass(CN_gpmeCommentCountNoHilite);
    $buttonArea.removeClass('gpme-new-comments');
    if (count) {
      // If we used to be hilite, then wee don't animate -- the user just marked as read.
      if (! oldNoHilite)
        $countFg.text(count);
      else 
        animateCount($countFg, oldCount, count, function() {
          $container.removeClass('gpme-hide');
        });
    } else { // If 0, no need to show
      $container.addClass('gpme-hide');
    }
  }
}

/**
 * Copy Google+'s animation.
 * XXX This doesn't animate when going from gray 1 to red 1
 */
function animateCount($countFg, oldCount, newCount, callback) {
  // We should always try to set the count, even if it supposedly hasn't changed
  // because it's possible that the 2nd comment count didn't exist at one point
  // but now needs to be set for the first time.
  if (oldCount === null || oldCount === '' || '' + newCount === oldCount) { 
    $countFg.text(newCount);
    callback();
  } else {
    $countFg.html('' + oldCount + '<br />' + newCount);
    $countFg.animate({scrollTop : $countFg.height()}, 400, function() {
      $countFg.text(newCount);
      callback();
    });
  }
}

/**
 * Update the summary of comments with names of commenters.
 * NOTE: due to the way Google orders the names (oldest to most recent)
 * and cuts off past a number of names, we have to stick to that order.
 * @param {integer} commentCount: says how many comments there are in total
 */
function updateCommentsSnippet(id, $item, commentCount) {
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

  var $shownNames = $commentWrapper.find(S_postCommentUserNames).reverse();
  $shownNames.each(function() { if (addNameUnique($(this).text()) > 15) return false; });
  // Pad with some older names
  if (names.length < 15) {
    // FIXME: only handles English "hand"
    $commentWrapper.find(S_postCommentsButtonNames).text().split(/,\s*| and /).forEach(function(item) {
      if (addNameUnique(item) > 15) return false;
    });
  }

  text = names.join(', ');
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
  var $comments = $subtree.find(S_postCommentsTogglerCount);
  if ($comments.length) {
    commentCount += parseTextCount($comments.html().replace(/<.*/, ''));
  } else {
    commentCount += countShownComments($subtree);
    $comments = $subtree.find(S_postCommentsOlderButton_count);
    if ($comments.length)
      commentCount += parseTextCount($comments.text());
  }

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
  return $subtree.find(S_postComment).length;
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
  if (isItemMutedOrDeleted($item))
    return;

/*
  // Start a timer for marking the item as read
  if (markItemAsReadTimer) {
    clearTimeout(markItemAsReadTimer);
    markItemAsReadTimer = null;
  }
  markItemAsReadTimer = setTimeout(function() { markItemAsRead($item); }, MARK_ITEM_AS_READ_WHEN_PREVIEW_SHOWN_DELAY);
*/

  var $post = $item.children('.gpme-post-wrapper');
  if ($post.length) {
    // Block clicks temporarily
    var $clickWall = $item.find('.gpme-disable-clicks');
    $clickWall.show();
    setTimeout(function() { $clickWall.hide(); } , clickWallTimeout);

    // Enhance with our own commenting links
    if (! $item.hasClass('gpme-preview-enh')) {
      var $commentLink = $item.find(S_postCommentLink + ',' + S_postCommentButton);
      // NOTE: Comments could be disabled for that post
      if ($commentLink.length) {
        // NOTE: Replies and More incorrectly injects the same 'a-b' class
        // But this code will work for both G+ and Replies and More (if they've
        // injected before the first preview pops up)
        $commentLink.each(function(i, value) {
          var $value = $(value);
          // NOTE: we leave the classNames for postCommentButton so that G+ hides our box when
          // user starts editing
          $value.clone().removeClass(X.classNames('postCommentLink')).
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

    // Position horizontally

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
    //var spaceToRight = $(document).width() - $(window).scrollLeft() - $item.get(0).getBoundingClientRect().right - 10;
    var spaceToRight = $(document).width() - $item.offset().left - $item.width() - 10;
    var widthNeeded = $post.outerWidth() + 8;

    // Place to the right if there's room
    if (spaceToRight >= widthNeeded) {
      $post.css('right', '' + -Math.min(widthNeeded, spaceToRight) + 'px');
      $post.css('left', 'auto');
      $post.removeClass('gpme-preview-right');
    } else {
      var spaceToLeft = $item.offset().left;
      //debug(e);
      debug("e.offsetX=" + e.offsetX + " boundary=" + ($item.width() - RIGHT_BUTTON_AREA_OFFSET_LEFT - 2));
      // Place over the posts to the left of the right button area if there's no room on the left
      // or if the mouse is over to the right, near the button area.
      if (spaceToLeft < widthNeeded ||
          e.pageX >= spaceToLeft + $item.width() - RIGHT_BUTTON_AREA_OFFSET_LEFT) {
        $post.css('right', '' + (RIGHT_BUTTON_AREA_OFFSET_LEFT + TRIANGLE_WIDTH - 3) + 'px');
        $post.css('left', 'auto');
      } else {
        // Place to the left
        $post.css('left', '' + -Math.min(widthNeeded, spaceToLeft) + 'px');
        $post.css('right', 'auto');
      }
      $post.addClass('gpme-preview-right');
    }

    // Position vertically

    var fixedHeight = fixedBarsHeight();
    var overlappingHeight = overlappingBarsHeight();

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
    var $itemGuts = $post.children(S_postContainer);
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
    $post.hover(onPreviewMouseEnter, onPreviewMouseOut);

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
  var $itemGuts = $item.children('.gpme-post-wrapper').children(S_postContainer);

  // Hide so that there's no scrolling
  $itemGuts.hide();
  click($origLink);
  $itemGuts.show();
  // Scroll to bottom
  $itemGuts.animate({ scrollTop: $itemGuts.outerScrollHeight()  }, JQUERY_DURATION);

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
 * Responds to mouse enter events
 */
function onPreviewMouseEnter() {
  var $post = $(this);
  var $item = $post.closest(S_post);

  // Start a timer for marking the item as read
  if (markItemAsReadTimer) {
    clearTimeout(markItemAsReadTimer);
    markItemAsReadTimer = null;
  }
  // FIXME: until we get it right
  //markItemAsReadTimer = setTimeout(function() { markItemAsRead($item); }, MARK_ITEM_AS_READ_WHEN_PREVIEW_HOVERED_DELAY);

  // Show the scrollbars
  showPreviewScrollbar($post);

  // Disable the page's scrollbars
  // Don't disable the scrollbar if this is a post that gets completely rewritten,
  // a hangout or a photo album with tags.
  // The reason, is if the preview is up, and the post disappears, then page's scrollbars
  // wont' come back.
  if (! $item.length || ! $item.find(S_CONTENT_PHOTO_TAGGED + ',' + S_hangoutLiveIcon).length)
    disableBodyScrollbarY();
}

/**
 * Responds to mouse out events
 */
function onPreviewMouseOut() {
  var $item = $(this).closest(S_post);

  // Re-eable the page's scrollbars
  enableBodyScrollbarY();
}

/**
 * Show the preview's scrollbars
 */
function showPreviewScrollbar($post) {
  $post.addClass('gpme-hover');
}

/**
 * Show the preview's scrollbars
 */
function hidePreviewScrollbar($post) {
  $post.removeClass('gpme-hover');
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
  $(S_gbarTop).css({'max-width': '' + width + 'px', 'position': 'relative'});
  $(S_gplusBar).css({'max-width': '' + width + 'px'});
  $(S_content).css('max-width', '' + width + 'px');
  $(S_feedbackLink).css('right', '' + (newWidth - width - 1) + 'px');
}

/**
 * Re-enable the document's scrolling.  See disableBodyScrollbarY();
 */
function enableBodyScrollbarY() {
  var $body = $('html');
  $body.css({'overflow-y': '', 'max-width': ''});
  var $gbar = $(S_gbar);
  $(S_gbarTop).css({'max-width': '', 'position': ''});
  $(S_gplusBar).css({'max-width': ''});
  $(S_feedbackLink).css('right', '');
}

/**
 * Hides the preview of the item that was moused-out
 */
function hidePreview(e) {
  var $item = $(this);
  //debug("hidePreview: this=" + $item.attr('class'));
  hidePostItemPreview($item);
}

/**
 * Hides the preview of the specified item
 */
function hidePostItemPreview($item) {
  //debug("hidePostItemPreview:");
  if (!$item || ! isItemFolded($item))
    return;

  // Skip if this is a muted item
  if (isItemMutedOrDeleted($item))
    return;

  // Delete any existing timer
  if (markItemAsReadTimer) {
    clearTimeout(markItemAsReadTimer);
    markItemAsReadTimer = null;
  }

  var $post = $item.children('.gpme-post-wrapper');
  if ($post.length) {
    // Change the max-height of the post content
    var $itemGuts = $post.children(S_postContainer);
    if (! $itemGuts.length) {
      error("showPreview: Can't find post content style class");
    } else {
      // Workaround for scroll-position loss bug in Chrome
      // http://code.google.com/p/chromium/issues/detail?id=36428
      $itemGuts.attr('gpme-last-scrolltop', $itemGuts.scrollTop());

      $itemGuts.css('max-height', '');
    }

    // Unbind to restore scrollbars
    $post.hide().unbind('mouseenter', onPreviewMouseEnter).unbind('mouseleave', onPreviewMouseOut);
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
  //debug("hideAnyPostItemPreview");
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
  //debug("showTopCollapseBar: item=" + $item.attr('id'));

  var $topbar = $item.find('.gpme-titlebar > .gpme-title-unfolded');
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
  //debug("hideTopCollapseBar: item=" + $item.attr('id'));

  var $topbar = $item.find('.gpme-titlebar > .gpme-title-unfolded');
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
  if (settings.nav_showBottomCollapseBarWhen != 'hover')
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
  if ($bottombar.length) {
//    enableBottombar($bottombar);
    $bottombar.animate({opacity: 1}, 100);
  }
}

/**
 * Hide bottom collapse bar if applicable
 */
function hideBottomCollapseBar(e) {
  if (settings.nav_showBottomCollapseBarWhen != 'hover')
    return;

  var $item = $(this).parent();
  debug("hideBottomCollapseBar: item=" + $item.attr('id'));

  var $bottombar = $item.children('.gpme-bottombar');
  if ($bottombar.length) {
    $bottombar.animate({opacity: 0}, 100, function() {
//      disableBottombar($bottombar);
    });
  }
}

/**
 * Enable bottombar
 */
function enableBottombar($bottombar) {
  $bottombar.addClass('gpme-hover').click(onTitleClick);
}

/**
 * Disable bottombar
 */
function disableBottombar($bottombar) {
  $bottombar.removeClass('gpme-hover').unbind('click', onTitleClick);
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
    $subtree.find(S_circleStreamContentPaneHeadingText) : $(S_circleStreamContentPaneHeadingText);
  // Try for profile
  if ($heading.length != 1) {
    $heading = typeof $subtree != 'undefined' ?
      $subtree.find(S_profileHeadingName) : $(S_profileHeadingName);
    // Try for games
    if ($heading.length != 1)
      $heading = typeof $subtree != 'undefined' ?
        $subtree.find(S_gamesActivitiesStreamHeadingText) : $(S_gamesActivitiesStreamHeadingText);
  }

  if ($heading.length != 1) {
    warn("updateContentPaneButtons: Can't find content pane heading");
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
      $subtree.find(S_post + '.gpme-unfolded') : $(S_post + '.gpme-unfolded')).length;
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

/**
 * Throttle this function
 */
function updateContentPaneButtonsThrottled() {
  $.throttle(500, 50, function() { updateContentPaneButtons(); });
}

/****************************************************************************
 * HoverCard
 ***************************************************************************/

// Handler so that we can unbind
var hoverButtonMouseEnterHandler;

// Timer for resetting the hovercard
var resetHoverCardTimer;

// Cached hover card posts
var cachedHoverCardPosts = {};
// Limit the cache size
var lastCachedHoverCardPosts = [];

// Currently-selected tab
var selectedHoverCardTabId;

// Width of a stretched hovercard
var finalHoverCardWidth;

/**
 * Adds event handlers to the hovercards
 */
function listenToHoverCardUpdates() {
  /**
   * Given a document, gets the hovercard and start listening to updates
   */
  function gotDocument($document) {
    // Inject stylesheets into this frame
    var doc = $document.get(0);
    if (doc !== document)
      injectStylesheet(doc);

    var getHoverCard = function() {
      // NOTE: document.defaultView.frameElement is to go the other way.
      var $hoverCard = $document.find('body > div:empty:not(:visible):not([style*="absolute"]), .c-W-kj');

      if ($hoverCard.length > 1)
        error('listenToHoverCardUpdates.gotDocument: found ' + $hoverCard.length + ' hover cards.');

      if ($hoverCard.length) {
        gotHoverCard($hoverCard.first());
      } else {
        debug('listenToHoverCardUpdates.gotDocument: Can\'t find it.  Trying again...');
        setTimeout(function() { getHoverCard(); }, 2000);
      }
    };

    getHoverCard();
  }

  function gotHoverCard($hoverCard) {
    if ($hoverCard.hasClass('gpme-enh'))
      return;
    $hoverCard.addClass('gpme-enh');

    // NOTE: I hacked jquery to make getComputedStyle work within an iframe
    // so that left (and top) can be determined properly and animation works.
    $hoverCard.get(0).ownerDocument.defaultViewForUserScript = window;

    var hoverCard = $hoverCard.get(0);
    var hoverCardUpdatedTimer;
    var hoverCardUpdateHandler = $.throttle(200, 50, function(e) {
      onHoverCardUpdated(e, $hoverCard); });
    debug('listenToHoverCardUpdates.gotDocument: Binding.');
    $hoverCard.bind('DOMSubtreeModified', function(e) {
      if (e.target === hoverCard) {
        if (hoverCardUpdatedTimer)
          clearTimeout(hoverCardUpdatedTimer);
        // Give time for the entire hover card to be constructed
        hoverCardUpdatedTimer = setTimeout(function() { onHoverCardUpdated(e, $hoverCard); }, 100);
      }
    });
  }

  // Listen to updates for the hovercard in the top frame
  gotDocument($(document));

  // Prepare to find the notifications frame
  var $gbarToolsNotification = $(S_gbarToolsNotificationA);
  if (! $gbarToolsNotification.length) {
    error('listenToHoverCardUpdates: can\'t find notification button ' + S_gbarToolsNotificationA);
    return;
  }

  $gbarToolsNotification.click(function() {
    // The notification frame appears after a click and it takes time before everything is constructed
    // So give G+ enough time to set up the structure
    setTimeout(function() { gotDocument($(S_notificationsIframe).contents()); }, 1000);
  });
}

/**
 * Injects our own button into the hovercard
 */
function onHoverCardUpdated(e, $hoverCard) {
  // Add elements if not enhanced
  if (! $hoverCard.hasClass('gpme-enh')) {
    $hoverCard.addClass('gpme-enh');
    var $tbody = $hoverCard.find('tbody');
    if (! $tbody.length) {
      error('onHoverCardUpdated: Can\'t find tbody in hover card');
      return;
    }
    var handler = function(e) { onCardPostsTabClick(e, $hoverCard); };
    var $hoverCardButtonRecentTab = $('<div id="gpme-card-posts-tab-recent" class="gpme-card-posts-tab gpme-card-posts-tab-selected">Recent</div>').click(handler);
    var $hoverCardButtonTopTab = $('<div id="gpme-card-posts-tab-top" class="gpme-card-posts-tab">Top</div>').click(handler);
    var $hoverCardButtonCloudTab = $('<div id="gpme-card-posts-tab-cloud" class="gpme-card-posts-tab">Cloud</div>').click(handler);
    var $hoverCardButtonTabs = $('<div id="gpme-card-posts-tabs" style="display:none"></div>').append($hoverCardButtonRecentTab, $hoverCardButtonTopTab, $hoverCardButtonCloudTab);
    var $hoverCardButtonTd = $('<td colspan=2 id="gpme-card-posts-button"><div id="gpme-card-posts-button-text">Posts</div></td>').append($hoverCardButtonTabs);
    var $hoverButton = $('<tr></tr>').append($hoverCardButtonTd).appendTo($tbody);

    var $cardPosts = $hoverCardPostsTpl.clone().insertAfter($hoverButton);

    selectedHoverCardTabId = 'gpme-card-posts-tab-recent';

    hoverButtonMouseEnterHandler = function() { onCardPostsButtonMouseEnter($hoverCard, $cardPosts, $hoverButton); };

    $hoverButton.bind('mouseenter', hoverButtonMouseEnterHandler);
    $hoverCard.bind('mouseleave', function() { onHoverCardMouseOut($hoverCard, $hoverButton, $cardPosts); });
  }
}

/**
 * Displays posts when posts button on hovercard is hovered
 */
function onCardPostsButtonMouseEnter($hoverCard, $cardPosts, $hoverButton) {
  debug('onCardPostsButtonMouseEnter');
  $hoverButton.unbind('mouseenter', hoverButtonMouseEnterHandler);

  // Animations

  var currentWidth = $hoverCard.width();
  var parentWidth = $hoverCard.parent().width();
  finalHoverCardWidth = Math.min(NOTIFICATION_FRAME_WIDTH, Math.round(parentWidth * 0.99));
  var currentLeft = parseInt($hoverCard.css('left'), 10);
  // Minimum is 1 so that we have a border that matches the other side in the notification area
  var halfWidthGain = (finalHoverCardWidth - currentWidth) / 2;
  var finalLeft = Math.max(1, currentLeft - halfWidthGain -
      Math.max(0, currentLeft + currentWidth + halfWidthGain - parentWidth));
  var currentHeight = $hoverCard.height();
  var finalHeight = currentHeight + 287; // FIXME: hardcoded
  var scrollTop = $hoverCard.closest('body').scrollTop();
  var currentTop = parseInt($hoverCard.css('top'), 10) - scrollTop;
  var overExtended = Math.max(0, currentTop + finalHeight - (window.innerHeight - GBAR_HEIGHT));
  var finalTop = scrollTop + Math.min(currentTop, Math.max(100, currentTop - overExtended));
  $hoverCard.css({maxWidth: '500px', width: '' + currentWidth + 'px'}).
      animate($.extend({width: finalHoverCardWidth, left: finalLeft}, finalTop !== currentTop ? {top: finalTop} : {}),
          'easeOutQuart');
  $cardPosts.show().css('opacity', '1');

  $hoverButton.find('#gpme-card-posts-button-text').fadeOut();
  $hoverButton.find('#gpme-card-posts-tabs').fadeIn();

  var $postsContent = $hoverCard.find('#gpme-card-posts-content');
  $postsContent.slideDown();
  // XXX Don't know why I have to do this but the items sometimes stretch outside the table otherwise.
  $postsContent.children().css('max-width', finalHoverCardWidth - 10);

  // Get the ID of the user
  var $cardUserLink = $hoverCard.find('a.c-W-yq');
  if (! $cardUserLink) {
    error('displayHoverCardPosts: Can\'t get the user link from the hovercard', $hovercard);
    return;
  }

  var cardUserId = $cardUserLink.attr('o');
  if (! cardUserId) {
    error('displayHoverCardPosts: Can\'t get the user id from the hovercard user link', $cardUserLink);
    return;
  }

  var existingId = $postsContent.attr('gpme-o-id');
  if (! existingId || existingId != cardUserId)
    retrieveHoverCardPosts($hoverCard, cardUserId);
}

/**
 * Download the posts from the API
 */
function retrieveHoverCardPosts($hoverCard, cardUserId) {
  var imageCount = 0;
  var DATE_REGEXP = /^(?:\d+\/\d+\/\d+|\d+-\d+-\d+)$/;

  function appendItem($parent, item, prefix) {
    var addAttachments = function(attachments) {
      var empty = true;
      for (var i = 0, l = attachments.length; i < l; i++)  {
        var attach = attachments[i];
        var text = attach.displayName || attach.content;
        if (text) {
          if (! empty)
            $el.append($('<span> \u2022 </span>'));
          empty = false;
          // TODO: check for XSS.  G+ docs say displayName is suitable for display, but we gotta check
          if (attach.objectType == 'article') {
            $el.append($('<i>' + text + '</i>'));
          } else if (attach.objectType == 'photo') { 
            $el.append($('<span>Photo ' + text + '</span>'));
          } else if (attach.objectType == 'photo-album') {
            $el.append($('<span>Photo Album ' + text + '</span>'));
          }
          // FIXME: non of the above
        }
      }
    };

    // FIXME: do a proper style
    var $el = $('<div class="gpme-title-folded" style="cursor: pointer"/>').click(function() {
      var $this = $(this);
      if (! $this.hasClass('gpme-card-posts-open')) {
        $this.addClass('gpme-card-posts-open');
        $('<div class="gpme-card-posts-item-content" style="display: none"/>').html(item.object.content ? item.object.content : item.url).
            click(function() {
                window.location.href = item.url;
            }).
            insertAfter($this).
            slideDown(100).
            // Neuter any of the +mentions so that they don't trigger another hovercard
            find('.proflink').attr('oid', '');
      }
    });
    if (prefix)
      $el.append($(prefix));

    var p;

    if (item.verb == 'share') { // Shared item
      if (item.object && (p = item.object.actor)) {
        var link = '<a href="/' + p.id + '" class="yn Hf cg">';
        if (++imageCount < 20) // Minimize the number of images we download at a time
          $el.append($(link + '<img src="' + p.image.url + '"></a><span>\u00a0</span>'));
        $el.append($(link + p.displayName + '</a><span>\u00a0</span>'));
      }
      if (item.object.content)  {
        var content = item.object.content;
        var snippet = $('<div/>').html(content).text().substr(0, 100);
        $el.append($('<i/>').text(snippet));
      }
      if (item.object.attachments)
        addAttachments(item.object.attachments);
    } else if (item.title && ! DATE_REGEXP.test(item.title)) { // Simple item // FIXME: deal with the boring dates
        $el.append($('<span/>').text(item.title));
    } else if (item.object.attachments) { // Item with no title, but has attachments
      addAttachments(item.object.attachments);
    } else { // Unrecognized
      if (DEBUG)
        $el.append('<pre>' + JSON.stringify(item) + '</pre>');
      else
        return;
    }

    // Make sure it has at least something in there, for all the post types that we don't yet support
    $el.append('<span>\u00a0</span>');
    $parent.append($el);
  }

  /**
   * Display posts as they come in
   */
  function displayRecentPosts(newItems) {
    if (! cardPostsRecentInitialized) {
      $cardPostsRecent.empty();
      cardPostsRecentInitialized = true;
    }
    debug('retrieveHoverCardPosts.displayRecentPosts: ' + newItems.length + ' new items.');
    for (var i = 0, l = newItems.length; i < l; i++)
      appendItem($cardPostsRecent, newItems[i]);
  }

  /**
   * Process the posts when all done.
   */
  function doneRetrievingPosts(errorText) {
    var recentItems = items.recent;
    if (! recentItems.length) { // No data
      $cardPostsRecent.parent().empty().html(errorText ?
          '<div class="gpme-card-posts-api-error">The Google+ API returned an error:<br /><pre>' + errorText + '</pre></div>' :
          '<p>No public posts.</p>');

    } else { // We got data

      // Clean up old cached items
      if (lastCachedHoverCardPosts.length >= 10)
        delete cachedHoverCardPosts[lastCachedHoverCardPosts.shift()];
      // Cache items
      lastCachedHoverCardPosts.push(cardUserId);
      cachedHoverCardPosts[cardUserId] = items;
/* Temporary
    lsSet(LS_CARD_POSTS, '2', items);
*/

      // See if we've already sorted it
      var i, sortedItems = items.sortedByScore;
      if (! sortedItems) {
        // Compute the item scores & gather all the text
        var scoreElements = ['replies', 'plusoners', 'resharers'];
        var scoreWeights = [1, 2, 3];
        sortedItems = items.sortedByScore = [];
        for (i = recentItems.length; i--; ) {
          var p, score = 0;
          for (var se = 3; se--; ) {
            if ((p = recentItems[i].object) && (p = p[scoreElements[se]]) && (p = p.totalItems))
              score += p * scoreWeights[se];
          }
          sortedItems[i] = recentItems[i];
          sortedItems[i].gpmeScore = score;
        }
        // Sort so that items with highest scores are first
        sortedItems.sort(function(a, b) {
          return a.gpmeScore - b.gpmeScore;
        });
      }

      // Reset the image count so that the top posts can get some images too
      imageCount = 0;

      // Display the sorted items, get all the content
      var $cardPostsTop = $cardPostsContent.children('#gpme-card-posts-top').empty();
      var allContent = '';
      var totalScore = 0;
      var maxScore = sortedItems[sortedItems.length - 1].gpmeScore;
      for (i = sortedItems.length; i--; ) {
        var item = sortedItems[i];
        appendItem($cardPostsTop, item, '<span>' +
            (maxScore ? '<div class="gpme-card-posts-top-scorebar"><div class="gpme-card-posts-top-scorebar-fg" style="width:' + Math.round(item.gpmeScore * 100 / maxScore) + '%"></div><div class="gpme-card-posts-top-scorebar-text">' + item.gpmeScore + '</div></div>' : '<b>' + item.gpmeScore + '</b>') +
            '- </span>');
        totalScore += item.gpmeScore;
        // FIXME: originalContent doesn't seem to work right now
        if (item.object && item.object.content)
          allContent += item.object.content;
      }

      // Generate the cloud
      var canvasWidth = finalHoverCardWidth - 2 * CARD_POSTS_CONTENT_HORIZ_PADDING - 2;
      var canvasHeight = Math.round(canvasWidth * 2 / 3);
      var $cardPostsCloud = $cardPostsContent.children('#gpme-card-posts-cloud').empty();
      if (allContent) {
        // Strip all HTML tags, remove URLs (simple regexp from:
        // http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url/163684#163684 )
        allContent = $('<div/>').html(allContent).text().replace(/\b(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]/g, '');
        if (allContent) {
          var vis = new metaaps.nebulos($cardPostsCloud.get(0), '' + canvasWidth + 'px', '' + canvasHeight + 'px');
          vis.draw(allContent);
        }
      }

      // Add additional info about the user
      var $gpmeCardPostsInfo = $('<td class="gpme-card-posts-info" style="opacity:1"></td>');

      // Calculate very rough post frequency
      var earliestPublished = recentItems[recentItems.length - 1].published;
      if (earliestPublished) {
        var earliestDate = new Date().setISO8601(earliestPublished);
        var numDays = (new Date() - earliestDate) / (24 * 3600000);
        if (numDays > 0) {
          var postFreq = Math.round(recentItems.length * 10 / numDays) / 10;
          $gpmeCardPostsInfo.html('<div>' + postFreq + ' posts/day</div>');
        }
      }

      // Calculate the average score per post
      $gpmeCardPostsInfo.append($('<div>' + Math.round(totalScore * 10 / recentItems.length) / 10 + ' pts/post</div>'));

      $hoverCard.find('td[colspan="2"]').attr('colspan', '3');
      $hoverCard.find('tr:first-child > td:last-child').after($gpmeCardPostsInfo);
    }
  }

  var $cardPostsContent = $hoverCard.find('#gpme-card-posts-content');
  $cardPostsContent.attr('gpme-o-id', cardUserId);
  var $cardPostsRecent = $cardPostsContent.children('#gpme-card-posts-recent');
  var cardPostsRecentInitialized = false;

  // Check cache
  var items = cachedHoverCardPosts[cardUserId];
  if (items) {
    displayRecentPosts(items.recent);
    doneRetrievingPosts();

  } else {
/*
    // Temporary
    items = lsGet(LS_CARD_POSTS, '2');
    if (items) {
      displayRecentPosts(items);
    } else {
*/

    items = {recent: []};

    // Retrieve posts
    //var remainingResults = 230; // Pagination bug of G+ which limits the number of posts we can get for a user
    var remainingResults = 200;
    var plusList = function(url) {
      var maxResults = Math.min(100, remainingResults);
      var actualUrl = $.param.querystring(url, 'maxResults=' + maxResults + '&key=' + plusApiDevKey);
      //debug('G+API: URL=' + actualUrl);
      $.getJSON(actualUrl).then(function(data) {
        if (data.items) {
          items.recent = items.recent.concat(data.items);
          displayRecentPosts(data.items);
          remainingResults -= data.items.length;
          //debug('G+API: remainingResults=' + remainingResults);

          // We got more posts to get
          if (data.items.length == maxResults && remainingResults > 0 && data.nextLink) {
            setTimeout(function() { plusList(data.nextLink); }, 2000);
            return;
          }
        }
        doneRetrievingPosts();
      }, function(e) {
        error('retrieveHoverCardPosts.getJSON', e, e.responseText);
        // Display what we have
        doneRetrievingPosts(e.responseText);
      });
    };

    // Start downloading
    plusList('https://www.googleapis.com/plus/v1/people/' + cardUserId + '/activities/public');

/*
    // Temporary
    }
*/
  }
}

function onHoverCardMouseOut($hoverCard, $cardPosts) {
  debug('onCardPostsButtonMouseOut');

  if (resetHoverCardTimer)
    clearTimeout(resetHoverCardTimer);
  var attempts = 15;

  // The mouse could just be over the circles menu, so we check
  // if the hovercard is still there.
  resetHoverCardTimer = setTimeout(function resetHoverCard() {
    if (! $hoverCard.is(':visible')) {
      $cardPosts.hide().css('opacity', '0');
      $hoverCard.css({maxWidth: '', width: '', left: '', top: ''});
    } else {
      // It's possible the mouse moves from circles menu to the outside
      // area very quickly, in which case the hovercard doesn't disappear right away
      // (G+ bug).
      // Then, as the mouse moves again, the hoverCard disappears.  So
      // we have to find that event.  We'll try for 15 seconds.
      if (--attempts >= 0)
        resetHoverCardTimer = setTimeout(resetHoverCard, 1000);
    }
  }, 200);
}

/**
 * Responds to tab clicks
 */
function onCardPostsTabClick(e, $hoverCard) {
  info('onCardPostsTabClick');
  var id = e.target.id;
  if (id && id !== selectedHoverCardTabId) {
    var contentId = id.replace(/-tab/, '');
    var previousContentId = selectedHoverCardTabId.replace(/-tab/, '');
    $hoverCard.find('#' + previousContentId).hide();
    $hoverCard.find('#' + contentId).show();
    $hoverCard.find('#' + selectedHoverCardTabId).removeClass('gpme-card-posts-tab-selected');
    selectedHoverCardTabId = id;
    $hoverCard.find('#' + selectedHoverCardTabId).addClass('gpme-card-posts-tab-selected');
  }
}

/****************************************************************************
 * Announcements
 ***************************************************************************/

var lastNewsCheck = null;

/**
 * Injects an icon with news into the gbar
 */
function injectNews(mappingKey) {
  // NOTE: Some other extensions mess with the CSS class names
  mappingKey = mappingKey.replace(/\s*(?:gpr_gbar|SkipMeIAmAlradyFixPushed)/, '').replace(/\s+/g, '_');

  var $listItems = $('#gbg > ol > li');
  if ($listItems.length) {
    var $newsIcon = $('<li id="gpme-announcement-li" class="gbt"><img id="gpme-announcement-icon" src="' + chrome.extension.getURL('icons/actions/1.png') + '"/></li>');
    var $separator = $('<li class="gbt gbtb"><span class="gbts"></span></li>');
    $separator.insertBefore($listItems.first());
    $newsIcon.insertBefore($separator);

    var $newsAnnouncement = $('<div id="gpme-announcement" class="gbm">\
      <p>\
      Hi pumpkin!<br />\
      </p><p>\
      <a href="https://plus.google.com/111775942615006547057">Huy Zing</a> here, author of <b>G+me</b>.<br />\
      </p><p>\
      It looks like Google+ changed its layout again.  (For geeks: more specifically, all the CSS class names changed again.)<br />\
      Please go to the <a href="https://plus.google.com/111775942615006547057/posts/XvSSNeJoa87">latest G+me discussion</a> to report the problem.  Please mention "<b>code ' + mappingKey + '</b>" if no one else has yet, and I will fix it as soon as possible.<br />\
      </p><p>\
      Below are the latest news; check back once in a while.  (The <b>G+me</b> icon above should change color to green or red to let you know when there\'s important news.)<br />\
      </div>');
    var $newsFrame = $('<iframe id="gpme-news" frameborder=0 scrollable="true"/>');
    $newsAnnouncement.append($newsFrame);
    $newsAnnouncement.append('<p>P.S.: I\'m working on a long-term fix that will help all Google+ extensions so that you don\'t have to deal with these recurring problems anymore.  I just ask for a little patience, and I will give you the world ;)</p>');
    $newsIcon.append($newsAnnouncement);

    // Refresh now and every few minutes
    (function refreshNewsStatus() {
      //$newsFrame.attr('src', $newsFrame.attr('src'));
      $newsIcon.get(0).style.backgroundImage = 'url(http://dl.dropbox.com/u/8758558/gpme/status.gif?' + new Date().getTime() + ')';
      setTimeout(function() { refreshNewsStatus(); }, 15 * 60000);
    })();

    $newsIcon.hoverIntent({
      handlerIn: function() {
        $newsIcon.addClass('gbto');
        $newsAnnouncement.css('visibility', 'visible');
        var now = new Date().getTime();
        if (lastNewsCheck === null || now - lastNewsCheck > 5 * 60000) {
          lastNewsCheck = now;
          $newsFrame.get(0).src = 'http://huyz.us/gpme-news/?id=' + appDetails.id + '&v=' + appDetails.version + '&k=' + mappingKey;
        }
      },
      delayIn: 0,
      handlerOut: function() {
        $newsIcon.removeClass('gbto');
        var $newsAnnt = $('#gpme-announcement');
        $newsAnnouncement.css('visibility', 'hidden');
      },
      delayOut: 300
    });
  }
}

/****************************************************************************
 * Main
 ***************************************************************************/


/*
 * Initial code run when document is ready.
 * Gets data from background page and then calls main()
 */
$(document).ready(function() {
  info("event: initial page load.");

/* Deprecated
  // Frame check: we only want the top frame and the notifications frame
  var href = window.location.href;
  var match = href.match(/^https?:\/\/plus\.google\.com\/(?:u\/\d+\/)?(_)\/(notifications\/frame\b)?/)
  if (! match || ! match[1])
    frame = 'top';
  else if (match[2])
    frame = 'notifications';
  else
    return;
  debug(frame + ' frame URL=' + href);
*/
  frame = 'top';

  // We inject our stylesheet early because there are styles that we need
  // for our news notification
  injectStylesheet();
  
  if (DEV)
    getMessagesFromBackground(main);
  else // Get i18n messages
    main();
});

/*
 * When the page has all the stylesheets, we do a survey of the
 * page to get the selectors for the latest rules that we're writing
 */
//if (DEV) {
//  $(window).load(function() {
//    // TODO: we gotta find the event that tells us the stylesheets are ready.
//    setTimeout(function() {
//      gpx.surveyRules();
//      gpx.wxMap.writeToLocalStorage();
//    }, 5000);
//  });
//}

/**
 * Ask the background for all the messages
 * Workaround for http://code.google.com/p/chromium/issues/detail?id=53628
 */
function getMessagesFromBackground(callback) {
  chrome.extension.sendRequest({action: 'gpmeGetMessages'},
    wrapTryCatch('getMessagesFromBackground', function(response) {
      i18nMessages = response;
      callback();
    }));
}

/*
 * Initializations that may depend on the background page
 */
var getMessage;
if (DEV) {
  /**
   * Workaround for http://code.google.com/p/chromium/issues/detail?id=53628
   */
  getMessage = function(name) {
    //debug('getMessage: from background: ' + name);
    return i18nMessages[name];
  };
} else {
  getMessage = function(name) {
    //debug('getMessage: direct: ' + name);
    return chrome.i18n.getMessage(name);
  };
}

/**
 * Initializes constants that depend on i18n messages.
 * This must be called after we've precreated DOM elements.
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
  // Specify jQuery UI easing method
  jQuery.easing.def = 'easeInOutQuad';

  if (frame == 'top') { // Top frame
    // Google+ DOM check
    // FIXME: Change Gplusx to do this for us so we don't have to reference S_gbar
    var $gbar = $(_ID_GB);
    var mappingKey = '';
    if ($gbar.length)
      mappingKey = $gbar.parent().attr('class');
    if (isEnabledOnThisPage() && (! $gbar.length || (' ' + mappingKey + ' ').indexOf(' ' + C_GBAR + ' ') < 0)) {
      error("Google+ has changed is layout again (CSS class names), breaking G+me.  Please report the problem to http://huyz.us/gpme-release/ and I will fix it right away.");
      getAppDetailsFromBackground(function(theAppDetails) {
        appDetails = theAppDetails;

        // NOTE: Some other extensions mess with the CSS class names
        mappingKey = mappingKey.replace(/\s*(?:gpr_gbar|SkipMeIAmAlradyFixPushed|undefined)\s*$/, '').replace(/\s+/g, '_');

        injectNews(mappingKey);
      });

      // We continue because the extension may still work even though the mapping key doesn't
    }

    // Initialize Gplusx
    gpx = new Gplusx({
      extendJQuerySelectors: true,
      extendJQueryPseudoClasses: DEV,
      extendQuerySelectors: DEV,
      aliasAPI: true,
      enableKeyCommands: DEV,
      automap: DEV,
      strict: DEV,
      debug: DEV
    }, function() {
      // Overwrite what's in local storage so that we can test
//      if (DEV) {
  //      gpx.newMap();
  //      gpx.automapPage();
  //      gpx.dumpToConsole("After automapping page");

  //    debug('Testing jQuery extension', $('%post'));
  //    debug('Testing jQuery extension', $('%post[aria-live]:eq(0)'));
  //    debug('Testing querySelector extension', document.querySelectorAll('%post'));
  //    debug('Testing querySelector extension', document.querySelector('.ke%post'));
      //debug('Testing alias', $X('%post'));
      //debug('Testing alias', X.classNames('%post'));

        // Testing strit mode
  //      gpx.config.strict = false;
  //      console.dir($('.ke%crap'));
  //      console.dir(document.querySelector('.ke%crap'));
  //      gpx.config.strict = true;
  //      console.dir(document.querySelector('.ke%crap'));
//      }


      // Pre-create DOM elements
      defineDomConstants(window); // Does most of the referencing to Gplusx
      precreateElements(window);
      // Set up items including DOM elements based on internationalization settings
      i18nInit();

      // Inject some styles
      injectSomeStyles();

      // Get settings
      getOptionsFromBackground(function() {
        $titlebarFolded.css('height', settings.nav_summaryLines * ITEM_LINE_HEIGHT);
        if ( settings.nav_summaryLines > 1)
          $titlebarFolded.css('white-space', 'inherit');

        // Listen for when there's a total AJAX refresh of the stream,
        // on a regular page
        var $contentPane = $('%contentPane'); // $(S_contentPane);
        if ($contentPane.length) {
          var contentPane = $contentPane.get(0);
          $contentPane.bind('DOMNodeInserted', function(e) {
            // This happens when a new stream is selected
            if (e.relatedNode.parentNode == contentPane) {
              // We're only interested in the insertion of entire content pane
              return onContentPaneUpdated(e);
            }

            var id = e.target.id;
            // ':' is weak optimization attempt for comment editing
            if (id && id.charAt(0) == ':')
              return null;

            var target = e.target;

            //debug("DOMNodeInserted: id=" + id + " className=" + e.target.className);
            // This happens when a new post is added, either through "More"
            // or a new recent post.
            // Or it's a Start G+ post
            if (id && (id.substring(0,7) == 'update-'))
              return onItemInserted(e);
            else if (settings.nav_compatSgp && id.substring(0,9) == ID_SGP_POST_PREFIX )
              return onSgpItemInserted(e);
            // This happens when switching from About page to Posts page
            // on profile
            else if (e.relatedNode && e.relatedNode.id && e.relatedNode.id.indexOf('-posts-page') > 0)
              return onContentPaneUpdated(e);

            // This happens when posts' menus get inserted.  If they're inserted on a page load,
            // then they have [role=menu], otherwise all they have is a simple classname, e.g. 'Om', not even
            // the 'a-z' class which comes later.  The problem is that we can't automap the 'Om' early enough.
            // We do know that the children come in as [role=button]s which later become [role=menuitem]
            var itemDivInserted = false;
            if (target.getAttribute('role') == "menu" || target.className == C_UBOOST_STAR) {
              itemDivInserted = true;
            } else if (target.childElementCount) {
              var childNode = target.childNodes[0];
              if (childNode && childNode.nodeType == Node.ELEMENT_NODE && childNode.getAttribute('role') == 'button')
                itemDivInserted= true;
            }
            if (itemDivInserted)
              return onItemDivInserted(e);
          });
        } else  {
          // This can happen if we're in the settings page for example
          warn("main: Can't find content pane");
        }

        // Listen when status change
        // WARNING: DOMSubtreeModified is deprecated and degrades performance:
        //   https://developer.mozilla.org/en/Extensions/Performance_best_practices_in_extensions
        var $status = $('%gbarToolsNotificationUnitFg'); // $(S_gbarToolsNotificationUnitFg);
        if ($status.length)
          $status.bind('DOMSubtreeModified', onStatusUpdated);
        else
          // Sometimes this happens with G+ for some reason.  Happened at times when I was
          // reloading a profile page.
          debug("main: Can't find status node; badges won't work.");

        // Listen to incoming messages from background page
        chrome.extension.onRequest.addListener(wrapTryCatch('chrome.extension.onRequest.addListener',
          function(request, sender, sendResponse) {
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
          }));

        // Listen to keyboard shortcuts
        $(window).keydown(onKeydown);

        //injectNewFeedbackLink();

        // The initial update, if enabled on this page.
        // NOTE: we don't put anything else within this guard because all our event handlers
        // need to work when the user switches to a page where G+me is enabled.
        if (isEnabledOnThisPage()) {
          updateAllItems();
        }

        listenToHoverCardUpdates();

        // Set up a lscache cleanup in 5 minutes, keeping 30 days of history
        setTimeout(function() { lscache.removeOld(30 * 24 * 60, LS_HISTORY_); }, 5 * 60000);
      });
    });
  }
}

// vim:set iskeyword+=-,36:
