/**
 * Created by pposel on 31/01/2017.
 */
import Actions from './actions'

export default class EditSpeedModal extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = {...EditSpeedModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        errors: {},
        speed: ''
    }

    onApprove () {
        this._submitUpdate();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState(EditSpeedModal.initialState);
        }
    }

    _submitUpdate() {
        let errors = {};

        if (_.isEmpty(this.state.speed)) {
            errors['speed'] = '请输入速率';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }
        let params = {}
        let id = this.props.user.id
        params.password = this.state.password
        // Disable the form
        this.setState({loading: true});

        this.setState({errors: {}, loading: false});

        let actions = new Actions(this.props.toolbox)

        // actions.doUpdate(id, params).then(()=>{
        //
        //     this.props.onClose()
        //     this.setState({errors: {}, loading: false});
        //     this.props.toolbox.refresh();
        // }).catch((err)=>{
        //
        //     this.props.onClose()
        //     this.setState({errors: {error: err.message}, loading: false});
        // });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onClose()}>
                <Modal.Header>
                    <Icon name="add"/> 更新速率
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.speed}>
                            <Form.Input name='速率' placeholder="速率"
                                        value={this.state.speed} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.props.onClose} disabled={this.state.loading} content="取消" />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="更新" icon="add" color="green"/>
                </Modal.Actions>
            </Modal>
        )
    }
};
