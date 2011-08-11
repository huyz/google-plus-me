/**
 * 2011-08-11 Hacked by huyz to store time of storage, not expiration,
 * so that the user can clean up on demand with any given timeframe.
 * Also, more efficient because there is no check for expiration on get.
 *
 *
 * lscache library
 * Copyright (c) 2011, Pamela Fox
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Creates a namespace for the lscache functions.
 */
var lscache = function() {
  // Prefixes the key name on the expiration items in localStorage 
  // huyz 2011-08-11
  //var CACHESUFFIX = '-cacheexpiration';
  var CACHESUFFIX = '-lsT';

  // Determines if localStorage is supported in the browser;
  // result is cached for better performance instead of being run each time.
  // Feature detection is based on how Modernizr does it;
  // it's not straightforward due to FF4 issues.
  var supportsStorage = function () {
    try {
      return !!localStorage.getItem;
    } catch (e) {
      return false;
    }
  }();

  // Determines if native JSON (de-)serialization is supported in the browser.
  var supportsJSON = (window.JSON !== null);

  /**
   * Returns the full string for the localStorage expiration item.
   * @param {String} key
   * @return {string}
   */
  function birthKey(key) {
    return key + CACHESUFFIX;
  }

  /**
   * Returns the number of minutes since the epoch.
   * @return {number}
   */
  function currentTime() {
    return Math.floor((new Date().getTime())/60000);
  }

  /**
    * Removes specified key from localStorage if older than expirationTime.
    * This function is factored out in case it needs to be called from get()
    * @return {boolean} true if removed
    */
  function removeIfOlder(key, expirationTime) {
    var birthTime = parseInt(localStorage.getItem(key), 10);
    // Check if we should actually kick item out of storage
    if (birthTime < expirationTime) {
      localStorage.removeItem(key);
      localStorage.removeItem(key.split(CACHESUFFIX)[0]);
      return true;
    } else {
      return false;
    }
  }

  return {

    /**
     * Stores the value in localStorage. Expires after specified number of minutes.
     * @param {string} key
     * @param {Object|string} value
     */
    set: function(key, value /*, time */) {
      if (!supportsStorage) return;

      // If we don't get a string value, try to stringify
      // In future, localStorage may properly support storing non-strings
      // and this can be removed.
      if (typeof value != 'string') {
        if (!supportsJSON) return;
        try {
          value = JSON.stringify(value);
        } catch (e) {
          // Sometimes we can't stringify due to circular refs
          // in complex objects, so we won't bother storing then.
          return;
        }
      }

      try {
        localStorage.setItem(key, value);
      } catch (e) {
        var i;
        if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name == 'NS_ERROR_DOM_QUOTA_REACHED') {
          // If we exceeded the quota, then we will sort
          // by the birth time, and then remove the N oldest
          var storedKey, storedKeys = [];
          for (i = 0; i < localStorage.length; i++) {
            storedKey = localStorage.key(i);
            if (storedKey.indexOf(CACHESUFFIX) > -1) {
              var mainKey = storedKey.split(CACHESUFFIX)[0];
              storedKeys.push({key: mainKey, birth: parseInt(localStorage[storedKey], 10)});
            }
          }
          storedKeys.sort(function(a, b) { return (a.birth - b.birth); });

          // huyz 2011-08-11 Gotta clean up a lot more than that or you'll be sorting all the time.
          // My key-values are not that big: 80 chars.
          //for (var i = 0, len = Math.min(30, storedKeys.length); i < len; i++) {
          for (i = 0, len = Math.min(1000, storedKeys.length); i < len; i++) {
            localStorage.removeItem(storedKeys[i].key);
            localStorage.removeItem(birthKey(storedKeys[i].key));
          }
          // TODO: This could still error if the items we removed were small and this is large
          localStorage.setItem(key, value);
        } else {
          // If it was some other error, just give up.
          return;
        }
      }

      /* huyz 2011-08-11 We always store the birth time
      // If a time is specified, store birth time info in localStorage
      if (time) {
      */
        localStorage.setItem(birthKey(key), currentTime());
      /*
      } else {
        // In case they set a time earlier, remove that info from localStorage.
        localStorage.removeItem(birthKey(key));
      }
      */
    },

    /**
     * Retrieves specified value from localStorage, if not expired.
     * @param {string} key
     * @return {string|Object}
     */
    get: function(key) {
      if (!supportsStorage) return null;

      /**
       * huyz 2011-08-11 Hacked for efficiency.
       *
       * Tries to de-serialize stored value if its an object, and returns the
       * normal value otherwise.
       * @param {String} value
       */
      function parsedStorage(value) {
        if (supportsJSON) {
          try {
            // We can't tell if its JSON or a string, so we try to parse
            return JSON.parse(value);
          } catch(e) {
            // If we can't parse, it's probably because it isn't an object
            return value;
          }
        } else {
          return value;
        }
      }

      /* huyz 2011-08-11 For efficiency, we don't check when getting; we clean up manually.
      // Return the de-serialized item if not expired
      if (localStorage.getItem(birthKey(key))) {
        var expirationTime = parseInt(localStorage.getItem(birthKey(key)), 10);
        // Check if we should actually kick item out of storage
        if (currentTime() >= expirationTime) {
          localStorage.removeItem(key);
          localStorage.removeItem(birthKey(key));
          return null;
        } else {
          return parsedStorage(key);
        }
      } else */
      var value = localStorage.getItem(key);
      if (value) {
        return parsedStorage(value);
      }
      return null;
    },

    /**
     * Removes a value from localStorage.
     * Equivalent to 'delete' in memcache, but that's a keyword in JS.
     * @param {string} key
     */
    remove: function(key) {
      if (!supportsStorage) return null;
      localStorage.removeItem(key);
      localStorage.removeItem(birthKey(key));
      return true;
    },

    /**
     * Removes any values from localStorage with a birthtime that makes them older
     * than the specified number of minutes
     * @param {Integer} timeframe: number of minutes' worth of data to keep
     * @param {string} keyPrefix: optional prefix that filters the keys to be
     *   expired.
     */
    removeOld: function(timeframe, keyPrefix) {
      // We do everything in minutes
      var expirationTime = currentTime() - timeframe;

      for (var i = 0; i < localStorage.length; i++) {
        var storedKey = localStorage.key(i);
        if (storedKey.indexOf(CACHESUFFIX) > -1) {
          if (! keyPrefix || storedKey.indexOf(keyPrefix) === 0) {
            removeIfOlder(storedKey, expirationTime);
          }
        }
      }
    }
  };
}();
