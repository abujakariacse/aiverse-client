import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { Users, FileText, MessageSquare, Copy, DollarSign, PieChart as PieIcon } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminAnalytics = () => {
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    summary: { totalUsers: 0, totalPrompts: 0, totalReviews: 0, totalCopies: 0, totalRevenue: 0 },
    toolDistribution: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          toast.error('Failed to load system metrics');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error loading analytics');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Pre-process tool distribution for charts
  const barData = stats.toolDistribution.map((tool) => ({
    name: tool._id || 'Unknown',
    Prompts: tool.count,
    Copies: tool.copies,
  }));

  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Administrative System Analytics</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Aggregate metrics and engine distribution breakdowns.</p>
      </div>

      {/* Summary Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {/* Card 1 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={20} />
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Total Users</h4>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.summary.totalUsers}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            color: '#06b6d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={20} />
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Total Prompts</h4>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.summary.totalPrompts}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Total Reviews</h4>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.summary.totalReviews}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Copy size={20} />
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Total Copies</h4>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.summary.totalCopies}</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={20} />
          </div>
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Total Revenue</h4>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              ${stats.summary.totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      {stats.toolDistribution.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          No prompt templates are currently approved. Data insights unavailable.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Bar Chart */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} className="text-secondary" /> Engine Prompts Density vs Total Copies
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1020',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Prompts" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Copies" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={16} className="text-primary" /> Prompt Distribution Share
            </h3>
            <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stats.toolDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="_id"
                  >
                    {stats.toolDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} prompts`, name]}
                    contentStyle={{
                      backgroundColor: '#0c1020',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;

// Recharts pie chart rendering configurations
