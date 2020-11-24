var defaultData = [];

var mCity = {};

var mArea = {};

/**
 * 处理原始地址数据转换成专用数据
 * @param list  原始数据
 * @param init  是否初始化 如传空 已转换过不会再次转换
 * @returns {boolean}
 */
function parseArea(list, init) {
    if (!init && defaultData.length) {
        return true;
    }
    defaultData = list;
    defaultData.forEach(province => {
        if (province.city) {
        province.city.forEach(city => {
            if (city.name !== '其他') {
            if (!mCity[city.name]) {
                mCity[city.name] = [];
            }
            mCity[city.name].push({
                p: province.name,
                c: city.name,
                a: city.area || []
            });
        }
        if (city.area) {
            city.area.forEach(area => {
                if (area !== '其他') {
                if (!mArea[area]) {
                    mArea[area] = [];
                }
                mArea[area].push({
                    p: province.name,
                    c: city.name
                })
            }
        })
        }
    })
    }
});
    //console.log(mCity,mArea);
}

/**
 * 解析
 * @param address 任意地址字符串
 * @returns {{name: string, mobile: string, detail: string, zip_code: string, phone: string}}
 */
function parse(address) {
    var parse = {
        name: '',
        mobile: '',
        detail: '',
        zip_code: '',
        phone: ''
    };

    address = address.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\t/g, ' ');

    var search = ['地址','地 址', '收货地址', '收货人', '收件人', '收货', '邮编','是','邮寄', '电话','电 话', '请核对下您的','信息','哦','：', ':', '；', ';', '，', ',', '。',];
    search.forEach(str => {
        address = address.replace(new RegExp(str, 'g'), ' ')
});

    address = address.replace(/ {2,}/g, ' ');

    address = address.replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3');

    address = address.replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');

    var mobileReg = /(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g;
    var mobile = mobileReg.exec(address);
    if (mobile) {
        parse.mobile = mobile[0];
        address = address.replace(mobile[0], ' ')
    }

    var phoneReg = /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g;
    var phone = phoneReg.exec(address);
    if (phone) {
        parse.phone = phone[0];
        address = address.replace(phone[0], ' ')
    }

    var zipReg = /([0-9]{6})/g;
    var zip = zipReg.exec(address);
    if (zip) {
        parse.zip_code = zip[0];
        address = address.replace(zip[0], '')
    }

    address = address.replace(/ {2,}/, ' ');

    //console.log(address)
    var detail = detail_parse_forward(address.trim());

    if (!detail.city) {
        detail = detail_parse(address.trim());
        console.log('detail', detail);
        if (detail.area && !detail.city) {
            detail = detail_parse(address.trim(), {
                ignoreArea: true
            });
            //console.log('smart_parse->ignoreArea');
        }else{
            //console.log('smart_parse');
        }
        //这个待完善
        var list = address.replace(detail.province, '').replace(detail.city, '').replace(detail.area, '').split(' ').filter(str => str);
        //console.log("list",list);
        if (list.length > 1) {
            list.forEach(str => {
                if (!parse.name || str && str.length < parse.name.length) {
                parse.name = str.trim()
            }
        });
            if (parse.name) {
                detail.addr = detail.addr.replace(parse.name, '').trim()
            }
        }
    } else {
        if (detail.name) {
            parse.name = detail.name
        } else {
            var list1 = detail.addr.split(' ').filter(str => str);
            if (list1.length > 1) {
                parse.name = list1[list1.length - 1]
            }
            if (parse.name) {
                detail.addr = detail.addr.replace(parse.name, '').trim()
            }
        }
    }

    parse.province = detail.province;
    parse.city = detail.city;
    parse.area = detail.area;
    parse.addr = detail.addr;
    parse.result = detail.result;
    return parse;
}

/**
 * 正向解析模式
 * 从前到后按 province city addr 逐级筛选
 * 有city的值即可说明解析成功
 * 此模式对地址顺序有要求
 * @param address
 * @returns {{province: string, city: string, area: string, addr: string}}
 */
