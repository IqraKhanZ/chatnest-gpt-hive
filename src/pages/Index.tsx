
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import ChatRoom from '@/components/ChatRoom';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-mint-cream text-xl font-inter">Loading...</div>
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
