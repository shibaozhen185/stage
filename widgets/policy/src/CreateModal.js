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
        loading: false,
        name: '',
        type: '',
        action: '',
        condition: '',
        description:'',
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
            errors['name']='请输入策略名';
        }

        if (_.isEmpty(this.state.type)) {
            errors['type']='请输入策略类型';
        }
        if (_.isEmpty(this.state.action)) {
            errors['action']='请输入策略操作';
        }

        if (_.isEmpty(this.state.condition)) {
            errors['condition']='请输入策略执行条件';
        }

        if (_.isEmpty(this.state.description))  {
            errors['description']='请输入策略描述信息';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }
        let params= {};
        params.name = this.state.name;
        params.type = this.state.type;
        params.action = this.state.action;
        params.condition = this.state.condition;
        params.description = this.state.description;

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);

        actions.doCreate(this.state.name,params
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

        const addButton = <Button content='创建策略' icon='add' labelPosition='left' />;

        return (
            <Modal trigger={addButton} open={this.state.open} onOpen={()=>this.setState({open:true})}
                   onClose={()=>this.setState({open:false})} >
                <Modal.Header>
                    <Icon name="add"/> " 创建策略"
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field error={this.state.errors.name}>
                            <Form.Input name='name' placeholder="策略名称"
                                        value={this.state.name} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.type}>
                            <Form.Input name='type' placeholder="类型"
                                        value={this.state.type} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.action}>
                            <Form.Input name='action' placeholder="操作"
                                        value={this.state.action} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.condition}>
                            <Form.Input name='condition' placeholder="执行条件"
                                        value={this.state.condition} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.description}>
                            <Form.Input name='description' placeholder="描述"
                                        value={this.state.description} onChange={this._handleInputChange.bind(this)}/>
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
