/**
 * Created by kinneretzin on 10/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default class Login extends Component {

    static propTypes = {
        username: PropTypes.string,
        loginError: PropTypes.string,
        onLogin: PropTypes.func.isRequired,
        isLoggingIn: PropTypes.bool.isRequired,
        whiteLabel: PropTypes.object

    };

    constructor(props,context){
        super(props, context);

        this.state = {
            username: props.username || '',
            password: ''
        };
    }

    onSubmit(e) {
        e.preventDefault();
        var redirect = this.props.location.query.redirect || null;
        this.props.onLogin(this.state.username, this.state.password, redirect);
    }

    render() {
        SplashLoadingScreen.turnOff();

        var isWhiteLabelEnabled = _.get(this.props,'whiteLabel.enabled');
        let loginPageHeader = _.get(this.props,'whiteLabel.loginPageHeader');
        let loginPageHeaderColor = _.get(this.props,'whiteLabel.loginPageHeaderColor','white');
        let loginPageText = _.get(this.props,'whiteLabel.loginPageText');
        let loginPageTextColor = _.get(this.props,'whiteLabel.loginPageTextColor','white');
        let isHeaderTextPresent = isWhiteLabelEnabled && (loginPageHeader || loginPageText);

        let loginError = this.props.loginError;
        if(loginError != null){
            if(loginError.indexOf('User unauthorized: Authentication failed for user') >= 0||loginError.indexOf('Invalid credentials')>=0){
                loginError = '用户名或密码错误请重新输入';
            }
            else if(loginError.indexOf('is currently in maintenance mode')>=0){
                loginError = '请求被拒绝，当前系统处于维护模式';
            }
        }
        return (
                <div className={`loginContainer ${isHeaderTextPresent?'loginContainerExtended':''}`} >

                    {
                        isHeaderTextPresent &&
                        <div className="loginHeader">
                            {loginPageHeader && <h2><font color={loginPageHeaderColor}>{loginPageHeader}</font></h2>}
                            {loginPageText && <p><font color={loginPageTextColor}>{loginPageText}</font></p>}
                        </div>
                    }

                    <div className='login-img-div'>
                        <img src='/stage/app/images/Cloudify-logo.png' className='login-logo'></img>
                    </div>
                    <div className='div-line'></div>

                    <form className="ui huge form" onSubmit={this.onSubmit.bind(this)}>
                        <div className="field required">
                            <input type="text" name="username" placeholder="请输入用户名" required autoFocus value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})}/>
                        </div>
                        <div className="field required">
                            <input type="password" name="password" placeholder="请输入密码" required value={this.state.password} onChange={(e)=>this.setState({password: e.target.value})}/>
                        </div>

                        {
                            this.props.loginError ?
                                <div className="ui error message tiny" style={{'display':'block'}}>
                                    <p>{loginError}</p>
                                </div>
                                :
                                ''
                        }

                        <button className={'ui submit huge login-button ' + (this.props.isLoggingIn ? 'loading disabled' : '')} type="submit" disabled={this.props.isLoggingIn}>登录</button>
                    </form>
                </div>
        );
    }
}
