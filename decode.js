var fs = require('fs');

if (process.argv.length < 3) {
  console.log('至少要3个参数');
}

var filePath = process.argv[2];

fs.readFile(filePath, function (err, data) {
  if (err) throw err;
  console.log(data);
  if (data[0] === 0x7b && data[1] === 0x81) {
    console.log("地图标识号", data.readIntBE(4, 4));
	console.log("区域标识号", data.readIntBE(8, 4));
    console.log("x坐标", data.readFloatBE(30));
	console.log("y坐标", data.readFloatBE(34));
	console.log("z坐标", data.readFloatBE(38));
  } else {
    console.log('不合法');
  }

});
