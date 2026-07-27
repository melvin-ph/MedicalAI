import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in workstation component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="ws-error-boundary flex flex-col items-center justify-center p-8 text-center" style={{ minHeight: '300px', background: 'var(--bg-panel)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <AlertTriangle size={42} className="text-warning mb-3" />
          <h2 className="text-lg font-bold text-primary mb-2">Clinical Workstation Encountered an Issue</h2>
          <p className="text-xs text-muted mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected rendering error occurred in the active viewport/panel.'}
          </p>
          <button 
            className="ws-btn-secondary flex items-center gap-2"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RotateCcw size={14} />
            Recover Workstation Panel
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
