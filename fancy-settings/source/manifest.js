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
      "name"  : "nav_global_commentsDefaultCollapsed",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_global_commentsDefaultCollapsed")
    },

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
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : chrome.i18n.getMessage("options_nav_compatSgp_label"),
      "name"  : "nav_compatSgpCache",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_nav_compatSgpCache")
    }/*,
    {
      "tab"   : chrome.i18n.getMessage("options_nav_compat_label"),
      "group" : chrome.i18n.getMessage("options_nav_compatSgp_label"),
      "name"  : "nav_compatSgpUsage_desc",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_nav_compatSgpUsage_desc")
    }
*/

  ]
};
