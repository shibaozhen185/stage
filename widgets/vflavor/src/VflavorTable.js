/**
 * Created by pposel on 30/01/2017.
 */

export default class VflavorTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {

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
                           className='VflavorTable'>

                    <DataTable.Column label="名称" name="name" width="20%" />
                    <DataTable.Column label="ram" name="ram" width="20%" />
                    <DataTable.Column label="vcpus" name="vcpus" width="20%" />
                    <DataTable.Column label="disk" name="disk" width="40%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.name} key={item.name} selected={item.isSelected} onClick={this._selectUser.bind(this, item.name)}>
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data>{item.ram}</DataTable.Data>
                                        <DataTable.Data>{item.vcpus}</DataTable.Data>
                                        <DataTable.Data>{item.disk}</DataTable.Data>
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
