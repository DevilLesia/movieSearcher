import { search, fetchMovie, fetchMovieCredits, fetchPopular } from './api.js';
import { finished } from 'stream';

const IMAGE_HOST = 'https://image.tmdb.org/t/p/w500/';

$(document).ready(() => {
    renderPopular();

  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    renderUserSearch(searchText);
    e.preventDefault();
  });
});

function renderPopular() {
    fetchPopular().then((data) => {
        getTmbdMovies(data.data.results.splice(0, 4));
    });
}

function renderUserSearch (searchText) {
    search(searchText).then((data) => {
        getTmbdMovies(data.data.results);
    });
}

function getTmbdMovies (data) {
    let resultsMovies = data;
    let output = '';

    resultsMovies.forEach(movieObject => {
        output += getMovieItemHtml(movieObject);
    });

    $('#movies').html(output);

    document.querySelectorAll('.open-movie').forEach((nodeItem) => {
        nodeItem.addEventListener('click', (event) => {
            let movieID = event.target.dataset.id;
            movieSelectedNew(movieID);
        })
    })
}

function movieSelectedNew (movieId) {
    fetchMovie(movieId).then((response) => {
        fetchMovieCredits(movieId).then((responseData) => {
            let movie = response.data;
            let credits = responseData.data;
            console.log(movie)
            console.log(credits)
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
            <img src=${IMAGE_HOST}${movieData.poster_path}>
            <h5>${movieData.title}</h5>
            <a class="open-movie" data-id="${movieData.id}" class="btn btn-primary" href="#">Movie Details</a>
        </div>
        </div>
    `;
}

function getMovies(searchText){
  axios.get('http://www.omdbapi.com?apikey=56a567e7'+ '&s='+searchText)
    .then((response) => {
      let movies = response.data.Search;
      let output = '';

      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}">
              <h5>${movie.Title}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get('http://www.omdbapi.com?apikey=56a567e7'+'&i='+movieId)
    .then((movie) => {

      console.log(movie);

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB page</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

