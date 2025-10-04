// Get wishlist from localStorage
function getWishlist() {
    let wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}



// App Configuration
const API_CONFIG = {
    baseUrl: 'https://www.omdbapi.com/',
    apiKey: 'bb4a0903'  // Replace with actual API key
};



// App State
const appState = {
    currentPage: 1,
    currentQuery: '',
    currentYear: '',
    currentType: '',
    movies: [],
    watchlist: [],
    isLoading: false,
    hasMoreResults: false,
    totalResults: 0,
    currentAbortController: null
};

// Placeholder image for missing posters
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzMzMzMzMyIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBvc3RlcjwvdGV4dD4KICA8dGV4dCB4PSIxNTAiIHk9IjI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ob3QgQXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';

// Mock data for demo purposes (fallback when API fails)
const MOCK_MOVIES = {
    batman: [
        { Title: "The Dark Knight", Year: "2008", imdbID: "tt0468569", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg", imdbRating: "9.0" },
        { Title: "Batman Begins", Year: "2005", imdbID: "tt0372784", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg", imdbRating: "8.2" },
        { Title: "The Dark Knight Rises", Year: "2012", imdbID: "tt1345836", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_SX300.jpg", imdbRating: "8.4" },
        { Title: "Batman", Year: "1989", imdbID: "tt0096895", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTYwNjAyODIyMF5BMl5BanBnXkFtZTYwNDMwMDk2._V1_SX300.jpg", imdbRating: "7.5" }
    ],
    spider: [
        { Title: "Spider-Man", Year: "2002", imdbID: "tt0145487", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg", imdbRating: "7.4" },
        { Title: "Spider-Man 2", Year: "2004", imdbID: "tt0316654", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMzY2ODk4NmUtOTVmNi00ZTdkLTYzNDQtYzAzZWZlOTY1NDUzXkEyXkFqcGdeQXVyODY0NzcxNw@@._V1_SX300.jpg", imdbRating: "7.5" },
        { Title: "Spider-Man: No Way Home", Year: "2021", imdbID: "tt10872600", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg", imdbRating: "8.2" }
    ],
    action: [
        { Title: "Mad Max: Fury Road", Year: "2015", imdbID: "tt1392190", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg", imdbRating: "8.1" },
        { Title: "John Wick", Year: "2014", imdbID: "tt2911666", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_SX300.jpg", imdbRating: "7.4" },
        { Title: "Die Hard", Year: "1988", imdbID: "tt0095016", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZjRlNDUxZjAtOGQ4OC00OTNlLTgxNmQtYTBmNTUxZGQwYjkxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", imdbRating: "8.2" },
        { Title: "The Matrix", Year: "1999", imdbID: "tt0133093", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg", imdbRating: "8.7" }
    ],
    comedy: [
        { Title: "The Grand Budapest Hotel", Year: "2014", imdbID: "tt2278388", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_SX300.jpg", imdbRating: "8.1" },
        { Title: "Superbad", Year: "2007", imdbID: "tt0829482", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BYTVkMTVlYjUtYmVjYy00NzE5LTkzODgtMTJiZGVkOWJlOTFhXkEyXkFqcGdeQXVyNzYzODM3Mzg@._V1_SX300.jpg", imdbRating: "7.6" },
        { Title: "Anchorman", Year: "2004", imdbID: "tt0357413", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTQ2MzYwMzk5Ml5BMl5BanBnXkFtZTcwNTM1NDU2NQ@@._V1_SX300.jpg", imdbRating: "7.2" },
        { Title: "Dumb and Dumber", Year: "1994", imdbID: "tt0109686", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZDQwMjNiMTQtY2UwYy00NjhiLWIzZWItZGJhYTAyNDU3ZWFhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg", imdbRating: "7.3" }
    ],
    series: [
        { Title: "Breaking Bad", Year: "2008–2013", imdbID: "tt0903747", Type: "series", Poster: "https://m.media-amazon.com/images/M/MV5BMjhiMzgxZTctNDc1Ni00OTIxLTlhMTYtZTA3ZWFkODRkNmE2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", imdbRating: "9.5" },
        { Title: "Game of Thrones", Year: "2011–2019", imdbID: "tt0944947", Type: "series", Poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg", imdbRating: "9.3" },
        { Title: "Stranger Things", Year: "2016–2025", imdbID: "tt4574334", Type: "series", Poster: "https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTcyZGZjMDJhXkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_SX300.jpg", imdbRating: "8.7" },
        { Title: "The Office", Year: "2005–2013", imdbID: "tt0386676", Type: "series", Poster: "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg", imdbRating: "9.0" }
    ]
};

// DOM Elements
let elements = {};

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showElement(element) {
    if (element) element.classList.remove('hidden');
}

function hideElement(element) {
    if (element) element.classList.add('hidden');
}

// Mock search function for fallback
function searchMockMovies(query) {
    const lowerQuery = query.toLowerCase();
    let results = [];
    
    // Search through all mock data
    for (const [key, movies] of Object.entries(MOCK_MOVIES)) {
        if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
            results = [...results, ...movies];
        }
    }
    
    // Also search in movie titles
    if (results.length === 0) {
        for (const movies of Object.values(MOCK_MOVIES)) {
            for (const movie of movies) {
                if (movie.Title.toLowerCase().includes(lowerQuery)) {
                    results.push(movie);
                }
            }
        }
    }
    
    return results;
}

// API Functions
async function fetchMovies(query, page = 1, year = "", type = "") {
    // Cancel previous request if exists
    if (appState.currentAbortController) {
        appState.currentAbortController.abort();
    }

    // Create new AbortController
    appState.currentAbortController = new AbortController();

    try {
        const params = new URLSearchParams({
            apikey: API_CONFIG.apiKey,
            s: query,
            page: page.toString(),
            ...(year && { y: year }),
            ...(type && { type: type })
        });

        const response = await fetch(`${API_CONFIG.baseUrl}?${params}`, {
            signal: appState.currentAbortController.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === "True") {
            return {
                movies: data.Search,
                totalResults: parseInt(data.totalResults),
                hasMore: page * 10 < parseInt(data.totalResults)
            };
        } else {
            throw new Error(data.Error || "Movie not found");
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request cancelled');
            return null;
        }
        
        // Fallback to mock data
        console.warn('API failed, using mock data:', error.message);
        const mockResults = searchMockMovies(query);
        
        if (mockResults.length > 0) {
            const filteredResults = filterMockMovies(mockResults, year, type);
            const startIndex = (page - 1) * 10;
            const endIndex = startIndex + 10;
            const pageMovies = filteredResults.slice(startIndex, endIndex);
            
            return {
                movies: pageMovies,
                totalResults: filteredResults.length,
                hasMore: endIndex < filteredResults.length
            };
        }
        
        throw error;
    }
}

async function fetchMovieDetails(id) {
    try {
        const params = new URLSearchParams({
            apikey: API_CONFIG.apiKey,
            i: id,
            plot: "full"   // optional: fetch full plot
        });

        const response = await fetch(`${API_CONFIG.baseUrl}?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === "True") {
            return data;
        } else {
            throw new Error(data.Error || "Movie not found");
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
        throw error;
    }
}


function filterMockMovies(movies, year, type) {
    let filtered = [...movies];
    
    if (year) {
        filtered = filtered.filter(movie => movie.Year.includes(year));
    }
    
    if (type) {
        filtered = filtered.filter(movie => movie.Type === type);
    }
    
    return filtered;
}

// Rating Functions
function convertRatingToStars(imdbRating) {
    if (!imdbRating || imdbRating === 'N/A') {
        return { stars: 0, rating: 'N/A' };
    }
    
    const rating = parseFloat(imdbRating);
    const stars = Math.round(rating / 2);
    return { stars, rating: imdbRating };
}

function renderStars(starCount) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= starCount) {
            starsHtml += '<span class="star">★</span>';
        } else {
            starsHtml += '<span class="star empty">☆</span>';
        }
    }
    return starsHtml;
}

// Watchlist Functions
function loadWatchlist() {
    try {
        const savedWatchlist = localStorage.getItem('movieWatchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    } catch (error) {
        console.error('Error loading watchlist:', error);
        return [];
    }
}

function saveWatchlist() {
    try {
        localStorage.setItem('movieWatchlist', JSON.stringify(appState.watchlist));
        updateWatchlistCount();
    } catch (error) {
        console.error('Error saving watchlist:', error);
    }
}

function addToWatchlist(movie) {
    const exists = appState.watchlist.find(item => item.imdbID === movie.imdbID);
    if (!exists) {
        appState.watchlist.push(movie);
        saveWatchlist();
    }
}

function removeFromWatchlist(imdbID) {
    appState.watchlist = appState.watchlist.filter(movie => movie.imdbID !== imdbID);
    saveWatchlist();
}

function isInWatchlist(imdbID) {
    return appState.watchlist.some(movie => movie.imdbID === imdbID);
}

function updateWatchlistCount() {
    if (elements.watchlistCount) {
        elements.watchlistCount.textContent = appState.watchlist.length;
    }
}

// Movie Card Functions
function createMovieCard(movie, isRecommended = false) {
    const { stars, rating } = convertRatingToStars(movie.imdbRating);
    const isWatchlisted = isInWatchlist(movie.imdbID);
    
    return `
        <div class="movie-card" data-imdb-id="${movie.imdbID}">
            <div class="movie-poster">
                <img 
                    src="${movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER_IMAGE}" 
                    alt="${movie.Title} poster"
                    onerror="this.src='${PLACEHOLDER_IMAGE}'"
                >
                <button class="watchlist-btn ${isWatchlisted ? 'active' : ''}" 
                        data-imdb-id="${movie.imdbID}"
                        type="button">
                    ${isWatchlisted ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.Year}</span>
                    <span class="movie-type">${movie.Type}</span>
                </div>
                <div class="movie-rating">
                    <div class="stars">
                        ${renderStars(stars)}
                    </div>
                    <span class="rating-text">${rating}/10</span>
                </div>
            </div>
        </div>
    `;
}

function createSkeletonCard() {
    return `
        <div class="skeleton-card">
            <div class="skeleton-poster"></div>
            <div class="skeleton-info">
                <div class="skeleton-title"></div>
                <div class="skeleton-meta">
                    <div class="skeleton-year"></div>
                    <div class="skeleton-type"></div>
                </div>
                <div class="skeleton-rating"></div>
            </div>
        </div>
    `;
}

// Search Functions
async function performSearch(query, page = 1, append = false) {
    if (!query || query.length < 3) {
        if (elements.movieGrid) elements.movieGrid.innerHTML = '';
        hideElement(elements.movieGrid);
        hideElement(elements.loadMoreBtn);
        hideElement(elements.errorMessage);
        hideElement(elements.noResults);
        showElement(elements.recommendedSection);
        return;
    }

    
    // Hide recommended section when searching
    hideElement(elements.recommendedSection);
    
    if (!append) {
        // Show skeleton loaders
        const skeletons = Array(8).fill().map(() => createSkeletonCard()).join('');
        if (elements.movieGrid) {
            elements.movieGrid.innerHTML = skeletons;
            showElement(elements.movieGrid);
        }
    } else {
        // Show loading spinner on load more button
        if (elements.loadMoreSpinner) showElement(elements.loadMoreSpinner);
        if (elements.loadMoreText) hideElement(elements.loadMoreText);
        if (elements.loadMoreBtn) elements.loadMoreBtn.disabled = true;
    }
    
    hideElement(elements.errorMessage);
    hideElement(elements.noResults);
    
    try {
        appState.isLoading = true;
        const result = await fetchMovies(query, page, appState.currentYear, appState.currentType);
        
        if (!result) return; // Request was cancelled
        
        console.log('Search results:', result);
        
        if (result.movies && result.movies.length > 0) {
            if (page === 1) {
                appState.movies = result.movies;
            } else {
                appState.movies = [...appState.movies, ...result.movies];
            }
            
            appState.totalResults = result.totalResults;
            appState.hasMoreResults = result.hasMore;
            
            // Render movies
            const moviesHtml = appState.movies.map(movie => createMovieCard(movie)).join('');
            if (elements.movieGrid) {
                elements.movieGrid.innerHTML = moviesHtml;
                showElement(elements.movieGrid);
            }
            
            // Add event listeners for watchlist buttons
            setTimeout(() => addWatchlistEventListeners(), 100);
            
            if (appState.hasMoreResults) {
                showElement(elements.loadMoreBtn);
            } else {
                hideElement(elements.loadMoreBtn);
            }
        } else {
            hideElement(elements.movieGrid);
            hideElement(elements.loadMoreBtn);
            showElement(elements.noResults);
        }
    } catch (error) {
        console.error('Search error:', error);
        hideElement(elements.movieGrid);
        hideElement(elements.loadMoreBtn);
        showElement(elements.errorMessage);
        if (elements.errorText) {
            elements.errorText.textContent = error.message;
        }
    } finally {
        appState.isLoading = false;
        if (elements.loadMoreSpinner) hideElement(elements.loadMoreSpinner);
        if (elements.loadMoreText) showElement(elements.loadMoreText);
        if (elements.loadMoreBtn) elements.loadMoreBtn.disabled = false;
    }
}

async function loadRecommendedMovies() {
    const categories = [
        { id: 'actionMovies', query: 'action', movies: MOCK_MOVIES.action },
        { id: 'comedyMovies', query: 'comedy', movies: MOCK_MOVIES.comedy },
        { id: 'seriesMovies', query: 'series', movies: MOCK_MOVIES.series }
    ];

    for (const category of categories) {
        const container = document.getElementById(category.id);
        if (!container) continue;

        // Show skeleton loaders first
        container.innerHTML = Array(4).fill().map(() => createSkeletonCard()).join('');

        // Simulate loading delay
        setTimeout(() => {
            const movies = category.movies.slice(0, 4);
            const moviesHtml = movies.map(movie => createMovieCard(movie, true)).join('');
            container.innerHTML = moviesHtml;
            
            // Add event listeners for watchlist buttons
            setTimeout(() => addWatchlistEventListeners(), 100);
        }, 500);
    }
}

function addWatchlistEventListeners() {
    // Remove existing listeners first
    const watchlistBtns = document.querySelectorAll('.watchlist-btn');
    watchlistBtns.forEach(btn => {
        // Clone node to remove existing event listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new event listener
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const imdbID = this.getAttribute('data-imdb-id');
            console.log('Toggling watchlist for:', imdbID);
            toggleWatchlist(imdbID);
        });
    });
}

function toggleWatchlist(imdbID) {
    // Find movie in current movies or search in mock data
    let movie = appState.movies.find(m => m.imdbID === imdbID);
    
    if (!movie) {
        // Search in mock data
        for (const movies of Object.values(MOCK_MOVIES)) {
            movie = movies.find(m => m.imdbID === imdbID);
            if (movie) break;
        }
    }
    
    if (!movie) {
        // Search in watchlist
        movie = appState.watchlist.find(m => m.imdbID === imdbID);
    }
    
    if (!movie) {
        console.error('Movie not found:', imdbID);
        return;
    }
    
    console.log('Found movie:', movie.Title);
    
    if (isInWatchlist(imdbID)) {
        removeFromWatchlist(imdbID);
        console.log('Removed from watchlist');
    } else {
        addToWatchlist(movie);
        console.log('Added to watchlist');
    }
    
    // Update all buttons for this movie
    const buttons = document.querySelectorAll(`[data-imdb-id="${imdbID}"] .watchlist-btn`);
    buttons.forEach(button => {
        const isWatchlisted = isInWatchlist(imdbID);
        button.textContent = isWatchlisted ? '❤️' : '🤍';
        button.classList.toggle('active', isWatchlisted);
    });
    
    // Refresh watchlist page if currently viewing it
    if (elements.watchlistPage && elements.watchlistPage.classList.contains('active')) {
        renderWatchlistPage();
    }
}

// Navigation Functions
function showSearchPage() {
    showElement(elements.searchPage);
    hideElement(elements.watchlistPage);
    elements.homeBtn.classList.add('active');
    elements.watchlistBtn.classList.remove('active');
}

function showWatchlistPage() {
    hideElement(elements.searchPage);
    showElement(elements.watchlistPage);
    elements.watchlistBtn.classList.add('active');
    elements.homeBtn.classList.remove('active');
    renderWatchlistPage();
}

function renderWatchlistPage() {
    if (appState.watchlist.length === 0) {
        showElement(elements.emptyWatchlist);
        hideElement(elements.watchlistGrid);
    } else {
        hideElement(elements.emptyWatchlist);
        const watchlistHtml = appState.watchlist.map(movie => createMovieCard(movie)).join('');
        if (elements.watchlistGrid) {
            elements.watchlistGrid.innerHTML = watchlistHtml;
            showElement(elements.watchlistGrid);
        }
        // Add event listeners for watchlist buttons
        setTimeout(() => addWatchlistEventListeners(), 100);
    }
}

// Create debounced search function
const debouncedSearch = debounce((query) => {
    appState.currentQuery = query;
    appState.currentPage = 1;
    performSearch(query, 1);
}, 500);

// Initialize App
function initializeApp() {
    console.log('Initializing app...');
    
    // Get DOM elements
    elements = {
        searchInput: document.getElementById('searchInput'),
        yearFilter: document.getElementById('yearFilter'),
        typeFilter: document.getElementById('typeFilter'),
        clearFilters: document.getElementById('clearFilters'),
        movieGrid: document.getElementById('movieGrid'),
        loadMoreBtn: document.getElementById('loadMoreBtn'),
        loadMoreText: document.getElementById('loadMoreText'),
        loadMoreSpinner: document.getElementById('loadMoreSpinner'),
        errorMessage: document.getElementById('errorMessage'),
        noResults: document.getElementById('noResults'),
        errorText: document.getElementById('errorText'),
        retryBtn: document.getElementById('retryBtn'),
        homeBtn: document.getElementById('homeBtn'),
        watchlistBtn: document.getElementById('watchlistBtn'),
        watchlistCount: document.getElementById('watchlistCount'),
        searchPage: document.getElementById('searchPage'),
        watchlistPage: document.getElementById('watchlistPage'),
        watchlistGrid: document.getElementById('watchlistGrid'),
        emptyWatchlist: document.getElementById('emptyWatchlist'),
        backToSearchBtn: document.getElementById('backToSearchBtn'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        recommendedSection: document.getElementById('recommendedSection')
    };
    
    console.log('Elements found:', Object.keys(elements).filter(key => elements[key] !== null).length);
    
    // Load watchlist from localStorage
    appState.watchlist = loadWatchlist();
    updateWatchlistCount();
    
    // Show search page by default
    showSearchPage();
    
    // Hide initial containers
    hideElement(elements.movieGrid);
    hideElement(elements.loadMoreBtn);
    hideElement(elements.errorMessage);
    hideElement(elements.noResults);
    hideElement(elements.loadingOverlay);
    if (elements.loadMoreSpinner) hideElement(elements.loadMoreSpinner);
    
    // Load recommended movies
    loadRecommendedMovies();
    
    // Event Listeners
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            console.log('Search input:', query);
            debouncedSearch(query);
        });
        
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query.length >= 3) {
                    appState.currentQuery = query;
                    appState.currentPage = 1;
                    performSearch(query, 1);
                }
            }
        });
    }
    
    if (elements.yearFilter) {
        elements.yearFilter.addEventListener('input', (e) => {
            appState.currentYear = e.target.value;
            if (appState.currentQuery) {
                appState.currentPage = 1;
                performSearch(appState.currentQuery, 1);
            }
        });
    }
    
    if (elements.typeFilter) {
        elements.typeFilter.addEventListener('change', (e) => {
            appState.currentType = e.target.value;
            if (appState.currentQuery) {
                appState.currentPage = 1;
                performSearch(appState.currentQuery, 1);
            }
        });
    }
    
    if (elements.clearFilters) {
        elements.clearFilters.addEventListener('click', () => {
            if (elements.yearFilter) elements.yearFilter.value = '';
            if (elements.typeFilter) elements.typeFilter.value = '';
            appState.currentYear = '';
            appState.currentType = '';
            
            if (appState.currentQuery) {
                appState.currentPage = 1;
                performSearch(appState.currentQuery, 1);
            }
        });
    }
    
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', () => {
            if (!appState.isLoading && appState.hasMoreResults) {
                appState.currentPage++;
                performSearch(appState.currentQuery, appState.currentPage, true);
            }
        });
    }
    
    if (elements.retryBtn) {
        elements.retryBtn.addEventListener('click', () => {
            if (appState.currentQuery) {
                performSearch(appState.currentQuery, 1);
            } else {
                loadRecommendedMovies();
            }
        });
    }
    
    if (elements.homeBtn) {
        elements.homeBtn.addEventListener('click', showSearchPage);
    }
    
    if (elements.watchlistBtn) {
        elements.watchlistBtn.addEventListener('click', showWatchlistPage);
    }
    
    if (elements.backToSearchBtn) {
        elements.backToSearchBtn.addEventListener('click', showSearchPage);
    }
    
    // View All buttons for recommended categories
    setTimeout(() => {
        const viewAllBtns = document.querySelectorAll('.view-all-btn');
        viewAllBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                const type = btn.getAttribute('data-type');
                
                // Set search input and filters
                if (elements.searchInput) elements.searchInput.value = query;
                if (elements.typeFilter && type) elements.typeFilter.value = type;
                
                appState.currentQuery = query;
                appState.currentType = type || '';
                appState.currentPage = 1;
                
                performSearch(query, 1);
            });
        });
    }, 1000);
    
}

function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("movieWatchlist")) || [];
  const container = document.getElementById("wishlist");
  container.innerHTML = "";

  if (wishlist.length === 0) {
    container.innerHTML = "<p>No movies in wishlist yet.</p>";
    return;
  }

  wishlist.forEach(movie => {
    const poster = (movie.Poster && movie.Poster !== "N/A") 
      ? movie.Poster 
      : "https://via.placeholder.com/300x450?text=No+Image";

    const div = document.createElement("div");
    div.classList.add("movie-card");
    div.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="removeFromWishlist('${movie.imdbID}')">Remove</button>
    `;
    container.appendChild(div);
  });
}


function addToWishlist(movie) {
    let wishlist = getWishlist();

    // prevent duplicates
    if (!wishlist.some(item => item.imdbID === movie.imdbID)) {
        wishlist.push(movie);
        saveWishlist(wishlist);
        alert("Added to Wishlist!");
    } else {
        alert("Already in Wishlist!");
    }
}

function renderWishlist() {
    let wishlist = getWishlist();
    let wishlistContainer = document.getElementById("wishlist");
    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>No items in Wishlist</p>";
        return;
    }

    wishlist.forEach(movie => {
        let div = document.createElement("div");
        div.classList.add("wishlist-item");
        div.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" width="100">
            <h3>${movie.Title}</h3>
            <button onclick="removeFromWishlist('${movie.imdbID}')">Remove</button>
        `;
        wishlistContainer.appendChild(div);
    });
}

function removeFromWishlist(id) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(movie => movie.imdbID !== id);
    saveWishlist(wishlist);
    renderWishlist();
}


function removeFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("movieWatchlist")) || [];
  wishlist = wishlist.filter(movie => movie.imdbID !== id);
  localStorage.setItem("movieWatchlist", JSON.stringify(wishlist));
  loadWishlist();
}


// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

document.addEventListener("DOMContentLoaded", loadWishlist);
// Show wishlist on page load
document.addEventListener("DOMContentLoaded", renderWishlist);

