/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.defineWidget({
    id: "deploymentNum",
    name: "部署数量",
    description: '显示部署数量',
    initialWidth: 2,
    initialHeight: 8,
    color : "green",
    showHeader: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentNum'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/deployments?_include=id&_size=1',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);

        return (
            <div key='vim_dv_3' className='vim-div' onClick={()=>{toolbox.drillDown(widget, 'deployment_list', { deployment: '实例化管理' }, '实例化管理');}}>
                <div>
                    <div className={'vim-img'} key={'dv-1-1'}>
                        <img src={'/stage/widgets/deploymentNum/image/currency.png'} />
                        <span className={'vim-num-span'} key={'span-1-1'}>
                            {num}
                        </span>
                        <div className={'vim-num-p'} key={'div-2-1'}>业务</div>

                    </div>
                </div>
            </div>
        );
    }
});