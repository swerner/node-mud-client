window.onload = function(){
  var path = require('path');
  var ipc = require('ipc');

  try {
    require("fs").readdirSync(path.resolve(__dirname, "browser")).forEach(function(file) {
      if(file !== "css"){
        require("./browser/"+file).register();
      }
    });
  } catch(error){
    console.log("Error: " + error);
  }
}
