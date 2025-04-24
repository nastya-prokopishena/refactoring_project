// Added the fetchData function for GET routes
// Introduce Assertion- Adding more detailed error handling
async function fetchData(Model, attributes, where = {}) {
    try {
      const data = await Model.findAll({ attributes, where });
      if (!data.length && Object.keys(where).length) {
        throw new Error('Дані не знайдено');
      }
      return { status: 200, body: data };
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        throw new Error('Помилка бази даних');
      }
      return { status: 500, body: { error: error.message } };
    }
  }
  
  module.exports = fetchData;