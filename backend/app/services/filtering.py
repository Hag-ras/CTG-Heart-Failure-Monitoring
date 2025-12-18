import numpy as np
import wfdb
import os
from scipy.signal import butter, sosfilt, zpk2tf

# This robustly finds the absolute path to your 'data' folder
try:
    _SERVICE_DIR = os.path.dirname(os.path.abspath(__file__))
    _APP_DIR = os.path.dirname(_SERVICE_DIR)
    _BACKEND_DIR = os.path.dirname(_APP_DIR)
    DATA_DIR = os.path.join(_BACKEND_DIR, "data")
except NameError:
    DATA_DIR = "data"


def get_filter_coefficients():
    """
    Designs the Butterworth filter and returns its poles and zeros for Z-plane visualization.
    """
    fs = 1.0
    cutoff_freq = 0.2
    filter_order = 5

    # Use zpk (zeros, poles, gain) output format to get the necessary details
    z, p, k = butter(filter_order, cutoff_freq, btype='low', analog=False, output='zpk', fs=fs)
    
    # The poles and zeros can be complex numbers, so we format them for easy plotting
    zeros = [{'re': np.real(val), 'im': np.imag(val)} for val in z]
    poles = [{'re': np.real(val), 'im': np.imag(val)} for val in p]
    
    return zeros, poles


def read_ctg_record(record_name: str) -> list[float] | None:
    """Reads a CTG record from the data directory."""
    record_path_without_extension = os.path.join(DATA_DIR, record_name)
    try:
        record = wfdb.rdrecord(record_path_without_extension)
        fhr_signal = record.p_signal[:, 0]
        fhr_signal_cleaned = fhr_signal[~np.isnan(fhr_signal)]
        return fhr_signal_cleaned[::4].tolist()
    except Exception as e:
        print(f"An error occurred while reading from file path {record_path_without_extension}: {e}")
        return None


def apply_filter(data: list[float]) -> list[float]:
    """Applies a real digital Butterworth low-pass filter to the data."""
    if not data:
        return []
    
    fs = 1.0
    cutoff_freq = 0.2
    filter_order = 5

    sos = butter(filter_order, cutoff_freq, btype='low', analog=False, output='sos', fs=fs)
    filtered_data = sosfilt(sos, data)
    
    return filtered_data.tolist()
