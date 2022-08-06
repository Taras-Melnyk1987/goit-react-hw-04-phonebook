import { useState } from 'react';
import { useLocalStorage } from '../hooks/hooks';
import PropTypes from 'prop-types';
import { AppSyles, AppTitle } from './App.styled';
import toast, { Toaster } from 'react-hot-toast';
import { nanoid } from 'nanoid';
import AppForm from './Form/Form';
import Section from './Section/Section';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';

const App = ({ title }) => {
  const [contacts, setContacts] = useLocalStorage('contacts', []);
  const [filter, setFilter] = useState('');

  const checkUniqueName = newName => {
    const normalyzeName = newName.toLocaleLowerCase();
    return contacts.find(
      ({ name }) => name.toLocaleLowerCase() === normalyzeName
    );
  };

  const numberFormatting = number => {
    const array = [...number];
    for (let i = 3; i < array.length - 1; i += 3) {
      array.splice(i, 0, '-');
    }
    console.log();
    return array.join('');
  };

  const addContact = formValues => {
    const { name, number } = formValues;
    const newName = checkUniqueName(name);
    const formatedNumber = numberFormatting(number);

    if (newName) {
      toast.error(`Name ${name} is already in contacts`);
      return;
    }

    const contact = {
      id: nanoid(),
      name,
      number: formatedNumber,
    };
    console.log(contact);
    setContacts(prevContacts => [contact, ...prevContacts]);
    toast.success(`${name} was added to contacts!`);
  };

  const handleDeleteContact = async itemId => {
    const item = contacts.find(({ id }) => id === itemId);

    Promise.resolve(
      setContacts(prevContacts =>
        prevContacts.filter(contact => contact.id !== itemId)
      )
    ).then(toast.success(`Contact ${item.name} was deleted!`));
  };

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  function showfilteredContacts() {
    const normalizedFilter = filter.toLocaleLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  }

  const resetFilter = () => {
    setFilter('');
  };

  return (
    <AppSyles>
      <AppTitle>{title}</AppTitle>
      <Section>
        <AppForm getSubmitData={addContact} />
      </Section>

      <Section title="Contacts">
        {contacts.length > 0 ? (
          <>
            <Filter
              value={filter}
              onChange={handleFilterChange}
              onClick={resetFilter}
            />
            <ContactList
              contacts={showfilteredContacts()}
              onClick={handleDeleteContact}
            />
          </>
        ) : (
          <p>You haven't any contacts yet!</p>
        )}
      </Section>
      <Toaster />
    </AppSyles>
  );
};

App.propTypes = {
  title: PropTypes.string.isRequired,
};

export default App;
