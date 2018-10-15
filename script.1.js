'use strict';

let employeeNumber = 12;
let temp = 25.01;
document.querySelector("#employeeNumber").addEventListener("change", (el) => {
    employeeNumber = el.target.value;
    requestEmployee(employeeNumber);
    return employeeNumber;
});
function requestEmployee(Number) {

    let url = `https://randomuser.me/api/?results=${Number}&nat=us,au,nz,gb&inc=name,email,picture,cell,location,dob&noinfo`;
    let users;
    fetch(url)
        .then(response => response.json())
        .then(data => data.results)
        .then(u => userCard(u))
        .then(a => tester(a))
        .then(b => searchFeauture(b))



    function userCard(users) {
        let cards = "";
        users.map(function (user, index) {

            cards += `<div class= "card cardNum${index}">
            <div class = "card-img-container">
            <img class = "card-img" src = " ${user.picture.medium} " alt = "profile picture" >
            </div>
            <div class = "card-info-container"> 
            <h3 id = "name" class = "card-name cap">  ${user.name.first} ${user.name.last} </h3>
            <p class = "card-text"> ${user.email} </p>
            <p class = "card-text cap" > ${user.location.city}  </p>
            <p class = "card-text cap">   </p>
            </div> 
            </div>`;


        });
        document.querySelector("#gallery").innerHTML = cards;
        searchBoxIntegration();
        return users;
    };

    function tester(users) {
        let cards = document.querySelectorAll("#gallery > .card")
        let gallery = document.querySelector("#gallery")
        let modalWindow = document.querySelector(".modal-container");
        let temp;



        for (let i = 0; i < cards.length; i++) {
            (cards[i]).addEventListener('click', function () {
                function currentModal() {
                    let modals = ""
                    let user = users[i];

                    // console.log(user.location.coordinates.latitude);
                    console.log(user.location.coordinates);


                    modalSkeleton();
                    modals += ` <button type = "button" id = "modal-close-btn" class = "modal-close-btn"> <strong> X </strong></button>
                <div class = "modal"><div class = "modal-info-container">
                <img class = "modal-img" src = "${user.picture.large} " alt = "profile picture">
                <h3 id = "name" class = "modal-name cap" > ${user.name.title} ${user.name.first} ${user.name.last} </h3> <p class = "modal-text"> ${user.email} </p >
                <p class = "modal-text cap"> ${user.location.city}</p>
                
                <hr>
                <p class = "modal-text"> ${user.cell} </p>  
                <p class = "modal-text" > ${user.location.street}, ${user.location.state}</p>
                <p class = "modal-text"> Birthday: ${ (user.dob.date).slice(0,10).replace(/-/g, " / ") }</p>  
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
                
                `;
                    document.querySelector(".modal-container").innerHTML = modals;
                    document.querySelector("#modal-close-btn").addEventListener("click", function () {
                        document.querySelector("body").removeChild(document.querySelector(".modal-container"));
                    }, false);

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

    function getWeather() {
        console.log("meaw")
        let lat = 12;
        let lon = 29;
        // let {
        //     lat,
        //     lon
        // } = coord;

        let latitude = parseInt(lat, 10);
        let longitude = parseInt(lon, 10);
        let temperature;
        let weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=d7b672a5d68f17bd471838cb397cc325`

        fetch(weatherURL).then(function (response) {
            return response.json();
        }).then(function (data) {
            temperature = data.main.temp;
            temperature -= 273.15;
            temperature = (Math.floor(temperature).toFixed(0));
        })
        console.log(temperature)
        return temperature;
    }


    function searchBoxIntegration() {
        let searchBox = `<form action="#" method="get">
                        <input type="search" id="search-input" class="search-input" placeholder="Search...">
                        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
                    </form>`

        document.querySelector(".search-container").innerHTML = searchBox;

    }



    function searchFeauture(users) {


        document.querySelector("#search-input").addEventListener("keyup", function (el) {
            let searchFieldValue = el.target.value;
            let expr = new RegExp(searchFieldValue, "i");
            // document.querySelector("#gallery").style.display = "none";
            let cards = "";
            users.map(element => {
                console.log(element.name.first.search(expr));
                if ((element.name.first.search(expr) != -1) || (element.name.last.search(expr) != -1)) {
                    let user = element;
                    cards += `<div class= "card">
                            <div class = "card-img-container">
                                 <img class = "card-img" src = " ${user.picture.medium} " alt = "profile picture" >
                            </div>
                                <div class = "card-info-container"> 
                                <h3 id = "name" class = "card-name cap">  ${user.name.first} ${user.name.last} </h3>
                                <p class = "card-text"> ${user.email} </p>
                                <p class = "card-text cap" > ${user.location.city} - ${user.location.state} </p>
                            </div> 
                        </div>`;

                };

            });
            document.querySelector("#gallery").innerHTML = cards;

        })
        return users;
    }

    ///////////////////////////////// < > /////////////////////////////////
    ///////////////////////////////// < > /////////////////////////////////
    ///////////////////////////////// < > /////////////////////////////////
    // function getWeather(coord) {
    //     let {lat, lon}= coord;
    //     let latitude = parseInt(lat,10);
    //     let longitude = parseInt(lon,10);
    //     let weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=d7b672a5d68f17bd471838cb397cc325`

    //     fetch(weatherURL).then(function (response) {
    //         return response.json();
    //     }).then(function (data) {
    //         let temp = data.main.temp;
    //         temp -= 273.15;

    //         console.log(Math.floor(temp));
    //         return temp;
    //     });
    // }
    // getWeather({long: "25.1175", lon: "-15.2419" });
    // getWeather({latitude: "5.4787", longitude: "-142.9786"});

    ///////////////////////////////// < > /////////////////////////////////
    ///////////////////////////////// < > /////////////////////////////////
    ///////////////////////////////// < > /////////////////////////////////




    ///////////////////////////////// < functions > /////////////////////////////////
    ///////////////////////////////// < > /////////////////////////////////
    ///////////////////////////////// < > /////////////////////////////////


    function modalSkeleton(el, cl, appendto) {

        const newdiv = document.createElement("div");
        newdiv.className += "modal-container";
        document.body.appendChild(newdiv);
    }
}


requestEmployee(employeeNumber);