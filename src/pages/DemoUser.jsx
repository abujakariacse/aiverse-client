import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Shield, Sparkles, User, Copy, Check, ArrowRight, Key, Mail } from 'lucide-react';
import './DemoUser.css';

const DemoUser = () => {
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: 'Admin User',
      email: 'admin@aiverse.com',
      password: '123456',
      color: 'purple',
      badge: 'badge-purple',
      icon: Shield,
      description: 'Access to system analytics, user management, prompt moderation, payment histories, and system configurations.',
    },
    {
      role: 'Creator User',
      email: 'creator@aiverse.com',
      password: '123456',
      color: 'cyan',
      badge: 'badge-cyan',
      icon: Sparkles,
      description: 'Access to creator analytics, adding new AI prompts, editing owned listings, and tracking prompt views.',
    },
    {
      role: 'Standard User',
      email: 'user@aiverse.com',
      password: '123456',
      color: 'green',
      badge: 'badge-green',
      icon: User,
      description: 'Access to search prompts, copy prompts to clipboard, save to collections, leave reviews, and purchase premium access.',
    },
  ];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="demo-page-container">
      <div className="demo-content">
        <motion.div
          className="demo-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="demo-header-badge">
            <Sparkles className="icon-pulse text-gradient" size={20} />
            <span>Developer Sandbox</span>
          </div>
          <h1 className="gradient-text">Demo Accounts</h1>
          <p className="demo-subtitle">
            Explore AIverse from different user perspectives. Copy credentials below and head over to the sign in page.
          </p>
        </motion.div>

        <motion.div
          className="demo-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {demoAccounts.map((account, index) => {
            const Icon = account.icon;
            return (
              <motion.div
                key={index}
                className="demo-card glass-panel"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className={`demo-card-icon-wrapper ${account.color}`}>
                  <Icon size={24} />
                </div>
                
                <div className="demo-card-header">
                  <span className={`badge ${account.badge} demo-role-badge`}>{account.role}</span>
                  <p className="demo-card-desc">{account.description}</p>
                </div>

                <div className="demo-credentials-container">
                  <div className="credential-row">
                    <div className="credential-label">
                      <Mail size={14} />
                      <span>Email</span>
                    </div>
                    <div className="credential-value-wrapper">
                      <code className="credential-code">{account.email}</code>
                      <button
                        onClick={() => handleCopy(account.email, 'Email')}
                        className="btn-copy-icon"
                        title="Copy Email"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="credential-row">
                    <div className="credential-label">
                      <Key size={14} />
                      <span>Password</span>
                    </div>
                    <div className="credential-value-wrapper">
                      <code className="credential-code">{account.password}</code>
                      <button
                        onClick={() => handleCopy(account.password, 'Password')}
                        className="btn-copy-icon"
                        title="Copy Password"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login', { state: { prefilledEmail: account.email, prefilledPassword: account.password } })}
                  className="btn btn-secondary demo-action-btn"
                >
                  <span>Go to Login</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default DemoUser;
