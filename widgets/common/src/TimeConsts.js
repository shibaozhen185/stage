/**
 * Created by kinneretzin on 02/03/2017.
 */

var TimeConsts = {
    MAX_TIME_RESOLUTION_VALUE: 1000,
    MIN_TIME_RESOLUTION_VALUE: 1,
    TIME_RESOLUTION_UNITS: [
        {name: 'microseconds', text: '微秒', value: 'u'},
        {name: 'milliseconds', text: '毫秒', value: 'ms'},
        {name: 'seconds', text: '秒', value: 's'},
        {name: 'minutes', text: '分钟', value: 'm'},
        {name: 'hours', text: '小时', value: 'h'},
        {name: 'days', text: '天', value: 'd'},
        {name: 'weeks', text: '周', value: 'w'}
    ]
};

Stage.defineCommon({
    name: 'TimeConsts',
    common: TimeConsts
});