/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import ActiveExecutionStatus from './ActiveExecutionStatus';

let PropTypes = React.PropTypes;

export default class extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onCancelExecution: PropTypes.func,
        onMenuAction: PropTypes.func,
        onError: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array
    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onCancelExecution: ()=>{},
        onMenuAction: ()=>{},
        onError: ()=>{},
        onSetVisibility: ()=>{},
        allowedSettingTo: ['tenant']
    };

    render() {
        let {DataSegment, ResourceVisibility} = Stage.Basic;

        return (
            <DataSegment totalSize={this.props.data.total}
                     pageSize={this.props.widget.configuration.pageSize}
                     fetchData={this.props.fetchData}>
                {
                    this.props.data.items.map((item) => {
                        return (
                            <DataSegment.Item key={item.id} selected={item.isSelected} className={item.id}
                                          onClick={()=>this.props.onSelectDeployment(item)}>
                                <div className="ui grid">
                                    <div className="three wide center aligned column rightDivider">
                                        <h3 className="ui icon header verticalCenter breakWord"><a href="javascript:void(0)" className="breakWord">{item.id}</a></h3>
                                        <ResourceVisibility visibility={item.visibility} onSetVisibility={(visibility) => this.props.onSetVisibility(item.id, visibility)} allowedSettingTo={this.props.allowedSettingTo} className="topRightCorner"/>
                                    </div>
                                    <div className="two wide column">
                                        <h5 className="ui icon header">模板</h5>
                                        <p>{item.blueprint_id}</p>
                                    </div>
                                    <div className="two wide column">
                                        <h5 className="ui icon header">创建时间</h5>
                                        <p>{item.created_at}</p>
                                    </div>
                                    <div className="two wide column">
                                        <h5 className="ui icon header">更新时间</h5>
                                        <p>{item.updated_at}</p>
                                    </div>
                                    <div className="two wide column">
                                        <h5 className="ui icon header">创建者</h5>
                                        <p>{item.created_by}</p>
                                    </div>
                                    <div className="four wide column">
                                        <h5 className="ui icon header">节点 ({item.nodeSize})</h5>
                                        <div className="ui four column grid">
                                            <div className="column center aligned">
                                                <NodeState icon="checkmark" title="开始" state="开始" color="green"
                                                           value={item.nodeStates.started}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="spinner" title="未初始化或创建" state="未初始化或创建" color="yellow"
                                                           value={_.add(item.nodeStates.uninitialized, item.nodeStates.created)}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="exclamation" title="警告" state="未定义" color="orange"
                                                           value={0}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="remove" title="错误" state="删除或停止" color="red"
                                                           value={_.add(item.nodeStates.deleted, item.nodeStates.stopped)}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="column action">
                                        {
                                            _.isEmpty(item.executions)
                                            ?
                                            <MenuAction item={item} onSelectAction={this.props.onMenuAction}/>
                                            :
                                            <ActiveExecutionStatus item={item.executions[0]} onCancelExecution={this.props.onCancelExecution}/>
                                        }
                                    </div>
                                </div>
                            </DataSegment.Item>
                        );
                    })
                }
            </DataSegment>
        );
    }
}

function NodeState(props) {
    let { Segment, Icon, Popup } = Stage.Basic;
    let value = props.value ? props.value : 0;
    let disabled = value === 0;
    let color = disabled ? 'grey' : props.color;

    return (
        <Popup header={_.capitalize(props.title)}
               content={`${value} 节点实例在 ${props.state} 中`}
               trigger={
                   <Segment.Group className='nodeState' disabled={disabled}>
                       <Segment color={color} disabled={disabled} inverted>
                           <Icon name={props.icon} />
                       </Segment>
                       <Segment color={color} disabled={disabled} tertiary inverted>
                           {value}
                       </Segment>
                   </Segment.Group>
               }
        />
    )
}