(function() {
  var InputPlugin, ipc, path, _;

  ipc = require('ipc');

  path = require('path');

  _ = require('underscore');

  InputPlugin = (function() {
    function InputPlugin() {
      $("html").find('head').append("<link rel='stylesheet' type='text/css' href='" + (path.resolve(__dirname, 'css', 'input_plugin.css')) + "'>");
      this.baseElement = $("#consoleInput");
      this.setupUI();
      this.bindActions();
    }

    InputPlugin.prototype.setupUI = function() {
      return this.baseElement.append($("<input id='clientLine'></input>"));
    };

    InputPlugin.prototype.bindActions = function() {
      return this.baseElement.on("keypress", function(event) {
        if (event.which === 13) {
          ipc.send("send-message", $("#clientLine").val());
          return $("#clientLine").select();
        }
      });
    };

    return InputPlugin;

  })();

  module.exports = {
    register: function() {
      return new InputPlugin;
    }
  };

}).call(this);
