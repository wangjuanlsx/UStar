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

/**/

function getPhoto(node) {
    var imgURL = "";
    try{
        var file = null;
        if(node.files && node.files[0] ){
            file = node.files[0];
        }else if(node.files && node.files.item(0)) {
            file = node.files.item(0);
        }
        //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try{
            imgURL =  file.getAsDataURL();
        }catch(e){
            imgRUL = window.URL.createObjectURL(file);
        }
    }catch(e){
        if (node.files && node.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(node.files[0]);
        }
    }
    creatImg(imgRUL);
    return imgURL;
}

function getPhoto1(node) {
    var imgURL = "";
    try{
        var file = null;
        if(node.files && node.files[0] ){
            file = node.files[0];
        }else if(node.files && node.files.item(0)) {
            file = node.files.item(0);
        }
        //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try{
            imgURL =  file.getAsDataURL();
        }catch(e){
            imgRUL = window.URL.createObjectURL(file);
        }
    }catch(e){
        if (node.files && node.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(node.files[0]);
        }
    }
    creatImg1(imgRUL);
    return imgURL;
}

function creatImg(imgRUL){
    $("#up-file-img1").attr("src",imgRUL);
}

function creatImg1(imgRUL){
    $("#up-file-img2").attr("src",imgRUL);
}
