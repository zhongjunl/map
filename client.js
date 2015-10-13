var dgram = require('dgram');

var PORT = 33333;
var HOST = '120.26.192.246';

var hexStr = '7b810053000017cf0000000000000000f4e3fbc3ccfc000001504bb65f593f582d2a3e6ff659000000000258696c427ddac30258696c428066c10258696c42804ac00258696c4280fabf0258696c428102c1027b8100b3000017d10000000000000000486b2c88b91a000001504bb65f593f38d8683f2529e8000000000258696c427e8ecf0258696c4280a6c00258696c38e1cdce0258696c427f56bd0258696c42801ebc0258696c4280e2c20258696c427f4eba0258696c427dbec00258696c427d1ebf0258696c427eeeba0258696c42806ac60258696c4280babc0258696c38e24dbd0258696c4280f2bc0258696c428122c50258696c427d1abf0258696c427e2ec5027b810043000017d1000000000000000014b9681d860c000001504bb65f593ef039983e8a54a9000000000258696c4280baba0258696c4280a6b70258696c427e8eb502';

/*var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close();
});*/

var clients = [];
var CLIENT_LEN = 100;
for (var i = 0; i < CLIENT_LEN; i++) {
	clients[i] = dgram.createSocket('udp4');
}

var mac = 10000;
var room = 6095;
var ROOM_LEN = 14;
var roomIndex = 0;

setInterval(function() {
	for (var j = 0; j < 5000; j++) {
		var data = new Buffer(hexStr, 'hex');
		data.write('0000', 16, 2, 'hex');
		data.writeInt32BE(mac, 18);
		data.writeInt32BE(room + roomIndex % ROOM_LEN, 4);
		data.writeFloatBE(Math.random(), 30);
		data.writeFloatBE(Math.random(), 34);

		mac++;
		roomIndex++;

		clients[j % CLIENT_LEN].send(data, 0, data.length, PORT, HOST, function(err, bytes) {});

		/*var result = {
			macId: data.toString('hex', 16, 22),
			mapId: data.readIntBE(4, 4),
			x: data.readFloatBE(30).toFixed(3),
			y: data.readFloatBE(34).toFixed(3)
		}

		console.log(result);*/
	}
}, 1000);

