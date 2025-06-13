
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import ChatRoom from '@/components/ChatRoom';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center">
        <div className="text-green-100 text-xl">Loading...</div>
      </div>
    );
  }

  return user ? <ChatRoom /> : <AuthForm />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
