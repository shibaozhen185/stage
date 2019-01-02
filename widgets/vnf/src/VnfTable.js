/**
 * Created by pposel on 30/01/2017.
 */

export default class VnfTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }


    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('vnf:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('vnf:refresh', this._refreshData);
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        let {ErrorMessage, DataTable} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} />

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className='pluginsTable'>

                    <DataTable.Column label="名称" name="name" width="20%" />
                    <DataTable.Column label="VNFM" name="vnfm_id" width="10%" />
                    <DataTable.Column label="类型" name="type" width="15%" />
                    <DataTable.Column label="厂商" name="vendor" width="15%" />
                    <DataTable.Column label="创建者" name="created_by" width="15%" />
                    <DataTable.Column label="租户" name="tenant_name" width="15%" />
                    <DataTable.Column label="私有资源" name="private_resource" width="10%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                    <DataTable.Row id={item.name} key={item.name}>
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data>{item.vnfm_id}</DataTable.Data>
                                        <DataTable.Data>{item.type}</DataTable.Data>
                                        <DataTable.Data>{item.vendor}</DataTable.Data>
                                        <DataTable.Data>{item.created_by}</DataTable.Data>
                                        <DataTable.Data>{item.tenant_name}</DataTable.Data>
                                        <DataTable.Data>{item.private_resource? "是":"否"}</DataTable.Data>
                                    </DataTable.Row>
                            );
                        })
                    }
                </DataTable>

            </div>
        );
    }
}
