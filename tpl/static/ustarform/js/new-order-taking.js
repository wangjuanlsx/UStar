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
                $('#footer').css("position","fixed");
                $("body").css("margin-bottom","0px");
            }
        })
    };
}
jump_top();
/**
 *货物类型下拉菜单
 * */
$("#goods-type").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择货物类型(必选)</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['货物类型1', '货物类型2', '货物类型3', '货物类型4', '货物类型5', '货物类型6', '货物类型7', '货物类型8']
        }
    ]
});
/**
 *重量下拉菜单
 * */
$("#picker-weight").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择重量</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['重量1', '重量2', '重量3', '重量4', '重量5', '重量6']
        }
    ]
});
/**
 *运输方式下拉菜单
 * */
$("#transportation-way").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择运输方式</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['快递/零担快运', '整车物流','汽车托运']
        }
    ]
});
/**
 * 弹框内容
 * */
watchTransportation();
function watchTransportation() {
    var a = $('#transportation-way').val();
    if (a == '汽车托运') {
        $('.car-transportation').removeClass('hide');
        $('.all-transportation').addClass('hide');
        $('.change-not-line').removeClass('item-inner').addClass('not-line');
    } else if (a == '整车物流') {
        $('.car-transportation').addClass('hide');
        $('.all-transportation').removeClass('hide');
        $('.change-not-line').removeClass('item-inner').addClass('not-line');
    }else{
        $('.car-transportation').addClass('hide');
        $('.all-transportation').addClass('hide');
        $('.change-not-line').removeClass('not-line').addClass('item-inner');
    }
}
/**
 * 支付方式到付提醒弹框
 * */
watchPayment();
function watchPayment() {
    if ($('#payment-way').val() == "到付") {
        $.alert("到付需要加收30%-50%不等的手续费。");
    }
    ;
}
/**
 *支付方式下拉菜单
 * */
$("#payment-way").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker" id="pay-id">确定</button>\
  <h1 class="title">请选择支付方式</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['支付宝', '微信', '到付']
        }
    ]
});
/**
 *优惠券下拉菜单
 * */
$("#discount-coupon").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择优惠券</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['优惠券1', '优惠券2']
        }
    ]
});
/**
 *车辆品牌下拉菜单
 * */
$("#car-brand").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择车辆品牌</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['奥迪', '奔驰',
                '宝马',
                '本田',
                '别克',
                '比亚迪',
                '保时捷',
                '标致',
                '长城',
                '大众',
                '丰田',
                '福特',
                '吉利',
                '捷豹',
                '凯迪拉克',
                '路虎',
                '雷克萨斯',
                '雷诺',
                '起亚',
                '奇瑞',
                '日产',
                '斯柯达',
                '三菱',
                '斯巴鲁',
                '沃尔沃',
                '现代',
                '雪佛兰',
                '雪铁龙',
                '英菲尼迪',
                '一汽',
                '众泰',
                '中华',
                '其他品牌']
        }
    ]
});
/**
 *车辆型号下拉菜单
 * */
$("#car-model").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择车辆型号</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['轿车',
                '越野车',
                '多功能车',
                '其他车型']
        }
    ]
});
/**
 *车长下拉菜单
 * */
$("#car-length").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择车长</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['2.7米',
                '3.5米',
                '4.2米',
                '5.5米',
                '6.8米',
                '7.2米',
                '9.6米',
                '13米',
                '17.5米',
                '其他'
            ]
        }
    ]
});
/**
 *车型下拉菜单
 * */
$("#car-type-num").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择车型</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['厢式车',
                '平板车',
                '高栏车',
                '低栏车',
                '高低板车',
                '冷藏车',
                '集装箱车',
                '自卸货车',
                '其他车型'
            ]
        }
    ]
});
function checkItem(UserName,UserTrueName) {
    var cbx = this.document.getElementById(UserName);
    UserTrueName += " ";
    if (cbx.checked == true) {
        var str = $("#txtFilePath").val() + UserTrueName;
        $('#txtFilePath').val(str);
    } else {
        var UTN;
        UTN = $('#txtFilePath').val();
        $('#txtFilePath').val(UTN.replace(UserTrueName, ""));
    }
}