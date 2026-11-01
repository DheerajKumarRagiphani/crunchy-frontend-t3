# ShopMart - Crunchy Code Task 3 (Full Track)

A responsive product catalogue built with semantic HTML, CSS and vanilla JavaScript. Product information is fetched dynamically from the public DummyJSON API.

## Project structure

```text
crunchy-frontend-t3-shopmart/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── docs/
    └── STATES.md
```

## Technologies

- HTML5
- CSS3 (Flexbox, Grid, custom properties and media queries)
- Vanilla JavaScript (ES6+)
- Fetch API and JSON
- localStorage
- Chrome Developer Tools

## API used

DummyJSON Products API:

https://dummyjson.com/products?limit=30

No API key is required. An internet connection is needed to load the products.

## Features implemented

1. Fetches product data from a public API.
2. Creates product cards dynamically using JavaScript DOM methods.
3. Handles loading, success, empty and error interface states.
4. Searches products by title, description or category.
5. Filters products by category.
6. Combines search, category and favourites filters without reloading the page.
7. Validates name, email and message fields on the client side.
8. Displays inline validation feedback instead of using `alert()`.
9. Saves favourite product IDs in `localStorage`.
10. Restores saved favourites after a page reload.
11. Uses `textContent` for API-provided text instead of inserting untrusted API data with `innerHTML`.

## Run the project locally

1. Extract the ZIP file.
2. Open the extracted project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension.
4. Confirm that the browser loads the product cards.
5. Keep an internet connection active because products come from the public API.

## How to test the four interface states

See `docs/STATES.md` for the screenshot evidence instructions.

- **Loading:** Open Chrome DevTools, select Network, choose Slow 3G, and reload.
- **Success:** Load the page normally and wait for the products to appear.
- **Empty:** Use a controlled empty API response during testing to verify the empty state.
- **Error:** Block the API request in DevTools or temporarily disconnect the internet and reload.

The screenshots must be captured from your own browser session and saved in the `docs` folder.

## Full-track submission checklist

- [ ] Product data is fetched from a public API.
- [ ] Product cards are rendered dynamically.
- [ ] Loading state is visible and tested with Slow 3G.
- [ ] Success state is visible.
- [ ] Empty state is tested.
- [ ] Error state is tested.
- [ ] Search works without a page reload.
- [ ] Category filtering works without a page reload.
- [ ] Form validation displays inline messages.
- [ ] Favourites are saved using localStorage.
- [ ] Favourites are restored after a reload.
- [ ] `docs/STATES.md` contains screenshots of all four states.
- [ ] Project is pushed to GitHub.
- [ ] Project is deployed and the live URL works.

## Submission

Create a repository named:

`crunchy-frontend-t3-<handle>`

Submit the GitHub repository URL and deployed live URL through the Crunchy Code Task 3 form.
