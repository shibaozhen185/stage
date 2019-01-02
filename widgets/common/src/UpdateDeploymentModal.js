/**
 * Created by pposel on 18/01/2017.
 */

let PropTypes = React.PropTypes;

const DEFAULT_WORKFLOW = 'default';
const CUSTOM_WORKFLOW = 'custom';

export default class UpdateDeploymentModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = UpdateDeploymentModal.initialState;
    }

    static initialState = {
        loading: false,
        runWorkflow: DEFAULT_WORKFLOW,
        installWorkflow: true,
        uninstallWorkflow: true,
        applicationFileName: '',
        blueprintUrl: '',
        workflowId: '',
        errors: {},
        urlLoading: false,
        fileLoading: false,
        yamlFiles: []
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.refs.blueprintFile && this.refs.blueprintFile.reset();
            this.refs.inputsFile && this.refs.inputsFile.reset();
            this.setState(UpdateDeploymentModal.initialState);
        }
    }

    onApprove () {
        this._submitUpdate();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _submitUpdate() {
        let blueprintFile = this.refs.blueprintFile.file();
        let inputsFile = this.refs.inputsFile.file();

        let errors = {};
        if (_.isEmpty(this.state.blueprintUrl) && !blueprintFile) {
            errors['blueprintUrl']='请输入模版url';
        }

        if (!_.isEmpty(this.state.blueprintUrl) && blueprintFile) {
            errors['blueprintUrl']='模版URL和文件必须选择一个';
        }

        if (this.state.runWorkflow === CUSTOM_WORKFLOW && _.isEmpty(this.state.workflowId)) {
            errors['workflowId']='请提供工作流ID';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

         // Disable the form
        this.setState({loading: true});

        var actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doUpdate(this.props.deployment.id,
                         this.state.applicationFileName,
                         this.state.blueprintUrl,
                         this.state.runWorkflow === DEFAULT_WORKFLOW,
                         this.state.installWorkflow,
                         this.state.uninstallWorkflow,
                         this.state.workflowId,
                         blueprintFile, inputsFile).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _onBlueprintUrlBlur() {
        if (!this.state.blueprintUrl) {
            this.setState({yamlFiles: [], errors: {}});
            return;
        }

        this.setState({urlLoading: true});
        this.refs.blueprintFile.reset();

        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doListYamlFiles(this.state.blueprintUrl).then((yamlFiles)=>{
            this.setState({yamlFiles, errors: {}, urlLoading: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, urlLoading: false});
        });
    }

    _onBlueprintFileChange(file) {
        if (!file) {
            this.setState({yamlFiles: [], errors: {}});
            return;
        }

        this.setState({fileLoading: true, blueprintUrl: ''});

        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doListYamlFiles(null, file).then((yamlFiles)=>{
            this.setState({yamlFiles, errors: {}, fileLoading: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, fileLoading: false});
        });
    }

    render() {
        var {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        var options = _.map(this.state.yamlFiles, item => { return {text: item, value: item} });

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="updateDeploymentModal">
                <Modal.Header>
                    <Icon name="edit"/> 更新部署{this.props.deployment.id}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Group>
                            <Form.Field width="9" error={this.state.errors.blueprintUrl}>
                                <Form.Input label="URL" placeholder="输入新模版url" name="blueprintUrl"
                                            value={this.state.blueprintUrl} onChange={this._handleInputChange.bind(this)}
                                            onBlur={this._onBlueprintUrlBlur.bind(this)} loading={this.state.urlLoading}
                                            icon={this.state.urlLoading?'search':false} disabled={this.state.urlLoading}/>
                            </Form.Field>
                            <Form.Field width="1" style={{position:'relative'}}>
                                <div className="ui vertical divider">
                                    或
                                </div>
                            </Form.Field>
                            <Form.Field width="8" error={this.state.errors.blueprintUrl}>
                                <Form.File placeholder="选择新的模板文件" name="blueprintFile" ref="blueprintFile"
                                           onChange={this._onBlueprintFileChange.bind(this)} loading={this.state.fileLoading}
                                           disabled={this.state.fileLoading}/>
                            </Form.Field>
                        </Form.Group>

                        <Form.Field>
                            <Form.File placeholder="选择输入文件" name="inputsFile" ref="inputsFile"/>
                        </Form.Field>

                        <Form.Field>
                            <Form.Dropdown placeholder='模板文件名' search selection options={options} name="applicationFileName"
                                           value={this.state.applicationFileName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Divider>
                            <Form.Radio label="运行默认工作流" name="runWorkflow" checked={this.state.runWorkflow === DEFAULT_WORKFLOW}
                                        onChange={this._handleInputChange.bind(this)} value={DEFAULT_WORKFLOW}/>
                        </Form.Divider>

                        <Form.Field>
                            <Form.Checkbox label="在添加节点上安装工作流"
                                           name="installWorkflow" disabled={this.state.runWorkflow !== DEFAULT_WORKFLOW}
                                           checked={this.state.installWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox label="在已删除节点上卸载工作流"
                                           name="uninstallWorkflow" disabled={this.state.runWorkflow !== DEFAULT_WORKFLOW}
                                           checked={this.state.uninstallWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Divider>
                            <Form.Radio label="运行自定义工作流" name="runWorkflow" checked={this.state.runWorkflow === CUSTOM_WORKFLOW}
                                        onChange={this._handleInputChange.bind(this)} value={CUSTOM_WORKFLOW}/>
                        </Form.Divider>

                        <Form.Field error={this.state.errors.workflowId}>
                            <Form.Input name='workflowId' placeholder="工作流 ID" disabled={this.state.runWorkflow !== CUSTOM_WORKFLOW}
                                        value={this.state.workflowId} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消"/>
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="更新" icon="edit" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'UpdateDeploymentModal',
    common: UpdateDeploymentModal
});
