/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(name,params) {
        return this.toolbox.getManager().doPut(`/vims/${name}`, null, params);
    }
    doDelete(name) {
        return this.toolbox.getManager().doDelete('/vims/' + name);
    }
    doActivate(name) {
        let url = `/vims/${name}/command?action=active`;
        return this.toolbox.getManager().doPatch(url);
    }
    doGetPulgs() {
        return this.toolbox.getManager().doGet('/plugins?_include=id,package_name');
    }
    doDeactivate(name) {
        let url = `/vims/${name}/command?action=deactive`;
        return this.toolbox.getManager().doPatch(url);
    }

}