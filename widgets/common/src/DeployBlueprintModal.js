/**
 * Created by kinneretzin on 05/10/2016.
 */

let PropTypes = React.PropTypes;

export default class DeployBlueprintModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = DeployBlueprintModal.initialState;
    }

    static DEPLOYMENT_INPUT_CLASSNAME = 'deploymentInput';

    static initialState = {
        loading: false,
        errors: {},
        deploymentName: '',
        yamlFile: null,
        fileLoading: false,
        deploymentInputs: [],
        visibility: Stage.Common.Consts.defaultVisibility,
        skipPluginsValidation: false
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        blueprint: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            let deploymentInputs = this._getDeploymentInputs(nextProps.blueprint.plan.inputs);
            this.setState({...DeployBlueprintModal.initialState, deploymentInputs});
        }
    }

    onApprove () {
        this._submitDeploy();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _getDeploymentInputs(blueprintPlanInputs) {
        let deploymentInputs = {};

        _.forEach(blueprintPlanInputs,
            (inputObj, inputName) => deploymentInputs[inputName] = '');

        return deploymentInputs;
    }

    _submitDeploy() {
        let errors = {};
        const EMPTY_STRING = '""';

        if (!this.props.blueprint) {
            errors['error'] = '未选择模版';
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors['deploymentName']='请提供部署的名字';
        }

        let deploymentInputs = {};
        _.forEach(this.props.blueprint.plan.inputs, (inputObj, inputName) => {
            let inputValue = this.state.deploymentInputs[inputName];
            if (_.isEmpty(inputValue)) {
                if (_.isNil(inputObj.default)) {
                    errors[inputName] = `请提供 ${inputName}`;
                }
            } else if (inputValue === EMPTY_STRING) {
                deploymentInputs[inputName] = '';
            } else {
                deploymentInputs[inputName] = inputValue;
            }
        });

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doDeploy(this.props.blueprint, this.state.deploymentName, deploymentInputs, this.state.visibility, this.state.skipPluginsValidation)
            .then((/*deployment*/)=> {
                this.setState({loading: false, errors: {}});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch((err)=>{
                this.setState({loading: false, errors: {error: err.message}});
            });
    }

    _handleYamlFileChange(file) {
        let blueprintPlanInputs = this.props.blueprint.plan.inputs;

        if (!file) {
            let deploymentInputs = this._getDeploymentInputs(blueprintPlanInputs);
            this.setState({errors: {}, deploymentInputs});
            return;
        }

        this.setState({fileLoading: true});
        let actions = new Stage.Common.FileActions(this.props.toolbox);
        actions.doGetYamlFileContent(file).then((inputs) => {
            let notFoundInputs = [];
            let deploymentInputs = {};

            _.forEach(blueprintPlanInputs, (inputObj, inputName) => {
                let inputValue = inputs[inputName];
                if (_.isEmpty(inputValue)) {
                    if (_.isNil(inputObj.default)) {
                        notFoundInputs.push(inputName);
                    }
                } else {
                    deploymentInputs[inputName] = inputValue;
                }
            });

            if (_.isEmpty(notFoundInputs)) {
                this.setState({errors: {}, deploymentInputs, fileLoading: false});
            } else {
                this.setState({errors: {yamlFile: `在配置文件中没有提供强制输入 (${notFoundInputs}) `}, fileLoading: false});
            }
        }).catch((err)=>{
            this.setState({errors: {yamlFile: err.message}, fileLoading: false});
        });
    }

    _handleInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        if (field.className === DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME) {
            this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
        } else {
            this.setState(fieldNameValue);
        }
    }

    _stringify(object) {
        if (_.isObject(object) || _.isArray(object) || _.isBoolean(object)) {
            return JSON.stringify(object);
        } else {
            return String(object || '');
        }
    }

    render() {
        var {Modal, Icon, Form, Message, Popup, Header, ApproveButton, CancelButton, VisibilityField} = Stage.Basic;

        let blueprint = Object.assign({},{id: '', plan: {inputs: {}}}, this.props.blueprint);
        let deploymentInputs = _.sortBy(_.map(blueprint.plan.inputs, (input, name) => ({'name': name, ...input})),
                                        [(input => !_.isNil(input.default)), 'name']);
        let yamlFileField = () =>
            <Form.Field error={this.state.errors.yamlFile}>
                <Form.File name="yamlFile" placeholder="配置文件" ref="yamlFile"
                           onChange={this._handleYamlFileChange.bind(this)} loading={this.state.fileLoading}
                           disabled={this.state.fileLoading} />
            </Form.Field>;

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="rocket"/> 部署模版{blueprint.id}
                    <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                  onVisibilityChange={(visibility)=>this.setState({visibility: visibility})} disallowGlobal={true}/>
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.deploymentName}>
                            <Form.Input name='deploymentName' placeholder="部署名称"
                                        value={this.state.deploymentName}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        {
                            blueprint.id
                            &&
                            <Form.Divider>
                                <Header size="tiny">
                                    部署输入
                                    <Header.Subheader>
                                        使用 "" 代替
                                    </Header.Subheader>
                                </Header>
                            </Form.Divider>
                        }

                        {
                            blueprint.id &&
                            (
                                _.isEmpty(deploymentInputs)
                                ?
                                    <Message content="无法为模版提供任何输入"/>
                                :
                                    <Popup trigger={yamlFileField()} position='top right' wide >
                                        <Popup.Content>
                                            <Icon name="info circle"/>Provide YAML file with all deployments inputs to automatically fill in the form.
                                        </Popup.Content>
                                    </Popup>
                            )
                        }

                        {
                            _.map(deploymentInputs, (input) => {
                                let formInput = () =>
                                    <Form.Input name={input.name} placeholder={this._stringify(input.default)}
                                                value={this.state.deploymentInputs[input.name]}
                                                onChange={this._handleInputChange.bind(this)}
                                                className={DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME} />
                                return (
                                    <Form.Field key={input.name} error={this.state.errors[input.name]}>
                                        <label>
                                            {input.name}&nbsp;
                                            {
                                                _.isNil(input.default)
                                                ? <Icon name='asterisk' color='red' size='tiny' className='superscripted' />
                                                : null
                                            }
                                        </label>
                                        {
                                            !_.isNil(input.description)
                                            ? <Popup trigger={formInput()} position='top right' wide >
                                                  <Popup.Content>
                                                      <Icon name="info circle"/>{input.description}
                                                  </Popup.Content>
                                              </Popup>
                                            : formInput()
                                        }
                                    </Form.Field>
                                );
                            })
                        }
                        <Form.Field className='skipPluginsValidationCheckbox'>
                            <Form.Checkbox toggle
                                           label="跳过插件认证"
                                           name='skipPluginsValidation'
                                           checked={this.state.skipPluginsValidation}
                                           onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        {
                            this.state.skipPluginsValidation && <Message>推荐路径用于插件上传到卡拉扬,该选项仅用于插件开发和高级用户.</Message>
                        }
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content='取消'/>
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content='部署' icon="rocket" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'DeployBlueprintModal',
    common: DeployBlueprintModal
});