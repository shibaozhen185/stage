/**
 * Created by pposel on 30/01/2017.
 */

import VhostTable from './VhostTable';

Stage.defineWidget({
    id: 'vhost',
    name: '云主机管理',
    description: '显示VIM下云主机信息',
    initialWidth: 5,
    initialHeight: 16,
    color: 'blue',
    isReact: true,
    isAdmin: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vhost'),
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
        //     pp.tenant = 'admin';
        //     let url = param.auth_url;
        //     if(url.lastIndexOf('/') > 5){//判断当前ip后面是否带有版本信息
        //         url = url.substring(0,url.lastIndexOf(':')+5)
        //     }
        //     pp.authUrl = url;// required
        //     let return_json = toolbox.getManager().doGetServers(pp);
        //     //alert(JSON.stringify(return_json));
        //     //获取镜像名称
        //     if(return_json.items.length>0){
        //         var arr = [];
        //         for(var i =0;i<return_json.items.length;i++){
        //             var up_data = {};
        //             up_data.id = return_json.items[i].id;
        //             up_data.name = return_json.items[i].name;
        //             up_data.status = return_json.items[i].status;
        //             up_data.hostId = return_json.items[i].hostId;
        //             up_data.addresses = return_json.items[i].addresses;
        //             up_data.imageId = return_json.items[i].imageId;
        //             up_data.flavorId = return_json.items[i].flavorId;
        //             up_data.progress = return_json.items[i].progress;
        //             up_data.metadata = return_json.items[i].metadata;
        //             up_data.created = return_json.items[i].created;
        //             up_data.updated = return_json.items[i].updated;
        //
        //             pp.imageId = return_json.items[i].imageId;
        //             var image_json = toolbox.getManager().getImage(pp);
        //
        //             up_data.imageName = image_json.name;
        //
        //             arr.push(up_data);
        //         }
        //         return_json.items = arr;
        //     }
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
            <VhostTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
