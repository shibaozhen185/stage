/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, open: false}
    }

    static initialState = {
        open: false,
        loading: false,
        errors: {},

    }

    onApprove () {
        this._submitCreate();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    _submitCreate() {

        let errors = {};
        if (_.isEmpty(this.state.name)) {
            errors['name'] = '请输入vnfm名称';
        }
        if (_.isEmpty(this.state.ip)) {
            errors['ip'] = 'ip';
        }
        if (_.isEmpty(this.state.username)) {
            errors['username'] = '请输入用户名';
        }
		if (_.isEmpty(this.state.vendor)) {
            errors['vendor'] = '请输入厂商';
        }
        
       
        
       
        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        let params= {};
        params.type = 'ceshi';
        params.vendor = this.state.vendor;
        params.ip = this.state.ip;
        params.username = this.state.username;
        let inputs ={};
        inputs.username = this.state.username;
        inputs.ip = this.state.ip;
		inputs.vendor = this.state.vendor;
        params.inputs = JSON.stringify(inputs);
        // Disable the form
        this.setState({loading: true});
        let actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.name,params
        ).then(()=>{
            this.setState({loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState(CreateModal.initialState);
        }
    }

    render() {
        let {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;
        const addButton = <Button content='创建vnfm' icon='add' labelPosition='left' />;
        return (
            <Modal trigger={addButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                <Modal.Header>
                    <Icon name="add"/> 创建VNFM
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field error={this.state.errors.username}>
                            <Form.Input name='name' placeholder="VIM名称"
                                        value={this.state.name} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                        <Form.Field error={this.state.errors.username}>
                            <Form.Input name='username' placeholder="用户名"
                                        value={this.state.username} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                        <Form.Field error={this.state.errors.ip}>
                            <Form.Input name='ip' placeholder="ip"
                                        value={this.state.ip} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                        <Form.Field error={this.state.errors.ip}>
                            <Form.Input name='vendor' placeholder="厂商"
                                        value={this.state.vendor} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消" />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="创建" icon="add" color="green"/>

                </Modal.Actions>
            </Modal>
        );
    }
};
