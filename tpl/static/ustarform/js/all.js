/**
*车型选择下拉菜单
* */
$("#picker-car-type").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择车型</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['车型1', '车型2', '车型3', '车型4', '车型5', '车型6', '车型7', '车型8']
        }
    ]
});

/**
 *车长选择下拉菜单
 * */
$("#picker-car-length").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择车长</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['车长1', '车长2', '车长3', '车长4', '车长5', '车长6', '车长7', '车长8']
        }
    ]
});

/**
* 上传照片
* */
$(function(){
    function upLoadImg(input,img){
        $(input).on('change',function(){
            var file = this.files[0];
            // 确认选择的文件是图片
            var size = Math.round(file.size / 1024 / 1024);
            if(file.type.indexOf("image") == 0) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                //上传照片不能超过10MB
                if(size>10){
                    $.alert('照片超过10MB,请重新上传!');
                    return;
                }
                reader.onload = function(e) {
                    // 图片base64化
                    var newUrl = this.result;
                    $(img).attr("src",newUrl);
                };
            }else {
                $.alert('请上传正确的照片格式！');
            }
        });
    }
    upLoadImg("#up-file-driver1","#up-file-img1");
    upLoadImg("#up-file-driver2","#up-file-img2");
})

/**
 *揽件区域下拉菜单
 * */
$("#picker-area-type").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择区域</h1>\
  </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['龙华区', '美兰区', '琼山区', '秀英区']
        }
    ]
});
/**
* 复制文字
* */
$('#copyBtn').on('click',function(){
    $('#copyText').select();
    document.execCommand('Copy')
});

