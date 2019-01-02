/**
 * Created by pposel on 30/01/2017.
 */

import FaultTable from './FaultTable';

Stage.defineWidget({
    id: 'fault',
    name: '故障管理',
    description: '显示故障信息列表',
    initialWidth: 5,
    initialHeight: 16,
    color: 'red',
    isReact: true,
    isAdmin: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('fault'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    fetchData: function fetchData(widget, toolbox, params) {
        var entry = toolbox.getContext().getValue('entry');
        var pollingTime = widget.configuration.pollingTime;
        var d=new Date();
        var n=new Date(d.getTime()-3*5*10*60*5*60*1000);
        /*if(entry!=null && entry =='true'){//如果没取配置时间作为数据

             n=new Date(d.getTime()-pollingTime*1000);
        }else{//默认 取前五分钟的数据
             d=new Date();

        }*/
        var start = n.getFullYear()+'-'+ (n.getMonth()+1)+'-'+ n.getDate()+'T'+n.getHours()+':'+n.getMinutes()+':'+n.getSeconds();//开始时间
        var end = d.getFullYear()+'-'+ (d.getMonth()+1)+'-'+ d.getDate()+'T'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();//结束时间


        return toolbox.getManager().doGet(`/vnf_logs?_start=${start}&_end=${end}`,params).then(function(data){
            toolbox.getContext().setValue('entry','true');
            return data;
        })
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }
        let formattedData = data;
        formattedData = Object.assign({}, data, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    last_login_at: item.last_login_at?Stage.Utils.formatTimestamp(item.last_login_at):'',
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0)
        });

        return (
            <FaultTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
