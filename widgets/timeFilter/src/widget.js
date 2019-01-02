﻿/**
 * Created by jakubniezgoda on 20/03/2017.
 */

Stage.defineWidget({
    id: 'timeFilter',
    name: '时间过滤器',
    description: '为部署度量图添加时间过滤器',
    initialWidth: 6,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('timeFilter'),
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    _onChange: function(proxy, field) {
        let timeFilter = field.value;
        timeFilter = _.isEmpty(timeFilter.start) || _.isEmpty(timeFilter.end) ? undefined : timeFilter;
        this.toolbox.getContext().setValue('timeFilter', timeFilter);
        this.toolbox.getEventBus().trigger('graph:refresh');
    },

    render: function(widget,data,error,toolbox) {
        let {TimeFilter} = Stage.Basic;
        let value = toolbox.getContext().getValue('timeFilter');
        this.toolbox = toolbox;

        return (
            <TimeFilter name='timeFilter' value={value || TimeFilter.EMPTY_VALUE}
                        defaultValue={TimeFilter.EMPTY_VALUE}
                        placeholder='点击设置时间范围和刷新频率'
                        onChange={this._onChange.bind(this)} />
        );
    }
});
