$(function(){
    $('.open-btn').on('click', function(){
        console.log("点击",$('.pack-up-btn'));
        $('.pack-up-btn').removeClass('new-order-hidden');
        $('.new-detail-is-show-content').removeClass('new-order-hidden');
        $('.open-btn').addClass('new-order-hidden');
    })
    $('.pack-up-btn').on('click', function(){
        $('.pack-up-btn').addClass('new-order-hidden');
        $('.new-detail-is-show-content').addClass('new-order-hidden');
        $('.open-btn').removeClass('new-order-hidden');
    })
});
function checkItem(UserName,inputId,UserTrueName) {
    var cbx = this.document.getElementById(UserName);
    if (cbx.checked == true) {
        this.document.getElementById(inputId).disabled=false;
    } else {
        this.document.getElementById(inputId).disabled=true;
        this.document.getElementById(inputId).value = '';
    }
}
//
function OnInputWeight(inputId){
    var z = document.getElementById("place11").value;
    var a = document.getElementById("place3").value;
    var b = document.getElementById("place4").value;
    /*console.log('a=',a,'b=',b,'z=',z);*/
    /*if(a&&b&&z){
        var counst = z+a-b;
        document.getElementById("span-id").innerText = counst;
    }*/
}