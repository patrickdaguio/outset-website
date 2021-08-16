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
    setIntention()
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

// Links App

const chromeTab = document.querySelector('.chrome-tab')
const linkIcon = document.querySelector('.links-icon')
const nippleWrapper = document.querySelector('.nipple-wrapper')
const linksMenuWrapper = document.querySelector('.links-container')
const addLinksContainer = document.querySelector('.add-links-container')
const linksListContainer = document.querySelector('.links-list-container')
const linksOuterWrapper = document.querySelector('.links-outer-wrapper')
const linksApp = document.querySelector('.links')

chromeTab.addEventListener('click', () => window.open('chrome://newtab'))
linkIcon.addEventListener('click', () => {
    nippleWrapper.classList.toggle('share-open')
    linksMenuWrapper.classList.remove('second-tab')
    linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px'
})
linksMenuWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('link-input') || e.target.classList.contains('link-input-text') || e.target.classList.contains('fa-plus')) {
        linksMenuWrapper.classList.add('second-tab')
        linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px'
    } else if (e.target.classList.contains('fa-arrow-left')) {
        linksMenuWrapper.classList.remove('second-tab')
        linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px'
    }
})

document.addEventListener('click', (e) => {
    if (!linksApp.contains(e.target)) {
        nippleWrapper.classList.remove('share-open')
    }
})

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

function setIntention() {
    let intention;
    if (localStorage.getItem('intention') === null) intention = []
    else intention = JSON.parse(localStorage.getItem('intention'))

    let dateNow = new Date()

    if (intention[1] !== dateNow.toDateString()) {
        intention = [] 
        localStorage.setItem('intention', JSON.stringify(intention))
    } else if (intention.length > 0) {
        intentionQuestionContainer.style.visibility = 'hidden'
        intentionAnswer.textContent = intention[0]
        intentionAnswerContainer.style.visibility = 'visible'
        intentionAnswerContainer.style.opacity = '1'
    } else {
        intentionQuestionContainer.style.visibility = 'visible'
        intentionAnswerContainer.style.visibility = 'hidden'
        intentionAnswerContainer.style.opacity = '0'
    }
}

function changeIntention(e) {
    let intention;
    if (localStorage.getItem('intention') === null) intention = []
    else intention = JSON.parse(localStorage.getItem('intention'))

    let inputDate = new Date()

    if (e.keyCode === 13 && e.target.value !== '') {
        intentionQuestionContainer.style.opacity = '0'
        intention[0] = e.target.value
        intention[1] = inputDate.toDateString()
        localStorage.setItem('intention', JSON.stringify(intention))
        setTimeout(() => {
            intentionQuestionContainer.style.visibility = 'hidden'
            intentionAnswer.textContent = intention[0]
            intentionAnswerContainer.style.visibility = 'visible'
            intentionAnswerContainer.style.opacity = '1'
        }, 600)
    }
}

function intentionAnswerIcons() {
    let intention;
    if (localStorage.getItem('intention') === null) intention = []
    else intention = JSON.parse(localStorage.getItem('intention'))

    intentionIcons.forEach(icon => {
        icon.style.visibility = 'visible'
        icon.addEventListener('click', (e) => {
            intentionAnswerContainer.style.opacity = '0'
            setTimeout(() => {
                intentionAnswerContainer.style.visibility = 'hidden'
                intentionQuestionContainer.style.opacity = '1'
                intentionQuestionContainer.style.visibility = 'visible'
                intention[0] = intentionInput.value
            }, 600)
            if (e.target.classList.contains('fa-times')) {
                intentionInput.value = ''
                intention = []
            }
            localStorage.setItem('intention', JSON.stringify(intention))
        })
    })
}

function removeIntentionIcons() {
    intentionIcons.forEach(icon => icon.style.visibility = 'hidden')
} 

const inactivityTime = function () {
    let time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;

    function logout() {
        greeting.style.opacity = '0'
        document.querySelector('.intention').style.opacity = '0'
        document.body.style.cursor = "none";
    }

    function resetTimer() {
        greeting.style.opacity = '1'
        document.querySelector('.intention').style.opacity = '1'
        document.body.style.cursor = "default";
        clearTimeout(time);
        time = setTimeout(logout, 30000)
    }
};

