(function() {
  var _;

  _ = require('underscore');

  module.exports = function(data) {
    data = _.reject(data.split(""), function(item) {
      var val;
      val = item.charCodeAt(0);
      return val < 32 || val > 126;
    }).join("");
    return data.replace(/\ /g, "&nbsp;");
  };

}).call(this);
