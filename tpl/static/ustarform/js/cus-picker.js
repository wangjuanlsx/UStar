// 处理安卓手机输入法遮挡输入框问题
function jump_top(){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        $("body").css("height","0px");
        $("body").css("height",document.body.scrollHeight);
        var originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
        $('#textArea').on("focus",function(event){
            if($(event.target).attr("type")=="button")return;
            $("body").css("margin-bottom","500px");
            $(window).scrollTop($('#textArea').offset().top-100);
            $('#footer').css("position","absolute");
            event.preventDefault();
        });
        window.addEventListener('resize', function () {
            //键盘弹起与隐藏都会引起窗口的高度发生变化
            var resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
            if((resizeHeight > originalHeight)||(resizeHeight == originalHeight)){
                //当软键盘收起，在此处操作
                $('#textArea').blur();
                $("body").css("height","0px");
                $("body").css("height",document.body.scrollHeight);
                $("body").css("margin-bottom","0px");
                $('#footer').css("position","fixed");
            }
        })
    };
}
jump_top();
//对字符串扩展,多个空格替换成一个空格
String.prototype.ResetBlank=function(){
    var regEx = /\s+/g;
    return this.replace(regEx, ' ');
};

function checkWords(input) {
    // 获取要显示已经输入字数文本框对象
    var content = document.getElementById('textNum');
    if (content && input) {
        // 获取输入框输入内容长度并更新到界面
        var value = input.value;
        // 将换行符不计算为单词数
        value = value.replace(/\n|\r/gi, "");
        // 更新计数
        content.innerText = value.length;
    }
}
var splitKey = ",";
//postInfo 保存地址解析的信息
var postInfo = {
    name: "",
    phoneNum: "",
    proName: "",
    cityName: "",
    disName: "",
    proId: "",
    cityId: "",
    detailedAddress: ""
}
function noopsycheFill() {
    postInfo.name = "";
    postInfo.phoneNum = "";
    postInfo.proName = "";
    postInfo.cityName = "";
    postInfo.disName = "";
    postInfo.proId = "";
    postInfo.cityId = "";
    postInfo.detailedAddress = "";

    var content = $.trim($("#textArea").val());

    if (content.length == 0 || content == "") {
        $.alert("请粘贴或填写地址信息！");
        $("#textArea").focus();
        return false;
    }

    content = SymbolReplace(content);//文本框内容
    var infoList = content.split(",");//分割里面内容
    infoList = notempty(infoList);

    for (var i in infoList) {
        if (infoList[i] == "") {
            continue;
        }
        var infoContent = RemoveBlankSpace(infoList[i], "g");

        /*CityValidation(infoContent);*/
        // 是否有一级或二级或三级地址
        var isHasAddrass = isAddrass(infoContent);
        console.log(isHasAddrass);
        if(isHasAddrass){
            detailAddrassParse(infoContent);
        }else {
            if (isName(infoContent).type) {
                postInfo.name = isName(infoContent).value;
            }else {
                postInfo.phoneNum = infoContent;
            }
        }
    }
    $("#name").val(postInfo.name);
    $("#phone").val(postInfo.phoneNum);
    var cityAddress = postInfo.proName + " " + postInfo.cityName + " " + postInfo.disName;
    $("#sel_city").val(cityAddress);
    $("#detailAddress").val(postInfo.detailedAddress);
    if(postInfo.proName.length==0||postInfo.cityName.length==0){
        $.alert("省市不能为空，请手动选择！");
    }
    // 点击只能填写后
}
/**
 *城市验证
 * */
 function CityValidation(addressInfo) {
    var address = "";
    //省，自治区，直辖市
    getAllProvince();
    var lenP = allProvince.length;
    for (var j = 0; j < lenP; j++) {
        var resultP = addressInfo.search(allProvince[j].name);
        if (resultP != -1) {
            postInfo.proName = allProvince[j].name;
            postInfo.proId = allProvince[j].id;
            address += allProvince[j].name;
            break;
        }
    }

    //市，区
    getAllCity();
    var lenC = allCity.length;
    for (var k = 0; k < lenC; k++) {
        var resultC = addressInfo.search(allCity[k].name);
        if (resultC != -1) {
            if (postInfo.proId == allCity[k].provinceId) {
                postInfo.cityName = allCity[k].name;
                postInfo.cityId = allCity[k].id;
                address += allCity[k].name;
                break;
            }
        }
    }

    //县，乡，镇
    getAllCounty();
    var lenD = allCounty.length;
    for (var l = 0; l < lenD; l++) {
        var resultD = addressInfo.search(allCounty[l].name);
        if (resultD != -1) {
            if (postInfo.cityId == allCounty[l].cityId) {
                postInfo.disName = allCounty[l].name;
                address += allCounty[l].name;
                break;
            }
        }
    }

    //截取详细地址
    if (address.length > 0) {
        var completeAddress = addressInfo;
        var key = address.substring(address.length - 3);
        var detAddress = completeAddress.trim().split(key)[1];
        postInfo.detailedAddress = detAddress;
    }
}
//文字中是否有地址可以匹配
function isAddrass(addressInfo) {
    // 获取地区地址
    getAllCounty();
    getAllCity();
    getAllProvince();
    // 不输入全名的
    var is_County3 = -1;
    // 三级地区 去掉 县，区，旗
    var deep3_area_short = '';
    var CountyLen = allCounty.length;
    var cityLen = allCity.length;
    var provinceLen = allProvince.length;
    //是否有三级地址
    var hasCounty = false;
    //是否有二级地址
    var is_city = -1;
    var hasCity = false;
    var deep2_area_short1 = '';
    // 是否有一级地址
    var is_province = -1;
    var hasProvince = false;
    var deep1_area_short1 = '';
    // 三级地址
    for(var countryI3 = 0; countryI3 < CountyLen; countryI3++ ) {
        //  三级地区 去掉 县，区，旗
        if(allCounty[countryI3].name.length>2){
            deep3_area_short = allCounty[countryI3].name.substr(0,allCounty[countryI3].name.length-1);
        }else {
            deep3_area_short = allCounty[countryI3].name.substr(0,allCounty[countryI3].name.length);
        }
        is_County3 = addressInfo.search(deep3_area_short);
        if(is_County3!=-1) {
            hasCounty = true;
        }
    }
    // 二级地址
    if(hasCounty){
        return hasCounty;
    }else {
        for(var cityI1 = 0; cityI1 < cityLen; cityI1++){
            if((allCity[cityI1].name.search("市")!=-1)||(allCity[cityI1].name.search("盟")!=-1)||(allCity[cityI1].name.search("县")!=-1)) {
                deep2_area_short1 = allCity[cityI1].name.substr(0,allCity[cityI1].name.length-1);
            }else if((allCity[cityI1].name.search("地区")!=-1)||(allCity[cityI1].name.search("半岛")!=-1)) {
                deep2_area_short1 = allCity[cityI1].name.substr(0,allCity[cityI1].name.length-2);
            }else if((allCity[cityI1].name.search("自治州")!=-1)||(allCity[cityI1].name.search("自治县")!=-1)) {
                deep2_area_short1 = allCity[cityI1].name.substr(0,2);
            }
            is_city = addressInfo.search(deep2_area_short1);
            if(is_city!=-1) {
                hasCity = true;
            }
        }
        if(hasCity){
            return hasCity;
        }else {
            //一级地址
            for(var provinceI1 = 0; provinceI1 < provinceLen; provinceI1++){
                if((allProvince[provinceI1].name.search("省")!=-1)) {
                    deep1_area_short1 = allProvince[provinceI1].name.substr(0,allProvince[provinceI1].name.length-1);
                }else{
                    deep1_area_short1 = allProvince[provinceI1].name.substr(0,2);
                }
                is_province = addressInfo.search(deep1_area_short1);
                if(is_province!=-1) {
                    hasProvince = true;
                }
            }
            return hasProvince;
        }
    }
}
// 对地址字符串的重新的分割
function detailAddrassParse(addressInfo){
    // 一级地区的区数组
    var deep1_area = '';
    var deep2_area = '';
    var is_deep1_area1 = addressInfo.search("特别行政区");
    var is_deep1_area2 = addressInfo.search("自治区");
    if((is_deep1_area1 != -1)||(is_deep1_area2 != -1)){
        if(is_deep1_area1 != -1) {
            deep1_area = addressInfo.substr(0,is_deep1_area1+5);
            addressInfo = addressInfo.substr(is_deep1_area1+5);
        }
        if(is_deep1_area2 != -1) {
            deep1_area = addressInfo.substr(0,is_deep1_area2+3);
            addressInfo = addressInfo.substr(is_deep1_area2+3);
        }

    }
    // 三级地址识别
    var is_deep3_area1 = addressInfo.search("县");
    var is_deep3_area2 = addressInfo.search("区");
    var is_deep3_area3 = addressInfo.search("旗");
    var is_deep3_area4 = addressInfo.search("市");
    // 三级地址后的详细地址
    var detail_area = '';
    var detail_area1 = '';
    // 三级地址
    var deep3_area = '';
    // 三级地址 前的二级和一级 地址
    var before_deep3_area = '';
    // 详细地址前的地址
    var before_detail_area = '';
    // 获取三级地区地址
    getAllCounty();
    getAllCity();
    getAllProvince();
    var CountyLen = allCounty.length;
    if((is_deep3_area1!=-1)||(is_deep3_area2!=-1)||(is_deep3_area3!=-1)||(is_deep3_area4!=-1)) {
        // 输入全名的
        // 旗
        if(is_deep3_area3!=-1) {
            before_detail_area = addressInfo.substr(0,is_deep3_area3+1);
            detail_area = addressInfo.substr(is_deep3_area3+1);
            var is_deep3_area3All= getDeep3Area(before_detail_area);
            deep3_area = is_deep3_area3All.deep3_area;
            before_deep3_area = is_deep3_area3All.before_deep3_area;
            deep2_area = is_deep3_area3All.deep2_area;
            deep1_area = is_deep3_area3All.deep1_area;
            detail_area1 = is_deep3_area3All.detail_area;

            postInfo.proName = deep1_area;
            postInfo.cityName = deep2_area;
            postInfo.disName = deep3_area;
            postInfo.detailedAddress = detail_area1+detail_area;
        }
        // 区
        if(is_deep3_area2!=-1) {
            if(deep3_area){
                return;
            }
            // 东城区单独处理，如果出现东城区字眼
            var is_deep3_area2_dong = addressInfo.search("东城区");
            if(is_deep3_area2_dong!=-1){
                before_detail_area = addressInfo.substr(0, is_deep3_area2);
            }else {
                before_detail_area = addressInfo.substr(0, is_deep3_area2+1);
            }

            detail_area = addressInfo.substr(is_deep3_area2+1);
            var is_deep3_area2All= getDeep3Area(before_detail_area);
            deep3_area = is_deep3_area2All.deep3_area;
            before_deep3_area = is_deep3_area2All.before_deep3_area;
            deep2_area = is_deep3_area2All.deep2_area;
            deep1_area = is_deep3_area2All.deep1_area;
            detail_area1 = is_deep3_area2All.detail_area;
            postInfo.proName = deep1_area;
            postInfo.cityName = deep2_area;
            postInfo.disName = deep3_area;
            postInfo.detailedAddress = detail_area1+detail_area;
        }

        // 县
        if(is_deep3_area1!=-1) {
            if(deep3_area){
                return;
            }
            before_detail_area = addressInfo.substr(0,is_deep3_area1+1);
            detail_area = addressInfo.substr(is_deep3_area1+1);
            var is_deep3_area1All= getDeep3Area(before_detail_area);
            deep3_area = is_deep3_area1All.deep3_area;
            before_deep3_area = is_deep3_area1All.before_deep3_area;
            deep2_area = is_deep3_area1All.deep2_area;
            deep1_area = is_deep3_area1All.deep1_area;
            detail_area1 = is_deep3_area1All.detail_area;
            postInfo.proName = deep1_area;
            postInfo.cityName = deep2_area;
            postInfo.disName = deep3_area;
            postInfo.detailedAddress = detail_area1+detail_area;
        }
        // 三级地区为市
        if(is_deep3_area4!=-1) {
            if(deep3_area){
                return;
            }
            before_detail_area = addressInfo.substr(0,is_deep3_area4+1);
            detail_area = addressInfo.substr(is_deep3_area4+1)
            var is_deep3_area4All= getDeep3Area(before_detail_area);
            deep3_area = is_deep3_area4All.deep3_area;
            before_deep3_area = is_deep3_area4All.before_deep3_area;
            deep2_area = is_deep3_area4All.deep2_area;
            deep1_area = is_deep3_area4All.deep1_area;
            detail_area1 = is_deep3_area4All.detail_area;
            postInfo.proName = deep1_area;
            postInfo.cityName = deep2_area;
            postInfo.disName = deep3_area;
            postInfo.detailedAddress = detail_area1+detail_area;
            /*var is_County1 = -1;
            var deep3_area_city_id_4 = '';
            for(var countryI1 = 0; countryI1 < CountyLen; countryI1++ ) {
                is_County1 = addressInfo.search(allCounty[countryI1].name);
                if(is_County1 != -1) {
                    before_deep3_area = addressInfo.substr(0,is_County1);
                    deep3_area = allCounty[countryI1].name;
                    deep3_area_city_id_4 = allCounty[countryI1].cityId;
                    detail_area = addressInfo.substr(is_County1).split(allCounty[countryI1].name)[1];
                    console.log(is_County1,deep3_area);
                    console.log(before_deep3_area,detail_area);
                }
            }
            if (deep3_area.length==0&&detail_area.length!=0){
                detail_area = '';
                before_deep3_area = addressInfo;
            }
            console.log("888",before_deep3_area);
            deep2_area = getDeep2Area(before_deep3_area,deep3_area_city_id_4).deep2_area;
            deep1_area = getDeep2Area(before_deep3_area,deep3_area_city_id_4).deep1_area;
            detail_area1 = getDeep2Area(before_deep3_area,deep3_area_city_id_4).detail_area;*/
            /*deep2_area = getDeep2Area(before_deep3_area).deep2_area;
            deep1_area = getDeep2Area(before_deep3_area).deep1_area;
            detail_area1 = getDeep2Area(before_deep3_area).detail_area;*/
        }
    }else {
        // 不输入全名的
        var is_County2 = -1;
        // 三级地区 去掉 县，区，旗
        var deep3_area_short = '';
        var deep3_area_city_id_5 = '';
        for(var countryI2 = 0; countryI2 < CountyLen; countryI2++ ) {
            //  三级地区 去掉 县，区，旗
            if(allCounty[countryI2].name.length>2){
                deep3_area_short = allCounty[countryI2].name.substr(0,allCounty[countryI2].name.length-1);
            }else {
                deep3_area_short = allCounty[countryI2].name.substr(0,allCounty[countryI2].name.length);
            }
            is_County2 = addressInfo.search(deep3_area_short);
            // 三级地区位置>2,且匹配三级地名长度大于2
            /*if((is_County2 != -1) && (is_County2>2||is_County2==2)) {
                console.log(allCounty[countryI2].name);
                console.log(is_County2);
                before_deep3_area = addressInfo.substr(0,is_County2);
                deep3_area = allCounty[countryI2].name;
                deep3_area_city_id_5 = allCounty[countryI2].cityId;
                detail_area = addressInfo.substr(is_County2).split(deep3_area_short)[1];
                console.log(before_deep3_area,deep3_area,detail_area);
            }*/
            var is_hainan1 = addressInfo.search("海南");
            var is_henan1 = addressInfo.search("河北");
            if(is_hainan1!=-1||is_henan1!=-1){
                if((is_County2 != -1) && (is_County2>2||is_County2==2)) {
                    console.log(allCounty[countryI2].name);
                    console.log(is_County2);
                    before_deep3_area = addressInfo.substr(0,is_County2);
                    deep3_area = allCounty[countryI2].name;
                    deep3_area_city_id_5 = allCounty[countryI2].cityId;
                    detail_area = addressInfo.substr(is_County2).split(deep3_area_short)[1];
                    console.log(before_deep3_area,deep3_area,detail_area);
                }
            }else {
                if((is_County2 != -1)) {
                    console.log(allCounty[countryI2].name);
                    console.log(is_County2);
                    before_deep3_area = addressInfo.substr(0,is_County2);
                    deep3_area = allCounty[countryI2].name;
                    deep3_area_city_id_5 = allCounty[countryI2].cityId;
                    detail_area = addressInfo.substr(is_County2).split(deep3_area_short)[1];
                    console.log(before_deep3_area,deep3_area,detail_area);
                }
            }
        }
        if(before_deep3_area.length==0){
            before_deep3_area = addressInfo;
        }
        var noFullAll = getDeep2Area(before_deep3_area,deep3_area_city_id_5);
        deep2_area = noFullAll.deep2_area;
        deep1_area = noFullAll.deep1_area;
        detail_area1 = noFullAll.detail_area;
        /*deep2_area = getDeep2Area(before_deep3_area).deep2_area;
        deep1_area = getDeep2Area(before_deep3_area).deep1_area;
        detail_area1 = getDeep2Area(before_deep3_area).detail_area;*/
        postInfo.proName = deep1_area;
        postInfo.cityName = deep2_area;
        postInfo.disName = deep3_area;
        postInfo.detailedAddress = detail_area1+detail_area;
    }
    /*postInfo.proName = deep1_area;
    postInfo.cityName = deep2_area;
    postInfo.disName = deep3_area;
    postInfo.detailedAddress = detail_area1+detail_area*/;
    console.log("deep1_area",deep1_area,"deep2_area",deep2_area,"deep3_area",deep3_area,"before_deep3_area",before_deep3_area,"before_detail_area",before_detail_area,"detail_area",detail_area);
}

