//script.js
"use strict";

(function () {
    const MY_SERVER_BASEURL = '/api/jokebook';
    window.addEventListener("load", init);

    function init() {
        getRandomJoke();
        getCategories();
    }

    function getRandomJoke() {
        let jokeDiv = id("randJoke-container");
        fetch(MY_SERVER_BASEURL + "/random")
            .then(checkStatus)
            .then((response) => {
                addParagraph(jokeDiv, response);
            })
            .catch((error) => {
                console.error("Error: ", error);
            });
    }

    function addParagraph(jokeDiv, randJoke) {
        let article = document.createElement("article");
        let heading = document.createElement("h3");
        let br = document.createElement("br");
        let para = document.createElement("p");
        para.appendChild(document.createTextNode(randJoke.setup));
        para.appendChild(br);
        para.appendChild(document.createTextNode(randJoke.delivery));
        article.appendChild(heading);
        article.appendChild(para);
        jokeDiv.appendChild(article);
    }

    function getCategories() {
        let list = id("categories-list");

        fetch(MY_SERVER_BASEURL + "/categories")
            .then(checkStatus)
            .then((response) => {
                console.log(response);
                list.innerHTML = "";
                for (const item of response) {
                    const li = document.createElement("li");
                    const link = document.createElement("a");
                    
                    li.textContent = item.name;
                    link.href = "#";
                    li.style.cursor = "pointer";
                    li.addEventListener("click", function () {
                        getJokesByCategory(item.name);
                    });

                    list.appendChild(li);
                    li.appendChild(link);
                }
            })
            .catch((error) => {
                console.error("Error: ", error);
            });

    }

    function getJokesByCategory(category) {
        let jokesDiv = id("jokes-container");
    
        jokesDiv.innerHTML = "";
        fetch(MY_SERVER_BASEURL + "/categories/" + category)
            .then(checkStatus)
            .then((response) => {
                for (const joke of response) {
                    addParagraph(jokesDiv, joke);
                }
            })
            .catch((error) => {
                console.error("Error: ", error);
            });
    }

    function submitCategory(event) {
        let params = new FormData(id("input-form"));
        let jsonBody = JSON.stringify(Object.fromEntries(params));
        let category = JSON.parse(jsonBody).category;
        console.log(category);

        if (!category) {
            return;
        }

        let jokesDiv = id("jokes-container");
        jokesDiv.innerHTML = "";

        fetch(MY_SERVER_BASEURL + "/categories/" + category)
            .then(checkStatus)
            .then((response) => {
                for (const joke of response) {
                    addParagraph(jokesDiv, joke);
                }
            })
            .catch((error) => {
                console.error("Error: ", error);
            });
    }

    function submitNewJoke() {
        let params = new FormData(id("form-container"));
        let jsonBody = JSON.stringify(Object.fromEntries(params));
        let category = JSON.parse(jsonBody).category;
        console.log(category);

        fetch(MY_SERVER_BASEURL + "/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json, text/plain, */*",
            },
            body: jsonBody,
        })
            .then(checkStatus)
            .then(refreshTable)
            .then(() => {getJokesByCategory(category)})
            .catch(alert);

    }
    

    let createButton = id("create-joke");
    createButton.addEventListener("click", function (e) {
        e.preventDefault();
        submitNewJoke();
    });


    document.getElementById("input-form").addEventListener("submit", function (e) {
        e.preventDefault();
        submitCategory();
    });

    function refreshTable() {
        id("form-container").reset();
        document.querySelectorAll("td").forEach((element) => {
            element.remove();
        });
    }


    //helper functions - place other functions above this line
    function id(idName) {
        return document.getElementById(idName);
    }
    function checkStatus(response) {
        if (!response.ok) {
            throw Error("Error in request: " + response.statusText);
        }
        return response.json();
    }
})();