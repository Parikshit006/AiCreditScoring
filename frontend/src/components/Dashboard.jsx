```
import { useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, XCircle, Info, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import CreditCoach from './CreditCoach';

// Use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const INITIAL_FORM_STATE = {
    RevolvingUtilizationOfUnsecuredLines: 0.05,
    age: 35,
    NumberOfTime3059DaysPastDueNotWorse: 0,
    DebtRatio: 0.2,
    MonthlyIncome: 5000,
    NumberOfOpenCreditLinesAndLoans: 5,
    NumberOfTimes90DaysLate: 0,
    NumberRealEstateLoansOrLines: 1,
    NumberOfTime6089DaysPastDueNotWorse: 0,
    NumberOfDependents: 1
};

const FIELD_LABELS = {
    RevolvingUtilizationOfUnsecuredLines: "Credit Utilization (0-1)",
    age: "Age",
    NumberOfTime3059DaysPastDueNotWorse: "Late Payments (30-59 days)",
    DebtRatio: "Debt Ratio (Monthly Debt/Income)",
    MonthlyIncome: "Monthly Income ($)",
    NumberOfOpenCreditLinesAndLoans: "Open Credit Lines",
    NumberOfTimes90DaysLate: "Late Payments (90+ days)",
    NumberRealEstateLoansOrLines: "Real Estate Loans",
    NumberOfTime6089DaysPastDueNotWorse: "Late Payments (60-89 days)",
    NumberOfDependents: "Dependents"
};

const Dashboard = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const calculateRisk = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${ API_URL }/predict`, formData);
setResult(response.data);
        } catch (err) {
    console.error(err);
    setError("Failed to calculate risk. Ensure backend is running.");
} finally {
    setLoading(false);
}
    };

const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-green-500';
    if (risk === 'Medium') return 'text-yellow-500';
    return 'text-red-500';
};

const getScoreColor = (prob) => {
    // Green (low prob) -> Red (high prob)
    const r = Math.min(255, Math.floor(prob * 2 * 255));
    const g = Math.min(255, Math.floor((1 - prob) * 2 * 255));
    return `rgb(${r},${g},0)`;
};

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                Applicant Details
            </h2>
            <div className="space-y-4 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {Object.keys(INITIAL_FORM_STATE).map((key) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            {FIELD_LABELS[key]}
                        </label>
                        <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={calculateRisk}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                    <>Analyze Risk <ChevronRight className="ml-2 w-5 h-5" /></>
                )}
            </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3" />
                    {error}
                </div>
            )}

            {!result && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl p-12">
                    <LayoutDashboard className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg">Enter applicant details to assess credit risk.</p>
                </div>
            )}

            {result && (
                <>
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                {result.decision === 'Approve' ? <CheckCircle size={100} /> : <XCircle size={100} />}
                            </div>
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Decision</h3>
                            <div className={`text-4xl font-black mt-2 ${result.decision === 'Approve' ? 'text-green-400' :
                                result.decision === 'Review' ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {result.decision.toUpperCase()}
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Default Prediction</h3>
                            <div className="flex items-end mt-2">
                                <span className="text-4xl font-bold text-white mr-2">
                                    {(result.default_probability * 100).toFixed(1)}%
                                </span>
                                <span className="text-sm text-gray-400 mb-1">probability</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2 rounded-full mt-4">
                                <div
                                    className="h-2 rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${result.default_probability * 100}%`,
                                        backgroundColor: getScoreColor(result.default_probability)
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Risk Category</h3>
                            <div className={`text-3xl font-bold mt-2 ${getRiskColor(result.risk_category)}`}>
                                {result.risk_category}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Based on XGBoost Model Analysis
                            </p>
                        </div>
                    </div>

                    {/* Explanation & SHAP */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-lg font-bold mb-4 flex items-center text-white">
                                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                                Key Risk Drivers (SHAP)
                            </h3>
                            <div className="space-y-4">
                                {result.top_3_risk_factors.map((factor, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-300 font-medium">{factor.feature}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${factor.impact > 0 ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
                                                }`}>
                                                {factor.impact > 0 ? 'Increases Risk' : 'Reduces Risk'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 h-1.5 rounded-full">
                                            <div
                                                className={`h-1.5 rounded-full ${factor.impact > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min(100, Math.abs(factor.impact) * 20)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                <p className="text-sm text-gray-300 italic">
                                    "{result.explanation_text}"
                                </p>
                            </div>
                        </div>

                        {/* Credit Coach (Only if Rejected) */}
                        {result.decision === 'Reject' && (
                            <CreditCoach result={result} formData={formData} />
                        )}
                        {result.decision !== 'Reject' && (
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col items-center justify-center text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold text-white">Looking Good!</h3>
                                <p className="text-gray-400 mt-2">
                                    This applicant demonstrates a strong financial profile. No immediate actions required.
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    </div>
);
};

// Placeholder for LayoutDashboard icon since I used it in empty state
function LayoutDashboard({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
    );
}

export default Dashboard;
