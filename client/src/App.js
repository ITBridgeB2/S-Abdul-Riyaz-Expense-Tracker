import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', category: '', date: '' });
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  // Fetch expenses and total
  const fetchExpenses = async () => {
    const res = await axios.get('http://localhost:5000/expenses');
    setExpenses(res.data);
    fetchTotalSpent(); // update total after every fetch
  };

  const fetchTotalSpent = async () => {
    try {
      const res = await axios.get('http://localhost:5000/expenses/total');
      setTotalSpent(res.data.totalSpent || 0);
    } catch (err) {
      console.error('Failed to fetch total spent:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAdd = () => {
    setFormData({ amount: '', category: '', date: '' });
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (expense) => {
    setFormData(expense);
    setSelectedExpense(expense);
    setEditMode(true);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/expenses/${id}`);
    fetchExpenses();
    alert("Expense Deleted Successfully")
    setShowDetails(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:5000/expenses/${formData.id}`, formData);
      alert("Expenses Updated Successfully")
    } else {
      await axios.post('http://localhost:5000/expenses', formData);
      alert("Expenses Added Successfully")
    }
    setShowForm(false);
    fetchExpenses();
  };

  const handleDetails = (expense) => {
    setSelectedExpense(expense);
    setShowDetails(true);
  };

  return (
    <div className='main'>
    <div className="app">
      <h1>Expense Tracker</h1>

      <div className="total-spent">
        💸 <strong>Total Spent:</strong> ₹{totalSpent}
      </div>
      <div>
        <h1>All Expenses List</h1>
      </div>
      <div className="expense-list">
        {expenses.map((exp) => (
          <div className="card" key={exp.id}>
            <p><strong>Amount:</strong> ₹{exp.amount}</p>
            <p><strong>Date:</strong> {exp.date}</p>
            <button onClick={() => handleDetails(exp)}>Details</button>
          </div>
        ))}
        <button className="add-button" onClick={handleAdd}>+ Add Expense</button>
      </div>

      {showForm && (
        <div className="popup">
          <form onSubmit={handleSubmit} className="form">
            <input type="number" name="amount" placeholder="Amount" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            <input type="text" name="category" placeholder="Category" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <input type="date" name="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <button type="submit">{editMode ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      {showDetails && selectedExpense && (
        <div className="popup">
          <div className="details">
            <h2>Expense Details</h2>
            <p><strong>Amount:</strong> ₹{selectedExpense.amount}</p>
            <p><strong>Category:</strong> {selectedExpense.category}</p>
            <p><strong>Date:</strong> {selectedExpense.date}</p>
            <button onClick={() => handleEdit(selectedExpense)}>Edit</button>
            <button onClick={() => handleDelete(selectedExpense.id)}>Delete</button>
            <button onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default App;
