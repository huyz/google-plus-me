// Broadcast message to all Google+ tabs
function broadcast(request, callback) {
  chrome.windows.getAll({populate: true}, function(windows) {
    windows.forEach(function(w) {
      w.tabs.forEach(function(tab) {
        if (tab.url.match(/^https?:\/\/plus\.google\.com\//))
          chrome.tabs.sendRequest(tab.id, request, callback);
      });
    });
  });
}

/**
 * Reset settings
 */
function resetSettings(settings) {
  var store = new Store("settings");

  // Reset the persisted settings in the background page
  chrome.extension.getBackgroundPage().reset();
  // Reset the settings as displayed on the options page
  for (var name in settings.manifest) {
    var setting = settings.manifest[name];
    if (typeof setting.set === 'function')
      setting.set(store.get(setting.params.name));
  }
}

/**
 * Reset settings, stored options, and history
 */
function resetAll(settings) {
  // Reset settings
  resetSettings(settings);

  // Clear our localStorage
  for (var i in localStorage) {
    if (i.indexOf('gpme_') == 0)
      localStorage.removeItem(i);
  }
  // Re-default to expanded, as in background.js
  localStorage.setItem('gpme_options_mode', 'expanded');

  // Clear the content scripts' localStorage
  broadcast({action: 'gpmeResetAll'});
}

/*
 * Fancy-settings main()
 */
window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
        settings.manifest.nav_resetSettings.addEvent('action', function() {
          if (confirm("This will reset G+me settings.  Are you sure?"))
            resetSettings(settings);
        });
        settings.manifest.nav_resetAll.addEvent('action', function () {
          if (confirm("This will reset G+me as if you're installing it for the first time.  Are you sure?"))
            resetAll(settings);
        });

    });
    
    // Option 2: Do everything manually:
    /*
    var settings = new FancySettings("My Extension", "icon.png");
    
    var username = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "username",
        "type": "text",
        "label": i18n.get("username"),
        "text": i18n.get("x-characters")
    });
    
    var password = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "password",
        "type": "text",
        "label": i18n.get("password"),
        "text": i18n.get("x-characters-pw"),
        "masked": true
    });
    
    var myDescription = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "myDescription",
        "type": "description",
        "text": i18n.get("description")
    });
    
    var myButton = settings.create({
        "tab": "Information",
        "group": "Logout",
        "name": "myButton",
        "type": "button",
        "label": "Disconnect:",
        "text": "Logout"
    });
    
    // ...
    
    myButton.addEvent("action", function () {
        alert("You clicked me!");
    });
    
    settings.align([
        username,
        password
    ]);
    */
});
