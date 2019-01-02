/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.defineWidget({
    id: "vnfmNum",
    name: "VNFM数量",
    description: '显示VNFM数量',
    initialWidth: 2,
    initialHeight: 8,
    color : "green",
    showHeader: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vnfmNum'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/vnfms',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);

        return (
            <div key="vim_dv_3" className="vim-div" onClick={()=>{toolbox.drillDown(widget, 'vnfm_list', { vnfm: 'VNFM' }, 'VNFM');}}>
                <div>
                    <div className='vim-img' key='dv-1-1'>
                        <img src={'/stage/widgets/vnfmNum/image/currency.png'}></img>
                        <span className={'vim-num-span'} key={'span-1-1'}>{num}</span>
                        <div className={'vim-num-p'} key={'div-2-1'}>VNFM</div>
                    </div>
                </div>
            </div>
        );
    }
});