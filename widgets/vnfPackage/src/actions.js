/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(item) {
        return this.toolbox.getManager().doDelete(`/vnf_pkgs/${item.id}`, null, { force: true });
    }

    doCreate(name, params) {
        return this.toolbox.getManager().doPut(`/vnf_pkgs/${name}`, null, params);
    }

    doActivate(name) {
        return this.toolbox.getManager().doPatch(`/vnf_pkgs/${name}/command?action=active`);
    }

    doDeactivate(name) {
        return this.toolbox.getManager().doPatch(`/vnf_pkgs/${name}/command?action=deactive`);
    }

}