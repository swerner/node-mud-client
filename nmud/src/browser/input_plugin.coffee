ipc = require 'ipc'
path = require 'path'
_ = require 'underscore'

class InputPlugin

  constructor: ->
    $("html").find('head').append("<link rel='stylesheet' type='text/css' href='#{path.resolve(__dirname, 'css', 'input_plugin.css')}'>")
    @baseElement = $("#consoleInput")
    @setupUI()

    @bindActions()

  setupUI: ->
    @baseElement.append($("<input id='clientLine'></input>"))

  bindActions: ->
    @baseElement.on("keypress", (event) ->
      if(event.which == 13)
        ipc.send("send-message", $("#clientLine").val())
        $("#clientLine").select()
    )

module.exports =
  register: ->
    new InputPlugin
