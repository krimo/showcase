# Getting Started

This project was bootstrapped with [Create React App](https://create-react-app.dev/docs/getting-started).
It uses [TailwindCSS](https://tailwindcss.com/docs/editor-setup) for styling, [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started) for state management.

Clone this repo and run `yarn install`, `yarn prepare` and then `yarn start`.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn generate GENERATOR_NAME`

Generates something, cf. `plopfile.js` for available generators.

-   `yarn generate component MyComponent` to generate a new component under `/src/components`.
-   `yarn generate view MyView` to generate a new view under `/src/views`.
-   `yarn generate viewChild MyView` follow the prompts to generate a new child view under `/src/views/MyView/`.
    -- Think of a view as a "page" and a viewChild as a "subpage"
