/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.defineWidget({
    id: "ipoeNum",
    name: "ipoe_user数量",
    description: '显示ipoe_user数量',
    initialWidth: 2,
    initialHeight: 8,
    color : "green",
    showHeader: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('ipoeNum'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/vnf_query?action=ipoe',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = data.total;

        return (
            <div key="vim_dv_3" className="vim-div">
                <div>
                    <div className='vim-img' key='dv-1-1'>
                        <img src={'/stage/widgets/ipoeNum/image/currency.png'}></img>
                        <span className={'vim-num-span'} key={'span-1-1'}>{num}</span>
                        <div className={'vim-num-p'} key={'div-2-1'}>在线IPoE用户数量 </div>
                    </div>
                </div>
            </div>
        );
    }
});