import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="xplode-error-page">
          <a className="xplode-error-brand" href="/store" aria-label="Xplode store"><img src="/New%20Assets/LOGO.svg" alt="Xplode" /></a>
          <section className="xplode-error-content" aria-labelledby="xplode-error-title">
            <span className="xplode-error-mark" aria-hidden="true"><img src="/New%20Assets/favicon-white.svg" alt="" /></span>
            <p className="xplode-error-label">SOMETHING WENT WRONG</p>
            <h1 id="xplode-error-title">Let's get you<br />back in the game.</h1>
            <p className="xplode-error-copy">We couldn't load this page. Try refreshing, or head back to the store.</p>
            <div className="xplode-error-actions"><button type="button" onClick={() => window.location.reload()}>Refresh page</button><a href="/store">Back to store <span aria-hidden="true">↗</span></a></div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
