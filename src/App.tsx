import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. Define what a "Product" looks like (TypeScript needs this)
interface Product {
  id: number;
  name: string;
  price: number;
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); 
  const [products, setProducts] = useState<Product[]>([]); // Store the list of products

  // --- LOGIN FUNCTION ---
  const handleLogin = async () => {
    try {
      const response = await axios.post("https://localhost:7106/api/Auth/login", {
        username: username,
        password: password
      });
      setToken(response.data.token); // Save the token
    } catch (error) {
      alert("Login Failed!");
      console.error(error);
    }
  };

  // --- GET DATA FUNCTION (Uses the Token) ---
  const loadProducts = async () => {
    try {
      // We must attach the Token to the request header
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get("https://localhost:7106/api/Products", config);
      setProducts(response.data); // Save the products to state

    } catch (error) {
      alert("Failed to load products! (Did the token expire?)");
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
              {token && <span className="badge bg-light text-dark">Logged In as {username}</span>}
            </div>
            
            <div className="card-body">
              
              {/* SCREEN 1: LOGIN FORM */}
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

              {/* SCREEN 2: DASHBOARD (Only visible after login) */}
              {token && (
                <div>
                  <div className="alert alert-success">
                    <strong>Authentication Success!</strong> You now have a secure session.
                  </div>

                  <button onClick={loadProducts} className="btn btn-warning w-100 mb-4">
                    📦 Load Products from Database
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