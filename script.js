$(document).ready(function () {
    
    $(".movie-search-btn").on('click', async function(){
        event.preventDefault();

        let movieTitle = $(".form-control").val();
        console.log(movieTitle)
        let movieData = await getMovieData(movieTitle);
        console.log("moviedata 1", movieData.Search)
        appendMovies(movieData.Search)
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
            let element = `<h1>${movie.Title}</h1>`
            appendElement(element, ".movies-result-container")
        });
    }

    const appendElement = (elemnt, appendTo) => {
        $(`${appendTo}`).append(elemnt);
    }


    //ready ends
});