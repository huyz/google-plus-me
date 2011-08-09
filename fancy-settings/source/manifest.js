this.manifest = {
  "name": "G+me",
  "icon": "../../icons/icon48.png",
  "settings": [
    /*
     * General
     */
    // Collapse summary
    {
      "tab"   : chrome.i18n.getMessage("options_nav_general_label"),
      "group" : chrome.i18n.getMessage("options_nav_summary_label"),
      "name"  : "nav_summaryIncludeThumbnails",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_summaryIncludeThumbnails")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_general_label"),
      "group" : chrome.i18n.getMessage("options_nav_summary_label"),
      "name"  : "nav_summaryIncludeTime",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_summaryIncludeTime")
    },
    // Preview
    {
      "tab"   : chrome.i18n.getMessage("options_nav_general_label"),
      "group" : chrome.i18n.getMessage("options_nav_preview_label"),
      "name"  : "nav_previewEnableInExpanded",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_previewEnableInExpanded")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_general_label"),
      "group" : chrome.i18n.getMessage("options_nav_preview_label"),
      "name"  : "nav_previewEnableInList",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_previewEnableInList")
    },
    // Browser action
    {
      "tab"   : chrome.i18n.getMessage("options_nav_general_label"),
      "group" : chrome.i18n.getMessage("options_nav_browserAction_label"),
      "name"  : "nav_browserActionOpensNewTab",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_browserActionOpensNewTab")
    },

    /*
     * Pages
     */
    {
      "tab"   : chrome.i18n.getMessage("options_nav_pages_label"),
      "group" : chrome.i18n.getMessage("options_nav_global_label"),
      "name"  : "nav_global_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_global_desc")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_pages_label"),
      "group" : chrome.i18n.getMessage("options_nav_global_label"),
      "name"  : "nav_global_postsDefaultMode",
      "type"  : "radioButtons",
      "label" : chrome.i18n.getMessage("options_nav_global_postsDefaultMode"),
      "options": [
        ["expanded", "Expanded — all default to expanded"],
        ["list", "List — collapse all except for one"]
      ]
    },
/*
    {
      "tab"   : chrome.i18n.getMessage("options_nav_pages_label"),
      "group" : chrome.i18n.getMessage("options_nav_global_label"),
      "name"  : "nav_global_commentsDefaultCollapsed",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_global_commentsDefaultCollapsed")
    },
*/

    /*
     * Compatibility
     */
    
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : "",
      "name"  : "nav_compat_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_compat_desc")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : chrome.i18n.getMessage("options_nav_compatSgp_label"),
      "name"  : "nav_compatSgp_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_compatSgp_desc", "http://goo.gl/NFCRE")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : chrome.i18n.getMessage("options_nav_compatSgp_label"),
      "name"  : "nav_compatSgp",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_compatSgp")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : chrome.i18n.getMessage("options_nav_compatSgp_label"),
      "name"  : "nav_compatSgpComments",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_compatSgpComments")
    },
/*
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : chrome.i18n.getMessage("options_nav_compatSgp_label"),
      "name"  : "nav_compatSgpCache",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_compatSgpCache")
    },
*/
/*
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : chrome.i18n.getMessage("options_nav_compatSgp_label"),
      "name"  : "nav_compatSgpUsage_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_compatSgpUsage_desc")
    },
*/
    /*
     * Questions
     */
    {
      "tab"   : chrome.i18n.getMessage("options_nav_questions_label"),
      "group" : chrome.i18n.getMessage("options_nav_links_label"),
      "name"  : "nav_links_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_links_desc")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_questions_label"),
      "group" : chrome.i18n.getMessage("options_nav_faq_label"),
      "name"  : "nav_faq_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_faq_desc")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_questions_label"),
      "group" : chrome.i18n.getMessage("options_nav_problems_label"),
      "name"  : "nav_problemsTroubleshoot_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_problemsTroubleshoot")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_questions_label"),
      "group" : chrome.i18n.getMessage("options_nav_problems_label"),
      "name"  : "nav_problemsFeedback_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_problemsFeedback")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_questions_label"),
      "group" : chrome.i18n.getMessage("options_nav_reset_label"),
      "name"  : "nav_resetSettings",
      "type"  : "button",
      "label" : chrome.i18n.getMessage("options_nav_resetSettings_label"),
      "text"  : chrome.i18n.getMessage("options_nav_resetSettings")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_questions_label"),
      "group" : chrome.i18n.getMessage("options_nav_reset_label"),
      "name"  : "nav_resetAll",
      "type"  : "button",
      "label" : chrome.i18n.getMessage("options_nav_resetAll_label"),
      "text"  : chrome.i18n.getMessage("options_nav_resetAll")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_nav_questions_label"),
      "group" : chrome.i18n.getMessage("options_nav_reset_label"),
      "name"  : "nav_reset_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_reset_desc")
    }
  ],
  "alignment": [
    [
      "nav_resetSettings",
      "nav_resetAll"
    ]
  ],
};
