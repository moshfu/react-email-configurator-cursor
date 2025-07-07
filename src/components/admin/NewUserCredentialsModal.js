import React from 'react';

const NewUserCredentialsModal = ({ user, onClose }) => {
    const credentialsText = `Username: ${user.username}\nPassword: ${user.password} (will need to be changed upon first login)`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(credentialsText);
        alert('Credentials copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">New User Created</h2>
                <p className="text-gray-600 mb-6">Please securely share the following credentials with the new user.</p>
                <div className="bg-gray-100 p-4 rounded-md mb-6">
                    <pre className="text-gray-800 whitespace-pre-wrap"><code>{credentialsText}</code></pre>
                </div>
                <div className="flex gap-4">
                    <button onClick={copyToClipboard} className="w-full nav-button-primary">Copy Credentials</button>
                    <button onClick={onClose} className="w-full nav-button-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};

export default NewUserCredentialsModal;
