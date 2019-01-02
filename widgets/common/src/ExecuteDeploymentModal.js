/**
 * Created by kinneretzin on 19/10/2016.
 */

import _ from 'lodash';
let PropTypes = React.PropTypes;

export default class ExecuteDeploymentModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = ExecuteDeploymentModal.initialState();
    }

    static initialState = () => {
        return {
            errors: {},
            loading: false,
            force: false,
            params: {}
        }
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        workflow: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(ExecuteDeploymentModal.initialState());
        }
    }

    onApprove () {
        this._submitExecute();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _submitExecute () {
        if (!this.props.deployment || !this.props.workflow) {
            this.setState({errors: {error: '找不到工作流或部署'}});
            return false;
        }

        //Check required parameters has value
        var errors = {};
        _.forEach(this.props.workflow.parameters, (param, name) => {
            if(this.isParamRequired(param) && !this.state.params[name]){
                errors[name] = `请输入 ${name}`;
            }
        });

        if (!_.isEmpty(errors)){
            this.setState({errors: errors});
            return false;
        }

        this.setState({loading: true});

        // Attempt to parse params to json
        var paramsJson = {};
        _.map(this.state.params, (param,name) => {
            paramsJson[name] = Stage.Common.JsonUtils.stringToJson((param));
        });

        // Note that this.setState() is asynchronous and we cannot be sure that
        // the state changes before we call doExecute
        this.setState({params: paramsJson});

        var actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doExecute(this.props.deployment, this.props.workflow, paramsJson, this.state.force).then(()=>{
            this.setState({loading: false, errors: {}});
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({loading: false, errors: {error: err.message}});
        })
    }

    getGenericFieldType(parameter){
        const {GenericField} = Stage.Basic;

        switch (parameter.type){
            case 'boolean':
                return GenericField.BOOLEAN_LIST_TYPE;
            case 'integer':
                return GenericField.NUMBER_TYPE;
            default:
                return GenericField.STRING_TYPE;
        }
    }

    getParameterPlaceholder(defaultValue){
        if(_.isString(defaultValue)){
            return defaultValue;
        } else if(!_.isUndefined(defaultValue)){
            return Stage.Common.JsonUtils.stringify(defaultValue, null, true);
        }
    }

    isParamRequired(parameter){
        return _.isUndefined(parameter.default);
    }

    handleInputChange(event, field) {
        this.setState({params: {...this.state.params, ...Stage.Basic.Form.fieldNameValue(field)}});
    }

    render() {
        var {Modal, Icon, Form, Message, ApproveButton, CancelButton, GenericField} = Stage.Basic;

        var workflow = Object.assign({},{name:'', parameters:[]}, this.props.workflow);
        var btn_name = workflow.name;
        if(btn_name === 'execute_operation'){
            btn_name = '自定义操作';
        }else if(btn_name === 'heal'){
            btn_name ='自愈';
        }else if(btn_name === 'install'){
            btn_name ='安装';
        }else if(btn_name === 'install_new_agents'){
            btn_name ='安装代理';
        }else if(btn_name === 'scale'){
            btn_name ='扩缩';
        }else if(btn_name === 'uninstall'){
            btn_name ='卸载';
        }else if(btn_name === 'update'){
            btn_name ='更新';
        }else if(btn_name === 'restart'){
            btn_name ='重启';
        }else if(btn_name === 'start'){
            btn_name ='启动';
        }else if(btn_name === 'stop'){
            btn_name ='停止';
        }

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="executeWorkflowModal">
                <Modal.Header>
                    <Icon name="road"/> {btn_name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        {
                            _.isEmpty(workflow.parameters)
                            &&
                            <Message content="没有用于执行的参数"/>
                        }

                        {
                            _.map(workflow.parameters,(parameter,name)=>{
                                var btn_name = name;
                                if(name === 'operation_kwargs'){
                                    btn_name = '操作参数'
                                }else if(name === 'node_ids'){
                                    btn_name = '节点编号'
                                }else if(name === 'node_instance_ids'){
                                    btn_name = '节点实例编号'
                                }else if(name === 'run_by_dependency_order'){
                                    btn_name = '运行顺序'
                                }else if(name === 'operation'){
                                    btn_name = '操作'
                                }else if(name === 'allow_kwargs_override'){
                                    btn_name = '参数重载'
                                }else if(name === 'type_names'){
                                    btn_name = '类型名称'
                                }else if(name === 'diagnose_value'){
                                    btn_name = '诊断值'
                                }else if(name === 'node_instance_id'){
                                    btn_name = '节点实例编号'
                                }else if(name === 'ignore_failure'){
                                    btn_name = '忽略失败'
                                }else if(name === 'install_agent_timeout'){
                                    btn_name = '安装代理超时'
                                }else if(name === 'validate'){
                                    btn_name = '校验'
                                }else if(name === 'install'){
                                    btn_name = '安装'
                                }else if(name === 'install_script'){
                                    btn_name = '安装描述'
                                }else if(name === 'scalable_entity_name'){
                                    btn_name = '扩展实体名称'
                                }else if(name === 'scale_compute'){
                                    btn_name = '扩缩计算'
                                }else if(name === 'delta'){
                                    btn_name = '扩缩差值'
                                }else if(name === 'skip_uninstall'){
                                    btn_name = '跳过卸载'
                                }else if(name === 'remove_target_instance_ids'){
                                    btn_name = '移除目标实例'
                                }else if(name === 'added_instance_ids'){
                                    btn_name = '添加实例'
                                }else if(name === 'modified_entity_ids'){
                                    btn_name = '编辑实体'
                                }else if(name === 'added_target_instances_ids'){
                                    btn_name = '添加目标实例'
                                }else if(name === 'update_id'){
                                    btn_name = '更新编号'
                                }else if(name === 'skip_install'){
                                    btn_name = '跳过安装'
                                }else if(name === 'removed_instance_ids'){
                                    btn_name = '移除实例'
                                }else if(name === 'extend_target_instance_ids'){
                                    btn_name = '扩展目标实例'
                                }else if(name === 'reduce_target_instance_ids'){
                                    btn_name = '减少目标实例'
                                }else if(name === 'reduced_instance_ids'){
                                    btn_name = '减少实例'
                                }else if(name === 'extended_instance_ids'){
                                    btn_name = '扩展目标实例'
                                }else if(btn_name === 'operation_parms'){
                                    btn_name = '操作参数'
                                }
                                return (
                                    <Form.Field key={name} error={this.state.errors[name]}>
                                        <GenericField name={name}
                                                      label={btn_name}
                                                      description={parameter.description}
                                                      type={this.getGenericFieldType(parameter)}
                                                      value={this.state.params[name]}
                                                      placeholder={this.getParameterPlaceholder(parameter.default)}
                                                      required={this.isParamRequired(parameter)}
                                                      onChange={this.handleInputChange.bind(this)} />
                                    </Form.Field>
                                );
                            })
                        }
                        <Form.Field key="force">
                            <GenericField
                                name="force"
                                label="强制"
                                description=""
                                type={GenericField.BOOLEAN_TYPE}
                                value={this.state.force}
                                onChange={(event, field) => {
                                    this.setState({force: field.checked});
                                }} />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} content= '取消' />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="执行" icon="rocket" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});
