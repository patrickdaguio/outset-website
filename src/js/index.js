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
    checkUserName()
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

// Design
const chromeTab = document.querySelector('.chrome-tab')
const linkIcon = document.querySelector('.links-icon')
const nippleWrapper = document.querySelector('.nipple-wrapper')
const linksMenuWrapper = document.querySelector('.links-container')
const addLinksContainer = document.querySelector('.add-links-container')
const linksListContainer = document.querySelector('.links-list-container')
const linksOuterWrapper = document.querySelector('.links-outer-wrapper')
const linksApp = document.querySelector('.links')

// Functionality

const linkName = document.querySelector('.add-url-name')
const urlsList = document.querySelector('.urls-list')
const userUrlLink = document.querySelector('.add-url-link')
const addTabWrapper = document.querySelector('.add-tab-wrapper')
const createUrlBtn = document.querySelector('.create-url-btn')
const saveUrlBtn = document.querySelector('.update-url-btn')
const linksList = document.querySelector('.links-list')

function linkify(url) {
    let urlRegex = /^(http|https):\/\//gi
    let removedSpace = url.replace(/\s+/g, '')
    if (!urlRegex.test(removedSpace)) {
        return `http://${removedSpace}`
    }
    return removedSpace
}

const linksObject = {
    urls: '',
    editUrlIndex: '',
    resetInputs: function() {
        linkName.value = ''
        userUrlLink.value = ''
        urlsList.textContent = ''
    },
    addExtraTab: function (e) {
        if (addTabWrapper.contains(e.target)) {
            userUrlLink.value = ''
            userUrlLink.style.display = 'block'
            userUrlLink.focus()
            linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px'
        } else if (e.target.classList.contains('url-delete')) {
            e.target.parentElement.remove()
            linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px'
            if (urlsList.children.length === 0) {
                userUrlLink.style.display = 'block'
                linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px'
            }
        }
    },
    addUrlLink: function(e) {
        let extraUrl = 
        `<li class="url">
            <a class="url-link" href="${linkify(userUrlLink.value)}" target="_blank"><span class="url-text">${userUrlLink.value}</span></a>
            <i class="fas fa-times url-delete"></i>
        </li>`
        if ((e.keyCode === 13 && e.target.value !== '') || (addTabWrapper.contains(e.target) && userUrlLink.value !== '')) {
            urlsList.insertAdjacentHTML('beforeend', extraUrl)
            userUrlLink.style.display = 'none'
            userUrlLink.value = ''
            linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px'
        }
    },
    saveUrlLink: function (index) {
        if (linkName.value === '') {
            linkName.classList.add('warning')  
            linkName.focus()
            linkName.addEventListener('animationend', function() {
                linkName.classList.remove('warning')  
            });
        }
        else if (userUrlLink.value === '') {
            userUrlLink.classList.add('warning')  
            userUrlLink.focus()
            userUrlLink.addEventListener('animationend', function() {
                userUrlLink.classList.remove('warning')  
            });
        }
        if ((linkName.value !== '' && userUrlLink.value !== '') || urlsList.children.length > 0) {
            const validLinks = []
            const userLinks = []
            const urls = document.querySelectorAll('.url-link')
            const urlText = document.querySelectorAll('.url-text')
            urls.forEach(url => validLinks.push(url.getAttribute('href')))
            urlText.forEach(text => userLinks.push(text.textContent))
            if (userUrlLink.value !== '') {
                validLinks.push(linkify(userUrlLink.value))
                userLinks.push(userUrlLink.value)
            }
            if (typeof index === 'number') {
                linksObject.urls[index] = { 
                    name: (linkName.value !== '') ? linkName.value : linksObject.urls[index].name,
                    links: validLinks,
                    user: userLinks,
                    img: `https://s2.googleusercontent.com/s2/favicons?domain_url=${validLinks[0]}`
                }
            } else if (typeof index === 'object') {
                linksObject.urls.push({ 
                    name: linkName.value,
                    links: validLinks,
                    user: userLinks,
                    img: `https://s2.googleusercontent.com/s2/favicons?domain_url=${validLinks[0]}`
                })
            }
            localStorage.setItem('urls', JSON.stringify(linksObject.urls))
            linksObject.resetInputs()
            linksObject.loadUrls()
            linksMenuWrapper.classList.remove('second-tab')
            linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px'
            userUrlLink.style.display = 'block'
        }
    },
    loadUrls: function() {
        linksList.innerHTML = ''
        let loadedUrl
        linksObject.urls.forEach((url, i) => {
            loadedUrl = `               
            <li class="link">
                <div class="link-wrapper">
                    <a href="#" class="link-url">
                        <img src="${url.img}" class="link-favicon">
                        <span class="link-text">${url.name}</span>
                    </a>
                </div>
                <div class="link-options">
                    <div class="ellipsis-wrapper">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    <div class="link-dropdown">
                        <ul class="dropdown-list">
                            <li class="edit-link">Edit</li>
                            <li class="delete-link">Delete</li>
                        </ul>
                    </div>
                </div>
            </li>`
            linksList.insertAdjacentHTML('beforeend', loadedUrl)
            const multipleLinks = document.querySelectorAll('.link-url')
            multipleLinks[i].onclick = () => url.links.reverse().forEach(link => window.open(link))
        })
        const ellipsisWrapper = document.querySelectorAll('.ellipsis-wrapper')
        let curr, prev
        curr = prev = 0
        ellipsisWrapper.forEach((ellipsis, i ) => ellipsis.addEventListener('click', (e) => {
            prev = curr
            if (ellipsis.contains(e.target)) {
                curr = i
                ellipsis.nextElementSibling.classList.toggle('visibility')
                if (curr != prev) ellipsisWrapper[prev].nextElementSibling.classList.remove('visibility')
            }
        }))
        const dropdownList = document.querySelectorAll('.dropdown-list')
        const nodes = Array.prototype.slice.call(linksList.children);
        dropdownList.forEach(list => list.addEventListener('click', (e) => {
            let listItem = e.target.parentElement.parentElement.parentElement.parentElement
            if (e.target.className === 'delete-link') {
                linksObject.urls.splice(nodes.indexOf(listItem), 1)
                nodes.splice(nodes.indexOf(listItem), 1)
                listItem.remove()
                localStorage.setItem('urls', JSON.stringify(linksObject.urls))
                linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px'
            } else if (e.target.className === 'edit-link') {
                let linkIndex = linksObject.urls[nodes.indexOf(listItem)]
                linksMenuWrapper.classList.add('second-tab')
                createUrlBtn.style.display = 'none'
                saveUrlBtn.style.display = 'block'
                linkName.value = linkIndex.name
                linkIndex.links.forEach((link, i) => {
                    let savedUrl = 
                    `<li class="url">
                        <a class="url-link" href="${link}" target="_blank"><span class="url-text">${linkIndex.user[i]}</span></a>
                        <i class="fas fa-times url-delete"></i>
                    </li>`
                    urlsList.insertAdjacentHTML('beforeend', savedUrl)
                })
                linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px'
                linksObject.editUrlIndex = nodes.indexOf(listItem)
            }
        })) 
    }
}



