/**
 * Created by pposel on 30/01/2017.
 */

export default class VportsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            ports: {}
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
        this.props.toolbox.getEventBus().on('vims:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('vims:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }


    render() {
        let {ErrorMessage, DataTable} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} />

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className='VportsTable'>

                    <DataTable.Column label="名称" name="name" width="20%" />
                    <DataTable.Column label="设备所有者" name="deviceOwner" width="20%" />
                    <DataTable.Column label="MAC地址" name="macAddress" width="20%" />
                    <DataTable.Column label="状态" name="status" width="40%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.name} key={item.name} selected={item.isSelected} onClick={this._selectUser.bind(this, item.name)}>
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data>{item.deviceOwner}</DataTable.Data>
                                        <DataTable.Data>{item.macAddress}</DataTable.Data>
                                        <DataTable.Data>{item.status === 'ACTIVE'? '激活': '停用'}</DataTable.Data>
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
