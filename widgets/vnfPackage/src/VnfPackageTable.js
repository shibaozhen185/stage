

import Actions from './actions';
import CreateModal from './CreateModal';

export default class VnfPackageTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            confirmDelete: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _selectvnfPackage(item) {
        var oldSelectedvnfPackage  = this.props.toolbox.getContext().getValue('vnfPackage');
        this.props.toolbox.getContext().setValue('vnfPackage', item.id === oldSelectedvnfPackage ? null : item.id);
    }

    _deleteVnfPackConfirm(item, event) {
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item: item
        });
    }

    _doActivate(item, event) {
        var this_1 = this;
        event.stopPropagation();

        var actions = new Actions(this_1.props.toolbox);
        actions.doActivate(item.name).then(()=> {
            this.setState({ error: null });
            this.props.toolbox.refresh();
        }).catch(function (err) {
            this_1.setState({ error: err.message });
        });
    }

    _doDeactivate(item, event) {
        var this_2 = this;
        event.stopPropagation();

        var actions = new Actions(this_2.props.toolbox);
        actions.doDeactivate(item.name).then(()=> {
            this_2.setState({ error: null });
            this_2.props.toolbox.refresh();
        }).catch(function (err) {
            this_2.setState({ error: err.message });
        });
    }

    _deleteVnfPack() {
        if (!this.state.item) {
            this.setState({ error: '没有选中要删除的记录' });
            return;
        }

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.item).then(()=> {
            this.setState({ confirmDelete: false, error: null });
            this.props.toolbox.refresh();
        }).catch(function (err) {
            this.setState({ confirmDelete: false, error: err.message });
        });
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('vnfPackage:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('vnfPackage:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var {ErrorMessage, DataTable, Confirm} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} />

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable= {true}
                           className='vnfPackage'>

                    <DataTable.Column label="名称" name="name" width="20%" />
                    <DataTable.Column label="类型" name="type" width="10%" />
                    <DataTable.Column label="厂商" name="vendor" width="10%" />
                    <DataTable.Column label="状态" name="active" width="10%" />
                    <DataTable.Column label="租户" name="tenant_name" width="10%" />
                    <DataTable.Column label="路径" name="img_url" width="10%" />
                    <DataTable.Column label="创建者" name="created_by" width="10%" />
                    <DataTable.Column label="操作" width="10%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                    <DataTable.Row  key={item.name} selected={item.isSelected} onClick={this._selectvnfPackage.bind(this, item)}>
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data>{item.type}</DataTable.Data>
                                        <DataTable.Data>{item.vendor}</DataTable.Data>
                                        <DataTable.Data>{item.active? '已激活':'未激活'}</DataTable.Data>
                                        <DataTable.Data>{item.tenant_name}</DataTable.Data>
                                        <DataTable.Data>{item.img_url}</DataTable.Data>
                                        <DataTable.Data>{item.created_by}</DataTable.Data>
                                        <DataTable.Data className="center aligned rowActions">
                                            {item.active
                                            ?<span className='text-span-1' title={'停用'} onClick={this._doDeactivate.bind(this, item)}> 停用</span>
                                            :<span className='text-span-1' title={'激活'} onClick={this._doActivate.bind(this, item)}> 激活</span>
                                            }
                                            <span className='text-span-del' title={'刪除'} onClick={this._deleteVnfPackConfirm.bind(this, item)}> 刪除</span>
                                        </DataTable.Data>
                                    </DataTable.Row>
                            );
                        })
                    }
                    <DataTable.Action>
                        <CreateModal toolbox={this.props.toolbox}/>
                    </DataTable.Action>
                </DataTable>


                <Confirm content={'确定要删除当前文件吗?'}
                         open={this.state.confirmDelete}
                         onConfirm={this._deleteVnfPack.bind(this)}
                         onCancel={()=>{ this.setState({ confirmDelete: false })}} />

            </div>
        );
    }
}
