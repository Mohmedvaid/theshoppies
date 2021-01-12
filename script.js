$(document).ready(function () {
    // totalNominatedMovies keep tracks of current total nominated movies
    let totalNominatedMovies = 0;
    // movieData is global as its used across the script but not manuplulated anywhere
    let movieData;
    // isMobile to add better usage in small screen devices
    let isMobile = window.matchMedia(`only screen and (max-width: 786px)`).matches;
    // nominatedList to store the movies in localstorage
    let nominatedList = [];
    // max movies user can nominate
    let maxMoviesToNominate = 5

    // Close error alert form
    $(function () {
        $(document).on(`click`, `.alert`, function () {
            $(this).hide();
        })
    });

    // Display seach results with validations
    $(`.movie-search-btn`).on(`click`, async function (e) {
        e.preventDefault();
        let movieTitle = $(`.form-control`).val();
        $(`.alert`).hide()
        //Input validation 
        if(!movieTitle){
            alert(`Please enter a value in the search field.`)
        }
        else {
            appendLoaderToBody();
            movieData = await getMovieData(movieTitle);
            removeLoader();
        }

        // if error display it, else display movies
        if(movieData.Error){
            $(`#iomdb-error-message`).remove()
            $(`#iomdb-error`).prepend(`<p id="iomdb-error-message">${movieData.Error}</p>`)
            $(`#iomdb-error`).removeClass(`hidden`);
            $(`.movies-result-container`).addClass(`hidden`)
            
        } else {
            $(`.movies-result-container`).empty();
            appendMovies(movieData.Search, movieTitle)
            $(`.movies-result-container`).removeClass(`hidden`);
            $(`.results`).removeClass(`hidden`);
            if(nominatedList.length === 0){
                addEmptyNominationListMessage();
            }

        }
    })

    // Nominate
    $(document).on(`click`,`.nominate-btn`, function (e) {
        $(`.nominate-btn`).unbind()
        $(`.nominated-movie`).removeClass(`hidden`);
        $(`#empty-nomination-list-message`).remove()
        $(`.alert`).hide()

        // if the nomiated movies are less the 5, nominate the clicked movie
            if (totalNominatedMovies < maxMoviesToNominate) {
                // get buttin id 
                let selectedMovieButtonId = $(this).attr(`id`)
                
                // extract the movie id from the clicked button id
                selectedMovieImdbId = selectedMovieButtonId.split(`-`)[1]
                
                // disblale nominate button
                $(`#${selectedMovieButtonId}`).addClass(`disabled`)
                
                // get movie data of the clicked movie
                let nominatedMovie = getMovieById(movieData.Search, selectedMovieImdbId)

                let movieDetails = {
                    imdbID: nominatedMovie[0].imdbID,
                    Title: nominatedMovie[0].Title,
                    Year: nominatedMovie[0].Year,
                    Poster: nominatedMovie[0].Poster,
                }
                // add movie to nominated list. This list will help to disable the nominate button for the movies already nominated
                nominatedList.push(movieDetails)
                localStorage.setItem(`nominatedList`, JSON.stringify(nominatedList));

                // move to nominate section on the DOM
                moveToNominate(nominatedMovie[0]);

                // Increament the totalNominatedMovies count of nominated movie
                totalNominatedMovies++;
                
                // scroll screen to nomination section
                if (isMobile) {
                    $(`html, body`).animate({
                        scrollTop: $(`div.nominated-movie`).offset().top
                    }, 100);
                }

                // if there are 
                if(totalNominatedMovies === maxMoviesToNominate){
                    $(`#maxNominationReached`).removeClass(`hidden`).show();
                }
            // display error message on DOM as user has reached max nomination limit
            } else {
                $(`#nominationLimitAlert`).removeClass(`hidden`).show();
                $(`html, body`).animate({
                    scrollTop: 0
                });
            }
    })


    // Remove nominated movies
    $(document).on(`click`, `.remove-btn`, function () {
        $(this).unbind(`click`)

        let nominateBtnId = $(this).attr(`id`);
        $(this).parent().remove();
        let selectedMovieId = nominateBtnId.split(`-`)[1]
        $(`#resultbtn-${selectedMovieId}`).removeClass(`disabled`)
        totalNominatedMovies--;
        $(`.alert`).hide()

        removeFromNominationList(selectedMovieId);
        localStorage.setItem(`nominatedList`, JSON.stringify(nominatedList));

        if(nominatedList.length === 0){
            addEmptyNominationListMessage();
        }
    })

    // user friendly loader
    const appendLoaderToBody = () => {
        $(`body`).prepend(`<div id="loading">
        <img id="loading-image" src="Assets/spinner.svg" alt="Loading..."/>
        </div>`);
    }

    const removeLoader = () => {
        setTimeout(function () {
            $(`#loading`).remove();
        }, 500);
    }


    const removeFromNominationList = (movieId) => {
        let index = -1;

        // get index of movie
        for(let i = 0; i < nominatedList.length; i++){
            if(nominatedList[i].imdbID === movieId){
                index = i;
            }
        }
        // remove the element form the nominationList
        if (index > -1) {
            nominatedList.splice(index, 1);
        }
    }

    const addEmptyNominationListMessage = () => {
        $(`#empty-nomination-list-message`).remove();
        $(`.results-nominations`).append(`<p id="empty-nomination-list-message">No Nominations!</p>`);
        
    }

    // get movies from OMDB
    const getMovieData = async (movieTitle) => {
        let query = `https://www.omdbapi.com/?apikey=2ec4e2e5&s=${movieTitle}`
        let movieData = await $.ajax({
            url: query,
            method: `GET`
        })
        return movieData;
    }

    // append movies to DOM
    const appendMovies = (dataArray, searchTerm) => {
        let resultContainer = createMoviesResultContainer(dataArray, searchTerm)
        appendElement(resultContainer, `.movies-result-container`)

    }

    // create movie container from the results returned by OMDB
    const createMoviesResultContainer = (dataArray, searchTerm) => {
        return container = `
            <div class=results-search> 
            <p class="results-heading"> Results of "${searchTerm}"</p>
                ${dataArray.map(movie =>{
                    movieYear = movie.Year;
                    isNominated = ``

                    //  Disable to nominate button if movie already nominated
                    nominatedList.forEach(nominatedMovie => {
                        if(movie.imdbID === nominatedMovie.imdbID){
                            isNominated = `disabled`
                        }
                        return false;
                    })

                    // Remove "-" if there is only one year
                    if(movieYear[movieYear.length - 1] == `–` ){
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
                }).join(``)
        } </div>`
    }

    // helper function to append elements
    // pretty much same as append but personal preference 
    const appendElement = (elemnt, appendTo) => {
        $(`${appendTo}`).append(elemnt);
    }

    // get movie from 
    const getMovieById = (movieData, movieId) => {
        return movieData.filter(movie => movie.imdbID === movieId)
    }

    // move the movie from Results container to Nominations container
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
        // append to Nominations
        appendElement(element, `.results-nominations`)
    }


    // If theres nomination list in localstorage render it when page loads
    if (JSON.parse(localStorage.getItem(`nominatedList`)).length > 0) {
        nominatedList = JSON.parse(localStorage.getItem(`nominatedList`))

        nominatedList.forEach(movie => {
            moveToNominate(movie)
            totalNominatedMovies++;
        });
        $(`.results`).removeClass(`hidden`);
        $(`.nominated-movie`).removeClass(`hidden`);
    }
//ready ends
});