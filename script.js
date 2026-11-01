// ShopMart - Crunchy Code Task 3
// Public API integration, four interface states, search, filtering and localStorage.

const API_URL = "https://dummyjson.com/products?limit=30";
const FAVORITES_STORAGE_KEY = "shopmart-favorites";

// DOM elements
const productGrid = document.querySelector("#product-grid");
const statusMessage = document.querySelector("#status-message");
const retryButton = document.querySelector("#retry-button");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const clearFiltersButton = document.querySelector("#clear-filters");
const favoritesToggle = document.querySelector("#favorites-toggle");
const favoriteCount = document.querySelector("#favorite-count");
const resultCount = document.querySelector("#result-count");
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

// Application state
let allProducts = [];
let showFavoritesOnly = false;
let favoriteProductIds = loadFavorites();

/**
 * Read favourite product IDs from localStorage.
 * Return an empty array if storage is unavailable or contains invalid data.
 */
function loadFavorites() {
    try {
        const savedFavorites = JSON.parse(
            localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]"
        );

        return Array.isArray(savedFavorites) ? savedFavorites : [];
    } catch (error) {
        console.warn("Could not read favourites from localStorage.", error);
        return [];
    }
}

/**
 * Save favourite product IDs and update the count in the header.
 */
function saveFavorites() {
    try {
        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(favoriteProductIds)
        );
    } catch (error) {
        console.warn("Could not save favourites to localStorage.", error);
    }

    favoriteCount.textContent = String(favoriteProductIds.length);
}

/**
 * Display one of the four interface states:
 * loading, success, empty or error.
 */
function showInterfaceState(state, message = "") {
    statusMessage.textContent = message;
    statusMessage.className = "status-message";

    if (state === "error") {
        statusMessage.classList.add("status-message--error");
    }

    if (state === "empty") {
        statusMessage.classList.add("status-message--empty");
    }

    statusMessage.classList.toggle("is-hidden", state === "success");
    retryButton.classList.toggle("is-hidden", state !== "error");
    productGrid.replaceChildren();
}

/**
 * Create a product card using safe DOM methods.
 * API text is assigned with textContent instead of untrusted innerHTML.
 */
function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageContainer = document.createElement("div");
    imageContainer.className = "product-card__image-container";

    const image = document.createElement("img");
    image.className = "product-card__image";
    image.src = product.thumbnail || "";
    image.alt = product.title
        ? `${product.title} product image`
        : "Product image";
    image.loading = "lazy";
    imageContainer.append(image);

    const content = document.createElement("div");
    content.className = "product-card__content";

    const category = document.createElement("p");
    category.className = "product-card__category";
    category.textContent = product.category || "Product";

    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.title || "Untitled product";

    const description = document.createElement("p");
    description.className = "product-card__description";
    description.textContent = product.description || "No description available.";

    const footer = document.createElement("div");
    footer.className = "product-card__footer";

    const price = document.createElement("span");
    price.className = "product-card__price";
    price.textContent = `$${Number(product.price || 0).toFixed(2)}`;

    const saveButton = document.createElement("button");
    saveButton.className = "save-button";
    saveButton.type = "button";
    saveButton.dataset.productId = String(product.id);

    const isFavorite = favoriteProductIds.includes(product.id);
    saveButton.setAttribute("aria-pressed", String(isFavorite));
    saveButton.textContent = isFavorite ? "♥ Saved" : "♡ Save";

    footer.append(price, saveButton);
    content.append(category, title, description, footer);
    card.append(imageContainer, content);

    return card;
}

/**
 * Return products matching the search, category and favourites filters.
 */
function getFilteredProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    return allProducts.filter((product) => {
        const searchableText = [
            product.title,
            product.description,
            product.category
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;
        const matchesFavorites =
            !showFavoritesOnly ||
            favoriteProductIds.includes(product.id);

        return matchesSearch && matchesCategory && matchesFavorites;
    });
}

/**
 * Render the products matching the current filters.
 */
