import { useEffect, useState } from "react";

import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import entryService from "./services/entryService";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  const handleSuccessNotification = (status, msg) => {
    setNotification({ status, msg });
    setShowMsg(true);
  };

  const handleShowMsgTimeout = () => {
    const timeoutRef = setTimeout(() => {
      setShowMsg(false);
      clearTimeout(timeoutRef);
    }, 3000);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const existingPerson = persons.find((person) => person.name === newName);

      if (!existingPerson) {
        const newPerson = await entryService.createPerson({
          name: newName,
          number: newNumber,
        });

        setPersons((prevPersons) => [...prevPersons, newPerson]);
        handleSuccessNotification(
          "success",
          `You added ${newName} to the Phonebook!`
        );
      } else {
        const confirmUpdate = window.confirm(
          `${newName} is already added, do you want to replace the old number with a new one?`
        );

        if (confirmUpdate) {
          const updatedPerson = await entryService.updatePerson(
            existingPerson._id,
            {
              ...existingPerson,
              number: newNumber,
            }
          );

          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person._id !== existingPerson._id ? person : updatedPerson
            )
          );

          handleSuccessNotification(
            "success",
            `You edited ${newName}'s number in the Phonebook!`
          );
        }
      }

      setNewName("");
      setNewNumber("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification({ status: "error", msg: `Error: ${error.message}` });
      setShowMsg(true);
    }
  };

  const deletePerson = async (personName) => {
    const personToDelete = persons.find((person) => person.name === personName);

    if (window.confirm(`Are you sure you want to delete ${personName}?`)) {
      try {
        await entryService.deletePerson(personToDelete._id, personToDelete);

        setPersons((prevPersons) =>
          prevPersons.filter((person) => person._id !== personToDelete._id)
        );

        handleSuccessNotification(
          "success",
          `You deleted ${personToDelete.name} in the Phonebook!`
        );
      } catch (error) {
        console.error("Error deleting person:", error);
        setNotification({ status: "error", msg: `Error: ${error.message}` });
        setShowMsg(true);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await entryService.getAll();
        setPersons(data || []); // Ensure that data is an array, if not, default to an empty array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showMsg) {
      handleShowMsgTimeout();
    }
  }, [showMsg]);

  return (
    <div>
      <h2>Phonebook</h2>
      {showMsg && (
        <Notification status={notification.status} message={notification.msg} />
      )}
      <Filter search={search} persons={persons} setSearch={setSearch} />
      <h3>Add new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        submitForm={submitForm}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
