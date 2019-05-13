/**
 * 上传照片
 * */
$(function(){
    // 点击事件
    $("#file").click(function(){
        var $input = $("#file");
        $input.on("change" , function(){
            console.log(this);
            //补充说明：因为我们给input标签设置multiple属性，因此一次可以上传多个文件
            //获取选择图片的个数
            var files = this.files;
            var length = files.length;
            //3、回显
                $.each(files,function(key,value){
                    /*console.log(key,value);*/
                    if(value.type.indexOf("image") == 0) {
                        //每次都只会遍历一个图片数据
                        var fr = new FileReader();
                        fr.onload = function(){
                            var strHtml;
                            $("#evaluate-photo-icon-div").find('input').val('');
                            strHtml = '<li class="evaluate-up-photo-li">\
                                        <div class="evaluate-up-photo position-r">\
                                        <span class="evaluate-up-photo-clear"><img src="./tpl/static/ustarform/images/common-photo-close.png"></span>\
                                        <img class="evaluate-photo-up-img" src= "'+this.result+'" alt="">\
                                        </div>\
                                    </li>';
                            /*img.src=this.result;
                             div.appendChild(img);*/
                            $('#evaluate-up-photo-ul-id').prepend(strHtml);
                        }
                        fr.readAsDataURL(value);
                    }else {
                        $.alert('请上传正确的照片格式！');
                    }
                })
        })

        //我们把当前input标签的id属性remove
        $input.removeAttr("id");
        //我们做个标记，再class中再添加一个类名就叫test
        var newInput = '<input class="up-loader evaluate-up-file uploadImg test" type="file" name="file" multiple id="file">';
        $(this).append($(newInput));

    })
    // 刪除图片
    $("#evaluate-up-photo-ul-id").on('click','.evaluate-up-photo-clear',function() {
        var parent = $(this);
        /*$("#file").attr('type','text');*/
        $.confirm('确定删除图片', function () {
            parent.parent().parent().remove();
            $("#evaluate-photo-icon-div").find('input').val('');
        },function () {

        })
    })
})