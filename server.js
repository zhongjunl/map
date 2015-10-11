var PORT = 33333;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require('fs');

var start = new Date().getTime() / 1000;
var sourceArr = [];
var bakArr = [];

server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  var data = message;
  var curr = new Date().getTime() / 1000;
  if (curr - start > 3600) {
    start = curr;
    bakArr = sourceArr;
    sourceArr = [];

    fs.writeFile('htdocs/data.txt', JSON.stringify(bakArr), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  } else {
    sourceArr.push({
      mapId: data.readIntBE(4, 4),
      x: data.readFloatBE(30),
      y: data.readFloatBE(34)
    });
  }
  //console.log(sourceArr.length);
});

server.bind(PORT);
