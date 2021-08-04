// Weather App

// API 
const api = {
    key: "4e64f52c084e3654951dbc0177bdf7ae",
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

            fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
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
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
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
        temperatureIcon.src="images/weather/storming.png";
    } else if (weather.weather[0].main === "Clear") {
        temperatureIcon.src="images/weather/sunny.png";
    } else if (weather.weather[0].main === "Snow") {
        temperatureIcon.src="images/weather/snowing.png";
    } else if (weather.weather[0].main === "Rain") {
        temperatureIcon.src="images/weather/raining.png";
    } else if (weather.weather[0].description === "few clouds" || weather.weather[0].description === "scattered clouds") {
        temperatureIcon.src="images/weather/cloudy sun.png";
    } else if (weather.weather[0].main === "Drizzle") {
        temperatureIcon.src="images/weather/cloudy rain.png";
    } else if (weather.weather[0].description === "broken clouds" || weather.weather[0].description === "overcast clouds") {
        temperatureIcon.src="images/weather/cloudy.png";
    } else if (weather.wind.speed > 30) {
        temperatureIcon.src="images/weather/windy.png";
    }
    searchBox.value = '';
}


// Greeting App

// HTML Tags

const time = document.querySelector('.time');
const greeting = document.querySelector('.greeting');
const quote = document.querySelector('.quote');
const quoteOrigin = document.querySelector('.quote-origin');
const quoteBtn = document.querySelector('.inspired-btn');
const timeApp = document.querySelector('.time-app');
const todayDate = document.querySelector('.today-date');

function greetings() {
    let date = new Date();

    // Time
    let hours = addZero(date.getHours());
    let minutes = addZero(date.getMinutes());
    let currentTime = `${hours}:${minutes}`;

    time.textContent = currentTime;

    setTimeout("greetings()", 0);

    if (hours >= 14 && hours < 18) {
        greeting.textContent = 'Good afternoon, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/afternoon.jpg')";
    } else if (hours >= 18 && hours < 20) {
        greeting.textContent = 'Sunset time, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/sunset.jpg')";
        document.body.style.backgroundPosition = "center";
    } else if (hours >= 20 && hours < 21) {
        greeting.textContent = 'Dinner time, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/dinner.jpg')";
    } else if (hours >= 21 && hours !== 0) {
        greeting.textContent = 'Good evening, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/night.jpg')";
    } else if (hours >= 0 && hours < 5) {
        greeting.textContent = 'Go to bed, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/bed.jpg')";
        document.body.style.backgroundPosition = "center";
    } else if (hours >= 5 && hours < 7) {
        greeting.textContent = 'Sunrise time, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/sunrise.jpg')";
    } else if (hours >= 7 && hours < 10) {
        greeting.textContent = 'Good morning, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/morning.jpg')";
        document.body.style.backgroundPosition = "center";
        timeApp.style.color = "rgba(15,14,14, 0.8)";
    } else if (hours >= 10 && hours < 12) {
        greeting.textContent = 'Time to be productive, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/study.jpg')";
        document.body.style.backgroundPosition = "center";
    } else if (hours >= 12 && hours < 14) {
        greeting.textContent = 'Lunch Time, Patrick';
        document.body.style.backgroundImage = "url('images/backgrounds/lunch1.jpg')";
        document.body.style.backgroundPosition = "center";
    }
}

function addZero(num) {
    return num < 10 ? `0${num}` : num;
}

quoteBtn.addEventListener('click', generateQuote);

function generateQuote() {
    fetch("https://type.fit/api/quotes")
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        let index = Math.floor(Math.random() * data.length);
        quote.textContent = `${data[index].text}`;
        if (data[index].author === null) {
            quoteOrigin.textContent = '- Unknown';
        } else {
            quoteOrigin.textContent = `- ${data[index].author}`;
        }
    });
}

// Todo List App

function dateToday(x) {
    let date = new Date();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    todayDate.textContent = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// HTML Tags

const todoContainer = document.querySelector('.todo-container');
const todoList = document.querySelector('.todo-list');
const addInput = document.querySelector('.add-input');
const addBtn = document.querySelector('.add-btn');
const filterOption = document.querySelector('.filter-todo');


document.addEventListener('DOMContentLoaded', getTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

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
    completedButton.innerHTML = '<img src="images/todo/uncheck1.png">';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    // Delete Mark Button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<img src="images/todo/trash1.png">';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    addInput.value = '';
    
}

function deleteCheck(e) {
    const item = e.target;
    const todo = item.parentElement;
    // Delete Todo
    if (item.classList[0] === 'trash-btn') {
        // Animation
        todo.classList.add('fall');
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function() {
            todo.remove();
        });
    }

    
    let todos; 
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    let liIndex = Array.prototype.indexOf.call(todoList.childNodes, todo)

    // Check Mark
    if (item.classList[0] === 'complete-btn') {
        todo.classList.toggle('completed');
    }
    if (item.firstElementChild.src.match('uncheck1')) {
        item.firstElementChild.src = 'images/todo/checked1.png';
    }
    else if (item.firstElementChild.src.match('checked')) {
        item.firstElementChild.src = 'images/todo/uncheck1.png';
        todo.style.transition = "all 0.5s ease";
    } else {
        item.firstElementChild.src = 'images/todo/trash1.png';
        todo.style.transition = "all 0.5s ease";
    }

    if(todo.classList.contains('completed')) {
        todos[liIndex].status = 'complete'
    } else {
        todos[liIndex].status = 'incomplete'
    }
    localStorage.setItem('todos', JSON.stringify(todos));

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
    // Check content
    let todos; 
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push({item: todo, status: 'incomplete'});
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos; 
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
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
    completedButton.innerHTML = '<img src="images/todo/uncheck1.png">';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    // Delete Mark Button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<img src="images/todo/trash1.png">';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    if (todo.status === 'complete') {
        newTodo.parentElement.classList.add('completed')
        completedButton.innerHTML = '<img src="images/todo/checked1.png">';
    }

    todoList.appendChild(todoDiv);
    });
}


function removeLocalTodos(todo) {
    let todos; 
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].textContent;
    todos.splice(todos.indexOf(todoIndex), 1);
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
    animation: 150
});
