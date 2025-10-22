import React, { useEffect } from 'react';
import '../styles/Notification.css';

function Notification({ message, type = 'info', duration = 3000, onClose }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose(); 
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) {
        return null;
    }

    const notificationClass = `notification show ${type}`;

    return (
        <div className={notificationClass}>
            {message}
        </div>
    );
}

export default Notification;