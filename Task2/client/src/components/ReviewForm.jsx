import React, { useState, useRef, useEffect } from 'react';
import StarRating from './StarRating';
import ResponseCard from './ResponseCard';
import { AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import API_BASE_URL from '../config';

const ReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);
    const responseRef = useRef(null);

    const MAX_CHARS = 1500;

    useEffect(() => {
        if (status === 'success' && response) {
            const timer = setTimeout(() => {
                responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [status, response]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (!text.trim()) {
            setError('Please write a review.');
            return;
        }

        setStatus('submitting');
        setError('');
        setResponse(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, text }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit review');
            }

            const data = await res.json();
            setStatus('success');
            setResponse(data.aiResponse);
            setRating(0);
            setText('');
        } catch (err) {
            console.error(err);
            setStatus('error');
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                <div className="p-5">
                    <div className="flex flex-col items-center mb-5 text-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Feedback</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400">How was your experience?</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Rating Section - Minimal */}
                        <div className="flex justify-center pb-2">
                            <StarRating rating={rating} onRatingChange={setRating} disabled={status === 'submitting'} />
                        </div>

                        {/* Application Error */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2.5 rounded text-sm">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Text Area */}
                        <div className="relative">
                            <label htmlFor="review" className="sr-only">Your Review</label>
                            <textarea
                                id="review"
                                value={text}
                                onFocus={(e) => {
                                    // Scroll into view when focused (fixes mobile keyboard hiding input)
                                    setTimeout(() => {
                                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 300);
                                }}
                                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                                disabled={status === 'submitting'}
                                placeholder="Tell us more details..."
                                className="w-full min-h-[120px] p-3 text-sm text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y placeholder:text-gray-400 dark:placeholder:text-slate-500"
                            />
                            <div className={`absolute bottom-2 right-2 text-[10px] font-medium transition-colors ${text.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-300 dark:text-slate-600'
                                }`}>
                                {text.length} / {MAX_CHARS}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className={`w-full h-10 px-4 rounded-md text-sm font-medium text-white transition-all flex items-center justify-center gap-2 ${status === 'submitting'
                                ? 'bg-indigo-400 dark:bg-indigo-500/50 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 active:scale-[0.99] shadow-sm'
                                }`}
                        >
                            {status === 'submitting' ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Feedback</span>
                                </>
                            )}
                        </button>

                        {/* Mobile Keyboard Spacer */}
                        <div className="h-64 md:h-0 w-full" aria-hidden="true" />
                    </form>
                </div>
            </div>

            {/* Response Section */}
            {status === 'success' && response && (
                <div ref={responseRef} className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <ResponseCard response={response} />
                </div>
            )}
        </div>
    );
};

export default ReviewForm;