// 一二三级地址已经和详情地址区分开，一二三级地址字符串before_detail_area，详细地址字符串detail_area
function getDeep3Area(before_detail_area) {
    var before_deep3_area = before_detail_area;
    var deep3_area = '';
    var deep3_area_provice_id = '';
    var deep3_area_city_id = '';
    var before_deep3_area1 = '';
    var CountyLen = allCounty.length;
    // 一级地区的区数组
    var deep1_area = '';
    var deep2_area = '';
    var detail_area1 = '';
    // 三级地址简称
    var deep3_area_short1 = '';
    var is_County3 = -1;
    for(var countryI3 = 0; countryI3 < CountyLen; countryI3++ ) {
        //  三级地区 去掉 县，区，旗
        if(allCounty[countryI3].name.length>2){
            deep3_area_short1 = allCounty[countryI3].name.substr(0,allCounty[countryI3].name.length-1);
        }else {
            deep3_area_short1 = allCounty[countryI3].name.substr(0,allCounty[countryI3].name.length);
        }
        is_County3 = before_detail_area.search(deep3_area_short1);
        // 三级地区位置>2,且匹配三级地名长度大于2
        var is_hainan = before_detail_area.search("海南");
        var is_henan = before_detail_area.search("河北");
        if(is_hainan!=-1||is_henan!=-1){
            if((is_County3 != -1) && (is_County3>2||is_County3==2)) {
                before_deep3_area1 = before_detail_area.substr(0,is_County3);
                deep3_area_provice_id = allCounty[countryI3].provinceId;
                // 只有三级地址的proviceId和一级二级的proviceId相等才取出deep3_area
                if(deep3AreaIsTrue(before_deep3_area1,deep3_area_provice_id)) {
                    before_deep3_area = before_detail_area.substr(0,is_County3);
                    deep3_area = allCounty[countryI3].name;
                    deep3_area_city_id = allCounty[countryI3].cityId;
                }
            }
        }else {
            if((is_County3 != -1)) {;
                before_deep3_area1 = before_detail_area.substr(0,is_County3);
                deep3_area_provice_id = allCounty[countryI3].provinceId;
                // 只有三级地址的proviceId和一级二级的proviceId相等才取出deep3_area
                console.log("3333",deep3AreaIsTrue(before_deep3_area1,deep3_area_provice_id));
                if(deep3AreaIsTrue(before_deep3_area1,deep3_area_provice_id)) {
                    before_deep3_area = before_detail_area.substr(0,is_County3);
                    deep3_area = allCounty[countryI3].name;
                    deep3_area_city_id = allCounty[countryI3].cityId;
                    console.log("666",before_deep3_area,deep3_area_city_id);
                }
            }
        }


    }
    var deep3AllData = getDeep2Area(before_deep3_area,deep3_area_city_id);
    deep2_area = deep3AllData.deep2_area;
    deep1_area = deep3AllData.deep1_area;
    detail_area1 = deep3AllData.detail_area;
    console.log("555",deep2_area,deep1_area);

    return {"before_deep3_area":before_deep3_area,"deep3_area":deep3_area,"deep2_area":deep2_area,"deep1_area":deep1_area,"detail_area":detail_area1};
}
//北京东城区识别成东城
//根据三级确定地址，确定proviceId,再找到before_deep3_area的proviceId,判断是否相当
function deep3AreaIsTrue(before_deep3_area,deep3_area_provice_id) {
    console.log("传值",before_deep3_area,deep3_area_provice_id);
    // 获取地区地址
    getAllCounty();
    getAllCity();
    getAllProvince();
    // 三级地区 去掉 县，区，旗
    var cityLen = allCity.length;
    var provinceLen = allProvince.length;
    //是否有二级地址
    var is_city = -1;
    var is_equal_City = false;
    var deep2_area_short1 = '';
    var deep2_area_provice_id = '';
    // 是否有一级地址
    var is_province = -1;
    var is_equal_Province = false;
    var deep1_area_short1 = '';
    var deep1_area_provice_id = '';
    // 二级地址
    if(before_deep3_area.length!=0){
        for(var cityI1 = 0; cityI1 < cityLen; cityI1++){
            if((allCity[cityI1].name.search("市")!=-1)||(allCity[cityI1].name.search("盟")!=-1)||(allCity[cityI1].name.search("县")!=-1)) {
                deep2_area_short1 = allCity[cityI1].name.substr(0,allCity[cityI1].name.length-1);
            }else if((allCity[cityI1].name.search("地区")!=-1)||(allCity[cityI1].name.search("半岛")!=-1)) {
                deep2_area_short1 = allCity[cityI1].name.substr(0,allCity[cityI1].name.length-2);
            }else if((allCity[cityI1].name.search("自治州")!=-1)||(allCity[cityI1].name.search("自治县")!=-1)) {
                deep2_area_short1 = allCity[cityI1].name.substr(0,2);
            }
            is_city = before_deep3_area.search(deep2_area_short1);
            if(is_city!=-1) {
                deep2_area_provice_id = allCity[cityI1].provinceId;
                if(deep3_area_provice_id==deep2_area_provice_id){
                    console.log("二级",deep2_area_provice_id,deep3_area_provice_id);
                    is_equal_City = true;
                }
            }
        }
        if(is_equal_City){
            return is_equal_City;
        }else {
            //一级地址
            for(var provinceI1 = 0; provinceI1 < provinceLen; provinceI1++){
                if((allProvince[provinceI1].name.search("省")!=-1)) {
                    deep1_area_short1 = allProvince[provinceI1].name.substr(0,allProvince[provinceI1].name.length-1);
                }else{
                    deep1_area_short1 = allProvince[provinceI1].name.substr(0,2);
                }
                is_province = before_deep3_area.search(deep1_area_short1);
                if(is_province!=-1) {
                    deep1_area_provice_id = allProvince[provinceI1].id;
                    if(deep3_area_provice_id==deep1_area_provice_id){
                        console.log("一级",deep1_area_provice_id,deep3_area_provice_id);
                        is_equal_Province = true;
                    }
                }
            }
            return is_equal_Province;
        }
    }else {
        return true;
    }

}

