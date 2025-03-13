document.addEventListener('DOMContentLoaded', () => {
    // Bottom Navigation Bar Functionality
    const navMeasurements = document.getElementById('nav-measurements');
    const navStored = document.getElementById('nav-stored');
    const navSearch = document.getElementById('nav-search');
    const measurementForm = document.getElementById('measurementForm');
    const editMeasurementForm = document.getElementById('editMeasurementForm');
    const measurementsListSection = document.querySelector('.measurements-list');
    const storedSection = document.querySelector('.stored-section');
    
    const searchSection = document.getElementById('searchSection');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    
    // Navigation event listeners
    navMeasurements.addEventListener('click', () => {
        navMeasurements.classList.add('active');
        navStored.classList.remove('active');
        navSearch.classList.remove('active');
        measurementForm.style.display = 'block';
        editMeasurementForm.style.display = 'none';
        storedSection.style.display = 'none';
        searchSection.style.display = 'none';
        measurementsListSection.style.display = 'none';
    });

    navStored.addEventListener('click', () => {
        navMeasurements.classList.remove('active');
        navStored.classList.add('active');
        navSearch.classList.remove('active');
        measurementForm.style.display = 'none';
        editMeasurementForm.style.display = 'none';
        storedSection.style.display = 'block';
        searchSection.style.display = 'none';
        measurementsListSection.style.display = 'block';
    });
    
    navSearch.addEventListener('click', () => {
        navMeasurements.classList.remove('active');
        navStored.classList.remove('active');
        navSearch.classList.add('active');
        measurementForm.style.display = 'none';
        editMeasurementForm.style.display = 'none';
        storedSection.style.display = 'none';
        searchSection.style.display = 'block';
        measurementsListSection.style.display = 'none';
    });
    
    // Cancel edit button event listener
    cancelEditBtn.addEventListener('click', () => {
        editMeasurementForm.style.display = 'none';
        // Show the appropriate section based on which nav item is active
        if (navMeasurements.classList.contains('active')) {
            measurementForm.style.display = 'block';
        } else if (navStored.classList.contains('active')) {
            storedSection.style.display = 'block';
            measurementsListSection.style.display = 'block';
        } else if (navSearch.classList.contains('active')) {
            searchSection.style.display = 'block';
        }
    });
    
    // Search functionality
    // Real-time search as user types
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        const filteredMeasurements = measurements.filter(m => 
            m.clientName.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(filteredMeasurements);
    });
    
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }
        
        results.forEach(measurement => {
            const resultCard = document.createElement('div');
            resultCard.className = 'measurement-item';
            
            let specificMeasurements = '';
            if (measurement.type === 'salvar') {
                specificMeasurements = `
                    <p>Salvar Length: ${measurement.salvarLength}</p>
                    <p>Salvar Mori: ${measurement.salvarMori}</p>
                `;
            } else if (measurement.type === 'pant') {
                specificMeasurements = `
                    <p>Pant Length: ${measurement.pantLength}</p>
                    <p>Pant Khistak: ${measurement.pantKhistak}</p>
                    <p>Pant Hip: ${measurement.pantHip}</p>
                    <p>West: ${measurement.west}</p>
                    <p>Pant Mori: ${measurement.pantMori}</p>
                    <p>Knee: ${measurement.knee}</p>
                    <p>Thai: ${measurement.thai}</p>
                `;
            }
            
            resultCard.innerHTML = `
                <div class="measurement-info">
                    <h3>${measurement.clientName}</h3>
                    <p>Date: ${measurement.date}</p>
                    <p>Type: ${measurement.type}</p>
                    <p>Length: ${measurement.length}</p>
                    <p>Chest: ${measurement.chest}</p>
                    <p>West: ${measurement.west}</p>
                    <p>Hip: ${measurement.hip}</p>
                    <p>Shoulder: ${measurement.shoulder}</p>
                    <p>Slive: ${measurement.slive}</p>
                    <p>Slive Mori: ${measurement.sliveMori}</p>
                    ${specificMeasurements}
                </div>
                <div class="search-result-actions">
                    <button class="edit-btn btn btn-primary" style="margin-top: 12px;" data-id="${measurement.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn btn btn-danger" data-id="${measurement.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;
            
            searchResults.appendChild(resultCard);
            
            // Add edit functionality
            const editBtn = resultCard.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const id = parseInt(editBtn.getAttribute('data-id'));
                editMeasurement(id);
            });
            
            // Add delete functionality
            const deleteBtn = resultCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = parseInt(deleteBtn.getAttribute('data-id'));
                deleteMeasurement(id);
                // Refresh search results
                const searchTerm = searchInput.value.toLowerCase();
                const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
                const filteredMeasurements = measurements.filter(m => 
                    m.clientName.toLowerCase().includes(searchTerm)
                );
                displaySearchResults(filteredMeasurements);
            });
        });
    }
    
    // Search button functionality
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        
        const results = measurements.filter(measurement => 
            measurement.clientName.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(results);
    });
    
    // Function to view full measurement details
    function viewMeasurementDetails(measurement) {
        const detailsContainer = document.getElementById('measurementDetails');
        detailsContainer.style.display = 'block';
        
        let specificMeasurements = '';
        if (measurement.type === 'salvar') {
            specificMeasurements = `
                <p><strong>Salvar Length:</strong> ${measurement.salvarLength}</p>
                <p><strong>Salvar Mori:</strong> ${measurement.salvarMori}</p>
            `;
        } else if (measurement.type === 'pant') {
            specificMeasurements = `
                <p><strong>Pant Length:</strong> ${measurement.pantLength}</p>
                <p><strong>Pant Khistak:</strong> ${measurement.pantKhistak}</p>
                <p><strong>Pant Hip:</strong> ${measurement.pantHip}</p>
                <p><strong>West:</strong> ${measurement.west}</p>
                <p><strong>Pant Mori:</strong> ${measurement.pantMori}</p>
                <p><strong>Knee:</strong> ${measurement.knee}</p>
                <p><strong>Thai:</strong> ${measurement.thai}</p>  
            `;
        }
        
        detailsContainer.innerHTML = `
            <div class="measurement-detail-card">
                <h3>${measurement.clientName} - Full Details</h3>
                <p><strong>Date:</strong> ${measurement.date}</p>
                <p><strong>Type:</strong> ${measurement.type}</p>
                <p><strong>Length:</strong> ${measurement.length}</p>
                <p><strong>Chest:</strong> ${measurement.chest}</p>
                <p><strong>West:</strong> ${measurement.west}</p>
                <p><strong>Hip:</strong> ${measurement.hip}</p>
                <p><strong>Shoulder:</strong> ${measurement.shoulder}</p>
                <p><strong>Slive:</strong> ${measurement.slive}</p>
                <p><strong>Slive Mori:</strong> ${measurement.sliveMori}</p>
                ${specificMeasurements}
                <button class="btn btn-secondary back-btn">Back to Results</button>
            </div>
        `;
        
        // Hide search results when showing details
        document.getElementById('searchResults').style.display = 'none';
        
        // Add back button functionality
        detailsContainer.querySelector('.back-btn').addEventListener('click', () => {
            detailsContainer.style.display = 'none';
            document.getElementById('searchResults').style.display = 'block';
        });
    }
    
    const form = document.getElementById('measurementForm');
    const typeSelect = document.getElementById('type');
    const salvarFields = document.getElementById('salvarFields');
    const pantFields = document.getElementById('pantFields');
    const measurementsList = document.getElementById('measurementsList');
    
    // Edit form elements
    const editForm = document.getElementById('editMeasurementForm');
    const editTypeSelect = document.getElementById('editType');
    const editSalvarFields = document.getElementById('editSalvarFields');
    const editPantFields = document.getElementById('editPantFields');

    // Load existing measurements
    loadMeasurements();

    // Handle type selection change
    typeSelect.addEventListener('change', () => {
        const selectedType = typeSelect.value;
        salvarFields.style.display = selectedType === 'salvar' ? 'block' : 'none';
        pantFields.style.display = selectedType === 'pant' ? 'block' : 'none';

        // Update required attributes based on selection
        const salvarInputs = salvarFields.querySelectorAll('input');
        const pantInputs = pantFields.querySelectorAll('input');

        salvarInputs.forEach(input => input.required = selectedType === 'salvar');
        pantInputs.forEach(input => input.required = selectedType === 'pant');
    });
    
    // Handle edit type selection change
    editTypeSelect.addEventListener('change', () => {
        const selectedType = editTypeSelect.value;
        editSalvarFields.style.display = selectedType === 'salvar' ? 'block' : 'none';
        editPantFields.style.display = selectedType === 'pant' ? 'block' : 'none';

        // Update required attributes based on selection
        const salvarInputs = editSalvarFields.querySelectorAll('input');
        const pantInputs = editPantFields.querySelectorAll('input');

        salvarInputs.forEach(input => input.required = selectedType === 'salvar');
        pantInputs.forEach(input => input.required = selectedType === 'pant');
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const measurementData = {
            id: Date.now(),
            clientName: formData.get('clientName'),
            date: formData.get('date'),
            length: formData.get('length') || '',
            chest: formData.get('chest') || '',
            west: formData.get('west') || '',
            hip: formData.get('hip') || '',
            shoulder: formData.get('shoulder') || '',
            slive: formData.get('slive') || '',
            sliveMori: formData.get('sliveMori') || '',
            type: formData.get('type')
        };

        // Add type-specific measurements
        if (measurementData.type === 'salvar') {
            measurementData.salvarLength = formData.get('salvarLength') || '';
            measurementData.salvarMori = formData.get('salvarMori') || '';
        } else if (measurementData.type === 'pant') {
            measurementData.pantLength = formData.get('pantLength') || '';
            measurementData.pantKhistak = formData.get('pantKhistak') || '';
            measurementData.pantHip = formData.get('pantHip') || '';
            measurementData.west = formData.get('west') || '';
            measurementData.pantMori = formData.get('pantMori') || '';
            measurementData.knee = formData.get('knee') || '';
            measurementData.thai = formData.get('thai') || '';
        }

        // Save to local storage
        saveMeasurement(measurementData);

        // Reset form and reload measurements
        form.reset();
        salvarFields.style.display = 'none';
        pantFields.style.display = 'none';
        loadMeasurements();
    });
    
    // Handle edit form submission
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const formData = new FormData(editForm);
        const measurementId = parseInt(formData.get('editMeasurementId'));
        const measurementData = {
            id: measurementId,
            clientName: formData.get('editClientName'),
            date: formData.get('editDate'),
            length: formData.get('editLength') || '',
            chest: formData.get('editChest') || '',
            west: formData.get('editWest') || '',
            hip: formData.get('editHip') || '',
            shoulder: formData.get('editShoulder') || '',
            slive: formData.get('editSlive') || '',
            sliveMori: formData.get('editSliveMori') || '',
            type: formData.get('editType')
        };
    
        // Add type-specific measurements
        if (measurementData.type === 'salvar') {
            measurementData.salvarLength = formData.get('editSalvarLength') || '';
            measurementData.salvarMori = formData.get('editSalvarMori') || '';
        } else if (measurementData.type === 'pant') {
            measurementData.pantLength = formData.get('editPantLength') || '';
            measurementData.pantKhistak = formData.get('editPantKhistak') || '';
            measurementData.pantHip = formData.get('editPantHip') || '';
            measurementData.pantMori = formData.get('editPantMori') || '';
            measurementData.knee = formData.get('editKnee') || '';
            measurementData.thai = formData.get('editThai') || '';
        }
    
        // Update measurement in local storage
        let measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        const index = measurements.findIndex(m => m.id === measurementId);
        if (index !== -1) {
            measurements[index] = measurementData;
            localStorage.setItem('measurements', JSON.stringify(measurements));
        }
    
        // Reset form and update UI
        editForm.style.display = 'none';
        document.getElementById('searchResults').style.display = 'block';
        loadMeasurements();
    
        // Refresh search results
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMeasurements = measurements.filter(m => 
            m.clientName.toLowerCase().includes(searchTerm)
        );
        displaySearchResults(filteredMeasurements);
    });
    
    function editMeasurement(id) {
        const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        const measurement = measurements.find(m => m.id === id);
        
        if (!measurement) return;
        
        // Hide search results and show edit form
        document.getElementById('searchResults').style.display = 'none';
        const editForm = document.getElementById('editMeasurementForm');
        editForm.style.display = 'block';
        
        // Populate form fields
        document.getElementById('editMeasurementId').value = measurement.id;
        document.getElementById('editClientName').value = measurement.clientName;
        document.getElementById('editDate').value = measurement.date;
        document.getElementById('editLength').value = measurement.length;
        document.getElementById('editChest').value = measurement.chest;
        document.getElementById('editWest').value = measurement.west;
        document.getElementById('editHip').value = measurement.hip;
        document.getElementById('editShoulder').value = measurement.shoulder;
        document.getElementById('editSlive').value = measurement.slive;
        document.getElementById('editSliveMori').value = measurement.sliveMori;
        document.getElementById('editType').value = measurement.type;
        
        // Show/hide and populate type-specific fields
        const editSalvarFields = document.getElementById('editSalvarFields');
        const editPantFields = document.getElementById('editPantFields');
        
        if (measurement.type === 'salvar') {
            editSalvarFields.style.display = 'block';
            editPantFields.style.display = 'none';
            document.getElementById('editSalvarLength').value = measurement.salvarLength;
            document.getElementById('editSalvarMori').value = measurement.salvarMori;
        } else if (measurement.type === 'pant') {
            editSalvarFields.style.display = 'none';
            editPantFields.style.display = 'block';
            document.getElementById('editPantLength').value = measurement.pantLength;
            document.getElementById('editPantKhistak').value = measurement.pantKhistak;
            document.getElementById('editPantHip').value = measurement.pantHip;
            document.getElementById('editPantMori').value = measurement.pantMori;
            document.getElementById('editKnee').value = measurement.knee;
            document.getElementById('editThai').value = measurement.thai;
        }
    }

    function saveMeasurement(data) {
        let measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        measurements.push(data);
        localStorage.setItem('measurements', JSON.stringify(measurements));
    }

    function loadMeasurements() {
        const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        measurementsList.innerHTML = '';

        measurements.forEach(measurement => {
            const item = document.createElement('div');
            item.className = 'measurement-item';

            let specificMeasurements = '';
            if (measurement.type === 'salvar') {
                specificMeasurements = `
                    <p>Salvar Length: ${measurement.salvarLength}</p>
                    <p>Salvar Mori: ${measurement.salvarMori}</p>
                `;
            } else if (measurement.type === 'pant') {
                specificMeasurements = `
                    <p>Pant Length: ${measurement.pantLength}</p>
                    <p>Pant Khistak: ${measurement.pantKhistak}</p>
                    <p>Pant Hip: ${measurement.pantHip}</p>
                    <p>West: ${measurement.west}</p>
                    <p>Pant Mori: ${measurement.pantMori}</p>
                    <p>Knee: ${measurement.knee}</p>
                    <p>Thai: ${measurement.thai}</p>
                `;
            }

            item.innerHTML = `
                <div class="measurement-info">
                    <h3>${measurement.clientName}</h3>
                    <p>Date: ${measurement.date}</p>
                    <p>Type: ${measurement.type}</p>
                    <p>Length: ${measurement.length}</p>
                    <p>Chest: ${measurement.chest}</p>
                    <p>West: ${measurement.west}</p>
                    <p>Hip: ${measurement.hip}</p>
                    <p>Shoulder: ${measurement.shoulder}</p>
                    <p>Slive: ${measurement.slive}</p>
                    <p>Slive Mori: ${measurement.sliveMori}</p>
                    ${specificMeasurements}
                </div>
                <div class="measurement-actions">
                    <button class="delete-btn btn btn-danger" data-id="${measurement.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;

            measurementsList.appendChild(item);
        });

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                deleteMeasurement(id);
            });
        });
    }

    function deleteMeasurement(id) {
        let measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        measurements = measurements.filter(m => m.id !== id);
        localStorage.setItem('measurements', JSON.stringify(measurements));
        loadMeasurements();
    }
});