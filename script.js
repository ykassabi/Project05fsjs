'use strict';
/** OverView:
 * 1- Main Function is : requestEmployees, from randomeuser, can take 2 parametres, number  and contries, it s call 3 times , 
 * by default at the start, at any change in the Advance Search Menu, change of number of emplyees and selection of contries, 
 * at the bottom personalising the requestes with anonymos functions for-2- the number of employees and -3-the contries'origin to request linked to event handler, 
 *  */


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// FETCHING  EMPLOYEES 
let numberOfEmployees = 12;

function requestEmployees(Number, contries = "us,au,nz,gb") {

    // let url = `https://randomuse.me/api/?results=${Number}&nat=${contries}&inc=name,email,picture,cell,location,dob,nat&noinfo`;
    let url = `https://randomuser.me/api/?results=${Number}&nat=${contries}&inc=name,email,picture,cell,location,dob,nat&noinfo`;
    fetch(url)
        .then(response => response.json()) //parseJSON
        .then(data => data.results) //keeping just the data
        .then(tempUsers => getWeather(tempUsers)) //getting temperatue using OpenWeatherMap API//limited at 60 request a min
        .then(u => userCard(u)) //generate the view and impliment it to HTML 
        .then(a => EmployeeDetailsModal(a)) //the modal function to display detail info
        .then(b => searchFeauture(b)) // to search in the current users.
        .catch(e => displayError(e, "😲 Sorry, it looks...something went wrong,PLS! try again later", "red"));


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// EMPLOYEES CARDS 
    //creating Cards
    function userCard(users) {

        let cards = "";
        users.map(function (user) {
            cards += makingCards(user)
        });
        document.querySelector("#gallery").innerHTML = cards;

        searchBoxIntegration();
        return users;
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// CREATING MODAL TO HANDLE THE EMPLOYEE DETAILS
    function EmployeeDetailsModal(users) {
        let cards = document.querySelectorAll("#gallery > .card")

        for (let i = 0; i < cards.length; i++) {
            (cards[i]).addEventListener('click', function () {
                function currentModal() {
                    // creating of the windows with modalSkeleton and generating the HTML and passing to modals
                    let modals = ""
                    let user = users[i];
                    modalSkeleton();
                    modals += makingDetailedInfo(user)
                    document.querySelector(".modal-container").innerHTML = modals;


                    // closing the modal window
                    document.querySelector("#modal-close-btn").addEventListener("click", function () {
                        document.querySelector("body").removeChild(document.querySelector(".modal-container"));
                    }, false);

                    // button features on the model windows // and if Statement for the border of the array to have a continues looping.
                    document.querySelector("#modal-next").addEventListener('click', function () {
                        document.querySelector("body").removeChild(document.querySelector(".modal-container"));
                        if (i === cards.length - 1) {
                            i = 0;
                            currentModal(i)
                        } else {
                            currentModal(i++)
                        }
                    }, false) //end of next button


                    document.querySelector("#modal-prev").addEventListener('click', function () {
                        document.querySelector("body").removeChild(document.querySelector(".modal-container"));
                        if (i === 0) {
                            i = cards.length - 1;
                            currentModal(i)
                        } else {
                            currentModal(i -= 1)
                        }
                    }, false)
                    return user;
                }
                currentModal()
            }, false)
        }
        return users;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// Weathing API 

    function getWeather(users) { //to grab the weather when we click for details of the user.
        for (const iterator of users) {

            let lat = iterator.location.coordinates.latitude;
            let lon = iterator.location.coordinates.longitude;
            let latitude = parseInt(lat, 10);
            let longitude = parseInt(lon, 10);
            let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=d7b672a5d68f17bd471838cb397cc325&units=metric`
            let temperature;

            fetch(weatherURL).then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    temperature = data.main.temp; // grabing just temperature.
                    temperature = (Math.floor(temperature).toFixed(0));
                    iterator.temp = temperature; // just adding to object of the current user
                    return data;
                })
                .catch(e => displayError(e, "maybe Too many Requests please, wait and try again, max 60requests/min", "#ae32cd"))
        }
        return users;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// SEARCH ON THE CURRENT USERS 


    function searchBoxIntegration() { //will be added from the first display of the users see userCard funciton
        let searchBox = `<form action="#" method="get">
                        <input type="search" id="search-input" class="search-input" placeholder="Search...">
                        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
                        </form>`

        document.querySelector(".search-container").innerHTML = searchBox;
    }

    function searchFeauture(users) { // Invoked just when the search input field is in focus
        document.querySelector("#search-input").addEventListener("keyup", function (el) {
            let searchFieldValue = el.target.value;
            let expr = new RegExp(searchFieldValue, "i");
            // document.querySelector("#gallery").style.display = "none";
            let cards = "";
            users.map(element => {
                if ((element.name.first.search(expr) != -1) || (element.name.last.search(expr) != -1)) {
                    let user = element;
                    cards += makingCards(user);
                };

            });
            document.querySelector("#gallery").innerHTML = cards;

        })
        return users;
    }
//Error Handling

    function displayError(e, err, color) {
        errorSkeleton();
        let myVar = document.querySelector(".errorBar");
        myVar.innerHTML = `${err} ${e}`;
        myVar.style.background = color;
        setTimeout(function () {
            myVar.innerHTML = ``;
            myVar.style.background = "";
        }, 7000)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////// functions to generate html 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Making cards

    function makingCards(user) {
        return `<div class= "card ">
            <div class = "card-img-container">
            <img class = "card-img" src = " ${user.picture.medium} " alt = "profile picture" >
            </div>
            <div class = "card-info-container"> 
            <h3 id = "name" class = "card-name cap">  ${user.name.first} ${user.name.last} </h3>
            <p class = "card-text"> <i class="fas fa-at"> ${user.email} </i></p>
            <p class = "card-text cap"> <i class="fas fa-map-pin"> ${user.location.city}</i> ${user.nat} 
            <img src="http://www.geonames.org/flags/s/${user.nat.toLowerCase()}.png" />
            </p>
            <p class = "card-text cap">   </p>
            </div> 
            </div>`;
    }

    //Making detaile Modail about the Employee

    function makingDetailedInfo(user) {
        return ` <button type = "button" id = "modal-close-btn" class = "modal-close-btn"> <strong> X </strong></button>
                <div class = "modal"><div class = "modal-info-container">
                <img class = "modal-img" src = "${user.picture.large} " alt = "profile picture">
                <h3 id = "name" class = "modal-name cap" >  ${user.name.first} ${user.name.last} </h3> 
                <p class = "modal-text"><i class="fas fa-at"></i>  ${user.email} </p >
                <p class = "modal-text cap"><i class="fas fa-map-pin"></i>  ${user.location.city}
                  ${user.temp ? user.temp : ""}˚C /${((user.temp *9/5) +32).toFixed(1)} ˚F
                  <abbr title="Temperature is base on the coordonates lattitue and longitude and not the city">❓ </abbr></p>
                <hr>
                <p class = "modal-text"><i class="fas fa-mobile-alt"></i>  ${user.cell} </p>  
                <p class = "modal-text" > <i class="fas fa-map-pin"></i>  ${user.location.street}, ${user.location.state}</p>
                <p class = "modal-text"><i class="fas fa-birthday-cake"></i>  Birthday: ${ (user.dob.date).slice(0,10).replace(/-/g, " / ") }</p>  
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn"><i class="fas fa-arrow-left">  </i> Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next <i class="fas fa-arrow-right">  </i></button>
                </div>`;
    }
    //creating the windows of the skeleton
    function modalSkeleton() {
        const newdiv = document.createElement("div");
        newdiv.className += "modal-container";
        document.body.appendChild(newdiv);
    }
    // creating error bar 
    function errorSkeleton() {
        const newdiv = document.createElement("div");
        newdiv.className += "errorBar";
        document.body.appendChild(newdiv);
    }






} //enf of the requestEmployees
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// invoking function with default setting; employees = 12 and contries Us, AU,NZ,GB
////////////////////////////////////////////////////////////////////////////////////////////////////////

requestEmployees(numberOfEmployees);



////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// Extra Features
////////////////////////////////////////////////////////////////////////////// Advance Search Options: change the number of employee and the contries.
////////////////////////////////////////////////////////////////////////////////////////////////////////
//controling the contries 
document.querySelector("#searchMenu").addEventListener("click", function () { //toggle the advance Search Band

    let numEmp = document.querySelector("#numberOfEmployees");
    let contEmp = document.querySelector("#contriesOfEmployees");
    let searchForm = document.querySelector("#searchForm");

    if (searchForm.style.display == "block") {
        document.querySelector("#searchMenu").innerHTML = `<p id="searchMenu">Advance Search <i class="fas 7x fa-chevron-circle-down "></i></i></p> `
        searchForm.style.display = "none"
        numEmp.style.display = "none";
        contEmp.style.display = "none";
    } else {
        document.querySelector("#searchMenu").innerHTML = `<p id="searchMenu">Advance Search <i class="fas 7x fa-chevron-circle-up "></i></p> `
        searchForm.style.display = "block";
        numEmp.style.display = "inline-block";
        contEmp.style.display = "inline-block";
    }

}, false)

//controlling the the number of employees
document.querySelector("#searchForm ").addEventListener("change", (e) => {
    let arrOfContriesForSearch = [];
    document.querySelectorAll("input[type=checkbox]:checked ").forEach(i => arrOfContriesForSearch.push(i.value));
    let arrOfContriesForSearchString = arrOfContriesForSearch.toString();
    requestEmployees(numberOfEmployees, arrOfContriesForSearchString)
}, false)

document.querySelector("#numberOfEmployees").addEventListener("change", function (el) {
    numberOfEmployees = el.target.value;
    requestEmployees(numberOfEmployees);
    return numberOfEmployees;
}, false)