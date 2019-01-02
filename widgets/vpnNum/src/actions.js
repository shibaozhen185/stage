/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(params) {
        return this.toolbox.getInternal().doPut('/radius/users', null, params)
    }

    doUpdate(id, params) {
        return this.toolbox.getInternal().doPut(`/radius/users/${id}`, null, params)
    }

    doDelete(id) {
        return this.toolbox.getInternal().doDelete(`/radius/users/${id}`)
    }

    doDownLine(params) {
        return this.toolbox.getInternal().doPut(`/radius/downline/`, null, params)
    }

    // deployment_id: "dp"
    // force: false
    // parameters: {node_ids: "ros", operation: "cloudify.interfaces.power.off"}
    // workflow_id: "execute_operation"
}
