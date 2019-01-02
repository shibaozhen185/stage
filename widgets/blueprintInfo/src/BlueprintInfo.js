/**
 * Created by pposel on 06/02/2017.
 */


export default class BlueprintInfo extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: ''
        }
    }

    render() {
        var {ErrorMessage, Grid, Image, ResourceVisibility, Message, Label} = Stage.Basic;

        var blueprint = this.props.data;

        if (!blueprint.id) {
            return (
                <div>
                    <Message info>没有选择模板</Message>
                </div>
            )
        }

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>
                <Grid>
                    <Grid.Row className="bottomDivider">
                        <Grid.Column width="4"><Image src={Stage.Utils.url(`/ba/image/${blueprint.id}`)} centered={true}/></Grid.Column>
                        <Grid.Column width="12">
                            <h3 className="ui icon header verticalCenter">
                                <a className="underline blueprintInfoName" href="javascript:void(0)">{blueprint.id}</a>
                            </h3>
                            <ResourceVisibility visibility={blueprint.visibility} className="rightFloated"/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Column width="16">
                        {blueprint.description}
                    </Grid.Column>

                    <Grid.Row className="noPadded">
                        <Grid.Column width="7"><h5 className="ui icon header">创建者</h5></Grid.Column>
                        <Grid.Column width="9">{blueprint.created_at}</Grid.Column>
                    </Grid.Row>

                    <Grid.Row className="noPadded">
                        <Grid.Column width="7"><h5 className="ui icon header">更新时间</h5></Grid.Column>
                        <Grid.Column width="9">{blueprint.updated_at}</Grid.Column>
                    </Grid.Row>

                    <Grid.Row className="noPadded">
                        <Grid.Column width="7"><h5 className="ui icon header">创建者</h5></Grid.Column>
                        <Grid.Column width="9">{blueprint.created_by}</Grid.Column>
                    </Grid.Row>

                    <Grid.Row className="noPadded">
                        <Grid.Column width="7"><h5 className="ui icon header">模板主文件</h5></Grid.Column>
                        <Grid.Column width="9">{blueprint.main_file_name}</Grid.Column>
                    </Grid.Row>

                    <Grid.Row className="noPadded">
                        <Grid.Column width="7"><h5 className="ui icon header">部署</h5></Grid.Column>
                        <Grid.Column width="9"><Label color="green" horizontal>{blueprint.deployments}</Label></Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        );
    }
};
