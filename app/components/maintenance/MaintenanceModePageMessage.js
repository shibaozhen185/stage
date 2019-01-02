/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component, PropTypes } from 'react';
import MaintenanceMode from '../../containers/maintenance/MaintenanceMode';
import Consts from '../../utils/consts';
import StatusPoller from '../../utils/StatusPoller';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

export default class MaintenanceModePageMessage extends Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            showMaintenanceModal: false
        }
    }

    static propTypes = {
        manager: PropTypes.object.isRequired,
        canMaintenanceMode: PropTypes.bool.isRequired
    };


    componentDidUpdate() {
        if (this.props.manager.maintenance !== Consts.MAINTENANCE_ACTIVATED) {
            this.props.navigateToHome();
        }
    }

    componentDidMount() {
        StatusPoller.getPoller().start();
    }

    componentWillUnmount() {
        StatusPoller.getPoller().stop();
    }

    render () {
        SplashLoadingScreen.turnOff();

        var {Label,Icon} = Stage.Basic;
        return (
            <div className='maintenancePage ui segment basic'>
                <div className="logo">
                    <img src={Stage.Utils.url('/app/images/Cloudify-logo.png')}/>
                </div>

                <div className="ui raised very padded text container segment center aligned maintenanceContainer">

                    <h2 className="ui header">维护模式</h2>
                    <p>服务器处于维护模式，目前不可用.</p>

                    {
                        this.props.canMaintenanceMode &&
                        <Label as='a' onClick={()=> this.setState({showMaintenanceModal: true})}>
                            <Icon name='doctor'/>
                            关闭维护模式
                        </Label>

                    }
                </div>

                {
                    this.props.canMaintenanceMode &&
                    <MaintenanceMode show={this.state.showMaintenanceModal}
                                     onHide={()=> this.setState({showMaintenanceModal: false})}/>

                }

            </div>
        );
    }
}
