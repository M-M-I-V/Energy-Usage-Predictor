import pandas as pd
import numpy as np

def get_data(n_samples=2000):
    """
    Generates synthetic energy usage data based on:
    - Hour of day (Cyclical)
    - Temperature (Correlated with hour)
    - Machine Status (Randomly weighted)
    """
    np.random.seed(42)  # Fixed seed for reproducible results

    # 1. Generate Timeline (Hours 0-23 repeated)
    hours = np.tile(np.arange(24), n_samples // 24 + 1)[:n_samples]

    # 2. Generate Temperature (Sinewave to mimic day/night cycle + noise)
    # Peak temp around hour 14 (2pm), lowest around hour 2 (2am)
    temps = 20 + 5 * np.sin((hours - 6) / 24 * 2 * np.pi) + np.random.normal(0, 2, n_samples)

    # 3. Generate Machine Status
    status_options = ['Off', 'Idle', 'Running']
    # Probabilities: 30% Off, 20% Idle, 50% Running
    machine_status = np.random.choice(status_options, n_samples, p=[0.3, 0.2, 0.5])

    # 4. Calculate Energy Logic (The "Physics")
    energy_usage = []
    for h, t, s in zip(hours, temps, machine_status):
        # Base Load: Lights, fans, standby power (always on)
        base_load = 50 
        
        # Machine Load: Depends on status
        if s == 'Off':
            machine_load = 0
        elif s == 'Idle':
            machine_load = 30
        else: # Running
            machine_load = 150
        
        # AC Load: Cooling kicks in only when it's hot (above 20C)
        # Factor: 3 kWh per degree above 20
        ac_load = max(0, 3 * (t - 20)) 
        
        # Random Noise: Real sensors aren't perfect
        noise = np.random.normal(0, 5) 
        
        total_load = base_load + machine_load + ac_load + noise
        energy_usage.append(max(0, total_load)) # Ensure no negative energy

    # 5. Create DataFrame
    df = pd.DataFrame({
        'Hour': hours,
        'Temperature': temps.round(1),
        'Machine_Status': machine_status,
        'Energy_kWh': np.round(energy_usage, 2)
    })
    
    return df

if __name__ == "__main__":
    # If run directly, save to CSV for manual inspection
    data = get_data(2000)
    data.to_csv("historical_data.csv", index=False)
    print(f"✅ Generated {len(data)} rows of data. Saved to 'historical_data.csv'.")