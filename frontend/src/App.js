import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [empName, setEmpName] = useState('');
  const [role, setRole] = useState('admin');
  const [pin, setPin] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      alert('Login successful!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pin,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Reset failed');
      }

      setSuccess('Password reset successful! You can now login.');
      setIsForgotPassword(false);
      setIsLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emp_name: empName,
          email,
          password,
          role,
          pin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      const data = await response.json();
      setSuccess('Signup successful! You can now login.');
      setIsLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="form-container">
          <h1>{isForgotPassword ? 'Forgot Password' : isLogin ? 'Login' : 'Signup'}</h1>
          <div className="nav-buttons">
            <button className={`nav-btn ${isLogin && !isForgotPassword ? 'active' : ''}`} onClick={() => { setIsLogin(true); setIsForgotPassword(false); }}>
              Login
            </button>
            <button className={`nav-btn ${!isLogin && !isForgotPassword ? 'active' : ''}`} onClick={() => { setIsLogin(false); setIsForgotPassword(false); }}>
              Signup
            </button>
            <button className={`nav-btn ${isForgotPassword ? 'active' : ''}`} onClick={() => { setIsForgotPassword(true); setIsLogin(false); }}>
              Forgot Password
            </button>
          </div>
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>PIN:</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  placeholder="Enter your role PIN"
                />
                <small className="pin-hint">Admin: adm789, Manager: mgr456, Employee: emp123</small>
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="At least 8 chars with letters, digits, special chars"
                />
                <small className="hint">e.g., NewPass456!</small>
              </div>
              <button type="submit">Reset Password</button>
            </form>
          ) : isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit">Login</button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  required
                  placeholder="e.g., John.Doe"
                />
                <small className="hint">Format: First.Last</small>
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="yourname@gyansys.com"
                />
                <small className="hint">Must be @gyansys.com</small>
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 8 chars with letters, digits, special chars"
                />
                <small className="hint">e.g., Pass123!</small>
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: 'none', outline: 'none'}}>
                  <option value="admin" style={{background: '#667eea', color: 'white'}}>Admin</option>
                  <option value="manager" style={{background: '#667eea', color: 'white'}}>Manager</option>
                  <option value="employee" style={{background: '#667eea', color: 'white'}}>Employee</option>
                </select>
              </div>
              <div className="form-group">
                <label>PIN:</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  placeholder="Enter role PIN"
                />
                <small className="pin-hint">Admin: adm789, Manager: mgr456, Employee: emp123</small>
              </div>
              <button type="submit">Signup</button>
            </form>
          )}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          {token && <p className="success">Login successful! Token: {token}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
