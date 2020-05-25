import React, { Component } from 'react';
import PT from 'prop-types';

import Footer from '../Footer/Footer';
import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
    state = {
        error: null
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (!error) return children;

        const { name, message } = error;

        return (
            <div className="error-boundary">
                <div className="error-boundary__content">
                    <div className="error-boundary__body">
                        <div className="error-boundary__top">
                            <h1 className="error-boundary__title">{name}</h1>
                            <i className="fas fa-bug error-boundary__icon" />
                        </div>
                        
                        <p className="error-boundary__text">{message}</p>

                        <a href="/" className="error-boundary__link">
                            Return to previous page
                        </a>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

ErrorBoundary.propTypes = {
    children: PT.oneOfType([
        PT.object,
        PT.arrayOf(PT.object),
        PT.bool
    ]).isRequired
};

export default ErrorBoundary;
