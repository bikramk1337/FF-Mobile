import React, { useState } from 'react'
import validateEmail from '../util/validateEmail';

const emailValidation = () => {
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);

    const handleEmail = (emailVar) => {
        setEmail(emailVar);
        setEmailVerified(validateEmail(emailVar))

    };

    return { email, emailVerified, setEmail, handleEmail };
}

export default emailValidation