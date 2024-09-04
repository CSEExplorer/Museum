import React from 'react';

const Help = () => {
    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
      backgroundColor: ''
    };

    const searchSectionStyle = {
        marginBottom: '2rem',
        textAlign: 'center',
           backgroundColor: '#FAEBEB'

    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    };

    const commonQuestionsStyle = {
        marginTop: '2rem'
    };

    const listStyle = {
        listStyleType: 'none',
        padding: '0'
    };

    const listItemStyle = {
        padding: '8px 0',
        borderBottom: '1px solid #ddd'
    };

    const answerStyle = {
        marginTop: '0.5rem',
        fontSize: '14px',
        color: '#555'
    };

    return (
        <div style={containerStyle}>
            <div style={searchSectionStyle}>
                <h1>How Can We Help You?</h1>
                <input
                    type="search"
                    placeholder="Search..."
                    style={inputStyle}
                />
            </div>
            <div style={commonQuestionsStyle}>
                <h2>Here are some common questions:</h2>
                <ul style={listStyle}>
                    <li style={listItemStyle}>
                        How do I reset my password?
                        <div style={answerStyle}>
                            To reset your password, go to the login page and click on "Forgot password?". Follow the instructions to reset it.
                        </div>
                    </li>
                    <li style={listItemStyle}>
                        Where can I find my order history?
                        <div style={answerStyle}>
                            Your order history can be found in the "My Orders" section under your account settings.
                        </div>
                    </li>
                    <li style={listItemStyle}>
                        How can I contact customer support?
                        <div style={answerStyle}>
                            You can contact customer support by emailing support@example.com or calling 1-800-123-4567.
                        </div>
                    </li>
                    <li style={listItemStyle}>
                        What is the return policy?
                        <div style={answerStyle}>
                            Our return policy allows returns within 30 days of purchase. Please check our website for full details.
                        </div>
                    </li>
                    <li style={listItemStyle}>
                        How do I update my account information?
                        <div style={answerStyle}>
                            To update your account information, log in to your account and go to "Account Settings".
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Help;
