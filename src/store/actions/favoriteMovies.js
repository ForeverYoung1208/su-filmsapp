import { axiosDB } from '../../shared/utils/axiosInstances';
import { ADD_MOVIE_TO_FAVORITE, REMOVE_MOVIE_FROM_FAVORITE, SAVE_FAVORITE_MOVIES } from '../actionTypes';

const addMovieToStore = movie => ({
    type: ADD_MOVIE_TO_FAVORITE,
    movie
});

export const addMovieToFavorite = movie => {
    return (dispatch, getState) => {
        const { databaseKey } = getState().auth;

        axiosDB.post(`/users/${databaseKey}/favoriteMovies.json`, movie)
            .then(response => {
                const { name } = response.data;

                dispatch(addMovieToStore({
                    ...movie,
                    databaseId: name
                }));
            })
            .catch(error => {
                console.log('[error]', error);
            });
    };
}

export const removeMovieFromStore = databaseId => ({
    type: REMOVE_MOVIE_FROM_FAVORITE,
    databaseId
});

export const removeMovieFromFavorite = databaseId => {
    return (dispatch, getState) => {
        const { databaseKey } = getState().auth;

        axiosDB.delete(`/users/${databaseKey}/favoriteMovies/${databaseId}.json`)
            .then(() => {
                dispatch(removeMovieFromStore(databaseId));
            })
            .catch(error => {
                console.log('[error]', error);
            });
    };
};

export const fetchFavoriteMovies = databaseKey => {
    return dispatch => {
        axiosDB.get(`/users/${databaseKey}/favoriteMovies.json`)
            .then(response => {
                const { data } = response;

                if (!data) return;

                const favoriteMovies = Object
                    .entries(data)
                    .map(([ databaseId, movieData ]) => ({
                        ...movieData,
                        databaseId
                    }));

                dispatch(saveFavoriteMovies(favoriteMovies));
            })
            .catch(error => {
                console.log('[error]', error);
            });
    };
};

const saveFavoriteMovies = movies => ({
    type: SAVE_FAVORITE_MOVIES,
    movies
});
