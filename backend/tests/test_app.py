# import sys
# import os
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, get_all_product_from_db

# API - Integration Test
def test_get_products():
    response = app.test_client().get('/products')
    assert response.status_code == 200


# DB - Unit Test
def test_get_products_from_db():
    with app.app_context():
        result = get_all_product_from_db()
        assert result[0]["product_name"] == "Chai"
