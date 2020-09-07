//the API documentation site https://developers.themoviedb.org/3/
// api key 542003918769df50083a13c415bbc602

class App {
    static async run() {
        const movies = await APIService.fetchMovies('popular')
        HomePage.renderMovies(movies);

        document.querySelector('#home-btn').addEventListener('click', async () => {
            const movies = await APIService.fetchMovies('popular')
            HomePage.renderMovies(movies);
        });

        document.querySelectorAll("[data-genre-id]").forEach(elem => {
            elem.addEventListener('click', function (e) {
                let element = e.target.dataset.genreId ? e.target : e.target.parentNode;
                Search.forGenre(element.dataset.genreId)
            })
        })

        Events.bindMovieCategoryListener();

        document.getElementById("searchMovie").addEventListener("click", function (event) {
            event.preventDefault();
            const searchedValues = document.getElementById("searchedMovie").value;
            Search.run(searchedValues);
        });
    }
}

class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies(category) {
        const url = APIService._constructUrl(`movie/${category}`)
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

    static async fetchKeyword(keywordId) {
        const url = APIService._constructUrl(`keyword/${keywordId}/movies`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results;
    }

    static async fetchRecommendations(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/recommendations`)
        const response = await fetch(url)
        const data = await response.json()
        return data;
    }

    static async fetchPerson(personId) {
        const url = APIService._constructUrl(`person/${personId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Person(data);
    }

    static async fetchPersonCombinedCredits(personId) {
        const url = APIService._constructUrl(`person/${personId}/combined_credits`)
        const response = await fetch(url)
        const data = await response.json()
        return data.cast;
    }

    static async fetchSearchedMovies(movieName) {
        const url = APIService._constructUrlSeacrh(`search/movie`, `&query=${movieName}`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.results.map(result => new Movie(result))

    }
    //  https://api.themoviedb.org/3/search/movie?api_key=542003918769df50083a13c415bbc602&query=power

    static async fetchSearchedActors(actorName) {
        const url = APIService._constructUrlSeacrh(`search/person`, `&query=${actorName}`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data.results)
        return data.results;
    }

    //https://api.themoviedb.org/3/genre/movie/list?api_key=542003918769df50083a13c415bbc602&language=en-US

    static async fetchMoviesWithSelectedGenres(genreID) {
        const url = APIService._constructUrl(`genre/${genreID}/movies`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data.results)
        return data.results;
    }


    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }

    static _constructUrlSeacrh(path, query) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}${query}`;
    }
}

class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        this.container.innerHTML = '';
        const moviesDiv = document.createElement("div");
        moviesDiv.className = 'row';
        movies.forEach(movie => {
            const content = `
                <div class="col-sm-3 d-flex align-items-stretch">
                    <div class="card">        
                        <img src="${movie.backdropUrl}" class="card-img-top" alt="${movie.title}" data-movie-id="${movie.id}">
                        <div class="card-body">
                            <div class="pie_progress" role="progressbar" data-goal="${movie.voteAverage * 10}">
                                <div class="pie_progress__number">0%</div>
                            </div>
                            <h5 class="card-title" data-movie-id="${movie.id}">${movie.title}</h5>
                            <p class="card-text mute-text">${movie.releaseDate}</p>
                        </div>
                    </div>
                </div>
            `;
            moviesDiv.innerHTML += content;
        })
        this.container.appendChild(moviesDiv)
        Events.bindMovieListener();
        updateVoteAverage()
    }

    static renderSearchedMovies(movies) {
        this.container.innerHTML = "";
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            movieDiv.className = "card";

            const movieRow = document.createElement("div");
            movieRow.className = "row justify-content-md-center align-items-center ";

            const movieImgDiv = document.createElement("div");
            movieImgDiv.className = "col-lg-3";
            movieImgDiv.setAttribute('data-movie-id', movie.id)

            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            movieImage.className = "card-img-top";

            const movieInfoDiv = document.createElement("div");
            movieInfoDiv.className = "col-lg-9";

            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieTitle.setAttribute('data-movie-id', movie.id)

            const movieOverview = document.createElement("p");
            movieOverview.textContent = `${movie.overview}`;

            movieImage.addEventListener("click", function () {
                Movies.run(movie.id);
            });

            movieTitle.addEventListener("click", function () {
                Movies.run(movie.id);
            });


            movieImgDiv.appendChild(movieImage);
            movieInfoDiv.appendChild(movieTitle);
            movieInfoDiv.appendChild(movieOverview);

            movieRow.appendChild(movieImgDiv);
            movieRow.appendChild(movieInfoDiv);

            movieDiv.appendChild(movieRow);
            this.container.appendChild(movieDiv);
        })

    }

    static renderSearchedActors(actors) {
        this.container.innerHTML = "";
        actors.forEach(actor => {
            const actorDiv = document.createElement("div");
            actorDiv.className = "row";

            const actorImgDiv = document.createElement("div");
            actorImgDiv.className = "col-lg-4";

            const actorImage = document.createElement("img");
            actorImage.src = Movie.BACKDROP_BASE_URL + actor.profile_path;
            actorImage.className = "card-img-top";

            const actorInfoDiv = document.createElement("div");
            actorInfoDiv.className = "col-lg-8";

            const actorName = document.createElement("h3");
            actorName.textContent = `${actor.name}`;

            actorImgDiv.addEventListener("click", function () {
                People.run(actor.id)
            });

            actorName.addEventListener("click", function () {
                People.run(actor.id)
            });

            actorImgDiv.appendChild(actorImage);
            actorInfoDiv.appendChild(actorName);

            actorDiv.appendChild(actorImgDiv);
            actorDiv.appendChild(actorInfoDiv);
            this.container.appendChild(actorDiv);
        })
    }
}

class Search {
    static run(searchedValues) {
        this.forPeople(searchedValues)
        this.forMovies(searchedValues)
    }

    static renderMoviesSearchResult(datas) {
        HomePage.container.innerHTML = "";

        datas.forEach(data => {
            const movieDiv = document.createElement("div");
            movieDiv.className = "row";

            const movieImgDiv = document.createElement("div");
            movieImgDiv.className = "col-lg-4";

            const movieImage = document.createElement("img");
            movieImage.src = Movie.BACKDROP_BASE_URL + data.backdrop_path;
            movieImage.className = "card-img-top";

            const movieInfoDiv = document.createElement("div");
            movieInfoDiv.className = "col-lg-8";

            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${data.title}`;

            const movieOverview = document.createElement("p");
            movieOverview.textContent = `${data.overview}`;

            movieImage.addEventListener("click", function () {
                Movies.run(data);
            });

            movieImgDiv.appendChild(movieImage);
            movieInfoDiv.appendChild(movieTitle);
            movieInfoDiv.appendChild(movieOverview);

            movieDiv.appendChild(movieImgDiv);
            movieDiv.appendChild(movieInfoDiv);
            HomePage.container.appendChild(movieDiv);
        })
    }

    static async forMovies(movie) {
        const movieData = await APIService.fetchSearchedMovies(movie)
        HomePage.renderSearchedMovies(movieData);
    }

    static async forPeople(actors) {
        const actorData = await APIService.fetchSearchedActors(actors)
        HomePage.renderSearchedActors(actorData);
    }

    static async forGenre(genreId) {
        const datas = await APIService.fetchMoviesWithSelectedGenres(genreId)
        this.renderMoviesSearchResult(datas);
    }

}


