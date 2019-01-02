/**
 * Created by jakubniezgoda on 18/05/2017.
 */

Stage.defineWidget({
    id: 'nodesStats',
    name: '功能节点统计',
    description: '显示不同状态下的节点实例数量',
    initialWidth: 4,
    initialHeight: 22,
    color : 'green',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('nodesStats'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10)
    ],
    fetchUrl: '[manager]/node-instances?_include=id,node_id,deployment_id,state,relationships,runtime_properties[params:deployment_id]',

    fetchParams: function(widget, toolbox) {
        return {
            deployment_id: toolbox.getContext().getValue('deploymentId')
        }
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let {PieGraph} = Stage.Basic.Graphs;
        let states = _.countBy(data.items, 'state');
        let formattedData = [
            {name: '起动',     color: '#21ba45', value: _.get(states, 'started', 0)},
            {name: '运行', color: '#fbbd08', value: _.get(states, 'uninitialized', 0) + _.get(states, 'created', 0)},
            {name: '警告',     color: '#f2711c', value: 0},
            {name: '错误',       color: '#db2828', value: _.get(states, 'deleted', 0) + _.get(states, 'stopped', 0)}
        ];

        return (
            <PieGraph widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});