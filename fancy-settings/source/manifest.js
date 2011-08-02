this.manifest = {
  "name": "G+me",
  "icon": "../../icons/icon48.png",
  "settings": [
    {
      "tab"   : chrome.i18n.getMessage("options_label_general"),
      "group" : chrome.i18n.getMessage("options_label_comments"),
      "name"  : "commentsDefaultCollapsed",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_commentsDefaultCollapsed")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_label_general"),
      "group" : chrome.i18n.getMessage("options_label_preview"),
      "name"  : "previewEnableInExpanded",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_previewEnableInExpanded")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_label_general"),
      "group" : chrome.i18n.getMessage("options_label_preview"),
      "name"  : "previewEnableInList",
      "type"  : "checkbox",
      "label" : chrome.i18n.getMessage("options_previewEnableInList")
    },

    {
      "tab"   : chrome.i18n.getMessage("options_label_compat"),
      "group" : "",
      "name"  : "text_compat",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_text_compat")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_label_compat"),
      "group" : chrome.i18n.getMessage("options_label_compatSgp"),
      "name"  : "text_compatSgp",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_text_compatSgp", "http://goo.gl/NFCRE")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_label_compat"),
      "group" : chrome.i18n.getMessage("options_label_compatSgp"),
      "name"  : "compatSgp",
      "type"  : "checkbox",
      "label"  : chrome.i18n.getMessage("options_compatSgp")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_label_compat"),
      "group" : chrome.i18n.getMessage("options_label_compatSgp"),
      "name"  : "compatSgpComments",
      "type"  : "checkbox",
      "label"  : chrome.i18n.getMessage("options_compatSgpComments")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_label_compat"),
      "group" : chrome.i18n.getMessage("options_label_compatSgp"),
      "name"  : "compatSgpCache",
      "type"  : "checkbox",
      "label"  : chrome.i18n.getMessage("options_compatSgpCache")
    },
    {
      "tab"   : chrome.i18n.getMessage("options_label_compat"),
      "group" : chrome.i18n.getMessage("options_label_compatSgp"),
      "name"  : "text_compatSgpUsage",
      "type"  : "description",
      "text"  : chrome.i18n.getMessage("options_text_compatSgpusage")
    }

  ]
};
