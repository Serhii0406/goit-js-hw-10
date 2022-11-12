import './css/styles.css';

import fetchCountries from './fetchCountries';

import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(event) {

  const search = event.target.value.trim();

  if (!search) {
    refs.countriesList.innerHTML = "";
    refs.countryInfo.innerHTML = "";
    return;
  }

  fetchCountries(search).then(getCountries);
};

function getCountries(array) {

  if (!array) {
    refs.countryInfo.innerHTML = "";
    refs.countriesList.innerHTML = "";
    return;
  }

  if (array.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (array.length > 1 && array.length < 10) {
    createListOfCountries(array);
    return;
  }

  createCountry(array[0]);
};

function createCountry({
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
}) {
    const allLanguages = Object.values(languages).join(',');

    const markup =
    `<img alt="flag ${official}" src="${svg}" class="country-img"></img>
    <h2 class="country-name">${official}</h2>
    <p class="country-text"><b>Столиця: </b>${capital}</p>
    <p class="country-text"><b>Населення: </b>${population}</p>
    <p class="country-text"><b>Мова: </b>${allLanguages}</p>`

    refs.countryInfo.innerHTML = markup;
    refs.countriesList.innerHTML = "";
};

function createListOfCountries(countries) {

    const markup = countries
        
        .map(({ name: { official }, flags: { svg }}) => {
            return `<li class="country-list-item">
        <img class="country-list-item__img" alt="flag ${official}" src="${svg}"></img>
        <p class="country-list-item__name">${official}</p>
        </li>`;
        }).join("");
    
    refs.countriesList.innerHTML = markup;
    refs.countryInfo.innerHTML = "";
}