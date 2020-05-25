import { create } from 'axios';

export const axiosAuth = create({
    baseURL: 'https://identitytoolkit.googleapis.com'
});

export const axiosDB = create({
    baseURL: 'https://movies-app-58adf.firebaseio.com'
});

export const axiosMovies = create({
    baseURL: 'https://api.themoviedb.org/3'
});
