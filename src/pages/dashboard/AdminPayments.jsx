import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { CreditCard, Calendar, User, DollarSign } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminPayments = () => {
  const { token } = useAuth();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/admin/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPayments();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Stripe Premium Payments Log</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Comprehensive database of customer subscription transactions.</p>
      </div>

      {payments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          No subscription transactions found in the database.
        </div>
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Purchaser details</th>
                <th>Billing Email</th>
                <th>Amount Charged</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#06b6d4' }}>
                    {p.transactionId}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                      <User size={12} style={{ color: '#64748b' }} />
                      <span>{p.userId?.name || 'Deleted Account'}</span>
                    </div>
                    {p.userId && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '20px' }}>
                        ID: {p.userId._id}
                      </div>
                    )}
                  </td>
                  <td style={{ color: '#94a3b8' }}>{p.email}</td>
                  <td style={{ fontWeight: 800 }}>
                    <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center' }}>
                      <DollarSign size={14} />
                      {p.amount.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                      <Calendar size={12} />
                      {new Date(p.paymentDate).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
