import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // These are provided by React at runtime. Explicit declarations also support
  // the project's existing setup, which does not install @types/react.
  declare readonly props: Readonly<Props>;
  declare state: State;
  declare setState: (state: Partial<State>) => void;
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro não tratado:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-3xl border border-red-500/30 bg-[#141012] p-8 text-center space-y-4 max-w-2xl mx-auto my-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black font-display uppercase text-white">
            {this.props.fallbackTitle || 'Ocorreu uma instabilidade na exibição'}
          </h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Não foi possível exibir esta seção. Tente novamente.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold font-mono text-xs uppercase transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20"
          >
            <RotateCcw className="w-4 h-4" />
            Recarregar Visualização
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

