import { Component, type ErrorInfo, type ReactNode } from 'react';
import ErrorScreen from './ui/ErrorScreen';

type ErrorBoundaryState = {
  error: Error | null;
};

type ErrorBoundaryProps = {
  children: ReactNode;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crash:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <ErrorScreen title="App 发生错误" message={this.state.error.message} />;
    }
    return this.props.children;
  }
}
