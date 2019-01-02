import CreateModal from './CreateModal'
import MenuAction from './MenuAction'
import UpdatePasswordModal from './UpdatePasswordModal';
import EditSpeedModal from './EditSpeedModal'
import Actions from './actions'

export default class RadacctTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            user: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('vpnNum:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('vpnNum:refresh', this._refreshData);
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(this.props.data, nextProps.data)){
            this.setState({activateLoading: false});
        }
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _handleError(message) {
        this.setState({error: message});
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    _showModal(value, user) {
        this.setState({user, modalType: value, showModal: true});
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _deleteUser() {
        this.props.toolbox.loading(true);

        let user = this.state.user
        let actions = new Actions(this.props.toolbox);
        actions.doDelete(user.id).then((e)=> {
            this._hideModal();
            this.setState({ error: null });
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=> {
            this._hideModal();
            this.setState({ error: err.message });
            this.props.toolbox.loading(false);
        });
    }

    _downLineUser() {
        this.props.toolbox.loading(true);

        let user = this.state.user
        let params = {ip: user.ip, username: user.username}
        let actions = new Actions(this.props.toolbox);
        actions.doDownLine(params).then((e)=> {
            this._hideModal();
            this.setState({ error: null });
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=> {
            this._hideModal();
            this.setState({ error: err.message });
            this.props.toolbox.loading(false);
        });
    }


    render() {
        let {ErrorMessage, DataTable, Confirm, HighlightText, Label} = Stage.Basic
        return (
            <div>
                <ErrorMessage error={this.state.error} />

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className='RadacctTable'>

                    <DataTable.Column label="用户名" name="username" width="13%" />
                    <DataTable.Column label="密码" name="password" width="10%" />
                    <DataTable.Column label="状态" name="status" width="15%" />
                    <DataTable.Column label="当前在线时长" name="online_time" width="10%" />
                    <DataTable.Column label="总在线时长" name="online_time_total" width="12%" />
                    <DataTable.Column label="" width="5%" />

                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.id} expanded={item.isSelected}>
                                    <DataTable.Row id={item.username} key={`${item.username}_${item.id}`} selected={item.isSelected}>
                                        <DataTable.Data>{item.username}</DataTable.Data>
                                        <DataTable.Data>{item.value}</DataTable.Data>
                                        <DataTable.Data>{item.status === 'online'
                                                            ? <Label className="green" horizontal>在线</Label>
                                                            :<Label className="red" horizontal>离线</Label>}</DataTable.Data>
                                        <DataTable.Data>{item.realTime? item.realTime : '---'}</DataTable.Data>
                                        <DataTable.Data>{item.passedTime? item.passedTime: '---'}</DataTable.Data>
                                        <DataTable.Data className="center aligned">
                                            <MenuAction item={item} onSelectAction={this._showModal.bind(this)}/>
                                        </DataTable.Data>
                                    </DataTable.Row>
                                    <DataTable.DataExpandable>
                                        <div>11</div>
                                    </DataTable.DataExpandable>
                                </DataTable.RowExpandable>
                            );
                        })
                    }
                    <DataTable.Action>
                        <CreateModal toolbox={this.props.toolbox}/>
                    </DataTable.Action>
                </DataTable>

                <UpdatePasswordModal open={this.state.modalType === MenuAction.UPDATE_ACTION && this.state.showModal}
                                     onClose={this._hideModal.bind(this)}
                                     widget={this.props.widget}
                                     user={this.state.user}
                                     toolbox={this.props.toolbox}/>

                <EditSpeedModal open={this.state.modalType === MenuAction.LIMIT_ACTION && this.state.showModal}
                                     onClose={this._hideModal.bind(this)}
                                     widget={this.props.widget}
                                     user={this.state.user}
                                     toolbox={this.props.toolbox}/>

                <Confirm content={`确定要删除用户： ${this.state.user.username}?`}
                         open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteUser.bind(this)}
                         onCancel={this._hideModal.bind(this)}/>

                <Confirm content={`确定要强制用户： ${this.state.user.username}下线?`}
                         open={this.state.modalType === MenuAction.DOWNLINE_ACTION && this.state.showModal}
                         onConfirm={this._downLineUser.bind(this)}
                         onCancel={this._hideModal.bind(this)}/>

            </div>
        );
    }
}
