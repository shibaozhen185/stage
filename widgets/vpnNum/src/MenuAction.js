/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static DELETE_ACTION='delete'
    static UPDATE_ACTION='update'
    static DOWNLINE_ACTION='downLine'
    static LIMIT_ACTION='limit'


    _actionClick(proxy, {name}) {

        this.props.onSelectAction(name, this.props.item);
    }

    render () {
        let {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item icon='edit' content='编辑' name={MenuAction.UPDATE_ACTION}
                               onClick={this._actionClick.bind(this)}/>

                    <Menu.Item icon='exchange' content='限速' name={MenuAction.LIMIT_ACTION}
                               onClick={this._actionClick.bind(this)}/>

                    <Menu.Item icon='undo' content='强制下线' name={MenuAction.DOWNLINE_ACTION}
                               onClick={this._actionClick.bind(this)}/>

                    <Menu.Item icon='trash' content='删除' name={MenuAction.DELETE_ACTION}
                               onClick={this._actionClick.bind(this)}/>

                </Menu>
            </PopupMenu>
        );
    }
}
