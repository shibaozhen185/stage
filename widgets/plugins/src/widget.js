﻿/**
 * Created by kinneretzin on 07/09/2016.
 */

import PluginsTable from './PluginsTable';

Stage.defineWidget({
    id: "plugins",
    name: "插件管理",
    description: '以列表的方式显示系统中安装的插件',
    initialWidth: 8,
    initialHeight: 20,
    color : "blue",
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('plugins'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],
    fetchUrl: '[manager]/plugins?_include=id,package_name,package_version,supported_platform,distribution,distribution_release,uploaded_at,created_by,visibility[params]',
        fetchParams: (widget, toolbox) => 
        toolbox.getContext ().getValue ('onlyMyResources') ? {created_by: toolbox.getManager().getCurrentUsername()} : {},
        
    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedPlugin = toolbox.getContext().getValue('pluginId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    uploaded_at: Stage.Utils.formatTimestamp(item.uploaded_at), //2016-07-20 09:10:53.103579
                    isSelected: selectedPlugin === item.id
                })
            })
        });
        formattedData.total =  _.get(data, "metadata.pagination.total", 0);

        return (
            <PluginsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});