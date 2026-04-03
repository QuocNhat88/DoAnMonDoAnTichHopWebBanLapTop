const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

module.exports = { updateProfileSchema };