if (localStorage.getItem('urls') === null) linksObject.urls = []
else linksObject.urls = JSON.parse(localStorage.getItem('urls'));

chromeTab.addEventListener('click', () => window.open('chrome://newtab'))
linkIcon.addEventListener('click', () => {
    linksObject.resetInputs()
    linksObject.loadUrls()
    nippleWrapper.classList.toggle('share-open')
    linksMenuWrapper.classList.remove('second-tab')
    userUrlLink.style.display = 'block'
    linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px'
})
linksMenuWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('link-input') || e.target.classList.contains('link-input-text') || e.target.classList.contains('fa-plus')) {
        linksMenuWrapper.classList.add('second-tab')
        saveUrlBtn.style.display = 'none'
        createUrlBtn.style.display = 'block'
        linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px'
        linkName.focus({preventScroll:true})
    } else if (e.target.classList.contains('fa-arrow-left')) {
        linksObject.loadUrls()
        linksMenuWrapper.classList.remove('second-tab')
        linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px'
        linksObject.resetInputs()
    }
})

saveUrlBtn.addEventListener('click', function () { linksObject.saveUrlLink(linksObject.editUrlIndex)})
addTabWrapper.addEventListener('click', linksObject.addUrlLink)
createUrlBtn.addEventListener('click', linksObject.saveUrlLink)
addLinksContainer.addEventListener('click', linksObject.addExtraTab)
userUrlLink.addEventListener('keypress', linksObject.addUrlLink)
linkName.addEventListener('keypress', (e) => {
    if (e.keyCode === 13 && e.target.value !== '') {
        userUrlLink.focus()
    }
})
document.addEventListener('click', (e) => {
    if (!linksApp.contains(e.target) && !e.target.classList.contains('url-delete') && !e.target.classList.contains('delete-link')) {        nippleWrapper.classList.remove('share-open')
        linksMenuWrapper.classList.remove('second-tab')
        linksObject.resetInputs()
    }
    const dropdownList = document.querySelectorAll('.link-options')
    dropdownList.forEach(list => {
        if (!list.contains(e.target)) {
            list.children[1].classList.remove('visibility')
        }
    })
})

