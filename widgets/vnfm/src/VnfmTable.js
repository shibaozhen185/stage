/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';
import MenuAction from './MenuAction';
import CreateModal from './CreateModal';

export default class VnfmTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: '',
            vnfm: {}
        }
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    _selectVnfm(name) {
        this.props.toolbox.getContext().setValue('vnfmName', name);
        this.props.toolbox.drillDown(this.props.widget, 'vnfm_page', {vnfm: name}, name);
    }

    _showModal(value, vnfm) {
      
            this.setState({vnfm, modalType: value, showModal: true});
   
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _handleError(message) {
        this.setState({error: message});
    }

    _deleteVnfm() {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.vnfm.name).then(()=>{
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

 

 

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('vnfm:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('vnfm:refresh', this._refreshData);
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
                           className="vnfmTable">

                    <DataTable.Column label= '名称' name= 'name' width= '25%'/>
                    <DataTable.Column label= 'ip' name= 'active' width= '25%' />
					<DataTable.Column label="用户名" name= 'created_by' width="20%" />
                    <DataTable.Column label="创建者" name= 'created_by' width="20%" />
                    <DataTable.Column label="" width="5%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.name} key={item.name} selected={item.isSelected} onClick={this._selectVnfm.bind(this, item.name)} >
                                        <DataTable.Data><a href={'javascript:void(0)'}>{item.name}</a></DataTable.Data>
                                        <DataTable.Data>{item.ip}</DataTable.Data>
										<DataTable.Data>{item.username}</DataTable.Data>
                                        <DataTable.Data>{item.created_by}</DataTable.Data>
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

                <Confirm content={`确定要删除VNFM ${this.state.vnfm.name}?`}
                         open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteVnfm.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

              

            </div>
        );
    }
}
