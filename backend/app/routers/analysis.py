from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict
import os # Import the os module

from ..services import filtering

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)

# +++ NEW ENDPOINT +++
@router.get("/records", response_model=List[str])
async def get_available_records():
    """
    Scans the data directory and returns a list of available record names.
    A record name is the filename without the '.dat' extension.
    """
    try:
        # List all files in the data directory
        files = os.listdir(filtering.DATA_DIR)
        # Filter for files that end in .dat, and then strip the extension
        record_names = [f.split('.')[0] for f in files if f.endswith('.dat')]
        # Return a sorted list
        return sorted(record_names)
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"Error reading records directory: {e}")
        raise HTTPException(status_code=500, detail="Could not read data records directory.")


# Define a model for a complex number (re + im)
class ComplexPoint(BaseModel):
    re: float
    im: float

# Update the main response model
class FilterResponse(BaseModel):
    original_data: List[float]
    filtered_data: List[float]
    zeros: List[ComplexPoint]
    poles: List[ComplexPoint]
    message: str

@router.post("/process-signal", response_model=FilterResponse)
async def process_ctg_signal(record_name: str = Query("1001", description="The name of the record to process, e.g., '1001'")):
    """
    Reads a specific CTG record, applies a filter, and returns the data along with
    the filter's poles and zeros for visualization.
    """
    original_signal = filtering.read_ctg_record(record_name)
    
    if original_signal is None:
        raise HTTPException(
            status_code=404, 
            detail=f"Record '{record_name}' not found or could not be read."
        )
    
    filtered_signal = filtering.apply_filter(original_signal)
    
    zeros, poles = filtering.get_filter_coefficients()
    
    return {
        "original_data": original_signal,
        "filtered_data": filtered_signal,
        "zeros": zeros,
        "poles": poles,
        "message": f"Successfully processed record {record_name}.",
    }
