/**
 * Created by kinneretzin on 07/03/2017.
 */

import React, {Component, PropTypes} from 'react';
import {Modal, ErrorMessage, GenericField, Form, ApproveButton, CancelButton} from './basic';

export default class ConfigureModal extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = ConfigureModal.initialState(props);
    }

    static initialState = (props) => {
        return {
            loading: false,
            canUserEdit: props.config.canUserEdit
        }
    };

    static propTypes = {
        show: PropTypes.bool.isRequired,
        onSave: PropTypes.func.isRequired
    };

    static defaultProps = {
    };

    componentWillReceiveProps(nextProps) {
        this.setState(ConfigureModal.initialState(nextProps));
    }

    onApprove () {
        this.props.onSave({canUserEdit: this.state.canUserEdit})
            .then(this.props.onHide)
            .catch((err)=>{
                    this.setState({error: err.message});
                });
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _handleInputChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    render() {
        return (
            <Modal open={this.props.show} onClose={()=>this.props.onHide()}>
                <Modal.Header>
                    配置界面属性
                </Modal.Header>
                <Modal.Content>
                    <ErrorMessage error={this.state.error}/>

                    <Form loading={this.state.loading}>
                        <GenericField label='允许用户设置页面属性?'
                                      name='canUserEdit'
                                      type={GenericField.BOOLEAN_TYPE}
                                      description='如果您希望允许用户（非管理员）在UI中编辑自己的屏幕（编辑模式），请选中此选项'
                                      value={this.state.canUserEdit}
                                      onChange={this._handleInputChange.bind(this)}/>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onDeny.bind(this)} disabled={this.state.loading} content="取消" />
                    <ApproveButton content="保存" color="green" onClick={this.onApprove.bind(this)} disabled={this.state.loading} />
                </Modal.Actions>
            </Modal>
        )
    }
}