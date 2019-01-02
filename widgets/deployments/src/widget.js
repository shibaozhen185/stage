/**
 * Created by kinneretzin on 07/09/2016.
 */

import DeploymentsList from './DeploymentsList';

Stage.defineWidget({
    id: "deployments",
    name: '部署管理',
    description: '显示模版部署列表',
    initialWidth: 8,
    initialHeight: 24,
    color : "purple",
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration:
        [
            Stage.GenericConfig.POLLING_TIME_CONFIG(2),
            Stage.GenericConfig.PAGE_SIZE_CONFIG(),
            {id: "clickToDrillDown", name: "点击显示明细", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
            {id: "blueprintIdFilter", name: "要过滤的模版id", placeHolder: "输入要过滤的模版id", type: Stage.Basic.GenericField.STRING_TYPE},
            {id: "displayStyle", name: "显示风格", items: [{name:'表格', value:'table'}, {name:'列表', value:'list'}],
                default: "table", type: Stage.Basic.GenericField.LIST_TYPE},
            Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
            Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
        ],
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    fetchParams: function(widget, toolbox) {
        var blueprintId = toolbox.getContext().getValue('blueprintId');

        blueprintId = _.isEmpty(widget.configuration.blueprintIdFilter) ? blueprintId : widget.configuration.blueprintIdFilter;

        let obj = {
            blueprint_id: blueprintId
        }
        if(toolbox.getContext ().getValue ('onlyMyResources')){
            obj.created_by = toolbox.getManager().getCurrentUsername();
        }
        return obj;
    },

    fetchData: function(widget,toolbox,params) {
        // var flag = toolbox.getContext().getValue('flag');
        // var url = "";
        // if(flag == 'true'){ // true 第二层拓扑图中显示部署列表使用
        //     url = '/deployments';
        // }else{
        //     url = '/deployments?type=flow';
        //
        // }

        var deploymentData = toolbox.getManager().doGet('/deployments',params);
        // var deploymentData = toolbox.getManager().doGet(url,params);

        var deploymentIds = deploymentData.then(data=>Promise.resolve([...new Set(data.items.map(item=>item.id))]));

        var nodeData = deploymentIds.then(ids=>{
                    return toolbox.getManager().doGet('/nodes?_include=id,deployment_id', {deployment_id: ids});
                });

        var nodeInstanceData = deploymentIds.then(ids=>{
                    return toolbox.getManager().doGet('/node-instances?_include=id,state,deployment_id', {deployment_id: ids});
                });

        let executionsData = deploymentIds.then(ids=>{
            return toolbox.getManager().doGet('/executions?_include=id,workflow_id,status,deployment_id',
                                {deployment_id: ids, status: ['pending', 'started', 'cancelling', 'force_cancelling']});
        });

        return Promise.all([deploymentData, nodeData, nodeInstanceData, executionsData]).then(function(data) {
                let deploymentData = data[0];
                let nodeSize = _.countBy(data[1].items, "deployment_id");
                let nodeInstanceData = _.groupBy(data[2].items, "deployment_id");
                let executionsData = _.groupBy(data[3].items, "deployment_id");

                let formattedData = Object.assign({},deploymentData,{
                    items: _.map (deploymentData.items,(item)=>{
                        return Object.assign({},item,{
                            nodeSize: nodeSize[item.id],
                            nodeStates: _.countBy(nodeInstanceData[item.id], "state"),
                            created_at: Stage.Utils.formatTimestamp(item.created_at), //2016-07-20 09:10:53.103579
                            updated_at: Stage.Utils.formatTimestamp(item.updated_at),
                            executions: executionsData[item.id],
                            workflows: _.sortBy(item.workflows,['name'])
                        })
                    })
                });
                formattedData.total =  _.get(deploymentData, "metadata.pagination.total", 0);
                formattedData.blueprintId = params.blueprint_id;

                return Promise.resolve(formattedData);
            });
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let selectedDeployment = toolbox.getContext().getValue('deploymentId');
        let formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    isSelected: selectedDeployment === item.id
                })
            })
        });

        return (
            <DeploymentsList widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
