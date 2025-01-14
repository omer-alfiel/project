// Fetch data from the travel_recommendation_api.json file
fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        console.log(data); // For debugging
        setupSearch(data);
    })
    .catch(error => console.error('Error fetching data:', error));

// Setup search and reset functionality
function setupSearch(data) {
    const searchButton = document.getElementById('search-btn');
    const resetButton = document.getElementById('reset-btn');
    const searchBar = document.getElementById('search-bar');
    const resultsDiv = document.getElementById('results');

    searchButton.addEventListener('click', () => {
        const query = searchBar.value.trim().toLowerCase();
        if (query) {
            const filteredResults = filterResults(data, query);
            displayResults(filteredResults);
            resultsDiv.scrollIntoView({ behavior: 'smooth' }); // Scroll to results area
        } else {
            resultsDiv.innerHTML = '<p>Please enter a search term.</p>';
        }
    });

    resetButton.addEventListener('click', () => {
        searchBar.value = '';
        resultsDiv.innerHTML = '';
    });
}

// Filter results based on the query
function filterResults(data, query) {
    const results = [];
    const keywords = ['beach', 'beaches', 'temple', 'temples', 'country', 'countries'];

    if (keywords.includes(query)) {
        if (query.includes('beach')) {
            results.push(...data.beaches.slice(0, 2));
        } else if (query.includes('temple')) {
            results.push(...data.temples.slice(0, 2));
        } else if (query.includes('country')) {
            data.countries.forEach(country => {
                results.push(...country.cities.slice(0, 2));
            });
        }
    } else {
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(query)) {
                results.push(...country.cities.slice(0, 2));
            } else {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        results.push(city);
                    }
                });
            }
        });

        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(query)) {
                results.push(temple);
            }
        });

        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(query)) {
                results.push(beach);
            }
        });
    }

    return results.slice(0, 2); // Ensure at least two recommendations are displayed
}

// Display results on the page
function displayResults(recommendations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (recommendations.length > 0) {
        recommendations.forEach(item => {
            resultsDiv.innerHTML += `
                <div>
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `;
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}
