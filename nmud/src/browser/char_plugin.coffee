ipc = require 'ipc'
path = require 'path'

class CharPlugin
  @hp = 0
  @maxhp = 0
  @mana = 0
  @maxmana = 0
  @moves = 0
  @maxmoves = 0

  constructor: ->
    $("html").find('head').append("<link rel='stylesheet' type='text/css' href='#{path.resolve(__dirname, 'css', 'char_plugin.css')}'>")
    plugin = @

    ipc.on "char.status", (data)->
      ipc.send("game:ready", true) if data.state == 3

    ipc.on "char.maxstats", (data)->
      plugin.maxhp = data.maxhp
      plugin.maxmana = data.maxmana
      plugin.maxmoves = data.maxmoves

      $("#char-stats-hp-max").html(plugin.maxhp)
      $("#char-stats-mana-max").html(plugin.maxmana)
      $("#char-stats-moves-max").html(plugin.maxmoves)
      plugin.setStatPercents()

    ipc.on "char.vitals", (data)->
      plugin.hp = data.hp
      plugin.mana = data.mana
      plugin.moves = data.moves

      $("#char-stats-hp-current").html(plugin.hp)
      $("#char-stats-mana-current").html(plugin.mana)
      $("#char-stats-moves-current").html(plugin.moves)
      plugin.setStatPercents()


  setStatPercents: ->
    $("#char-stats-hp-percent").html(Math.floor((@hp/@maxhp)*100)+"%") unless (@hp == 0 || @maxhp == 0)
    $("#char-stats-mana-percent").html(Math.floor((@mana/@maxmana)*100)+"%") unless (@mana == 0 || @maxmana == 0)
    $("#char-stats-moves-percent").html(Math.floor((@moves/@maxmoves)*100)+"%") unless (@moves == 0 || @maxmoves == 0)

module.exports =
  register: ->
    new CharPlugin


