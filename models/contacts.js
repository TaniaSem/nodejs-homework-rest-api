const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.resolve("models/contacts.json");

const listContacts = async () => {
  try {
    const res = await fs.readFile(contactsPath);
    const contacts = JSON.parse(res);
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const foundContact = contacts.find((contact) => contactId === contact.id);
    if (!foundContact) {
      return null;
    }
    return foundContact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const deletedContactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (deletedContactIndex === -1) {
      return null;
    }
    const deletedContact = contacts.splice(deletedContactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await listContacts();
    const id = contacts.length + 1;
    const newContact = {
      id: `${id}`,
      name,
      email,
      phone: `${phone}`,
    };
    const newContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const [contactToUpdate] = await removeContact(contactId);
    if (body.name) {
      contactToUpdate.name = body.name;
    }
    if (body.email) {
      contactToUpdate.email = body.email;
    }
    if (body.phone) {
      contactToUpdate.phone = body.phone;
    }
    const contacts = await listContacts();
    const newContacts = [...contacts, contactToUpdate];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contactToUpdate;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
