import pandas as pd
import numpy as np

def get_data(n_samples=2000):
    """
    Generates synthetic energy usage data.
    """
    np.random.seed(42)

    # 1. Generate Timeline
    hours = np.tile(np.arange(24), n_samples // 24 + 1)[:n_samples]

    # 2. Generate Temperature
    temps = 20 + 5 * np.sin((hours - 6) / 24 * 2 * np.pi) + np.random.normal(0, 2, n_samples)

    # 3. Generate Machine Status (30% Off, 20% Idle, 50% Running)
    status_options = ['Off', 'Idle', 'Running']
    machine_status = np.random.choice(status_options, n_samples, p=[0.3, 0.2, 0.5])

    # 4. Calculate Energy Logic
    energy_usage = []
    for h, t, s in zip(hours, temps, machine_status):
        base_load = 50 
        if s == 'Off': machine_load = 0
        elif s == 'Idle': machine_load = 30
        else: machine_load = 150 # Running
        
        ac_load = max(0, 3 * (t - 20)) 
        noise = np.random.normal(0, 5) 
        
        total_load = base_load + machine_load + ac_load + noise
        energy_usage.append(max(0, total_load))

    df = pd.DataFrame({
        'Hour': hours,
        'Temperature': temps.round(1),
        'Machine_Status': machine_status,
        'Energy_kWh': np.round(energy_usage, 2)
    })
    
    return df

if __name__ == "__main__":
    df = get_data()
    df.to_csv("historical_data.csv", index=False)
    print("✅ historical_data.csv created.")