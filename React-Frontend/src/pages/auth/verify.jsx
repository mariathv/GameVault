import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/src/api/users';
import { CheckCircle, XCircle, Clock, RefreshCw, Home } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    // Use a ref to track if verification has been attempted
    const verificationAttempted = useRef(false);
    // Use a ref to track the timer
    const timerRef = useRef(null);

    useEffect(() => {
        // Only run verification if it hasn't been attempted yet
        if (!verificationAttempted.current) {
            verificationAttempted.current = true;

            const verifyUserEmail = async () => {
                try {
                    const response = await verifyEmail(token);
                    console.log("Verification successful:", response);
                    setStatus('success');

                    // Start the countdown timer
                    timerRef.current = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timerRef.current);
                                navigate('/login');
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                } catch (err) {
                    console.error('Verification error:', err);
                    setStatus('error');
                }
            };

            verifyUserEmail();
        }

        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [token, navigate]);

    const handleResendEmail = () => {
        navigate('/register');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-full max-w-md mb-20 rounded-lg bg-gray-800 p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="mb-6 text-3xl font-bold text-white">Email Verification</h2>

                    {status === 'loading' && (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <Clock className="h-16 w-16 animate-pulse text-blue-400" />
                            <p className="text-lg text-gray-300">Verifying your email...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-400" />
                            <p className="text-lg text-gray-300">Email verified successfully!</p>
                            <p className="text-sm text-gray-400">
                                Redirecting to "login page" in {countdown} seconds...
                            </p>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    Go to Login
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Home
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <XCircle className="h-16 w-16 text-red-400" />
                            <p className="text-lg text-gray-300">Invalid or expired verification link.</p>
                            <button
                                onClick={handleResendEmail}
                                className="mt-4 flex items-center rounded bg-yellow-600 px-4 py-2 font-medium text-white transition hover:bg-yellow-700"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Back to Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;