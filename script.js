$(document).ready(function () {
    let count = 0
    let movieData;
    let isMobile = window.matchMedia("only screen and (max-width: 786px)").matches;
    let nominatedList = [];
    let maxMoviesToNominate = 5

    // Close error alert form
    $(function () {
        $(document).on('click', '.alert', function () {
            $(this).hide();
        })
    });


    // Display seach results with validations
    $(".movie-search-btn").on('click', async function (e) {
        e.preventDefault();
        let movieTitle = $(".form-control").val();
        $(`.alert`).hide()
        //Input validation 
        if(!movieTitle){
            alert("Please enter a value in the search field.")
        }
        else {
            movieData = await getMovieData(movieTitle);
        }

        // if error display it, else display movies
        if(movieData.Error){
            $(`#iomdb-error-message`).remove()
            $(`#iomdb-error`).prepend(`<p id="iomdb-error-message">${movieData.Error}</p>`)
            $(`#iomdb-error`).show()
            $(`.movies-result-container`).addClass(`hidden`)
            
        } else {
            $(".movies-result-container").empty();
            appendMovies(movieData.Search, movieTitle)
            $('.movies-result-container').show()
            $(`.results`).removeClass(`hidden`);
            if(nominatedList.length === 0){
                addEmptyNominationListMessage();
            }

        }
    })

    // Nominate
    $(document).on('click','.nominate-btn', function (e) {
        $(".nominate-btn").unbind()
        $('.nominated-movie').show();
        $(`#empty-nomination-list-message`).remove()
        $(`.alert`).hide()

        // if the nomiated movies are less the 5, nominate the clicked movie
            if (count < maxMoviesToNominate) {
                // get buttin id 
                let selectedMovieButtonId = $(this).attr('id')
                
                // extract the movie id from the clicked button id
                selectedMovieImdbId = selectedMovieButtonId.split("-")[1]

                // add movie id to nominated list. This list will help to disable the nominate button for the movies already nomited
        
                
                // disblale nominate button
                $(`#${selectedMovieButtonId}`).addClass('disabled')
                
                // get movie data of the clicked movie
                let nominatedMovie = nominateMovie(movieData.Search, selectedMovieImdbId)
                console.log("returned movie", nominatedMovie)
                let movieDetails = {
                    imdbID: nominatedMovie[0].imdbID,
                    Title: nominatedMovie[0].Title,
                    Year: nominatedMovie[0].Year,
                    Poster: nominatedMovie[0].Poster,
                }
                nominatedList.push(movieDetails)
                console.log("nominatedList inside", nominatedList)
                localStorage.setItem('nominatedList', JSON.stringify(nominatedList));

                // move to nominate section on the DOM
                moveToNominate(nominatedMovie[0]);

                // Increament the count of nominated movie
                count++;
                
                // scroll screen to nomination section
                if (isMobile) {
                    $('html, body').animate({
                        scrollTop: $("div.nominated-movie").offset().top
                    }, 100);
                }

                // if there are 
                if(count === maxMoviesToNominate){
                    $(`#maxNominationReached`).show()
                }
            // display error message on DOM as user has reached max nomination limit
            } else {
                $('#nominationLimitAlert').show();
                $("html, body").animate({
                    scrollTop: 0
                });
            }
        console.log(count)
    })



    $(document).on('click', '.remove-btn', function () {
        $(this).unbind("click")
        let nominateBtnId = $(this).attr('id');
        $(`div#${nominateBtnId}`).remove();
        let selectedMovieId = nominateBtnId.split("-")[1]
        $(`#resultbtn-${selectedMovieId}`).removeClass(`disabled`)
        count--;

        removeFromNominationList(selectedMovieId, nominatedList)

        if(nominatedList.length === 0){
            addEmptyNominationListMessage();
        }

    })

    const removeFromNominationList = (movieId, nominatedList) => {
        // const index = nominatedList.indexOf(movieId);
        const index = nominatedList.foreach(function(movie, index){
            if(movie.imdbID === movieId){
                return index;
            }
            return -1;
        })
        if (index > -1) {
            nominatedList.splice(index, 1);
        }
    }

    const addEmptyNominationListMessage = () => {
        $(`#empty-nomination-list-message`).remove();
        $(`.results-nominations`).append(`<p id="empty-nomination-list-message">No Nominations!</p>`);
        
    }

    const getMovieData = async (movieTitle) => {
        let query = `https://www.omdbapi.com/?apikey=2ec4e2e5&s=${movieTitle}`
        let movieData = await $.ajax({
            url: query,
            method: "GET"
        })
        console.log(movieData)
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

                    //  Disable to nominate button if movie already nominated
                    nominatedList.forEach(nominatedMovie => {
                        if(movie.imdbID === nominatedMovie.imdbID){
                            isNominated = "disabled"
                        }
                        return false;
                    })

                    // Remove "-" if there is only one year
                    if(movieYear[movieYear.length - 1] == "–" ){
                        movieYear = movieYear.slice(0, -1)
                    }
                    return ` 
                        <div id = "result${movie.imdbID}" class = "result-movie">
                            <img class = "result-movie-grid-img" src = "${movie.Poster}" alt = "${movie.Title} poster" width = "100" height = "100" style = "border-radius:5px;">
                            <p class = "result-movie-grid-title" style = "font-family: roboRoboto, Arial, sans-serif;" > ${movie.Title} </p> 
                            <p class = "result-movie-grid-year" style = "font-family: roboRoboto, Arial, sans-serif;" > ${movieYear} </p> 
                            <button type = "button" class = "btn btn-success btn-sm nominate-btn result-movie-grid-btn ${isNominated}" id = "resultbtn-${movie.imdbID}"> Nominate </button> 
                        </div>
                        <div class="fade-line"></div>
                        `
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
        console.log(movie.iomDbId)
        

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

    if (JSON.parse(localStorage.getItem('nominatedList'))) {
        nominatedList = JSON.parse(localStorage.getItem('nominatedList'))
        console.log(nominatedList)
        nominatedList.forEach(movie => {
            moveToNominate(movie)
        });
        $(`.results`).removeClass(`hidden`);
        $('.nominated-movie').show();
    }
//ready ends
});