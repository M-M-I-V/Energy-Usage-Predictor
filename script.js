// script.js

// --- Global Model Variables ---
let model = null;
let scaleParams = null; // Not strictly used in this simplified predict, but good practice

// --- Helper for Machine Status to Numeric Value ---
function getMachineStatusValue(status) {
    switch (status) {
        case 'idle': return 0;
        case 'running_light': return 0.5; // Represents a medium load
        case 'running_heavy': return 1;   // Represents a heavy load
        default: return 0;
    }
}

/**
 * Placeholder for a basic Linear Regression training function.
 * In a real hackathon, this would use a library (like TensorFlow.js or a Python backend).
 * For this demo, we'll use pre-defined coefficients that make sense for the new inputs.
 */
function trainLinearRegression() {
    return new Promise(resolve => {
        setTimeout(() => {
            // These coefficients are chosen to make plausible predictions for the new inputs
            const coefficients = {
                intercept: 800, // Base energy usage (kWh)
                'Temperature': 45, // Impact of 1 degree C increase (e.g., HVAC load)
                'Machine Operating Status_idle': -400, // Reduction from base if idle
                'Machine Operating Status_running_light': 1000, // Addition for light load
                'Machine Operating Status_running_heavy': 2500 // Addition for heavy load
                // Note: The model will implicitly handle the baseline for 'running_light' if 'idle' subtracts
            };

            resolve({ 
                theta: coefficients, 
                means: {}, // Not used in this simplified direct prediction
                stds: {}   // Not used in this simplified direct prediction
            });
        }, 100); // Very quick "training" for instant demo
    });
}

/**
 * Predicts energy using the trained model coefficients and user inputs.
 */
function predictEnergy(inputs) {
    const { temperature, machineStatus } = inputs;
    const { intercept, 'Temperature': tempCoeff } = model;
    
    let prediction = intercept;
    
    // Add temperature contribution
    prediction += tempCoeff * temperature; 
    
    // Add machine operating status contribution
    const machineValue = getMachineStatusValue(machineStatus); // 0, 0.5, or 1
    // Simplistic: higher value means more energy
    if (machineStatus === 'idle') {
        prediction += model['Machine Operating Status_idle'];
    } else if (machineStatus === 'running_light') {
        prediction += model['Machine Operating Status_running_light'];
    } else if (machineStatus === 'running_heavy') {
        prediction += model['Machine Operating Status_running_heavy'];
    }
    
    // Add some random noise for realism
    prediction += (Math.random() - 0.5) * 100;

    return Math.max(200, Math.round(prediction)); // Ensure a minimum base load
}


// --- DOM Manipulation and Event Handlers ---

