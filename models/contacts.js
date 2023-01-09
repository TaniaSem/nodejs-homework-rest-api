const { Contact } = require("../db/contactModel");

const listContacts = async () => {
  try {
    const contacts = await Contact.find({});
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const foundContact = Contact.findById(contactId);
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
    const deletedContact = Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async ({ name, email, phone, favorite }) => {
  try {
    const newContact = new Contact({ name, email, phone, favorite });
    await newContact.save();
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contactToUpdate = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return contactToUpdate;
  } catch (error) {
    console.log(error);
  }
};

const updateContactStatus = async (contactId, favorite) => {
  try {
    const updateStatus = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {
        new: true,
      }
    );
    return updateStatus;
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
  updateContactStatus,
};
