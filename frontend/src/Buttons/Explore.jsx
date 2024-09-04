// Explore.jsx
import React, { useState } from 'react';

const Explore = () => {
  // State for search/filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Example data for featured exhibits
  const exhibits = [
    { id: 1, title: 'Ancient Egypt', description: 'Explore the wonders of Ancient Egypt.', category: 'History' },
    { id: 2, title: 'Renaissance Art', description: 'Discover masterpieces from the Renaissance era.', category: 'Art' },
    { id: 3, title: 'Space Exploration', description: 'Learn about the history of space exploration.', category: 'Science' },
  ];

  // Filter exhibits based on search term and selected category
  const filteredExhibits = exhibits.filter(exhibit => 
    (selectedCategory === 'All' || exhibit.category === selectedCategory) &&
    exhibit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    searchFilter: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      width: '200px',
    },
    select: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    featuredExhibits: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    exhibitCard: {
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    button: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '16px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Explore Our Museum</h1>

      {/* Search and Filter */}
      <div style={styles.searchFilter}>
        <input 
          type="text" 
          placeholder="Search exhibits..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={styles.input}
        />
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="All">All Categories</option>
          <option value="History">History</option>
          <option value="Art">Art</option>
          <option value="Science">Science</option>
        </select>
      </div>

      {/* Featured Exhibits */}
      <div style={styles.featuredExhibits}>
        {filteredExhibits.map(exhibit => (
          <div key={exhibit.id} style={styles.exhibitCard}>
            <h2>{exhibit.title}</h2>
            <p>{exhibit.description}</p>
            <button style={styles.button} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}>
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