function getDeep2Area(before_deep3_area,deep3_area_city_id){
    var deep2_area = '';
    var deep1_area = '';
    var detail_area = '';
    var is_city = -1;
    // 二级地址简称
    var deep2_area_short1 = '';
    var cityLen = allCity.length;
    // 一级地址简称
    var deep1_area_short1 = '';
    var provinceId = '';
    var provinceLen = allProvince.length;
    var is_province = -1;
    // 二级级地址识别
    var is_deep2_area1 = before_deep3_area.search("市");
    var is_deep2_area2 = before_deep3_area.search("区");
    var is_deep2_area3 = before_deep3_area.search("盟");
    var is_deep2_area4 = before_deep3_area.search("自治州");
    var is_deep2_area5 = before_deep3_area.search("自治县");
    // 二級地址高频词（市、自治州、地区、盟、半岛、自治县）!=-1 就是存在
    /*if((is_deep2_area1!=-1)||(is_deep2_area2!=-1)||(is_deep2_area3!=-1)||(is_deep2_area4!=-1)||(is_deep2_area5!=-1)){
        detail_area = before_deep3_area.split(deep2_area);
    }else {
        detail_area = before_deep3_area.split(deep2_area_short1);
    }*/
    if(deep3_area_city_id.length==0){
        if(before_deep3_area.length!=0){
            for(var cityI1 = 0; cityI1 < cityLen; cityI1++){
                if((allCity[cityI1].name.search("市")!=-1)||(allCity[cityI1].name.search("盟")!=-1)||(allCity[cityI1].name.search("县")!=-1)) {
                    deep2_area_short1 = allCity[cityI1].name.substr(0,allCity[cityI1].name.length-1);
                }else if((allCity[cityI1].name.search("地区")!=-1)||(allCity[cityI1].name.search("半岛")!=-1)) {
                    deep2_area_short1 = allCity[cityI1].name.substr(0,allCity[cityI1].name.length-2);
                }else if((allCity[cityI1].name.search("自治州")!=-1)||(allCity[cityI1].name.search("自治县")!=-1)) {
                    deep2_area_short1 = allCity[cityI1].name.substr(0,2);
                }
                is_city = before_deep3_area.search(deep2_area_short1);
                if(is_city!=-1){
                    deep2_area = allCity[cityI1].name;
                    deep1_area = before_deep3_area.substr(0,is_city);
                    // 在详细地址里的区，遗落在二级和一级里的详细地址
                    if(before_deep3_area.search(deep2_area)!=-1){
                        detail_area = before_deep3_area.split(deep2_area)[1];
                    }else {
                        detail_area = before_deep3_area.split(deep2_area_short1)[1];
                    }
                    console.log(detail_area,deep2_area);
                    // 二级前面不管填没填，都获取到二级前面的省份id
                    /*if(deep1_area.length==0){
                        provinceId = allCity[cityI1].provinceId;
                    }*/
                    provinceId = allCity[cityI1].provinceId;
                    for(var provinceI1 = 0; provinceI1 < provinceLen; provinceI1++){
                        if((allProvince[provinceI1].name.search("省")!=-1)) {
                            deep1_area_short1 = allProvince[provinceI1].name.substr(0,allProvince[provinceI1].name.length-1);
                        }else{
                            deep1_area_short1 = allProvince[provinceI1].name.substr(0,2);
                        }
                        if (provinceId == allProvince[provinceI1].id) {
                            deep1_area = allProvince[provinceI1].name;
                        }
                        //一级没填的情况
                        /*if (deep1_area.length==0) {
                            if (provinceId == allProvince[provinceI1].id) {
                                deep1_area = allProvince[provinceI1].name;
                            }
                        } else {
                            // 一级填写，但有可能不是省份，而是不正确的
                            is_province = deep1_area.search(deep1_area_short1);
                            if(is_province!=-1){
                                deep1_area = allProvince[provinceI1].name;
                            }
                        }*/

                    }
                }
            }
            //如果没有填二级地址
            if(deep2_area.length==0){
                var deep2_area_province_id1 = '';
                var before_deep2_area = before_deep3_area;
                deep1_area = getDeep1Area(before_deep2_area,deep2_area_province_id1).deep1_area;
            }
            //
        }
    }else {
        var deep2_area_province_id2 = '';
        for(var cityI2 = 0; cityI2 < cityLen; cityI2++){
            if(deep3_area_city_id==allCity[cityI2].id) {
                deep2_area = allCity[cityI2].name;
                deep2_area_province_id2 = allCity[cityI2].provinceId;
            }
        }
        //直接找一级地址
        deep1_area = getDeep1Area(before_deep3_area,deep2_area_province_id2).deep1_area;
    }
    console.log("444",deep2_area,deep1_area);
    return {"deep2_area":deep2_area,"deep1_area":deep1_area,"detail_area":detail_area};
}

