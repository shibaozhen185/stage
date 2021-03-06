
/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

const EMPTY_BLUEPRINT = {id: '', plan: {inputs: {}}};
const DEPLOYMENT_INPUT_CLASSNAME = 'deploymentInput';

export default class DeployModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = DeployModal.initialState;
    }

    static initialState = {
        errors: {},
        loading: false,
        blueprint: EMPTY_BLUEPRINT,
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
        blueprints: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(DeployModal.initialState);
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

    _selectBlueprint(proxy, data){
        if (!_.isEmpty(data.value)) {
            this.setState({loading: true});

            var actions = new Actions(this.props.toolbox);
            actions.doGetFullBlueprintData(data.value).then((blueprint)=>{
                let deploymentInputs = {};
                _.forEach(blueprint.plan.inputs, (inputObj, inputName) => deploymentInputs[inputName] = '');
                this.setState({deploymentInputs, blueprint, errors: {}, loading: false});
            }).catch((err)=> {
                this.setState({blueprint: EMPTY_BLUEPRINT, loading: false, errors: {error: err.message}});
            });
        } else {
            this.setState({blueprint: EMPTY_BLUEPRINT, errors: {}});
        }
    }

    _handleInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        if (field.className === DEPLOYMENT_INPUT_CLASSNAME) {
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

    _submitDeploy () {
        let errors = {};
        const EMPTY_STRING = '""';

        if (_.isEmpty(this.state.deploymentName)) {
            errors['deploymentName']='请提供部署的名字';
        }

        if (_.isEmpty(this.state.blueprint.id)) {
            errors['blueprintName']='请从列表中选择部署';
        }

        let deploymentInputs = {};
        _.forEach(this.state.blueprint.plan.inputs, (inputObj, inputName) => {
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

        var actions = new Actions(this.props.toolbox);
        actions.doDeploy(this.state.blueprint.id, this.state.deploymentName, deploymentInputs, this.state.visibility, this.state.skipPluginsValidation)
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
        let blueprintPlanInputs = this.state.blueprint.plan.inputs;

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
                this.setState({errors: {yamlFile: `在配置文件文件中没有提供的强制输入(${notFoundInputs})`}, fileLoading: false});
            }
        }).catch((err)=>{
            this.setState({errors: {yamlFile: err.message}, fileLoading: false});
        });
    }

    render() {
        var {Modal, Icon, Form, Message, Popup, ApproveButton, CancelButton, VisibilityField, Header} = Stage.Basic;

        let blueprints = Object.assign({},{items:[]}, this.props.blueprints);
        let options = _.map(blueprints.items, blueprint => { return { text: blueprint.id, value: blueprint.id } });

        let deploymentInputs = _.sortBy(_.map(this.state.blueprint.plan.inputs, (input, name) => ({'name': name, ...input})),
                                        [(input => !_.isNil(input.default)), 'name']);
        let yamlFileField = () =>
            <Form.Field error={this.state.errors.yamlFile}>
                <Form.File name="yamlFile" placeholder="配置文件" ref="yamlFile"
                           onChange={this._handleYamlFileChange.bind(this)} loading={this.state.fileLoading}
                           disabled={this.state.fileLoading} />
            </Form.Field>;

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
                <Modal.Header>
                    <Icon name="rocket"/> Create new deployment
                    <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                  onVisibilityChange={(visibility)=>this.setState({visibility:visibility})} disallowGlobal={true}/>
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.deploymentName}>
                            <Form.Input name='deploymentName' placeholder="部署名称"
                                        value={this.state.deploymentName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.blueprintName}>
                            <Form.Dropdown search selection value={this.state.blueprint.id} placeholder="选择模板"
                                           name="blueprintName" options={options} onChange={this._selectBlueprint.bind(this)}/>
                        </Form.Field>

                        {
                            this.state.blueprint.id
                            &&
                            <Form.Divider>
                                <Header size="tiny">
                                   部署输入
                                    <Header.Subheader>
                                        如果为空输入""
                                    </Header.Subheader>
                                </Header>
                            </Form.Divider>
                        }

                        {
                            this.state.blueprint.id &&
                            (
                                _.isEmpty(this.state.blueprint.plan.inputs)
                                ?
                                    <Message content="未为选定的模板提供任何输入"/>
                                :
                                    <Popup trigger={yamlFileField()} position='top right' wide >
                                        <Popup.Content>
                                            <Icon name="info circle"/>为配置文件提供所有的部署输入，以自动填写表单。
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
                                                className={DEPLOYMENT_INPUT_CLASSNAME} />
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
                        <Form.Field>
                            <Form.Checkbox toggle
                                           label="跳过插件验证"
                                           name='skipPluginsValidation'
                                           checked={this.state.skipPluginsValidation}
                                           onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                        {
                            this.state.skipPluginsValidation && <Message>推荐路径用于插件上传到TeleNOS。该选项仅用于插件开发和高级用户</Message>
                        }
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content="取消" />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="部署" icon="rocket" className="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
