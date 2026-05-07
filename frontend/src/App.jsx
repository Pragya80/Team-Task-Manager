import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Settings from './pages/Settings';

const Layout = () => (
  <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
    <Navbar />
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </main>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/dashboard" element={<Dashboard />} />
          <Route path="/projects/:id/team" element={<Team />} />
          <Route path="/projects/:id/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/projects" replace />} />
      <Route path="*" element={
        <div className="flex h-screen flex-col items-center justify-center p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Page not found</p>
        </div>
      } />
    </Routes>
  );
};

export default App;
