/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: "serversNum",
    name: "功能节点数量",
    description: '显示功能节点数量',
    initialWidth: 2,
    initialHeight: 8,
    color : "red",
    showHeader: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('serversNum'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/node-instances?state=started&_include=id&_sort=deployment_id&_size=1',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);

        return (
            <div key={'vim_dv_3'} className={'vim-div'} onClick={()=>{toolbox.drillDown(widget, 'node_list', { vim: '功能节点' }, '功能节点');}}>
                <div>
                    <div className={'vim-img'} key={'dv-1-1'}>
                        <img src={'/stage/widgets/serversNum/image/currency.png'} />
                        <span className={'vim-num-span'} key={'span-1-1'}>
                            {num}
                        </span>
                        <div className={'vim-num-p'} key={'div-2-1'}>功能节点</div>
                    </div>
                </div>
            </div>
        );
    }
});