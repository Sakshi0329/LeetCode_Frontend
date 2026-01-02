import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Video, Sun, Moon } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload and delete videos',
      icon: Video,
      color: 'btn-primary',
      bgColor: 'bg-primary/20',
      route: '/admin/video'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center  md:text-left md:flex-1">
            <h1 className="text-4xl font-bold  text-base-content mb-4">
              Admin Panel
            </h1>
            <p className="text-base-content/70 text-lg md:text-xl">
              Manage coding problems and videos on your platform
            </p>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mt-4 md:mt-0">
            <button
              className="btn btn-ghost btn-sm flex items-center gap-2"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl cursor-pointer"
              >
                <div className="card-body items-center text-center p-8">
                  {/* Icon */}
                  <div
                    className={`${option.bgColor} p-5 rounded-full mb-4 flex items-center justify-center`}
                  >
                    <IconComponent size={36} className="text-base-content" />
                  </div>

                  {/* Title */}
                  <h2 className="card-title text-2xl md:text-xl font-semibold mb-2 text-base-content">
                    {option.title}
                  </h2>

                  {/* Description */}
                  <p className="text-base-content/70 text-sm md:text-base mb-6">
                    {option.description}
                  </p>

                  {/* Action Button */}
                  <NavLink
                    to={option.route}
                    className={`btn ${option.color} btn-wide text-white hover:scale-105 transition-transform`}
                  >
                    {option.title}
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