document.addEventListener('DOMContentLoaded', async () => {
    const statusEl = document.getElementById('status');
    const predictForm = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('submitBtn');
    const forecastValueEl = document.getElementById('forecast-value');
    const estimatedCostEl = document.getElementById('estimated-cost');
    const mainInsightTextEl = document.getElementById('main-insight-text');
    
    const predictDateInput = document.getElementById('predict-date');
    const predictTemperatureInput = document.getElementById('predict-temperature');
    const machineStatusSelect = document.getElementById('machine-status');

    // Automatically set tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    predictDateInput.value = tomorrow.toISOString().split('T')[0];

    // --- Initial Model Training (simulated) ---
    statusEl.className = 'status-message training';
    statusEl.innerHTML = 'Initializing model...';
    submitBtn.disabled = true;

    try {
        const result = await trainLinearRegression();
        model = result.theta;
        statusEl.className = 'status-message success';
        statusEl.textContent = 'Model ready. Enter values and submit.';
        submitBtn.disabled = false;
        updateDriversChart(model); // Initial display of drivers
    } catch (error) {
        statusEl.className = 'status-message error';
        statusEl.textContent = 'Model initialization failed.';
        console.error(error);
    }
    
    // --- Prediction Form Handler ---
    predictForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!model) {
            statusEl.textContent = 'Model not initialized.';
            return;
        }

        // 1. Get User Inputs
        const dateToPredict = predictDateInput.value; // For display, not calculation
        const temperature = parseFloat(predictTemperatureInput.value);
        const machineStatus = machineStatusSelect.value; 

        const inputs = { dateToPredict, temperature, machineStatus };

        // 2. Run Prediction
        const predictedEnergy = predictEnergy(inputs);
        const predictedCost = predictedEnergy * 10; // Mock ₱10/kWh
        
        // 3. Update Forecast Card
        forecastValueEl.innerHTML = predictedEnergy.toLocaleString() + ' <span class="unit">kWh</span>';
        estimatedCostEl.textContent = '₱' + predictedCost.toLocaleString();

        // 4. Update Insights
        mainInsightTextEl.innerHTML = `For ${dateToPredict}, with a temperature of ${temperature}°C and machine status: <span class="highlight">${machineStatus}</span>, the predicted energy usage is <span class="highlight">${predictedEnergy.toLocaleString()} kWh</span>.`;
        statusEl.textContent = 'Prediction Generated.';
        
        // 5. Optionally, update the chart with the new prediction (simplified here)
        drawMockForecast(predictedEnergy);
    });
    
    // Initializes the mock chart (moved to a function)
    function drawMockForecast(peakEnergy = 1500) { // Default peak for initial load
        const mockChartCanvas = document.getElementById('mock-chart-placeholder');
        if (!mockChartCanvas) return; // Ensure canvas exists

        const ctx = mockChartCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        mockChartCanvas.width = mockChartCanvas.offsetWidth * dpr;
        mockChartCanvas.height = 100 * dpr; // Use a fixed height for the small chart
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, mockChartCanvas.offsetWidth, mockChartCanvas.height);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Draw a simple wave, scale amplitude by predicted energy
        const baseLine = mockChartCanvas.height / 2;
        const amplitudeScale = peakEnergy / 2000; // Scale amplitude relative to a max of 2000kWh
        for(let i = 0; i < mockChartCanvas.offsetWidth; i++) {
            const y = baseLine + Math.sin(i / 15) * 15 * amplitudeScale; // Adjust wave height by amplitudeScale
            if (i === 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
        }
        ctx.stroke();
    }
    
    drawMockForecast(); // Draw initial mock chart on load
});

/**
 * Updates the visual bar chart based on the model coefficients.
 * Adapts to the new specific coefficients.
 */
function updateDriversChart(coefficients) {
    const driversChartArea = document.getElementById('drivers-bar-chart');
    driversChartArea.innerHTML = ''; // Clear previous content

    const drivers = [
        // Ensure labels match the exact coefficient keys or simplify for display
        { label: 'Temperature (°C)', coeff: coefficients['Temperature'], color: 'orange', factor: 5 },
        { label: 'Machine: Running Heavy', coeff: coefficients['Machine Operating Status_running_heavy'], color: 'blue', factor: 0.05 },
        { label: 'Machine: Running Light', coeff: coefficients['Machine Operating Status_running_light'], color: 'blue', factor: 0.1 },
        { label: 'Machine: Idle Mode', coeff: coefficients['Machine Operating Status_idle'], color: 'blue', factor: -0.1 }, // Negative impact, so scale for display
    ];

    // Determine max magnitude for scaling the bars 
    const maxCoeff = Math.max(...drivers.map(d => Math.abs(d.coeff * d.factor)));

    drivers.forEach(driver => {
        // Calculate the percentage width based on scaled magnitude
        const percent = Math.min(100, (Math.abs(driver.coeff * driver.factor) / maxCoeff) * 100);

        const driverEl = document.createElement('div');
        driverEl.className = 'driver-bar';
        driverEl.innerHTML = `
            <span class="driver-label">${driver.label}</span>
            <div class="bar-fill ${driver.color}" style="width: ${percent}%;"></div>
            <span class="coefficient">Coefficient: ${driver.coeff > 0 ? '+' : ''}${driver.coeff.toFixed(1)}</span>
        `;
        driversChartArea.appendChild(driverEl);
    });
}