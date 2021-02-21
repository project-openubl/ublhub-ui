const detailsCompanySchema = {
  fields: [
    {
      component: "text-field",
      name: "username",
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
    },
    {
      component: "text-field",
      name: "password",
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
    },
  ],
};

export default detailsCompanySchema;
