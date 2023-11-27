import axios from "axios";

const baseUrl = "/api/persons";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    // Handle error, e.g., log it or throw a specific error
    console.error("Error fetching data:", error);
    throw error;
  }
};

const createPerson = async (newObject) => {
  try {
    const response = await axios.post(baseUrl, newObject);
    return response.data;
  } catch (error) {
    console.error("Error creating person:", error);
    throw error;
  }
};

const updatePerson = async (id, newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject);
    return response.data;
  } catch (error) {
    console.error(`Error updating person with id ${id}:`, error);
    throw error;
  }
};

const deletePerson = async (id, obj) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, { data: obj });
    return response.data;
  } catch (error) {
    console.error(`Error deleting person with id ${id}:`, error);
    throw error;
  }
};

const entryService = {
  getAll,
  createPerson,
  updatePerson,
  deletePerson,
};

export default entryService;
