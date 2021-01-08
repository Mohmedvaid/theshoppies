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
            console.log(nominatedMovie)
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
            <p>${movie.Title}</p>
            <p>${movie.Year}</p>
            <button type="button" class="btn btn-primary nominate-btn" id="${movie.imdbID}">Nominate</button>`
            appendElement(element, ".movies-result-container")
        });
    }

    const appendElement = (elemnt, appendTo) => {
        $(`${appendTo}`).append(elemnt);
    }

    const nominateMovie = (movieData, movieId) => {
        return movieData.filter(movie => movie.imdbID === movieId)
    }



    //ready ends
});