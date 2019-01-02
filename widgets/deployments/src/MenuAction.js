/**
 * Created by kinneretzin on 19/10/2016.
 */

//当前开放的操作
const EXECUTE_OPERATION = 'execute_operation'
const START = 'start'
const INSTALL = 'install'
const UNINSTALL = 'uninstall'
const UPDATE = 'update'

export default class MenuAction extends React.Component {

    static EDIT_ACTION='edit';
    static DELETE_ACTION='delete';
    static FORCE_DELETE_ACTION='forceDelete';
    static WORKFLOW_ACTION='workflow';

    _actionClick(workflowAction, proxy, {name}) {
        if (workflowAction) {
            var workflow = _.find(this.props.item.workflows,{name});
            console.log('selected workflow '+ name,workflow);
            this.props.onSelectAction(name, this.props.item, workflow);
        } else {
            this.props.onSelectAction(name, this.props.item);
        }
    }

    render () {
        let {PopupMenu, Menu} = Stage.Basic;

        let workflow = this.props.item.workflows
        workflow = workflow.filter((item) =>
            item.name === EXECUTE_OPERATION ||
            item.name === START ||
            item.name === INSTALL ||
            item.name === UNINSTALL ||
            item.name === UPDATE

        )
        return (
            <PopupMenu className="menuAction">
                <Menu pointing vertical>
                    <Menu.Item header>操作
                        <Menu.Menu>
                            {
                                workflow.map((workflow) => {
                                    let btn_name = _.capitalize(_.lowerCase(workflow.name));
                                    if(btn_name === 'Execute operation'){
                                        btn_name = '自定义操作';
                                    }else if(btn_name === 'Heal'){
                                        btn_name ='自愈';
                                    }else if(btn_name === 'Install'){
                                        btn_name ='安装';
                                    }else if(btn_name === 'Install new agents'){
                                        btn_name ='安装新代理';
                                    }else if(btn_name === 'Scale'){
                                        btn_name ='扩缩';
                                    }else if(btn_name === 'Uninstall'){
                                        btn_name ='卸载';
                                    }else if(btn_name === 'Update'){
                                        btn_name ='更新';
                                    }else if(btn_name === 'Start'){
                                        btn_name ='启动';
                                    }
                                    return <Menu.Item name={workflow.name}
									onClick={this._actionClick.bind(this, true)} key={workflow.name}>
                                                {btn_name}
                                           </Menu.Item>
                                })
                            }
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item icon='edit' content='编辑' name={MenuAction.EDIT_ACTION}
                                   onClick={this._actionClick.bind(this, false)}/>
                    <Menu.Item icon='trash outline' content='删除' name={MenuAction.DELETE_ACTION}
                                   onClick={this._actionClick.bind(this, false)}/>
                    <Menu.Item icon='trash' content='强制删除' name={MenuAction.FORCE_DELETE_ACTION}
                               onClick={this._actionClick.bind(this, false)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
