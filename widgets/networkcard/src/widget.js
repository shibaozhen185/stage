/**
 * Created by pposel on 30/01/2017.
 */

import NetworkcardTable from './NetworkcardTable';

Stage.defineWidget({
    id: 'networkcard',
    name: '物理网卡',
    description: '显示物理网卡信息',
    initialWidth: 5,
    initialHeight: 16,
    color: 'blue',
    isReact: true,
    isAdmin: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('networkcard'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],
    fetchData(widget, toolbox) {
        let nodeInstanceData = toolbox.getManager().doGet('/node-instances')

        return Promise.all([nodeInstanceData]).then(function(data) {

            let nicsData = data[0]
            nicsData.items = [
                {'relationships': [],
                    'version': 1,
                    'node_type': 'nic',
                    'tenant_name': 'default_tenant',
                    'runtime_properties': {
                        'nic_name': 'vmnic0',
                        'nic_id': 'nic2_6wtamh',
                        'nic_driver': 'bnx2',
                        'nic_mac': 'a4:ba:db:20:9c:17',
                        'nic_auto_negotiation': 'false',
                        'nic_link_speed': '100',
                        'nic_duplex':'true',
                        'nic_stauts':'true'
                    },
                    'visibility': 'tenant',
                    'private_resource': false,
                    'state': 'uninitialized',
                    'resource_availability': 'tenant',
                    'created_by': 'admin',
                    'host_id': null,
                    'deployment_id': 'rvm',
                    'id': 'nic2_6wtamh',
                    'node_id': 'nic2'
                },{
                    'relationships': [],
                    'version': 1,
                    'node_type': 'nic',
                    'tenant_name': 'default_tenant',
                    'runtime_properties': {
                        'nic_name': 'vmnic1',
                        'nic_id': 'nic2_6wtamh',
                        'nic_driver': 'ixgbe',
                        'nic_mac': '00:16:31:ff:d7:50',
                        'nic_auto_negotiation': 'true',
                        'nic_link_speed': '1000',
                        'nic_duplex':'false',
                        'nic_stauts':'false'
                    },
                    'visibility': 'tenant',
                    'private_resource': false,
                    'state': 'uninitialized',
                    'resource_availability': 'tenant',
                    'created_by': 'admin',
                    'host_id': null,
                    'deployment_id': 'rvm',
                    'id': 'nic1_4ggark',
                    'node_id': 'nic1'
                },{
                    'relationships': [{
                        'target_name': 'nic1',
                        'type': 'cloudify.vsphere.server_connected_to_network',
                        'target_id': 'nic1_4ggark'
                    }, {
                        'target_name': 'nic2',
                        'type': 'cloudify.vsphere.server_connected_to_network',
                        'target_id': 'nic2_6wtamh'
                    }],
                    'version': 2,
                    'tenant_name': 'default_tenant',
                    'runtime_properties': {
                        '_contoller': [{
                            'ctl': 'VM Network',
                            'busKey': 4000,
                            'type': 'nic'
                        }, {
                            'ctl': 'nic2',
                            'busKey': 4001,
                            'type': 'nic'
                        }],
                        'vsphere_server_id': '322',
                        'networks': [{
                            'adapter_type': 'VirtualVmxnet3',
                            'mac': '00:0c:29:5b:bd:f0',
                            'distributed': false,
                            'name': 'VM Network'
                        }, {
                            'adapter_type': 'VirtualVmxnet3',
                            'mac': '00:16:3e:29:cf:1f',
                            'distributed': false,
                            'name': 'nic2'
                        }],
                        'vsphere_server_name': 'wl-ros-c6jnc6'
                    },
                    'visibility': 'tenant',
                    'private_resource': false,
                    'state': 'uninitialized',
                    'resource_availability': 'tenant',
                    'created_by': 'admin',
                    'host_id': 'vm_c6jnc6',
                    'deployment_id': 'rvm',
                    'id': 'vm_c6jnc6',
                    'node_id': 'vm'
                }, ]

            let nics = nicsData.items.filter((item) =>
                item.runtime_properties.nic_id
            )

            let formattedData = Object.assign({},nicsData,{
                items: _.map (nics,(nic)=>{

                    return Object.assign({},nic,{

                    })
                })
            })
            formattedData.metadata.pagination.total = nics.length

            return Promise.resolve(formattedData)
        })
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }
        let formattedData = data;

        formattedData = Object.assign({}, data, {
            items: _.map (data.items, (item) => {
                return Object.assign({}, item, {
                    last_login_at: item.last_login_at ? Stage.Utils.formatTimestamp(item.last_login_at) : ''
                });
            }),
            total: _.get(data, 'metadata.pagination.total', 0)
        });

        return (
            <NetworkcardTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
