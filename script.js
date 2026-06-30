// Movie Database
const moviesDatabase = [
  {
    id: 1,
    title: "The Dark Knight",
    genre: "action",
    description: "When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests.",
    image: "https://via.placeholder.com/220x330?text=The+Dark+Knight",
    rating: 9.0,
    year: 2008,
    director: "Christopher Nolan",
    cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
    runtime: "152 min"
  },
  {
    id: 2,
    title: "Inception",
    genre: "scifi",
    description: "A skilled thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
    image: "https://via.placeholder.com/220x330?text=Inception",
    rating: 8.8,
    year: 2010,
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Marion Cotillard, Tom Hardy",
    runtime: "148 min"
  },
  {
    id: 3,
    title: "The Shawshank Redemption",
    genre: "drama",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    image: "https://via.placeholder.com/220x330?text=Shawshank+Redemption",
    rating: 9.3,
    year: 1994,
    director: "Frank Darabont",
    cast: "Tim Robbins, Morgan Freeman",
    runtime: "142 min"
  },
  {
    id: 4,
    title: "Forrest Gump",
    genre: "drama",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
    image: "https://via.placeholder.com/220x330?text=Forrest+Gump",
    rating: 8.8,
    year: 1994,
    director: "Robert Zemeckis",
    cast: "Tom Hanks, Sally Field, Gary Sinise",
    runtime: "142 min"
  },
  {
    id: 5,
    title: "Pulp Fiction",
    genre: "thriller",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    image: "https://via.placeholder.com/220x330?text=Pulp+Fiction",
    rating: 8.9,
    year: 1994,
    director: "Quentin Tarantino",
    cast: "John Travolta, Samuel L. Jackson, Uma Thurman",
    runtime: "154 min"
  },
  {
    id: 6,
    title: "The Godfather",
    genre: "drama",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.",
    image: "https://via.placeholder.com/220x330?text=The+Godfather",
    rating: 9.2,
    year: 1972,
    director: "Francis Ford Coppola",
    cast: "Marlon Brando, Al Pacino, James Caan",
    runtime: "175 min"
  },
  {
    id: 7,
    title: "The Matrix",
    genre: "scifi",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    image: "https://via.placeholder.com/220x330?text=The+Matrix",
    rating: 8.7,
    year: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    runtime: "136 min"
  },
  {
    id: 8,
    title: "Gladiator",
    genre: "action",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    image: "https://via.placeholder.com/220x330?text=Gladiator",
    rating: 8.5,
    year: 2000,
    director: "Ridley Scott",
    cast: "Russell Crowe, Joaquin Phoenix, Lucilla",
    runtime: "155 min"
  },
  {
    id: 9,
    title: "Deadpool",
    genre: "action",
    description: "A wisecracking mercenary gets experimented on and becomes immortal but disfigured. He then hunts down the man responsible.",
    image: "https://via.placeholder.com/220x330?text=Deadpool",
    rating: 8.0,
    year: 2016,
    director: "Tim Miller",
    cast: "Ryan Reynolds, Morena Baccarin, Ed Skrein",
    runtime: "108 min"
  },
  {
    id: 10,
    title: "The Hangover",
    genre: "comedy",
    description: "Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the bachelor missing.",
    image: "https://via.placeholder.com/220x330?text=The+Hangover",
    rating: 7.7,
    year: 2009,
    director: "Todd Phillips",
    cast: "Bradley Cooper, Ed Helms, Zach Galifianakis",
    runtime: "100 min"
  },
  {
    id: 11,
    title: "Superbad",
    genre: "comedy",
    description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
    image: "https://via.placeholder.com/220x330?text=Superbad",
    rating: 7.6,
    year: 2007,
    director: "Greg Mottola",
    cast: "Jonah Hill, Michael Cera, Christopher Mintz-Plasse",
    runtime: "113 min"
  },
  {
    id: 12,
    title: "Se7en",
    genre: "thriller",
    description: "Two detectives hunt a serial killer who uses the seven deadly sins as his motives.",
    image: "https://via.placeholder.com/220x330?text=Se7en",
    rating: 8.6,
    year: 1995,
    director: "David Fincher",
    cast: "Brad Pitt, Morgan Freeman, Kevin Spacey",
    runtime: "127 min"
  }
];

// State Management
let currentFilter = 'all';
let currentSearchTerm = '';

// DOM Elements
const moviesGrid = document.getElementById('moviesGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('movieModal');
const closeBtn = document.querySelector('.close');
const modalBody = document.getElementById('modalBody');

// Initialize
window.addEventListener('load', () => {
  alert('🎬 Welcome to Movie Hub!');
  renderMovies(moviesDatabase);
});

// Event Listeners
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.getAttribute('data-filter');
    currentSearchTerm = ''; // Reset search when filtering
    searchInput.value = '';
    updateActiveFilter(btn);
    filterAndRenderMovies();
  });
});

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Filter and Render Movies
function filterAndRenderMovies() {
  let filtered = moviesDatabase;

  // Apply genre filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(movie => movie.genre === currentFilter);
  }

  // Apply search filter
  if (currentSearchTerm) {
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      movie.description.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
  }

  if (filtered.length === 0) {
    moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 1.2rem; color: #999;">No movies found 😢</p>';
  } else {
    renderMovies(filtered);
  }
}

// Render Movies
function renderMovies(movies) {
  moviesGrid.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/220x330?text=${movie.title}';">
      <div class="card-content">
        <h2>${movie.title}</h2>
        <div class="genre">${movie.genre.toUpperCase()}</div>
        <p>${movie.description}</p>
        <div class="card-rating">
          <span class="rating">⭐ ${movie.rating}</span>
          <span class="year">${movie.year}</span>
        </div>
        <button class="btn" onclick="openModal(${movie.id})">▶ View Details</button>
        <a href="#" class="btn secondary">🎬 Watch Trailer</a>
      </div>
    `;
    moviesGrid.appendChild(card);
  });
}

// Update Active Filter Button
function updateActiveFilter(activeBtn) {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

// Perform Search
function performSearch() {
  currentSearchTerm = searchInput.value.trim();
  currentFilter = 'all'; // Reset filter
  filterButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');
  filterAndRenderMovies();
}

// Open Modal with Movie Details
function openModal(movieId) {
  const movie = moviesDatabase.find(m => m.id === movieId);
  if (!movie) return;

  modalBody.innerHTML = `
    <img src="${movie.image}" alt="${movie.title}" class="modal-movie-img" onerror="this.src='https://via.placeholder.com/300x450?text=${movie.title}';">
    <h2 class="modal-movie-title">${movie.title}</h2>
    <div class="modal-movie-info">
      <p><strong>Genre:</strong> ${movie.genre.toUpperCase()}</p>
      <p><strong>Year:</strong> ${movie.year}</p>
      <p><strong>Director:</strong> ${movie.director}</p>
      <p><strong>Cast:</strong> ${movie.cast}</p>
      <p><strong>Runtime:</strong> ${movie.runtime}</p>
      <p><strong>Rating:</strong> ⭐ ${movie.rating}/10</p>
    </div>
    <p style="line-height: 1.6; margin-bottom: 15px;">${movie.description}</p>
    <button class="btn" onclick="alert('Redirecting to trailer...')">▶ Watch Trailer</button>
    <button class="btn secondary" onclick="alert('Redirecting to OTT platform...')">🎬 Watch on OTT</button>
  `;
  modal.style.display = 'block';
}

// Close Modal
function closeModal() {
  modal.style.display = 'none';
}