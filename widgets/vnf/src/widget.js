
import VnfTable from './VnfTable';

Stage.defineWidget({
    id: 'vnf',
    name: 'VNF管理',
    description: 'VNF管理列表',
    initialWidth: 5,
    initialHeight: 20,
    color: 'brown',
    isReact: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vnf'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],
    fetchData: function fetchData(widget, toolbox, params) {
        let vnfm_id = toolbox.getContext().getValue('vnfmInfo');
        let result = {};
        return toolbox.getManager().doGet(`/vnf_insts?vnfm_id=${vnfm_id}`,params).then((data)=> {
            result = data;
        }).then((data)=> {
            return result;
        });
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading message='加载数据中...' />;
        }

        let formattedData = Object.assign({}, data, {
            items: _.map (data.items, (item) => {
                return Object.assign({}, item, {
                    uploaded_at: Stage.Utils.formatTimestamp(item.uploaded_at)
                });
            })
        });
        formattedData.total = _.get(data, 'metadata.pagination.total', 0);

        return (
            <VnfTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
