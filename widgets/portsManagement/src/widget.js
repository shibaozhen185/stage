/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import PortsTable from './PortsTable';

Stage.defineWidget({
    id: 'portsManagement',
    name: '端口组管理',
    description: '端口组管理',
    initialWidth: 5,
    initialHeight: 16,
    color: 'red',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('portsManagement'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],
    fetchData(widget, toolbox) {
        let nodeInstanceData = toolbox.getManager().doGet('/node-instances')

        return Promise.all([nodeInstanceData]).then(function(data) {
            let portsData = data[0]
            portsData.items = nodeInstanceData = [
                {
                    'relationships': [],
                    'version': 2,
                    'tenant_name': 'default_tenant',
                    'runtime_properties': {
                        'pg_name': 'pg1',
                        'switch_distributed': false,
                        'created_on': ['localhost.lan'],
                        'pg_id': 'HaNetwork-portgrouptest-qqwbid',
                        'vsphere_port_id': '321'
                    },
                    'visibility': 'tenant',
                    'private_resource': false,
                    'state': 'uninitialized',
                    'resource_availability': 'tenant',
                    'created_by': 'admin',
                    'host_id': null,
                    'deployment_id': 'create_portgroup',
                    'id': 'New_PortGroup_3_qqwbia',
                    'node_id': 'New_PortGroup_3'
                },
                {
                    'relationships': [],
                    'version': 2,
                    'tenant_name': 'default_tenant',
                    'runtime_properties': {
                        'pg_name': 'pg12',
                        'switch_distributed': false,
                        'created_on': ['localhost.lan'],
                        'pg_id': 'HaNetwork-portgrouptest-qqwbia',
                        'vsphere_port_id': '321'
                    },
                    'visibility': 'tenant',
                    'private_resource': false,
                    'state': 'uninitialized',
                    'resource_availability': 'tenant',
                    'created_by': 'admin',
                    'host_id': null,
                    'deployment_id': 'create_portgroup',
                    'id': 'New_PortGroup_3_qqwbia',
                    'node_id': 'New_PortGroup_3'
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
                    'node_id': 'vs'
                }]

            let ports = portsData.items.filter((item) =>
                item.runtime_properties.vsphere_port_id
            )

            let formattedData = Object.assign({},portsData,{
                items: _.map (ports,(port)=>{

                    return Object.assign({},port,{
                        runtime_properties: Object.assign({},port.runtime_properties,{
                            portNum: '2',
                            vlan_id: '0',
                            vswitch: {'name': 'vswitch1'},
                            vnfmNum: '3'
                        }),
                    })
                })
            })
            formattedData.metadata.pagination.total = ports.length

            return Promise.resolve(formattedData)
        })
    },


    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let selectedPG = toolbox.getContext().getValue('vsphere_pg_name');

        let formattedData = data;
        formattedData = Object.assign({}, formattedData, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    isSelected: item.runtime_properties.vsphere_port_id === selectedPG
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0)
        });

        return (
            <PortsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
