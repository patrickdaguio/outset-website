import config from './config'

// Weather App

// API 
const api = {
    keyOne: config.MY_KEY_1,
    keyTwo: config.MY_KEY_2,
    base: "https://api.openweathermap.org/data/2.5/"
}

// HTML TAgs

const searchBox = document.querySelector('.search-box');
const temperatureIcon = document.querySelector('.temperature-icon');
const temperatureDegree = document.querySelector('.temperature-degree');
const geolocation = document.querySelector('.location');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');

searchBox.addEventListener('keypress', setQuery);

window.addEventListener("load", () => {
    let lon;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.keyOne}`)
            .then(weather => {
                return weather.json();
            }).then(displayResults);
        });
    }

    greetings();
    generateQuote();
    dateToday();
    changeDate();
})

function setQuery(e) {
    if (e.keyCode === 13) {
        getResults(searchBox.value);
    }
}

function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.keyOne}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults);
}

function displayResults(weather) {
    temperatureDegree.textContent = Math.round(weather.main.temp);
    geolocation.textContent = `${weather.name}, ${weather.sys.country}`;
    humidity.textContent = `${weather.main.humidity}%`;
    wind.textContent = `${weather.wind.speed.toFixed(1)}mph`;
    if (weather.weather[0].main === "Thunderstorm") {
        temperatureIcon.src=`${require("../images/weather/storming.png")}`;
    } else if (weather.weather[0].main === "Clear") {
        temperatureIcon.src=`${require("../images/weather/sunny.png")}`;
    } else if (weather.weather[0].main === "Snow") {
        temperatureIcon.src=`${require("../images/weather/snowing.png")}`;
    } else if (weather.weather[0].main === "Rain") {
        temperatureIcon.src=`${require("../images/weather/raining.png")}`;
    } else if (weather.weather[0].description === "few clouds" || weather.weather[0].description === "scattered clouds") {
        temperatureIcon.src=`${require("../images/weather/cloudy sun.png")}`;
    } else if (weather.weather[0].main === "Drizzle") {
        temperatureIcon.src=`${require("../images/weather/cloudy rain.png")}`;
    } else if (weather.weather[0].description === "broken clouds" || weather.weather[0].description === "overcast clouds") {
        temperatureIcon.src=`${require("../images/weather/cloudy.png")}`;
    } else if (weather.wind.speed > 30) {
        temperatureIcon.src=`${require("../images/weather/windy.png")}`;
    }
    searchBox.value = '';
}


// Greeting App

// HTML Tags

const time = document.querySelector('.time');
const greeting = document.querySelector('.greeting');
const quote = document.querySelector('.quote');
const quoteOrigin = document.querySelector('.quote-origin');
const todayDate = document.querySelector('.today-date');

function greetings() {
    let date = new Date();

    // Time
    let hours = addZero(date.getHours());
    let minutes = addZero(date.getMinutes());
    let currentTime = `${hours}:${minutes}`;

    time.textContent = currentTime;

    setTimeout(greetings, 1000);
    
    if (hours >= 12 && hours < 18) {
        greeting.textContent = 'Good afternoon, Patrick';
    } else if (hours >= 18 && hours !== 4) {
        greeting.textContent = 'Good evening, Patrick';
    } else if (hours >= 4 && hours < 12) {
        greeting.textContent = 'Good morning, Patrick';
    }
}

function addZero(num) {
    return num < 10 ? `0${num}` : num;
}

// Intention

const intentionInput = document.querySelector('.intention-input')
const intentionAnswer = document.querySelector('.intention-answer')
const intentionCta = document.querySelector('.intention-cta')
const intentionIcons = document.querySelectorAll('.intention-icons')
const intentionQuestionContainer = document.querySelector('.intention-question-container')
const intentionAnswerContainer = document.querySelector('.intention-answer-container')

intentionInput.addEventListener('keypress', changeIntention)
intentionCta.addEventListener('mouseover', intentionAnswerIcons)
intentionCta.addEventListener('mouseleave', removeIntentionIcons)

function changeIntention(e) {
    if (e.keyCode === 13 && e.target.value !== '') {
        intentionQuestionContainer.style.opacity = '0'
        setTimeout(() => {
            intentionQuestionContainer.style.visibility = 'hidden'
            intentionAnswer.textContent = e.target.value
            intentionAnswerContainer.style.visibility = 'visible'
            intentionAnswerContainer.style.opacity = '1'
        }, 600)
    }
}

function intentionAnswerIcons() {
    intentionIcons.forEach(icon => {
        icon.style.visibility = 'visible'
        icon.addEventListener('click', (e) => {
            intentionAnswerContainer.style.opacity = '0'
            setTimeout(() => {
                intentionAnswerContainer.style.visibility = 'hidden'
                intentionQuestionContainer.style.opacity = '1'
                intentionQuestionContainer.style.visibility = 'visible'
            }, 600)
            if (e.target.classList.contains('fa-times')) {
                intentionInput.value = ''
            }
        })
    })
}

function removeIntentionIcons() {
    intentionIcons.forEach(icon => icon.style.visibility = 'hidden')
} 

// Footer

const backgroundLocation = document.querySelector('.background-location')
const changeBackground = document.querySelector('.changeBackground')
const heartBackground = document.querySelector('.background-photo')
const backgroundDetails = document.querySelector('.background-details')
const backgroundInfo = document.querySelector('.background-info')
const backgroundUser = document.querySelector('.background-user')
const backgroundUserLink = document.querySelector('.background-user-link')
const changeQuote = document.querySelector('.changeQuote')
const quotesInfo = document.querySelector('.quotes-info')
const inspirationalQuote = document.querySelector('.quote')
const quoteDetails = document.querySelector('.quote-details')

changeBackground.addEventListener('click', generateBackground)
changeQuote.addEventListener('click', generateQuote);
backgroundInfo.addEventListener('mouseenter', showBackgroundDetails)
backgroundInfo.addEventListener('mouseleave', showBackgroundDetails)
quotesInfo.addEventListener('mouseenter', showQuoteDetails)
quotesInfo.addEventListener('mouseleave', showQuoteDetails)

function generateQuote() {
    fetch("https://type.fit/api/quotes")
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        let index = Math.floor(Math.random() * data.length);
        quote.textContent = `${data[index].text}`;
        if (data[index].author === null) {
            quoteOrigin.textContent = 'Unknown';
        } else {
            quoteOrigin.textContent = `${data[index].author}`;
        }
    });
}

function generateBackground() {
    fetch(`https://api.unsplash.com/collections/GsNw3bdVLPM/photos/?client_id=${api.keyTwo}&per_page=30`)
    .then(response => {
        return response.json()
    })
    .then(data => {
        let bgIndex =  data[Math.floor(Math.random()*data.length)];
        document.body.style.backgroundImage = `url(${bgIndex.urls.full})`
        console.log(bgIndex)
        return fetch(`https://api.unsplash.com/photos/${bgIndex.id}/?client_id=${api.keyTwo}`)
    }).then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        data.location.title === null ? backgroundLocation.textContent = 'Unknown' : backgroundLocation.textContent = data.location.title
        backgroundUser.textContent = data.user.name
        backgroundUserLink.href = data.user.links.html
        heartBackground.href = data.links.html
    })
}

