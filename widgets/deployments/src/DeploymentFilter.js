
export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showAdvanced: false
        }
    }

    _showAdvanced(show) {
        if (show) {
            $(this.refs.advanced).slideDown(200);
            this.setState({showAdvanced:true});
        } else {
            $(this.refs.advanced).slideUp(200);
            this.setState({showAdvanced:false});
        }
    }

    _filterByDeploymentId() {
        let id = $(this.refs.deploymentId).val();
        this.props.context.refresh({id});
    }

    render () {
        return (
            <div className="ui small form">
                <div className="inline fields">
                    <div className="three wide field">
                        <input type="text" placeholder="现有搜索条件"/>
                    </div>
                    <div className="twelve wide field">
                        <div className="ui action input">
                            <input type="text" placeholder="寻找部署" ref="deploymentId"
                                   onKeyPress={(e) => {(e.key === 'Enter')?this._filterByDeploymentId():null}}/>
                            <button className="ui icon button" onClick={this._filterByDeploymentId.bind(this)}>
                                <i className="search inverted icon"></i>
                            </button>
                        </div>
                    </div>
                    <div className="field">
                        {
                            this.state.showAdvanced ?
                                <a href="javascript:void(0)" onClick={this._showAdvanced.bind(this, false)}>Simple</a>
                            :
                                <a href="javascript:void(0)" onClick={this._showAdvanced.bind(this, true)}>Advanced</a>
                        }
                    </div>
                </div>

                <div className="inline fields" ref="advanced" style={{display:'none'}}>
                    <div className="three wide field">
                    </div>
                    <div className="three wide field">
                        <input type="text" placeholder="模板"/>
                    </div>
                    <div className="three wide field">
                        <input type="text" placeholder="状态"/>
                    </div>
                    <div className="three wide field">
                        <div className="ui left action input">
                            <button className="ui icon button">
                                <i className="calendar inverted icon"></i>
                            </button>
                            <input type="text" placeholder="创建时间"/>
                        </div>
                    </div>
                    <div className="three wide field">
                        <div className="ui left action input">
                            <button className="ui icon button">
                                <i className="calendar inverted icon"></i>
                            </button>
                            <input type="text" placeholder="更新时间"/>
                        </div>
                    </div>
                    <div className="field">
                    </div>
                </div>
            </div>
        );
    }
}