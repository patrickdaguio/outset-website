import config from './config';
import sound from '../images/pomodoro.mp3';

/* Weather Component */

// API Keys
const api = {
	keyOne: config.MY_KEY_1, // OpenWeatherAPI
	keyTwo: config.MY_KEY_2, // UnsplashAPI
	base: 'https://api.openweathermap.org/data/2.5/'
};

// Weather Component Tags
const searchBox = document.querySelector('.search-box');
const temperatureIcon = document.querySelector('.temperature-icon');
const temperatureDegree = document.querySelector('.temperature-degree');
const geolocation = document.querySelector('.location');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');

searchBox.addEventListener('keypress', setQuery);

/* When app loads:
- Fetch user's current location and display weather data on location
- Checks localStorage if user is new/old. Show introduction page if user is new and dont if user is old 
- Display current time and greet user personally depending on time of day 
- Display a randomly generated quote from QuotesAPI
- Loads randomly generated background from UnplashAPI (resets automatically once a day)
- Loads user's intention for the day from localStorage (if already set)
- Loads user's mantra for the day from localStorage (if already set)
- Loads user's archived quotes list from localStorage
*/
window.addEventListener('load', () => {
	let lon;
	let lat;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			lon = position.coords.longitude;
			lat = position.coords.latitude;

			fetch(
				`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.keyOne}`
			)
				.then(weather => {
					return weather.json();
				})
				.then(displayResults);
		});
	}
	checkUserName();
	greetings();
	generateQuote();
	loadBackground();
	setIntention();
	setMantra();
	getQuote();
});

// On 'enter' send user's query to OpenWeather API
function setQuery(e) {
	if (e.keyCode === 13) {
		getResults(searchBox.value);
	}
}

function getResults(query) {
	fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.keyOne}`)
		.then(weather => {
			return weather.json();
		})
		.then(displayResults);
}

// Displays specific weather results depending on the fetched weather information
function displayResults(weather) {
	temperatureDegree.textContent = Math.round(weather.main.temp);
	geolocation.textContent = `${weather.name}, ${weather.sys.country}`;
	humidity.textContent = `${weather.main.humidity}%`;
	wind.textContent = `${weather.wind.speed.toFixed(1)}mph`;
	if (weather.weather[0].main === 'Thunderstorm') {
		temperatureIcon.src = `${require('../images/weather/storming.png')}`;
		temperatureIcon.title = 'Thunderstorm';
	} else if (weather.weather[0].main === 'Clear') {
		temperatureIcon.src = `${require('../images/weather/sunny.png')}`;
		temperatureIcon.title = 'Clear';
	} else if (weather.weather[0].main === 'Snow') {
		temperatureIcon.src = `${require('../images/weather/snowing.png')}`;
		temperatureIcon.title = 'Snow';
	} else if (weather.weather[0].main === 'Rain') {
		temperatureIcon.src = `${require('../images/weather/raining.png')}`;
		temperatureIcon.title = 'Rain';
	} else if (
		weather.weather[0].description === 'few clouds' ||
		weather.weather[0].description === 'scattered clouds'
	) {
		temperatureIcon.src = `${require('../images/weather/cloudy sun.png')}`;
		temperatureIcon.title = 'Scattered clouds';
	} else if (weather.weather[0].main === 'Drizzle') {
		temperatureIcon.src = `${require('../images/weather/cloudy rain.png')}`;
		temperatureIcon.title = 'Drizzle';
	} else if (
		weather.weather[0].description === 'broken clouds' ||
		weather.weather[0].description === 'overcast clouds'
	) {
		temperatureIcon.src = `${require('../images/weather/cloudy.png')}`;
		temperatureIcon.title = 'Cloudy';
	} else if (weather.wind.speed > 30) {
		temperatureIcon.src = `${require('../images/weather/windy.png')}`;
		temperatureIcon.title = 'Windy';
	}
	searchBox.value = '';
}

/* Bookmark Links Component */

// Bookmark Links Component Tags (Design)
const chromeTab = document.querySelector('.chrome-tab');
const linkIcon = document.querySelector('.links-icon');
const nippleWrapper = document.querySelector('.nipple-wrapper');
const linksMenuWrapper = document.querySelector('.links-container');
const addLinksContainer = document.querySelector('.add-links-container');
const linksListContainer = document.querySelector('.links-list-container');
const linksOuterWrapper = document.querySelector('.links-outer-wrapper');
const linksApp = document.querySelector('.links');

// Bookmark Links Component Tags (Functionality)
const linkName = document.querySelector('.add-url-name');
const urlsList = document.querySelector('.urls-list');
const userUrlLink = document.querySelector('.add-url-link');
const addTabWrapper = document.querySelector('.add-tab-wrapper');
const createUrlBtn = document.querySelector('.create-url-btn');
const saveUrlBtn = document.querySelector('.update-url-btn');
const linksList = document.querySelector('.links-list');

/* Transforms user's url input to start with http or https
- Prevents errors
- Fetches correct Google icon  
*/
function linkify(url) {
	let urlRegex = /^(http|https):\/\//gi;
	let removedSpace = url.replace(/\s+/g, '');
	if (!urlRegex.test(removedSpace)) {
		return `http://${removedSpace}`;
	}
	return removedSpace;
}

