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
            errors['name'] = '请输入VIM名';
        }
        if (_.isEmpty(this.state.type)) {
            errors['type'] = '请选择VIM类型';
        }
        if (_.isEmpty(this.state.username)) {
            errors['username'] = '请输入VIM用户名';
        }
        if (_.isEmpty(this.state.password)){
            errors['password'] = '请输入VIM用户密码';
        }
        if (_.isEmpty(this.state.auth_url)) {
            errors['auth_url'] = '请输入认证URL';
        }
        if (_.isEmpty(this.state.project_name)) {
            errors['project_name'] = '请输入项目名';
        }
        if (_.isEmpty(this.state.user_domain_id)) {
            errors['user_domain_id'] = '请选择用户域';
        }
        if (_.isEmpty(this.state.project_domain_id)) {
            errors['project_domain_id'] = '请选择项目域';
        }
        if (_.isEmpty(this.state.tenantId)) {
            errors['tenantId'] = '请输入虚拟机租户id';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        let params= {};
        params.type = this.state.type;
        let inputs ={};
        inputs.username = this.state.username;
        inputs.password = this.state.password;
        inputs.auth_url = this.state.auth_url;
        inputs.project_name = this.state.project_name;
        inputs.user_domain_id = this.state.user_domain_id;
        inputs.project_domain_id = this.state.project_domain_id;
        inputs.tenantId = this.state.tenantId;
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

        let typeOptions = [{ text:'openstack' , value: 'openstack' },{ text:'vmware' , value: 'vmware' }];
        let user_domain_options = [{ text:'default' , value: 'default' }];
        let project_domain_options = [{ text:'default' , value: 'default' }];

        const addButton = <Button content='注册VIM' icon='add' labelPosition='left' />;

        return (
            <Modal trigger={addButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                <Modal.Header>
                    <Icon name="add"/> 注册VIM
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field error={this.state.errors.username}>
                            <Form.Input name='name' placeholder="VIM名称"
                                        value={this.state.name} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.type}>
                            <Form.Dropdown selection={true} name='type' placeholder="VIM类型" options={typeOptions}
                                        value={this.state.type} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.username}>
                            <Form.Input name='username' placeholder="用户名"
                                        value={this.state.username} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.confirmPassword}>
                            <Form.Input name='password' placeholder="用户密码" type="password"
                                        value={this.state.password} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.auth_url}>
                            <Form.Input name='auth_url' placeholder="认证URL"
                                        value={this.state.auth_url} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.project_name}>
                            <Form.Input name='project_name' placeholder="项目名"
                                        value={this.state.project_name} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.user_domain_id}>
                            <Form.Dropdown selection={true} name='user_domain_id' placeholder="用户域" options={user_domain_options}
                                           value={this.state.user_domain_id} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.project_domain_id }>
                            <Form.Dropdown selection={true} name='project_domain_id' placeholder="项目域" options={project_domain_options}
                                           value={this.state.project_domain_id } onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.tenantId}>
                            <Form.Input name='tenantId' placeholder="虚拟机租户id"
                                        value={this.state.tenantId} onChange={this._handleInputChange.bind(this)}/>
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
