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
})