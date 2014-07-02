(function() {
  var MapPlugin, ipc, path, _;

  ipc = require('ipc');

  path = require('path');

  _ = require('underscore');

  MapPlugin = (function() {
    function MapPlugin() {
      var plugin;
      $("html").find('head').append("<link rel='stylesheet' type='text/css' href='" + (path.resolve(__dirname, 'css', 'map_plugin.css')) + "'>");
      plugin = this;
      this.baseElement = $("#mapPlugin");
      this.setupUI();
      ipc.on("room.info", function(data) {
        return plugin.displaySectors(data);
      });
    }

    MapPlugin.prototype.setupUI = function() {
      this.northExit = $("<div id='map_plugin_north_exit'></div>");
      this.eastExit = $("<div id='map_plugin_east_exit'></div>");
      this.southExit = $("<div id='map_plugin_south_exit'></div>");
      this.westExit = $("<div id='map_plugin_west_exit'></div>");
      this.upExit = $("<div id='map_plugin_up_exit'></div>");
      this.downExit = $("<div id='map_plugin_down_exit'></div>");
      this.currentRoom = $("<div id='map_plugin_current_room'></div>");
      this.baseElement.append(this.northExit);
      this.baseElement.append(this.eastExit);
      this.baseElement.append(this.southExit);
      this.baseElement.append(this.westExit);
      this.baseElement.append(this.upExit);
      this.baseElement.append(this.downExit);
      return this.baseElement.append(this.currentRoom);
    };

    MapPlugin.prototype.displaySectors = function(room) {
      return this.currentRoom.html("" + room.num + " - " + room.name);
    };

    return MapPlugin;

  })();

  module.exports = {
    register: function() {
      return new MapPlugin;
    }
  };

}).call(this);