function getDeep1Area(before_deep2_area,deep2_area_provice_id2) {
    // 一级地址简称
    var deep1_area_short1 = '';
    var provinceLen = allProvince.length;
    var is_province = -1;
    var deep1_area = '';
    if(deep2_area_provice_id2.length==0){
        for(var provinceI1 = 0; provinceI1 < provinceLen; provinceI1++){
            if((allProvince[provinceI1].name.search("省")!=-1)) {
                deep1_area_short1 = allProvince[provinceI1].name.substr(0,allProvince[provinceI1].name.length-1);
            }else{
                deep1_area_short1 = allProvince[provinceI1].name.substr(0,2);
            }
            is_province = before_deep2_area.search(deep1_area_short1);
            if(is_province!=-1){
                deep1_area = allProvince[provinceI1].name;
            }
        }
    }else {
        for(var provinceI2 = 0; provinceI2 < provinceLen; provinceI2++){
            if(deep2_area_provice_id2==allProvince[provinceI2].id) {
                deep1_area = allProvince[provinceI2].name;
            }
        }
    }

    return {"deep1_area":deep1_area};
}

//去掉空格
function RemoveBlankSpace(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;

}

//符号替换
function SymbolReplace(str) {
    /*resultStr=testStr.replace(/[ ]/g,""); */

    str = str.ResetBlank();
    /*var regex = /[^\u4e00-\u9fa5\w]/g;*/
    var regex = /[ ]/g;
    str = str.replace(regex, ",");//空格换成逗号
    str = str.replace(/，/ig,',');
    return str;
}

