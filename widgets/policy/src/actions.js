/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(name, params) {
        return this.toolbox.getManager().doPut(`/policy/${name}`, null, params);
    }

    doDelete(name) {
        return this.toolbox.getManager().doDelete(`/policy/${name}`);
    }

    doActivate(name) {
        return this.toolbox.getManager().doPatch(`/policy/${name}/command?action=active`);
    }

    doDeactivate(name) {
        return this.toolbox.getManager().doPatch(`/policy/${name}/command?action=deactive`);
    }

}