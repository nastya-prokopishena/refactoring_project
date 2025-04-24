// Функція для заповнення select елементів даними і уникнення дублювання коду
function populateSelectFromData(selectId, data) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';

  data.forEach(item => {
    const option = document.createElement('option');

    if (selectId === 'faculty_name') {
      option.value = item.faculty_id;
    } else if (selectId === 'specialty_name') {
      option.value = item.specialty_id;
    } else {
      option.value = item.benefit_id;
    }

    option.textContent = item.name;
    select.appendChild(option);
  });
}

function fetchDataAndPopulateSelect(url, selectId) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        populateSelectFromData(selectId, data);
      } else {
        console.error('Data is not an array:', data);
      }
    })
    .catch(error => console.error('Fetch error:', error));
}

function fetchSpecialtiesByFacultyId(facultyId) {
  fetch(`/fetch-select-data/specialties/${facultyId}`)
    .then(response => response.json())
    .then(data => {
      populateSelectFromData('specialty_name', data);
    })
    .catch(error => console.error('Fetch error:', error));
}

fetchDataAndPopulateSelect('/fetch-select-data/faculties', 'faculty_name');
fetchDataAndPopulateSelect('/fetch-select-data/benefits', 'benefit_name');

const facultySelect = document.getElementById('faculty_name');
facultySelect.addEventListener('change', event => {
  const selectedFacultyId = event.target.value;
  fetchSpecialtiesByFacultyId(selectedFacultyId);
});