class Genres {
    constructor(json) {
        this.id = json.id;
        this.name = json.name;
    }

    static async run(genreId) {
        const datas = await APIService.fetchMoviesWithSelectedGenres(genreId)
        Search.renderMoviesSearchResult(datas);
    }
}

class Movies {
    static async run(movieID) {
        const movieData = await APIService.fetchMovie(movieID)
        MoviePage.renderMovieSection(movieData);

        const movieCredits = await APIService.fetchCredits(movieID);
        MoviePage.renderMovieCast(movieCredits.cast);

        const movieVideos = await APIService.fetchVideos(movieID)
        MoviePage.renderMovieVideos(movieVideos);

        const movieSimilar = await APIService.fetchSimilar(movieID);
        if (movieSimilar.results && movieSimilar.results.length > 0) {
            MoviePage.renderSimilarMovie(movieSimilar.results);
        } else { // get some recomendations
            const popularMovie = await APIService.fetchRecommendations(movieID);
            MoviePage.renderSimilarMovie(popularMovie.results);
        }

        const movieKeywords = await APIService.fetchKeywords(movieID);
        if (movieKeywords.keywords) {
            MoviePage.renderKeywords(movieKeywords.keywords);
        }
    }
}

class MoviePage {
    static container = document.getElementById('container');
    
    static renderMovieSection(movie) {
        MovieSection.renderMovieDetail(movie);

        const genreElements = document.querySelectorAll("[data-genre-id]");
        genreElements.forEach(elem => {
            elem.addEventListener('click', function (e) {
                let element = e.target.dataset.genreId ? e.target : e.target.parentNode;
                Genres.run(element.dataset.genreId)
            })
        })
    }

