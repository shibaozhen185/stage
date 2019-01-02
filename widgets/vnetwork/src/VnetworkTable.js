/**
 * Created by pposel on 30/01/2017.
 */

export default class VnetworkTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: '',
            user: {},
            tenants: {},
            groups: {}
        }
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
        this.props.toolbox.getEventBus().on('users:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('users:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }
    _selectUser(userName) {

        let selectedUserName = this.props.toolbox.getContext().getValue('userName');
        this.props.toolbox.getContext().setValue('userName', userName === selectedUserName ? null : userName);
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
                           className='VnetworkTable'>

                    <DataTable.Column label="名称" name="name" width="40%" />
                    <DataTable.Column label="共享" name="shared" width="30%" />
                    <DataTable.Column label="状态" name="status" width="30%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.name} key={item.name} selected={item.isSelected} onClick={this._selectUser.bind(this, item.name)}>
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data>{item.shared? '是':'否'}</DataTable.Data>
                                        <DataTable.Data>{item.status === 'ACTIVE'? '激活':item.status}</DataTable.Data>
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
