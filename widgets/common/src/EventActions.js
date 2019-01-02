/**
 * Created by pposel on 07/02/2017.
 */

const eventsMap = {
    'workflow_received': {
        text: '工作流接收',
        icon: 'icon-gs-workflow-stage',
    },
    'workflow_started': {
        text: '工作流启动',
        icon: 'icon-gs-workflow-started',
    },
    'workflow_initializing_policies': {
        text: '工作流初始化策略',
        icon: 'icon-gs-workflow-stage',
    },
    'workflow_initializing_node': {
        text: '工作流初始化节点',
        icon: 'icon-gs-workflow-stage',
    },
    'workflow_succeeded': {
        text: '工作流执行成功',
        icon: 'icon-gs-workflow-success',
    },
    'workflow_failed': {
        text: '工作流执行失败',
        icon: 'icon-gs-workflow-failed',
        class: 'row-error'
    },
    'workflow_cancelled': {
        text: '工作流已取消',
        icon: 'icon-gs-workflow-cancelled',
        class: 'row-error'
    },
    'workflow_stage': {
        text: '工作流阶段',
        icon: 'icon-gs-workflow-stage',
    },
    'task_started': {
        text: '任务开始',
        icon: 'icon-gs-task-started',
    },
    'sending_task': {
        text: '任务发送中',
        icon: 'icon-gs-task-sent',
    },
    'task_received': {
        text: '已接到任务',
        icon: 'icon-gs-task-recieved',
    },
    'task_succeeded': {
        text: '任务执行成功',
        icon: 'icon-gs-task-success',
    },
    'task_failed': {
        text: '任务执行失败',
        icon: 'icon-gs-task-failed',
        class: 'row-error'
    },
    'task_rescheduled': {
        text: '任务改期',
        icon: 'icon-gs-task-retry',
        class: 'row-error'
    },
    'task_retried': {
        text: '任务重试',
        icon: 'icon-gs-task-retried',
        class: 'row-error'
    },
    'policy_success': {
        text: '策略结束成功启动',
        icon: 'icon-gs-policy-success',
    },
    'policy_failed': {
        text: '策略失败',
        icon: 'icon-gs-policy-failed',
        class: 'row-error'
    },
    'workflow_node_event': {
        text: '工作流节点事件'
    },
    'processing_trigger': {
        text: '处理触发'
    },
    'trigger_failed': {
        text: '触发失败'
    },
    'trigger_succeeded': {
        text: '触发成功'
    },
    'workflow_event': {
        text: '工作流事件'
    },
    'debug': {
        icon: 'icon info circle blue large',
        class: 'row-debug',
        text: '调试'
    },
    'info': {
        icon: 'icon info circle green large',
        text: '信息'
    },
    'warning': {
        icon: 'icon warning sign yellow large',
        class: 'row-warning',
        text: '警告'
    },
    'error': {
        icon: 'icon warning circle red large',
        class: 'row-error',
        text: '错误'
    },
    'critical': {
        icon: 'icon remove circle red large',
        class: 'row-error',
        text: '临界'
    }
};

class EventActions {

    getEventDef(event) {
        return {...{text: event, icon: 'icon calendar outline large', class: 'info'}, ...eventsMap[event]};
    }

}

Stage.defineCommon({
    name: 'EventActions',
    common: EventActions
});
