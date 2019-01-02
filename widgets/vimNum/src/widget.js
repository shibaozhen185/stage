/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: "vimNum",
    name: "VIM数量",
    description: '显示VIM数量',
    initialWidth: 2,
    initialHeight: 8,
    color : "red",
    showHeader: false,
    isReact: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vimNum'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/vims',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);

        return (
            <div key="vim_dv_3" className="vim-div" onClick={()=>{toolbox.drillDown(widget, 'vim_list', { vim: 'VIM管理' }, 'VIM管理');}}>
                <div>
                    <div className='vim-img' key='dv-1'>
                        <img src={'/stage/widgets/vimNum/image/currency.png'}></img>
                        <span className={'vim-num-span'} key={'span-1-1'}>{num}</span>
                        <div className={'vim-num-p'} key={'div-2'}>{"VIM"} </div>
                    </div>
                </div>
            </div>
        );
    }
});