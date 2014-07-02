var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var net = require('net');
var client = null;
var mainWindow = null;
var _ = require('underscore');
var TelnetInput = require('telnet-stream').TelnetInput;
var TelnetOutput = require('telnet-stream').TelnetOutput;
var processor = require('./lib/data_transformer');

require('crash-reporter').start();

ipc.on('connect-to-mud', function(event, arg) {
  client = net.connect({host: "aardmud.net", port: 6555}, function(){

    var telnetIn = new TelnetInput();
    var telnetOut = new TelnetOutput();

    client.pipe(telnetIn);//.pipe(process.stdout);
    process.stdin.pipe(telnetOut).pipe(client);

    var message = "";

    ipc.on("send-atcp2", function(event, arg){
      telnetOut.writeDo(201);
    });

    ipc.on("core-hello", function(event, arg){
      helloBuffer = new Buffer('Core.Hello { "client": "nMud", "version": "0.0.0"}');
      supportsBuffer = new Buffer('Core.Supports.Set [ "Char 1", "Comm 1", "Core 1", "Room 1", "Group 1", "Rawcolors 1"]')
      telnetOut.writeSub(201, helloBuffer);
      telnetOut.writeSub(201, supportsBuffer);
    });

    ipc.on("do-ping", function(event, arg){
      pingBuffer = new Buffer("Core.Ping");
      telnetOut.writeSub(201, pingBuffer);
    });

    ipc.on("core-message", function(event, arg){
      telnetOut.writeSub(201, new Buffer("request sectors"));
    });

    telnetIn.on('command', function(command){
      console.log("Telnet Command: " + command);
    });

    telnetIn.on("do", function(option){
      console.log("Telnet Do: " + option);
    });

    telnetIn.on("will", function(option){
      if(option == 201) {
        telnetOut.writeDo(201);
      }
      console.log("Received IAC WILL: " + option);
    });

    telnetIn.on("sub", function(option, buffer){
      console.log("Option: " + option + ", Buffer: "+ buffer);
    });

    telnetIn.on("wont", function(option){
      console.log("Wont");
    });
    telnetIn.on("dont", function(option){
      console.log("Don't'");
    });

    client.on('data', function(chunk){
      message += chunk;
      messages = message.split('\r');

      message = _.reject(messages, function(item){
        if(item.indexOf("\n")){
          event.sender.send('message-from-mud', "<div>"+processor(item)+"</div>");
          return true;
        } else {
          return false
        }
      }).join("");
    });

    client.on("close", function(){ console.log("Connection closed"); });

    client.on("error", function(err){console.log("error:", err.message);});

    ipc.on("send-message", function(event, arg) {
      console.log("Sending: ", arg);
      client.write(arg + "\n");
    });
  });
});

app.on('window-all-closed', function(){
  if(process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({height: 1000, width: 900});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  ipc.on('show-tools', function(event, arg){
    mainWindow.openDevTools();
  });

});
