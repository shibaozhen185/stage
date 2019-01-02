/**
 * Created by kinneretzin on 20/10/2016.
 */

import ExecutionsTable from './ExecutionsTable';

Stage.defineWidget({
    id: "executions",
    name: '实时运行状态列表',
    description: '显示当前系统中执行状态',
    initialWidth: 8,
    initialHeight: 24,
    color : "blue",
    fetchUrl: '[manager]/executions?[params]',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executions'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES],
    
    initialConfiguration:
        [
            Stage.GenericConfig.POLLING_TIME_CONFIG(2),
            Stage.GenericConfig.PAGE_SIZE_CONFIG(),
            {id: "fieldsToShow",name: "表中显示的字段列表", placeHolder: "选择列表中要显示的字段",
                items: ["Blueprint","Deployment","Workflow","Id","Created","Creator","IsSystem","Params","Status"],
                default: 'Blueprint,Deployment,Workflow,Id,Created,Creator,IsSystem,Params,Status', type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE},
            {id: "showSystemExecutions", name: "显示系统运行状态", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
            Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
            Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
        ],

    fetchParams: function(widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            _include_system_workflows: (
                widget.configuration.showSystemExecutions &&
                !toolbox.getContext().getValue('blueprintId') &&
                !toolbox.getContext().getValue('deploymentId')
            )
        };
    },

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = Object.assign({},data);
        var selectedExecution = toolbox.getContext().getValue('executionId');

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: Stage.Utils.formatTimestamp(item.created_at), //2016-07-20 09:10:53.103579
                    isSelected: item.id === selectedExecution
                })
            })
        });
        formattedData.total = _.get(data, "metadata.pagination.total", 0);

        let params = this.fetchParams(widget, toolbox);
        formattedData.blueprintId = params.blueprint_id;
        formattedData.deploymentId = params.deployment_id;


        return (
            <ExecutionsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
