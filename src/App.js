import React, { PureComponent } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ErrorBoundary from './shared/components/ErrorBoundary/ErrorBoundary';
import Layout from './shared/components/Layout/Layout';
import Home from './pages/Home/Home';
import FullMovie from './pages/FullMovie/FullMovie';
import Profile from './pages/Profile/Profile';
import Auth from './pages/Auth/Auth';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import FavoriteMovies from './pages/FavoriteMovies/FavoriteMovies';
import { authenticateUser } from './store/actions/auth';
import { fetchFavoriteMovies, addMovieToFavorite, removeMovieFromFavorite } from './store/actions/favoriteMovies';
import { axiosMovies } from './shared/utils/axiosInstances';

const API_KEY = '1a67fd8fb5bbd9369d8ed3886f1ac2e2';

class App extends PureComponent {
    state = {
        search: '',
        movies: [],
        isFetching: false
    }

    componentDidMount() {
        const { authenticateUser, fetchFavoriteMovies } = this.props;

        const idToken = localStorage.getItem('idToken');
        const localId = localStorage.getItem('localId');
        const databaseKey = localStorage.getItem('databaseKey');

        const isAuthenticated = !!idToken && !!localId && !!databaseKey;

        if (!isAuthenticated) {
            localStorage.removeItem('idToken');
            localStorage.removeItem('localId');
            localStorage.removeItem('databaseKey');
            return;
        }

        authenticateUser(idToken, localId, databaseKey);
        this.fetchMovies('avengers');
        fetchFavoriteMovies(databaseKey);
    }

    componentDidUpdate(prevProps) {
        const { isAuthenticated, fetchFavoriteMovies, databaseKey } = this.props;

        if (!prevProps.isAuthenticated && isAuthenticated) {
            this.fetchMovies('avengers');
            fetchFavoriteMovies(databaseKey);
        }
    }

    onChangeInputHandler = e => {
        const { name, value } = e.target;

        this.setState({ [name]: value });
    }

    fetchMovies = (query, afterSuccessfulFetch) => {
        this.setState({ isFetching: true });

        axiosMovies.get(`/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1`)
            .then(response => {
                if (!response.data) return;

                const movies = response.data.results;

                setTimeout(() => {
                    this.setState({ movies });
                }, 1000);
            })
            .catch(error => {
                console.log('[error]', error);
            })
            .finally(() => {
                setTimeout(() => {
                    this.setState({ isFetching: false });

                    if (!afterSuccessfulFetch) return;

                    afterSuccessfulFetch();
                }, 1000);
            });
    }

    searchMovies = () => {
        const { search } = this.state;

        if (!search) return;

        const { history } = this.props;

        this.fetchMovies(search, () => history.push('/'));
    }

    render() {
        const { search, movies, isFetching } = this.state;
        const { favoriteMovies, addMovieToFavorite, removeMovieFromFavorite } = this.props;

        const idToken = localStorage.getItem('idToken');
        const localId = localStorage.getItem('localId');

        const isAuthenticated = !!idToken && !!localId;

        return (
            <ErrorBoundary>
                <Layout
                    search={search}
                    isFetching={isFetching}
                    onChangeInput={this.onChangeInputHandler}
                    searchMovies={this.searchMovies}
                >
                    <Switch>
                        {
                            !isAuthenticated &&
                                <>
                                    <Route path="/auth" component={Auth} />
                                    <Redirect to="/auth" />
                                </>
                        }

                        <Route path="/" exact render={() => (
                            <Home movies={movies} />
                        )} />

                        <Route path="/movies/:movieId" render={props => (
                            <FullMovie
                                {...props}
                                movies={movies}
                                favoriteMovies={favoriteMovies}
                                addMovieToFavorite={addMovieToFavorite}
                                removeMovieFromFavorite={removeMovieFromFavorite}
                            />
                        )} />

                        <Route path="/favorite-movies" render={() => (
                            <FavoriteMovies movies={favoriteMovies} />
                        )} />

                        <Route path="/profile" component={Profile} />
                        <Route path="/404" component={PageNotFound} />

                        <Redirect from="/auth" to="/" />
                        <Redirect to="/404" />
                    </Switch>
                </Layout>
            </ErrorBoundary>
        );
    }
}

export default connect(
    state => ({
        isAuthenticated: !!state.auth.idToken,
        databaseKey: state.auth.databaseKey,
        favoriteMovies: state.favoriteMovies.movies
    }),
    {
        authenticateUser,
        fetchFavoriteMovies,
        addMovieToFavorite,
        removeMovieFromFavorite
    }
)(withRouter(App));
