import React, { useState } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import BugForm from './components/BugForm';
import BugList from './components/BugList';

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [editingBugId, setEditingBugId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setEditingBugId(null);
    setCurrentView('form');
  };

  const handleEdit = (bugId) => {
    setEditingBugId(bugId);
    setCurrentView('form');
  };

  const handleFormSubmit = () => {
    setCurrentView('list');
    setEditingBugId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setCurrentView('list');
    setEditingBugId(null);
  };

  const handleDelete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>Bug Tracker</h1>
          <nav>
            <button 
              onClick={() => setCurrentView('list')}
              className={currentView === 'list' ? 'active' : ''}
            >
              Bug List
            </button>
            <button 
              onClick={handleCreateNew}
              className={currentView === 'form' ? 'active' : ''}
            >
              Report Bug
            </button>
          </nav>
        </header>

        <main className="App-main">
          {currentView === 'list' ? (
            <BugList 
              onEdit={handleEdit}
              onDelete={handleDelete}
              refreshTrigger={refreshTrigger}
            />
          ) : (
            <BugForm 
              bugId={editingBugId}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
