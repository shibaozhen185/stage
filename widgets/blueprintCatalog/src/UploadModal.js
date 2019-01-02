/**
 * Created by pposel on 07/02/2017.
 */

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = UploadModal.initialState;
    }

    static initialState = {
        loading: false,
        blueprintName: '',
        blueprintFileName: '',
        visibility: Stage.Common.Consts.defaultVisibility,
        errors: {}
    }

    onApprove () {
        this._submitUpload()
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let errors = {};

        if (_.isEmpty(this.state.blueprintName)) {
            errors['blueprintName']='请输入模版名称';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.props.actions.doUpload(this.state.blueprintName,
                                    this.state.blueprintFileName,
                                    this.props.files.repo,
                                    this.state.visibility
        ).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.getEventBus().trigger('blueprints:refresh');
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, CancelButton, ApproveButton, Icon, Form, VisibilityField, Popup} = Stage.Basic;

        var files = Object.assign({},{tree:[], repo:''}, this.props.files);
        files.tree = _.filter(files.tree, x => x.type === 'blob' && x.path.endsWith('.yaml'));

        var options = _.map(files.tree, item => { return {text: item.path, value: item.path} });

        return (
            <div>
                <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="uploadModal">
                    <Modal.Header>
                        <Icon name="upload" content="上传模版来自"/> Upload blueprint from {files.repo}
                        <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                      onVisibilityChange={(visibility)=>this.setState({visibility: visibility})}/>
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>
                            <Form.Group>
                                <Form.Field width="16" error={this.state.errors.blueprintName}>
                                    <Form.Input name='blueprintName' placeholder="模版名称"
                                     value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
									content='包将被上传到管理作为模板资源，在这里指定的名称'/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width="16">
                                    <Form.Dropdown placeholder='模版文件名' search selection options={options}
                                                   name="blueprintFileName"
                                                   value={this.state.blueprintFileName} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='在存档中拥有多个配置文件，您需要指定哪个是您的应用程序的主要文件'/>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消"/>
                        <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="上传" icon="upload" color="green"/>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
};
