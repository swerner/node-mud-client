ipc = require 'ipc'
path = require 'path'
_ = require 'underscore'

class ConsolePlugin

  constructor: ->
    $("html").find('head').append("<link rel='stylesheet' type='text/css' href='#{path.resolve(__dirname, 'css', 'console_plugin.css')}'>")
    plugin = @
    @baseElement = $("#consolePlugin")

    # @setupUI()

    ipc.on "message-from-mud", (data) ->
      plugin.displayLine(data)

  #TODO: Change over to loading a template whenever ember comes in
  # setupUI: ->

  displayLine: (data)->
    @baseElement.append(@processData(data))
    @baseElement.scrollTop(@baseElement[0].scrollHeight)

  processData: (data)->
    output = "<div><span class='white'>"
    data = data.split("")

    while data.length > 0
      char = data.shift()

      if(char.charCodeAt() == 27)
        colorcode = "" + data.shift() + data.shift() + data.shift() + data.shift() + data.shift() + data.shift()
        output += "</span>" + @startColor(colorcode)
      else if char.charCodeAt() == 32
        output += "&nbsp;"
      else
        output += char

    output += "</span></div>"

    return output

  startColor: (code) ->
    colors = {
      "[0;30m": "black"
      "[0;31m": "red"
      "[0;32m": "green"
      "[0;33m": "yellow"
      "[0;34m": "blue"
      "[0;35m": "magenta"
      "[0;36m": "cyan"
      "[0;37m": "white"
      "[1;30m": "bblack"
      "[1;31m": "bred"
      "[1;32m": "bgreen"
      "[1;33m": "byellow"
      "[1;34m": "bblue"
      "[1;35m": "bmagenta"
      "[1;36m": "bcyan"
      "[1;37m": "bwhite"
    }
    "<span class='#{colors[code]}'>"

module.exports =
  register: ->
    new ConsolePlugin
