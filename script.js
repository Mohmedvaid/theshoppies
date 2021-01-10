$(document).ready(function () {
            let count = 0
            let movieData;
            let isMobile = window.matchMedia("only screen and (max-width: 786px)").matches;
            let nominatedList = [];

            $(function () {
                $(document).on('click', '#nominationLimitAlertCloseBtn', function () {
                    $(this).parent().hide();
                })
            });

            $(".movie-search-btn").on('click', async function (e) {
                e.preventDefault();
                let movieTitle = $(".form-control").val();
                movieData = await getMovieData(movieTitle);
                $(".movies-result-container").empty();
                appendMovies(movieData.Search, movieTitle)
                $('.movies-result-container').show()

                $(".nominate-btn").unbind().click(function () {
                    $('.nominated-movie').show();
                     if (count < 5) {
                        let selectedMovieButtonId = $(this).attr('id')
                        selectedMovieImdbId = selectedMovieButtonId.split("-")[1]
                        nominatedList.push(selectedMovieImdbId)
                        $(`#${selectedMovieButtonId}`).addClass('disabled')

                        let nominatedMovie = nominateMovie(movieData.Search, selectedMovieImdbId)
                        moveToNominate(nominatedMovie[0])
                        // scroll screen to nomination section
                        if (isMobile) {
                            $('html, body').animate({
                                scrollTop: $("div.nominated-movie").offset().top
                            }, 100);
                        }
                        count++;
                        console.log(count)
                        if(count === 5){
                            alert("yay!!!!!")
                        }
                    }else {
                        $('#nominationLimitAlert').show();
                        $("html, body").animate({
                            scrollTop: 0
                        });
                    }
                })

            })
            $(document).on('click', '.remove-btn', function () {
                $(this).unbind("click")
                let selectedMovieId = $(this).attr('id');
                $(`div#${selectedMovieId}`).remove();
                nominateBtnId = selectedMovieId.split("-")[1]
                $(`#resultbtn-${nominateBtnId}`).removeClass(`disabled`)
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

            const createMoviesResultContainer = (dataArray, searchTerm) => {
                return container = `
                    <div class=results-search> 
                    <p class="results-heading"> Results of "${searchTerm}"</p>
                        ${dataArray.map(movie =>{
                            movieYear = movie.Year;
                            isNominated = ""
                            if(nominatedList.includes(movie.imdbID)){
                                isNominated = "disabled"
                            }
                            // Remove "-" if there is only one year
                            if(movieYear[movieYear.length - 1] == "–" ){
                                movieYear = movieYear.slice(0, -1)
                            }
                            return ` 
                                <div id = "result${movie.imdbID}"class = "result-movie">
                                    <img class = "result-movie-grid-img" src = "${movie.Poster}" alt = "${movie.Title} poster" width = "100" height = "100" style = "border-radius:5px;">
                                    <p class = "result-movie-grid-title" style = "font-family: roboRoboto, Arial, sans-serif;" > ${movie.Title} </p> 
                                    <p class = "result-movie-grid-year" style = "font-family: roboRoboto, Arial, sans-serif;" > ${movieYear} </p> 
                                    <button type = "button" class = "btn btn-success btn-sm nominate-btn result-movie-grid-btn ${isNominated}" id = "resultbtn-${movie.imdbID}"> Nominate </button> 
                                </div>`
                        }).join('')
                } </div>`
}

const appendElement = (elemnt, appendTo) => {
    $(`${appendTo}`).append(elemnt);
}

const nominateMovie = (movieData, movieId) => {
    return movieData.filter(movie => movie.imdbID === movieId)
}


const moveToNominate = (movie) => {

let element = `
        <div id="nominated-${movie.imdbID}" class="result-movie">
            <img class="result-movie-grid-img"  src="${movie.Poster}" alt="Girl in a jacket" width="100" height="100">
            <p class="result-movie-grid-title">${movie.Title}</p>
            <p class="result-movie-grid-year">${movie.Year}</p>
            <button type="button" class="btn btn-danger btn-sm remove-btn result-movie-grid-btn"  id="nominated-${movie.imdbID}">Remove</button>
        </div>`
// remove from results
$(`#result-btn-${movie.imdbID}`).addClass(`disabled`);

// add to nominate section
appendElement(element, ".results-nominations")
}

//ready ends
});