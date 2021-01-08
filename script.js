$(document).ready(function () {
    
    $(".movie-search-btn").on('click', async function(){
        event.preventDefault();

        let movieTitle = $(".form-control").val();
        console.log(movieTitle)
        let movieData = await getMovieData(movieTitle);
        console.log("moviedata 1", movieData.Search)
        appendMovies(movieData.Search)
        $(document).on('click', '.nominate-btn', function(){
            selectedMovie = $(this).attr('id')
            let nominatedMovie = nominateMovie(movieData.Search, selectedMovie)
            console.log(nominatedMovie[0])
            moveToNominate(nominatedMovie[0])
        } )
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

    const removeNominatedMovieFromResults = (imdbID) => {

    }

    const moveToNominate = (movie) =>{
        // remove from results
        console.log(movie)
        // add to nominate section
        $(`div#${movie.imdbID}`).remove();
        appendElement(movie.Title, ".nominated-movie")
    }

    //ready ends
});