// Greeting App

// HTML Tags

const time = document.querySelector('.time');
const greeting = document.querySelector('.greeting');
const quote = document.querySelector('.quote');
const quoteOrigin = document.querySelector('.quote-origin');
const todayDate = document.querySelector('.today-date');

function greetings() {
    let userName 
    if (localStorage.getItem('username') === null) userName = ''
    else userName = JSON.parse(localStorage.getItem('username'))

    let date = new Date();

    // Time
    let hours = addZero(date.getHours());
    let minutes = addZero(date.getMinutes());
    let currentTime = `${hours}:${minutes}`;

    time.textContent = currentTime;
    setTimeout(greetings, 1000);
    
    if (hours >= 12 && hours < 18) {
        greeting.textContent = `Good afternoon, ${userName[0]}`;
    } else if (hours >= 18 && hours !== 4) {
        greeting.textContent = `Good evening, ${userName[0]}`;
    } else if (hours >= 4 && hours < 12) {
        greeting.textContent = `Good morning, ${userName[0]}`;
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

// Personal Name Functionality

const introduction = document.querySelector('.introduction')
const introductionContainer = document.querySelector('.intro-question-container')
const introQuestionContainer = document.querySelector('.intro-question')
const userInputName = document.querySelector('.intro-name-input')
const introCta = document.querySelector('.intro-cta')
const introConfirmationContainer = document.querySelector('.intro-confirmation')
const changeName = document.querySelector('.change-name')
const saveName = document.querySelector('.confirm-name')
const container = document.querySelector('.container')
const introName = document.querySelector('.intro-name-title')
const featuresSection = document.querySelector('.features')
const introductionOverlay = document.querySelector('.introduction-overlay')
const featuresUsername = document.querySelector('.features-user-name')

function setUserName(e) {

    if (e.keyCode === 13 && e.target.value !== '') {
        introQuestionContainer.style.opacity = '0'
        setTimeout(() => {
            introQuestionContainer.style.visibility = 'hidden'
            introName.textContent = e.target.value
            introCta.style.visibility = 'visible'
            introCta.style.opacity = '1'
            introConfirmationContainer.style.visibility = 'visible'
            introConfirmationContainer.style.opacity = '1'
        }, 1000)
    }
}

function changeUserName() {
    introCta.style.opacity = '0'
    introConfirmationContainer.style.opacity = '0'
    setTimeout(() => {
        introConfirmationContainer.style.visibility = 'hidden'
        introCta.style.visibility = 'hidden'
        introQuestionContainer.style.opacity = '1'
        introQuestionContainer.style.visibility = 'visible'
        userInputName.textContent = introName.textContent
        userInputName.focus()
    }, 1000)
}

function saveUserName() {
    let userName 
    if (localStorage.getItem('username') === null) userName = []
    else userName = JSON.parse(localStorage.getItem('username'))

    userName[0] = introName.textContent
    localStorage.setItem('username', JSON.stringify(userName))
    introductionContainer.style.opacity = '0'
    introductionOverlay.style.display = 'block'
    featuresUsername.textContent = userName[0] 
    setTimeout(() => {
        introductionContainer.style.display = 'none'
        featuresSection.style.display = 'flex'
    }, 1000) 
}

function checkUserName() {
    let userName 
    if (localStorage.getItem('username') === null) userName = []
    else userName = JSON.parse(localStorage.getItem('username'))

    if (localStorage.getItem('username') === null) {
        container.classList.remove('visibility')
        introduction.style.visibility = 'visible'
        introduction.style.opacity = '1'
    } else if (userName.length === 1) {
        featuresUsername.textContent = userName[0] 
        introductionContainer.style.display = 'none'
        introductionOverlay.style.display = 'block'
        featuresSection.style.display = 'flex'
    }
    else {
        introductionOverlay.style.display = 'none'
        introduction.style.visibility = 'hidden'
        introduction.style.opacity = '0'
        container.classList.add('visibility')
    }
}


userInputName.addEventListener('keypress', setUserName)
changeName.addEventListener('click', changeUserName)
saveName.addEventListener('click', saveUserName)

// Features

const featuresIcons = document.querySelectorAll('.features-icon')
const featuresDesc = document.querySelector('.features-desc')
const featuresBtn = document.querySelector('.features-btn')
const featuresWelcome = document.querySelector('.features-welcome')
const featuresDots = document.querySelectorAll('.dot')
const featuresContent = document.querySelector('.features-content')
const featuresHeading = document.querySelector('.features-heading')
const featuresSvg = document.querySelectorAll('.features-svg')
const iconDesc = document.querySelectorAll('.icon-desc')
const featuresFooter = document.querySelector('.features-footer')
const featuresContainer = document.querySelector('.features-container')

let featuresIndex = 1
let oldFeaturesIndex = 0

featuresIcons.forEach((icon, i) => icon.addEventListener('mouseover', () => {
    if (i === 0) {
        switch (featuresIndex) {
            case 2:
                featuresDesc.textContent = 'Inspiring Photography'
                break;
            case 3:
                featuresDesc.textContent = 'Set a daily intention reminder'
                break;
            case 4:
                featuresDesc.textContent = 'Set key dates'
                break;
        }
    } else if (i === 1) {
        switch (featuresIndex) {
            case 2:
                featuresDesc.textContent = 'Timeless Wisdom'
                break;
            case 3:
                featuresDesc.textContent = 'Organise your daily tasks'
                break;
            case 4:
                featuresDesc.textContent = 'Set a time to focus'
                break;
        }
    } else {
        switch (featuresIndex) {
            case 2:
                featuresDesc.textContent = 'Positive Concepts'
                break;
            case 3:
                featuresDesc.textContent = 'Quickly access your most used websites'
                break;
            case 4:
                featuresDesc.textContent = 'Check weather worldwide'
                break;
        }
    }
}));

featuresIcons.forEach(icon => icon.addEventListener('mouseleave', () => {
    switch (featuresIndex) {
        case 2:
            featuresDesc.textContent = 'Breathe life into your browser'
            break;
        case 3:
            featuresDesc.textContent = 'Approach each day with intent'
            break;
        case 4:
            featuresDesc.textContent = 'Enjoy the extra features of Outset'
            break;
    }
}));

function displayFeatures(heading, desc, src1, src2, src3, text1, text2, text3) {
    featuresFooter.style.animation = 'opacity 1s forwards'
    featuresHeading.textContent = heading
    featuresDesc.textContent = desc
    featuresSvg[0].src= src1
    featuresSvg[1].src= src2
    featuresSvg[2].src= src3
    iconDesc[0].textContent = text1
    iconDesc[1].textContent = text2
    iconDesc[2].textContent = text3
    featuresContent.style.animation = 'zoomIn 0.7s ease-in forwards'
}

function fadeElements(el1, el2) {
    featuresDots[oldFeaturesIndex].style.pointerEvents = 'all'
    featuresDots[featuresIndex].style.pointerEvents = 'none'

    el1.style.animation = 'fadeOut 1s forwards'
    el2.style.animation = 'none'

    featuresDots[oldFeaturesIndex].classList.remove('active')
    featuresDots[featuresIndex].classList.add('active')
}

function elementsDisplay(el1, el2) {
    el1.style.display = 'none'
    el2.style.display = 'block'
}

function showNextFeature(e) {

    if (featuresIndex === 1) {
        fadeElements(featuresWelcome, featuresFooter)
        featuresWelcome.addEventListener('animationend', function changeContent() {
            featuresFooter.style.animation = 'opacity 1s forwards'
            elementsDisplay(featuresWelcome, featuresContent)
            featuresContent.style.animation = 'zoomIn 0.7s ease-in forwards'
            featuresWelcome.removeEventListener('animationend', changeContent)
        })
        oldFeaturesIndex = featuresIndex
        featuresIndex++
    } else if (featuresIndex === 2) {
        fadeElements(featuresContent, featuresFooter)
        featuresContent.addEventListener('animationend', function changeContent() {
            displayFeatures('Focus', 'Approach each day with intent', `${require("../images/svgs/focus.svg")}`, `${require("../images/svgs/todo.svg")}`, `${require("../images/svgs/links.svg")}`, 'Focus','To-do','Links')
            featuresContent.removeEventListener('animationend', changeContent)
        })
        oldFeaturesIndex = featuresIndex
        featuresIndex++
    } else if (featuresIndex === 3) {
        fadeElements(featuresContent, featuresFooter)
        featuresContent.addEventListener('animationend', function changeContent() {
            displayFeatures('Extra Features', 'Enjoy the extra features of Outset', `${require("../images/svgs/calendar.svg")}`, `${require("../images/svgs/clock.svg")}`, `${require("../images/svgs/weather.svg")}`, 'Calendar', 'Timer', 'Weather')
            featuresContent.removeEventListener('animationend', changeContent)
        })
        oldFeaturesIndex = featuresIndex
        featuresIndex++
    } else if (featuresIndex === 4) {
        let userName = JSON.parse(localStorage.getItem('username'))
        userName.push('started')
        localStorage.setItem('username', JSON.stringify(userName))        
        featuresContainer.style.animation = 'fadeOut 1s forwards'
        introduction.style.opacity = '0'
        setTimeout(() => {
            featuresSection.style.display = 'none'
            introduction.style.display = 'none'
            container.classList.add('visibility')
        }, 1000)

    }

    if (featuresIndex === 4) featuresBtn.textContent = 'Get Started'
    else featuresBtn.textContent = 'Next'
}

featuresBtn.addEventListener('click', showNextFeature)
featuresDots.forEach((dot, i) => dot.addEventListener('click', () => {
    if (i !== 3) featuresBtn.textContent = 'Next'
    else featuresBtn.textContent = 'Get Started'

    switch (i) {
        case 0:
            featuresIndex = 0
            fadeElements(featuresContent, featuresFooter)
            featuresContent.addEventListener('animationend', function changeContent() {
                elementsDisplay(featuresContent, featuresWelcome)
                reset_animation(featuresWelcome)
                displayFeatures('Inspiration', 'Breathe life into your browser', `${require("../images/svgs/picture.svg")}`, `${require("../images/svgs/quote.svg")}`, `${require("../images/svgs/mantra.svg")}`, 'Photos', 'Quotes', 'Mantras')
                featuresContent.removeEventListener('animationend', changeContent)
                })
            oldFeaturesIndex = featuresIndex
            featuresIndex++
            break;
        case 1:
            featuresIndex = 1
            if (featuresWelcome.style.display != 'none') {
                fadeElements(featuresWelcome, featuresFooter)
                featuresWelcome.addEventListener('animationend', function changeContent() {
                    displayFeatures('Inspiration', 'Breathe life into your browser', `${require("../images/svgs/picture.svg")}`, `${require("../images/svgs/quote.svg")}`, `${require("../images/svgs/mantra.svg")}`, 'Photos', 'Quotes', 'Mantras')
                    elementsDisplay(featuresWelcome, featuresContent)
                    featuresWelcome.removeEventListener('animationend', changeContent)
                })
            } else {
                fadeElements(featuresContent, featuresFooter)
                featuresContent.addEventListener('animationend', function changeContent() {
                    displayFeatures('Inspiration', 'Breathe life into your browser', `${require("../images/svgs/picture.svg")}`, `${require("../images/svgs/quote.svg")}`, `${require("../images/svgs/mantra.svg")}`, 'Photos', 'Quotes', 'Mantras')
                    featuresContent.removeEventListener('animationend', changeContent)
                })
            }
            oldFeaturesIndex = featuresIndex
            featuresIndex++
            break;
        case 2:
            featuresIndex = 2
            if (featuresWelcome.style.display != 'none') {
                fadeElements(featuresWelcome, featuresFooter)
                featuresWelcome.addEventListener('animationend', function changeContent() {
                    elementsDisplay(featuresWelcome, featuresContent)
                    displayFeatures('Focus', 'Approach each day with intent', `${require("../images/svgs/focus.svg")}`, `${require("../images/svgs/todo.svg")}`, `${require("../images/svgs/links.svg")}`, 'Focus','To-do','Links')
                    featuresWelcome.removeEventListener('animationend', changeContent)
                })
            } else {
                fadeElements(featuresContent, featuresFooter)
                featuresContent.addEventListener('animationend', function changeContent() {
                    displayFeatures('Focus', 'Approach each day with intent', `${require("../images/svgs/focus.svg")}`, `${require("../images/svgs/todo.svg")}`, `${require("../images/svgs/links.svg")}`, 'Focus','To-do','Links')
                    featuresContent.removeEventListener('animationend', changeContent)
                })
            }
            oldFeaturesIndex = featuresIndex
            featuresIndex++
            break;
        case 3:
            featuresIndex = 3
            if (featuresWelcome.style.display != 'none') {
                fadeElements(featuresWelcome, featuresFooter)
                featuresWelcome.addEventListener('animationend', function changeContent() {
                    elementsDisplay(featuresWelcome, featuresContent)
                    displayFeatures('Extra Features', 'Enjoy the extra features of Outset', `${require("../images/svgs/calendar.svg")}`, `${require("../images/svgs/clock.svg")}`, `${require("../images/svgs/weather.svg")}`, 'Calendar', 'Timer', 'Weather')
                    featuresWelcome.removeEventListener('animationend', changeContent)
                })
            } else {
                fadeElements(featuresContent, featuresFooter)
                featuresContent.addEventListener('animationend', function changeContent() {
                    displayFeatures('Extra Features', 'Enjoy the extra features of Outset', `${require("../images/svgs/calendar.svg")}`, `${require("../images/svgs/clock.svg")}`, `${require("../images/svgs/weather.svg")}`, 'Calendar', 'Timer', 'Weather')
                    featuresContent.removeEventListener('animationend', changeContent)
                })
            }
            oldFeaturesIndex = featuresIndex
            featuresIndex++
            break;
    }
}))