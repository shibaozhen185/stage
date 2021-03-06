/**
 * Created by kinneretzin on 07/09/2016.
 */

import BlueprintsList from './BlueprintsList';

Stage.defineWidget({
    id: "blueprints",
    name: "模版管理",
    description: '显示模版列表',
    initialWidth: 8,
    initialHeight: 20,
    color : "blue",
    hasStyle: true,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprints'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(3),
        {id: "clickToDrillDown", name: "点击显示明细", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: "displayStyle",name: "显示风格", items: [{name:'列表', value:'table'}, {name:'目录', value:'catalog'}],
            default: "table", type: Stage.Basic.GenericField.LIST_TYPE},
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],

    fetchData(widget,toolbox,params) {
        var result = {};
        return toolbox.getManager().doGet('/blueprints?_include=id,updated_at,created_at,description,created_by,visibility,main_file_name',params)
            .then(data=>{
                result.blueprints = data;
                var blueprintIds = data.items.map(item=>item.id);

                return toolbox.getManager().doGetFull(`/deployments?_include=id,blueprint_id`,{blueprint_id: blueprintIds});
            })
            .then(data=>{
                result.deployments = data;
                return result;
            });
    },
    fetchParams: (widget, toolbox) => 
        toolbox.getContext().getValue('onlyMyResources') ? {created_by: toolbox.getManager().getCurrentUsername()} : {},

    _processData(data,toolbox) {
        var blueprintsData = data.blueprints;
        var deploymentData = data.deployments;

      var depCount = _.countBy(deploymentData.items,'blueprint_id');
        // Count deployments
        _.each(blueprintsData.items,(blueprint)=>{
            blueprint.depCount = depCount[blueprint.id] || 0;
        });

        var selectedBlueprint = toolbox.getContext().getValue('blueprintId');
        var formattedData = Object.assign({},blueprintsData,{
            items: _.map (blueprintsData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: Stage.Utils.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.formatTimestamp(item.updated_at),
                    isSelected: selectedBlueprint === item.id
                })
            }),
            total: _.get(blueprintsData, "metadata.pagination.total", 0)
        });

        return formattedData;
    },

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = this._processData(data,toolbox);
        return (
            <div>
                <BlueprintsList widget={widget} data={formattedData} toolbox={toolbox}/>
            </div>
        );
    }
});