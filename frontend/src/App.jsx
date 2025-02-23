import { useEffect, useState } from 'react';
import './App.css';

function App() {
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
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <a className="navbar-brand ps-3" href="index.html">Start Bootstrap</a>
        <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"/></button>
        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
            <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"/></button>
          </div>
        </form>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"/></a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#!">Settings</a></li>
              <li><a className="dropdown-item" href="#!">Activity Log</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#!">Logout</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <a className="nav-link" href="Products.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-table"/></div>
                  Products
                </a>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Start Bootstrap
            </div>
          </nav>
        </div>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h1 className="mt-4">Products</h1>
              <button className="btn btn-primary float-end" onClick={handleCreateProduct}>Create Product</button>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                <li className="breadcrumb-item active">Products</li>
              </ol>
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-table me-1"/>
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
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; Your Website 2023</div>
                <div>
                  <a href="#">Privacy Policy</a>
                  &middot;
                  <a href="#">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;

