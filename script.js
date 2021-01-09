$(document).ready(function () {
    
    $(".movie-search-btn").on('click', async function(){
        event.preventDefault();

        let movieTitle = $(".form-control").val();
        console.log(movieTitle)
        let movieData = await getMovieData(movieTitle);
        console.log("moviedata 1", movieData.Search)
        appendMovies(movieData.Search)
        $(document).on('click', '.nominate-btn', function(){
            let selectedMovie = $(this).attr('id')
            let nominatedMovie = nominateMovie(movieData.Search, selectedMovie)
            console.log(nominatedMovie[0])
            moveToNominate(nominatedMovie[0])
        } )

        $(document).on('click', '.remove-btn', function(){
            let selectedMovieId = $(this).attr('id');
            $(`#${selectedMovieId}`).remove();

            let removedMovie = nominateMovie(movieData.Search, selectedMovieId);
            let element = `
            <div id="${removedMovie[0].imdbID}">
                <p>${removedMovie[0].Title}</p>
                <p>${removedMovie[0].Year}</p>
                <button type="button" class="btn btn-primary nominate-btn" id="${removedMovie[0].imdbID}">Nominate</button>
            </div>`
            $('.movies-result-container').prepend(element)
            // appendElement(element, ".movies-result-container")

        })
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
        let movie =  movieData.filter(movie => movie.imdbID === movieId)

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