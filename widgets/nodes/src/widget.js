﻿/**
 * Created by jakubniezgoda on 03/01/2017.
 */

import NodesTable from './NodesTable';

Stage.defineWidget({
    id: 'nodes',
    name: '功能节点列表',
    description: '显示节点列表',
    initialWidth: 6,
    initialHeight: 20,
    color : 'blue',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('nodes'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {id: "fieldsToShow",name: "列表中要显示的字段", placeHolder: "选择要在列表中显示的字段",
            items: ["Name","Type","Blueprint","Deployment","Contained in","Connected to","Host","Creator","# Instances","Groups"],
            default: 'Name,Type,Blueprint,Deployment,Contained in,Connected to,Host,Creator,# Instances,Groups', type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE}
    ],
    fetchUrl: {
        nodes: '[manager]/nodes?_include=id,deployment_id,blueprint_id,type,type_hierarchy,number_of_instances,host_id,relationships,created_by[params:blueprint_id,deployment_id,gridParams]',
        nodeInstances: '[manager]/node-instances?_include=id,node_id,deployment_id,state,relationships,runtime_properties[params:deployment_id]',
        deployments: '[manager]/deployments?_include=id,groups[params:blueprint_id,id]'
    },

    fetchParams: function(widget, toolbox) {
        return {
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            id: toolbox.getContext().getValue('deploymentId')
        }
    },

    _getGroups: function(deployments) {
        let groups = {};
        _.forEach(deployments, (deployment) => {
            _.forIn(deployment.groups, (group, groupId) => {
                _.forEach(group.members, (nodeId) => {
                    let groupList = groups[nodeId + deployment.id] = groups[nodeId + deployment.id] || [];
                    groupList.push(groupId);
                });
            });
        });
        return groups;
    },

    render: function(widget, data, error, toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        const CONNECTED_TO_RELATIONSHIP = 'cloudify.relationships.connected_to';
        const SELECTED_NODE_ID = toolbox.getContext().getValue('nodeId');
        const SELECTED_NODE_INSTANCE_ID = toolbox.getContext().getValue('nodeInstanceId');

        let params = this.fetchParams(widget, toolbox);

        let nodes = data.nodes.items;
        let instances = data.nodeInstances.items;
        let groups = this._getGroups(data.deployments.items);
        let group;

        let formattedData = Object.assign({}, data.nodes, {
            items: _.map (nodes, (node) => {
                var group;
                return Object.assign({}, node, {
                    deploymentId: node.deployment_id,
                    blueprintId: node.blueprint_id,
                    containedIn: node.host_id,
                    connectedTo: node.relationships.filter((r) => r.type === CONNECTED_TO_RELATIONSHIP)
                                                   .map((r) => r.target_id)
                                                   .join(),
                    numberOfInstances: node.number_of_instances,
                    instances: instances.filter((instance) =>
                                                instance.node_id === node.id &&
                                                instance.deployment_id === node.deployment_id)
                                        .map((instance) => ({...instance, isSelected: instance.id === SELECTED_NODE_INSTANCE_ID})),
                    isSelected: (node.id + node.deployment_id) === SELECTED_NODE_ID,
                    groups: !_.isNil(group = groups[node.id + node.deployment_id]) ? group.join(', ') : ''
                })
            }),
            total : _.get(data.nodes, 'metadata.pagination.total', 0),
            blueprintId : params.blueprint_id,
            deploymentId : params.deployment_id
        });

        return (
            <NodesTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
