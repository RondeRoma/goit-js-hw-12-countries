import NewFetchCountries from '../js/fetch-countries.js'
import countries from '../templates/countries.hbs';
import list from '../templates/list.hbs';

import"@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import { error } from '@pnotify/core';
import debounce from 'lodash.debounce';

const newFetchCountries = new NewFetchCountries();

const refs = {
    containerForm: document.querySelector('.js-search-form'),
    listCountry: document.querySelector('.js-articles'),
}

refs.containerForm.addEventListener('input', debounce(onSearchCountry, 500));

function onSearchCountry(event) {
    event.preventDefault();
    clierListCountry();
    const searchCountry = event.target.value;
    if(!searchCountry) {
        return
    };

    newFetchCountries.fetchCountries(searchCountry).then(data => {
        if (data.length > 10) {
            error({
                text: "Too many matches found. Please enter a more specific query!"
            });
        } else if (data.length === 1) {
            listCountryMarkup(data, countries);
        } else if (data.length <= 10) {
            listCountryMarkup(data, list);
        } else if (data.status === 404) {
            error({
          text: "No country has been found. Please enter a more specific query!"
            });
        }
    })
        .catch(err => {
            error({
            text: "You must enter query parameters!",
            type: 'error',
      });
    });
}

function listCountryMarkup(countriesList, template) {
  const markup = countriesList.map(count => template(count)).join('');
  refs.listCountry.insertAdjacentHTML('afterbegin', markup)
};

function clierListCountry() {
    refs.listCountry.innerHTML = '';
};