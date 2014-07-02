(function() {
  var process_buffer;

  process_buffer = function(buffer) {
    var body, message, payload;
    payload = buffer.toString();
    message = payload.substring(0, payload.indexOf('{') - 1);
    body = payload.substring(payload.indexOf('{'));
    return {
      message: message,
      body: body
    };
  };

  module.exports = function(event, buffer) {
    var body, message, _ref;
    _ref = process_buffer(buffer), message = _ref.message, body = _ref.body;
    try {
      return event.sender.send(message, JSON.parse(body));
    } catch (_error) {
      return false;
    }
  };

}).call(this);
