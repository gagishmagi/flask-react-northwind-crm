import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, get_all_product_from_db

# API - Integration Test
def test_get_products():
    response = app.test_client().get('/products')
    print(response.data)
    assert response.status_code == 200

def test_post_products():
    response = app.test_client().post('/products', json={
        "product_id": 100,
        "product_name": "Chang",
        "quantity_per_unit": "24 - 12 oz bottles",
        "unit_price": 19.00,
        "units_in_stock": 17,
        "discontinued": 0
    })
    assert response.status_code == 201


# DB - Unit Test
def test_get_products_from_db():
    with app.app_context():
        result = get_all_product_from_db()
        assert result[0]["product_name"] == "Chang"
