/**
 * Created by kinneretzin on 05/10/2016.
 */

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadModal.initialState, open: false};
        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    static initialState = {
        loading: false,
        urlLoading: false,
        fileLoading: false,
        blueprintUrl: '',
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        errors: {},
        yamlFiles: [],
        visibility: Stage.Common.Consts.defaultVisibility
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
            this.refs.blueprintFile && this.refs.blueprintFile.reset();
            this.refs.imageFile && this.refs.imageFile.reset();
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let blueprintFile = this.refs.blueprintFile.file();

        let errors = {};

        if (_.isEmpty(this.state.blueprintUrl) && !blueprintFile) {
            errors['blueprintUrl']='请选择模版url或文件';
        }

        if (!_.isEmpty(this.state.blueprintUrl) && blueprintFile) {
            errors['blueprintUrl']='模版url或文件必须选择一个';
        }

        if (_.isEmpty(this.state.blueprintName)) {
            errors['blueprintName']='请输入模版名称';
        }

        if (_.isEmpty(this.state.type)) {
            errors['type'] = '请输入模版类型';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.actions.doUpload(this.state.blueprintName,
                         this.state.blueprintFileName,
                         this.state.blueprintUrl,
                         blueprintFile,
                         this.state.imageUrl,
                         this.refs.imageFile.file(),
                         this.state.visibility,
                         this.state.type).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
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
        this.actions.doListYamlFiles(this.state.blueprintUrl).then((yamlFiles)=>{
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
        this.actions.doListYamlFiles(null, file).then((yamlFiles)=>{
            this.setState({yamlFiles, errors: {}, fileLoading: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, fileLoading: false});
        });
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton, VisibilityField, Popup} = Stage.Basic;
        const uploadButton = <Button content='上传' icon='upload' labelPosition='left' className="uploadBlueprintButton"/>;

        var options = _.map(this.state.yamlFiles, item => { return {text: item, value: item} });
        var typeOptions =[{ text: 'NS', value: 'NS' },{ text: 'VNF', value: 'VNF' }];

        return (
            <div>
                <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})}
                       onClose={()=>this.setState({open:false})} className="uploadBlueprintModal">
                    <Modal.Header>
                        <Icon name="upload"/>上传模版
                        <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                      onVisibilityChange={(visibility)=>this.setState({visibility: visibility})}/>
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>
                            <Form.Group>
                                <Form.Field width="8" error={this.state.errors.blueprintUrl}>
                                    <Form.Input label="URL" placeholder="输入模版URL" name="blueprintUrl"
                                                onChange={this._handleInputChange.bind(this)} value={this.state.blueprintUrl}
                                                onBlur={this._onBlueprintUrlBlur.bind(this)} loading={this.state.urlLoading}
                                                icon={this.state.urlLoading?'search':false} disabled={this.state.urlLoading} />
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        或
                                    </div>
                                </Form.Field>
                                <Form.Field width="7" error={this.state.errors.blueprintUrl}>
                                    <Form.File placeholder="选择模版文件" name="blueprintFile" ref="blueprintFile"
                                               onChange={this._onBlueprintFileChange.bind(this)} loading={this.state.fileLoading}
                                               disabled={this.state.fileLoading}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='如果您想向模版管理上传模版您需要选择包含精确的存档包。一个目录，其中应该有一个yaml文件描述主蓝图。'/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group>
                                <Form.Field width="16" error={this.state.errors.blueprintName}>
                                    <Form.Input name='blueprintName' placeholder="模版名称"
                                                value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='包将被上传到Manager作为模版资源，在这里指定名称.'/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                            <Form.Field width="16">
                                <Form.Dropdown placeholder='模版文件名' search selection options={options} name="blueprintFileName"
                                               value={this.state.blueprintFileName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                            <Form.Field width="1">
                                <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                       content='由于您可以在存档中拥有多个配置文件，您需要指定哪个是您的应用程序的主要文件。'/>
                            </Form.Field>
                        </Form.Group>

                            <Form.Group>
                                <Form.Field width="16">
                                    <Form.Dropdown placeholder='模版类型' search selection options={typeOptions} name="type"
                                                   value={this.state.type} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='请输入模版的类型。'/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group>
                                <Form.Field width="8" error={this.state.errors.imageUrl}>
                                    <Form.Input label="URL" placeholder="输入图片URL" name="imageUrl"
                                                value={this.state.imageUrl} onChange={this._handleInputChange.bind(this)}
                                                onBlur={()=>this.state.imageUrl ? this.refs.imageFile.reset() : ''}/>
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        或
                                    </div>
                                </Form.Field>
                                <Form.Field width="7" error={this.state.errors.imageUrl}>
                                    <Form.File placeholder="选择图片文件" name="imageFile" ref="imageFile"
                                               onChange={(file)=>file ? this.setState({imageUrl: ''}) : ''}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='模版的图标文件是一个可选的字段，您可以在其中选择将在局部模版中小部件代表模版的图标图像。'/>
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
