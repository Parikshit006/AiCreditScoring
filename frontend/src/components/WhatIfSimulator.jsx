import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const SLIDER_CONFIG = [
    { key: 'RevolvingUtilizationOfUnsecuredLines', label: 'Credit Utilization', min: 0, max: 1.5, step: 0.01 },
    { key: 'DebtRatio', label: 'Debt Ratio', min: 0, max: 2, step: 0.05 },
    { key: 'MonthlyIncome', label: 'Monthly Income', min: 1000, max: 20000, step: 500 },
    { key: 'NumberOfOpenCreditLinesAndLoans', label: 'Open Credit Lines', min: 0, max: 20, step: 1 },
    { key: 'age', label: 'Age', min: 18, max: 100, step: 1 }
];

const INITIAL_STATE = {
    RevolvingUtilizationOfUnsecuredLines: 0.3,
    age: 40,
    NumberOfTime3059DaysPastDueNotWorse: 0,
    DebtRatio: 0.4,
    MonthlyIncome: 5000,
    NumberOfOpenCreditLinesAndLoans: 8,
    NumberOfTimes90DaysLate: 0,
    NumberRealEstateLoansOrLines: 1,
    NumberOfTime6089DaysPastDueNotWorse: 0,
    NumberOfDependents: 1
};

const WhatIfSimulator = () => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [prediction, setPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Debounce prediction
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPrediction();
        }, 500);
        return () => clearTimeout(timer);
    }, [formData]);

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/what-if`, formData);
            setPrediction(response.data);
            setHistory(prev => {
                const newHistory = [...prev, { time: prev.length + 1, prob: response.data.default_probability }];
                return newHistory.slice(-10); // Keep last 10 points
            });
        } catch (error) {
            console.error("Simulation error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSliderChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: parseFloat(value)
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Simulation Controls</h2>
                    <button
                        onClick={() => setFormData(INITIAL_STATE)}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                    >
                        <RefreshCw size={14} className="mr-1" /> Reset
                    </button>
                </div>

                <div className="space-y-6">
                    {SLIDER_CONFIG.map((config) => (
                        <div key={config.key}>
                            <div className="flex justify-between mb-1">
                                <label className="text-sm text-gray-400">{config.label}</label>
                                <span className="text-sm font-mono text-white">{formData[config.key]}</span>
                            </div>
                            <input
                                type="range"
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                value={formData[config.key]}
                                onChange={(e) => handleSliderChange(config.key, e.target.value)}
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                {/* Real-time Result */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <RefreshCw size={120} />
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Live Probability Impact</h2>

                    {prediction ? (
                        <div className="mt-8 flex items-end">
                            <div className="mr-8">
                                <p className="text-sm text-gray-400 uppercase tracking-wider">Estimated Default Risk</p>
                                <p className={`text-6xl font-black ${prediction.default_probability < 0.2 ? 'text-green-500' :
                                    prediction.default_probability < 0.5 ? 'text-yellow-500' : 'text-red-500'
                                    }`}>
                                    {(prediction.default_probability * 100).toFixed(1)}%
                                </p>
                            </div>

                            <div className="mb-2">
                                <p className="text-sm text-gray-400 uppercase tracking-wider">Risk Category</p>
                                <p className="text-2xl font-bold text-white">{prediction.risk_category}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-gray-500">
                            Initializing simulation...
                        </div>
                    )}
                </div>

                {/* History Chart */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-64">
                    <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Simulation Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[0, 1]} tick={{ fill: '#9CA3AF' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="prob"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#3B82F6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default WhatIfSimulator;
