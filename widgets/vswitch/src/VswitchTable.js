/**
 * Created by pposel on 30/01/2017.
 */



export default class VswitchTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
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
        this.props.toolbox.getEventBus().on('vswitch:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('vswitch:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(this.props.data, nextProps.data)){
            this.setState({activateLoading: false});
        }
    }

    render() {
        let {ErrorMessage, DataTable, Label} = Stage.Basic;

        return (<div>
                <ErrorMessage error={this.state.error}  onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className='vswitchTable'>

                    <DataTable.Column label="名称" name="name" width="30%" />
                    <DataTable.Column label="端口组" name="pm_num" width="20%" />
                    <DataTable.Column label="上行链路" name="upNum" width="20%" />
                    <DataTable.Column label="类型" name="type" width="30%" />
                    {
                        this.props.data.items.map((item) => {

                            return (
                                <DataTable.RowExpandable key={item.runtime_properties.vsphere_vswitch_name} expanded={item.isSelected}>
                                    <DataTable.Row id={item.id} key={item.id} selected={item.isSelected} >

                                        <DataTable.Data>{item.runtime_properties.vsphere_vswitch_name}</DataTable.Data>
                                        <DataTable.Data><Label className="green" horizontal>2</Label></DataTable.Data>
                                        <DataTable.Data>{item.runtime_properties.upNum}</DataTable.Data>
                                        <DataTable.Data >{item.runtime_properties.type}</DataTable.Data>

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
