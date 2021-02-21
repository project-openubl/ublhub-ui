const detailsCompanySchema = {
  fields: [
    {
      component: "sub-form",
      title: "Company",
      name: "details",
      fields: [
        {
          component: "text-field",
          name: "name",
          label: "Name",
          type: "text",
          isRequired: true,
          isDisabled: true,
          validate: [
            {
              type: "required",
            },
            {
              type: "min-length",
              threshold: 3,
            },
            {
              type: "pattern",
              pattern: "[a-z0-9]([-a-z0-9]*[a-z0-9])?",
              message:
                "Label must consist of lower case alphanumeric characters or '-', and must start and end with an alphanumeric character (e.g. 'my-name', or '123-abc', regex used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?')",
            },
          ],
        },
        {
          component: "textarea",
          name: "description",
          label: "Description",
          type: "text",
          isRequired: false,
          validate: [
            {
              type: "max-length",
              threshold: 250,
            },
          ],
        },
      ],
    },
    {
      component: "sub-form",
      title: "SUNAT Web services",
      name: "webServices",
      fields: [
        {
          component: "text-field",
          name: "webServices.factura",
          label: "Factura",
          type: "text",
          isRequired: true,
          validate: [
            {
              type: "required",
            },
            {
              type: "min-length",
              threshold: 1,
            },
            {
              type: "url",
            },
          ],
        },
        {
          component: "text-field",
          name: "webServices.guia",
          label: "Guía",
          type: "text",
          isRequired: true,
          validate: [
            {
              type: "required",
            },
            {
              type: "min-length",
              threshold: 1,
            },
            {
              type: "url",
            },
          ],
        },
        {
          component: "text-field",
          name: "webServices.retenciones",
          label: "Retenciones",
          type: "text",
          isRequired: true,
          validate: [
            {
              type: "required",
            },
            {
              type: "min-length",
              threshold: 1,
            },
            {
              type: "url",
            },
          ],
        },
      ],
    },
  ],
};

export default detailsCompanySchema;
