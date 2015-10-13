var $ = jQuery;

function Demo(container,imgName,data) {
  container = container || $('.container');
  this.container = container;
  this.imgName = imgName || '';
  this.data = data || [];
  this.clearAlpha = 0.0, this.size = 40, this.intensity = 0.9;
  this.initMap();
  // this.initVisual();
  //
  // this.initEvents();
}

Demo.prototype.initMap = function () {
  var container = this.container;
  var width = container.width();

  var img = $('<img src="./img/' + this.imgName + '.png" style="width: 100%; height:auto;"></img>')
  .appendTo(container);
  var self = this;
  img[0].onload = function(){
    var imgWidth = img[0].naturalWidth;
    var imgHeight = img[0].naturalHeight;
    var imgSize = self.adaptive(imgWidth,imgHeight);
    container.width(imgSize.width);
    container.height(imgSize.height);
    img.width(imgSize.width);
    img.height(imgSize.height);
    width = imgSize.width;
    var height = imgSize.height;
    //var height = Math.floor(width * img[0].naturalHeight / img[0].naturalWidth);
    var canvas = $('<canvas width="' + width + '" height="' + height + '" style="margin:0;padding:0;position:absolute;top:0;left:0;"></canvas>')
    .appendTo(container);
    self.width = width, self.height = height;
    self.initVisual(canvas[0]);
    self.render(self.data);
  };
};

Demo.prototype.adaptive = function (imgWidth, imgHeight){
  var self = this;
  var imgSize = {
    width : 0,
    height : 0
  };
  var buffer = 20;
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  var scale = Math.min(Math.min((screenWidth-2*buffer)/imgWidth,1),Math.min((screenHeight-2*buffer)/imgHeight,1));

  imgSize.width = imgWidth*scale;
  imgSize.height = imgHeight*scale;
  self.size = self.size*scale;
  return imgSize;
};

Demo.prototype.initVisual = function (canvas) {
  this.heatMap = new WebGLHeatmap({canvas:canvas});
};

Demo.prototype.processing = function (d) {
  var offsetX = 0, offsetY = 0;
  d.x = Math.floor(d.x * this.width + offsetX);
  d.y = Math.floor(d.y * this.height + offsetY);
  return d;
};
Demo.prototype.render = function(data){
  var clearAlpha = this.clearAlpha, size = this.size, intensity = this.intensity;
  var heatMap = this.heatMap;
  heatMap.multiply(clearAlpha);
  for(var i in data){
    var d = data[i];
    d = this.processing(d);
    heatMap.addPoint(d.x, d.y, size, intensity);
  }
  heatMap.update();
  heatMap.display();
};
var loopIndex = 0;
//Demo.prototype.loop = function () {
//  var clearAlpha = this.clearAlpha, size = this.size, intensity = this.intensity;
//  if(loopIndex % 10 === 0){
//    var heatMap = this.heatMap;
//    heatMap.multiply(clearAlpha);
//    var data = model.getData(function(ds){
//      for(var i in ds){
//        var d = ds[i];
//        d = this.processing(d);
//        heatMap.addPoint(d.x, d.y, size, intensity);
//      }
//     heatMap.update();
//     heatMap.display();
//    }.bind(this));
//  }
//  loopIndex++;
//  window.requestAnimationFrame(this.loop.bind(this));
//};

//module.exports = Demo;