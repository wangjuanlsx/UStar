// 处理安卓手机输入法遮挡输入框问题
/*if ((/Android/gi).test(navigator.userAgent)) {
    window.addEventListener('resize', function () {
        if (document.activeElement.tagName == 'INPUT' ||
            document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    });
}*/
function jump_top(){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        /*$("body").css("height","0px");
        $("body").css("height",document.body.scrollHeight);
        $('#textArea').on("focus",function(event){
            if($(event.target).attr("type")=="button")return;
            $("body").css("margin-bottom","500px");
            $(window).scrollTop($(event.target).offset().top-100);
            event.preventDefault();
        });
        $("body").on("click",function(event){
            if($(event.target).attr("type")=="button")return;
            $("body").css("height","0px");
            $("body").css("height",document.body.scrollHeight);
            $("body").css("margin-bottom","0px");
            event.preventDefault();
        });*/
        var originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
        window.addEventListener('resize', function () {
            //键盘弹起与隐藏都会引起窗口的高度发生变化
            var resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
            if(resizeHeight-0<originalHeight-0){
                //当软键盘弹起，在此处操作
                alert(1);
                if($(event.target).attr("type")=="button")return;
                $("body").css("margin-bottom","500px");
                $(window).scrollTop($(event.target).offset().top-100);
                event.preventDefault();
            }else{
                //当软键盘收起，在此处操作
                alert(2);
                if($(event.target).attr("type")=="button")return;
                $("body").css("height","0px");
                $("body").css("height",document.body.scrollHeight);
                $("body").css("margin-bottom","0px");
                event.preventDefault();
            }
        })
    };
}
jump_top();

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

        CityValidation(infoContent);

        if (postInfo.proName == "" && postInfo.cityName == "" && postInfo.disName == "") {
            if (isChinaName(infoContent)) {
                postInfo.name = infoContent;
            }
            else if (!isNaN(infoContent) && infoContent.length >= 6) {
                postInfo.phoneNum = infoContent;
            }
            else {
                var regex = /^[A-Za-z]*[a-z0-9]*$/;
                if (!regex.test(infoContent)) {
                    postInfo.detailedAddress = infoContent;
                }
            }
        }
        else if (!isNaN(infoContent) && infoContent.length >= 6) {
            postInfo.phoneNum = infoContent;
        }
        else if (isChinaName(infoContent)) {
            var proviceStr = postInfo.proName+postInfo.cityName+postInfo.disName;
            if(infoContent!==proviceStr){
                postInfo.name = infoContent;
            }
        }
        else {
            if (postInfo.detailedAddress == "") {
                var proviceStr = postInfo.proName+postInfo.cityName+postInfo.disName;
                if(infoContent!==proviceStr){
                    postInfo.detailedAddress = infoContent;
                }
            }
        }
    }
    $("#name").val(postInfo.name);
    $("#phone").val(postInfo.phoneNum);
    var cityAddress = postInfo.proName + " " + postInfo.cityName + " " + postInfo.disName;
    $("#sel_city").val(cityAddress);
    $("#detailAddress").val(postInfo.detailedAddress);
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
    var regex = /[^\u4e00-\u9fa5\w]/g;
    str = str.replace(regex, ",");
    return str;
}

// 验证中文名称
function isChinaName(name) {
    var pattern = /^[\u4E00-\u9FA5]{1,4}$/;
    return pattern.test(name);
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


var nameEl = document.getElementById('sel_city');
var first = []; /* 省，直辖市 */
var second = []; /* 市 */
var third = []; /* 镇 */
var selectedIndex = [0, 0, 0]; /* 默认选中的地区 */
var checked = [0, 0, 0];
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
    /*console.log(index,selectedIndex);*/

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

picker.on('picker.valuechange', function (selectedVal, selectedIndex) {

});

nameEl.addEventListener('click', function () {
    picker.show();
    if(nameEl.value ==""){
        nameEl.value = "北京 北京市 城东区";
    }
});
$('#noopsyche-fill').on('click',function(){
    noopsycheFill();
});
$('.picker-mask').on('click',function(){
    picker.hide();
});
// 判断是否为手机号
function isPoneAvailable (pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
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
    /**新增校验规则：只要是0/4/9打头的号码都不校验位数，1打头（手机号）的校验11位，其他都定义成不合规！*/
    if(!isPoneAvailable(phoneVal)&&!isPhone(phoneVal)){
        $.alert("手机号码不规范，请输入正确的号码!");
    }
    /**姓名验证*/
    if(!isChinaName(chinaVal)){
        $.alert("请输入中文姓名!");
    }
});
/**/
/*var wh = $(window).height();
var scrollH = $(window).height()+500;
$("#textArea").on("click",function(){
    $('.all-content').css({"height":scrollH+"px"});
    document.getElementById('all-content1').scrollTop = 300;
});
$("#textArea").on("blur",function(){
    $('.all-content').css({"height":wh+"px"});
    document.getElementById('all-content1').scrollTop = 0;
});*/
/*var contentH = $('.all-content').height();
console.log(contentH);*/

/*$('.all-content').css({"height":});*/


