import React from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginScreen } from './auth/Login';
import { ChangePasswordModal } from './auth/ChangePasswordModal';
import { Configurator } from './Configurator'; // We will create this next

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (user.mustChangePassword) {
    return (
      <>
        <Configurator /> {/* Show blurred background */}
        <ChangePasswordModal />
      </>
    );
  }

  return <Configurator />;
}

export default App;
