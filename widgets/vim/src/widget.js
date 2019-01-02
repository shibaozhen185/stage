/**
 * Created by pposel on 30/01/2017.
 */

import VimTable from './VimTable';

Stage.defineWidget({
    id: 'vim',
    name: 'VIM管理',
    description: '显示VIM列表',
    initialWidth: 5,
    initialHeight: 16,
    color: 'brown',
    fetchUrl: '[manager]/vims[params]',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vim'),
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
            console.log('vim data empty');
            return <Stage.Basic.Loading message='加载数据中...' />;
        }

        var formattedData = data;
        try{
        formattedData = Object.assign({}, data, {
            items: _.map(formattedData.items, (item)=> {

                var param = eval('(' +item.param+')');
                /**拼装调用openstack获取资源配额所需的参数**/
                var pp = {};
                pp.provider= item.type; // required
                pp.username=param.username; // required
                pp.password = param.password; // required
                if(param.tenantId!==null){
                    pp.tenantId = param.tenantId;
                }
                pp.tenant = 'admin';
                var url = param.auth_url;
                if(url.lastIndexOf('/') > 5){//判断当前ip后面是否带有版本信息
                    url = url.substring(0,url.lastIndexOf(':')+5)
                }

                pp.authUrl = url;// required
                //alert(JSON.stringify(pp));
                var return_json = toolbox.getManager().getLimits(pp);


                var totalVram = '';//总RAM
                var useVram = '';//已使用RAM
                var totalCores = '';//总cpu
                var coresUsed = '';//已使用cpu
                /**将M换算成GB**/
                if(JSON.stringify(return_json)!=='{}'){
                    totalVram = parseFloat(return_json.absolute.maxTotalRAMSize)/parseFloat(1024)
                    if(totalVram.toString().lastIndexOf('.') >= 0){
                        totalVram = totalVram.toString().substring(0,totalVram.toString().lastIndexOf('.')+3)
                    }

                    useVram = parseFloat(return_json.absolute.totalRAMUsed)/parseFloat(1024)
                    if(useVram.toString().lastIndexOf('.') >= 0){
                        useVram = useVram.toString().substring(0,useVram.toString().lastIndexOf('.')+3)
                    }
                    totalCores = return_json.absolute.maxTotalCores;
                    coresUsed = return_json.absolute.totalCoresUsed;
                }
                return Object.assign({}, item, {
                    last_login_at: item.last_login_at ? Stage.Utils.formatTimestamp(item.last_login_at) : '',
                    totalVram:' 总：'+totalVram+'GB  使用：'+useVram+'GB',
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
            <VimTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
