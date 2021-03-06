/**
 * Created by pposel on 07/06/2017.
 */

module.exports = {
    before(client) {
        client.login()
            .resetPages()
            .moveToEditMode()
            .addPage();

        var page = client.page.page();

        page.section.editModeSidebar
            .clickElement('@addWidgetButton');

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled('testWidget', result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal
                          .clickElement('@removeWidgetButton');

                    client.page.page().section.removeWidgetConfirm
                          .clickElement('@okButton')
                          .waitForElementNotPresent('@okButton');
                }
            });
    },

    'Validate install fields': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .clickElement('@installWidgetBtn');

        page.section.installWidgetModal
            .clickElement('@okButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.emptyFieldsError)

        page.section.installWidgetModal
            .setElementValue('@urlField', 'test')
            .clickElement('@okButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.invalidURIError)

        page.section.installWidgetModal
            .setElementValue('@fileField', client.page.resources().props.blankFile(client.globals))
            .clickElement('@okButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.bothFieldsError);

        page.section.installWidgetModal
            .resetValue('@urlField')
            .clickElement('@okButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.incorrectFilesError);

        page.section.installWidgetModal
            .clickElement('@cancelButton')
            .waitForElementNotPresent('@okButton');
    },

    'Install widget': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .clickElement('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setElementValue('@fileField', client.page.resources().props.testWidget(client.globals))
            .clickElement('@okButton')
            .waitForElementNotPresent('@okButton');
    },

    'Check widget removing': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .waitForElementPresent('@testWidget')
            .clickElement('@removeWidgetButton');

        page.section.removeWidgetConfirm
            .waitForElementPresent('@okButton')
            .assert.elementNotPresent('@widgetIsUsedLabel')
            .clickElement('@cancelButton')
            .waitForElementNotPresent('@okButton');
    },

    'Add installed widget': function (client) {
        var page = client.page.page();

        page.section.page
            .addWidget('testWidget')
            .waitForElementPresent('@testWidgetContent')
            .assert.containsText('@testWidgetContent', page.section.page.props.testWidgetLabel);
    },

    'Widget already installed': function (client) {
        var page = client.page.page();

        page.section.editModeSidebar
            .clickElement('@addWidgetButton');

        page.section.addWidgetModal
            .clickElement('@installWidgetBtn')

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setElementValue('@fileField', client.page.resources().props.testWidget(client.globals))
            .clickElement('@okButton')
            .waitForElementNotPresent('@loader')
            .waitForElementPresent('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.widgetAlreadyInstalledError)
            .clickElement('@cancelButton')
            .waitForElementNotPresent('@okButton');
    },

    'Remove widget': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .clickElement('@removeWidgetButton');

        page.section.removeWidgetConfirm
            .waitForElementPresent('@okButton')
            .assert.containsText('@widgetIsUsedLabel', page.section.removeWidgetConfirm.props.widgetIsUsed)
            .clickElement('@okButton')
            .waitForElementNotPresent('@okButton')
        page.section.addWidgetModal
            .waitForElementNotPresent('@removeWidgetButton');
    },

    after(client) {
        client.end();
    }
};