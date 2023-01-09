const express = require("express");
const contacts = require("../../models/contacts");
const Joi = require("joi");

const contactCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).min(1);
const contactUpdateStatusSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).min(1);

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contactsList = await contacts.listContacts();

  res.json({
    status: "success",
    code: 200,
    data: { contactsList },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    status: "success",
    code: 200,
    data: { contact },
  });
});

router.post("/", async (req, res, next) => {
  const { error } = contactCreateSchema.validate(req.body);
  const { name, email, phone, favorite = false } = req.body;

  if (error) {
    return res.status(400).json({ message: "missing required name field" });
  }
  const body = {
    name,
    email,
    phone,
    favorite,
  };
  const newContact = await contacts.addContact(body);
  res.status(201).json({
    status: "success",
    code: 201,
    data: { newContact },
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await contacts.removeContact(contactId);
  if (!deletedContact) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact delete" });
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = contactUpdateSchema.validate(req.body);
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const body = {
    name,
    email,
    phone,
  };
  if (error) {
    return res.status(400).json({ message: "missing fields" });
  }
  const updatedContact = await contacts.updateContact(contactId, body);
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    status: "success",
    code: 200,
    data: { updatedContact },
  });
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = contactUpdateStatusSchema.validate(req.body);
  const { favorite: body } = req.body;

  if (error) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const updatedStatus = await contacts.updateStatusContact(contactId, body);
  if (!updatedStatus) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    status: "success",
    code: 200,
    data: { updatedStatus },
  });
});

module.exports = router;