function showBackgroundDetails() {
    backgroundDetails.classList.toggle('background-show')
    backgroundLocation.classList.toggle('background-show')
}

function showQuoteDetails() {
    inspirationalQuote.classList.toggle('background-show')
    quoteDetails.classList.toggle('background-show')
}

// Todo List App

function dateToday(x) {
    let date = new Date();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    todayDate.textContent = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// HTML Tags

const todoList = document.querySelector('.todo-list');
const addInput = document.querySelector('.add-input');
const addBtn = document.querySelector('.add-btn');
const filterOption = document.querySelector('.filter-todo');
const todoOpen = document.querySelector('.todo-open');
const todoApp = document.querySelector('.todo-app')
const main = document.querySelector('main')


document.addEventListener('DOMContentLoaded', getTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);
todoOpen.addEventListener('click', openTodoList)

function openTodoList() {
    todoApp.classList.toggle('todo-close')
    main.classList.toggle('main-left')
}

// Global - LocalStorage variable
let todos; 
if (localStorage.getItem('todos') === null) {
    todos = [];
} else {
    todos = JSON.parse(localStorage.getItem('todos'));
}

function addTodo(event) {
    event.preventDefault();
    // Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    // Todo LI
    const newTodo = document.createElement('li');
    newTodo.innerText = addInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    // Add todo to Local Storage
    saveLocalTodos(addInput.value);
    // Check Mark Button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = `<img src='${require("../images/todo/uncheck1.png")}'>`;
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    // Delete Mark Button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = `<img src='${require("../images/todo/trash1.png")}'>`;
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    addInput.value = '';
}

function deleteCheck(e) {
    const item = e.target;
    const todo = item.parentElement;
    const nodes = Array.prototype.slice.call(todoList.children);

    // Check Mark
    if (item.classList[0] === 'complete-btn') {
        todo.classList.toggle('completed');
    }
    if (item.firstElementChild.src.match('uncheck1')) {
        item.firstElementChild.src = require("../images/todo/checked1.png");
    }
    else if (item.firstElementChild.src.match('checked')) {
        item.firstElementChild.src = require("../images/todo/uncheck1.png");
        todo.style.transition = "all 0.5s ease";
    } else {
        item.firstElementChild.src = require("../images/todo/trash1.png");
        todo.style.transition = "all 0.5s ease";
    }

    if(todo.classList.contains('completed')) {
        todos[nodes.indexOf(todo)].status = 'complete'
    } else {
        todos[nodes.indexOf(todo)].status = 'incomplete'
    }

    localStorage.setItem('todos', JSON.stringify(todos));


    // Delete Todo
    if (item.classList[0] === 'trash-btn') {
        // Animation
        todo.classList.add('fall');
        removeLocalTodos(nodes.indexOf(todo));
        todo.addEventListener('transitionend', function() {
            todo.remove();
        });
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    })
}

