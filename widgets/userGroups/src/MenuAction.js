/**
 * Created by jakubniezgoda on 03/02/2017.
 */

export default class MenuAction extends React.Component {

    static EDIT_USERS_ACTION='users';
    static EDIT_TENANTS_ACTION='tenants';
    static DELETE_ACTION='delete';
    static SET_ROLE_ACTION='role';

    _actionClick(proxy, {name}) {
        this.props.onSelectAction(name, this.props.item);
    }

    render () {
        var {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item icon='male' content='设置角色' name={MenuAction.SET_ROLE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='users' content="编辑组用户" name={MenuAction.EDIT_USERS_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='user' content="编辑组租户" name={MenuAction.EDIT_TENANTS_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='trash' content='删除' name={MenuAction.DELETE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
