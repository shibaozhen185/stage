/**
 * Created by pposel on 11/08/2017.
 */

import React, { Component, PropTypes } from 'react';
import Const from '../../utils/consts';

export default class RoleList extends Component {

    static propTypes = {
        roles: PropTypes.any.isRequired,
        onDelete: PropTypes.func,
        custom: PropTypes.bool,
        style: PropTypes.any
    };

    static defaultProps = {
        roles: []
    };

    render () {
        let {Segment, Icon, Divider, List, Message, PopupConfirm} = Stage.Basic;

        return (
            <Segment style={this.props.style}>
                <Icon name="student"/> Roles
                <Divider/>
                <List divided relaxed verticalAlign='middle' className="light">
                    {
                        this.props.roles.map((item) => {
                            return (
                                <List.Item key={item}>
                                    {item}

                                    {this.props.custom && _.size(this.props.roles) > 1 &&
                                    <PopupConfirm trigger={<Icon link name='remove' className="right floated" onClick={e => e.stopPropagation()}/>}
                                                  content='确定从当前样板移除这个角色?'
                                                  onConfirm={() => this.props.onDelete(item)}/>
                                    }
                                </List.Item>
                            );
                        })
                    }
                    {_.isEmpty(this.props.roles) && <Message content="没有可用的角色"/>}
                </List>
            </Segment>
        );
    }
}
