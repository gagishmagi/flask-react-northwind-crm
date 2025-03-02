import React, { useEffect, useState } from 'react'

export default function Products() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ product_name: '', unit_price: '', quantity_per_unit: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/products")
            .then(response => response.json())
            .then(products => {
                setProducts(products)
                setTimeout(() => {
                    const datatablesSimple = document.getElementById('datatablesSimple');
                    if (datatablesSimple) {
                        new simpleDatatables.DataTable(datatablesSimple);
                    }
                }, 1000);
            });
    }, []);

    const handleCreateProduct = () => {
        setShowForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleUpdateProduct = () => {
        fetch(`http://localhost:5000/products/${editingProduct.product_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editingProduct)
        })
            .then(response => response.json())
            .then(updatedProduct => {
                setProducts(products.map(product => product.product_id === updatedProduct.product_id ? updatedProduct : product));
                setEditingProduct(null);
                setShowForm(false);
            });
    };

    const handleDeleteProduct = (productId) => {
        fetch(`http://localhost:5000/products/${productId}`, {
            method: "DELETE"
        })
            .then(() => {
                setProducts(products.filter(product => product.product_id !== productId));
            });
    };

    return (
        <>
            <div className="container-fluid px-4">
                <h1 className="mt-4">Products</h1>
                <button className="btn btn-primary float-end" onClick={handleCreateProduct}>Create Product</button>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                    <li className="breadcrumb-item active">Products</li>
                </ol>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        DataTable Example
                    </div>
                    <div className="card-body">
                        {showForm && (
                            <div>
                                <input
                                    type="text"
                                    value={editingProduct ? editingProduct.product_name : newProduct.product_name}
                                    onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                                    placeholder="Product Name"
                                />
                                <input
                                    type="text"
                                    value={editingProduct ? editingProduct.unit_price : newProduct.unit_price}
                                    onChange={(e) => setNewProduct({ ...newProduct, unit_price: e.target.value })}
                                    placeholder="Unit Price"
                                />
                                <input
                                    type="text"
                                    value={editingProduct ? editingProduct.quantity_per_unit : newProduct.quantity_per_unit}
                                    onChange={(e) => setNewProduct({ ...newProduct, quantity_per_unit: e.target.value })}
                                    placeholder="Quantity"
                                />
                                <button onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}>{editingProduct ? 'Update' : 'Add'} Product</button>
                            </div>
                        )}
                        <table id="datatablesSimple" className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>UnitPrice</th>
                                    <th>quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>UnitPrice</th>
                                    <th>quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </tfoot>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.product_id}>
                                        <td>{product.product_id}</td>
                                        <td>{product.product_name}</td>
                                        <td>{product.unit_price}</td>
                                        <td>{product.quantity_per_unit}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleEditProduct(product)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.product_id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
