/**
 * Created by pposel on 8/17/17.
 */

import React, { Component } from 'react';
import {Message} from 'semantic-ui-react';
import LinkToLogin from '../containers/LinkToLogin';

export default class ErrorPage extends Component {

    render () {
        return (
            <div className='coloredContainer' style={{background:'#80808030'}}>
                <div className="ui raised very padded text container segment center aligned segment404">
                    <h2 className="ui header">发生错误</h2>
                    <Message content={this.props.error} error/>
                    <LinkToLogin/>
                </div>
            </div>
        );
    }
}
