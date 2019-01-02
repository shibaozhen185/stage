/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';

export default class FaultTable extends React.Component {
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
        this.props.toolbox.getEventBus().on('fault:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('fault:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }


    _hideModal() {
        this.setState({showModal: false});
    }

    _handleError(message) {
        this.setState({error: message});
    }

    _isCurrentUser(user) {
        return this.props.toolbox.getManager().getCurrentUsername() === user.username;
    }




    render() {
        let {ErrorMessage, DataTable, Input} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className='faultTable'>

                    <DataTable.Column width="5%" />
                    <DataTable.Column label="vnf名称" name="name" width="10%" />
                    <DataTable.Column label="vnf管理ip" name='ip' width="10%" />
                    <DataTable.Column label="告警类型" name="level" width="10%" />
                    <DataTable.Column label="时间" name='timestamp' width="20%" />
                    <DataTable.Column label="描述" name='description' width="50%" />
                    {
                        this.props.data.items.map((item) => {

                            return (
                                    <DataTable.RowExpandable key={item.id} expanded={item.isSelected}>
                                        <DataTable.Row key={`${item.id}_${item.name}`} >
                                            <DataTable.Data>
                                                <div className={'warn-cla'}>
                                                    <img src={'/stage/widgets/fault/images/warning.png'}/>
                                                </div>
                                            </DataTable.Data>
                                            <DataTable.Data>{item.name}</DataTable.Data>
                                            <DataTable.Data>{item.ip}</DataTable.Data>
                                            <DataTable.Data className="level-cla">
                                                {item.level === 'WARNING'? '警告':item.level}
                                            </DataTable.Data>
                                            <DataTable.Data>{item.timestamp}</DataTable.Data>
                                            <DataTable.Data>{item.description}</DataTable.Data>
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
