/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static SET_VIMINFO_ACTION = 'vimInfo';
    static DELETE_ACTION = 'delete';
    static DEACTIVATE_ACTION = 'deactivate';
    static ACTIVATE_ACTION = 'activate';

    _actionClick(proxy, {name}) {
        this.props.onSelectAction(name, this.props.item);
    }

    render () {
        var {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    {
                        this.props.item.active ?
                            <Menu.Item icon='ban' content='停用' name={MenuAction.DEACTIVATE_ACTION}
                                       onClick={this._actionClick.bind(this)}/>
                        :
                            <Menu.Item icon='ban' content='激活' name={MenuAction.ACTIVATE_ACTION}
                                       onClick={this._actionClick.bind(this)}/>
                    }

                    <Menu.Item icon='trash' content='删除' name={MenuAction.DELETE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
