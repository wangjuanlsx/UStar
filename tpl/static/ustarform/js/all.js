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