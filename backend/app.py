from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(database="northwind", user="postgres", password="postgres", host="localhost", port=55432)
    return conn

@app.route('/products/count', methods=['GET'])
def get_product_count():
    result = get_products_count_from_db()
    return jsonify({'count': result})

@app.route('/products', methods=['GET'])
def get_all_products():
    result = get_all_product_from_db()
    return jsonify(result)

@app.route('/products/<int:id>', methods=['GET'])
def get_product_by_id(id):
    if id <= 0:
        return jsonify({'error': 'Invalid product ID'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM PRODUCTS WHERE product_id=%s", (id,))
        result = cursor.fetchone()
    except Exception as e:
        app.logger.error(f"Error fetching product {id}: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        if conn:
            conn.close()
    return jsonify(dict(zip([desc[0] for desc in cursor.description], result))) if result else jsonify({'error': 'Product not found'}), 404

@app.route('/products/name/<name>', methods=['GET'])
def get_product_by_name(name):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM PRODUCTS WHERE product_name=%s", (name,))
        result = cursor.fetchone()
    except Exception as e:
        app.logger.error(f"Error fetching product {name}: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        if conn:
            conn.close()
    return jsonify(dict(result)) if result else jsonify({'error': 'Product not found'}), 404

@app.route('/products', methods=['POST'])
def create_product():
    new_product = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO products (product_name, quantity_per_unit, unit_price, units_in_stock, discontinued) VALUES (%s, %s, %s, %s, %s)",
                       (new_product['product_name'], new_product['quantity_per_unit'], new_product['unit_price'], new_product['units_in_stock'], new_product['discontinued']))
        conn.commit()
    except Exception as e:
        app.logger.error(f"Error creating product: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({'message': 'Product created successfully'}), 201

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    updated_product = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE products SET product_name=%s, quantity_per_unit=%s, unit_price=%s, units_in_stock=%s, discontinued=%s WHERE product_id=%s",
                       (updated_product['product_name'], updated_product['quantity_per_unit'], updated_product['unit_price'], updated_product['units_in_stock'], updated_product['discontinued'], id))
        conn.commit()
    except Exception as e:
        app.logger.error(f"Error updating product {id}: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({'message': 'Product updated successfully'})

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE product_id=%s", (id,))
        conn.commit()
    except Exception as e:
        app.logger.error(f"Error deleting product {id}: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({'message': 'Product deleted successfully'})


def get_all_product_from_db():
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
    return result


def get_products_count_from_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM PRODUCTS")
        result = cursor.fetchone()[0]
    except Exception as e:
        app.logger.error(f"Error fetching product count: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        if conn:
            conn.close()
    return result



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

