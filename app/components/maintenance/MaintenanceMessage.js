/**
 * Created by pposel on 16/02/2017.
 */

import React, { Component, PropTypes } from 'react';
import Consts from '../../utils/consts';

export default class MaintenanceMessage extends Component {

    static propTypes = {
        manager: PropTypes.object.isRequired
    };

    render() {
        if (this.props.manager.status !== Consts.MANAGER_RUNNING ||
            this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED) {
            return null;
        }

        return (
            <div className="ui yellow small message maintenance">
                服务器处于维护模式, 一些操作不被允许
            </div>
        );
    }
}
