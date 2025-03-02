document.addEventListener('DOMContentLoaded', () => {
    // Bottom Navigation Bar Functionality
    const navMeasurements = document.getElementById('nav-measurements');
    const navSearch = document.getElementById('nav-search');
    const measurementForm = document.getElementById('measurementForm');
    const measurementsListSection = document.querySelector('.measurements-list');
    
    // Create search section (initially hidden)
    const searchSection = document.createElement('section');
    searchSection.className = 'measurement-form';
    searchSection.style.display = 'none';
    searchSection.innerHTML = `
        <h2>Search Measurements</h2>
        <div class="form-group">
            <label for="searchClient">Search by Client Name</label>
            <input type="text" id="searchClient" name="searchClient" placeholder="Start typing to search...">
        </div>
        <div class="form-actions">
            <button type="button" id="searchBtn" class="btn btn-primary">Search</button>
        </div>
        <div id="searchResults" class="dynamic-fields" style="margin-top: 20px;"></div>
        <div id="measurementDetails" class="measurement-details" style="display: none; margin-top: 20px;"></div>
    `;
    
    // Insert search section after measurement form
    measurementForm.parentNode.insertBefore(searchSection, measurementsListSection);
    
    // Navigation event listeners
    navMeasurements.addEventListener('click', () => {
        navMeasurements.classList.add('active');
        navSearch.classList.remove('active');
        measurementForm.style.display = 'block';
        searchSection.style.display = 'none';
        measurementsListSection.style.display = 'block';
    });
    
    navSearch.addEventListener('click', () => {
        navSearch.classList.add('active');
        navMeasurements.classList.remove('active');
        measurementForm.style.display = 'none';
        searchSection.style.display = 'block';
        measurementsListSection.style.display = 'none';
    });
    
    // Search functionality
    const searchClient = document.getElementById('searchClient');
    const searchResults = document.getElementById('searchResults');
    
    // Real-time search as user types
    searchClient.addEventListener('input', () => {
        const searchTerm = searchClient.value.toLowerCase();
        const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        const filteredMeasurements = measurements.filter(m => 
            m.clientName.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(filteredMeasurements);
    });
    
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        results.forEach(measurement => {
            const resultCard = document.createElement('div');
            resultCard.className = 'measurement-item';
            
            resultCard.innerHTML = `
                <div class="measurement-info">
                    <h3>${measurement.clientName}</h3>
                    <p>Date: ${measurement.date}</p>
                    <p>Type: ${measurement.type}</p>
                </div>
                <div class="measurement-actions">
                    <button class="delete-btn btn btn-danger" data-id="${measurement.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;
            
            searchResults.appendChild(resultCard);
            
            // Add delete functionality
            const deleteBtn = resultCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = parseInt(deleteBtn.getAttribute('data-id'));
                deleteMeasurement(id);
                // Refresh search results
                const searchTerm = searchClient.value.toLowerCase();
                const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
                const filteredMeasurements = measurements.filter(m => 
                    m.clientName.toLowerCase().includes(searchTerm)
                );
                displaySearchResults(filteredMeasurements);
            });
        });
    }
    
    // Also keep the button functionality as a fallback
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchClient.value.toLowerCase().trim();
        const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        
        const results = measurements.filter(measurement => 
            measurement.clientName.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(results);
    });
    
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }
        
        results.forEach(measurement => {
            const item = document.createElement('div');
            item.className = 'measurement-item';
            item.style.cursor = 'pointer';
            
            // Add click event to view full details
            item.addEventListener('click', () => {
                viewMeasurementDetails(measurement);
            });
            
            let specificMeasurements = '';
            if (measurement.type === 'salvar') {
                specificMeasurements = `
                    <p>Salvar Length: ${measurement.salvarLength}</p>
                    <p>Salvar Mori: ${measurement.salvarMori}</p>
                `;
            } else if (measurement.type === 'pant') {
                specificMeasurements = `
                    <p>Pant Length: ${measurement.pantLength}</p>
                    <p>Pant Hip: ${measurement.pantHip}</p>
                    <p>Waist: ${measurement.waist}</p>
                    <p>Knee: ${measurement.knee}</p>
                    <p>Thai: ${measurement.thai}</p>
                    <p>Pant Mori: ${measurement.pantMori}</p>
                `;
            }
            
            item.innerHTML = `
                <h3>${measurement.clientName}</h3>
                <p>Date: ${measurement.date}</p>
                <p>Type: ${measurement.type}</p>
                <p>Length: ${measurement.length}</p>
                <p>Wrist: ${measurement.wrist}</p>
                <p>Hip: ${measurement.hip}</p>
                <p>Shoulder: ${measurement.shoulder}</p>
                <p>Slive: ${measurement.slive}</p>
                <p>Slive Mori: ${measurement.sliveMori}</p>
                ${specificMeasurements}
            `;
            
            searchResults.appendChild(item);
        });
    }
    
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
                <p><strong>Pant Hip:</strong> ${measurement.pantHip}</p>
                <p><strong>Waist:</strong> ${measurement.waist}</p>
                <p><strong>Knee:</strong> ${measurement.knee}</p>
                <p><strong>Thai:</strong> ${measurement.thai}</p>
                <p><strong>Pant Mori:</strong> ${measurement.pantMori}</p>
            `;
        }
        
        detailsContainer.innerHTML = `
            <div class="measurement-detail-card">
                <h3>${measurement.clientName} - Full Details</h3>
                <p><strong>Date:</strong> ${measurement.date}</p>
                <p><strong>Type:</strong> ${measurement.type}</p>
                <p><strong>Length:</strong> ${measurement.length}</p>
                <p><strong>Wrist:</strong> ${measurement.wrist}</p>
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

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const measurementData = {
            id: Date.now(),
            clientName: formData.get('clientName'),
            date: formData.get('date'),
            length: formData.get('length') || '',
            wrist: formData.get('wrist') || '',
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
            measurementData.pantHip = formData.get('pantHip') || '';
            measurementData.waist = formData.get('waist') || '';
            measurementData.knee = formData.get('knee') || '';
            measurementData.thai = formData.get('thai') || '';
            measurementData.pantMori = formData.get('pantMori') || '';
        }

        // Set today's date as default when the form loads
        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').value = today;
        });

        // Save to local storage
        saveMeasurement(measurementData);

        // Reset form and reload measurements
        form.reset();
        salvarFields.style.display = 'none';
        pantFields.style.display = 'none';
        loadMeasurements();
    });

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
                    <p>Pant Hip: ${measurement.pantHip}</p>
                    <p>Waist: ${measurement.waist}</p>
                    <p>Knee: ${measurement.knee}</p>
                    <p>Thai: ${measurement.thai}</p>
                    <p>Pant Mori: ${measurement.pantMori}</p>
                `;
            }

            item.innerHTML = `
                <div class="measurement-info">
                    <h3>${measurement.clientName}</h3>
                    <p>Date: ${measurement.date}</p>
                    <p>Type: ${measurement.type}</p>
                    <p>Length: ${measurement.length}</p>
                    <p>Wrist: ${measurement.wrist}</p>
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