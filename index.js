var http = require('http');
var fs = require('fs');
var parse = require('url').parse;

function getQueryString(str, name) {
  if (!str) return null;
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = str.match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

http.createServer(function (req, res) {
  var urlObj = parse(req.url);
  if (urlObj.pathname == '/map/fetch.do') {
    fs.readFile('htdocs/data.txt', 'utf-8',function (err, data) {
      if (err) throw err;

      var arr = JSON.parse(data);
      var paramId = getQueryString(urlObj.query, "id");
      var item, temp = [];
      if (paramId) {
        for (var i = 0; i < arr.length; i++) {
          item = arr[i];

          if (item.mapId == paramId) {
            delete item.mapId;
            temp.push(item);
          }
        }
        data = temp;
      } else {
        temp = {};
        for (var i = 0; i < arr.length; i++) {
          item = arr[i];

          if (!temp[item.mapId]) temp[item.mapId] = [];
          temp[item.mapId].push(item);
          delete item.mapId;
        }
      }


      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(JSON.stringify({
        code : 200,
        message : '',
        data : temp
      }));
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
}).listen(3050);

console.log('Server running at http://127.0.0.1:3050/');