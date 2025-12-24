import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  id: number;
  name: string;
  price: number;
}

function App() {
  // Authentication State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); 

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  
  // "Create Product" State (New!)
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // --- 1. LOGIN ---
  const handleLogin = async () => {
    try {
      const response = await axios.post("https://localhost:7106/api/Auth/login", {
        username: username,
        password: password
      });
      setToken(response.data.token);
    } catch (error) {
      alert("Login Failed!");
      console.error(error);
    }
  };

  // --- 2. GET PRODUCTS ---
  const loadProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7106/api/Products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // --- 3. CREATE PRODUCT (New!) ---
  const handleAddProduct = async () => {
    try {
      // Convert string price to number
      const priceNumber = parseFloat(newPrice); 

      // Send POST request with Token
      await axios.post("https://localhost:7106/api/Products", 
        { name: newName, price: priceNumber }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product Added!");
      setNewName('');  // Clear form
      setNewPrice(''); // Clear form
      loadProducts();  // Refresh the list instantly!

    } catch (error) {
      alert("Failed to add product.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3>Product Store</h3>
              {token && <span className="badge bg-light text-dark">Logged In</span>}
            </div>
            
            <div className="card-body">
              
              {/* LOGIN SCREEN */}
              {!token && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
                </div>
              )}

              {/* DASHBOARD */}
              {token && (
                <div>
                  {/* NEW: ADD PRODUCT FORM */}
                  <div className="card mb-4 p-3 bg-light border-0">
                    <h5>Add New Product</h5>
                    <div className="row g-2">
                      <div className="col-md-5">
                        <input 
                          type="text" className="form-control" placeholder="Product Name" 
                          value={newName} onChange={(e) => setNewName(e.target.value)} 
                        />
                      </div>
                      <div className="col-md-4">
                        <input 
                          type="number" className="form-control" placeholder="Price" 
                          value={newPrice} onChange={(e) => setNewPrice(e.target.value)} 
                        />
                      </div>
                      <div className="col-md-3">
                        <button onClick={handleAddProduct} className="btn btn-success w-100">
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={loadProducts} className="btn btn-warning w-100 mb-4">
                    Refresh List
                  </button>

                  {/* PRODUCT LIST */}
                  {products.length > 0 && (
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>${p.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;