function renderProducts() {
    const filteredProducts = getFilteredProducts();

    productGrid.replaceChildren();

    filteredProducts.forEach((product) => {
        productGrid.append(createProductCard(product));
    });

    const hasProducts = filteredProducts.length > 0;
    statusMessage.classList.toggle("is-hidden", hasProducts);

    if (!hasProducts) {
        statusMessage.textContent = allProducts.length === 0
            ? "No products are available right now."
            : "No products match your search or selected filters.";

        statusMessage.className = "status-message status-message--empty";
    }

    resultCount.textContent =
        `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`;

    favoriteCount.textContent = String(favoriteProductIds.length);
}

/**
 * Populate the category dropdown using categories from the API.
 */
function populateCategoryFilter() {
    const categories = [
        ...new Set(
            allProducts
                .map((product) => product.category)
                .filter(Boolean)
        )
    ].sort();

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All categories";
    categoryFilter.append(allOption);

    categories.forEach((categoryName) => {
        const option = document.createElement("option");
        option.value = categoryName;
        option.textContent = categoryName.replaceAll("-", " ");
        categoryFilter.append(option);
    });
}

/**
 * Fetch products from the public API and handle all four states.
 */
async function fetchProducts() {
    showInterfaceState("loading", "Loading products...");
    resultCount.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.products)) {
            throw new Error("The API response did not contain a products array.");
        }

        allProducts = data.products;
        populateCategoryFilter();

        if (allProducts.length === 0) {
            showInterfaceState("empty", "No products are available right now.");
            return;
        }

        showInterfaceState("success");
        renderProducts();
    } catch (error) {
        console.error("Unable to fetch ShopMart products:", error);

        showInterfaceState(
            "error",
            "We couldn't load products. Please check your internet connection and try again."
        );
    }
}

/**
 * Clear search, category and favourites filters.
 */
function clearAllFilters() {
    searchInput.value = "";
    categoryFilter.value = "all";
    showFavoritesOnly = false;

    favoritesToggle.setAttribute("aria-pressed", "false");
    favoritesToggle.querySelector("span").textContent = "♡";

    renderProducts();
}

/**
 * Add or remove a product from the favourites list.
 */
function toggleFavorite(productId) {
    if (favoriteProductIds.includes(productId)) {
        favoriteProductIds = favoriteProductIds.filter(
            (savedId) => savedId !== productId
        );
    } else {
        favoriteProductIds.push(productId);
    }

    saveFavorites();
    renderProducts();
}

// Client-side contact form validation.
// The form is validated locally and does not send data to a server.

const validationRules = {
    name(value) {
        return value.trim().length >= 2
            ? ""
            : "Please enter at least 2 characters.";
    },

    email(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(value.trim())
            ? ""
            : "Please enter a valid email address.";
    },

    message(value) {
        return value.trim().length >= 10
            ? ""
            : "Please enter at least 10 characters.";
    }
};

function handleContactFormSubmit(event) {
    event.preventDefault();
    formFeedback.textContent = "";

    let formIsValid = true;

    Object.entries(validationRules).forEach(([fieldName, validate]) => {
        const input = contactForm.elements[fieldName];
        const errorMessage = validate(input.value);
        const errorElement = document.querySelector(`#${fieldName}-error`);

        errorElement.textContent = errorMessage;
        input.setAttribute("aria-invalid", String(Boolean(errorMessage)));

        if (errorMessage) {
            formIsValid = false;
        }
    });

    if (formIsValid) {
        formFeedback.textContent =
            "Thanks! Your form passed validation. This demo does not send data to a server.";

        contactForm.reset();
    }
}

// Event listeners

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
clearFiltersButton.addEventListener("click", clearAllFilters);
retryButton.addEventListener("click", fetchProducts);

favoritesToggle.addEventListener("click", () => {
    showFavoritesOnly = !showFavoritesOnly;

    favoritesToggle.setAttribute(
        "aria-pressed",
        String(showFavoritesOnly)
    );

    favoritesToggle.querySelector("span").textContent =
        showFavoritesOnly ? "♥" : "♡";

    renderProducts();
});

productGrid.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-product-id]");

    if (!saveButton) {
        return;
    }

    const productId = Number(saveButton.dataset.productId);
    toggleFavorite(productId);
});

contactForm.addEventListener("submit", handleContactFormSubmit);

// Initial application setup

saveFavorites();
fetchProducts();
