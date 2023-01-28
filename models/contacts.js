const {Contact} = require('../db/contactModel');

const listContacts = async (id, skip, limit) => {
  try {
    const contacts = await Contact.find({owner: id}, '', {
      skip,
      limit,
    });
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId, id) => {
  try {
    const contacts = await Contact.find({owner: id});
    const foundContact = contacts.filter(
        (contact) => contact._id === contactId,
    );
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

const addContact = async ({name, email, phone, owner, favorite}) => {
  try {
    const newContact = new Contact({name, email, phone, owner, favorite});
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
        {favorite},
        {
          new: true,
        },
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