window.onload = function() {
    inactivityTime();
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
const shareBtn = document.querySelector('.shareBtn')
const shareBox = document.querySelector('.share-box')

// Social Icons

const facebookBtn = document.querySelector('.social-facebook')
const twitterBtn = document.querySelector('.social-twitter')
const linkedBtn = document.querySelector('.social-linked')
const whatsappBtn = document.querySelector('.social-whatsapp')
const quoteBtn = document.querySelector('.social-quote')

changeBackground.addEventListener('click', generateBackground)
changeQuote.addEventListener('click', generateQuote);
backgroundInfo.addEventListener('mouseenter', showBackgroundDetails)
backgroundInfo.addEventListener('mouseleave', showBackgroundDetails)
quotesInfo.addEventListener('mouseenter', showQuoteDetails)
quotesInfo.addEventListener('mouseleave', showQuoteDetails)
shareBtn.addEventListener('click', openQuoteBox)

function reset_animation(element) {
    element.style.animation = 'none';
    element.offsetHeight; /* trigger reflow */
    element.style.animation = null; 
  }
  
function generateQuote() {
    fetch("https://type.fit/api/quotes")
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        let index = Math.floor(Math.random() * data.length);
        reset_animation(inspirationalQuote)
        quote.textContent = `${data[index].text}`;
        shareQuote(`${data[index].text} - ${data[index].author}`)
        if (data[index].author === null) {
            reset_animation(quoteOrigin)
            quoteOrigin.textContent = 'Unknown';
            shareQuote(`${data[index].text} - Unknown`)
        } else {
            reset_animation(quoteOrigin)
            quoteOrigin.textContent = `${data[index].author}`;
        }
    });
}

function openQuoteBox() {
    shareBox.classList.toggle('share-open')
}

function shareQuote(quote) {
    let postUrl = encodeURI(document.location.href)
    let postTitle = encodeURI(quote)

    facebookBtn.setAttribute('href', `http://www.facebook.com/sharer/sharer.php?s=100&p[title]=${postTitle}`)
/*     facebookBtn.addEventListener('click', () => {
        var body = 'Reading JS SDK documentation';
        FB.api('/me/feed', 'post', { message: body }, function(response) {
          if (!response || response.error) {
            alert('Error occured');
          } else {
            alert('Post ID: ' + response.id);
          }
        });
        }) */
    twitterBtn.setAttribute('href', `https://twitter.com/share?&text=${postTitle}`)
    linkedBtn.setAttribute('href', `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`)
    whatsappBtn.setAttribute('href', `https://api.whatsapp.com/send?text=${postTitle}`)
    quoteBtn.addEventListener('click', async function copyPageUrl() {
        try {
          await navigator.clipboard.writeText(quote);
          quoteBtn.querySelector('span').textContent = 'Copied!'
        } catch (err) {
            quoteBtn.querySelector('span').textContent = 'Copy Failed'
        }
      });
}

function generateBackground() {
    fetch(`https://api.unsplash.com/collections/GsNw3bdVLPM/photos/?client_id=${api.keyTwo}&per_page=30`)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(generateUniqueRandom(data))
        let bgIndex =  data[Math.floor(Math.random()*data.length)];
        document.body.style.backgroundImage = `url(${bgIndex.urls.full})`
        return fetch(`https://api.unsplash.com/photos/${bgIndex.id}/?client_id=${api.keyTwo}`)
    }).then(response => {
        return response.json()
    })
    .then(data => {
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
    quoteBtn.querySelector('span').textContent = 'Copy to clipboard'
    quoteDetails.classList.toggle('background-show')
    shareBox.classList.remove('share-open')
}

let uniqueNumbersArray = []

function generateUniqueRandom(maxNr) {

    //Generate random number
    let random = (Math.random() * maxNr.length).toFixed();

    if(!uniqueNumbersArray.includes(random)) {
        uniqueNumbersArray.push(random);
        return random;
    } else {
        if(uniqueNumbersArray.length < maxNr.length) {
          //Recursively generate number
         return generateUniqueRandom(maxNr);
        } else {
            uniqueNumbersArray = []
        }
    }
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