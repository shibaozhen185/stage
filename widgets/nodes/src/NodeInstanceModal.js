﻿/**
 * Created by jakubniezgoda on 10/01/2017.
 */


export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
        }
    }

    render() {
        let {Modal, DataTable, HighlightText, ApproveButton} = Stage.Basic;
        let {JsonUtils} = Stage.Common;

        let instance = this.props.instance;
        let instanceTotalSize = _.size(instance.runtime_properties);

        return (
            <div>
                <Modal open={this.props.open} onClose={()=>this.props.onClose()} className='nodeInstanceModal'>
                    <Modal.Header>
                        节点实例 {instance.id}
                    </Modal.Header>

                    <Modal.Content>
                        <div>
                            <h3>关系</h3>
                            <DataTable className="nodeInstanceRelationshipsTable" totalSize={instance.relationships.length}>

                                <DataTable.Column label="目标节点" name="target" width="30%"/>
                                <DataTable.Column label="关系类型" name="relationship" width="40%"/>
                                <DataTable.Column label="源节点" name="source" width="30%"/>

                                {
                                    instance.relationships.map((r) => {
                                        return (
                                            <DataTable.Row key={r.target_name + r.type + instance.node_id}>
                                                <DataTable.Data>{r.target_name}</DataTable.Data>
                                                <DataTable.Data>{r.type}</DataTable.Data>
                                                <DataTable.Data>{instance.node_id}</DataTable.Data>
                                            </DataTable.Row>
                                        );
                                    })
                                }
                            </DataTable>

                            <h3>运行时的属性</h3>
                            <DataTable className="nodeInstanceRuntimePropertiesTable" totalSize={instanceTotalSize}>

                                <DataTable.Column label="Key" name="key" width="50%"/>
                                <DataTable.Column label="Value" name="value" width="50%"/>

                                {
                                    Object.keys(instance.runtime_properties).map(function (key) {
                                        let value = instance.runtime_properties[key];
                                        return (
                                            <DataTable.Row key={key}>
                                                <DataTable.Data>{key}</DataTable.Data>
                                                <DataTable.Data>
                                                    {
                                                        _.isObject(value)
                                                        ?
                                                            <HighlightText className='json'>
                                                                {JsonUtils.stringify(value, true)}
                                                            </HighlightText>
                                                        :
                                                            value
                                                    }
                                                </DataTable.Data>
                                            </DataTable.Row>
                                        );
                                    })
                                }

                            </DataTable>
                        </div>
                    </Modal.Content>

                    <Modal.Actions>
                        <ApproveButton onClick={this.props.onClose} content="关闭" color="green"/>
                    </Modal.Actions>
                </Modal>
            </div>

        );
    }
};
