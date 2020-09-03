//the API documentation site https://developers.themoviedb.org/3/
// api key 542003918769df50083a13c415bbc602

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
    }
}

class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie))
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Movie(data)
    }

    static async fetchVideos(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/videos`)
        const response = await fetch(url)
        const data = await response.json()
        return data;
    }

    static async fetchCredits(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        return data;
    }

    static async fetchSimilar(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/similar`)
        const response = await fetch(url)
        const data = await response.json()
        return data;
    }

    static async fetchKeywords(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/keywords`)
        const response = await fetch(url)
        const data = await response.json()
        return data;
    }

    static async fetchRecommendations(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/recommendations`)
        const response = await fetch(url)
        const data = await response.json()
        return data;
    }

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
}

class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function () {
                Movies.run(movie);
            });

            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        })
    }
}


class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        MoviePage.renderMovieSection(movieData);

        const movieVideos = await APIService.fetchVideos(movie.id)
        MoviePage.renderMovieVideos(movieVideos);

        const movieCredits = await APIService.fetchCredits(movie.id);
        MoviePage.renderMovieCast(movieCredits.cast);

        const movieSimilar = await APIService.fetchSimilar(movie.id);
        if(movieSimilar.results && movieSimilar.results.length > 0){
            MoviePage.renderSimilarMovie(movieSimilar.results);
        } else { // get some recomendations
            const popularMovie = await APIService.fetchRecommendations(movie.id);
            MoviePage.renderSimilarMovie(popularMovie.results);
        }

        const movieKeywords = await APIService.fetchKeywords(movie.id);
        if(movieKeywords.keywords) {
            MoviePage.renderKeywords(movieKeywords.keywords);
        }

    }
}

class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie) {
        MovieSection.renderMovieDetail(movie);
    }
    static renderMovieVideos(videos) {
        if (videos.results) {
            MovieSection.renderMovieVideos(videos.results);
        }
    }

    static renderMovieCast(cast) {
        MovieSection.renderMovieCast(cast);
    }

    static renderSimilarMovie(rawMovies) {
        // convert the data to Movie objects and get the first 3 similar movies
        const movies = rawMovies.map(rawDate => new Movie(rawDate)).slice(0,3);
        MovieSection.renderSimilarMovie(movies);
    }

    static renderKeywords(keywords) {
        if(keywords.length > 0) {
            MovieSection.renderMovieKeywords(keywords);
        }
    }
}

class MovieSection {
    static renderGenres = (genres) => {
        return genres.reduce(((genresSpans, genre) => (
            `<span class="genres genres-${genre.name.toLowerCase()}">${genre.name}</span>` + genresSpans)
        ), '')
    }

    static renderMovieDetail(movie) {
        MoviePage.container.innerHTML = `
      <div id="movie-detail" class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${MovieSection.renderGenres(movie.genres)}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <p id="movie-rating">${movie.voteAverage}/10</p>
          <p id="movie-lang">${movie.voteCount}</p>
          <p id="movie-lang">${movie.tagline}</p>
        </div>
    </div>
    <div id="movie-description" class="row">
        <div class="col-12">
            <p id="movie-overview">${movie.overview}</p>
        </div>
    </div>
    `;
    }

    static renderMovieVideos(videos) {
        const div = document.createElement('div');
        div.id = "movie-videos";
        div.className = "row";

        const trailer = videos.find(video => video.type.toLowerCase() === "trailer");
        if (!trailer) {
            return;
        }

        div.innerHTML = `
                <div class="col-12">
                    <iframe
                        width="100%" 
                        height="547" 
                        src="https://www.youtube.com/embed/${trailer.key}" 
                        frameborder="0" 
                        allow="accelerometer; 
                        autoplay; 
                        encrypted-media; 
                        gyroscope; 
                        picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            `
            ;

        MoviePage.container.appendChild(div);
    }

    static renderMovieCast(cast) {
        const div = document.createElement('div');
        const characterTemplate = (character) => (`
            <tr>
                <td class="primary-photo">
                    <a href="#"><img height="44" width="32" alt="" title="" src="${Movie.BACKDROP_BASE_URL + character.profile_path}"></a>
                </td>
                <td>
                    <a href="#">${character.name}</a>
                </td>
                <td>
                    ...
                </td>
                <td class="character">
                    <a href="#">${character.character}</a> 
                </td>
            </tr>
        `);

        div.id = "movie-cast";
        div.className = "row";

        let content = `
            <div class="col-12">
                <h2>Cast</h2>
                <table class="cast-list">
                    ${cast.reduce((characters, character) => characters + characterTemplate(character), '')}
                </table>
            </div>
        `

        div.innerHTML = content;
        MoviePage.container.appendChild(div);
    }

    static renderSimilarMovie(movies) {
        const div = document.createElement('div');
        div.id = "movie-similar";

        const template = (movie) => (`
            <div class="col-4">
                <img id="movie-backdrop" src=${movie.backdropUrl}> 
                <h3>${movie.title}</h3>
                <p>${movie.voteAverage}</p>
                <p>${movie.overview}</p>
            </div>
        `);

        div.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h2>See also</h2>
                </div>
            </div>
            <div class="row">
                ${movies.reduce((content, movie) => content + template(movie), '')}
            </div>
        `
        MoviePage.container.appendChild(div);

    }

    static renderMovieKeywords(keywords) {
        const div = document.createElement('div');
        div.id = "movie-keywords";
        div.className = "row";

        const template = (keyword) => (`
            <li class="keyword" data-keyword-id="${keyword.id}"><a href="#">${keyword.name}</a></li>
        `);

        div.innerHTML = `
                <h3>keywords</h3>
                <ul class="col-12">
                    ${keywords.reduce((content, keyword) => content + template(keyword), '')}
                </ul>
            `
        ;

        MoviePage.container.appendChild(div);

    }
}

// TODO
class Actors {

}

class ActorPage {

}

class ActorSection {

}

class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.tagline = json.tagline;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
        this.genres = json.genres;
        this.voteAverage = json.vote_average;
        this.voteCount = json.vote_count;
        this.spokenLanguages = json.spoken_languages;
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }
}

document.addEventListener("DOMContentLoaded", App.run);
