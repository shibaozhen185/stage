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
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
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

        if (_.isEmpty(this.state.username)) {
            errors['username']='输入用户名';
        }

        if (_.isEmpty(this.state.password)) {
            errors['password']='输入用户密码';
        }

        if (_.isEmpty(this.state.confirmPassword)) {
            errors['confirmPassword']='确认用户密码';
        }

        if (!_.isEmpty(this.state.password) && !_.isEmpty(this.state.confirmPassword) &&
            this.state.password !== this.state.confirmPassword) {
            errors['confirmPassword']='两次密码不一致';
        }

        if (_.isEmpty(this.state.role)) {
            errors['role']='设置用户角色';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.username,
            this.state.password,
            this.state.role
        ).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;
        let options = [
            { text:'acept' , value: '接受' },
            { text:'reject' , value: '拒绝' },
            { text:'vswitch' , value: '从vSwitch继承' },
        ];

        const addButton = <Button content='添加标准虚拟交换机' icon='add' labelPosition='left' />;

        return (
            <Modal trigger={addButton} open={this.state.open} onOpen={()=>this.setState({open:true})}
                   onClose={()=>this.setState({open:false})} >
                <Modal.Header>
                    <Icon name="add"/> 添加标准虚拟交换机
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field error={this.state.errors.username}>
                            <Form.Input name='username' placeholder="vSwitch名称"
                                        value={this.state.username} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.password}>
                            <Form.Input name='password' placeholder="MTU"
                                        value={this.state.password} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="上行链路1" options={options}
                                           value={this.state.role} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="链路发现模式" options={options}
                                           value={options[2].value} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="链路发现协议" options={options}
                                           value={options[2].value} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="混杂模式" options={options}
                                           value={options[2].value} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="MAC 地址更改" options={options}
                                           value={options[2].value} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="伪传输" options={options}
                                           value={options[2].value} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消"/>
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="添加" icon="add user" color="green"/>

                </Modal.Actions>
            </Modal>
        );
    }
};