// Object container for Bookmark Links Component
const linksObject = {
	urls: '',
	editUrlIndex: '',
	// Resets input fields
	resetInputs: function () {
		linkName.value = '';
		userUrlLink.value = '';
		urlsList.textContent = '';
	},
	// Creates extra input field for url links and change component's height accordingly
	addExtraTab: function (e) {
		if (addTabWrapper.contains(e.target)) {
			userUrlLink.value = '';
			userUrlLink.style.display = 'block';
			userUrlLink.focus();
			linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px';
			// Deletes extra url tab added and change component's height accordingly
		} else if (e.target.classList.contains('url-delete')) {
			e.target.parentElement.remove();
			linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px';
			if (urlsList.children.length === 0) {
				userUrlLink.style.display = 'block';
				linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px';
			}
		}
	},
	// Creates HTML for inputted link
	addUrlLink: function (e) {
		let extraUrl = `<li class="url">
            <a class="url-link" href="${linkify(
							userUrlLink.value
						)}" target="_blank"><span class="url-text">${
			userUrlLink.value
		}</span></a>
            <i class="fas fa-times url-delete"></i>
        </li>`;
		// Checks if input fields are not empty. Create and add new tab and change components height.
		if (
			(e.keyCode === 13 && e.target.value !== '') ||
			(addTabWrapper.contains(e.target) && userUrlLink.value !== '')
		) {
			urlsList.insertAdjacentHTML('beforeend', extraUrl);
			userUrlLink.style.display = 'none';
			userUrlLink.value = '';
			linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px';
		}
	},

	// Saves user URL inputs to localStorage
	saveUrlLink: function (index) {
		// Warns user if any input is empty before submitting links to bookmark
		if (linkName.value === '') {
			linkName.classList.add('warning');
			// Sets focus to fields that are empty
			linkName.focus();
			linkName.addEventListener('animationend', function () {
				linkName.classList.remove('warning');
			});
		} else if (userUrlLink.value === '') {
			userUrlLink.classList.add('warning');
			userUrlLink.focus();
			userUrlLink.addEventListener('animationend', function () {
				userUrlLink.classList.remove('warning');
			});
		}
		if (
			(linkName.value !== '' && userUrlLink.value !== '') ||
			urlsList.children.length > 0
		) {
			const validLinks = [];
			const userLinks = [];
			const urls = document.querySelectorAll('.url-link');
			const urlText = document.querySelectorAll('.url-text');
			urls.forEach(url => validLinks.push(url.getAttribute('href')));
			urlText.forEach(text => userLinks.push(text.textContent));
			if (userUrlLink.value !== '') {
				// Validates user links and saves all links/tabs to array
				validLinks.push(linkify(userUrlLink.value));
				// Keeps users text input
				userLinks.push(userUrlLink.value);
			}
			// Checks if user is creating new bookmark or editing one
			if (typeof index === 'number') {
				linksObject.urls[index] = {
					name:
						linkName.value !== ''
							? linkName.value
							: linksObject.urls[index].name,
					links: validLinks,
					user: userLinks,
					img: `https://s2.googleusercontent.com/s2/favicons?domain_url=${validLinks[0]}`
				};
			} else if (typeof index === 'object') {
				linksObject.urls.push({
					name: linkName.value,
					links: validLinks,
					user: userLinks,
					img: `https://s2.googleusercontent.com/s2/favicons?domain_url=${validLinks[0]}`
				});
			}
			// Saves bookmarked links
			localStorage.setItem('urls', JSON.stringify(linksObject.urls));
			// Resets input fields
			linksObject.resetInputs();
			// Revert back to main component and load saved bookmarked links
			linksObject.loadUrls();
			linksMenuWrapper.classList.remove('second-tab');
			linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px';
			userUrlLink.style.display = 'block';
		}
	},
	// Loads user URL inputs to localStorage
	loadUrls: function () {
		linksList.innerHTML = '';
		let loadedUrl;
		// Maps through localStorage url array and create HTML for each bookmark
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
            </li>`;
			// Input each bookmark to main component
			linksList.insertAdjacentHTML('beforeend', loadedUrl);
			const multipleLinks = document.querySelectorAll('.link-url');
			// Opens all links to separate tabs (user has to allow pop-up)
			multipleLinks[i].onclick = () =>
				url.links.reverse().forEach(link => window.open(link));
		});
		// Display edit options to selected bookmark link
		const ellipsisWrapper = document.querySelectorAll('.ellipsis-wrapper');
		let curr, prev;
		curr = prev = 0;
		ellipsisWrapper.forEach((ellipsis, i) =>
			ellipsis.addEventListener('click', e => {
				prev = curr;
				if (ellipsis.contains(e.target)) {
					curr = i;
					ellipsis.nextElementSibling.classList.toggle('visibility');
					if (curr != prev)
						ellipsisWrapper[prev].nextElementSibling.classList.remove(
							'visibility'
						);
				}
			})
		);
		const dropdownList = document.querySelectorAll('.dropdown-list');
		// Copies url links array
		const nodes = Array.prototype.slice.call(linksList.children);
		// Checks which edit option clicked on selected bookmark
		dropdownList.forEach(list =>
			list.addEventListener('click', e => {
				let listItem =
					e.target.parentElement.parentElement.parentElement.parentElement;
				if (e.target.className === 'delete-link') {
					// Deletes bookmark link/s
					linksObject.urls.splice(nodes.indexOf(listItem), 1);
					nodes.splice(nodes.indexOf(listItem), 1);
					// Removes from UI
					listItem.remove();
					// Saves new array to localStorage
					localStorage.setItem('urls', JSON.stringify(linksObject.urls));
					linksOuterWrapper.style.height =
						linksListContainer.offsetHeight + 'px';
				} else if (e.target.className === 'edit-link') {
					let linkIndex = linksObject.urls[nodes.indexOf(listItem)];
					// Open edit tab for selected bookmark
					linksMenuWrapper.classList.add('second-tab');
					createUrlBtn.style.display = 'none';
					saveUrlBtn.style.display = 'block';
					linkName.value = linkIndex.name;
					// List down title and link/s user inputted for selected bookmark
					linkIndex.links.forEach((link, i) => {
						let savedUrl = `<li class="url">
                        <a class="url-link" href="${link}" target="_blank"><span class="url-text">${linkIndex.user[i]}</span></a>
                        <i class="fas fa-times url-delete"></i>
                    </li>`;
						urlsList.insertAdjacentHTML('beforeend', savedUrl);
					});
					linksOuterWrapper.style.height =
						addLinksContainer.offsetHeight + 'px';
					// Tracks which bookmark user selected so any changes can be saved to specific bookmark
					linksObject.editUrlIndex = nodes.indexOf(listItem);
				}
			})
		);
	}
};

// Fetches saved bookmarked links from localStorage
if (localStorage.getItem('urls') === null) linksObject.urls = [];
else linksObject.urls = JSON.parse(localStorage.getItem('urls'));

// Open new Google chrome tab and redirects to Google main page
chromeTab.addEventListener('click', () =>
	window.open('https://www.google.co.uk/', '_blank')
);

// Open Bookmark link component. Loads saved bookmark and reset to plain
linkIcon.addEventListener('click', () => {
	linksObject.resetInputs();
	linksObject.loadUrls();
	nippleWrapper.classList.toggle('share-open');
	linksMenuWrapper.classList.remove('second-tab');
	userUrlLink.style.display = 'block';
	linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px';
});
// Checks if user wants to add a new bookmark or user wants to go back to main section from edit page
linksMenuWrapper.addEventListener('click', e => {
	if (
		e.target.classList.contains('link-input') ||
		e.target.classList.contains('link-input-text') ||
		e.target.classList.contains('fa-plus')
	) {
		linksMenuWrapper.classList.add('second-tab');
		saveUrlBtn.style.display = 'none';
		createUrlBtn.style.display = 'block';
		linksOuterWrapper.style.height = addLinksContainer.offsetHeight + 'px';
		linkName.focus({ preventScroll: true });
	} else if (e.target.classList.contains('fa-arrow-left')) {
		linksObject.loadUrls();
		linksMenuWrapper.classList.remove('second-tab');
		linksOuterWrapper.style.height = linksListContainer.offsetHeight + 'px';
		linksObject.resetInputs();
	}
});

// Event listeners for Bookmark Link Component
saveUrlBtn.addEventListener('click', function () {
	linksObject.saveUrlLink(linksObject.editUrlIndex);
});
addTabWrapper.addEventListener('click', linksObject.addUrlLink);
createUrlBtn.addEventListener('click', linksObject.saveUrlLink);
addLinksContainer.addEventListener('click', linksObject.addExtraTab);
userUrlLink.addEventListener('keypress', linksObject.addUrlLink);
// Changes user focus to next required input field
linkName.addEventListener('keypress', e => {
	if (e.keyCode === 13 && e.target.value !== '') {
		userUrlLink.focus();
	}
});

// Event listener for whole website
// Closes component if user clicks outside of it and resets actions
document.addEventListener('click', e => {
	if (
		!linksApp.contains(e.target) &&
		!e.target.classList.contains('url-delete') &&
		!e.target.classList.contains('delete-link')
	) {
		nippleWrapper.classList.remove('share-open');
		linksMenuWrapper.classList.remove('second-tab');
		linksObject.resetInputs();
	}
	const dropdownList = document.querySelectorAll('.link-options');
	dropdownList.forEach(list => {
		if (!list.contains(e.target)) {
			list.children[1].classList.remove('visibility');
		}
	});
	if (!greetingsEllipsis.contains(e.target)) {
		greetingsOption.classList.remove('share-open');
		greetingsEllipsisIcon.style.opacity = '0';
	}
	if (
		!inputContainer.contains(e.target) &&
		!e.target.classList.contains('editName')
	) {
		greetingName.style.display = 'inline';
		if (inputContainer.children.length >= 1) {
			let userName = JSON.parse(localStorage.getItem('username'));
			userName[0] = inputContainer.children[0].value;
			greetingName.textContent = inputContainer.children[0].value;
			greetingName.classList.add('important');
			greetingName.addEventListener('animationend', function () {
				greetingName.classList.remove('important');
			});
			localStorage.setItem('username', JSON.stringify(userName));
		}
		inputContainer.innerHTML = '';
	}

	if (!pomodoroAppContainer.contains(e.target)) {
		pomodoroHistoryContainer.classList.remove('openHistoryContainer');
	}

	if (!tobeProjectsContainer.contains(e.target)) {
		tobeProjectsNippleWrapper.classList.remove('display');
		tobeListWrapper.style.minHeight = '0px';
		if (tobeProjectsOptions.contains(e.target)) {
			tobeProjectOptionsWrapper.classList.toggle('display');
			if (tobeProjectOptionsWrapper.classList.contains('display'))
				tobeListWrapper.style.minHeight =
					tobeProjectOptionsWrapper.offsetHeight + 'px';
			else tobeListWrapper.style.minHeight = '0px';
		}
	}

	if (!tobeProjectsOptions.contains(e.target)) {
		tobeProjectOptionsWrapper.classList.remove('display');
		tobeListWrapper.style.minHeight = '0px';
		if (tobeProjectsContainer.contains(e.target)) {
			tobeProjectsNippleWrapper.classList.toggle('display');
			if (tobeProjectsNippleWrapper.classList.contains('display'))
				tobeListWrapper.style.minHeight = tobeProjectsList.offsetHeight + 'px';
			else tobeListWrapper.style.minHeight = '0px';
		}
	}

	if (
		!currentTobeProject.contains(e.target) &&
		!tobeProjectOptionsWrapper.contains(e.target) &&
		!tobeApp.newProject
	) {
		currentTobeProject.contentEditable = 'false';
		if (
			currentTobeProject.textContent === '' ||
			tobeApp.lastTobeProject === 'z' + currentTobeProject.textContent ||
			tobeApp.tobeObject.hasOwnProperty('z' + currentTobeProject.textContent)
		) {
			currentTobeProject.textContent = tobeApp.lastTobeProject.replace('z', '');
		} else {
			const projectItem = document.querySelectorAll(
				'.tobe-app__projects__list__item'
			);

			tobeApp.tobeObject['z' + currentTobeProject.textContent] =
				tobeApp.tobeObject[tobeApp.lastTobeProject];
			delete tobeApp.tobeObject[tobeApp.lastTobeProject];
			tobeApp.lastTobeProject = 'z' + currentTobeProject.textContent;
			localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
			localStorage.setItem('lastTobe', JSON.stringify(tobeApp.lastTobeProject));
			projectItem[tobeApp.projectIndex].childNodes[0].textContent =
				currentTobeProject.textContent;
		}
	}

	if (e.target.classList.contains('open')) {
		const tobeAppOptionContainer = document.querySelectorAll('.tobeAppOptions');
		const tobeItemDropdown = document.querySelectorAll('.tobe-app__dropdown');
		let indexArr = [...tobeAppOptionContainer].indexOf(e.target);

		if (indexArr * 27 + tobeItemDropdown[indexArr].offsetHeight + 10 >= 400) {
			tobeListWrapper.style.minHeight = '400px';
		} else if (
			tobeListWrapper.offsetHeight > tobeApp.height ||
			tobeListWrapper.offsetHeight <= tobeApp.height
		) {
			tobeListWrapper.style.minHeight =
				indexArr * 27 + tobeItemDropdown[indexArr].offsetHeight + 10 + 'px';
		}
		if (tobeListWrapper.offsetHeight < 400)
			tobeListWrapper.style.overflow = 'hidden';
	} else if (!e.target.classList.contains('open')) {
		const tobeAppOptionContainer = document.querySelectorAll('.tobeAppOptions');
		tobeAppOptionContainer.forEach(list => {
			if (!list.contains(e.target)) {
				list.parentElement.nextElementSibling.classList.remove('display');
				list.classList.remove('open');
				list.parentElement.parentElement.parentElement.classList.remove(
					'highlight'
				);
			}
		});
		tobeListWrapper.style.overflowX = 'hidden';
		tobeListWrapper.style.overflowY = 'auto';
	}
});

/* Greetings Component */

// Greetings Component HTML Tags
const timeAppContainer = document.querySelector('.time-app');
const time = document.querySelector('.time');
const greetingContainer = document.querySelector('.greeting-container');
const greeting = document.querySelector('.greeting');
const greetingName = document.querySelector('.greeting-name');
const greetingsEllipsis = document.querySelector('.greeting-ellipsis-wrapper');
const greetingsOption = document.querySelector('.ellipsis-dropdown');
const greetingsEllipsisIcon = document.querySelector('.greetingEllipsis');
const editNameBtn = document.querySelector('.editName');
const showMantraBtn = document.querySelector('.showMantra');
const inputContainer = document.querySelector('.input-container');

function greetings() {
	let userName;
	if (localStorage.getItem('username') === null) userName = '';
	else userName = JSON.parse(localStorage.getItem('username'));

	let date = new Date();

	// Formats time
	let hours = addZero(date.getHours());
	let minutes = addZero(date.getMinutes());
	let currentTime = `${hours}:${minutes}`;

	// Updates time each second
	time.textContent = currentTime;
	setTimeout(greetings, 1000);

	// Greets user depending on time of day
	if (hours >= 12 && hours < 18) {
		greeting.textContent = `Good afternoon, `;
		greetingName.textContent = userName[0];
	} else if (hours >= 18 && hours !== 4) {
		greeting.textContent = `Good evening, `;
		greetingName.textContent = userName[0];
	} else if (hours >= 4 && hours < 12) {
		greeting.textContent = 'Good morning, ';
		greetingName.textContent = userName[0];
	}
}

function addZero(num) {
	return num < 10 ? `0${num}` : num;
}

// Opens options for greetings component
function openGreetingsOptions() {
	greetingsOption.classList.toggle('share-open');
	if (greetingsOption.classList.contains('share-open'))
		greetingsEllipsisIcon.style.opacity = '1';
	else greetingsEllipsisIcon.style.opacity = '0';
}

// Allows the user to edit name inputted from introduction page
function editName() {
	let userName;
	if (localStorage.getItem('username') === null) userName = '';
	else userName = JSON.parse(localStorage.getItem('username'));

	if (mantraContainer.style.display == 'block') {
		greetingMiddle.style.opacity = '0';
		// Smooth transition
		setTimeout(() => {
			greetingMiddle.style.opacity = '1';
			mantraContainer.style.display = 'none';
			nameContainer.style.display = 'block';
			nameInput.focus();
			showMantraBtn.textContent = "Show today's mantra";
		}, 600);
	}

	const hideMantra = document.querySelector('.changeMantra');
	const mantraLine = document.querySelector('.mantra-line');

	if (showMantraBtn.textContent != "Show today's mantra") {
		hideMantra.remove();
		mantraLine.remove();
	}

	// Creates input where user's name would be and sets focus on it
	const nameInput = document.createElement('input');
	nameInput.classList.add('greeting-input');
	nameInput.value = userName[0];
	inputContainer.appendChild(nameInput);
	nameInput.classList.add('important');
	nameInput.focus();
	nameInput.addEventListener('animationend', function () {
		nameInput.classList.remove('important');
	});
	nameInput.addEventListener('input', resizeInput);
	resizeInput.call(nameInput);
	greetingsOption.classList.remove('share-open');
	greetingName.style.display = 'none';

	// Sets new user name to localStorage
	nameInput.addEventListener('keypress', e => {
		if (e.keyCode === 13) {
			userName[0] = nameInput.value;
			localStorage.setItem('username', JSON.stringify(userName));
			greetingName.style.display = 'inline';
			greetingName.classList.add('important');
			greetingName.addEventListener('animationend', function () {
				greetingName.classList.remove('important');
			});
			greetingName.textContent = nameInput.value;
			nameInput.remove();
		}
	});
}

// Resize width of edit user name input field depending on length of input
function resizeInput() {
	this.style.width = this.value.length + 'ch';
}

/* My-Mantra Component */

// My-Mantra Component HTML Tags
const nameContainer = document.querySelector('.name-container');
const mantraContainer = document.querySelector('.mantra-container');
const greetingMiddle = document.querySelector('.greeting-middle');
const ellipsisOptions = document.querySelector('.ellipsis-options');

function addChangeMantraBtn() {
	let mantra;
	if (localStorage.getItem('mantra') === null) mantra = [];
	else mantra = JSON.parse(localStorage.getItem('mantra'));

	// Hides greeting component and shows today's mantra whenever user enters website
	nameContainer.style.display = 'none';
	mantraContainer.style.display = 'block';
	mantraContainer.textContent = mantra[0];
	showMantraBtn.textContent = "Hide today's mantra";

	// Creates new HTML elements for mantra to change/hide mantra
	const changeMantra = document.createElement('li');
	const mantraLine = document.createElement('li');
	changeMantra.classList.add('changeMantra');
	mantraLine.classList.add('line', 'mantra-line');
	changeMantra.textContent = 'Change mantra';
	ellipsisOptions.insertBefore(changeMantra, editNameBtn);
	ellipsisOptions.insertBefore(mantraLine, editNameBtn);

	// Fetches new mantra from My-Mantra API if user wants to change current mantra
	changeMantra.addEventListener('click', () => {
		greetingsOption.classList.remove('share-open');
		greetingMiddle.style.opacity = '0';
		fetch('https://my-mantra-api.herokuapp.com/mantras')
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				let index = generateUniqueRandom(data);
				setTimeout(() => {
					greetingMiddle.style.opacity = '1';
					mantraContainer.textContent = data[index].mantra;
					showMantraBtn.textContent = "Hide today's mantra";
				}, 600);
				mantra[0] = data[index].mantra;
				// Sets newly fetched mantra to localStorage
				localStorage.setItem('mantra', JSON.stringify(mantra));
			});
	});
}

// Fetches today's mantra
function setMantra() {
	let mantra;
	if (localStorage.getItem('mantra') === null) mantra = [];
	else mantra = JSON.parse(localStorage.getItem('mantra'));

	// Resets the mantra each day
	let mantraDate = new Date();
	if (mantra[1] !== mantraDate.toDateString()) {
		mantra = [];
		localStorage.setItem('mantra', JSON.stringify(mantra));
	} else {
		addChangeMantraBtn();
	}
}

// Hides Greeting component and shows Mantra component
function showMantra(e) {
	greetingMiddle.style.opacity = '0';
	greetingsOption.classList.remove('share-open');

	let mantra;
	if (localStorage.getItem('mantra') === null) mantra = [];
	else mantra = JSON.parse(localStorage.getItem('mantra'));

	// States the time and day the user fetched the mantra
	let mantraDate = new Date();

	// Fetches new mantra from My-Mantra API
	if (e.target.innerText == "Show today's mantra" && mantra.length <= 0) {
		fetch('https://my-mantra-api.herokuapp.com/mantras')
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				let index = generateUniqueRandom(data);
				setTimeout(() => {
					greetingMiddle.style.opacity = '1';
					nameContainer.style.display = 'none';
					mantraContainer.textContent = data[index].mantra;
					mantraContainer.style.display = 'block';
					showMantraBtn.textContent = "Hide today's mantra";
				}, 600);
				// Adds mantra and time mantra was fetched to localStorage
				mantra[0] = data[index].mantra;
				mantra[1] = mantraDate.toDateString();
				localStorage.setItem('mantra', JSON.stringify(mantra));
				addChangeMantraBtn();
			});
	} else if (e.target.innerText == "Show today's mantra" && mantra) {
		setTimeout(() => {
			greetingMiddle.style.opacity = '1';
			nameContainer.style.display = 'none';
			mantraContainer.style.display = 'block';
			mantraContainer.textContent = mantra[0];
			showMantraBtn.textContent = "Hide today's mantra";
			addChangeMantraBtn();
		}, 600);
	} else if (e.target.innerText == "Hide today's mantra") {
		const hideMantra = document.querySelector('.changeMantra');
		const mantraLine = document.querySelector('.mantra-line');
		hideMantra.remove();
		mantraLine.remove();
		setTimeout(() => {
			greetingMiddle.style.opacity = '1';
			nameContainer.style.display = 'block';
			mantraContainer.style.display = 'none';
			showMantraBtn.textContent = "Show today's mantra";
		}, 600);
	}
}

showMantraBtn.addEventListener('click', showMantra);

/* Pomodoro Component */

// Pomodoro Component HTML Tags
const pomodoroIcon = document.querySelector('.pomodoro');
const pomodoroAppContainer = document.querySelector('.pomodoro-app');
const closePomodoroBtn = document.querySelector('.closePomodoro');
const startPomodoroBtn = document.querySelector('.pomodoro-btn');
const pomodoroTimeContainer = document.querySelector(
	'.pomodoro-time-container'
);
const pomodoroSettingsContainer = document.querySelector(
	'.pomodoro-settings-container'
);
const showPomodoroCta = document.querySelector('.showPomodoroCta');
const pomodoroCtaContainer = document.querySelector('.pomodoro-ctas');
const pomodoroTimeInput = document.querySelector('.pomodoroTime');
const pomodoroShortBreak = document.querySelector('.pomodoroShortBreak');
const pomodoroLongBreak = document.querySelector('.pomodoroLongBreak');
const pomodoroMins = document.querySelector('.pomodoro-mins');
const pomodoroSecs = document.querySelector('.pomodoro-secs');
const pomodoroMsg = document.querySelector('.pomodoro-message');
const pomodoroStartContainer = document.querySelector('.pomodoro-start');
const repeatModeBtn = document.querySelector('.repeatMode');
const deepModeBtn = document.querySelector('.deepMode');
const pomodoroCycleMsg = document.querySelector('.pomodoro-cycle');
const pomodoroCounter = document.querySelector('.pomodoro-counter');
const pomodoroResetBtn = document.querySelector('.pomodoro-cta--reset');
const pomodoroPauseBtn = document.querySelector('.pomodoro-cta--pause');
const pomodoroHistoryBtn = document.querySelector('.pomodoroHistory');
const pomodoroWarning = document.querySelector('.pomodoro-warning');
const pomodoroCancelBtn = document.querySelector('.pomodoro-warning-cta--no');
const pomodoroStopBtn = document.querySelector('.pomodoro-warning-cta--giveup');
const pomodoroHistoryContainer = document.querySelector(
	'.pomodoro-history-container'
);
const pomodoroHistoryReset = document.querySelector('.pomodoro-history-reset');
const historyDatesList = document.querySelector('.pomodoro-history-dates');
const historyMinsList = document.querySelector('.pomodoro-history-time');
const historyTotalMins = document.querySelector(
	'.pomodoro-history-totalminutes'
);
const outsetHeader = document.querySelector('header');
const outsetFooter = document.querySelector('footer');
const pomodoroThemeBtns = document.querySelectorAll('.pomodoroThemeIcons');

const pomodoroAudioHello = new Audio(sound);

// Pomodoro Component Object
const pomodoroApp = {
	minutes: pomodoroTimeInput.value,
	seconds: 60,
	pomodoroCount: 0,
	cycleCount: 0,
	paused: false,
	pomodoroDate: new Date(),
	// Fetches previous pomodoro timer from localStorage
	historyScores:
		localStorage.getItem('historyScores') === null
			? []
			: JSON.parse(localStorage.getItem('historyScores')),

	// Seconds counter
	secondsTimer: function () {
		pomodoroApp.seconds = pomodoroApp.seconds - 1;

		if (pomodoroApp.seconds < 10 && pomodoroApp.seconds >= 0)
			pomodoroSecs.innerText = '0' + pomodoroApp.seconds;
		else pomodoroSecs.innerText = pomodoroApp.seconds;

		if (pomodoroApp.minutes < 10 && pomodoroApp.minutes >= 0)
			pomodoroMins.innerText = '0' + pomodoroApp.minutes;
		else pomodoroMins.innerText = pomodoroApp.minutes;

		if (pomodoroApp.minutes < 0) {
			if (pomodoroMsg.textContent == 'Time to focus.')
				document.title = `00:00 - Focus`;
			else document.title = `Break - 00:00`;
		} else {
			// Checks if user just finished a break or work
			if (pomodoroMsg.textContent == 'Time to focus.') {
				document.title = `${pomodoroMins.innerText}:${pomodoroSecs.innerText} - Focus`;
			} else {
				document.title = `${pomodoroMins.innerText}:${pomodoroSecs.innerText} - Break`;
			}
		}

		if (pomodoroApp.seconds <= 0) {
			pomodoroApp.minutes = pomodoroApp.minutes - 1;
			pomodoroApp.seconds = 60;
			if (pomodoroApp.minutes < 0) {
				// Plays clock audio when pomodoro timer hits 0
				pomodoroAudioHello.play();
				pomodoroStartContainer.style.opacity = '0';
				setTimeout(() => {
					pomodoroStartContainer.style.opacity = '1';
					if (pomodoroMsg.textContent == 'Time to focus.') {
						// Checks if user had pomodoro session today
						const sameDay = pomodoroApp.historyScores.findIndex(
							score =>
								score.date ===
								`${pomodoroApp.pomodoroDate.getDate()}/${
									pomodoroApp.pomodoroDate.getMonth() + 1
								}/${pomodoroApp.pomodoroDate.getFullYear()}`
						);
						// Increments completed pomodoro session to today
						if (sameDay >= 0) {
							pomodoroApp.historyScores[sameDay].minutes += parseInt(
								pomodoroTimeInput.value
							);
							// Adds new date and pomodoro time
						} else {
							pomodoroApp.historyScores.push({
								date: `${pomodoroApp.pomodoroDate.getDate()}/${
									pomodoroApp.pomodoroDate.getMonth() + 1
								}/${pomodoroApp.pomodoroDate.getFullYear()}`,
								minutes: parseInt(pomodoroTimeInput.value)
							});
						}
						localStorage.setItem(
							'historyScores',
							JSON.stringify(pomodoroApp.historyScores)
						);
						// Checks if user is elligible for a long break
						if (pomodoroApp.pomodoroCount === 3) {
							clearInterval(pomodoroApp.secondsInterval);
							pomodoroApp.minutes = parseInt(pomodoroLongBreak.value) - 1;
							pomodoroMins.innerText = pomodoroApp.minutes;
							pomodoroApp.cycleCount++;
							pomodoroCounter.textContent = pomodoroApp.cycleCount;
							if (pomodoroApp.minutes < 10 && pomodoroApp.minutes >= 0)
								pomodoroMins.innerText = '0' + pomodoroApp.minutes;
							else pomodoroMins.innerText = pomodoroApp.minutes;
							pomodoroMsg.textContent = 'Time for a long break.';
							pomodoroResetBtn.textContent = 'End';
							pomodoroApp.secondsInterval = setInterval(
								pomodoroApp.secondsTimer,
								1000
							);
							// Checks if user is ready for a short break
						} else {
							clearInterval(pomodoroApp.secondsInterval);
							pomodoroApp.minutes = parseInt(pomodoroShortBreak.value) - 1;
							pomodoroMins.innerText = pomodoroApp.minutes;
							if (pomodoroApp.minutes < 10 && pomodoroApp.minutes >= 0)
								pomodoroMins.innerText = '0' + pomodoroApp.minutes;
							else pomodoroMins.innerText = pomodoroApp.minutes;
							pomodoroMsg.textContent = 'Time for a short break.';
							pomodoroResetBtn.textContent = 'End';
							// Checks if user selected repeat mode and if so, increment counters to track user's pomodoro session
							if (repeatModeBtn.checked) {
								pomodoroApp.pomodoroCount++;
								pomodoroApp.cycleCount++;
								pomodoroCounter.textContent = pomodoroApp.cycleCount;
							}
							pomodoroApp.secondsInterval = setInterval(
								pomodoroApp.secondsTimer,
								1000
							);
						}
						// Checks if user is finished from his break and goes back to main menu of pomodoro component
					} else if (pomodoroMsg.textContent == 'Time for a short break.') {
						if (!repeatModeBtn.checked) {
							clearInterval(pomodoroApp.secondsInterval);
							pomodoroApp.minutes = 0;
							pomodoroApp.seconds = 60;
							pomodoroStartContainer.style.opacity = '0';
							pomodoroStartContainer.style.visibility = 'hidden';
							pomodoroSettingsContainer.style.display = 'block';
							pomodoroMsg.textContent = 'Time to focus.';
							pomodoroResetBtn.textContent = 'Reset';
							setTimeout(() => {
								pomodoroSettingsContainer.style.opacity = '1';
							}, 100);
							document.title = 'Outset';
							// Checks if user selected repeat mode and keeps user in cycle from work and break
						} else if (repeatModeBtn.checked) {
							clearInterval(pomodoroApp.secondsInterval);
							pomodoroApp.minutes = parseInt(pomodoroTimeInput.value) - 1;
							pomodoroMins.innerText = pomodoroApp.minutes;
							if (pomodoroApp.minutes < 10 && pomodoroApp.minutes >= 0)
								pomodoroMins.innerText = '0' + pomodoroApp.minutes;
							else pomodoroMins.innerText = pomodoroApp.minutes;
							pomodoroMsg.textContent = 'Time to focus.';
							pomodoroResetBtn.textContent = 'Reset';
							pomodoroApp.secondsInterval = setInterval(
								pomodoroApp.secondsTimer,
								1000
							);
						}
					} else if (pomodoroMsg.textContent == 'Time for a long break.') {
						clearInterval(pomodoroApp.secondsInterval);
						pomodoroApp.pomodoroCount = 0;
						pomodoroApp.minutes = parseInt(pomodoroTimeInput.value) - 1;
						pomodoroMins.innerText = pomodoroApp.minutes;
						if (pomodoroApp.minutes < 10 && pomodoroApp.minutes >= 0)
							pomodoroMins.innerText = '0' + pomodoroApp.minutes;
						else pomodoroMins.innerText = pomodoroApp.minutes;
						pomodoroMsg.textContent = 'Time to focus.';
						pomodoroResetBtn.textContent = 'Reset';
						pomodoroApp.secondsInterval = setInterval(
							pomodoroApp.secondsTimer,
							1000
						);
					}
				}, 1000);
			}
		}
	},

	// Displays pomodoro component
	openPomodoroApp: function () {
		pomodoroAppContainer.style.display = 'block';
		timeAppContainer.style.opacity = '0';
		setTimeout(() => {
			pomodoroAppContainer.style.opacity = '1';
			timeAppContainer.style.display = 'none';
		}, 1000);
	},

	// Closes pomodoro component
	closePomodoroApp: function () {
		pomodoroHistoryContainer.classList.remove('openHistoryContainer');
		pomodoroAppContainer.style.opacity = '0';
		timeAppContainer.style.display = 'block';
		setTimeout(() => {
			timeAppContainer.style.opacity = '1';
			outsetHeader.style.opacity = '1';
			outsetFooter.style.opacity = '1';
			pomodoroAppContainer.style.display = 'none';
			pomodoroTimeContainer.style.display = 'none';
			pomodoroTimeContainer.style.opacity = '0';
		}, 1000);
	},

	// Start pomodoro timer
	startPomodoro: function () {
		// Checks user inputted correct field values
		if (
			pomodoroTimeInput.value > 0 &&
			pomodoroShortBreak.value > 0 &&
			pomodoroLongBreak.value > 0
		) {
			pomodoroHistoryContainer.classList.remove('openHistoryContainer');
			showPomodoroCta.classList.replace('fa-arrow-down', 'fa-arrow-up');
			pomodoroCtaContainer.style.height = '0';
			pomodoroPauseBtn.textContent = 'Pause';
			pomodoroResetBtn.textContent = 'Reset';

			// Shows pomodoro cycle text if depending on option in repeat mode
			if (!repeatModeBtn.checked) pomodoroCycleMsg.style.display = 'none';
			else pomodoroCycleMsg.style.display = 'block';

			// Shows/hides pause button on timer depending if deep mode is on or off
			if (deepModeBtn.checked) pomodoroPauseBtn.style.display = 'none';
			else pomodoroPauseBtn.style.display = 'block';

			// Animation transitions
			pomodoroSettingsContainer.style.opacity = '0';
			pomodoroTimeContainer.style.display = 'flex';
			pomodoroStartContainer.style.display = 'block';
			setTimeout(() => {
				pomodoroStartContainer.style.opacity = '1';
				pomodoroStartContainer.style.visibility = 'visible';
				pomodoroTimeContainer.style.opacity = '1';
				pomodoroSettingsContainer.style.display = 'none';
			}, 1000);

			pomodoroStartContainer.addEventListener('transitionend', () => {
				outsetHeader.style.opacity = '0';
				outsetFooter.style.opacity = '0';
			});

			pomodoroApp.minutes = parseInt(pomodoroTimeInput.value) - 1;
			pomodoroApp.seconds = 60;
			pomodoroMins.innerText = pomodoroApp.minutes;
			pomodoroSecs.innerText = pomodoroApp.seconds;
			if (pomodoroApp.minutes < 10)
				pomodoroMins.innerText = '0' + pomodoroApp.minutes;
			else pomodoroMins.innerText = pomodoroApp.minutes;

			pomodoroApp.secondsInterval = setInterval(pomodoroApp.secondsTimer, 1000);
		}
	},

	// Show pomodoro timer options
	showPomodoroBtns: function () {
		if (showPomodoroCta.classList.contains('fa-arrow-up')) {
			showPomodoroCta.classList.replace('fa-arrow-up', 'fa-arrow-down');
			pomodoroCtaContainer.style.height = '40px';
		} else {
			showPomodoroCta.classList.replace('fa-arrow-down', 'fa-arrow-up');
			pomodoroCtaContainer.style.height = '0';
		}
	},

	// Pause pomodoro timer
	pausePomodoroTimer: function (e) {
		if (e.target.textContent == 'Pause' && pomodoroApp.seconds !== 60) {
			pomodoroApp.paused = true;
			e.target.textContent = 'Play';
			clearInterval(pomodoroApp.secondsInterval);
		} else if (e.target.textContent == 'Play' && pomodoroApp.seconds !== 60) {
			pomodoroApp.paused = false;
			e.target.textContent = 'Pause';
			pomodoroApp.minutes = parseInt(pomodoroMins.innerText);
			pomodoroApp.seconds = parseInt(pomodoroSecs.innerText);
			pomodoroApp.secondsInterval = setInterval(pomodoroApp.secondsTimer, 1000);
		}
	},

	// Ends pomodoro timer
	resetPomodoroTimer: function (e) {
		if (pomodoroResetBtn.textContent === 'End') {
			clearInterval(pomodoroApp.secondsInterval);
			pomodoroApp.pomodoroCount = 0;
			pomodoroApp.cycleCount = 0;
			pomodoroSettingsContainer.style.display = 'block';
			pomodoroStartContainer.style.opacity = '0';
			setTimeout(() => {
				document.title = 'Outset';
				pomodoroMsg.textContent = 'Time to focus.';
				pomodoroResetBtn.textContent = 'Reset';
				pomodoroCounter.textContent = pomodoroApp.cycleCount;
				pomodoroStartContainer.style.display = 'none';
				pomodoroSettingsContainer.style.opacity = '1';
			}, 1000);
		} else {
			pomodoroWarning.style.opacity = '1';
			pomodoroWarning.style.visibility = 'visible';
		}
	},

	// Shows warning if user decides to end pomodoro without completing it
	closeWarning: function () {
		pomodoroWarning.style.opacity = '0';
		pomodoroWarning.style.visibility = 'hidden';
	},

	// Animates out of pomodoro component into main website
	exitPomodoro: function () {
		clearInterval(pomodoroApp.secondsInterval);
		pomodoroApp.pomodoroCount = 0;
		pomodoroApp.cycleCount = 0;
		pomodoroSettingsContainer.style.display = 'block';
		pomodoroStartContainer.style.opacity = '0';
		pomodoroWarning.style.opacity = '0';
		pomodoroWarning.style.visibility = 'hidden';
		pomodoroWarning.style.display = 'none';
		document.title = 'Outset';
		setTimeout(() => {
			pomodoroCounter.textContent = pomodoroApp.cycleCount;
			pomodoroStartContainer.style.display = 'none';
			pomodoroSettingsContainer.style.opacity = '1';
			pomodoroWarning.style.display = 'flex';
		}, 1000);
	},

	// Shows users pomodoro session history
	showPomdoroHistory: function () {
		pomodoroHistoryContainer.classList.toggle('openHistoryContainer');
		historyDatesList.innerHTML = '';
		historyMinsList.innerHTML = '';
		pomodoroApp.historyScores.forEach(score => {
			const historyDate = document.createElement('li');
			historyDate.classList.add('pomodoro-history-date');
			historyDate.textContent = score.date;

			const historyMin = document.createElement('li');
			historyMin.classList.add('pomodoro-history-minutes');
			historyMin.textContent = score.minutes;

			historyDatesList.appendChild(historyDate);
			historyMinsList.appendChild(historyMin);
		});
		historyTotalMins.textContent = pomodoroApp.historyScores.reduce(
			(prev, curr) => prev + parseInt(curr.minutes),
			0
		);
	},

	// Resets pomodoro history and saves to localStorage
	resetPomodoroHistory: function () {
		historyDatesList.innerHTML = '';
		historyMinsList.innerHTML = '';
		pomodoroApp.historyScores = [];
		localStorage.setItem(
			'historyScores',
			JSON.stringify(pomodoroApp.historyScores)
		);
	},

	// Light/dark mode theme switcher
	pomodoroChangeTheme: function (e) {
		if (e.target.classList.contains('fa-sun')) {
			pomodoroTimeContainer.setAttribute('id', '');
			e.target.classList.replace('fa-sun', 'fa-moon');
			pomodoroThemeBtns[1].classList.replace('fa-moon', 'fa-sun');
		} else if (e.target.classList.contains('fa-moon')) {
			pomodoroTimeContainer.id = 'pomodoroDarkMode';
			e.target.classList.replace('fa-moon', 'fa-sun');
			pomodoroThemeBtns[1].classList.replace('fa-sun', 'fa-moon');
		}
	}
};

// Event listeners for pomodoro component
pomodoroIcon.addEventListener('click', pomodoroApp.openPomodoroApp);
closePomodoroBtn.addEventListener('click', pomodoroApp.closePomodoroApp);
startPomodoroBtn.addEventListener('click', pomodoroApp.startPomodoro);
showPomodoroCta.addEventListener('click', pomodoroApp.showPomodoroBtns);
pomodoroResetBtn.addEventListener('click', pomodoroApp.resetPomodoroTimer);
pomodoroPauseBtn.addEventListener('click', pomodoroApp.pausePomodoroTimer);
pomodoroHistoryBtn.addEventListener('click', pomodoroApp.showPomdoroHistory);
pomodoroCancelBtn.addEventListener('click', pomodoroApp.closeWarning);
pomodoroStopBtn.addEventListener('click', pomodoroApp.exitPomodoro);
pomodoroHistoryReset.addEventListener(
	'click',
	pomodoroApp.resetPomodoroHistory
);
pomodoroThemeBtns.forEach(btn =>
	btn.addEventListener('click', pomodoroApp.pomodoroChangeTheme)
);
greetingsEllipsisIcon.addEventListener('click', openGreetingsOptions);
editNameBtn.addEventListener('click', editName);
greetingName.addEventListener('dblclick', editName);

/* Intention Component */

// Intention Component HTML Tags
const intentionInput = document.querySelector('.intention-input');
const intentionAnswer = document.querySelector('.intention-answer');
const intentionCta = document.querySelector('.intention-cta');
const intentionIcons = document.querySelectorAll('.intention-icons');
const intentionQuestionContainer = document.querySelector(
	'.intention-question-container'
);
const intentionAnswerContainer = document.querySelector(
	'.intention-answer-container'
);

// Intention Component Event listeners
intentionInput.addEventListener('keypress', changeIntention);
intentionCta.addEventListener('mouseover', intentionAnswerIcons);
intentionCta.addEventListener('mouseleave', removeIntentionIcons);

// Fetches user's set intention from localStorage and sets it
function setIntention() {
	let intention;
	if (localStorage.getItem('intention') === null) intention = [];
	else intention = JSON.parse(localStorage.getItem('intention'));

	// Reset intention each day
	let dateNow = new Date();

	if (intention[1] !== dateNow.toDateString()) {
		intention = [];
		localStorage.setItem('intention', JSON.stringify(intention));
	} else if (intention.length > 0) {
		intentionQuestionContainer.style.visibility = 'hidden';
		intentionQuestionContainer.style.opacity = '0';
		intentionAnswer.textContent = intention[0];
		intentionAnswerContainer.style.visibility = 'visible';
		intentionAnswerContainer.style.opacity = '1';
	} else {
		intentionQuestionContainer.style.visibility = 'visible';
		intentionAnswerContainer.style.visibility = 'hidden';
		intentionAnswerContainer.style.opacity = '0';
	}
}

// Change user's intention
function changeIntention(e) {
	let intention;
	if (localStorage.getItem('intention') === null) intention = [];
	else intention = JSON.parse(localStorage.getItem('intention'));

	let inputDate = new Date();

	if (e.keyCode === 13 && e.target.value !== '') {
		intentionQuestionContainer.style.opacity = '0';
		// Saves new intention and day
		intention[0] = e.target.value;
		intention[1] = inputDate.toDateString();
		localStorage.setItem('intention', JSON.stringify(intention));
		setTimeout(() => {
			intentionQuestionContainer.style.visibility = 'hidden';
			intentionAnswer.textContent = intention[0];
			intentionAnswerContainer.style.visibility = 'visible';
			intentionAnswerContainer.style.opacity = '1';
		}, 600);
	}
}

// Opens Intention component's edit options
function intentionAnswerIcons() {
	let intention;
	if (localStorage.getItem('intention') === null) intention = [];
	else intention = JSON.parse(localStorage.getItem('intention'));

	intentionIcons.forEach(icon => {
		icon.style.visibility = 'visible';
		icon.addEventListener('click', e => {
			intentionAnswerContainer.style.opacity = '0';
			setTimeout(() => {
				intentionAnswerContainer.style.visibility = 'hidden';
				icon.style.visibility = 'hidden';
				intentionQuestionContainer.style.opacity = '1';
				intentionQuestionContainer.style.visibility = 'visible';
			}, 600);
			// Deletes user intentions
			if (e.target.classList.contains('fa-times')) {
				intentionInput.value = '';
				intention = [];
				// Create new input field with value of current intention to edit it
			} else if (e.target.classList.contains('fa-pen')) {
				intentionInput.value = intention[0];
			}
			localStorage.setItem('intention', JSON.stringify(intention));
		});
	});
}

// Hides Intention component edit options when mouse leaves intention component
function removeIntentionIcons() {
	intentionIcons.forEach(icon => (icon.style.visibility = 'hidden'));
}

// Checks if user is inactive on website for more than 30 seconds
// Resets timer if user moves mouse
const inactivityTime = function () {
	let time;
	window.onload = resetTimer;
	// DOM Events
	document.onmousemove = resetTimer;
	document.onkeydown = resetTimer;

	// Hides greeting component and user cursor
	function logout() {
		greetingContainer.style.opacity = '0';
		document.querySelector('.intention').style.opacity = '0';
		document.body.style.cursor = 'none';
	}

	function resetTimer() {
		greetingContainer.style.opacity = '1';
		document.querySelector('.intention').style.opacity = '1';
		document.body.style.cursor = 'default';
		clearTimeout(time);
		time = setTimeout(logout, 30000);
	}
};

window.onload = function () {
	inactivityTime();
};

// Footer HTML tags
const backgroundLocation = document.querySelector('.background-location');
const changeBackground = document.querySelector('.changeBackground');
const heartBackground = document.querySelector('.background-photo');
const backgroundDetails = document.querySelector('.background-details');
const backgroundInfo = document.querySelector('.background-info');
const backgroundUser = document.querySelector('.background-user');
const backgroundUserLink = document.querySelector('.background-user-link');
const changeQuote = document.querySelector('.changeQuote');
const quotesInfo = document.querySelector('.quotes-info');
const inspirationalQuote = document.querySelector('.quote');
const quoteDetails = document.querySelector('.quote-details');
const quoteOrigin = document.querySelector('.quote-origin');
const shareBtn = document.querySelector('.shareBtn');
const shareBox = document.querySelector('.share-box');

// Social Icons
const facebookBtn = document.querySelector('.social-facebook');
const twitterBtn = document.querySelector('.social-twitter');
const linkedBtn = document.querySelector('.social-linked');
const whatsappBtn = document.querySelector('.social-whatsapp');
const redditBtn = document.querySelector('.social-reddit');
const quoteBtn = document.querySelector('.social-quote');
const archiveBtn = document.querySelector('.fa-archive');
const closeArchiveBtn = document.querySelector('.closeArchive');
const archiveContainer = document.querySelector('.archive');
const saveQuoteBtn = document.querySelector('.saveQuote');
const archiveQuotesContainer = document.querySelector(
	'.archive-quotes-container'
);
const addQuoteBtn = document.querySelector('.addQuoteBtn');
const archiveSearch = document.querySelector('.archive-search-box');

// Footer Event Listeners
changeBackground.addEventListener('click', generateBackground);
changeQuote.addEventListener('click', generateQuote);
backgroundInfo.addEventListener('mouseenter', showBackgroundDetails);
backgroundInfo.addEventListener('mouseleave', showBackgroundDetails);
quotesInfo.addEventListener('mouseenter', showQuoteDetails);
quotesInfo.addEventListener('mouseleave', showQuoteDetails);
shareBtn.addEventListener('click', openQuoteBox);
archiveBtn.addEventListener('click', openArchiveBox);
closeArchiveBtn.addEventListener('click', closeArchiveBox);
saveQuoteBtn.addEventListener('click', archiveQuote);
addQuoteBtn.addEventListener('click', addQuote);
archiveSearch.addEventListener('keyup', searchArhive);

// Trigger reflow
function reset_animation(element) {
	element.style.animation = 'none';
	element.offsetHeight;
	element.style.animation = null;
}

let uniqueNumbersArray = [];

// Generates unique random number
function generateUniqueRandom(maxNr) {
	//Generate random number
	let random = (Math.random() * maxNr.length).toFixed();

	if (!uniqueNumbersArray.includes(random)) {
		uniqueNumbersArray.push(random);
		return random;
	} else {
		if (uniqueNumbersArray.length < maxNr.length) {
			//Recursively generate number
			return generateUniqueRandom(maxNr);
		} else {
			uniqueNumbersArray = [];
		}
	}
}

// Generates new randomly quote from Quotes API
function generateQuote() {
	fetch('https://type.fit/api/quotes')
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			let index = generateUniqueRandom(data);
			reset_animation(inspirationalQuote);
			inspirationalQuote.textContent = `${data[index].text}`;
			// Sets quote and author to share
			shareQuote(`${data[index].text} - ${data[index].author}`);
			if (data[index].author === null) {
				reset_animation(quoteOrigin);
				quoteOrigin.textContent = 'Unknown';
				shareQuote(`${data[index].text} - Unknown`);
			} else {
				reset_animation(quoteOrigin);
				quoteOrigin.textContent = `${data[index].author}`;
			}
			checkQuote(inspirationalQuote.textContent);
		});
}

function openQuoteBox() {
	shareBox.classList.toggle('share-open');
}

// Share functionality for socials
function shareQuote(quote) {
	let postTitle = encodeURI(quote);
	let hostedUrl = `https://outset-website.vercel.app/`;
	let encodedHostedUrl = encodeURI(hostedUrl);

	facebookBtn.setAttribute(
		'href',
		`https://www.facebook.com/sharer/sharer.php?u=${encodedHostedUrl}&quote=${postTitle}`
	);
	twitterBtn.setAttribute(
		'href',
		`https://twitter.com/share?&text=${postTitle}`
	);
	linkedBtn.setAttribute(
		'href',
		`https://www.linkedin.com/shareArticle?mini=true&url=${encodedHostedUrl}&title=${postTitle}`
	);
	redditBtn.setAttribute(
		'href',
		`https://reddit.com/submit?url=https://outset-website.vercel.app/&title=${postTitle}`
	);
	whatsappBtn.setAttribute(
		'href',
		`https://api.whatsapp.com/send?text=${postTitle}`
	);
	// Copies quote to clipboard
	quoteBtn.addEventListener('click', async function copyQuote() {
		try {
			await navigator.clipboard.writeText(quote);
			quoteBtn.querySelector('span').textContent = 'Copied!';
		} catch (err) {
			quoteBtn.querySelector('span').textContent = 'Copy Failed';
		}
	});
}

// Adds saved quotes to archive
function generateQuoteElements(quote, origin) {
	const quoteInfoDiv = document.createElement('div');
	quoteInfoDiv.classList.add('archive-quote-info');

	const archiveQuote = document.createElement('p');
	archiveQuote.textContent = quote;
	archiveQuote.classList.add('archive-quote');
	quoteInfoDiv.appendChild(archiveQuote);

	const draggableIcon = document.createElement('i');
	draggableIcon.classList.add('fas', 'fa-arrows-alt');
	archiveQuote.prepend(draggableIcon);

	const archiveOrigin = document.createElement('p');
	archiveOrigin.textContent = origin;
	archiveOrigin.classList.add('archive-origin');
	quoteInfoDiv.appendChild(archiveOrigin);

	const archiveCtaDiv = document.createElement('div');
	archiveCtaDiv.classList.add('archive-cta');

	const copyPopup = document.createElement('span');
	copyPopup.classList.add('copyQuote');
	copyPopup.textContent = 'Copy';

	const archiveCopyIcon = document.createElement('i');
	archiveCopyIcon.classList.add('fas', 'fa-quote-left', 'copyArchiveBtn');

	const archiveCopyBtn = document.createElement('p');
	archiveCopyBtn.appendChild(archiveCopyIcon);
	archiveCopyBtn.appendChild(copyPopup);
	archiveCopyBtn.classList.add('archive-icons');
	archiveCtaDiv.appendChild(archiveCopyBtn);

	const archiveTrashIcon = document.createElement('i');
	archiveTrashIcon.classList.add('fas', 'fa-trash', 'deleteQuote');

	const archiveTrashBtn = document.createElement('p');
	archiveTrashBtn.appendChild(archiveTrashIcon);
	archiveTrashBtn.classList.add('archive-icons');
	archiveCtaDiv.appendChild(archiveTrashBtn);

	quoteInfoDiv.appendChild(archiveCtaDiv);

	archiveQuotesContainer.appendChild(quoteInfoDiv);

	const deleteQuoteBtn = document.querySelectorAll('.deleteQuote');
	deleteQuoteBtn.forEach(btn => btn.addEventListener('click', deleteQuote));

	const copyQuoteBtn = document.querySelectorAll('.copyArchiveBtn');
	copyQuoteBtn.forEach(btn => btn.addEventListener('click', copyArchiveQuote));
}

// Open quotes archive container
function openArchiveBox() {
	archiveContainer.style.opacity = '1';
	archiveContainer.style.display = 'flex';
}

// Fetches saved quotes and generate list in archive container
function getQuote() {
	let quotes;
	if (localStorage.getItem('quotes') === null) quotes = [];
	else quotes = JSON.parse(localStorage.getItem('quotes'));

	quotes.forEach(quote => generateQuoteElements(quote.quote, quote.origin));
}

// Search quote component's archive container for quotes depending on value in search field
function searchArhive(e) {
	const arhiveInfo = document.querySelectorAll('.archive-quote-info');
	let text = e.target.value.toLowerCase();
	Array.from(arhiveInfo).forEach(item => {
		let itemQuote = item.firstChild.textContent;
		let itemOrigin = item.children[1].textContent;
		if (
			itemQuote.toLowerCase().indexOf(text) != -1 ||
			itemOrigin.toLowerCase().indexOf(text) != -1
		) {
			item.style.display = 'grid';
		} else {
			item.style.display = 'none';
		}
	});
}

// Check if user has already saved a quote, display full heart if user has
function checkQuote(inspiredQuote) {
	let quotes;
	if (localStorage.getItem('quotes') === null) quotes = [];
	else quotes = JSON.parse(localStorage.getItem('quotes'));

	quotes.forEach(quote =>
		quote.quote === inspiredQuote
			? saveQuoteBtn.classList.replace('far', 'fas')
			: saveQuoteBtn.classList.replace('fas', 'far')
	);
}

// Adds user own quote inside archive container
function addQuote() {
	let quotes;
	if (localStorage.getItem('quotes') === null) quotes = [];
	else quotes = JSON.parse(localStorage.getItem('quotes'));

	const addedQuoteText = document.querySelector('.archive-add-quote');
	const addedQuoteOrigin = document.querySelector('.archive-add-origin');

	if (addedQuoteText.value !== '' && addedQuoteOrigin.value === '') {
		generateQuoteElements(addedQuoteText.value, 'Unknown');
		quotes.push({ quote: addedQuoteText.value, origin: 'Unknown' });
	} else if (addedQuoteText.value !== '') {
		generateQuoteElements(addedQuoteText.value, addedQuoteOrigin.value);
		quotes.push({
			quote: addedQuoteText.value,
			origin: addedQuoteOrigin.value
		});
	}

	localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Delete selected archived quote
function deleteQuote(e) {
	let quotes;
	if (localStorage.getItem('quotes') === null) quotes = [];
	else quotes = JSON.parse(localStorage.getItem('quotes'));

	const quoteInfoDiv = document.querySelectorAll('.archive-quote-info');
	const quoteInfoDivNodes = Array.prototype.slice.call(quoteInfoDiv);
	quoteInfoDivNodes.forEach((div, i) => {
		if (div.contains(e.target)) {
			quotes.splice(i, 1);
			quoteInfoDivNodes.splice(i, 1);
			div.remove();
			localStorage.setItem('quotes', JSON.stringify(quotes));
		}
	});
}

// Copies selected archive quote to clipboard
async function copyArchiveQuote(e) {
	let quote =
		e.target.parentElement.parentElement.parentElement.firstElementChild
			.textContent;
	let origin =
		e.target.parentElement.parentElement.parentElement.children[1].textContent;
	let copiedQuote = `${quote} - ${origin}`;
	const copyPopup = document.querySelectorAll('.copyQuote');
	try {
		await navigator.clipboard.writeText(copiedQuote);
		copyPopup.forEach(popup => (popup.textContent = 'Copy'));
		e.target.nextElementSibling.textContent = 'Copied!';
	} catch (err) {
		e.target.nextElementSibling.textContent = 'Copy Failed';
	}
}

function closeArchiveBox() {
	archiveContainer.style.opacity = '0';
	setTimeout(() => {
		archiveContainer.style.display = 'none';
	}, 300);
}

// Saves currently displayed quote on main page to archive
function archiveQuote() {
	let quotes;
	if (localStorage.getItem('quotes') === null) quotes = [];
	else quotes = JSON.parse(localStorage.getItem('quotes'));

	// If user has the quote already saved, it will delete it from archive box
	if (saveQuoteBtn.classList.contains('fas')) {
		const quoteInfoDiv = document.querySelectorAll('.archive-quote-info');
		saveQuoteBtn.classList.replace('fas', 'far');
		quotes.forEach((quote, i) => {
			if (quote.quote === inspirationalQuote.textContent) {
				quotes.splice(i, 1);
				quoteInfoDiv[i].remove();
			}
		});
	} else if (saveQuoteBtn.classList.contains('far')) {
		saveQuoteBtn.classList.replace('far', 'fas');
		quotes.push({
			quote: inspirationalQuote.textContent,
			origin: quoteOrigin.textContent
		});
		generateQuoteElements(
			inspirationalQuote.textContent,
			quoteOrigin.textContent
		);
	}

	localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Gives user control to sort archive container
new Sortable(archiveQuotesContainer, {
	handle: '.fa-arrows-alt',
	animation: 150,
	onUpdate: function (e) {
		let quotes;
		if (localStorage.getItem('quotes') === null) quotes = [];
		else quotes = JSON.parse(localStorage.getItem('quotes'));

		function array_move(arr, old_index, new_index) {
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
			return arr;
		}

		array_move(quotes, e.oldIndex, e.newIndex);

		localStorage.setItem('quotes', JSON.stringify(quotes));
	}
});

// Fetches saved background from localStorage
function loadBackground() {
	let bg;
	if (localStorage.getItem('bg') === null) bg = '';
	else bg = JSON.parse(localStorage.getItem('bg'));

	let bgDate = new Date();

	// Default background
	if (bg == '') {
		document.body.style.backgroundImage = `url(${require('../images/backgrounds/sunset2.jpg')})`;
		// Generates new background if its a new day
	} else if (bg.date !== bgDate.toDateString()) {
		generateBackground();
	} else {
		backgroundUser.textContent = bg.name;
		backgroundUserLink.href = bg.links;
		heartBackground.href = bg.href;
		backgroundLocation.textContent = bg.location;
		document.body.style.backgroundImage = `url(${bg.img})`;
	}
}

// Fetches new background from Unsplash API and saves to localStorage
async function generateBackground() {
	let bg;
	if (localStorage.getItem('bg') === null) bg = '';
	else bg = JSON.parse(localStorage.getItem('bg'));

	let bgDate = new Date();

	const response = await fetch(
		`https://api.unsplash.com/collections/GsNw3bdVLPM/photos/?client_id=${api.keyTwo}&per_page=30`
	);
	const data = await response.json();
	const bgIndex = await data[generateUniqueRandom(data)];
	const responseTwo = await fetch(
		`https://api.unsplash.com/photos/${bgIndex.id}/?client_id=${api.keyTwo}`
	);
	const dataTwo = await responseTwo.json();
	dataTwo.location.title === null
		? (backgroundLocation.textContent = 'Unknown')
		: (backgroundLocation.textContent = dataTwo.location.title);
	backgroundUser.textContent = dataTwo.user.name;
	backgroundUserLink.href = dataTwo.user.links.html;
	heartBackground.href = dataTwo.links.html;
	document.body.style.backgroundImage = `url(${bgIndex.urls.full})`;
	bg = {
		name: dataTwo.user.name,
		location:
			dataTwo.location.title === null ? 'Unknown' : dataTwo.location.title,
		links: dataTwo.user.links.html,
		href: dataTwo.links.html,
		img: bgIndex.urls.full,
		date: bgDate.toDateString()
	};
	localStorage.setItem('bg', JSON.stringify(bg));
}

// Show options for background
function showBackgroundDetails() {
	backgroundDetails.classList.toggle('visibility');
	backgroundLocation.classList.toggle('background-show');
}

// Show options for quote
function showQuoteDetails() {
	inspirationalQuote.classList.toggle('background-show');
	quoteBtn.querySelector('span').textContent = 'Copy to clipboard';
	quoteDetails.classList.toggle('visibility');
	shareBox.classList.remove('share-open');
}

// Personal Name Functionality
const introduction = document.querySelector('.introduction');
const introductionContainer = document.querySelector(
	'.intro-question-container'
);
const introQuestionContainer = document.querySelector('.intro-question');
const userInputName = document.querySelector('.intro-name-input');
const introCta = document.querySelector('.intro-cta');
const introConfirmationContainer = document.querySelector(
	'.intro-confirmation'
);
const changeName = document.querySelector('.change-name');
const saveName = document.querySelector('.confirm-name');
const container = document.querySelector('.container');
const introName = document.querySelector('.intro-name-title');
const featuresSection = document.querySelector('.features');
const introductionOverlay = document.querySelector('.introduction-overlay');
const featuresUsername = document.querySelector('.features-user-name');

function setUserName(e) {
	if (e.keyCode === 13 && e.target.value !== '') {
		introQuestionContainer.style.opacity = '0';
		setTimeout(() => {
			introQuestionContainer.style.visibility = 'hidden';
			introName.textContent = e.target.value;
			introCta.style.visibility = 'visible';
			introCta.style.opacity = '1';
			introConfirmationContainer.style.visibility = 'visible';
			introConfirmationContainer.style.opacity = '1';
		}, 1000);
	}
}

function changeUserName() {
	introCta.style.opacity = '0';
	introConfirmationContainer.style.opacity = '0';
	setTimeout(() => {
		introConfirmationContainer.style.visibility = 'hidden';
		introCta.style.visibility = 'hidden';
		introQuestionContainer.style.opacity = '1';
		introQuestionContainer.style.visibility = 'visible';
		userInputName.textContent = introName.textContent;
		userInputName.focus();
	}, 1000);
}

function saveUserName() {
	let userName;
	if (localStorage.getItem('username') === null) userName = [];
	else userName = JSON.parse(localStorage.getItem('username'));

	userName[0] = introName.textContent;
	localStorage.setItem('username', JSON.stringify(userName));
	introductionContainer.style.opacity = '0';
	introductionOverlay.style.display = 'block';
	featuresUsername.textContent = userName[0];
	setTimeout(() => {
		introductionContainer.style.display = 'none';
		featuresSection.style.display = 'flex';
	}, 1000);
}

function checkUserName() {
	let userName;
	if (localStorage.getItem('username') === null) userName = [];
	else userName = JSON.parse(localStorage.getItem('username'));

	if (localStorage.getItem('username') === null) {
		container.classList.remove('visibility');
		introduction.style.visibility = 'visible';
		introduction.style.opacity = '1';
	} else if (userName.length === 1) {
		featuresUsername.textContent = userName[0];
		introductionContainer.style.display = 'none';
		introductionOverlay.style.display = 'block';
		featuresSection.style.display = 'flex';
	} else {
		introductionOverlay.style.display = 'none';
		introduction.style.visibility = 'hidden';
		introduction.style.opacity = '0';
		container.classList.add('visibility');
	}
}

userInputName.addEventListener('keypress', setUserName);
changeName.addEventListener('click', changeUserName);
saveName.addEventListener('click', saveUserName);

// Features

const featuresIcons = document.querySelectorAll('.features-icon');
const featuresDesc = document.querySelector('.features-desc');
const featuresBtn = document.querySelector('.features-btn');
const featuresWelcome = document.querySelector('.features-welcome');
const featuresDots = document.querySelectorAll('.dot');
const featuresContent = document.querySelector('.features-content');
const featuresHeading = document.querySelector('.features-heading');
const featuresSvg = document.querySelectorAll('.features-svg');
const iconDesc = document.querySelectorAll('.icon-desc');
const featuresFooter = document.querySelector('.features-footer');
const featuresContainer = document.querySelector('.features-container');

let featuresIndex = 1;
let oldFeaturesIndex = 0;

featuresIcons.forEach((icon, i) =>
	icon.addEventListener('mouseover', () => {
		if (i === 0) {
			switch (featuresIndex) {
				case 2:
					featuresDesc.textContent = 'Inspiring Photography';
					break;
				case 3:
					featuresDesc.textContent = 'Set a daily intention reminder';
					break;
				case 4:
					featuresDesc.textContent = 'Set key dates';
					break;
			}
		} else if (i === 1) {
			switch (featuresIndex) {
				case 2:
					featuresDesc.textContent = 'Timeless Wisdom';
					break;
				case 3:
					featuresDesc.textContent = 'Organise your daily tasks';
					break;
				case 4:
					featuresDesc.textContent = 'Set a time to focus';
					break;
			}
		} else {
			switch (featuresIndex) {
				case 2:
					featuresDesc.textContent = 'Positive Concepts';
					break;
				case 3:
					featuresDesc.textContent = 'Quickly access your most used websites';
					break;
				case 4:
					featuresDesc.textContent = 'Check weather worldwide';
					break;
			}
		}
	})
);

featuresIcons.forEach(icon =>
	icon.addEventListener('mouseleave', () => {
		switch (featuresIndex) {
			case 2:
				featuresDesc.textContent = 'Breathe life into your browser';
				break;
			case 3:
				featuresDesc.textContent = 'Approach each day with intent';
				break;
			case 4:
				featuresDesc.textContent = 'Enjoy the extra features of Outset';
				break;
		}
	})
);

function displayFeatures(heading, desc, src1, src2, src3, text1, text2, text3) {
	featuresFooter.style.animation = 'opacity 1s forwards';
	featuresHeading.textContent = heading;
	featuresDesc.textContent = desc;
	featuresSvg[0].src = src1;
	featuresSvg[1].src = src2;
	featuresSvg[2].src = src3;
	iconDesc[0].textContent = text1;
	iconDesc[1].textContent = text2;
	iconDesc[2].textContent = text3;
	featuresContent.style.animation = 'zoomIn 0.7s ease-in forwards';
}

function fadeElements(el1, el2) {
	featuresDots[oldFeaturesIndex].style.pointerEvents = 'all';
	featuresDots[featuresIndex].style.pointerEvents = 'none';

	el1.style.animation = 'fadeOut 1s forwards';
	el2.style.animation = 'none';

	featuresDots[oldFeaturesIndex].classList.remove('active');
	featuresDots[featuresIndex].classList.add('active');
}

function elementsDisplay(el1, el2) {
	el1.style.display = 'none';
	el2.style.display = 'block';
}

function showNextFeature(e) {
	if (featuresIndex === 1) {
		fadeElements(featuresWelcome, featuresFooter);
		featuresWelcome.addEventListener('animationend', function changeContent() {
			featuresFooter.style.animation = 'opacity 1s forwards';
			elementsDisplay(featuresWelcome, featuresContent);
			featuresContent.style.animation = 'zoomIn 0.7s ease-in forwards';
			featuresWelcome.removeEventListener('animationend', changeContent);
		});
		oldFeaturesIndex = featuresIndex;
		featuresIndex++;
	} else if (featuresIndex === 2) {
		fadeElements(featuresContent, featuresFooter);
		featuresContent.addEventListener('animationend', function changeContent() {
			displayFeatures(
				'Focus',
				'Approach each day with intent',
				`${require('../images/svgs/focus.svg')}`,
				`${require('../images/svgs/todo.svg')}`,
				`${require('../images/svgs/links.svg')}`,
				'Focus',
				'To-do',
				'Links'
			);
			featuresContent.removeEventListener('animationend', changeContent);
		});
		oldFeaturesIndex = featuresIndex;
		featuresIndex++;
	} else if (featuresIndex === 3) {
		fadeElements(featuresContent, featuresFooter);
		featuresContent.addEventListener('animationend', function changeContent() {
			displayFeatures(
				'Extra Features',
				'Enjoy the extra features of Outset',
				`${require('../images/svgs/calendar.svg')}`,
				`${require('../images/svgs/clock.svg')}`,
				`${require('../images/svgs/weather.svg')}`,
				'Calendar',
				'Timer',
				'Weather'
			);
			featuresContent.removeEventListener('animationend', changeContent);
		});
		oldFeaturesIndex = featuresIndex;
		featuresIndex++;
	} else if (featuresIndex === 4) {
		let userName = JSON.parse(localStorage.getItem('username'));
		userName.push('started');
		localStorage.setItem('username', JSON.stringify(userName));
		featuresContainer.style.animation = 'fadeOut 1s forwards';
		introduction.style.opacity = '0';
		setTimeout(() => {
			featuresSection.style.display = 'none';
			introduction.style.display = 'none';
			container.classList.add('visibility');
		}, 1000);
	}

	if (featuresIndex === 4) featuresBtn.textContent = 'Get Started';
	else featuresBtn.textContent = 'Next';
}

featuresBtn.addEventListener('click', showNextFeature);
featuresDots.forEach((dot, i) =>
	dot.addEventListener('click', () => {
		if (i !== 3) featuresBtn.textContent = 'Next';
		else featuresBtn.textContent = 'Get Started';

		switch (i) {
			case 0:
				featuresIndex = 0;
				fadeElements(featuresContent, featuresFooter);
				featuresContent.addEventListener(
					'animationend',
					function changeContent() {
						elementsDisplay(featuresContent, featuresWelcome);
						reset_animation(featuresWelcome);
						displayFeatures(
							'Inspiration',
							'Breathe life into your browser',
							`${require('../images/svgs/picture.svg')}`,
							`${require('../images/svgs/quote.svg')}`,
							`${require('../images/svgs/mantra.svg')}`,
							'Photos',
							'Quotes',
							'Mantras'
						);
						featuresContent.removeEventListener('animationend', changeContent);
					}
				);
				oldFeaturesIndex = featuresIndex;
				featuresIndex++;
				break;
			case 1:
				featuresIndex = 1;
				if (featuresWelcome.style.display != 'none') {
					fadeElements(featuresWelcome, featuresFooter);
					featuresWelcome.addEventListener(
						'animationend',
						function changeContent() {
							displayFeatures(
								'Inspiration',
								'Breathe life into your browser',
								`${require('../images/svgs/picture.svg')}`,
								`${require('../images/svgs/quote.svg')}`,
								`${require('../images/svgs/mantra.svg')}`,
								'Photos',
								'Quotes',
								'Mantras'
							);
							elementsDisplay(featuresWelcome, featuresContent);
							featuresWelcome.removeEventListener(
								'animationend',
								changeContent
							);
						}
					);
				} else {
					fadeElements(featuresContent, featuresFooter);
					featuresContent.addEventListener(
						'animationend',
						function changeContent() {
							displayFeatures(
								'Inspiration',
								'Breathe life into your browser',
								`${require('../images/svgs/picture.svg')}`,
								`${require('../images/svgs/quote.svg')}`,
								`${require('../images/svgs/mantra.svg')}`,
								'Photos',
								'Quotes',
								'Mantras'
							);
							featuresContent.removeEventListener(
								'animationend',
								changeContent
							);
						}
					);
				}
				oldFeaturesIndex = featuresIndex;
				featuresIndex++;
				break;
			case 2:
				featuresIndex = 2;
				if (featuresWelcome.style.display != 'none') {
					fadeElements(featuresWelcome, featuresFooter);
					featuresWelcome.addEventListener(
						'animationend',
						function changeContent() {
							elementsDisplay(featuresWelcome, featuresContent);
							displayFeatures(
								'Focus',
								'Approach each day with intent',
								`${require('../images/svgs/focus.svg')}`,
								`${require('../images/svgs/todo.svg')}`,
								`${require('../images/svgs/links.svg')}`,
								'Focus',
								'To-do',
								'Links'
							);
							featuresWelcome.removeEventListener(
								'animationend',
								changeContent
							);
						}
					);
				} else {
					fadeElements(featuresContent, featuresFooter);
					featuresContent.addEventListener(
						'animationend',
						function changeContent() {
							displayFeatures(
								'Focus',
								'Approach each day with intent',
								`${require('../images/svgs/focus.svg')}`,
								`${require('../images/svgs/todo.svg')}`,
								`${require('../images/svgs/links.svg')}`,
								'Focus',
								'To-do',
								'Links'
							);
							featuresContent.removeEventListener(
								'animationend',
								changeContent
							);
						}
					);
				}
				oldFeaturesIndex = featuresIndex;
				featuresIndex++;
				break;
			case 3:
				featuresIndex = 3;
				if (featuresWelcome.style.display != 'none') {
					fadeElements(featuresWelcome, featuresFooter);
					featuresWelcome.addEventListener(
						'animationend',
						function changeContent() {
							elementsDisplay(featuresWelcome, featuresContent);
							displayFeatures(
								'Extra Features',
								'Enjoy the extra features of Outset',
								`${require('../images/svgs/calendar.svg')}`,
								`${require('../images/svgs/clock.svg')}`,
								`${require('../images/svgs/weather.svg')}`,
								'Calendar',
								'Timer',
								'Weather'
							);
							featuresWelcome.removeEventListener(
								'animationend',
								changeContent
							);
						}
					);
				} else {
					fadeElements(featuresContent, featuresFooter);
					featuresContent.addEventListener(
						'animationend',
						function changeContent() {
							displayFeatures(
								'Extra Features',
								'Enjoy the extra features of Outset',
								`${require('../images/svgs/calendar.svg')}`,
								`${require('../images/svgs/clock.svg')}`,
								`${require('../images/svgs/weather.svg')}`,
								'Calendar',
								'Timer',
								'Weather'
							);
							featuresContent.removeEventListener(
								'animationend',
								changeContent
							);
						}
					);
				}
				oldFeaturesIndex = featuresIndex;
				featuresIndex++;
				break;
		}
	})
);

// Tobe App

const tobeTitle = document.querySelector('.tobe-title');
const tobeNippleWrapper = document.querySelector('.tobe-nipple-wrapper');
const tobeProjectsContainer = document.querySelector('.tobe-app__projects');
const tobeProjectsOptions = document.querySelector('.tobe-app__options');
const tobeListWrapper = document.querySelector('.tobe-app__list-wrapper');
const tobeProjectsList = document.querySelector('.tobe-app__projects__list');
const tobeProjectsNippleWrapper = document.querySelector(
	'.tobe-app__projects__nipple-wrapper'
);
const tobeProjectOptionsWrapper = document.querySelector(
	'.tobe-app__options__dropdown-wrapper'
);
const tobeInput = document.querySelector('.todoInput');
const tobeItemList = document.querySelector('.tobe-app__list');
const currentTobeProject = document.querySelector('.tobe-app__projects__name');
const addNewProjectBtn = document.querySelector(
	'.tobe-app__projects__list__add'
);
const inboxProjectCount = document.querySelector('.inboxCount');
const inboxProject = document.querySelector('.inboxProject');
const tobeProjectInput = document.querySelector('.todoProject');

const tobeApp = {
	tobeObject:
		localStorage.getItem('tobes') === null
			? {}
			: JSON.parse(localStorage.getItem('tobes')),
	lastTobeProject:
		localStorage.getItem('lastTobe') === null
			? ''
			: JSON.parse(localStorage.getItem('lastTobe')),
	newProject: false,
	projectIndex: 1,
	height: 0,
	todoItem: function (proj) {
		console.log(proj);

		tobeItemList.innerHTML = '';
		let todo;
		tobeApp.tobeObject[proj].forEach(tobe => {
			todo = `
            <li class="tobe-app__item">
                <input type="checkbox" class="tobe-app__item__checkbox">
                <span class="tobe-app__item__name">${tobe.name}</span>
                <div class="tobe-app__item__options">
                    <div class="tobe-app__item__ellipsis tobe-app__ellipsis-wrapper">
                        <i class="fas fa-ellipsis-h tobeAppOptions"></i>
                    </div>
                    <div class="tobe-app__dropdown-wrapper">
                        <ul class="tobe-app__dropdown">
                            <li class="tobe-app__dropdown__item editTobeItem">Edit</li>
                            <li class="tobe-app__dropdown__line"></li>
                            <li class="tobe-app__dropdown__line tobeLine"></li>
                            <li class="tobe-app__dropdown__item deleteTobeItem">Delete</li>
                        </ul>
                    </div>
                </div>
            </li>`;
			tobeItemList.insertAdjacentHTML('beforeend', todo);
		});

		tobeApp.height = tobeItemList.offsetHeight;

		const tobeLine = document.querySelectorAll('.tobeLine');
		const tobeDropdown = document.querySelectorAll('.tobe-app__dropdown');
		let tobeKeys = Object.keys(tobeApp.tobeObject);

		tobeDropdown.forEach((dropdown, i) => {
			tobeKeys.forEach(key => {
				let projectEdit = document.createElement('li');
				projectEdit.classList.add('tobe-app__dropdown__item', 'moveTobeItem');
				projectEdit.textContent = 'Move to ' + key.replace('z', '');
				dropdown.insertBefore(projectEdit, tobeLine[i]);
			});
		});

		const tobeItemOptions = document.querySelectorAll('.tobeAppOptions');
		const tobeItem = document.querySelectorAll('.tobe-app__item');
		let curr, prev;
		curr = prev = 0;
		tobeItemOptions.forEach((item, i) =>
			item.addEventListener('click', e => {
				prev = curr;
				if (item.contains(e.target)) {
					curr = i;
					item.classList.toggle('open');
					tobeItem[curr].classList.toggle('highlight');
					item.parentElement.nextElementSibling.classList.toggle('display');
					if (curr != prev) {
						tobeItemOptions[
							prev
						].parentElement.nextElementSibling.classList.remove('display');
						tobeItem[prev].classList.remove('highlight');
					}
				}
			})
		);
		const tobeItemDropdown = document.querySelectorAll(
			'.tobe-app__dropdown-wrapper'
		);
		const nodes = Array.prototype.slice.call(tobeItemList.children);
		tobeItemDropdown.forEach((dropdown, i) =>
			dropdown.addEventListener('click', e => {
				let selectedTobeItem =
					e.target.parentElement.parentElement.parentElement.parentElement;
				let selectedText =
					e.target.parentElement.parentElement.parentElement
						.previousElementSibling;
				dropdown.classList.remove('display');
				if (e.target.classList.contains('deleteTobeItem')) {
					tobeApp.tobeObject[proj].splice(nodes.indexOf(selectedTobeItem), 1);
					nodes.splice(nodes.indexOf(selectedTobeItem), 1);
					selectedTobeItem.remove();
					tobeApp.updateProjectCount(proj);
					localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
				} else if (e.target.classList.contains('editTobeItem')) {
					selectedText.contentEditable = 'true';
					placeCaretAtEnd(selectedText);
					selectedText.addEventListener('keypress', e => {
						if (e.keyCode === 13) {
							selectedText.contentEditable = 'false';
							if (selectedText.textContent === '') {
								selectedText.textContent = tobeApp.tobeObject[proj][i].name;
							} else {
								tobeApp.tobeObject[proj][i].name = selectedText.textContent;
								localStorage.setItem(
									'tobes',
									JSON.stringify(tobeApp.tobeObject)
								);
							}
						}
					});
				} else if (e.target.classList.contains('moveTobeItem')) {
					let projectSelect = e.target.textContent.replace('Move to ', 'z');
					tobeApp.tobeObject[projectSelect].push(
						tobeApp.tobeObject[proj].splice(
							nodes.indexOf(selectedTobeItem),
							1
						)[0]
					);
					nodes.splice(nodes.indexOf(selectedTobeItem), 1);
					localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
					selectedTobeItem.remove();
					tobeApp.updateProjectCount(projectSelect);
					tobeApp.updateProjectCount(proj);
				}
			})
		);
	},

	openTobeApp: function () {
		tobeNippleWrapper.classList.toggle('share-open');
		tobeInput.focus();
	},

	updateProjectCount: function (project) {
		const projectItem = document.querySelectorAll(
			'.tobe-app__projects__list__item'
		);
		const projectCount = document.querySelectorAll(
			'.tobe-app__projects__list__count'
		);

		console.log(project);

		projectItem.forEach((item, i) => {
			if (project.replace('z', '') == item.childNodes[0].nodeValue) {
				projectCount[i].textContent = tobeApp.tobeObject[project].length;
			}
		});
	},

	addTobeItem: function (e) {
		let projectName = 'z' + currentTobeProject.textContent;

		if (e.keyCode === 13 && e.target.value !== '') {
			if (tobeApp.tobeObject[projectName] === undefined) {
				tobeApp.tobeObject[projectName] = [];
				tobeApp.tobeObject[projectName].push({
					name: e.target.value,
					completed: false
				});
			} else {
				tobeApp.tobeObject[projectName].push({
					name: e.target.value,
					completed: false
				});
			}
			tobeInput.value = '';
			localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
			tobeApp.todoItem(projectName);
			tobeApp.updateTobeItem();
			tobeApp.updateProjectCount(projectName);
			tobeListWrapper.scrollTop = tobeListWrapper.scrollHeight;
		} else if (e.keyCode === 13 && e.target.value === '') {
			tobeInput.classList.add('warning');
			tobeInput.focus();
			tobeInput.addEventListener('animationend', function () {
				tobeInput.classList.remove('warning');
			});
			tobeListWrapper.scrollTop = tobeListWrapper.scrollHeight;
		}
	},

	changeTobeProject: function (e) {
		const projectItem = document.querySelectorAll(
			'.tobe-app__projects__list__item'
		);

		if (tobeListWrapper.offsetHeight > 400) {
			tobeListWrapper.style.overflowX = 'hidden';
			tobeListWrapper.style.overflowY = 'auto';
		}

		if (addNewProjectBtn.contains(e.target)) {
			tobeApp.newProject = true;
			tobeProjectsOptions.style.display = 'none';
			tobeItemList.innerHTML = '';
			tobeInput.style.display = 'none';
			tobeProjectInput.style.display = 'block';
			currentTobeProject.textContent = '';
			tobeProjectInput.value = '';
			tobeProjectInput.focus();
		} else if (e.target.classList.contains('tobe-app__projects__list__item')) {
			if (e.target.classList.contains('inboxProject'))
				tobeProjectsOptions.style.display = 'none';
			else tobeProjectsOptions.style.display = 'block';
			tobeProjectInput.value = '';
			currentTobeProject.textContent = e.target.childNodes[0].nodeValue;
			tobeInput.style.display = 'block';
			tobeProjectInput.style.display = 'none';
			projectItem.forEach(item => {
				item.classList.remove('tobe-app__projects__list__item--active');
				e.target.classList.add('tobe-app__projects__list__item--active');
			});
			tobeApp.lastTobeProject = 'z' + e.target.childNodes[0].nodeValue;
			localStorage.setItem('lastTobe', JSON.stringify(tobeApp.lastTobeProject));
			tobeInput.focus();
			tobeApp.todoItem(tobeApp.lastTobeProject);
			tobeApp.updateTobeItem();
		}
	},

	addNewProject: function (e) {
		const projectItem = document.querySelectorAll(
			'.tobe-app__projects__list__item'
		);

		let value = 'z' + e.target.value;

		currentTobeProject.textContent = value.replace('z', '');

		const projectLi = document.createElement('li');
		projectLi.classList.add('tobe-app__projects__list__item');

		const projectCount = document.createElement('span');
		projectCount.classList.add('tobe-app__projects__list__count');

		if (e.keyCode === 13 && e.target.value !== '') {
			let projectIndex = Object.keys(tobeApp.tobeObject).indexOf(value);
			if (projectIndex >= 0) {
				if (value === 'zInbox') tobeProjectsOptions.style.display = 'none';
				else tobeProjectsOptions.style.display = 'block';
				tobeProjectInput.value = '';
				currentTobeProject.textContent = value.replace('z', '');
				tobeInput.style.display = 'block';
				tobeProjectInput.style.display = 'none';
				projectItem.forEach(item => {
					item.classList.remove('tobe-app__projects__list__item--active');
					projectItem[projectIndex].classList.add(
						'tobe-app__projects__list__item--active'
					);
				});
				tobeApp.lastTobeProject = value;
				localStorage.setItem(
					'lastTobe',
					JSON.stringify(tobeApp.lastTobeProject)
				);
				tobeInput.focus();
				tobeApp.updateTobeItem();
				tobeApp.todoItem(tobeApp.lastTobeProject);
			} else if (projectIndex < 0) {
				tobeProjectInput.style.display = 'none';
				tobeInput.style.display = 'block';
				tobeInput.focus();
				tobeApp.lastTobeProject = value;
				//Object.assign(tobeApp.tobeObject, { [value]: []})
				tobeApp.tobeObject[value] = [];
				projectLi.textContent = value.replace('z', '');
				projectCount.textContent = tobeApp.tobeObject[value].length;
				projectLi.appendChild(projectCount);
				tobeProjectsList.insertBefore(projectLi, addNewProjectBtn);
				projectItem.forEach(item => {
					item.classList.remove('tobe-app__projects__list__item--active');
				});
				projectLi.classList.add('tobe-app__projects__list__item--active');
				localStorage.setItem(
					'lastTobe',
					JSON.stringify(tobeApp.lastTobeProject)
				);
				localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
				tobeProjectInput.value = '';
				tobeProjectsOptions.style.display = 'block';
				console.log(tobeApp.tobeObject);
				console.log(tobeApp.lastTobeProject);
			}
		}
	},

	updateTobeItem: function () {
		const tobeCheckbox = document.querySelectorAll('.tobe-app__item__checkbox');
		tobeCheckbox.forEach((box, i) =>
			box.addEventListener('click', e => {
				if (e.target.checked)
					tobeApp.tobeObject['z' + currentTobeProject.textContent][
						i
					].completed = true;
				else
					tobeApp.tobeObject['z' + currentTobeProject.textContent][
						i
					].completed = false;
				localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
			})
		);

		tobeApp.tobeObject['z' + currentTobeProject.textContent].forEach(
			(tobe, i) => {
				if (tobe.completed) tobeCheckbox[i].checked = true;
			}
		);
	},

	projectCta: function (e) {
		const projectItem = document.querySelectorAll(
			'.tobe-app__projects__list__item'
		);

		Object.keys(tobeApp.tobeObject).forEach((proj, i) => {
			console.log(proj);
			if (proj === 'z' + currentTobeProject.textContent) {
				tobeApp.projectIndex = i;
			}
		});

		if (e.target.classList.contains('editProject')) {
			currentTobeProject.contentEditable = 'true';
			placeCaretAtEnd(currentTobeProject);
			currentTobeProject.addEventListener('keypress', e => {
				if (e.keyCode === 13) {
					let projectCheck = Object.keys(tobeApp.tobeObject).indexOf(
						'z' + e.target.textContent
					);
					currentTobeProject.contentEditable = 'false';
					if (
						currentTobeProject.textContent === '' ||
						tobeApp.lastTobeProject === 'z' + currentTobeProject.textContent
					) {
						currentTobeProject.textContent = tobeApp.lastTobeProject.replace(
							'z',
							''
						);
					} else if (projectCheck >= 0) {
						if (e.target.textContent === 'Inbox')
							tobeProjectsOptions.style.display = 'none';
						else tobeProjectsOptions.style.display = 'block';

						currentTobeProject.textContent = e.target.textContent;
						projectItem.forEach(item => {
							item.classList.remove('tobe-app__projects__list__item--active');
							projectItem[projectCheck].classList.add(
								'tobe-app__projects__list__item--active'
							);
						});
						tobeApp.lastTobeProject = 'z' + currentTobeProject.textContent;
						localStorage.setItem(
							'lastTobe',
							JSON.stringify(tobeApp.lastTobeProject)
						);
						tobeInput.focus();
						tobeApp.todoItem(tobeApp.lastTobeProject);
						tobeApp.updateTobeItem();
					} else if (projectCheck < 0) {
						console.log(tobeApp.projectIndex);
						console.log(projectCheck);
						tobeApp.tobeObject['z' + currentTobeProject.textContent] =
							tobeApp.tobeObject[tobeApp.lastTobeProject];
						projectItem[tobeApp.projectIndex].childNodes[0].textContent =
							currentTobeProject.textContent;
						delete tobeApp.tobeObject[tobeApp.lastTobeProject];
						tobeApp.lastTobeProject = 'z' + currentTobeProject.textContent;
						tobeInput.focus();
						localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
						localStorage.setItem(
							'lastTobe',
							JSON.stringify(tobeApp.lastTobeProject)
						);
					}
				}
			});
		} else if (e.target.classList.contains('deleteProject')) {
			delete tobeApp.tobeObject['z' + currentTobeProject.textContent];
			projectItem[tobeApp.projectIndex].remove();
			tobeProjectsOptions.style.display = 'none';
			currentTobeProject.textContent = 'Inbox';
			projectItem.forEach(item => {
				item.classList.remove('tobe-app__projects__list__item--active');
				inboxProject.classList.add('tobe-app__projects__list__item--active');
			});
			tobeApp.lastTobeProject = 'zInbox';
			localStorage.setItem('lastTobe', JSON.stringify(tobeApp.lastTobeProject));
			localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));

			tobeInput.focus();
			tobeApp.todoItem(tobeApp.lastTobeProject);
			tobeApp.updateTobeItem();
		}
	},

	loadTobeApp: function () {
		if (!tobeApp.tobeObject[tobeApp.lastTobeProject]) {
			tobeApp.tobeObject.zInbox = [];
			tobeApp.lastTobeProject = 'zInbox';
			currentTobeProject.textContent = tobeApp.lastTobeProject.replace('z', '');
			localStorage.setItem('lastTobe', JSON.stringify(tobeApp.lastTobeProject));
			inboxProject.classList.add('tobe-app__projects__list__item--active');
		} else {
			Object.keys(tobeApp.tobeObject).forEach(project => {
				if (project == 'zInbox') {
					inboxProjectCount.textContent = tobeApp.tobeObject[project].length;
				} else {
					tobeProjectsOptions.style.display = 'block';

					const projectLi = document.createElement('li');
					projectLi.classList.add('tobe-app__projects__list__item');
					projectLi.textContent = project.replace('z', '');

					if (project == tobeApp.lastTobeProject)
						projectLi.classList.add('tobe-app__projects__list__item--active');

					const projectCount = document.createElement('span');
					projectCount.classList.add('tobe-app__projects__list__count');
					projectCount.textContent = tobeApp.tobeObject[project].length;

					projectLi.appendChild(projectCount);
					tobeProjectsList.insertBefore(projectLi, addNewProjectBtn);
				}
			});

			currentTobeProject.textContent = tobeApp.lastTobeProject.replace('z', '');

			if (tobeApp.lastTobeProject == 'zInbox') {
				tobeProjectsOptions.style.display = 'none';
				inboxProject.classList.add('tobe-app__projects__list__item--active');
			}
			tobeApp.todoItem(tobeApp.lastTobeProject);
			tobeApp.updateTobeItem();
		}
	}
};

function placeCaretAtEnd(el) {
	el.focus();
	if (
		typeof window.getSelection != 'undefined' &&
		typeof document.createRange != 'undefined'
	) {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != 'undefined') {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}

new Sortable(tobeItemList, {
	animation: 150,
	onUpdate: function (e) {
		function array_move(arr, old_index, new_index) {
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
			return arr;
		}

		array_move(
			tobeApp.tobeObject['z' + currentTobeProject.textContent],
			e.oldIndex,
			e.newIndex
		);

		localStorage.setItem('tobes', JSON.stringify(tobeApp.tobeObject));
	}
});

document.addEventListener('DOMContentLoaded', tobeApp.loadTobeApp);
tobeTitle.addEventListener('click', tobeApp.openTobeApp);
tobeInput.addEventListener('keypress', tobeApp.addTobeItem);
tobeProjectsList.addEventListener('click', tobeApp.changeTobeProject);
tobeProjectInput.addEventListener('keyup', tobeApp.addNewProject);
tobeProjectOptionsWrapper.addEventListener('click', tobeApp.projectCta);
