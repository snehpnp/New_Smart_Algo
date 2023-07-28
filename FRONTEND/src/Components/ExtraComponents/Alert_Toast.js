import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastButton = ({ message, type }) => {
    const notify = () => type(message);

    return (
        <div>
            <button onClick={notify}>Make me a toast</button>
            <Toaster type />
        </div>
    );
};

export default ToastButton;
