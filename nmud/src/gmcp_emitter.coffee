process_buffer = (buffer)->
  payload = buffer.toString()
  message = payload.substring(0, payload.indexOf('{')-1)
  body = payload.substring(payload.indexOf('{'))
  {message, body}

module.exports = (event, buffer) ->
  {message, body} = process_buffer(buffer)
  try
    event.sender.send(message, JSON.parse(body))
  catch
    false
