const API_HOST = 'https://api.themoviedb.org';
const API_KEY = 'cf7c522aba0ab01828fe1529353bf2b6';



export function search(queryString) {
    return axios.get(`${API_HOST}/3/search/multi?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=` + encodeURI(queryString))
}

export function fetchMovie (movie_id) {
    return axios.get(`${API_HOST}/3/movie/${movie_id}?api_key=${API_KEY}&language=en-US`);
}

export function fetchMovieCredits (movie_id) {
    return axios.get(`${API_HOST}/3/movie/${movie_id}/credits?api_key=${API_KEY}&language=en-US`);
}

export function fetchPopular() {
    return axios.get(`${API_HOST}/3/movie/popular?api_key=${API_KEY}&language=en-US`);
}