/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import RequestServiceDemo from './RequestServiceDemo';
import ManagerServiceDemo from './ManagerServiceDemo';

Stage.defineWidget({
    id: 'wbTest',
    name: '测试组件',
    description: '用于测试REST API接口',
    initialWidth: 6,
    initialHeight: 7,
    showHeader: true,
    showBorder: true,
    isReact: true,
    categories: [Stage.GenericConfig.CATEGORY.OTHERS],
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
    initialConfiguration: [
        {id: 'service', name: 'Service', default: 'manager', type: Stage.Basic.GenericField.LIST_TYPE,
            items: [
                {name: 'Manager', value: 'manager'},
                {name: 'Request', value: 'request'}
            ]
        }
    ],

    render: function(widget,data,error,toolbox) {

        switch(widget.configuration.service) {
            case 'manager':
                return (
                    <ManagerServiceDemo widgetBackend={toolbox.getWidgetBackend()}/>
                );
                break;
            case 'request':
                return (
                    <RequestServiceDemo widgetBackend={toolbox.getWidgetBackend()}/>
                );
                break;
        };
    }
});
