/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import VswitchTable from './VswitchTable';

Stage.defineWidget({
    id: 'vswitch',
    name: '虚拟交换机管理',
    description: '虚拟交换机管理',
    initialWidth: 5,
    initialHeight: 16,
    color: 'red',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('vswitch'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],
    fetchData(widget, toolbox) {
        let nodeInstanceData = toolbox.getManager().doGet('/node-instances',)

        return Promise.all([nodeInstanceData]).then(function(data) {

            let vswithcsData = data[0]
            vswithcsData.items = [
                {
                    'relationships': [{
                        'target_name': 'nic1',
                        'type': 'cloudify.vsphere.network_connected_to_vswitch',
                        'target_id': 'nic1_4ggark'
                    }, {
                        'target_name': 'nic2',
                        'type': 'cloudify.vsphere.network_connected_to_vswitch',
                        'target_id': 'nic2_6wtamh'
                    }],
                    'version': 2,
                    'tenant_name': 'default_tenant',
                    'runtime_properties': {
                        'status': 'creating',
                        'type': 'typeical',
                        'upNum': '1',
                        'vsphere_vswitch_name': 'vs'
                    },
                    'visibility': 'tenant',
                    'private_resource': false,
                    'state': 'uninitialized',
                    'resource_availability': 'tenant',
                    'created_by': 'admin',
                    'host_id': null,
                    'deployment_id': 'dp_vs1',
                    'id': 'vs_3d3y1a1',
                    'node_id': 'vs'
                },
                {
                    'node_type': 'vswith',
                    'relationships': [{
                        'target_name': 'nic1',
                        'type': 'cloudify.vsphere.network_connected_to_vswitch',
                        'target_id': 'nic1_4ggark'
                    }, {
                        'target_name': 'nic2',
                        'type': 'cloudify.vsphere.network_connected_to_vswitch',
                        'target_id': 'nic2_6wtamh'
                    },{
                        'target_name': 'nic2',
                        'type': 'cloudify.vsphere.network_connected_to_vswitch',
                        'target_id': 'nic2_6wtamh'
                    }],
                    'version': 2,
                    'tenant_name': 'default_tenant',
                    'runtime_properties': {
                        'status': 'creating',
                        'type': 'typeical',
                        'upNum': '1',
                        'vsphere_vswitch_name': 'vs'
                    },
                    'visibility': 'tenant',
                    'private_resource': false,
                    'state': 'uninitialized',
                    'resource_availability': 'tenant',
                    'created_by': 'admin',
                    'host_id': null,
                    'deployment_id': 'dp_vs1',
                    'id': 'vs_3d3y1a',
                    'node_id': 'vswitch'
                }]

            let vswithcs = vswithcsData.items.filter((item) =>
                item.runtime_properties.vsphere_vswitch_name
            )

            let formattedData = Object.assign({},vswithcsData,{
                items: _.map (vswithcs,(item)=>{

                    return Object.assign({},item,{

                    })
                })
            })
            formattedData.metadata.pagination.total = vswithcs.length

            return Promise.resolve(formattedData)
        })
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }


        let formattedData = data;
        formattedData = Object.assign({}, formattedData, {
            total : _.get(data, 'metadata.pagination.total', 0)
        });


        return (
            <VswitchTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
