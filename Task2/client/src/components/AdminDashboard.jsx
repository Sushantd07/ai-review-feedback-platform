import React, { useEffect, useState, useMemo } from 'react';
import {
    LayoutDashboard, Star, MessageSquare, AlertTriangle,
    CheckCircle, RefreshCw, Filter, ArrowDownUp,
    ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react';
import API_BASE_URL from '../config';

const AdminDashboard = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(new Date());

    // Filters and Sorting
    const [filterRating, setFilterRating] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

    // Expanded rows tracking
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const fetchData = async () => {
        try {
            if (reviews.length === 0) setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/reviews`);
            if (!res.ok) throw new Error('Failed to fetch reviews');
            const data = await res.json();
            setReviews(data);
            setLastRefreshed(new Date());
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load reviews. Backend might be unavailable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // 15 seconds
        return () => clearInterval(interval);
    }, []);

    const metrics = useMemo(() => {
        const total = reviews.length;
        if (total === 0) return { total: 0, average: 0, distribution: {} };

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = (sum / total).toFixed(1);

        const distribution = reviews.reduce((acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
        }, {});

        return { total, average, distribution };
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        let result = [...reviews];
        if (filterRating !== 'all') {
            result = result.filter(r => r.rating === parseInt(filterRating));
        }
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        return result;
    }, [reviews, filterRating, sortOrder]);

    const MetricCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
                {subtext && <div className="text-xs text-gray-400 dark:text-slate-500 mt-1">{subtext}</div>}
            </div>
            <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
                <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
            {/* Compact Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-3 sticky top-0 z-20 flex items-center justify-between shadow-sm transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 dark:bg-slate-700 p-1.5 rounded-md transition-colors">
                        <LayoutDashboard className="text-white" size={18} />
                    </div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                        Feedback Dashboard
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400 font-medium">
                    <span>
                        Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-slate-700 dark:text-slate-300"
                    >
                        <RefreshCw size={12} className={loading && reviews.length > 0 ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-md p-3 flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                        <AlertTriangle size={16} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard
                        label="Total Reviews"
                        value={metrics.total}
                        icon={MessageSquare}
                        colorClass="text-blue-600 bg-blue-600"
                    />
                    <MetricCard
                        label="Avg Rating"
                        value={metrics.average}
                        subtext="/ 5.0 scale"
                        icon={Star}
                        colorClass="text-yellow-500 bg-yellow-500"
                    />

                    {/* Distribution Mini-Chart */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 col-span-2 shadow-sm flex flex-col justify-center transition-colors">
                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Rating Distribution</span>
                        <div className="flex h-3 gap-0.5 w-full rounded-sm overflow-hidden bg-gray-100 dark:bg-slate-700">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const count = metrics.distribution[star] || 0;
                                const percent = (count / metrics.total) * 100 || 0;
                                // Enterprise colors
                                const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-600'];
                                return (
                                    <div
                                        key={star}
                                        style={{ width: `${percent}%` }}
                                        className={`${colors[star - 1]} hover:opacity-90 transition-opacity cursor-help`}
                                        title={`${star} Stars: ${count} reviews (${percent.toFixed(1)}%)`}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 mt-1.5 font-mono">
                            <span>1 ★</span>
                            <span>5 ★</span>
                        </div>
                    </div>
                </div>

                {/* Main Table Section */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm flex flex-col overflow-hidden transition-colors">

                    {/* Toolbar */}
                    <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-slate-800 dark:text-white">All Feedback</h2>
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full text-xs font-medium">{filteredReviews.length}</span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* Filter */}
                            <div className="relative">
                                <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                    className="pl-8 pr-8 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-xs bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 outline-none focus:border-indigo-500 hover:border-gray-400 transition-colors shadow-sm"
                                >
                                    <option value="all">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <button
                                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-xs font-medium bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 outline-none focus:border-indigo-500 transition-colors shadow-sm"
                            >
                                <ArrowDownUp size={14} className="text-gray-400" />
                                <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-2.5 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                        <div className="col-span-2 sm:col-span-1">Rating</div>
                        <div className="col-span-7 sm:col-span-8">Feedback</div>
                        <div className="col-span-2 text-right">Date</div>
                        <div className="col-span-1 text-center">AI</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800 transition-colors">
                        {loading && reviews.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 dark:text-slate-500 flex flex-col items-center">
                                <RefreshCw className="animate-spin mb-2" size={24} />
                                <span className="text-sm">Loading data...</span>
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 dark:text-slate-500 text-sm">No reviews found matching filters.</div>
                        ) : (
                            filteredReviews.map((review) => {
                                const isExpanded = expandedRows.has(review._id);
                                return (
                                    <div key={review._id} className={`group transition-colors ${isExpanded ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>

                                        {/* Row Content */}
                                        <div
                                            onClick={() => toggleRow(review._id)}
                                            className="grid grid-cols-12 gap-4 px-6 py-3 items-center cursor-pointer"
                                        >
                                            {/* Rating */}
                                            <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
                                                <Star
                                                    size={14}
                                                    className={`${review.rating >= 4 ? 'fill-green-500 text-green-500' : review.rating <= 2 ? 'fill-red-500 text-red-500' : 'fill-yellow-500 text-yellow-500'}`}
                                                />
                                                <span className={`text-sm font-bold ${review.rating >= 4 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>
                                                    {review.rating}.0
                                                </span>
                                            </div>

                                            {/* Feedback Text Truncated */}
                                            <div className="col-span-7 sm:col-span-8">
                                                <p className={`text-sm text-gray-800 dark:text-slate-300 truncate ${isExpanded ? 'whitespace-normal font-medium' : ''}`}>
                                                    {review.text}
                                                </p>
                                            </div>

                                            {/* Date */}
                                            <div className="col-span-2 text-right flex flex-col justify-center">
                                                <span className="text-xs text-gray-500 dark:text-slate-400 font-mono">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] text-gray-400 dark:text-slate-500 hidden sm:block">
                                                    {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* AI Status / Expand Icon */}
                                            <div className="col-span-1 flex justify-center text-gray-400 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                                {isExpanded ? <ChevronUp size={16} /> : <div className="flex gap-1"><MoreHorizontal size={16} /></div>}
                                            </div>
                                        </div>

                                        {/* Expanded Details Panel */}
                                        {isExpanded && (
                                            <div className="px-6 pb-6 pt-4 grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors">
                                                {/* Full Text */}
                                                <div className="md:col-span-8 text-sm text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block mb-2 opacity-90">
                                                        Full Review
                                                    </span>
                                                    {review.text}
                                                    {/* User Response Preview (if available in future) */}
                                                    {review.aiResponse && (
                                                        <div className="mt-4 p-3 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-lg shadow-sm transition-colors">
                                                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                                                                AI Response Sent to User
                                                            </span>
                                                            <p className="text-slate-600 dark:text-slate-400 italic">"{review.aiResponse}"</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* AI Analysis Sidebar */}
                                                <div className="md:col-span-4 space-y-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-600 dark:text-indigo-400">
                                                            <CheckCircle size={14} />
                                                        </div>
                                                        <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">AI Analysis</span>
                                                    </div>

                                                    {review.aiSummary && (
                                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Summary</span>
                                                            <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">{review.aiSummary}</p>
                                                        </div>
                                                    )}

                                                    {review.aiAction && (
                                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-indigo-200 dark:border-indigo-500/30 shadow-sm transition-colors">
                                                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold block mb-1">Recommended Action</span>
                                                            <p className="text-xs text-indigo-900 dark:text-indigo-300 font-semibold">{review.aiAction}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
