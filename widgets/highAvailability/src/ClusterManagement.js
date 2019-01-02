/**
 * Created by kinneretzin on 28/03/2017.
 */

import ClusterNodesList from './ClusterNodesList';

export default class ClusterManagement extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('cluster:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('cluster:refresh', this._refreshData);
    }

    render() {
        var {ErrorMessage,Label,Icon} = Stage.Basic;

        var isClusterInitialized = this.props.data.state.initialized;
        return (
            <div>
                <ErrorMessage error={this.state.error || this.props.data.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                {
                    isClusterInitialized ?
                    <h3><Icon name='checkmark' color='green'/> 集群已初始化</h3> :
                    <h3>
                        集群是没有初始化。使用Cloudify CLI来创建或加入一个集群，<a target="_blank" href="http://docs.getcloudify.org/latest/manager/high-availability-clusters/">是证明文件</a>.
                    </h3>
                }

                {
                    isClusterInitialized &&
                    <ClusterNodesList toolbox={this.props.toolbox} widget={this.props.widget} nodes={this.props.data.nodes}/>
                }
            </div>
        );
    }
}