function saveLocalTodos(todo) {
    todos.push({item: todo, status: 'incomplete'});
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    todos.forEach(function(todo) {
        // Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    // Todo LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todo.item;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    // Check Mark Button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = `<img src='${require("../images/todo/uncheck1.png")}'>`;
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    // Delete Mark Button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = `<img src='${require("../images/todo/trash1.png")}'>`;
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    if (todo.status === 'complete') {
        newTodo.parentElement.classList.add('completed')
        completedButton.innerHTML = `<img src='${require("../images/todo/checked1.png")}'>`;
    }

    todoList.appendChild(todoDiv);
    });
}


function removeLocalTodos(todo) {
    todos.splice(todo, 1)
    localStorage.setItem('todos', JSON.stringify(todos));
}

function changeDate() {
    let date = new Date();

    const shortenedDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    const shortenedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    if(x.matches) {
        todayDate.textContent = `${shortenedDays[date.getDay()]}, ${date.getDate()} ${shortenedMonths[date.getMonth()]} ${date.getFullYear()}`;
    } else {
        dateToday();
    }
}

const x = window.matchMedia("(max-width: 1350px)");
x.addEventListener('change', changeDate);

new Sortable(todolist, {
    animation: 150,
    onUpdate: function(e) {
        function array_move(arr, old_index, new_index) {
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; 
        };

        array_move(todos, e.oldIndex, e.newIndex)

        localStorage.setItem('todos', JSON.stringify(todos));

    }
});

document.addEventListener('DOMContentLoaded', () => {
    const todoItems = document.querySelectorAll('.todo-item')
    todoItems.forEach(items => {
        items.setAttribute("contenteditable", "true");
    })
}) 