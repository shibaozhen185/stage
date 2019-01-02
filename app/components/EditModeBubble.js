/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddPageButton from '../containers/AddPageButton';
import AddWidget from '../containers/AddWidget';
import Const from '../utils/consts';
import {Message, Sidebar, Button} from './basic';

export default class EditModeBubble extends Component {

    static propTypes = {
        page: PropTypes.object.isRequired,
        onDismiss: PropTypes.func.isRequired,
        isVisible: PropTypes.bool.isRequired,
        pageManagementMode: PropTypes.string,
        onPageSave: PropTypes.func
    };

    render() {
        var header, content;

        if (this.props.pageManagementMode) {
            if (this.props.pageManagementMode === Const.PAGE_MANAGEMENT_EDIT) {

                header = '页面管理';
                content =
                    <Message.Content className='alignCenter'>
                        <AddWidget className='compactBlock' pageId={this.props.page.id}
                                   pageManagementMode={this.props.pageManagementMode}/>
                        <Button basic content="保存" icon="save" onClick={() => this.props.onPageSave(this.props.page)}/>
                        <Button basic content="撤销" icon="remove" onClick={this.props.onDismiss}/>
                    </Message.Content>

            } else {

                header = '页面预览';
                content =
                    <Message.Content className='alignCenter'>
                        <Button basic content="退出" icon="sign out" onClick={this.props.onDismiss}/>
                    </Message.Content>

            }
        } else {

            header = '编辑模式';
            content =
                <Message.Content className='alignCenter'>
                    <AddWidget className='compactBlock' pageId={this.props.page.id}/>
                    <AddPageButton/>
                    <Button basic content="退出" icon="sign out" onClick={this.props.onDismiss}/>
                </Message.Content>

        }

        return (
            <Sidebar as={Message} animation='overlay' direction='bottom' visible={this.props.isVisible} className='editModeSidebar'>
                <Message color='yellow' onDismiss={this.props.onDismiss}>
                    <Message.Header className='alignCenter' content={header}/>
                    {content}
                </Message>
            </Sidebar>
        );
    }
}
