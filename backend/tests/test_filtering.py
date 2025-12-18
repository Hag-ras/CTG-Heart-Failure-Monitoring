import pytest
from app.services.filtering import apply_filter

def test_apply_filter_with_data():
    """
    Tests the placeholder filter function with some sample data.
    """
    test_data = [10, 20, 30, 40, 50]
    result = apply_filter(test_data)
    
    # This assertion will change once we implement a real filter
    assert len(result) > 0
    assert result[0] == pytest.approx(20.0) # (10+20+30)/3

def test_apply_filter_empty():
    """
    Tests the placeholder filter function with an empty list.
    """
    test_data = []
    result = apply_filter(test_data)
    assert result == []

