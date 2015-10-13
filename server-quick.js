var PORT = 33333;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require('fs');

var start = null;

//15个短周期数据
var longArr = [];
//短周期数据
var shortArr = [];
var TIME = 1;
var LEN = 30;
var inx = 0;

for (var i = 0; i < LEN; i++) {
  longArr[i] = [];
}

server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  var data = message;

  var curr = parseInt(data.toString('hex', 22, 30), 16);
  if (!start) start = curr;

  if (curr - start > TIME * 1000) {
    start = curr;
    longArr[inx % LEN] = shortArr;
    shortArr = [];
    inx = inx + 1;

    var tempArr = Array.prototype.concat.apply([], longArr);
    var tempMap = {};
    var item;
    
    for (int j = 0; j < tempArr.length; j ++) {
      item = tempArr[j];
      tempMap[item.macId] = item;
    }

    tempArr = [];
    for (var key in tempMap) {
      tempArr.push({
        mapId: tempMap[key].mapId,
        x: tempMap[key].x,
        y: tempMap[key].y
      });
    }

    fs.writeFile('htdocs/data.txt', JSON.stringify(tempArr), function (err) {
      if (err) throw err;
      //console.log('It\'s saved!');
    });
  } else {
    var macId = data.toString('hex', 16, 22);
    shortArr.push({
      macId: macId,
      mapId: data.readIntBE(4, 4),
      x: data.readFloatBE(30).toFixed(3),
      y: data.readFloatBE(34).toFixed(3)
    })
  }
});

server.bind(PORT);
