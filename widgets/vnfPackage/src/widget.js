/**
 * Created by pposel on 30/01/2017.
 */

import VnfPackageTable from './VnfPackageTable';

Stage.defineWidget({
    id: 'vnfPackage',
    name: 'VNF包管理',
    description: 'VNF镜像/软件包管理列表',
    initialWidth: 5,
    initialHeight: 16,
    color: 'blue',
    fetchUrl: '[manager]/vnf_pkgs[params]',
    isReact: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vnfPackage'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading message='加载数据中...' />;
        }

        let selectedvnfPackage = toolbox.getContext().getValue('vnfPackage');

        let formattedData = data;
        formattedData = Object.assign({}, data, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    uploaded_at: Stage.Utils.formatTimestamp(item.uploaded_at),
                    isSelected: selectedvnfPackage === item.id
                });
            })
        });
        formattedData.total = _.get(data, 'metadata.pagination.total', 0);

        console.log('debug', formattedData)
        return (
            <VnfPackageTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
