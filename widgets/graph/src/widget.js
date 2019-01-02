/**
 * Created by jakubniezgoda on 15/03/2017.
 */

Stage.defineWidget({
    id: 'graph',
    name: '部署度量图',
    description: '显示部署性能数据',
    initialWidth: 6,
    initialHeight: 20,
    showHeader: true,
    showBorder: true,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('graph'),
    color: 'blue',
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        {id: 'nodeFilter', name: '节点过滤',  description: '性能数据可显示的节点选择器', type: Stage.Basic.GenericField.CUSTOM_TYPE,
         component: Stage.Basic.NodeFilter, default: Stage.Basic.NodeFilter.EMPTY_VALUE, storeValueInContext: true},
        {id: 'charts', name: '图表',  description: '图标配置表', default: '', type: Stage.Basic.GenericField.CUSTOM_TYPE,
         component: Stage.Basic.Form.Table, rows: 5, columns: [
            {name: 'metric', label: 'Metric', default: '', type: Stage.Basic.GenericField.CUSTOM_TYPE,
             component: Stage.Basic.MetricFilter, description: '图表上显示的指标', filterContextName: 'nodeFilter'},
            {name: 'label', label: 'Label', default: '', type: Stage.Basic.GenericField.STRING_TYPE, description: 'Chart label'}
        ]},
        {id: 'query', name: '自定义Influxdb 查询', description: '下面的查询语句将覆盖\'图表\'中的配置', default: '', type: Stage.Basic.GenericField.CUSTOM_TYPE,
         component: Stage.Basic.Form.Table, rows: 1, columns: [
            {name: 'qSelect', label: 'SELECT', default: '', type: Stage.Basic.GenericField.STRING_TYPE, description: ''},
            {name: 'qFrom', label: 'FROM', default: '', type: Stage.Basic.GenericField.STRING_TYPE, description: 'You can use ${deploymentId} token to inject dynamic deployment ID. Example: \'/${deploymentId}\..*\.((memory_MemFree))$/\''},
            {name: 'qWhere', label: 'WHERE', default: '', type: Stage.Basic.GenericField.STRING_TYPE, description: 'You can use ${timeFilter} token to inject dynamic data/time ranges.'}
        ]},
        {id: 'type', name: '图表类型', items: [
            {name:'线图', value:Stage.Basic.Graphs.Graph.LINE_CHART_TYPE},
            {name:'条形图', value:Stage.Basic.Graphs.Graph.BAR_CHART_TYPE},
            {name:'面积图', value:Stage.Basic.Graphs.Graph.AREA_CHART_TYPE}],
         default: Stage.Basic.Graphs.Graph.LINE_CHART_TYPE, type: Stage.Basic.GenericField.LIST_TYPE},
        {id: 'timeFilter', name: '时间范围',  description: '所有定义图表的时间范围',
         type: Stage.Basic.GenericField.CUSTOM_TYPE, component: Stage.Basic.TimeFilter,
         default: Stage.Basic.TimeFilter.INFLUX_DEFAULT_VALUE, defaultValue: Stage.Basic.TimeFilter.INFLUX_DEFAULT_VALUE}
    ],
    UNCONFIGURED_STATE: 'unconfigured',
    EMPTY_RESPONSE_STATE: 'emptyResponse',

    _prepareData: function(data, xDataKey) {
        const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
        const MAX_NUMBER_OF_POINTS = 200;
        const TIME_INDEX = 0;
        const VALUE_INDEX = 1;
        const REFERENCE_METRIC_INDEX = 0;
        const NUMBER_OF_METRICS = data.length;
        const NUMBER_OF_POINTS = data[REFERENCE_METRIC_INDEX].points.length;
        let points = [];

        // Data conversion to recharts format
        // As a reference time points list, metric no. REFERENCE_METRIC_INDEX is taken
        for (let i = 0; i < NUMBER_OF_POINTS; i++) {
            let point = { [xDataKey]: Stage.Utils.formatTimestamp(data[REFERENCE_METRIC_INDEX].points[i][TIME_INDEX], TIME_FORMAT, null) };
            for (let j = 0; j < NUMBER_OF_METRICS; j++) {
                if (data[j].points[i] &&
                    data[REFERENCE_METRIC_INDEX].points[i][TIME_INDEX] === data[j].points[i][TIME_INDEX])
                {
                    let metricName = data[j].name;
                    let pointValue = data[j].points[i][VALUE_INDEX];
                    point[metricName] = pointValue;
                }
            }
            points.push(point);
        }

        // Data optimization (show no more than MAX_NUMBER_OF_POINTS points on the graph)
        if (points.length > MAX_NUMBER_OF_POINTS) {
            let optimizedPoints = [];
            let delta = parseFloat(points.length / MAX_NUMBER_OF_POINTS);
            for (let i = 0; i < points.length; i = i + delta) {
                optimizedPoints.push(points[Math.floor(i)]);
            }
            points = optimizedPoints;
        }

        return points;
    },

    _getChartsMetricsList: function(charts) {
        return _.chain(charts)
                .filter((graph) => !_.isEmpty(graph.metric))
                .map((graph) => graph.metric)
                .uniq()
                .value();
    },

    _getChartsConfiguration: function(charts, query, data) {
        let chartsConfig = [];

        if (!_.isEmpty(query)) {
            _.forEach(data, (chart) => {
                chartsConfig.push({
                    name: chart.name,
                    label: chart.name,
                    axisLabel: ''
                });
            })
        } else {
            _.forEach(charts, (chart) => {
                let chartName = chart.metric;
                if (!_.isEmpty(chartName)) {
                    chartsConfig.push({
                        name: chartName,
                        label: chart.label ? chart.label : chartName,
                        axisLabel: ''
                    });
                }
            })

            chartsConfig = _.uniqBy(chartsConfig, 'name');
        }

        return chartsConfig;
    },

    _sanitizeQuery(string){
        return string.replace(/;/g, '');
    },

    _prepareInfluxQuery: function(queries, deploymentId, nodeId, nodeInstanceId, from, to, timeGroup) {
        return _.map(queries, (queryParams) => {
            let selectWhat = this._sanitizeQuery(queryParams.qSelect);
            let selectFrom = this._sanitizeQuery(queryParams.qFrom);
            let selectWhere = this._sanitizeQuery(queryParams.qWhere);

            if (!_.isEmpty(selectWhat) && !_.isEmpty(selectFrom)) {

                if ((_.includes(selectFrom, '${deploymentId}') && _.isEmpty(deploymentId)) ||
                    (_.includes(selectFrom, '${nodeId}') && _.isEmpty(nodeId)) ||
                    (_.includes(selectFrom, '${nodeInstanceId}') && _.isEmpty(nodeInstanceId)))
                    return {};

                selectFrom = _.replace(selectFrom, '${deploymentId}', deploymentId);
                selectFrom = _.replace(selectFrom, '${nodeId}', nodeId);
                selectFrom = _.replace(selectFrom, '${nodeInstanceId}', nodeInstanceId);
                selectWhere = _.replace(selectWhere, '${timeFilter}', `time > ${from} and time < ${to} group by time(${timeGroup})`);

                if (_.isEmpty(selectWhere))
                    return {qSelect: selectWhat, qFrom: selectFrom};
                else
                    return {qSelect: selectWhat, qFrom: selectFrom, qWhere: selectWhere};
            } else
                return {};
        });
    },

    _isEmptyResponse: function(widget, data) {
        return data.state === widget.definition.EMPTY_RESPONSE_STATE;
    },

    _isWidgetNotConfigured: function(widget, data) {
        return data.state === widget.definition.UNCONFIGURED_STATE;
    },

    fetchParams: function(widget, toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');
        let nodeId = toolbox.getContext().getValue('nodeId');
        let nodeInstanceId = toolbox.getContext().getValue('nodeInstanceId');
        let nodeFilterFromWidget = widget.configuration.nodeFilter;
        if (nodeFilterFromWidget.deploymentId || nodeFilterFromWidget.nodeId || nodeFilterFromWidget.nodeInstanceId) {
            deploymentId = nodeFilterFromWidget.deploymentId;
            nodeId = nodeFilterFromWidget.nodeId;
            nodeInstanceId = nodeFilterFromWidget.nodeInstanceId;
        }

        let timeFilterFromWidget = widget.configuration.timeFilter;
        let timeFilterFromContext = toolbox.getContext().getValue('timeFilter');

        let timeStart = _.get(timeFilterFromContext, 'start', timeFilterFromWidget.start);
        timeStart = moment(timeStart).isValid() ? `${moment(timeStart).unix()}s` : timeStart;

        let timeEnd = _.get(timeFilterFromContext, 'end', timeFilterFromWidget.end);
        timeEnd = moment(timeEnd).isValid() ? `${moment(timeEnd).unix()}s` : timeEnd;

        let timeResolution = _.get(timeFilterFromContext, 'resolution', timeFilterFromWidget.resolution);
        let timeUnit = _.get(timeFilterFromContext, 'unit', timeFilterFromWidget.unit);
        let timeGroup = `${timeResolution}${timeUnit}`;

        return { deploymentId, nodeId, nodeInstanceId, timeStart, timeEnd, timeGroup };
    },

    fetchData: function(widget, toolbox, params) {
        const actions = new Stage.Common.InfluxActions(toolbox);
        const deploymentId = params.deploymentId;
        const nodeId = params.nodeId;
        const nodeInstanceId = params.nodeInstanceId;
        const metrics = this._getChartsMetricsList(widget.configuration.charts);
        const from = params.timeStart;
        const to = params.timeEnd;
        const timeGroup = params.timeGroup;
        const preparedQuery = _.head(this._prepareInfluxQuery(widget.configuration.query, deploymentId, nodeId, nodeInstanceId, from, to, timeGroup));

        if (!_.isEmpty(preparedQuery)) {
            toolbox.loading(true);
            return actions.doRunQuery(preparedQuery.qSelect, preparedQuery.qFrom, preparedQuery.qWhere).then((data) => {
                toolbox.loading(false);
                let formattedResponse
                    = _.map(data, (metric) => ({name: _.last(_.split(metric.name, '.')), points: metric.points}));
                return Promise.resolve(_.isEmpty(data) ? {state: widget.definition.EMPTY_RESPONSE_STATE} : formattedResponse);
            }).catch((error) => {
                toolbox.loading(false);
                return Promise.reject('There was a problem while querying for data. ' +
                                      'Please check your Influx query syntax and try again. Error: ' +
                                      error.message || error);
            });
        } else if (!_.isEmpty(deploymentId) && !_.isEmpty(nodeInstanceId) && !_.isEmpty(metrics)) {
            toolbox.loading(true);
            return actions.doGetMetric(deploymentId, nodeId, nodeInstanceId, metrics, from, to, timeGroup)
                .then((data) => {
                    toolbox.loading(false);
                    let formattedResponse
                        = _.map(data, (metric) => ({name: _.last(_.split(metric.name, '.')), points: metric.points}));
                    return Promise.resolve(_.isEmpty(data) ? {state: widget.definition.EMPTY_RESPONSE_STATE} : formattedResponse);
                })
                .catch((error) => {
                    toolbox.loading(false);
                    return Promise.reject('There was a problem while querying for data. ' +
                                          'Please check Deployment ID, Node ID, Node Instance ID, Metric and time range. Error: ' +
                                          error.message || error);
                });
        } else {
            toolbox.loading(false);
            return Promise.resolve({state: widget.definition.UNCONFIGURED_STATE});
        }
    },

    render: function(widget,data,error,toolbox) {
        let {charts, query, type} = widget.configuration;
        let {Message, Icon} = Stage.Basic;

        if (_.isEmpty(data)) {
            return (
                <Stage.Basic.Loading/>
            );
        } else if (this._isWidgetNotConfigured(widget, data)) {
            return (
                <Message info icon>
                    <Icon name='info' />
                    请在配置中配置要显示的数据以及显示类型.
                </Message>
            );
        } else if (this._isEmptyResponse(widget, data)) {
            return (
                <Message info icon>
                    <Icon name='ban' />
                    No data fetched for specified chart(s) configuration.
                </Message>
            );
        }

        let {Graph} = Stage.Basic.Graphs;
        return (
            <Graph type={type}
                   data={this._prepareData(data, Graph.DEFAULT_X_DATA_KEY)}
                   charts={this._getChartsConfiguration(charts, query, data)} />
        );
    }
});