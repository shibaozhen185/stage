/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }
    doUpdate(id) {
        var url = `/vnf_query?action=update&log_id${id}&status=done`;
        return this.toolbox.getManager().doGet(url);
    }

}