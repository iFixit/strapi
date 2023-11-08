'use strict';

const { yup, validateYupSchema } = require('@strapi/utils');

const fileInfoSchema = yup
  .object({
    name: yup.string().nullable(),
    alternativeText: yup.string().nullable(),
    focalPoint: yup.object({ x: yup.number(), y: yup.number() }).nullable().default(null),
    caption: yup.string().nullable(),
  })
  .noUnknown();

const uploadSchema = yup.object({
  fileInfo: fileInfoSchema,
});

const multiUploadSchema = yup.object({
  fileInfo: yup.array().of(fileInfoSchema),
});

const validateUploadBody = (data = {}, isMulti = false) => {
  const schema = isMulti ? multiUploadSchema : uploadSchema;

  return validateYupSchema(schema, { strict: false })(data);
};

module.exports = validateUploadBody;
