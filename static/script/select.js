function fetchSpecialtiesByFacultyId(facultyId) {
    fetch(`/fetch-select-data/specialties/${facultyId}`)
      .then(response => response.json())
      .then(data => {
        const specialtySelect = document.getElementById('specialty_name');
        specialtySelect.innerHTML = '';

        data.forEach(specialty => {
          const option = document.createElement('option');
          option.value = specialty.specialty_id; // Використовуємо specialty_id для specialty
          option.textContent = specialty.name; // Відображаємо name для користувача
          specialtySelect.appendChild(option);
        });
      })
      .catch(error => console.error('Fetch error:', error));
  }

  function fetchDataAndPopulateSelect(url, selectId) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById(selectId);
        select.innerHTML = '';

        if (Array.isArray(data)) {
          data.forEach(item => {
            const option = document.createElement('option');
            if (selectId === 'faculty_name') {
              option.value = item.faculty_id; // Використовуємо faculty_id для faculty
            } else if (selectId === 'specialty_name') {
              option.value = item.specialty_id; // Використовуємо specialty_id для specialty
            } else {
              option.value = item.benefit_id; // Використовуємо benefit_id для benefit
            }
            option.textContent = item.name; // Відображаємо name для користувача
            select.appendChild(option);
          });
        } else {
          console.error('Data is not an array:', data);
        }
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

