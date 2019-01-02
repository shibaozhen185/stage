/**
 * Created by pposel on 30/01/2017.
 */

export default class NetworkcardTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            nic: {}
        }
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('nics:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('nics:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }


    render() {
        let {ErrorMessage, DataTable} = Stage.Basic;
        console.log(this.props.data)
        return (
            <div>
                <ErrorMessage error={this.state.error} />

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className='NetworkcardTable'>

                    <DataTable.Column label="名称" name="name" width="20%" />
                    <DataTable.Column label="驱动程序" name="driver" width="20%" />
                    <DataTable.Column label="MAC地址" name="mac" width="20%" />
                    <DataTable.Column label="自动协商" name="auto_negotiation" width="20%" />
                    <DataTable.Column label="链路速度" name="link_speed" width="20%" />
                    {

                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.runtime_properties.nic_name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.runtime_properties.nic_name} key={item.runtime_properties.nic_name} selected={item.isSelected}>
                                        <DataTable.Data>{item.runtime_properties.nic_name}</DataTable.Data>
                                        <DataTable.Data>{item.runtime_properties.nic_driver}</DataTable.Data>
                                        <DataTable.Data>{item.runtime_properties.nic_mac}</DataTable.Data>
                                        <DataTable.Data>{item.runtime_properties.nic_auto_negotiation?'已启用':'已禁用'}</DataTable.Data>
                                        <DataTable.Data>{`${item.runtime_properties.nic_link_speed}Mbps`}</DataTable.Data>

                                        {/*<DataTable.Data className="center aligned">*/}
                                            {/*<MenuAction item={item} onSelectAction={this._showModal.bind(this)}/>*/}
                                        {/*</DataTable.Data>*/}
                                    </DataTable.Row>
                                </DataTable.RowExpandable>
                            );
                        })
                    }
                </DataTable>
            </div>
        );
    }
}
