from app import app


# API - Integration Test
def test_get_products():
    response = app.test_client().get('/products')
    assert response.status_code == 200


# DB - Unit Test
def test_get_products_from_db():
    result = app.get_all_product_from_db()
    assert result[0]["product_name"] == "Chai"