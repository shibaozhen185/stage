/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    url: function () {
        return this.api.launch_url + '/page/0';
    },

    sections: {
        header: {
            selector: '.headerBar',
            elements: {
                sidebarButton: 'i.sidebar-button'
            }
        },
        managerData: {
            selector: '.managerMenu',
            elements: {
                ip: 'span',
                version: 'span.managerVersion',
                statusIcon: 'i.signal',
                statusIconGreen: 'i.signal.green'
            }
        },
        tenants: {
            selector: '.tenantsMenu',
            elements: {
                tenantName: 'span span',
                tenantsDropdownMenu: '.menu',
                tenantsDropdownMenuItem: '.menu .item span'
            }
        },
        userMenu: {
            selector : '.usersMenu',
            elements: {
                userName: 'span:first-child',
                userDropdownMenu : '.menu',
                editModeMenuItem : '#editModeMenuItem',
                resetMenuItem : '#resetMenuItem',
                logoutMenuItem: '#logoutMenuItem'
            },
            props: {
                editModeLabel: 'Edit Mode',
                exitModeLabel: 'Exit Edit Mode'
            }
        },
        sidebar: {
            selector : '.sidebarContainer',
            elements: {
                lastPage: '.pages .item:last-child',
                lastPageRemoveButton : '.pages .item:last-child .pageRemoveButton'
            },
            props: {
                lastPageLabel: 'Page_0'
            }
        },
        editModeSidebar: {
            selector : '.editModeSidebar:not(.animating)',
            elements: {
                addWidgetButton: '.addWidgetBtn',
                addPageButton: 'button:nth-child(2)'
            },
        },
        page: {
            selector: '.page',
            elements: {
                firstWidget: '.react-grid-item.widget:first-child',
                firstWidgetName: '.react-grid-item.widget:first-child div.widgetItem > h5.header span',
                firstWidgetRemoveIcon: '.react-grid-item.widget:first-child .widgetEditButtons i.remove.link.icon.small',
                firstWidgetConfigureIcon: '.react-grid-item.widget:first-child .widgetEditButtons .editWidgetIcon',
                firstWidgetResizeHandle: '.react-grid-item.widget:first-child .react-resizable-handle',
                testWidgetContent: '.widget.testWidgetWidget .widgetContent .statistic .label'
            },
            props: {
                testWidgetLabel: 'DEPLOYMENTS'
            }
        },
        addWidgetModal: {
            selector: '.addWidgetModal',
            elements: {
                searchInput : 'input',
                installWidgetBtn: '#installWidgetBtn',
                testWidget: '.widgetsList .item[data-id="testWidget"]',
                removeWidgetButton: '.widgetsList .item[data-id="testWidget"] .removeWidgetButton',
                updateWidgetButton: '.widgetsList .item[data-id="testWidget"] .updateWidgetButton',
                closeIcon: '.close.icon'
            },
            commands: [{
                selectAndAddWidget: function(widgetId) {
                    this.clickElement('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .addWidgetCheckbox')
                        .waitForElementPresent('.item[data-id="'+widgetId+'"] .addWidgetCheckbox.checked.checkbox');

                    return this.clickElement('#addWidgetsBtn')
                        .waitForElementNotPresent('.addWidgetModal')
                        .waitForElementPresent('.react-grid-item.widget.' + widgetId + 'Widget');
                },

                uninstallWidget: function(widgetId) {
                    this.clickElement(`.widgetsList .item[data-id="${widgetId}"] .removeWidgetButton`);

                    return this.parent.section.removeWidgetConfirm
                        .waitForElementPresent('@okButton')
                        .clickElement('@okButton')
                        .waitForElementNotPresent('@okButton');
                },

                isWidgetInstalled: function(widgetId, callback) {
                    return this.isPresent('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .removeWidgetButton', callback);
                }
            }]
        },
        installWidgetModal : {
            selector: '.installWidgetModal',
            elements: {
                urlField: 'input[name="widgetUrl"]',
                fileField: 'input[name="widgetFile"]',
                okButton: '.ui.green.button',
                cancelButton: '.ui.basic.button',
                errorMessage: '.ui.error.message',
                loader: '.ui.loading'
            },
            props: {
                emptyFieldsError: 'Please select widget file or url',
                invalidURIError: 'Unable to determine filename from url test',
                bothFieldsError: 'Either widget file or url must be selected, not both',
                incorrectFilesError: 'The following files are required for widget registration: widget.js, widget.png',
                widgetAlreadyInstalledError: 'Widget testWidget is already installed'
            }
        },
        removeWidgetConfirm: {
            selector: '.removeWidgetConfirm',
            elements: {
                okButton: '.ui.primary.button',
                cancelButton: '.ui.button:not(.primary)',
                widgetIsUsedLabel: '.ui.basic.segment h5'
            },
            props: {
                widgetIsUsed: 'Widget is currently used by:'
            }
        },
        resetPagesConfirmModal: {
            selector: '.confirmModal',
            elements: {
                yesButton: '.ui.button.primary',
                noButton: '.ui.button'
            }
        },

    },

    commands: [{
        openSidebarMenu: function() {

        }
    }],

    elements: {
        tenantsDropdownText : 'div.tenantsMenu',
        statusesTitle: 'table.servicesData tr th',
        statusesName: 'table.servicesData tr td',
        statusesDesc : 'table.servicesData tr td div.sub.header',
        breadcrumb: '.breadcrumbLineHeight',
        pageTitle: '.pageTitle'
    }
};
