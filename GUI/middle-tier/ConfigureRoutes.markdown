Inside this directory, there is a `routes` directory. Open it up. Take a look at [`routes/index.js`](routes/index.js) (`index.js` is used by Node as the default file in any directory).

There is line that tells the Express router that any url starting with '/all' will be handled by [`routes/api/index.js`](routes/api/index.js):

    router.use('/api', require('./api'))

Notice and open the [`routes/api/index.js`](routes/api/index.js) file.

Notice the search route, which is created using the `defaultSearchRoute` factory function. There are also auth and CRUD routes installed out-of-the-box. You are free to add more or remove some if required for your project.

There are a number of configuration options for the default routes, which are documented in that file. You can read more about the default routes in the [grove-default-routes README](grove-default-routes/README.markdown).
