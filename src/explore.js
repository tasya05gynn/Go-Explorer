const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
let allCountries = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

fetchCountries();

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all'); // API that used
        const countries = await response.json();
        allCountries = countries;
        displayCountries(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function displayCountries(countries) {
    productList.innerHTML = '';

    if (countries.length === 0) {
        productList.innerHTML = `<p>No countries found for this region.</p>`;
        return;
    }

    countries.forEach(country => {
        const {
            name, area, continents, region, subregion, capital, languages,
            population, timezones, flags, coatOfArms, maps, latlng
        } = country;

        const languageList = languages ? Object.values(languages).join(', ') : 'N/A';
        const capitalCity = capital ? capital.join(', ') : 'N/A';
        const location = latlng ? latlng.join(', ') : 'N/A';
        const coatOfArmsUrl = coatOfArms && coatOfArms.png ? coatOfArms.png : '';

        const countryItem = document.createElement('div');
        countryItem.className = 'country-item';
        
        // DISPLAY THE FETCHED API DATA
        countryItem.innerHTML = `
            <h2>${name.common}</h2>
            <p><strong>Area:</strong> ${area.toLocaleString()} km²</p>
            <p><strong>Continent:</strong> ${continents.join(', ')}</p>
            <p><strong>Region:</strong> ${region || 'N/A'}</p>
            <p><strong>Subregion:</strong> ${subregion || 'N/A'}</p>
            <p><strong>Capital City:</strong> ${capitalCity}</p>
            <p><strong>Language(s) Spoken:</strong> ${languageList}</p>
            <p><strong>Time Zone(s):</strong> ${timezones ? timezones.join(', ') : 'N/A'}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Location:</strong> ${location}</p>
            <button><a href="${maps.googleMaps}" target="_blank">View on Google Maps</a></button>
            <img src="${flags.png}" alt="Flag of ${name.common}" width="100"/>
            ${coatOfArmsUrl ? `<img src="${coatOfArmsUrl}" alt="Coat of Arms of ${name.common}" width="100"/>` : ''}
            <button onclick="addToWishlist('${name.common}')">Add to Wishlist</button>
        `;

        productList.appendChild(countryItem);
    });
}

// Add data to wishlist
function addToWishlist(countryName) {
    const country = allCountries.find(c => c.name.common === countryName);

    if (country && !wishlist.some(item => item.name === countryName)) {
        wishlist.push({
            name: country.name.common,
            area: country.area,
            continents: country.continents.join(', '),
            region: country.region,
            subregion: country.subregion || 'N/A',
            capital: country.capital ? country.capital.join(', ') : 'N/A',
            languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
            timezones: country.timezones ? country.timezones.join(', ') : 'N/A',
            population: country.population,
            location: country.latlng ? country.latlng.join(', ') : 'N/A',
            flag: country.flags.png,
            coatOfArms: country.coatOfArms && country.coatOfArms.png ? country.coatOfArms.png : '',
            maps: country.maps ? country.maps.googleMaps : '',
            toDo: []
        });

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        document.getElementById('message').style.display = 'block';
        setTimeout(() => { document.getElementById('message').style.display = 'none'; }, 2000);
    }
}

// Search bar function where user can search other places by regions
searchInput.addEventListener('input', filterCountriesByRegion);

function filterCountriesByRegion() {
    const region = searchInput.value.trim().toLowerCase();
    const filteredCountries = allCountries.filter(country =>
        country.region && country.region.toLowerCase().includes(region)
    );
    displayCountries(filteredCountries);
}
