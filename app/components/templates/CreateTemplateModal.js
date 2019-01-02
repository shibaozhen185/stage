/**
 * Created by pposel on 22/08/2017.
 */
import React, { Component, PropTypes } from 'react';
import Consts from '../../utils/consts';

export default class CreateTemplateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = CreateTemplateModal.initialState(false, props);
    }

    static initialState = (open, props) => {
        var availablePages = _.map(props.availablePages, page => page.id);
        availablePages = _.difference(availablePages, props.pages);

        return {
            open,
            loading: false,
            templateName: props.templateName,
            tenants: props.tenants,
            roles: props.roles,
            availablePages,
            pages: props.pages,
            errors: {}
        }
    };

    static propTypes = {
        availableTenants: PropTypes.object,
        availablePages: PropTypes.array,
        availableRoles: PropTypes.array,
        templateName: PropTypes.string,
        pages: PropTypes.array,
        roles: PropTypes.array,
        tenants: PropTypes.array,
        onCreateTemplate: PropTypes.func.isRequired
    };

    static defaultProps = {
        templateName: '',
        pages: [],
        roles: [],
        tenants: [],
        availablePages: [],
        availableRoles: []
    };

    componentDidUpdate() {
        if (!$('#reorderList').hasClass( 'ui-sortable' )) {
            $('#reorderList').sortable({
                placeholder: 'ui-sortable-placeholder',
                helper: 'clone',
                handle: '.handle',
                forcePlaceholderSize: true,
                start: (event, ui)=>this.pageIndex = ui.item.index(),
                update: (event, ui)=>this._reorderPage(this.pageIndex, ui.item.index())
            });
        }
    }

    _openModal() {
        this.setState(CreateTemplateModal.initialState(true, this.props))
    }

    _reorderPage(oldIndex, newIndex) {
        var pages = this.state.pages;

        var removed = pages.splice(oldIndex, 1)[0];
        pages.splice(newIndex, 0, removed);

        this.setState({pages});
    }

    _submitCreate() {
        let errors = {};

        if (_.isEmpty(_.trim(this.state.templateName))) {
            errors['templateName']='请输入合法的样板名';
        }

        if (_.isEmpty(this.state.roles)) {
            errors['roles']='请选择角色';
        }

        if (_.isEmpty(this.state.tenants)) {
            errors['tenants']='请选择租户';
        }

        if (_.isEmpty(this.state.pages)) {
            errors['pages']='请选择页面';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.props.onCreateTemplate(_.trim(this.state.templateName), this.state.roles, this.state.tenants, this.state.pages).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        if (field.name === 'tenants') {
            let wasSelectedAll = _.indexOf(this.state.tenants, Consts.DEFAULT_ALL) >= 0;
            let willSelectAll = _.indexOf(field.value, Consts.DEFAULT_ALL) >= 0;

            if (wasSelectedAll) {
                _.pull(field.value, Consts.DEFAULT_ALL);
            } else if (willSelectAll) {
                field.value = [Consts.DEFAULT_ALL];
            }
        }

        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _addPage(item) {
        var availablePages = _.without(this.state.availablePages, item);
        var pages = [...this.state.pages, item];

        this.setState({pages, availablePages}, () => {
            $('#reorderList').sortable('refresh');
        });
    }

    _removePage(item) {
        var availablePages = [...this.state.availablePages, item];
        var pages = _.without(this.state.pages, item);

        this.setState({pages, availablePages}, () => {
            $('#reorderList').sortable('refresh');
        });
    }

    render() {
        var {Modal, Button, Icon, Form, Segment, ApproveButton, CancelButton, Message, Divider, List} = Stage.Basic;

        let tenantOptions = _.map(this.props.availableTenants.items,item => {return {text: item.name, value: item.name, icon: 'radio'}});
        tenantOptions.push({text: '全部租户', value: Consts.DEFAULT_ALL, icon: 'selected radio'});

        let editMode = !_.isEmpty(this.props.templateName);

        const trigger = editMode ?
            <Icon name="edit" link  className='updateTemplateIcon' onClick={e => e.stopPropagation()}/>
            :
            <Button content='创建样板' icon='list layout' labelPosition='left' className='createTemplateButton'/>;

        return (
            <Modal trigger={trigger} open={this.state.open} onOpen={this._openModal.bind(this)}
                   onClose={()=>this.setState({open:false})} className="createTemplateModal">
                <Modal.Header>
                    <Icon name="list layout"/> {editMode ? <span>Update template {this.props.templateName}</span> : <span>创建样板</span>}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors} onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field error={this.state.errors.templateName}>
                            <Form.Input name='templateName' placeholder="样板名"
                                        value={this.state.templateName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.roles}>
                            <Form.Dropdown placeholder='角色' multiple selection closeOnChange options={this.props.availableRoles} name="roles"
                                           value={this.state.roles} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.tenants}>
                            <Form.Dropdown placeholder='租户' multiple selection closeOnChange options={tenantOptions} name="tenants"
                                           value={this.state.tenants} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Segment.Group horizontal>
                            <Segment style={{width: '50%'}}>
                                <Icon name="plus"/> 可用页面
                                <Divider/>
                                <List divided relaxed verticalAlign='middle' className="light">
                                    {
                                        this.state.availablePages.map((item) => {
                                            return (
                                                <List.Item key={item}>
                                                    {item}

                                                    <Icon link name='add' className="right floated" onClick={this._addPage.bind(this, item)} title="添加页面"/>
                                                </List.Item>
                                            );
                                        })
                                    }

                                    {_.isEmpty(this.state.availablePages) && <Message content="没有可用页面"/>}
                                </List>
                            </Segment>

                            <Segment style={{width: '50%'}}>
                                <Icon name="block layout"/> Selected pages
                                <Divider/>
                                <List divided relaxed verticalAlign='middle' className="light" id="reorderList">
                                    {
                                        this.state.pages.map((item) => {
                                            return (
                                                <List.Item key={item}>
                                                    {item}

                                                    <span className="right floated actionIcons">
                                                        <Icon link name='minus' onClick={this._removePage.bind(this, item)} title="移除页面"/>
                                                        <Icon link name='move' className="handle" title="移动页面"/>
                                                    </span>
                                                </List.Item>
                                            );
                                        })
                                    }

                                    {_.isEmpty(this.state.pages) && <Message content="没有选中页面"/>}
                                </List>
                            </Segment>
                        </Segment.Group>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={()=>this.setState({open:false})} disabled={this.state.loading} content='取消'/>
                    <ApproveButton onClick={this._submitCreate.bind(this)} disabled={this.state.loading} content={editMode ? '更新' : '创建'}
                                   icon={editMode ? '编辑' : 'checkmark'} color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
