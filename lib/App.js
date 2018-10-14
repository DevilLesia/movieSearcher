// import { search } from './api';

$(document).ready(() => {
  $('#searchForm').on('submit', e => {
    let searchText = $('#searchText').val();
    // getMovies(searchText);
    getTmbdMovie(searchText);
    e.preventDefault();
  });
});

function getTmbdMovie(searchText) {
  search();
  // axios.get('https://api.themoviedb.org/3/search/multi?api_key=cf7c522aba0ab01828fe1529353bf2b6&language=en-US&page=1&include_adult=false&query=' + searchText)
  //     .then((response) => {
  //         console.log(response, 'NEW');
  //     })
}

function getMovies(searchText) {
  axios.get('http://www.omdbapi.com?apikey=56a567e7' + '&s=' + searchText).then(response => {
    console.log(response);
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
  }).catch(err => {
    console.log(err);
  });
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem('movieId');

  axios.get('http://www.omdbapi.com?apikey=56a567e7' + '&i=' + movieId).then(response => {
    console.log(response);
    let movie = response.data;

    let output = `
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
  }).catch(err => {
    console.log(err);
  });
}