// 验证中文名称
function isChinaName(name) {
    var pattern = /^[\u4E00-\u9FA5]{1,4}$/;
    return pattern.test(name);
}
// 验证姓名中文英文都可以
function isName(name) {
    var formatName = '';
    var regName=/[:：]/;
    if(regName.test(name)){
        var nameReplace = name.replace(new RegExp(/[:：]/g),"_");
        formatName = nameReplace.split("_")[1];
    }
    var pattern = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){1,20}$/;
    if (formatName.length!=0){
        return {"type":pattern.test(formatName),"value":formatName};
    }else {
        return {"type":pattern.test(name),"value":name};
    }


}

// 去除数组中空白数据
function notempty(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == "") {
            list.splice(i, 1);
            i--;
        }
    }
    return list;
}
// 地址选择联动
function addressPicker(nameEl,selectedIndex1) {
    var first = []; /* 省，直辖市 */
    var second = []; /* 市 */
    var third = []; /* 镇 */
    var selectedIndex = selectedIndex1; /* 默认选中的地区 */
    var checked = selectedIndex1;
    function creatList(obj, list){
        obj.forEach(function(item, index, arr){
            var temp = new Object();
            temp.text = item.name;
            temp.value = index;
            list.push(temp);
        })
    }

    creatList(city, first);

    if (city[selectedIndex[0]].hasOwnProperty('sub')) {
        creatList(city[selectedIndex[0]].sub, second);
    } else {
        second = [{text: '', value: 0}];
    }

    if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
        creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
    } else {
        third = [{text: '', value: 0}];
    }

    var picker = new Picker({
        data: [first, second, third],
        selectedIndex: selectedIndex,
        title: '省市区选择'
    });

    picker.on('picker.select', function (selectedVal, selectedIndex) {
        var text1 = first[selectedIndex[0]].text;
        var text2 = second[selectedIndex[1]].text;
        var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
        postInfo.proName = text1;
        postInfo.cityName = text2;
        postInfo.disName = text3;
        nameEl.value = text1 + ' ' + text2 + ' ' + text3;
    });

    picker.on('picker.change', function (index, selectedIndex) {
        if (index === 0){
            firstChange();
        } else if (index === 1) {
            secondChange();
        }else if(index ===2){
            thirdChange();
        }


        function firstChange() {
            second = [];
            third = [];
            checked[0] = selectedIndex;
            var firstCity = city[selectedIndex];
            if (firstCity.hasOwnProperty('sub')) {
                creatList(firstCity.sub, second);
                var secondCity = city[selectedIndex].sub[0];
                if (secondCity.hasOwnProperty('sub')) {
                    creatList(secondCity.sub, third);
                    nameEl.value = firstCity.name + ' ' + secondCity.name + ' ' +third[0].text;
                } else {
                    third = [{text: '', value: 0}];
                    checked[2] = 0;
                    nameEl.value = firstCity.name + ' ' + secondCity.name;
                }
            } else {
                second = [{text: '', value: 0}];
                third = [{text: '', value: 0}];
                checked[1] = 0;
                checked[2] = 0;
                nameEl.value = firstCity.name;
            }
            picker.refillColumn(1, second);
            picker.refillColumn(2, third);
            picker.scrollColumn(1, 0);
            picker.scrollColumn(2, 0);
        }

        function secondChange() {
            third = [];
            checked[1] = selectedIndex;
            var first_index = checked[0];
            if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
                var secondCity = city[first_index].sub[selectedIndex];
                creatList(secondCity.sub, third);
                picker.refillColumn(2, third);
                picker.scrollColumn(2, 0);
                if(third.length!=0){
                    nameEl.value = city[first_index].name + ' ' + secondCity.name + ' ' + third[0].text;
                }else {
                    nameEl.value = city[first_index].name + ' ' + secondCity.name
                }

            } else {
                third = [{text: '', value: 0}];
                checked[2] = 0;
                picker.refillColumn(2, third);
                picker.scrollColumn(2, 0)
                nameEl.value = city[first_index].name + ' ' + city[first_index].sub[selectedIndex].name;
            }
        }
        function thirdChange(){
            checked[2] = selectedIndex;
            var first_index1 = checked[0];
            var second_index1 = checked[1];
            if (city[first_index1].sub[second_index1].hasOwnProperty('sub')){
                var thirdCity = city[first_index1].sub[second_index1].sub[selectedIndex];
            }
            nameEl.value = city[first_index1].name + ' ' + city[first_index1].sub[second_index1].name + ' ' + thirdCity.name;
        }

    });
    console.log(checked,selectedIndex);
    picker.on('picker.valuechange', function (selectedVal, selectedIndex) {

    });
    return {"picker":picker,"selectedIndex":selectedIndex};
}
var nameEl = document.getElementById('sel_city');
var selectedIndex_default = defaultPickerSelect(postInfo.proName,postInfo.cityName,postInfo.disName);
addressPicker(nameEl,selectedIndex_default).picker;
nameEl.addEventListener('click', function () {
    console.log(postInfo.proName + " " + postInfo.cityName + " " + postInfo.disName);
    var selectedIndex2 = defaultPickerSelect(postInfo.proName,postInfo.cityName,postInfo.disName);
    if(nameEl.value ==""){
        nameEl.value = "北京 北京市 东城区";
    }else {
        //
        selectedIndex2 = defaultPickerSelect(postInfo.proName,postInfo.cityName,postInfo.disName);
        selectedIndex_default = defaultPickerSelect(postInfo.proName,postInfo.cityName,postInfo.disName);
        console.log(selectedIndex2);
        addressPicker(nameEl,selectedIndex2).picker;
    }
    addressPicker(nameEl,selectedIndex2).picker.show();
});
//点击智能填写时，判断是否要打开地址选择器
function isOpenPicker(proName,cityName,disName) {
    /*var nameEl = document.getElementById('sel_city');
    var selectedIndex3 = defaultPickerSelect(proName,cityName,disName);*/
    if(disName.length==0){
        $.alert("未找到对应的行政区，请手动进行选择");
    }
}
// 默认选中地址
function defaultPickerSelect(proName,cityName,disName) {
    var cityLen = city.length;
    var defaultSelectedIndex = [];
    if(proName.length!=0){
        for(var defaultI = 0; defaultI < cityLen; defaultI++){
            if(proName == city[defaultI].name){
                // 第一个
                defaultSelectedIndex.push(defaultI);
                if(cityName.length!=0){
                    for(var defaultI1 = 0; defaultI1 < city[defaultI].sub.length; defaultI1++) {
                        if(cityName == city[defaultI].sub[defaultI1].name){
                            // 第二个
                            defaultSelectedIndex.push(defaultI1);
                            if(disName.length!=0){
                                for(var defaultI2 = 0; defaultI2 < city[defaultI].sub[defaultI1].sub.length; defaultI2++){
                                    if(disName == city[defaultI].sub[defaultI1].sub[defaultI2].name){
                                        // 第三个
                                        defaultSelectedIndex.push(defaultI2);
                                    }
                                }
                            }else {
                                defaultSelectedIndex.push(-1);
                            }
                        }
                    }
                }else {
                    defaultSelectedIndex.push(-1);
                }
            }
        }
    }else {
        defaultSelectedIndex = [0,0,0];
    }
    console.log(defaultSelectedIndex);
    return defaultSelectedIndex;

}

