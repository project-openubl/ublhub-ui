const newCompanySchema = {
  fields: [
    {
      component: "sub-form",
      title: "Company",
      description: "A company contains all files like XMLs or CDRs",
      name: "details",
      fields: [
        {
          component: "text-field",
          name: "name",
          label: "Name",
          type: "text",
          isRequired: true,
          validate: [
            {
              type: "required",
            },
            {
              type: "min-length",
              threshold: 3,
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
          initialValue:
            "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService?wsdl",
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
          initialValue:
            "https://e-beta.sunat.gob.pe/ol-ti-itemision-guia-gem-beta/billService?wsdl",
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
          initialValue:
            "https://e-beta.sunat.gob.pe/ol-ti-itemision-otroscpe-gem-beta/billService?wsdl",
        },
      ],
    },
    {
      component: "sub-form",
      title: "SUNAT Credentials",
      name: "credentials",
      fields: [
        {
          component: "text-field",
          name: "credentials.username",
          label: "Username",
          type: "text",
          isRequired: true,
          validate: [
            {
              type: "required",
            },
            {
              type: "min-length",
              threshold: 3,
            },
          ],
          initialValue: "12345678912MODDATOS",
        },
        {
          component: "text-field",
          name: "credentials.password",
          label: "Password",
          type: "password",
          isRequired: true,
          validate: [
            {
              type: "required",
            },
            {
              type: "min-length",
              threshold: 3,
            },
          ],
          initialValue: "MODDATOS",
        },
      ],
    },
  ],
};

export default newCompanySchema;
