/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: "pluginsNum",
    name: "插件数量",
    description: '显示插件数量',
    initialWidth: 2,
    initialHeight: 8,
    color : "yellow",
    showHeader: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginsNum'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/plugins?_include=id&_size=1',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);

        return (
            <div key='vim_dv_3' className='vim-div' onClick={()=>{toolbox.drillDown(widget, 'plugins_list', { pluglins: '插件管理' }, '插件管理');}}>
                <div>
                    <div className={'vim-img'} key={'dv-1-1'}>
                        <img src={'/stage/widgets/pluginsNum/image/currency.png'} />
                        <span className={'vim-num-span'} key={'span-1-1'}>
                            {num}
                        </span>
                        <div className={'vim-num-p'} key={'div-2-1'}>插件</div>

                    </div>
                </div>
            </div>
        );
    }
});