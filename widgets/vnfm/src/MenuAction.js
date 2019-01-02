/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {
 
    static DELETE_ACTION = 'delete';
    _actionClick(proxy, {name}) {
        this.props.onSelectAction(name, this.props.item);
    }

    render () {
        var {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item icon='trash' content='删除' name={MenuAction.DELETE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
