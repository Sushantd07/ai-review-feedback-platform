import React from 'react';
import { Bot, MessageCircle } from 'lucide-react';

const ResponseCard = ({ response }) => {
    if (!response) return null;

    return (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm shrink-0 transition-colors">
                    <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Response</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                        {response}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResponseCard;
