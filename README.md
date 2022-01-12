# Outset

Outset is an all-in-one productivity tool and personal dashboard to use as a Google extension.

![Website Preview](https://user-images.githubusercontent.com/56409227/149133868-cd61b497-05e8-4b93-8c82-0b33d1e637d6.png)

### [View live website](https://outset-website.vercel.app/)

---

## Description

I developed Outset to recreate and improve some of my past projects e.g. todo list, weather app and quotes generator by placing them all in one website and include new [features](#features) alongside it. The minimalistic design and animations/transitions are intended to keep the user's focus to what is more important.

This app was built with the purpose of increasing my own productivity and others too. It has challenged me to grow in my Javascript skills by knowing more about event handling and event delegation, making and handling API calls, learning API documentation, OOP and much more.

Data is stored in local storage using objects as the data structure.

> App is not mobile-responsive as its created to be a Google Chrome extension.

---

### Features

- **Todo app** - create different projects and todo list items. Items can be transferred to other todo projects.
- **Intention** - set today's intention which resets everyday.
- **Weather app** - search a location and receive weather data on specified location.
- **Mantras** - receive today's mantra from the [MyMantra](https://github.com/patrickdaguio/mymantras-api) API created with [NodeJS](https://nodejs.org/en/)/[ExpressJS](https://expressjs.com/)
- **Quote generator** - share quotes to various social medias (Facebook, Twitter etc.) or users can build up their library of quotes by archiving them.
- **Links** - save link/s which opens on a new tab. Links are automatically validated using a Regex function.
- **Pomodoro app** - set time to do a specific task and to take a break from a task. Completed sessions will be saved on history. An alarm will go off when focus or break time is finished. Deep mode and repeat can be toggled so that sessions can flow without stopping.
- **Background generator** - connects to the [Unsplash](https://unsplash.com/developers) API to permanently change the background to a randomly selected image that is catered to the theme of the website. Users can also like and view the original photo and photographer from [Unsplash](https://unsplash.com/).

---

### Built with

| Technologies                                                         | APIs                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------- |
| HTML/CSS/JS (ES6+)                                                   | [OpenWeather](https://openweathermap.org/)                 |
| [SCSS](https://sass-lang.com/)                                       | [Unsplash](https://unsplash.com/developers)                |
| [SortableJS](https://github.com/SortableJS/Sortable)                 | [Quotes](https://type.fit/api/quotes)                      |
| [NodeJS](https://nodejs.org/en/)/[ExpressJS](https://expressjs.com/) | [MyMantra](https://github.com/patrickdaguio/mymantras-api) |
| [ParcelJS](https://parceljs.org/)                                    | [GoogleMaps](https://developers.google.com/maps)           |

---

### Roadmap

- Google sign-in and store data to a database so users can access their data on the app on different devices.
- Transition website into a Google Chrome extension.
- Add personalised calendar where users can save/edit/delete events which will provide reminders.
- Save and display weather information of multiple locations.

---

Thanks for checking out the project! 😁
