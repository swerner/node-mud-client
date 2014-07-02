(function() {
  var BrowserWindow, GmcpEmitter, TelnetInput, TelnetOutput, app, client, ipc, mainWindow, net, processor, zlib, _;

  app = require('app');

  BrowserWindow = require('browser-window');

  TelnetInput = require('telnet-stream').TelnetInput;

  TelnetOutput = require('telnet-stream').TelnetOutput;

  GmcpEmitter = require('./gmcp_emitter');

  ipc = require('ipc');

  net = require('net');

  _ = require('underscore');

  require('crash-reporter').start();

  processor = require("./data_processor");

  zlib = require("zlib");

  client = null;

  mainWindow = null;

  ipc.on("connect-to-mud", function(event, arg) {
    return client = net.connect({
      host: "aardmud.org",
      port: 4000
    }, function() {
      var message, telnetIn, telnetOut;
      telnetIn = new TelnetInput();
      telnetOut = new TelnetOutput();
      client.pipe(telnetIn);
      process.stdin.pipe(telnetOut).pipe(client);
      message = "";
      ipc.on("send-atcp2", function(event, arg) {
        return telnetOut.writeDo(201);
      });
      ipc.on("do-ping", function(event, arg) {
        return telnetOut.writeSub(201, new Buffer("Core.Ping"));
      });
      ipc.on("core-message", function(event, arg) {
        return telnetOut.writeSub(201, new Buffer("request sectors"));
      });
      ipc.on("gmcp-message", function(event, arg) {
        return telnetOut.writeSub(201, new Buffer(arg));
      });
      telnetIn.on("do", function(option) {
        return console.log("Telnet Do: " + option);
      });
      telnetIn.on("will", function(option) {
        var helloBuffer, supportsBuffer;
        if (option === 201) {
          telnetOut.writeDo(201);
          helloBuffer = new Buffer('Core.hello { "client": "nMud", "version": "0.0.0"}');
          supportsBuffer = new Buffer('Core.Supports.Set [ "Char 1", "Comm 1", "Core 1", "Room 1", "Group 1", "Rawcolors 1"]');
          telnetOut.writeSub(201, helloBuffer);
          telnetOut.writeSub(201, supportsBuffer);
        }
        if (option === 86) {
          return telnetOut.writeDo(86);
        }
      });
      telnetIn.on("sub", function(option, buffer) {
        console.log("Option: " + option + ", Buffer: " + buffer);
        if (option === 86) {
          client.unpipe();
          client.pipe(zlib.createInflate()).pipe(telnetIn);
          process.stdin.unpipe();
          process.stdin.pipe(zlib.createDeflateRaw()).pipe(telnetOut).pipe(client);
        }
        if (option === 201) {
          return GmcpEmitter(event, buffer);
        }
      });
      telnetIn.on("command", function(command) {
        return console.log("Command: " + command);
      });
      telnetIn.on("data", function(chunk) {
        var messages;
        message += chunk;
        messages = message.split("\r");
        return message = _.reject(messages, function(item) {
          if (item.indexOf("\n")) {
            event.sender.send("message-from-mud", item);
            console.log(item);
            return true;
          } else {
            return false;
          }
        }).join("");
      });
      client.on("close", function() {
        return console.log("Connection Closed");
      });
      client.on("error", function(err) {
        return console.log("Error: " + err.message);
      });
      ipc.on("game:ready", function(event, arg) {
        return event.sender.send("game:ready", true);
      });
      return ipc.on("send-message", function(event, arg) {
        console.log("Sending: " + arg);
        client.write("" + arg + "\n");
        return true;
      });
    });
  });

  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
      return app.quit();
    }
  });

  app.on('ready', function() {
    mainWindow = new BrowserWindow({
      height: 1000,
      width: 900
    });
    mainWindow.loadUrl("file://" + __dirname + "/index.html");
    mainWindow.on("closed", function() {
      return mainWindow = null;
    });
    return ipc.on("show-tools", function(event, arg) {
      return mainWindow.openDevTools();
    });
  });

}).call(this);
