import React, { useState } from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';

import Button from '../../shared/components/Button/Button';
import Pagination from '../../shared/components/Pagination/Pagination';
import './FavoriteMovies.scss';

const FavoriteMovies = ({ movies }) => {
    const [ currentPage, setCurrentPage ] = useState(1);

    const switchPageHandler = page => {
        setCurrentPage(page);
    };

    return (
        <div className="favorite-movies">
            <table className="favorite-movies__table">
                <thead>
                    <tr className="favorite-movies__tr">
                        <th className="favorite-movies__th">ID</th>
                        <th className="favorite-movies__th">Image</th>
                        <th className="favorite-movies__th">Title</th>

                        <th className="favorite-movies__th favorite-movies__th--overview">
                            Overview
                        </th>

                        <th className="favorite-movies__th">Options</th>
                    </tr>
                </thead>

                <tbody>
                    {movies
                        .slice((currentPage - 1) * 5, currentPage * 5)
                        .map(({ id, poster_path, original_title, overview }) => (
                            <tr key={id} className="favorite-movies__tr">
                                <td className="favorite-movies__td">
                                    <Link
                                        to={`/movies/${id}`}
                                        className="favorite-movies__link"
                                    >
                                        <i className="fas fa-link favorite-movies__icon" />
                                        <span className="favorite-movies__text">{id}</span>
                                    </Link>
                                </td>
                                
                                <td className="favorite-movies__td">
                                    <div className="favorite-movies__img-wrapper">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                                            alt={original_title}
                                            className="favorite-movies__img"
                                        />
                                    </div>
                                </td>

                                <td className="favorite-movies__td">{original_title}</td>

                                <td className="favorite-movies__td favorite-movies__td--overview">
                                    {overview}
                                </td>

                                <td className="favorite-movies__td">
                                    <Button
                                        className="button--red favorite-movies__btn"
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                className="favorite-movies__pagination"
                current={currentPage}
                total={movies.length}
                onClick={switchPageHandler}
            />
        </div>
    );
};

FavoriteMovies.propTypes = {
    movies: PT.arrayOf(PT.shape({
        id: PT.number.isRequired,
        poster_path: PT.string,
        original_title: PT.string.isRequired,
        overview: PT.string.isRequired
    })).isRequired
};

export default FavoriteMovies;
