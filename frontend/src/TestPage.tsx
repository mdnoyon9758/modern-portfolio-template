import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TailwindCSS Test</h1>
        <p className="text-gray-600 mb-4">If you can see blue background and this white card, TailwindCSS is working!</p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestPage;
