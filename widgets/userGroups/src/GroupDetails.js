﻿/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class UserDetails extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            processing: false,
            processItem: ''
        }
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        onError: PropTypes.func
    };

    _removeTenant(tenant) {
        this.setState({processItem: tenant, processing: true});

        var actions = new Actions(this.props.toolbox);
        actions.doRemoveTenantFromGroup(tenant, this.props.data.name).then(()=>{
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('users:refresh');
            this.props.toolbox.getEventBus().trigger('tenants:refresh');
            this.setState({processItem: '', processing: false});
        }).catch((err)=>{
            this.props.onError(err.message);
            this.setState({processItem: '', processing: false});
        });
    }

    _removeUser(username) {
        this.setState({processItem: username, processing: true});

        var actions = new Actions(this.props.toolbox);
        actions.doRemoveUserFromGroup(username, this.props.data.name).then(()=>{
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('users:refresh');
            this.props.toolbox.getEventBus().trigger('tenants:refresh');
            this.setState({processItem: '', processing: false});
        }).catch((err)=>{
            this.props.onError(err.message);
            this.setState({processItem: '', processing: false});
        });
    }

    render() {
        let {Segment, List, Icon, Message, Divider} = Stage.Basic;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users"/> Users
                    <Divider/>
                    <List divided relaxed verticalAlign='middle' className="light">
                        {
                            this.props.data.users.map((item) => {
                                let processing = this.state.processing && this.state.processItem === item;

                                return (
                                    <List.Item key={item}>
                                        {item}
                                        <Icon link name={processing?'notched circle':'remove'} loading={processing}
                                              className="right floated" onClick={this._removeUser.bind(this, item)}/>
                                    </List.Item>
                                );
                            })
                        }

                        {_.isEmpty(this.props.data.users) && <Message content="没有可用用户"/>}
                    </List>
                </Segment>
                <Segment>
                    <Icon name="users"/> Tenants
                    <Divider/>
                    <List divided relaxed verticalAlign='middle' className="light">
                        {
                            _.map(this.props.data.tenants, (role, item) => {
                                let processing = this.state.processing && this.state.processItem === item;

                                return (
                                    <List.Item key={item}>
                                        {item} - {role} (<i>direct role</i>)
                                        <Icon link name={processing?'notched circle':'remove'} loading={processing}
                                              className="right floated" onClick={this._removeTenant.bind(this, item)}/>
                                    </List.Item>
                                );
                            })
                        }

                        {_.isEmpty(this.props.data.tenants) && <Message content="没有可用租户"/>}
                    </List>
                </Segment>
            </Segment.Group>
        );
    }
};
