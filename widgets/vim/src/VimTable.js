/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';
import MenuAction from './MenuAction';
import CreateModal from './CreateModal';

export default class VimTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: '',
            vim: {}
        }
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    _selectVim(name) {
        this.props.toolbox.getContext().setValue('vimName', name);
        this.props.toolbox.drillDown(this.props.widget, 'vim_page', {vim: name}, name);
    }

    _showModal(value, vim) {
        if (value === MenuAction.ACTIVATE_ACTION) {
            this._activateVim(vim);
        } else if (value === MenuAction.DEACTIVATE_ACTION) {
             this._deactivateVim(vim);
        } else {
            this.setState({vim, modalType: value, showModal: true});
        }
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _handleError(message) {
        this.setState({error: message});
    }

    _deleteVim() {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.vim.name).then(()=>{
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

    _activateVim(vim) {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doActivate(vim.name).then(()=>{
            this.setState({error: null});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });

    }

    _deactivateVim(vim) {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDeactivate(vim.name).then(()=>{
            this.setState({error: null});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('vim:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('vim:refresh', this._refreshData);
    }

    render() {
        let {ErrorMessage, DataTable,  Confirm} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className="vimTable">

                    <DataTable.Column label= 'VIM' name= 'name' width= '10%'/>
                    <DataTable.Column label= '状态' name= 'active' width= '10%' />
                    <DataTable.Column label="创建者" name= 'created_by' width="10%" />
                    <DataTable.Column label="类型" name="type" width="10%" />
                    <DataTable.Column label="CPU" name="project_name" width="10%" />
                    <DataTable.Column label="内存" name="auth_url" width="15%" />
                    <DataTable.Column label="硬盘" name="username" width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.name} key={item.name} selected={item.isSelected} onClick={this._selectVim.bind(this, item.name)} >
                                        <DataTable.Data><a href={'javascript:void(0)'}>{item.name}</a></DataTable.Data>
                                        <DataTable.Data>{item.active? '已激活':'未激活'}</DataTable.Data>
                                        <DataTable.Data>{item.created_by}</DataTable.Data>
                                        <DataTable.Data>{item.type}</DataTable.Data>
                                        <DataTable.Data>

                                            <div className={'table-list'} key={'cpu'}>
                                                <img src={'/stage/widgets/vim/image/cpu.png'} />
                                                <p><span>{item.totalCpu}</span></p>
                                            </div>

                                        </DataTable.Data>

                                        <DataTable.Data >
                                            <div className={'table-list'} key={'ram'}>
                                                <img src={'/stage/widgets/vim/image/ram.png'} />
                                                <p><span>{item.totalVram}</span></p>
                                            </div>
                                        </DataTable.Data>

                                        <DataTable.Data >
                                            <div className={'table-list'} key={'disk'}>
                                                <img src={'/stage/widgets/vim/image/disk.png'} />
                                                <p><span></span></p>
                                            </div>
                                        </DataTable.Data>

                                        <DataTable.Data className={'center aligned'}>
                                            <MenuAction item={item} onSelectAction={this._showModal.bind(this)} />
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

                <Confirm content={`确定要删除VIM ${this.state.vim.name}?`}
                         open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteVim.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

                <Confirm content='你确定要停用VIM?'
                         open={this.state.modalType === MenuAction.DEACTIVATE_ACTION && this.state.showModal}
                         onConfirm={this._deactivateVim.bind(this, this.state.vim)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}
