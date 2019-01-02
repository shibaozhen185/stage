/**
 * Created by pawelposel on 04/11/2016.
 */
import RadacctTable from './RadacctTable';

const SECOND = 1
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const ISO_format = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
const UNIX_format = 'X'

const STATUS_ONLINE = 'online'
const STATUS_OFFLINE = 'offline'

Stage.defineWidget({
    id: 'vpnNum',
    name: '计费系统',
    description: '计费系统',
    initialWidth: 2,
    initialHeight: 8,
    color : 'yellow',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vpnNum'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(5),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('username'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    fetchData: function(widget, toolbox, params) {
        let users = toolbox.getInternal().doGet('/radius/users', params)
        let userDetails = toolbox.getInternal().doGet('/radius/userDetails')

        return Promise.all([users, userDetails]).then(function (data) {
            let users = data[0]
            let userDetails = data[1]
            let formattedData = {}
            formattedData.items = users.rows
            formattedData.metadata = {
                pagination: {
                    offset: 0,
                    size: 5,
                    total: users.count
                }
            }

            formattedData = Object.assign({}, formattedData, {
                items: _.map(formattedData.items, (user) => {
                    let userDetail = userDetails.filter((detail) => detail.username === user.username)
                    return Object.assign({}, user,{
                        details: userDetail,
                    })
                })
            })
            return Promise.resolve(formattedData)
        })

    },

    _prepareData: function(data) {
        data = Object.assign({}, data, {
            items:  _.map(data.items, (item) =>{
                if (item.details.length !== 0) {
                    let onlineRecord = item.details.filter((detail) =>
                        detail.acctstarttime !== null && detail.acctstoptime === null
                    )
                    let passedRecord = item.details.filter((detail) =>
                        detail.acctstarttime !== null && detail.acctstoptime !== null
                    )
                    let OnlineTime = checkRecord(onlineRecord)
                    let PassedTime = checkRecord(passedRecord)

                    return Object.assign({}, item, {
                        passedTime: convertUNIX(PassedTime + OnlineTime),
                        realTime: OnlineTime? convertUNIX(OnlineTime) : false,
                        status: onlineRecord.length ? 'online' : 'offline',
                        ip: onlineRecord.length ? onlineRecord[0].nasipaddress : '0.0.0.0'
                    })
                } else {
                    return Object.assign({}, item, {
                        passedTime: null,
                        realTime: null,
                        status: 'offline',
                        ip: '0.0.0.0'
                    })
                }
            })
        })

        return data
    },

    render: function(widget , data, error, toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading message='加载数据中...'/>;
        }

        let formattedData = this._prepareData(data);
        formattedData = Object.assign({}, data, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {

                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0)
        });

        console.log('debug', formattedData)
        return (
            <RadacctTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});

function convertUNIX(timestamp) {
    let [second, minute, hour, day] = [0,0,0,0]

    switch (true){
        case timestamp < MINUTE:

            return timestamp + '秒'
        case MINUTE < timestamp && timestamp < HOUR:
            second = timestamp % MINUTE
            minute = timestamp / MINUTE

            return parseInt(minute) + '分钟'

        case HOUR < timestamp && timestamp < DAY:
            second = timestamp % MINUTE
            minute = timestamp % HOUR / MINUTE
            hour = timestamp / HOUR

            return parseInt(hour) + '小时' + parseInt(minute) + '分钟'
        case timestamp > DAY:
            second = timestamp % MINUTE
            minute = timestamp % HOUR / MINUTE
            hour = timestamp % DAY / HOUR
            day = timestamp / DAY

            return parseInt(day) + '天' + parseInt(hour) + '小时' + parseInt(minute) + '分钟'
        default:

            return timestamp
    }
}

function checkRecord(records) {
    let nowTimeStamp = moment().format(ISO_format)

    if (records.length === 0) {
        return null
    }else if (records.length === 1){
        return calculator(records[0].acctstarttime, nowTimeStamp)
    }else {
        let passedTime = 0
        records.map((record) => {
            passedTime += calculator(record.acctstarttime, record.acctstoptime)
        })

        return passedTime
    }
}

function calculator(start, end) {
    start = Stage.Utils.formatTimestamp(start, UNIX_format, ISO_format)
    end = Stage.Utils.formatTimestamp(end, UNIX_format, ISO_format)

    return (end - start)
}
