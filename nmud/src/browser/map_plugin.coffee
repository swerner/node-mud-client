ipc = require 'ipc'
path = require 'path'
_ = require 'underscore'

class MapPlugin

  constructor: ->
    $("html").find('head').append("<link rel='stylesheet' type='text/css' href='#{path.resolve(__dirname, 'css', 'map_plugin.css')}'>")
    plugin = @
    @baseElement = $("#mapPlugin")

    @setupUI()

    ipc.on "room.info", (data)->
      plugin.displaySectors(data)

  #TODO: Change over to loading a template whenever ember comes in
  setupUI: ->
    @northExit = $("<div id='map_plugin_north_exit'></div>")
    @eastExit = $("<div id='map_plugin_east_exit'></div>")
    @southExit = $("<div id='map_plugin_south_exit'></div>")
    @westExit = $("<div id='map_plugin_west_exit'></div>")
    @upExit = $("<div id='map_plugin_up_exit'></div>")
    @downExit = $("<div id='map_plugin_down_exit'></div>")
    @currentRoom = $("<div id='map_plugin_current_room'></div>")

    @baseElement.append(@northExit)
    @baseElement.append(@eastExit)
    @baseElement.append(@southExit)
    @baseElement.append(@westExit)
    @baseElement.append(@upExit)
    @baseElement.append(@downExit)
    @baseElement.append(@currentRoom)

  displaySectors: (room)->
    @currentRoom.html("#{room.num} - #{room.name}")

module.exports =
  register: ->
    new MapPlugin
