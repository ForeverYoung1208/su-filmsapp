import React, { Component } from 'react';
import PT from 'prop-types';

import Button from '../../shared/components/Button/Button';
import SimilarMovies from './SimilarMovies/SimilarMovies';
import { axiosMovies } from '../../shared/utils/axiosInstances';
import './FullMovie.scss';

const API_KEY = '1a67fd8fb5bbd9369d8ed3886f1ac2e2';

class FullMovie extends Component {
    state = {
        fullMovie: null,
        similarMovies: []
    }

    componentDidMount() {
        const { match, movies } = this.props;
        const { movieId } = match.params;

        const fullMovie = movies.find(({ id }) => id === +movieId);

        if (fullMovie) {
            return this.fetchSimilarMovies(movieId)
                .then(() => {
                    this.setState({ fullMovie });
                })
                .catch(error => {
                    console.log('[error]', error);
                });
        }

        axiosMovies.get(`/movie/${movieId}?api_key=${API_KEY}&language=en-US`)
            .then(response => {
                const fullMovie = response.data;

                if (!fullMovie) return;

                this.fetchSimilarMovies(movieId)
                    .then(() => {
                        this.setState({ fullMovie });
                    })
                    .catch(error => {
                        console.log('[error]', error);
                    });
            })
            .catch(error => {
                console.log('[error]', error);
            });
    }

    componentDidUpdate(prevProps) {
        const { movieId } = this.props.match.params;
        const { movieId: prevMovieId } = prevProps.match.params;

        if (movieId === prevMovieId) return;

        axiosMovies.get(`/movie/${movieId}?api_key=${API_KEY}&language=en-US`)
            .then(response => {
                const fullMovie = response.data;

                if (!fullMovie) return;

                this.fetchSimilarMovies(movieId)
                    .then(() => {
                        this.setState({ fullMovie });
                    })
                    .catch(error => {
                        console.log('[error]', error);
                    });
            })
            .catch(error => {
                console.log('[error]', error);
            });
    }

    fetchSimilarMovies(movieId) {
        return axiosMovies.get(`/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`)
            .then(response => {
                const { data } = response;

                const similarMovies = data.results.slice(0, 3);

                return this.setState({ similarMovies });
            })
            .catch(error => {
                console.log('[error]', error);
            });
    }

    // TODO: remove this crap
    addMovieToFavorite = movieId => {
        console.log('[movieId]', movieId);
    }

    manageFavoriteMovie = () => {
        const { fullMovie } = this.state;
        const { addMovieToFavorite, removeMovieFromFavorite, favoriteMovies } = this.props;

        const favoriteMovie = favoriteMovies.find(m => m.id === fullMovie.id);

        if (favoriteMovie) {
            return removeMovieFromFavorite(favoriteMovie.databaseId);
        }

        addMovieToFavorite(fullMovie);
    }

    render() {
        const { fullMovie, similarMovies } = this.state;
        
        if (!fullMovie) return null;

        const { favoriteMovies } = this.props;
    
        const {
            id,
            poster_path,
            backdrop_path,
            original_title,
            release_date,
            overview
        } = fullMovie;

        const isFavorite = favoriteMovies.some(m => m.id === id);
        const storageUrl = 'https://image.tmdb.org/t/p';

        const btnClasses = ['full-movie__btn'];

        if (isFavorite) {
            btnClasses.push('button--red');
        } else {
            btnClasses.push('button--blue');
        }
    
        return (
            <div className="full-movie">
                <div
                    key={id}
                    className="full-movie__content"
                    style={{
                        backgroundImage: `url(${storageUrl}/original${backdrop_path})`
                    }}
                >
                    <div className="full-movie__body">
                        <div className="full-movie__img-wrapper">
                            <img
                                src={`${storageUrl}/w500${poster_path}`}
                                alt={original_title}
                                className="full-movie__img"
                            />
                        </div>
    
                        <div className="full-movie__info-wrapper">
                            <div className="full-movie__info">
                                <h1 className="full-movie__title">{original_title}</h1>
                                <strong className="full-movie__date">{release_date}</strong>
                                <p className="full-movie__text">{overview}</p>
                            </div>
    
                            <Button
                                className={btnClasses.join(' ')}
                                onClick={this.manageFavoriteMovie}
                            >
                                { isFavorite ? 'Remove from Favorite' : 'Add to Favorite' }
                            </Button>
                        </div>
                    </div>
    
                    <SimilarMovies movies={similarMovies} />
                </div>
            </div>
        );
    }
}

FullMovie.propTypes = {
    match: PT.shape({
        params: PT.object.isRequired
    }).isRequired,
    movies: PT.arrayOf(PT.shape({
        poster_path: PT.string,
        id: PT.number.isRequired,
        backdrop_path: PT.string,
        original_title: PT.string.isRequired,
        overview: PT.string.isRequired,
        release_date: PT.string.isRequired
    })).isRequired,
    favoriteMovies: PT.arrayOf(PT.shape({
        poster_path: PT.string,
        id: PT.number.isRequired,
        backdrop_path: PT.string,
        original_title: PT.string.isRequired,
        overview: PT.string.isRequired,
        release_date: PT.string.isRequired
    })).isRequired,
    addMovieToFavorite: PT.func.isRequired,
    removeMovieFromFavorite: PT.func.isRequired
};

export default FullMovie;
