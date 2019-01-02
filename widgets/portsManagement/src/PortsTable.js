/**
 * Created by pposel on 30/01/2017.
 */



export default class PortsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('portsManagement:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('portsManagement:refresh', this._refreshData);
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(this.props.data, nextProps.data)){
            this.setState({activateLoading: false});
        }
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    _handleError(message) {
        this.setState({error: message});
    }

    render() {
        let {ErrorMessage, DataTable, Label,} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} />

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className="portsTable">

                    <DataTable.Column label="名称" name="name" width="30%" />
                    <DataTable.Column label="活动端口" name="active_port" width="10%" />
                    <DataTable.Column label="VLAN ID" name="vlan_id " width="10%" />
                    <DataTable.Column label="虚拟交换机"  name="vswitch_name" width="15%" />
                    <DataTable.Column label="VNFM" name="vm_num" width="10%" />
                    {
                        this.props.data.items.map((item) => {

                            let pg = item.runtime_properties
                            return (
                                <DataTable.RowExpandable key={`${pg.pg_id}_${pg.pg_name}`} expanded={item.isSelected}>
                                    <DataTable.Row id={pg.pg_name} key={pg.pg_id} selected={item.isSelected}>
                                        <DataTable.Data>{pg.pg_name}</DataTable.Data>
                                        <DataTable.Data>
                                            <Label className="green" horizontal>{pg.portNum}</Label>
                                        </DataTable.Data>
                                        <DataTable.Data>{pg.vlan_id}</DataTable.Data>
                                        <DataTable.Data>{pg.vswitch.name}</DataTable.Data>
                                        <DataTable.Data>
                                            <Label className="blue" horizontal>{pg.vnfmNum}</Label>
                                        </DataTable.Data>

                                    </DataTable.Row>
                                </DataTable.RowExpandable>
                            );
                        })
                    }
                }
                </DataTable>
            </div>
        );
    }
}
