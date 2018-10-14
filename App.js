import { search, fetchMovie, fetchMovieCredits, fetchPopular } from './api.js';
import { finished } from 'stream';

const IMAGE_HOST = 'https://image.tmdb.org/t/p/w500/';

$(document).ready(() => {
    renderPopular();
    getFavoriteMovies();
    renderFavorites();

  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    renderUserSearch(searchText);
    e.preventDefault();
  });
});

function getFavoriteMovies () {
    return JSON.parse(window.localStorage.getItem('favMov') || '[]');
}

function renderPopular() {
    fetchPopular().then((data) => {
        getTmbdMovies(data.data.results.splice(0, 4), '#movies');
        setListeners();
    });
}

function renderFavorites() {
    let favMov = getFavoriteMovies();
    if (favMov) {
        getTmbdMovies(favMov, '#favorites-movies');
        setListeners();
    }
}

function renderUserSearch (searchText) {
    search(searchText).then((data) => {
        getTmbdMovies(data.data.results, '#movies');
        setListeners();
    });
}

function getTmbdMovies (data, stringToReplase) {
    let resultsMovies = data;
    let output = '';

    resultsMovies.forEach(movieObject => {
        output += getMovieItemHtml(movieObject);
    });

    $(stringToReplase).html(output);
}

function setListeners () {
    document.querySelectorAll('.open-movie').forEach((nodeItem) => {
        handleIMDBlink(nodeItem);
    });

    document.querySelectorAll('.like-movie').forEach((nodeItem) => {
        handleMovieSafe(nodeItem);
    })
}

function handleIMDBlink (nodeItem) {
    nodeItem.addEventListener('click', (event) => {
        let movieID = event.target.dataset.id;
        movieSelectedNew(movieID);
    })
}

function handleMovieSafe (nodeItem) {
    nodeItem.addEventListener('click', (event) => {
        let movieData = event.target.dataset;
        let favMov = getFavoriteMovies();
        favMov.push(movieData);
        window.localStorage.setItem('favMov', JSON.stringify(favMov));
    })
}

function movieSelectedNew (movieId) {
    fetchMovie(movieId).then((response) => {
        fetchMovieCredits(movieId).then((responseData) => {
            let movie = response.data;
            let credits = responseData.data;
            let mainChars = credits.cast.slice(0, 3);
            let crew = credits.crew;

            let mainCharsNames = mainChars.reduce((reducer, item) => {
                return reducer + `${item.name} (as ${item.character}), `
            }, '')

            let director = crew.filter((item) => {
                return item.job === 'Director';
            })[0].name;

            let writers = crew.filter((item) => {
                return item.department === 'Writing';
            });

            let writersNames = writers.reduce((reducer, item) => {
                return reducer + `${item.name}, `;
            }, '')

            let genres = movie.genres.reduce((reduser, item, index ) => {
                return (index === movie.genres.length - 1) ? reduser + item.name.toLowerCase() : reduser + item.name.toLowerCase() + ', ';
            }, '');

            let output =`
            <div class="row">
                <div class="col-md-4">
                    <img src="${IMAGE_HOST}${movie.backdrop_path}" width="250px" class="thumbnail">
                </div>
                <div class="col-md-8">
                <h2>${movie.original_title}</h2>
                <h6><i>${movie.tagline}</i></h6>
                <ul class="list-group">
                    <li class="list-group-item"><strong>Genre:</strong> ${genres}</li>
                    <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
                    <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.vote_average}</li>
                    <li class="list-group-item"><strong>Director:</strong> ${director}</li>
                    <li class="list-group-item"><strong>Writer:</strong> ${writersNames}</li>
                    <li class="list-group-item"><strong>Actors:</strong> ${mainCharsNames}</li>
                    <li class="list-group-item"><strong>Runtime:</strong> ${movie.runtime} min.</li>
                </ul>
                </div>
            </div>
            <div class="row">
                <div class="well">
                <h3>Plot</h3>
                    ${movie.overview}
                    <hr>
                    <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View IMDB page</a>
                </div>
            </div>
            `;

            let modal = $('#movieModal');
            modal.find('.modal-body').html(output);
            modal.modal('toggle');
        })
    })
}

function getMovieItemHtml (movieData) {
    return `
        <div class="col-md-3">
        <div class="well text-center">
            <img src=${IMAGE_HOST}${movieData.poster_path} width="250px" >
            <h5>${movieData.title}</h5>
            <a class="like-movie" data-id="${movieData.id}" data-poster_path="${movieData.poster_path}" data-title="${movieData.title}" class="btn btn-primary" href="#">Like</a>
            <a class="open-movie" data-id="${movieData.id} class="btn btn-primary" href="#">Movie Details</a>
        </div>
        </div>
    `;
}

