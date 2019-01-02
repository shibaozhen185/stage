
import Actions from './actions';

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        pluginUrl: '',
        privateResource: false,
        errors: {}
    }

    onApprove () {
        this._submitCreate();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState(CreateModal.initialState);
        }
    }

    _submitCreate() {
        let errors = {};

        if (_.isEmpty(this.state.name)) {
            errors['name']='请输入VNF包名称';
        }

        if (_.isEmpty(this.state.img_url)) {
            errors['img_url'] = '请输入文件路径';
        }

        if (_.isEmpty(this.state.type)) {
            errors['type'] = '请选择文件类型';
        }
        if (_.isEmpty(this.state.vendor)) {
            errors['vendor'] = '请输入厂商';
        }


        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({ loading: true });
        let params = {'img_url': this.state.img_url, 'type': this.state.type, 'vendor': this.state.vendor, 'inputs':''}
        var actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.name, params).then(()=> {
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch(function (err) {
            this.setState({ errors: { error: err.message }, loading: false });
        });

    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        var uploadButton = <Button content='增加' icon='add' labelPosition='left' />;
        var typeOptions = [{ text:'vnf_pkg' , value: 'vnf_pkg' }];
        return (
            <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})}
                   onClose={()=>this.setState({open:false})} >
                <Modal.Header>
                    <Icon name="add"/> 增加镜像/软件包
                </Modal.Header>

            <Modal.Content>
            <Form loading={this.state.loading} errors={this.state.errors}
                  onErrorsDismiss={() => this.setState({errors: {}})}>

                <Form.Field error={this.state.errors.name}>
                     <Form.Input name='name' placeholder="请输入包名称"
                            value={this.state.name} onChange={this._handleInputChange.bind(this)}/>
                </Form.Field>

                <Form.Field error={this.state.errors.img_url}>
                    <Form.Input name='img_url' placeholder="输入镜像/软件包路径"
                                value={this.state.img_url} onChange={this._handleInputChange.bind(this)}/>
                </Form.Field>

                <Form.Field error={this.state.errors.vendor}>
                    <Form.Input name='vendor' placeholder="请输入厂商"
                                value={this.state.vendor} onChange={this._handleInputChange.bind(this)}/>
                </Form.Field>

                <Form.Field error={this.state.errors.type}>
                    <Form.Dropdown name='type' placeholder="VIM类型" options={typeOptions} selection={true}
                                   value={this.state.type} onChange={this._handleInputChange.bind(this)}/>
                </Form.Field>

            </Form>
        </Modal.Content>

        <Modal.Actions>
        <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消" />
            <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="注册" icon="add" color="green"/>

            </Modal.Actions>
    </Modal>







        );
    }
};
