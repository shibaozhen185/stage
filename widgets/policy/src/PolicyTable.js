/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';
import MenuAction from './MenuAction';
import CreateModal from './CreateModal';

export default class PolicyTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: '',
            policy: {}
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
        this.props.toolbox.getEventBus().on('policy:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('policy:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }


    _showModal(value, policy) {

        if (value === MenuAction.ACTIVATE_ACTION) {
            this._activatePolicy(policy);
        } else if (value === MenuAction.DEACTIVATE_ACTION) {
            this._deactivatePolicy(policy);
        } else {
            this.setState({policy, modalType: value, showModal: true});
        }
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _deletePolicy(policy) {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.policy.name).then(()=>{
            this._hideModal();
            this.setState({error: null});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this._hideModal();
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _activatePolicy(policy) {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        console.log(policy.name)
        actions.doActivate(policy.name).then(()=>{
            this.setState({error: null});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });

    }

    _deactivatePolicy(policy) {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDeactivate(policy.name).then(()=>{
            this.setState({error: null});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }



    render() {
        let {ErrorMessage, DataTable, Confirm} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className='PolicyTable'>

                    <DataTable.Column label="名称" name="name" width="10%" />
                    <DataTable.Column label="类型" name="type" width="10%" />
                    <DataTable.Column label="操作" name="action" width="15%" />
                    <DataTable.Column label="创建者" name="created_by" width="10%" />
                    <DataTable.Column label="条件"  name="condition" width="10%" />
                    <DataTable.Column label="私有资源" name="private_resource" width="10%" />
                    <DataTable.Column label="状态" name="active" width="10%" />
                    <DataTable.Column label="描述" name="description" width="20%" />
                    <DataTable.Column label="" width="5%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.name} key={`${item.type}_${item.name}`} selected={item.isSelected} >
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data>{item.type}</DataTable.Data>
                                        <DataTable.Data>{item.action}</DataTable.Data>
                                        <DataTable.Data >{item.created_by}</DataTable.Data>
                                        <DataTable.Data>{item.condition}</DataTable.Data>
                                        <DataTable.Data>{item.private_resource? '是':'否'}</DataTable.Data>
                                        <DataTable.Data>{item.active? '已激活':'未激活'}</DataTable.Data>
                                        <DataTable.Data>{item.description}</DataTable.Data>
                                        <DataTable.Data className='center aligned'>
                                            <MenuAction item={item} onSelectAction={this._showModal.bind(this)}/>
                                            </DataTable.Data>
                                    </DataTable.Row>
                                </DataTable.RowExpandable>
                            );
                        })
                    }
                    <DataTable.Action>
                        <CreateModal toolbox={this.props.toolbox}/>
                    </DataTable.Action>
                </DataTable>

                <Confirm content={`确定要删除策略 ${this.state.policy.name}?`}
                         open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deletePolicy.bind(this, this.state.policy)}
                         onCancel={this._hideModal.bind(this)} />

                <Confirm content={`你确定要停用策略?${this.state.policy.name}?`}
                         open={this.state.modalType === MenuAction.DEACTIVATE_ACTION && this.state.showModal}
                         onConfirm={this._deactivatePolicy.bind(this, this.state.policy)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}