function detail_parse_forward(address) {
    var parse = {
        province: '',
        city: '',
        area: '',
        addr: '',
        name: '',
    };

    var provinceKey = ['特别行政区', '古自治区', '维吾尔自治区', '壮族自治区', '回族自治区', '自治区', '省省直辖', '省', '市'];
    var cityKey = ['布依族苗族自治州', '苗族侗族自治州', '自治州', '州', '市', '县'];

    for (var i in defaultData) {
        var province = defaultData[i];
        var index = address.indexOf(province.name);
        //let index = pArr[mixIndex].indexOf(province.name);
        if (index > -1) {
            if (index > 0) {
                //省份不是在第一位，在省份之前的字段识别为名称
                parse.name = address.substr(0, index).trim();
            }
            parse.province = province.name;
            address = address.substr(index + province.name.length);
            for (var k in provinceKey) {
                if (address.indexOf(provinceKey[k]) === 0) {
                    address = address.substr(provinceKey[k].length);
                }
            }
            for (var j in province.city) {
                var city = province.city[j];
                index = address.indexOf(city.name);
                if (index > -1 && index < 3) {
                    parse.city = city.name;
                    address = address.substr(index + parse.city.length);
                    for (var l in cityKey) {
                        if (address.indexOf(cityKey[l]) === 0) {
                            address = address.substr(cityKey[l].length);
                        }
                    }
                    if (city.area) {
                        for (var z in city.area) {
                            var area = city.area[z];
                            index = address.indexOf(area);
                            if (index > -1 && index < 3) {
                                parse.area = area;
                                address = address.substr(index + parse.area.length);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            parse.addr = address.trim();
            break;
        }
    }
    return parse;

}

/**
 * 逆向解析 从后【县，区，旗】往前解析
 * 有地区就能大概返回地址了
 * @param address
 * @param ignoreArea 是否忽视区 因为地址中含有区容易导致匹配错误 例：山东省蓬莱市黄海花园东区西门宝威学堂 曲荣声收15753572456
 * @returns {{province: string, city: string, area: string, name: string, _area: string, addr: string}}
 */
function detail_parse(address, {ignoreArea = false} = {}) {
    var parse = {
        province: '',
        city: '',
        area: '',
        name: '',
        _area: '',
        addr: '',
    };
    var areaIndex = -1,
        cityIndex = -1,
        cityIndexArr = [],
        cityArr = [],
        cityMinIndex = -1,
        cityLength = 0;

    address = address.replace('  ', ' ');
    // 新增城市的索引
    for(var i in mCity) {
        var city1 = mCity[i];
        var index = address.indexOf(city1[0].c);
        if(index>-1){
            cityIndexArr.push(index);
            cityArr.push(city1[0].c);
            //console.log("城市索引！！",index,city[0].c)
        }
    }
    console.log('城市索引！！',mCity,cityIndexArr, cityArr);
    if(cityIndexArr.length!==0){
        /*cityIndex = cityIndexArr.findIndex(function(item){
            return Math.min.apply(null,cityIndexArr) === item
        });*/
        cityIndex = Math.min.apply(null,cityIndexArr);
        if (cityIndexArr.length!==0){
            for(var z=0; z<cityIndexArr.length;z++){
                if(Math.min.apply(null,cityIndexArr) === cityIndexArr[z]) {
                    cityMinIndex = z;
                }
            }
        }
        cityLength = cityArr[cityMinIndex].length;
        //console.log("城市索引",cityIndex,cityLength)
    }

    if (!ignoreArea && address.indexOf('县') > -1 || !ignoreArea && address.indexOf('区') > -1 || !ignoreArea && address.indexOf('旗') > -1) {
        if (address.indexOf('旗') > -1) {
            areaIndex = address.indexOf('旗');
            //parse.area = address.substr(areaIndex - 1, 2);
            if(cityIndex>-1){
                parse.area = address.substr(cityLength, areaIndex);
            }else {
                parse.area = address.substr(areaIndex - 1, 3);
            }
            //console.log("城市索引旗",parse.area)
        }
        if (address.indexOf('区') > -1) {
            areaIndex = address.indexOf('区');
            if (address.lastIndexOf('市', areaIndex) > -1) {
                cityIndex = address.lastIndexOf('市', areaIndex);
                parse.area = address.substr(cityIndex + 1, areaIndex - cityIndex);
            } else {
                // 新增
                if (cityIndex>-1) {
                    parse.area = address.substr(cityLength, areaIndex-1);
                }else {
                    parse.area = address.substr(areaIndex - 2, 3);
                }
                //parse.area = address.substr(areaIndex - 2, 3);
            }
        }
        if (address.indexOf('县') > -1) {
            areaIndex = address.lastIndexOf('县');
            if (address.lastIndexOf('市', areaIndex) > -1) {
                cityIndex = address.lastIndexOf('市', areaIndex);
                parse.area = address.substr(cityIndex + 1, areaIndex - cityIndex);
            } else {
                // 新增
                if (cityIndex>-1) {
                    parse.area = address.substr(cityLength, areaIndex-1);
                }else {
                    parse.area = address.substr(areaIndex - 2, 3);
                }
                //parse.area = address.substr(areaIndex - 2, 3);
            }
        }
        parse.addr = address.substr(areaIndex + 1);
    } else {
        if (address.indexOf('市') > -1) {
            areaIndex = address.indexOf('市');
            parse.area = address.substr(areaIndex - 2, 3);
            parse.addr = address.substr(areaIndex + 1);
        } else {
            // 新增
            /*if (cityIndex>-1) {
                parse.area = address.substr(cityLength, areaIndex-1);
            }else {
                parse.area = address.substr(areaIndex - 2, 3);
            }*/
            parse.addr = address
        }
    }

    if (address.indexOf('市') > -1 || address.indexOf('盟') > -1 || address.indexOf('州') > -1) {
        if (address.indexOf('市') > -1) {
            parse._area = address.substr(address.indexOf('市') - 2, 2);
        }
        if (address.indexOf('盟') > -1 && !mCity[parse._area]) {
            parse._area = address.substr(address.indexOf('盟') - 2, 2);
        }
        if (address.indexOf('州') > -1 && !mCity[parse._area]) {
            parse._area = address.substr(address.indexOf('州') - 2, 2);
        }
    }else {
        // 新增
        if (cityIndex>-1) {
            parse._area = address.substr(cityIndex, cityLength);
        }
    }

    parse.area = parse.area.trim();

    if (parse.area && mArea[parse.area]) {
        if (mArea[parse.area].length === 1) {
            parse.province = mArea[parse.area][0].p;
            parse.city = mArea[parse.area][0].c
        } else {
            parse._area = parse._area.trim();
            var addr = address.substr(0, areaIndex);
            var d = mArea[parse.area].find(item => {
                    return item.p.indexOf(addr) > -1 || item.c === parse._area;
        });
            if (d) {
                parse.province = d.p;
                parse.city = d.c
            } else {
                parse.result = mArea[parse.area];
            }
        }
    } else {
        if (parse._area) {
            var city = mCity[parse._area];
            if (city) {
                parse.province = city[0].p;
                parse.city = city[0].c;
                // 新增
                if((address.substr(address.indexOf(parse.city) , parse.city.length + 1)).indexOf('市')>-1){
                    parse.addr = address.substr(address.indexOf(parse.city) + parse.city.length + 1);
                }else {
                    parse.addr = address.substr(address.indexOf(parse.city) + parse.city.length);
                }
                //parse.addr = address.substr(address.indexOf(parse.city) + parse.city.length + 1);
                parse.area = '';
                for (var i in city[0].a) {
                    if (parse.addr.indexOf(city[0].a[i]) === 0) {
                        parse.area = city[0].a[i];
                        parse.addr = parse.addr.replace(city[0].a[i], '');
                        break;
                    }
                }
            }
        } else {
            parse.area = '';
        }
    }
    parse.addr = parse.addr.trim();
    return parse
}