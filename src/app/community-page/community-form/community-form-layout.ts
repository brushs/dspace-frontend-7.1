const StandardLanguageCodes = [{
    display: "fosrc.item.edit.dynamic-field.values.1.gc_languages",
    code: "en"
}, {
    display: "fosrc.item.edit.dynamic-field.values.2.gc_languages",
    code: "fr"
}];

export const CommunityFormLayout = {
    rows: [{
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.title",
            mandatory: true,
            mandatoryMessage: "community.form.errors.title.required",
            repeatable: false,
            hints: "community.form.hints.title.hint",
            style: "col-sm-12",
            selectableMetadata: [{
                "metadata": "dc.title",
                "label": null,
                "closed": true
            }],
            "languageCodes": StandardLanguageCodes,
            "typeBind": []
        }]
    }, {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.titletranslation",
            mandatory: true,
            mandatoryMessage: "community.form.errors.titletranslation.required",
            repeatable: false,
            hints: "community.form.hints.titletranslation.hint",
            style: "col-sm-12",
            selectableMetadata: [{
                metadata: "dc.title.fosrctranslation",
                label: null,
                closed: false
            }],
            "languageCodes": StandardLanguageCodes,
            "typeBind": []
        }]
    }, {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.alternative-names",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.alternative-names.hint",
            style: "col-sm-12",
            selectableMetadata: [{
                metadata: "dc.title.alternative",
                label: null,
                closed: false
            }],
            "languageCodes": StandardLanguageCodes,
            "typeBind": []
        }]
    }, {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.alternative-names-translation",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.alternative-names-translation.hint",
            selectableMetadata: [{
                metadata: "dc.title.alternative-fosrctranslation",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    }, {
        fields: [{
            input: {
                "type": "onebox"
            },
            label: "community.form.identifiers",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.identifiers.hint",
            selectableMetadata: [{
                metadata: "dc.identifier",
                label: null,
                closed: false
            }],
            "languageCodes": StandardLanguageCodes,
            "typeBind": []
        }]
    }, {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.researcharea",
            mandatory: true,
            mandatoryMessage: "community.form.errors.researcharea.required",
            repeatable: false,
            hints: "community.form.hints.researcharea.hint",
            selectableMetadata: [{
                metadata: "dc.subject",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    }, {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.researcharea-fosrctranslation",
            mandatory: true,
            mandatoryMessage: "community.form.errors.researcharea-fosrctranslation.required",
            repeatable: false,
            hints: "community.form.hints.researcharea-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: 'dc.subject.fosrctranslation',
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    }, {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.homepage-link",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.homepage-link.hint",
            selectableMetadata: [{
                metadata: "dc.identifier.uri-home-page",
                label: null,
                closed: false
            }],
            languageCodes: [],
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.homepage-link-fosrctranslation",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.homepage-link-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.identifier.uri-home-page-fosrctranslation",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                type: "onebox"
            },
            label: "community.form.email-address",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.email-address.hint",
            selectableMetadata: [{
                metadata: "dc.description.email-address",
                label: null,
                closed: false
            }],
            languageCodes: [],
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                type: "textarea"
            },
            label: "community.form.abstract",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.abstract.hint",
            selectableMetadata: [{
                metadata: "dc.description.abstract",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                type: "textarea"
            },
            label: "community.form.abstracttranslation",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.abstracttranslation.hint",
            selectableMetadata: [{
                metadata: "dc.description.abstract-fosrctranslation",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                type: "textarea"
            },
            label: "community.form.description",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.description.hint",
            selectableMetadata: [{
                metadata: "dc.description",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                "type": "textarea"
            },
            label: "community.form.description-fosrctranslation",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.description-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.description.fosrctranslation",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                "type": "textarea"
            },
            label: "community.form.contact-address",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.contact-address.hint",
            selectableMetadata: [{
                metadata: "dc.description.contact-address",
                label: null,
                closed: false
            }],
            languageCodes: [],
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                "type": "textarea"
            },
            label: "community.form.tableofcontents",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.tableofcontents.hint",
            selectableMetadata: [{
                metadata: "dc.description.tableofcontents",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                "type": "textarea"
            },
            label: "community.form.tableofcontentsTranslation",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.tableofcontentsTranslation.hint",
            selectableMetadata: [{
                metadata: "dc.description.tableofcontents-fosrctranslation",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                "type": "textarea"
            },
            label: "community.form.rights",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.rights.hint",
            selectableMetadata: [{
                metadata: "dc.rights",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    {
        fields: [{
            input: {
                "type": "textarea"
            },
            label: "community.form.rights-fosrctranslation",
            mandatory: false,
            repeatable: false,
            hints: "community.form.hints.rights-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.rights.fosrctranslation",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    ],
    "type": "community",
    // "_links": {
    //     "self": {
    //         "href": "https://www.dev.ospr.link/server/api/config/submissionforms/BibliographicMetadata"
    //     }
    // }
}
