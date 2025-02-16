from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)

def get_db_connection():
    connection = psycopg2.connect(database="northwind", user="postgres", password="****", host="localhost", port=5432)
    return connection

@app.route('/products', methods=['GET'])
def get_all_persons():
    conn = get_db_connection()
    cursor = conn.cursor()
    result = cursor.execute("SELECT * FROM Persons").fetchall()
    conn.close()
    return jsonify([dict(row) for row in result])

@app.route('/products/<int:id>', methods=['GET'])
def get_person_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    result = cursor.execute("SELECT * FROM Persons WHERE id=?", (id,)).fetchone()
    conn.close()
    return jsonify(dict(result)) if result else jsonify({'error': 'Person not found'}), 404

@app.route('/products/name/<name>', methods=['GET'])
def get_person_by_name(name):
    conn = get_db_connection()
    cursor = conn.cursor()
    result = cursor.execute("SELECT * FROM Persons WHERE name=?", (name,)).fetchone()
    conn.close()
    return jsonify(dict(result)) if result else jsonify({'error': 'Person not found'}), 404

@app.route('/products', methods=['POST'])
def create_person():
    new_person = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Persons (LastName, FirstName, Address, City) VALUES (?, ?, ?, ?)",
                   (new_person['last_name'], new_person['first_name'], new_person['address'], new_person['city']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Person created successfully'}), 201

@app.route('/products/<int:id>', methods=['PUT'])
def update_person(id):
    updated_person = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE Persons SET LastName=?, FirstName=?, Address=?, City=? WHERE id=?",
                   (updated_person['last_name'], updated_person['first_name'], updated_person['address'], updated_person['city'], id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Person updated successfully'})

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_person(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Persons WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Person deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