    static renderMovieVideos(videos) {
        if (videos.results) {
            MovieSection.renderMovieVideos(videos.results);
        }
    }

    static renderMovieCast(cast) {
        MovieSection.renderMovieCast(cast);
        const people = document.querySelectorAll("[data-person-id]");
        people.forEach(peson => {
            peson.addEventListener('click', function (e) {
                let element = e.target.dataset.personId ? e.target : e.target.parentNode;
                People.run(element.dataset.personId);
            })
        })

    }

    static renderSimilarMovie(rawMovies) {
        // convert the data to Movie objects and get the first 3 similar movies
        const movies = rawMovies.map(rawDate => new Movie(rawDate)).slice(0, 3);
        MovieSection.renderSimilarMovie(movies);
    }

    static renderKeywords(keywords) {
        if (keywords.length > 0) {
            MovieSection.renderMovieKeywords(keywords);
            Events.bindMovieKeywordListener();
        }
    }
}

class MovieSection {
    static renderGenres = (genres) => {
        return genres.reduce(((genresSpans, genre) => (
            `<span class="genres genres-${genre.name.toLowerCase()}" data-genre-id="${genre.id}"><a href="#">${genre.name}</a></span>` + genresSpans)
        ), '')
    }

    static renderMovieDetail(movie) {
        MoviePage.container.innerHTML = `
        <section>
        <div id="movie-detail" class="row movie-information-card">
            <div class="col-md-4">
            <img id="movie-backdrop" src=${movie.backdropUrl}> 
            </div>
            <div class="col-md-8 movie-content">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="genres">${MovieSection.renderGenres(movie.genres)}</p>
            <p id="movie-release-date">${movie.releaseDate}</p>
            
            <p id="movie-lang">${movie.tagline}</p>
            <p id="movie-overview">${movie.overview}</p>
            <div class="row">
                <div class="col-md-3 mt-5">
                    <p id="movie-runtime">${movie.runtime}</p>
                </div>
                <div class="col-md-3 mt-5">
                    <p id="movie-rating">${movie.voteAverage}/10</p>
                </div>
                <div class="col-md-3 mt-5">
                    <p id="movie-lang">${movie.voteCount}</p>
                </div>
            </div>
            </div>
        </div>
        </section>
    `;
    }

