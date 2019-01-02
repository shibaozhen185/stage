/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        snapshotUrl: '',
        snapshotId: '',
        errors: {}
    }

    onApprove () {
        this._submitUpload();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.refs.snapshotFile.reset();
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let snapshotFile = this.refs.snapshotFile.file();

        let errors = {};

        if (_.isEmpty(this.state.snapshotUrl) && !snapshotFile) {
            errors['snapshotUrl']='请选择快照文件或者链接';
        }

        if (!_.isEmpty(this.state.snapshotUrl) && snapshotFile) {
            errors['snapshotUrl']='快照文件和链接只需要选中一个';
        }

        if (_.isEmpty(this.state.snapshotId)) {
            errors['snapshotId']='请提供快照编号';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doUpload(this.state.snapshotUrl, this.state.snapshotId, snapshotFile).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch(err=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;
        const uploadButton = <Button content='上传' icon='upload' labelPosition='left'/>;

        return (
            <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                <Modal.Header>
                    <Icon name="upload"/> Upload snapshot
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Group>
                            <Form.Field width="9" error={this.state.errors.snapshotUrl}>
                                <Form.Input label="URL" placeholder="输出快照链接" name="snapshotUrl"
                                            value={this.state.snapshotUrl} onChange={this._handleInputChange.bind(this)}
                                            onBlur={()=>this.state.snapshotUrl ? this.refs.snapshotFile.reset() : ''}/>

                            </Form.Field>
                            <Form.Field width="1" style={{position:'relative'}}>
                                <div className="ui vertical divider">
                                    Or
                                </div>
                            </Form.Field>
                            <Form.Field width="8" error={this.state.errors.snapshotUrl}>
                                <Form.File placeholder="选择快照文件" name="snapshotFile" ref="snapshotFile"
                                           onChange={(file)=>file ? this.setState({snapshotUrl: ''}) : ''}/>

                            </Form.Field>
                        </Form.Group>

                        <Form.Field error={this.state.errors.snapshotId}>
                            <Form.Input name='snapshotId' placeholder="快照编号"
                                        value={this.state.snapshotId} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消" />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="上传" icon="upload" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
