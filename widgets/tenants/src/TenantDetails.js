﻿/**
 * Created by jakubniezgoda on 02/02/2017.
 */

import Actions from './actions';
import UserRoles from './UserRoles';

let PropTypes = React.PropTypes;

export default class TenantDetails extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            processing: false,
            processItem: ''
        }
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        tenant: PropTypes.object.isRequired,
        onError: PropTypes.func
    };

    _removeUser(username) {
        this.setState({processItem: username, processing: true});

        var actions = new Actions(this.props.toolbox);
        actions.doRemoveUser(this.props.tenant.name, username).then(()=>{
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('users:refresh');
            this.setState({processItem: '', processing: false});
        }).catch((err)=>{
            this.props.onError(err.message);
            this.setState({processItem: '', processing: false});
        });
    }

    _removeUserGroup(group) {
        this.setState({processItem: group, processing: true});

        var actions = new Actions(this.props.toolbox);
        actions.doRemoveUserGroup(this.props.tenant.name, group).then(()=>{
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('userGroups:refresh');
            this.setState({processItem: '', processing: false});
        }).catch((err)=>{
            this.props.onError(err.message);
            this.setState({processItem: '', processing: false});
        });
    }

    render() {
        let {Segment, List, Icon, Message, Divider} = Stage.Basic;
        let tenant = this.props.tenant;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users"/> Groups
                    <Divider/>
                    <List divided relaxed verticalAlign='middle' className="light">
                        {
                            _.map(tenant.groups, (role, group) => {
                                let processing = this.state.processing && this.state.processItem === group;

                                return (
                                    <List.Item key={group}>
                                        {group} - {role} (<i>direct role</i>)
                                        <Icon link name={processing?'notched circle':'remove'} loading={processing}
                                              className="right floated" onClick={this._removeUserGroup.bind(this, group)}/>
                                    </List.Item>
                                );
                            })
                        }

                        {_.isEmpty(tenant.groups) && <Message content="没有可用的组"/>}
                    </List>
                </Segment>
                <Segment>
                    <Icon name="user"/> Users
                    <Divider/>
                    <List divided relaxed verticalAlign='middle' className="light">
                        {
                            _.map(tenant.users, (data, user) => {
                                let processing = this.state.processing && this.state.processItem === user;

                                return (
                                    <List.Item key={user}>
                                        {user} - <UserRoles tenant={tenant} user={user}/>
                                        <Icon link name={processing?'notched circle':'remove'} loading={processing}
                                              className="right floated" onClick={this._removeUser.bind(this, user)}/>
                                    </List.Item>
                                );
                            })
                        }

                        {_.isEmpty(tenant.users) && <Message content="没有可用的用户"/>}
                    </List>
                </Segment>
            </Segment.Group>
        );
    }
};