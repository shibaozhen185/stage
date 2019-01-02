/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions'


export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = {...CreateModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        errors: {},
        username: '',
        password: ''
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

        if (_.isEmpty(this.state.username)) {
            errors['username']='请输入用户名';
        }

        if (_.isEmpty(this.state.password)) {
            errors['password'] = '请输入密码';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }
        let params= {};
        params.username = this.state.username;
        params.password = this.state.password;
        params.op = ':='
        params.attribute = 'Cleartext-Password'
        // Disable the form
        this.setState({loading: true});

        this.setState({errors: {}, loading: false, open: false});

        let actions = new Actions(this.props.toolbox);
        actions.doCreate(params).then(()=>{
            this.setState({open:false})
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({open:false})
            this.setState({errors: {error: err.message}, loading: false});
        });
    }
    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {Modal, Icon, Form, ApproveButton, CancelButton, Button} = Stage.Basic
        let uploadButton = <Button content='增加' icon='add' labelPosition='left' />


        return (
            <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})}
                   onClose={()=>this.setState({open:false})} >
               <Modal.Header>
                    <Icon name="add"/> 新建用户
               </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field error={this.state.errors.username}>
                            <Form.Input name='username' placeholder="用户名"
                                        value={this.state.username} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.password}>
                            <Form.Input name='password' placeholder="密码" type='password'
                                        value={this.state.password} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消" />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="创建" icon="add" color="green"/>
                </Modal.Actions>
             </Modal>
        )
    }
};
