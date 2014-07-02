(function() {
  var CharPlugin, ipc, path;

  ipc = require('ipc');

  path = require('path');

  CharPlugin = (function() {
    CharPlugin.hp = 0;

    CharPlugin.maxhp = 0;

    CharPlugin.mana = 0;

    CharPlugin.maxmana = 0;

    CharPlugin.moves = 0;

    CharPlugin.maxmoves = 0;

    function CharPlugin() {
      var plugin;
      $("html").find('head').append("<link rel='stylesheet' type='text/css' href='" + (path.resolve(__dirname, 'css', 'char_plugin.css')) + "'>");
      plugin = this;
      ipc.on("char.status", function(data) {
        if (data.state === 3) {
          return ipc.send("game:ready", true);
        }
      });
      ipc.on("char.maxstats", function(data) {
        plugin.maxhp = data.maxhp;
        plugin.maxmana = data.maxmana;
        plugin.maxmoves = data.maxmoves;
        $("#char-stats-hp-max").html(plugin.maxhp);
        $("#char-stats-mana-max").html(plugin.maxmana);
        $("#char-stats-moves-max").html(plugin.maxmoves);
        return plugin.setStatPercents();
      });
      ipc.on("char.vitals", function(data) {
        plugin.hp = data.hp;
        plugin.mana = data.mana;
        plugin.moves = data.moves;
        $("#char-stats-hp-current").html(plugin.hp);
        $("#char-stats-mana-current").html(plugin.mana);
        $("#char-stats-moves-current").html(plugin.moves);
        return plugin.setStatPercents();
      });
    }

    CharPlugin.prototype.setStatPercents = function() {
      if (!(this.hp === 0 || this.maxhp === 0)) {
        $("#char-stats-hp-percent").html(Math.floor((this.hp / this.maxhp) * 100) + "%");
      }
      if (!(this.mana === 0 || this.maxmana === 0)) {
        $("#char-stats-mana-percent").html(Math.floor((this.mana / this.maxmana) * 100) + "%");
      }
      if (!(this.moves === 0 || this.maxmoves === 0)) {
        return $("#char-stats-moves-percent").html(Math.floor((this.moves / this.maxmoves) * 100) + "%");
      }
    };

    return CharPlugin;

  })();

  module.exports = {
    register: function() {
      return new CharPlugin;
    }
  };

}).call(this);
