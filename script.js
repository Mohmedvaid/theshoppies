$(document).ready(function () {
    let count = 0
    let movieData;

    $(".movie-search-btn").on('click', async function (e) {
        e.preventDefault();
        let movieTitle = $(".form-control").val();
        movieData = await getMovieData(movieTitle);
        $(".movies-result-container").empty();
        appendMovies(movieData.Search, movieTitle)
        $('.movies-result-container').show()

        $(".nominate-btn").unbind().click(function() {
            $('.nominated-movie').show()
            if (count < 5) {
                let selectedMovie = $(this).attr('id')
                let nominatedMovie = nominateMovie(movieData.Search, selectedMovie)
                moveToNominate(nominatedMovie[0])
                count++;
            } else {
                alert("you have reached 5 movie limit")
            }
        })
        
    })
    $(document).on('click', '.remove-btn', function () {
        $(this).unbind("click")
        let selectedMovieId = $(this).attr('id');
        $(`div#${selectedMovieId}`).remove();
        count--;

    })

    const getMovieData = async (movieTitle) => {
        let query = `https://www.omdbapi.com/?apikey=2ec4e2e5&s=${movieTitle}`
        let movieData = await $.ajax({
            url: query,
            method: "GET"
        })
        return movieData;
    }
    const appendMovies = (dataArray, searchTerm) => {
        let resultContainer = createMoviesResultContainer(dataArray, searchTerm)
        appendElement(resultContainer, '.movies-result-container')

    }

    const createMoviesResultContainer = (dataArray, searchTerm) =>{
        return container = `
        <div class=results-search> 
        <p class="results-heading"> Results of "${searchTerm}"</p>
            ${dataArray.map(movie =>{
                movieYear = movie.Year;
                // Remove "-" if there is only one year
                if(movieYear[movieYear.length - 1] == "–" ){
                    movieYear = movieYear.slice(0, -1)
                }
                return `
                <div id="${movie.imdbID}" class="result-movie">
                    <img src="${movie.Poster}" alt="${movie.Title} poster" width="100" height="100">
                    <p>Title: ${movie.Title}</p>
                    <p>Year: ${movieYear}</p>
                    <button type="button" class="btn btn-success btn-sm nominate-btn" id="${movie.imdbID}">Nominate</button>
                </div>`
            }).join('')}
        </div>`
    }

    const appendElement = (elemnt, appendTo) => {
        $(`${appendTo}`).append(elemnt);
    }

    const nominateMovie = (movieData, movieId) => {
        return movieData.filter(movie => movie.imdbID === movieId)
    }

    const removeNominatedMovie = (movieData, movieId) => {
        let movie = movieData.filter(movie => movie.imdbID === movieId)

    }

    const moveToNominate = (movie) => {

        let element = `
        <div id="${movie.imdbID}" class="result-movie">
            <img src="${movie.Poster}" alt="Girl in a jacket" width="100" height="100">
            <p>${movie.Title}</p>
            <p>${movie.Year}</p>
            <button type="button" class="btn btn-danger btn-sm remove-btn"  id="${movie.imdbID}">Remove</button>
        </div>`
        // remove from results
        $(`div#${movie.imdbID}`).remove();

        // add to nominate section
        appendElement(element, ".results-nominations")
    }

    //ready ends
});