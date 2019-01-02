/**
 * Created by pposel on 30/01/2017.
 */

import VnfmTable from './VnfmTable';

Stage.defineWidget({
    id: 'vnfm',
    name: 'VNFM管理',
    description: '显示VNFM列表',
    initialWidth: 5,
    initialHeight: 16,
    color: 'brown',
    fetchUrl: '[manager]/vims[params]',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vnfm'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    hasStyle: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            console.log('vnfm data empty');
            return <Stage.Basic.Loading message='加载数据中...' />;
        }

        var formattedData = data;
        try{
        formattedData = Object.assign({}, data, {
            items: _.map(formattedData.items, (item)=> {                
                return Object.assign({}, item, {
                    totalCpu:'总：'+totalCores+' 使用：'+coresUsed,
                });
            }),
            total: _.get(data, 'metadata.pagination.total', 0)
        });
        }catch (error) {
            console.log(error);
        }

        console.log('debug',formattedData)

        return (
            <VnfmTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
