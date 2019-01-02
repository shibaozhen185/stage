/**
 * Created by pposel on 30/01/2017.
 */

import Actions from './actions';


export default class VimInfoModal extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state =  VimInfoModal.initialState
    }

    onApprove() {
        this._submitPassword();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(VimInfoModal.initialState);
        }
    }

    _submitPassword() {
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        return (
            <Modal open={this.props.open}>
                <Modal.Header>
                </Modal.Header>

                <Modal.Content>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} icon="user" color="green"/>
                </Modal.Actions>
            </Modal>


        );
    }
};
