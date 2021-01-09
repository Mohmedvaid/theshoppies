$(document).ready(function () {
    let count = 0
    let movieData;

    $(".movie-search-btn").on('click', async function (e) {
        e.preventDefault();
        console.log(count)
        event.preventDefault();
        let movieTitle = $(".form-control").val();
        movieData = await getMovieData(movieTitle);
        $(".movies-result-container").empty();
        appendMovies(movieData.Search)

        $(".nominate-btn").unbind().click(function() {
            if (count < 5) {
                let selectedMovie = $(this).attr('id')
                let nominatedMovie = nominateMovie(movieData.Search, selectedMovie)
                moveToNominate(nominatedMovie[0])
                count++;
                console.log("count in nominate", count)
            } else {
                alert("you have reached 5 movie limit")
            }
        })
        
    })
    $(document).on('click', '.remove-btn', function () {
        $(this).unbind("click")
        let selectedMovieId = $(this).attr('id');
        $(`#${selectedMovieId}`).remove();
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
    const appendMovies = (dataArray) => {
        dataArray.forEach(movie => {
            let element = `
            <div id="${movie.imdbID}">
                <p>${movie.Title}</p>
                <p>${movie.Year}</p>
                <button type="button" class="btn btn-primary nominate-btn" id="${movie.imdbID}">Nominate</button>
            </div>`
            appendElement(element, ".movies-result-container")
        });
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
        <div id="${movie.imdbID}">
            <p>${movie.Title}</p>
            <p>${movie.Year}</p>
            <button type="button" class="btn btn-primary remove-btn" id="${movie.imdbID}">Remove</button>
        </div>`
        // remove from results
        $(`div#${movie.imdbID}`).remove();

        // add to nominate section
        appendElement(element, ".nominated-movie")
    }

    //ready ends
});