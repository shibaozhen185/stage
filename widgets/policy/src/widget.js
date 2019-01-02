/**
 * Created by pposel on 30/01/2017.
 */

import PolicyTable from './PolicyTable';

Stage.defineWidget({
    id: 'policy',
    name: '策略管理',
    description: '显示和管理用户',
    initialWidth: 5,
    initialHeight: 16,
    color: 'brown',
    fetchUrl: '[manager]/policy[params]',
    isReact: true,
    isAdmin: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('policy'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading message='加载数据中...' />;
        }
        data.total = _.get(data, 'metadata.pagination.total', 0);

        return (
            <PolicyTable widget={widget} data={data} toolbox={toolbox}/>
        );
    }
});
