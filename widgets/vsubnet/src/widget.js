/**
 * Created by pposel on 30/01/2017.
 */

import VsubnetTable from './VsubnetTable';

Stage.defineWidget({
    id: 'vsubnet',
    name: '子网管理',
    description: '显示VIM下子网信息',
    initialWidth: 5,
    initialHeight: 16,
    color: 'blue',
    isReact: true,
    isAdmin: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vsubnet'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],
    fetchData: function fetchData(widget, toolbox, params) {
        let vim_id = toolbox.getContext().getValue('vim');
        let vim_info = {};
        let result = {};
        let url = `/vims/${vim_id}`;
        if(vim_id === undefined){
            url = '/other';
        }
        return toolbox.getManager().doGet(url).then(function (data) {
            vim_info = data;
            return vim_info
        })
        //     .then(function (data) {
        //     if(vim_id === undefined){
        //         return vim_info;
        //     }
        //     let param = eval(`(${vim_info.param})`);
        //     let pp = {};
        //     pp.provider= vim_info.type; // required
        //     pp.username=param.username; // required
        //     pp.password = param.password; // required
        //     if(param.tenantId!==null){
        //         pp.tenantId = param.tenantId;
        //     }
        //     let url = param.auth_url;
        //     if(url.lastIndexOf('/') > 5){//判断当前ip后面是否带有版本信息
        //         url = url.substring(0,url.lastIndexOf(':')+5)
        //     }
        //     pp.authUrl = url;// required
        //     let return_json = toolbox.getManager().getSubnets(pp);
        //     //alert(JSON.stringify(return_json));
        //     result= return_json;
        //     return result;
        // });
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }
        let formattedData = data;

        formattedData = Object.assign({}, data, {
            items: _.map (data.items, (item) => {
                return Object.assign({}, item, {
                    last_login_at: item.last_login_at ? Stage.Utils.formatTimestamp(item.last_login_at) : ''
                });
            }),
            total: _.get(data, 'metadata.pagination.total', 0)
        });

        return (
            <VsubnetTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
