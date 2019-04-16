var siteListHeight = $(window).height() - $('.map-area').height();
$('.site-list-wrap').css('height',siteListHeight)
$('.site-icon').on('click',function(){
    $.confirm('是否自动识别地址', function () {
        getPresentLocal();
        $('.map-lacation-wrap').css('display','block')
    },function () {

    })
});
$('.map-back-btn').on('click',function(){
    $('.map-lacation-wrap').css('display','none')
});
// 创建地图实例  
var map = new BMap.Map("container");
// 创建点坐标  
var point = new BMap.Point(116.404, 39.915);
// 初始化地图，设置中心点坐标和地图级别  
map.centerAndZoom(point, 16);
//开启鼠标滚轮缩放
map.enableScrollWheelZoom(true); 
//定位
var geolocation = new BMap.Geolocation();
// 开启SDK辅助定位
// 创建地理编码实例      
var myGeo = new BMap.Geocoder();  

function getPresentLocal() {
    geolocation.enableSDKLocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            console.log(r,'您的位置：'+r.point.lng+','+r.point.lat);
            map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 18);      
            // 根据坐标得到地址描述    
            myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){      
                if (result){      
                    console.log('地址',result);      
                    displayPOI(result.point.lng,result.point.lat,1500);
                }      
            });
        }
        else {
            alert('failed'+this.getStatus());
        }        
    });
}    

/*function displayPOI(site,lng,lat) {
    map.clearOverlays();
    var poiType = site;
    var mPoint = new BMap.Point(lng, lat);
    var circle = new BMap.Circle(mPoint,1500,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 1, strokeOpacity: 1});
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false,panel: "site-list-wrap"}});
    local.searchNearby('楼',mPoint,1500);
    local.setMarkersSetCallback(function (result) {
        console.log('resulttttttt',result,poiType)
    })
    console.log('local',circle)
}*/
var sites=[];
var ponits_=[];//经纬度和地址信息
function displayPOI(lng,lat,r){//参数：经lat、纬度lng、半径r
    var mOption = {
        poiRadius : r,           //半径为r米内的POI,
        numPois : 10             //最多只有12个 系统决定的
    }
    var mPoint = new BMap.Point(lng, lat);
    myGeo.getLocation(mPoint,
        function mCallback(rs){
            var sites = rs.surroundingPois; //获取全部POI(半径R的范围 最多12个点)
            if(sites==null || sites==""){
                return;
            }
            for(var i=0;i<sites.length;i++) {
                var Point = new BMap.Point(sites[i].point.lng, sites[i].point.lat);
                /*appendLacationPOI(Point,sites[i]);*/
                var strHtml;
                strHtml = "<li>";
                strHtml += "<p>"+sites[i].title+"</p>";
                strHtml += "<p>"+rs.addressComponents.city+' '+rs.addressComponents.district+"</p>";
                strHtml += "</li>";
                $(".site-list-wrap ul").append(strHtml);
               /* console.log(sites[i].title)*/
            }
            console.log(sites,ponits_);
        },mOption
    );          
}

function appendLacationPOI(res,site) {
  var Point = res;
  myGeo.getLocation(Point,function (result) {
    var strHtml;
    strHtml = "<li>";
    strHtml += "<p>"+site.title+"</p>";
    strHtml += "<p>"+result.addressComponents.city+' '+result.addressComponents.district+"</p>";
    strHtml += "</li>";
    $(".site-list-wrap ul").append(strHtml)
    console.log(site,result)
    })
}

$('.site-list-wrap ul').on('click',".site-list-wrap ul li",function(event){
    $(".detail_textarea_wrap textarea").html($(this).children()[0].innerHTML);
    $('.map-lacation-wrap').css('display','none')
});



