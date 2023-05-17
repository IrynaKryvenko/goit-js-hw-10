import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('input#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function searchCountries() {
  const searchTerm = inputEl.value.trim();
  if (searchTerm === '') {
    clearResults();
    return;
  }

  fetchCountries(searchTerm)
    .then(displayResults)
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function clearResults() {
  countryListEl.innerHTML = '';
  countryInfoEl .innerHTML = '';
}

function displayResults(countries) {
  if (countries.length === 1) {
    displayCountryInfo(countries[0]);
  } else if (countries.length > 1 && countries.length < 11) {
    displayCountryList(countries);
  } else {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function displayCountryList(countries) {
  countryListEl.innerHTML = '';
  countryInfoEl .innerHTML = '';

  countries.forEach(country => {
    const { flags, name } = country;
    const countryItem = `
      <li style="display: flex; gap: 30px; margin-bottom: 20px; align-items: center">
        <img width="50px"  src="${flags.png}" alt="flag" />
        <p>${name.official}</p>
      </li>
    `;
    countryListEl.insertAdjacentHTML('beforeend', countryItem);
  });
}

function displayCountryInfo(country) {
  const { flags, name, capital, population, languages } = country;
  const langArray = Object.values(languages).join(', ');

  const countryInfo = `
    <div style="display: flex; gap: 30px; margin-bottom: 30px">
      <img width="100px" src="${flags.png}" alt="flag" />
      <h2>${name.official}</h2>
    </div>
    <ul>
      <li><strong>Capital:</strong> ${capital}</li>
      <li><strong>Population:</strong> ${population}</li>
      <li><strong>Languages:</strong> ${langArray}</li>
    </ul>
  `;
countryInfoEl .innerHTML = countryInfo;
}

inputEl.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));
