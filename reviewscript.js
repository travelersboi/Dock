document.addEventListener('DOMContentLoaded', () => {
  // Attach event listeners to helpful buttons
  function attachHelpfulButtonListeners() {
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    helpfulButtons.forEach(button => {
      button.removeEventListener('click', increaseCount); // Prevent duplicates
      button.addEventListener('click', increaseCount);
    });
  }

  // Increase helpful count
  function increaseCount(event) {
    const countSpan = event.target.nextElementSibling; // Assumes count follows button
    let currentCount = parseInt(countSpan.textContent) || 0;
    currentCount++;
    countSpan.textContent = currentCount;
  }

  // Form submission
  const form = document.getElementById('reviewForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const reviewUserName = document.getElementById('reviewUserName').value || 'Anonymous';
    const reviewTitle = document.getElementById('reviewTitleLabel').value;
    const reviewText = document.getElementById('review').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 'No rating';

    // Validation
    if (!reviewTitle || !reviewText) {
      alert('Please provide a product name and review.');
      return;
    }

    createReview(reviewUserName, reviewTitle, reviewText, rating);
  });

  // Create a new review
  function createReview(userName, title, text, rating) {
    const review = document.createElement('div');
    review.classList.add('review');

    // Review header
    const reviewHeader = document.createElement('div');
    reviewHeader.classList.add('review-header');
    reviewHeader.innerHTML = `<span class="review-user">${userName}</span> - <span class="review-date">${new Date().toLocaleDateString()}</span>`;

    // Review title
    const reviewTitle = document.createElement('h3');
    reviewTitle.textContent = title;

    // Review rating with stars
    const reviewRating = document.createElement('div');
    reviewRating.classList.add('review-rating');
    if (rating === 'No rating') {
      reviewRating.innerHTML = `<span>Rating: </span><span class="stars">No rating</span>`;
    } else {
      const starIcons = '<i class="fas fa-star"></i>'.repeat(parseInt(rating));
      reviewRating.innerHTML = `<span>Rating: </span><span class="stars">${starIcons}</span>`;
    }

    // Review text
    const reviewTextParagraph = document.createElement('p');
    reviewTextParagraph.classList.add('review-text');
    reviewTextParagraph.textContent = text;

    // Helpful button and count
    const helpfulButton = document.createElement('button');
    helpfulButton.classList.add('helpful-btn');
    helpfulButton.textContent = texts[languageSelector.value].helpful;

    const helpfulCount = document.createElement('span');
    helpfulCount.classList.add('helpful-count');
    helpfulCount.textContent = '0';

    const helpfulText = document.createElement('span');
    helpfulText.textContent = ' people found this helpful.';

    // Append elements
    review.appendChild(reviewHeader);
    review.appendChild(reviewTitle); // Added title
    review.appendChild(reviewRating);
    review.appendChild(reviewTextParagraph);
    review.appendChild(helpfulButton);
    review.appendChild(helpfulCount);
    review.appendChild(helpfulText);

    // Append to container (after the h2)
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.appendChild(review);

    // Re-attach helpful button listeners
    attachHelpfulButtonListeners();

    // Reset form
    form.reset();
  }

  // Language selector
  const languageSelector = document.getElementById('languageSelector');
  const texts = {
    en: {
      header: "Product Reviews",
      subheader: "Read what our customers think",
      submitReview: "Submit a Review",
      rating: "Rating: ",
      recentReviews: "Recent Reviews",
      helpful: "Helpful",
      privacyPolicy: "Privacy Policy"
    },
    es: {
      header: "Reseñas de productos",
      subheader: "Lee lo que piensan nuestros clientes",
      submitReview: "Enviar una reseña",
      rating: "Clasificación: ",
      recentReviews: "Reseñas recientes",
      helpful: "Útil",
      privacyPolicy: "Política de privacidad"
    },
    fr: {
      header: "Avis sur les produits",
      subheader: "Lisez ce que nos clients en pensent",
      submitReview: "Soumettre un avis",
      rating: "Évaluation : ",
      recentReviews: "Avis récents",
      helpful: "Utile",
      privacyPolicy: "Politique de confidentialité"
    }
  };

  languageSelector.addEventListener('change', function () {
    const lang = this.value;
    document.querySelector('header h1').textContent = texts[lang].header;
    document.querySelector('header p').textContent = texts[lang].subheader;
    document.getElementById('reviewFormTitle').textContent = texts[lang].submitReview;
    document.querySelector('#reviewsContainer h2').textContent = texts[lang].recentReviews;
    document.querySelectorAll('.helpful-btn').forEach(button => {
      button.textContent = texts[lang].helpful;
    });
    document.querySelector('a[href="privacy-policy.html"]').textContent = texts[lang].privacyPolicy;
  });

  // Theme selector
  const themeSelector = document.getElementById('colorTheme');
  themeSelector.addEventListener('change', function () {
    document.body.className = `${this.value}-theme`;
  });

  // Review sorting
  const reviewSorting = document.getElementById('sortReviews');
  reviewSorting.addEventListener('change', function () {
    sortReviews(this.value);
  });

  function sortReviews(sortBy) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviews = Array.from(reviewsContainer.querySelectorAll('.review'));

    reviews.sort((reviewA, reviewB) => {
      if (sortBy === 'date') {
        const dateA = new Date(reviewA.querySelector('.review-date').textContent);
        const dateB = new Date(reviewB.querySelector('.review-date').textContent);
        return dateB - dateA;
      } else if (sortBy === 'rating') {
        const ratingA = reviewA.querySelector('.stars').textContent.includes('No rating')
          ? -1
          : (reviewA.querySelector('.stars').querySelectorAll('i').length || parseInt(reviewA.querySelector('.stars').textContent) || -1);
        const ratingB = reviewB.querySelector('.stars').textContent.includes('No rating')
          ? -1
          : (reviewB.querySelector('.stars').querySelectorAll('i').length || parseInt(reviewB.querySelector('.stars').textContent) || -1);
        return ratingB - ratingA;
      }
      return 0;
    });

    // Reorder reviews, preserving the h2
    const h2 = reviewsContainer.querySelector('h2');
    reviewsContainer.innerHTML = '';
    reviewsContainer.appendChild(h2);
    reviews.forEach(review => reviewsContainer.appendChild(review));
  }

  // Initialize
  attachHelpfulButtonListeners();
});