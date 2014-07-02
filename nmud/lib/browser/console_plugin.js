(function() {
  var ConsolePlugin, ipc, path, _;

  ipc = require('ipc');

  path = require('path');

  _ = require('underscore');

  ConsolePlugin = (function() {
    function ConsolePlugin() {
      var plugin;
      $("html").find('head').append("<link rel='stylesheet' type='text/css' href='" + (path.resolve(__dirname, 'css', 'console_plugin.css')) + "'>");
      plugin = this;
      this.baseElement = $("#consolePlugin");
      ipc.on("message-from-mud", function(data) {
        return plugin.displayLine(data);
      });
    }

    ConsolePlugin.prototype.displayLine = function(data) {
      this.baseElement.append(this.processData(data));
      return this.baseElement.scrollTop(this.baseElement[0].scrollHeight);
    };

    ConsolePlugin.prototype.processData = function(data) {
      var char, colorcode, output;
      output = "<div><span class='white'>";
      data = data.split("");
      while (data.length > 0) {
        char = data.shift();
        if (char.charCodeAt() === 27) {
          colorcode = "" + data.shift() + data.shift() + data.shift() + data.shift() + data.shift() + data.shift();
          output += "</span>" + this.startColor(colorcode);
        } else if (char.charCodeAt() === 32) {
          output += "&nbsp;";
        } else {
          output += char;
        }
      }
      output += "</span></div>";
      return output;
    };

    ConsolePlugin.prototype.startColor = function(code) {
      var colors;
      colors = {
        "[0;30m": "black",
        "[0;31m": "red",
        "[0;32m": "green",
        "[0;33m": "yellow",
        "[0;34m": "blue",
        "[0;35m": "magenta",
        "[0;36m": "cyan",
        "[0;37m": "white",
        "[1;30m": "bblack",
        "[1;31m": "bred",
        "[1;32m": "bgreen",
        "[1;33m": "byellow",
        "[1;34m": "bblue",
        "[1;35m": "bmagenta",
        "[1;36m": "bcyan",
        "[1;37m": "bwhite"
      };
      return "<span class='" + colors[code] + "'>";
    };

    return ConsolePlugin;

  })();

  module.exports = {
    register: function() {
      return new ConsolePlugin;
    }
  };

}).call(this);
