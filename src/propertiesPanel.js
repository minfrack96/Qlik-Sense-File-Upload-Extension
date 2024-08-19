/*
Copyright (C) 2024-2025 by Mohanned Ahmed
Licensed under MIT license, see LICENSE.md for details
*/

define(["./utils"], function (utils) {
    'use strict'

    return {
        type: "items",
        component: "accordion",
        items: {
            uploadSettings: {
                type: "items",
                label: "Upload Settings",
                items: {
                    uploadType: {
                        type: "string",
                        component: "radiobuttons",
                        label: "Content type",
                        ref: "props.contentType",
                        options: [{
                            value: "currApp",
                            label: "Current App"
                        }, {
                            value: "contentLibrary",
                            label: "Selected Content Library"
                        }],
                        defaultValue: "currApp",
                        show: function (data) {
                            return true;
                        }
                    },
                    reloadApp: {
                        type: "boolean",
                        label: "Reload app after upload",
                        ref: "props.reloadApp",
                        defaultValue: false,
                        show: function (data) {
                            return true;
                        }
                    },
                    contentLibrariesDropdown: {
                        type: "string",
                        component: "dropdown",
                        label: "Content Library",
                        ref: "props.contentLibraryId",
                        options: function () {
                            return utils.getContentLibraryList().then(function (contentLibraryList) {
                                return contentLibraryList;
                            })
                        },
                        defaultValue: "",
                        show: function (data) {
                            return data.props.contentType === "contentLibrary";
                        },
                    }
                }
            },
            settings: {
                uses: "settings",
                type: "items",
                items: {
                    customButtonLabel: {
                        type: "string",
                        label: "Custom button label",
                        ref: "props.readyButtonText",
                        defaultValue: "upload",
                        expression: "optional"
                    },
                }
            },
            about: { 
                label: "About",
                type: "items",
                items: {
                    appTitle: {
                        label: "File Upload",
                        component: "text"
                    },
                    manual: {
                        label: "Extension configuration & manual",
                        component: "link",
                        url: "https://github.com/MohannedA/Qlik-Sense-File-Upload-Extension" 
                    },
                    createdBy: {
                        label: "Created by Mohanned Ahmed",
                        component: "link",
                        url: "https://github.com/MohannedA"
                    },
                    license: {
                        label: "License: MIT",
                        component: "link",
                        url: "https://opensource.org/licenses/MIT"
                    }
                }
            }
        }
    }
})
