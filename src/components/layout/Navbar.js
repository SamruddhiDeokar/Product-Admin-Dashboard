'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { ROUTES } from '@/utils/constants';
import { LogOut, Package, ShieldCheck, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return null;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href={ROUTES.DASHBOARD} className="brand-logo" id="nav-brand-logo">
          <div className="brand-icon">
            <Package size={20} />
          </div>
          <div>
            Nexus<span className="brand-gradient">Store</span>
          </div>
          <span className="brand-badge">Admin</span>
        </Link>

        <div className="nav-actions">
          {user && (
            <div className="user-pill" id="user-profile-pill">
              <div className="user-avatar">
                {user.image ? (
                  <img src={user.image} alt={user.firstName || user.username} />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
                </span>
                <span className="user-role">{user.email || 'Administrator'}</span>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            id="nav-logout-btn"
            title="Log out of your account"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
