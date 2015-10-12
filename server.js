var PORT = 33333;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require('fs');

var start = null;
var sourceMap = {};
var tempMap = {};

server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  var data = message;

  var curr = parseInt(data.toString('hex', 22, 30), 16) / 1000;
  if (!start) start = curr;

  if (curr - start > 30) {
    start = curr;
    tempMap = sourceMap;
    sourceMap = {};

    var tempArr = [];
    for (var key in tempMap) {
      tempArr.push({
        mapId: tempMap[key].mapId,
        x: tempMap[key].x,
        y: tempMap[key].y
      });
    }

    fs.writeFile('htdocs/data.txt', JSON.stringify(tempArr), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  } else {
    var macId = data.toString('hex', 16, 22);
    sourceMap[macId] = {
      mapId: data.readIntBE(4, 4),
      x: data.readFloatBE(30),
      y: data.readFloatBE(34)
    };
  }
});

server.bind(PORT);
