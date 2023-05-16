const StandardLanguageCodes = [{
    display: "fosrc.item.edit.dynamic-field.values.1.gc_languages",
    code: "en"
}, {
    display: "fosrc.item.edit.dynamic-field.values.2.gc_languages",
    code: "fr"
}];

export const CollectionFormLayout = {
    rows: [{
        fields: [{
            input: {
                type: "onebox"
            },
            label: "collection.form.title",
            mandatory: true,
            mandatoryMessage: "collection.form.errors.title.required",
            repeatable: false,
            hints: "collection.hints.form.title.hint",
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
            label: "collection.form.translatedTitle",
            mandatory: true,
            mandatoryMessage: "collection.form.errors.translatedTitle.required",
            repeatable: false,
            hints: "collection.form.hints.translatedTitle.hint",
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
            label: "collection.form.subject",
            mandatory: true,
            repeatable: false,
            mandatoryMessage: "collection.form.errors.subject.required",
            hints: "collection.form.hints.subject.hint",
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
                "type": "onebox"
            },
            label: "collection.form.subject-fosrctranslation",
            mandatory: true,
            mandatoryMessage: "collection.form.errors.subject-fosrctranslation.required",
            repeatable: false,
            hints: "collection.form.hints.subject-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.subject.fosrctranslation",
                label: null,
                closed: false
            }],
            "languageCodes": StandardLanguageCodes,
            "typeBind": []
        }]
    }, {
        fields: [{
            input: {
                type: "textarea"
            },
            label: "collection.form.description",
            mandatory: false,
            mandatoryMessage: "collection.form.errors.description.required",
            repeatable: false,
            hints: "collection.form.hints.description.hint",
            selectableMetadata: [{
                metadata: "dc.description",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    }, {
        fields: [{
            input: {
                type: "textarea"
            },
            label: "collection.form.description-fosrctranslation",
            mandatory: false,
            mandatoryMessage: "collection.form.errors.description-fosrctranslation.required",
            repeatable: false,
            hints: "collection.form.hints.description-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.description.fosrctranslation",
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
            label: "collection.form.email-address",
            mandatory: false,
            repeatable: false,
            hints: "collection.form.hints.email-address",
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
            label: "collection.form.rights",
            mandatory: false,
            repeatable: false,
            hints: "collection.form.hints.rights.hint",
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
                type: "textarea"
            },
            label: "collection.form.rights-fosrctranslation",
            mandatory: false,
            repeatable: false,
            hints: "collection.form.hints.rights-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.rights.fosrctranslation",
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
            label: "collection.form.license",
            mandatory: false,
            repeatable: false,
            hints: "collection.form.hints.license.hint",
            selectableMetadata: [{
                metadata: "dc.rights.license",
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
            label: "collection.form.license-fosrctranslation",
            mandatory: false,
            repeatable: false,
            hints: "collection.form.hints.license-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.rights.license-lang",
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
            label: "collection.form.provenance",
            mandatory: false,
            repeatable: false,
            hints: "collection.form.hints.provenance.hint",
            selectableMetadata: [{
                metadata: "dc.description.provenance",
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
            label: "collection.form.provenance-fosrctranslation",
            mandatory: false,
            repeatable: false,
            hints: "collection.form.hints.provenance-fosrctranslation.hint",
            selectableMetadata: [{
                metadata: "dc.description.provenance-fosrctranslation",
                label: null,
                closed: false
            }],
            languageCodes: StandardLanguageCodes,
            typeBind: []
        }]
    },
    ],
    "type": "collection",
    // "_links": {
    //     "self": {
    //         "href": "https://www.dev.ospr.link/server/api/config/submissionforms/BibliographicMetadata"
    //     }
    // }
}