$('#noopsyche-fill').on('click',function(){
    noopsycheFill();
});
$('.picker-mask').on('click',function(){
    picker.hide();
});
// 判断是否为手机号
function isPoneAvailable (pone) {
    var myreg = /^[1][0-9][0-9]{9}$/;
    if (!myreg.test(pone)) {
        return false;
    } else {
        return true;
    }
}
/**
*新增***判断是否为座机*/
function isPhone (pone) {
    var myreg1 = /^[0|4|9]{1,20}/;
    if (!myreg1.test(pone)) {
        return false;
    } else {
        return true;
    }
}
/*提交*/
$('.submit').on('click',function(){
    var chinaVal = $("#name").val();
    var phoneVal = $('#phone').val();
    var nameElVal = $('#sel_city').val();
    /**新增校验规则：只要是0/4/9打头的号码都不校验位数，1打头（手机号）的校验11位，其他都定义成不合规！*/
    if(!isPoneAvailable(phoneVal)&&!isPhone(phoneVal)){
        $.alert("手机号码不规范，请输入正确的号码!");
    }
    if(postInfo.proName.length==0||postInfo.cityName.length==0){
        $.alert("省市不能为空，请手动选择！");
    }
    /**姓名验证*/
    /*if(!isChinaName(chinaVal)){
     $.alert("请输入中文姓名!");
 }*/
});




/*地图 自动识别 定位*/
$('.site-icon').on('click',function(){
    $.confirm('是否自动识别地址', function () {
        getPresentLocal();
        $('.map-lacation-wrap').css('display','block')
        var siteListHeight = $(window).height() - $('.map-area').height();
        $('.site-list-wrap').css('height',siteListHeight)
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
            $(".site-list-wrap ul li").remove();
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
                console.log(Point)
            }
            $('.site-list-wrap ul').on('click',".site-list-wrap ul li",function(event){
                console.log($(this).index() )
                var i = $(this).index();
                var address = sites[i].title;
                $(".detail_textarea_wrap textarea").html(address);
                $('.map-lacation-wrap').css('display','none');
                var nameEl = document.getElementById('sel_city');
                nameEl.value = rs.addressComponents.province+' '+rs.addressComponents.city+' '+rs.addressComponents.district;
                postInfo.proName = rs.addressComponents.province;
                postInfo.cityName = rs.addressComponents.city;
                postInfo.disName = rs.addressComponents.district;
            });
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





