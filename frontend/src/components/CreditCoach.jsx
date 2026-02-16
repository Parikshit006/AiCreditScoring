import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, Sparkles, TrendingDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const CreditCoach = ({ result, formData }) => {
    const [improvedResult, setImprovedResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        generateSuggestions();
    }, [result]);

    const generateSuggestions = () => {
        // fast heuristic based on high risk factors or just common sense rules
        // In a real app, this might come from the backend's counterfactual analysis

        const newSuggestions = [];
        const modifiedFormData = { ...formData };

        // Check Debt Ratio
        if (formData.DebtRatio > 0.4) {
            newSuggestions.push({
                label: "Reduce Debt Ratio",
                action: "Pay down existing debts to lower ratio below 40%",
                original: formData.DebtRatio,
                target: 0.35,
                field: "DebtRatio"
            });
            modifiedFormData.DebtRatio = 0.35;
        }

        // Check Late Payments
        if (formData.NumberOfTimes90DaysLate > 0) {
            newSuggestions.push({
                label: "Avoid Late Payments",
                action: "Ensure no new late payments for 6 months",
                original: formData.NumberOfTimes90DaysLate,
                target: 0,
                field: "NumberOfTimes90DaysLate"
            });
            modifiedFormData.NumberOfTimes90DaysLate = 0;
        }

        if (formData.NumberOfTime3059DaysPastDueNotWorse > 0) {
            newSuggestions.push({
                label: "Improve Payment History",
                action: "Clear recent 30-day delinquencies",
                original: formData.NumberOfTime3059DaysPastDueNotWorse,
                target: 0,
                field: "NumberOfTime3059DaysPastDueNotWorse"
            });
            modifiedFormData.NumberOfTime3059DaysPastDueNotWorse = 0;
        }

        // Check Utilization
        if (formData.RevolvingUtilizationOfUnsecuredLines > 0.3) {
            newSuggestions.push({
                label: "Lower Credit Utilization",
                action: "Pay down credit cards below 30% limit",
                original: formData.RevolvingUtilizationOfUnsecuredLines,
                target: 0.25,
                field: "RevolvingUtilizationOfUnsecuredLines"
            });
            modifiedFormData.RevolvingUtilizationOfUnsecuredLines = 0.25;
        }

        setSuggestions(newSuggestions);
        if (newSuggestions.length > 0) {
            simulateImprovement(modifiedFormData);
        }
    };

    const simulateImprovement = async (modifiedData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/what-if`, modifiedData);
            setImprovedResult(response.data);
        } catch (err) {
            console.error("Coach simulation failed", err);
        } finally {
            setLoading(false);
        }
    };

    if (suggestions.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 rounded-xl border border-blue-500 shadow-lg text-white">
            <div className="flex items-center mb-4">
                <Sparkles className="w-6 h-6 text-yellow-300 mr-2" />
                <h3 className="text-xl font-bold">AI Credit Coach Plan</h3>
            </div>

            <p className="mb-4 text-blue-200">
                Based on our analysis, taking these actions could significantly improve your approval odds.
            </p>

            <div className="space-y-3 mb-6">
                {suggestions.map((s, idx) => (
                    <div key={idx} className="bg-white/10 p-3 rounded-lg flex items-start">
                        <div className="bg-green-500 rounded-full p-1 mt-1 mr-3">
                            <TrendingDown size={14} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">{s.label}</p>
                            <p className="text-xs text-gray-300">{s.action}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <div className="text-center text-sm animate-pulse">Running simulation...</div>}

            {!loading && improvedResult && (
                <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Current Probability</span>
                        <span className="font-bold text-red-400">{(result.default_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Projected Probability</span>
                        <span className="font-bold text-green-400">{(improvedResult.default_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-2 relative">
                        <div className="absolute top-0 left-0 h-2 bg-red-500 rounded-full opacity-50" style={{ width: `${result.default_probability * 100}%` }}></div>
                        <div className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" style={{ width: `${improvedResult.default_probability * 100}%` }}></div>
                    </div>
                    <div className="mt-3 text-center">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                            {improvedResult.decision === 'Approve' ? 'Likely Approval' : 'Improved Chances'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditCoach;
