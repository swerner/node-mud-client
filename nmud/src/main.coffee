app = require('app')
BrowserWindow = require('browser-window')
TelnetInput = require('telnet-stream').TelnetInput
TelnetOutput = require('telnet-stream').TelnetOutput
GmcpEmitter = require('./gmcp_emitter')

ipc = require('ipc')
net = require('net')
_ = require('underscore')
require('crash-reporter').start()
processor = require("./data_processor")
zlib = require("zlib")

client = null
mainWindow = null

ipc.on "connect-to-mud", (event, arg) ->
  client = net.connect({host: "aardmud.org", port: 4000}, ->
    telnetIn = new TelnetInput()
    telnetOut = new TelnetOutput()

    client.pipe(telnetIn)
    process.stdin.pipe(telnetOut).pipe(client)

    message = ""

    ipc.on "send-atcp2", (event, arg)->
      telnetOut.writeDo(201)

    ipc.on "do-ping", (event, arg)->
      telnetOut.writeSub(201, new Buffer("Core.Ping"))

    ipc.on "core-message", (event, arg)->
      telnetOut.writeSub(201, new Buffer("request sectors"))

    ipc.on "gmcp-message", (event, arg)->
      telnetOut.writeSub(201, new Buffer(arg))

    telnetIn.on "do", (option)->
      console.log "Telnet Do: #{option}"

    telnetIn.on "will", (option)->
      if(option == 201)
        telnetOut.writeDo(201)
        helloBuffer = new Buffer('Core.hello { "client": "nMud", "version": "0.0.0"}')
        supportsBuffer = new Buffer('Core.Supports.Set [ "Char 1", "Comm 1", "Core 1", "Room 1", "Group 1", "Rawcolors 1"]')
        telnetOut.writeSub(201, helloBuffer)
        telnetOut.writeSub(201, supportsBuffer)

      if(option == 86)
        telnetOut.writeDo(86)

    telnetIn.on "sub", (option, buffer)->
      console.log("Option: #{option}, Buffer: #{buffer}")
      if option == 86
        client.unpipe()
        client.pipe(zlib.createInflate()).pipe(telnetIn)
        # client.pipe(telnetIn)

        process.stdin.unpipe()
        # process.stdin.pipe(telnetOut).pipe(client)

        process.stdin.pipe(zlib.createDeflateRaw()).pipe(telnetOut).pipe(client)

      if option == 201
        GmcpEmitter(event, buffer)

    telnetIn.on "command", (command)->
      console.log("Command: #{command}")

    telnetIn.on "data", (chunk)->
      message += chunk
      messages = message.split("\r")

      message = _.reject(messages, (item)->
        if item.indexOf("\n")
          event.sender.send("message-from-mud", item)
          console.log(item)
          return true
        else
          return false
      ).join("")

    client.on("close", -> console.log("Connection Closed"))
    client.on("error", (err)-> console.log("Error: #{err.message}"))

    ipc.on "game:ready", (event, arg) ->
      event.sender.send("game:ready", true)

    ipc.on "send-message", (event, arg)->
      console.log("Sending: #{arg}")
      client.write("#{arg}\n")
      true
  )

app.on 'window-all-closed', ->
  if(process.platform != 'darwin')
    app.quit()

app.on 'ready', ->
  mainWindow = new BrowserWindow({ height: 1000, width: 900 })
  mainWindow.loadUrl("file://#{__dirname}/index.html")

  mainWindow.on "closed", ->
    mainWindow = null

  ipc.on "show-tools", (event, arg) ->
    mainWindow.openDevTools()
