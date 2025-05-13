import React, { useState } from "react";
import { motion } from "framer-motion";
import ExpenseModal from "./ExpenseModal";
import "./ExpenseList.css";

const ExpenseList = ({ expenses, onDelete, onUpdate }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleSave = (updated) => {
    onUpdate(updated);
    setSelectedExpense(null);
  };

  return (
    <>
      <div className="expense-grid">
        {expenses.map((expense) => (
          <motion.div
            className="card-3d"
            key={expense.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ rotateY: 5 }}
          >
            <h2 className="card-amount">₹{expense.amount}</h2>
            <p className="card-category">Category: {expense.category}</p>
            <p className="card-date">Date: {expense.date}</p>
            <div className="card-actions">
              <button className="btn view" onClick={() => setSelectedExpense(expense)}>Details</button>
              <button className="btn delete" onClick={() => onDelete(expense.id)}>Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default ExpenseList;
