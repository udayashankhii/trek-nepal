import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-50 p-4 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-8">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReload}
                                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition gap-2 shadow-lg shadow-indigo-200"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload Page
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                            >
                                Go to Homepage
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left">
                                <div className="p-4 bg-slate-900 rounded-lg overflow-auto max-h-48">
                                    <p className="text-red-400 font-mono text-xs mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    <pre className="text-slate-400 font-mono text-xs whitespace-pre-wrap">
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
