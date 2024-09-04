import React from 'react';
import museum1 from './museum1.jpg';

const Information = () => {
  return (
    <>
    <div style={styles.background}>
     
    </div>
     <p>
     Write information here.
   </p>
   <button type="button" class="btn btn-primary">Book your Ticket</button>
   </>
  );
};

const styles = {
  background: {
    backgroundImage: `url(${museum1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '40vh',
    color: 'white', // Adjust text color for better visibility
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }
};

export default Information;