    static renderMovieVideos(videos) {
        const div = document.createElement('div');
        div.id = "movie-videos";

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

    // cast
    static renderMovieCast(cast) {
        const div = document.createElement('div');

        const characterTemplate = (character) => (`
            <li class=card>
                ${!character.profile_path ?
                `<a class="primary-photo no_image_holder" href="#" data-person-id="${character.id}"></a>` :
                `<a class="primary-photo" href="#" data-person-id="${character.id}"><img alt="" title="" src="${Movie.BACKDROP_BASE_URL + character.profile_path}"></a>`}
                
                <p>
                    <a href="#" data-person-id="${character.id}">${character.name}</a>
                </p>
                <p class="character">
                    ${character.character}
                </p>
            </li>
        `);

        div.id = "movie-cast";
        div.className = "row";

        let content = `
            <div class="col-12">
                <h2>Cast</h2>
                <div class="cast-list">
                    <ol class="people scroller">
                        ${cast.reduce((characters, character) => characters + characterTemplate(character), '')}
                    </ol>
                </div>
            </div>
        `

        div.innerHTML = content;
        MoviePage.container.appendChild(div);
    }

    static renderSimilarMovie(movies) {
        const div = document.createElement('div');
        div.id = "movie-similar";

        const template = (movie) => (`
            <div class="col-3">
            <div class="card">
                <img id="movie-backdrop" src=${movie.backdropUrl}>
                <div class="card-body"> 
                    <h3>${movie.title}</h3>
                    <p>${movie.voteAverage}</p>
                </div>
            </div>
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

        const template = (keyword) => (`
            <li class="keyword" data-keyword-id="${keyword.id}"><a href="#">${keyword.name}</a></li>
        `);

        div.innerHTML = `
                <h3>keywords</h3>
                <ul class="col-3">
                    ${keywords.reduce((content, keyword) => content + template(keyword), '')}
                </ul>
            `
            ;

        MoviePage.container.appendChild(div);

    }
}

class People {
    static async run(personID) {
        const personData = await APIService.fetchPerson(personID)
        PersonPage.renderPersonDetail(personData);

        const personCombinedCredits = await APIService.fetchPersonCombinedCredits(personID);

        // Known For section
        const mostFamiliar = personCombinedCredits.filter(m => m.media_type === "movie").sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);
        PersonPage.renderMostFamiliarMovies(mostFamiliar);

        const fullListSortedByDate = personCombinedCredits.sort((a, b) => {
            const first = a.release_date ? a.release_date : a.first_air_date;
            const second = b.release_date ? b.release_date : b.first_air_date;
            const compare = new Date(second).getFullYear() - new Date(first).getFullYear()

            return compare
        });
        PersonPage.renderFullListMovies(fullListSortedByDate);
    }
}

class PersonPage {
    static container = document.getElementById('container');

    static renderPersonDetail(person) {
        this.container.innerHTML = '';
        PersonSection.renderPersonDetail(person);
    }

    static renderMostFamiliarMovies(moviesData) {
        PersonSection.renderMostFamiliarMovies(moviesData);
    }

    static renderFullListMovies(moviesData) {
        PersonSection.renderFullListMovies(moviesData);

        Events.bindMovieListener();
    }
}

`      <div class="container">
        <div class="row ">
        <div class="col col-lg-3">
            1 of 3
        </div>
        <div class="col col-lg-9">
            Variable width content
        </div>
        </div>
       </div>`

class PersonSection {
    static renderPersonDetail(person) {
        const div = document.createElement('div');
        div.classList = 'person-info';

        div.innerHTML = `
        <div class="container">
          <div class="row">
            <div id="left_wrapper" class="col col-lg-4">
                <div class="poster_wrapper profile">
                    <img class="profile" src="${person.backdropUrl}" alt="${person.name}">          
                </div>
                <div class="column">
                    <section class="full_wrapper">
                        <h3><bdi>Personal Info</bdi></h3>
                        <section>
                            <p><strong><bdi>Known For</bdi></strong> ${person.knownForDepartment}</p>
                            <p><strong><bdi>Gender</bdi></strong> ${person.gender}</p>
                
                            <p class="full"><strong><bdi>Birthday</bdi></strong> ${person.birthday} (${person.yearsOld} years old)</p>
                
                            <p class="full"><strong><bdi>Place of Birth</bdi></strong> ${person.placeOfBirth}</p>
                
                            <p class="full false"><strong><bdi>Also Known As</bdi></strong></p>
                            <ul>
                                ${!person.alsoKnownAs ? `<li>-</li>` :
                `${person.alsoKnownAs.map(e => `<li>${e}</li>`).join('')}`}
                            </ul>
                        </section>
                    </section>
                </div>
            </div>
            <div id='right-wrapper' class="col col-lg-8">
                <section class="full-wrapper">
                    <h2 class="title">${person.name}</h2>
                </section>
                <section class="full-wrapper">
                    <h3>Biography</h3>
                    <div class="content"><p>${person.biography ? person.biography.replaceAll('\n\n', '</p><p>') : "We don't have a biography for Greg Kriek."}</p></div>
                </section>
            </div>
            </div>
         </div>
        `

        PersonPage.container.appendChild(div);
    }

    static renderMostFamiliarMovies(movies) {
        const section = document.createElement('section');
        section.classList = 'full-wrapper';
        const template = movie => (`
    
            <li class="card">
                <div class="image">
                ${!movie.poster_path ?
                `<a class="primary-photo no_image_holder" href="#" data-movie-id="${movie.id}"></a>` :
                `<a class="primary-photo" href="#" data-movie-id="${movie.id}"><img alt="" title="" src="${Person.BACKDROP_BASE_URL + movie.poster_path}"></a>`}
                </div>
                <p data-movie-id='${movie.id}'}><a href="#" data-movie-id="${movie.id}">${movie.title}</p>
            </li>
        `);

        section.innerHTML = `
            
        <div class="col-12">
        <h2>Known for</h2>
            <div class="cast-list">
                <ol class="people scroller">
                ${movies.reduce((total, movie) => total + template(movie), '')}
                </ol>
            </div>
        </div>
        `

        document.getElementById('right-wrapper').appendChild(section);

    }

    static renderFullListMovies(movies) {
        const section = document.createElement('section');
        section.classList = 'full_wrapper credits';

        const checkEpesodes = movie => {
            let epesode = ``;
            if (movie.media_type === 'tv') {
                epesode = `${movie.episode_count} episode`
                if (movie.episode_count > 1)
                    epesode += `s`
            }

            return epesode;
        }

        const getYear = movie => {
            let date = '';
            if (movie.media_type === 'movie') {
                date = movie.release_date
            }
            else if (movie.media_type === 'tv') {
                date = movie.first_air_date
            }

            return new Date(date).getFullYear()
        }

        section.innerHTML = `
            <div class="credits_list">
                <h3>Acting</h3>
                <table class="table">
                    <tbody>
                        <tr>
                            <td>
                                <table>
                                    <tbody>
                                        ${movies.reduce((total, movie) => {
            let td = `
                                                <tr>
                                                    <td class="year">${getYear(movie)}</td>
                                                    <td class="seperator"></td>
                                                    <td class="role"><a href="#" data-movie-id="${movie.id}">${movie.media_type === 'movie' ? movie.title : movie.name}</a> <span class="group">${checkEpesodes(movie)} ${movie.character ? ` as <span class="character"> ${movie.character}` : ''}</span></span></td>
                                                </tr>`
            let newTotal = total + td;

            const nextMovieIndex = movies.indexOf(movie) + 1
            if (movies[nextMovieIndex] && getYear(movies[nextMovieIndex]) !== getYear(movie)) {
                newTotal += `</tbody></table></td></tr><tr><td><table><tbody>`
            }

            return newTotal;
        }, '')}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        `;


        document.getElementById('right-wrapper').appendChild(section);

    }
}

class Events {
    static bindMovieListener() {
        const movieElements = document.querySelectorAll("[data-movie-id]");
        movieElements.forEach(elem => {
            elem.addEventListener('click', function (e) {
                let element = e.target.dataset.movieId ? e.target : e.target.parentNode;
                Movies.run(element.dataset.movieId);
            })
        })
    }

    static bindMovieCategoryListener() {
        document.querySelectorAll("[data-movies-category]").forEach(elem => {
            elem.addEventListener('click', async function (e) {
                let element = e.target.dataset.moviesCategory ? e.target : e.target.parentNode;

                const movies = await APIService.fetchMovies(element.dataset.moviesCategory)
                HomePage.renderMovies(movies);
                if (element.dataset.moviesCategory !== 'popular') {
                    const div = document.createElement('div');
                    div.className = "row"
                    div.innerHTML = `
                        <div class="col-12 movie-category"><h3>${e.target.textContent}</h3></div>    
                    `
                    HomePage.container.prepend(div)
                }
            })
        })
    }

    static bindMovieKeywordListener() {
        document.querySelectorAll("[data-keyword-id]").forEach(elem => {
            elem.addEventListener('click', async function (e) {
                let element = e.target.dataset.keywordId ? e.target : e.target.parentNode;

                const movies = await APIService.fetchKeyword(element.dataset.keywordId)
                console.log(movies);
                Search.renderMoviesSearchResult(movies);
                const div = document.createElement('div');
                div.className = "row"
                div.innerHTML = `
                        <div class="col-12 movie-category"><h3>Category: ${e.target.textContent}</h3></div>    
                    `
                HomePage.container.prepend(div)

            })
        })

    }

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
        this.backdropPath = json.poster_path;
        this.genres = json.genres;
        this.voteAverage = json.vote_average;
        this.voteCount = json.vote_count;
        this.spokenLanguages = json.spoken_languages;
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }
}

class Person {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.name = json.name;
        this.alsoKnownAs = json.also_known_as;
        this.gender = json.gender === 1 ? 'Female' : 'Male';
        this.biography = json.biography;
        this.knownForDepartment = json.known_for_department;
        this.birthday = new Date(json.birthday).toLocaleDateString();
        this.yearsOld = new Date(Date.now()).getFullYear() - new Date(json.birthday).getFullYear()
        this.placeOfBirth = json.place_of_birth;
        this.profilePath = json.profile_path;
        this.deathday = json.deathday //TODO
    }

    get backdropUrl() {
        return this.profilePath ? Person.BACKDROP_BASE_URL + this.profilePath : "";
    }
}

$('.pie_progress').asPieProgress('start');
document.addEventListener("DOMContentLoaded", App.run);

// $(document).ready(function(){
//     $('.circle').circleProgress({
//         startAngle: -Math.PI / 2,
//         fill: "#0575e6"
//     }).on('circle-animation-progress', function(event, progress, stepValue) {
//         $(this).find('span').html(Math.round(stepValue * 100) + '%');
//     });

//     $(function () {
//         $("#commentForm").validate();
//     });

// });

function updateVoteAverage() {
    $('.pie_progress').asPieProgress({
        namespace: 'pie_progress'
    });
    $('.pie_progress').asPieProgress('start');
}

