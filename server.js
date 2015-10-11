var PORT = 33333;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require('fs');

var start = new Date().getSeconds();
var sourceArr = [];
var bakArr = [];

server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  console.log(remote.address + ':' + remote.port + ' - ' + message);

  var data = message;
  var curr = new Date().getSeconds();
  if (curr - start > 30) {
    start = curr;
    bakArr = sourceArr;
    sourceArr = [];

    fs.writeFile('data.txt', bakArr, function (err) {
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
  console.log(sourceArr.length);
});

server.bind(PORT);
