'use strict';
/**
 * @todo 页面级的tab切换
 * Created by <yu.yuy@taobao.com> on 2015-10-11.
 */
(function($){
    var tabContainer = $('#tabContainer'),
        items = tabContainer.children(),
        fullscreenBtn = $('#fullscreenBtn'),
        switchList = $('#switchList'),
        currentIndex = 0,
        screenWidth = window.screen.width,
        screenHeight = window.screen.height,
        timer = null,
        intervalTimer = null,
        demos = [],
        imgMap = {
            '6095' : '国际会展中心一层_150_350',
            '6096' : '国际会展中心二层_150_400',
            '6097' : '国际会展中心三层_150_400',
            '6098' : 'C1-1_150_150',
            '6099' : 'C1-2_150_150',
            '6100' : 'C1-3_150_150',
            '6101' : 'C1-4_150_150',
            '6102' : 'C2-1_150_150',
            '6103' : 'C3-1_150_150',
            '6104' : 'C3-2_150_150',
            '6105' : 'C3-3_150_150',
            '6106' : 'C3-4_150_150',
            '6107' : 'C4-1_150_150',
            '6108' : 'C6-1_150_300'
        },
        setItemSize = function(){
            var item;
            for(var i= 0,l=items.length;i<l;i++){
                item = items.eq(i);
                item.width(screenWidth);
                item.height(screenHeight);
            }
            tabContainer.width(screenWidth);
            tabContainer.height(screenHeight);
        },
        move = function (step) {
            step = step || 1;
            tabContainer.animate(
                {
                    scrollTop:screenHeight*step
                },
                1000,function(){
                    var childrenEls = tabContainer.children();
                    for(var i= 0;i<step;i++){
                        childrenEls.eq(i).appendTo(tabContainer);
                    }
                    currentIndex = (currentIndex+step)%childrenEls.length;
                    console.info('动画完成，到第'+(currentIndex+1)+'屏了。');


                    tabContainer.scrollTop(0);
                    switchList.val(currentIndex);
                    stay();
                    getData();
                }
            );
        },
        stay = function(){
            free();
            timer = setTimeout(move,30000);
            freeInterval();
            intervalTimer = setInterval(getData,1000);
        },
        free = function(){
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
        },
        freeInterval = function(){
            if(intervalTimer){
                clearInterval(intervalTimer);
                intervalTimer = null;
            }
        },
        getData = function(){
            var currentContainer = items.eq(currentIndex).find('.content');
            var pavilionId = currentContainer.attr('data-pavilion-id');
            //render(currentContainer,imgMap[pavilionId],[{x:0.844, y:0.234}, {x:0.723, y:0.334}, {x:0.623, y:0.434}]);
            $.ajax({
                url : 'http://120.26.192.246:3050/map/fetch.do',
                data : {
                    id : pavilionId
                },
                dataType : 'json'
            }).done(function(o){
                var data;
                if(o && o.code==200){
                    data = o.data;
                    render(currentContainer,imgMap[pavilionId],data);
                }
            }).fail(function(){
                console.info('请求失败！');
            });
        },
        render = function(container,imgName,data){
            var demo = demos[currentIndex];
            if(!demo){
                demo = new Demo(container,imgName,data);
                demos[currentIndex] = demo;
            }
            else{
                demo.render(data);
            }
        },
        launchIntoFullscreen = function(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        bindEvents = function(){
            fullscreenBtn.on('click',function(e){
                launchIntoFullscreen(document.documentElement);
            });
            switchList.on('change',function(e){
                var el = $(this);
                switchTo(el.val());
            });
            switchList.on('focus',function(e){
                free();
            });
            switchList.on('blur',function(e){
                stay();
            });
        },
        switchTo = function(id){
            var index = +id;
            var l = items.length;
            var step = (index-currentIndex+l)%l;
            move(step);
        },
        init = function(){
            setItemSize();
            bindEvents();
            if(items.length>1){
                stay();
            }
            getData();
        }();
})(jQuery);