from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db_connection():
    connection = psycopg2.connect(database="northwind", user="postgres", password="postgres", host="localhost", port=55432)
    return connection

@app.route('/products', methods=['GET'])
def get_all_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM PRODUCTS")
        rows = cursor.fetchall()
        result = [dict(zip([desc[0] for desc in cursor.description], row)) for row in rows]
    except Exception as e:
        app.logger.error(f"Error fetching products: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        if conn:
            conn.close()
    return jsonify(result)

@app.route('/products/<int:id>', methods=['GET'])
def get_product_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    result = cursor.execute("SELECT * FROM PRODUCTS WHERE id=%s", (id,)).fetchone()
    conn.close()
    return jsonify(dict(result)) if result else jsonify({'error': 'Product not found'}), 404

@app.route('/products/name/<name>', methods=['GET'])
def get_product_by_name(name):
    conn = get_db_connection()
    cursor = conn.cursor()
    result = cursor.execute("SELECT * FROM PRODUCTS WHERE name=%s", (name,)).fetchone()
    conn.close()
    return jsonify(dict(result)) if result else jsonify({'error': 'Product not found'}), 404

@app.route('/products', methods=['POST'])
def create_product():
    new_product = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO products (name, quantity_per_unit, unit_price, units_in_stock, discontinued) VALUES (%s, %s, %s, %s, %s)",
                   (new_product['name'], new_product['quantity_per_unit'], new_product['unit_price'], new_product['units_in_stock'], new_product['discontinued']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product created successfully'}), 201

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    updated_product = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE products SET name=%s, quantity_per_unit=%s, unit_price=%s, units_in_stock=%s, discontinued=%s WHERE id=%s",
                   (updated_product['name'], updated_product['quantity_per_unit'], updated_product['unit_price'], updated_product['units_in_stock'], updated_product['discontinued'], id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product updated successfully'})

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id=%s", (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

