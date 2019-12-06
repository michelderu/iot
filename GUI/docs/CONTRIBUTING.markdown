# Contributing to Grove

A document about contributing to Grove in general is found at https://wiki.marklogic.com/display/SAL/Grove+Contributor+Starters+Guide.

## Contributing to the React Template Specifically

### An Initial Approach to Building a New Feature While Learning the Stack

(Whew! Too many words for a heading?)

Here are some suggested steps for learning the Treehouse stack while building a new feature. This is close to how I did it at first too. Now that I've done it a few times, I usually mix it up more, moving back and forth between React, Redux, and the backend to build up a new feature.
 
1. **Learn basic React concepts.** The [docs are really good](https://reactjs.org/docs/hello-world.html). In particular, I like the last section called ["Thinking in React"](https://reactjs.org/docs/thinking-in-react.html).

2. **Build a mock using React components.** And write at least smoke tests for those components. If you aren't satisfied with a static mock and want to add some dynamism at this step, you might find yourself reaching for React state. That's fine. Eventually, you'll refactor away from React state other than for true UI-only state (for example, 'isMyModalOpen'), and you'll be using Redux to hold your state. But let's not get ahead of ourselves.

    This stage is very useful for identifying which abstractions the front-end components actually need. Don't do work here! Assume that somehow, magically, the perfect information is coming in through the props in a convenient format. This will be useful information later, when you build your Redux interface and the API for backend calls. For this reason, I wouldn't worry about building API calls yet, though it is possible, because that could tempt you to start compromising and allowing backend abstractions to leak into your front-end components, crippling their reusability.

3. **Refactor your React code into "smart" containers and "dumb" components**, a very useful pattern. I've got a section on it in the ["Best Practices"](docs/BEST_PRACTICES.markdown) doc. This means your top-level 'dumb' component with rendering information should receive all of its state - including initial state - and functions as props. You'll know you've gotten there if you can rewrite your 'dumb' components as pure functions taking in props and returning JSX (this won't always be possible, though, particularly if you need to use lifecycle hooks, but you should get close).

    Create a 'smart' container responsible for rendering ONLY the top-level 'dumb' component and passing it the right state and callback props. This container will eventually be Redux-aware and will get its state and callback functions from Redux.

    If you haven't done it already, this would also be a good time to split large 'dumb' components into smaller ones.

4. **Learn Redux concepts.** The API for Redux is small, but it takes work to understand the core concepts. Like React, Redux has [great documentation](https://redux.js.org/). Definitely watch the [Egghead videos made by Redux's creator](https://egghead.io/series/getting-started-with-redux). (It's not always clear, but you do NOT need to subscribe to Egghead to watch.)

5. **Layer in Redux.** Redux is definitely more lines of code than what you've already got. I'm sure there are cases where it isn't worth it. But, there is an enormous benefit to clearly modeling your state and clearly defining an interface to update that state. No more searching for state changes scattered all over the place. You can even use DevTools to see exactly what actions are being fired and what state changes each caused. It also creates a layer that is not dependent on React and can be re-used in other front-end frameworks.

    See the Grove reference app's [index.js](ui/src/index.js) for an example of connecting a Redux store to your app. Note that the reducers actually get composed together in [appReducer.js](ui/src/appReducer.js).

    See the Grove reference app's [App.js](ui/src/App.js) for an example of importing selectors and actions and passing them to containers. Alternatively, you can do those imports in the containers themselves. I've used both approaches successfully.

        i.      NOTE that App.js uses the bindSelectors() function to bind the selector functions to their 'mountPoint' with the Redux store. This is a functional pattern I am still working to crystallize: It keeps selectors from knowing too much about their parents. Such knowledge is problematic for reuse (or multiple use within the same app). I've gotten to the point where I think I can turn bindSelectors into a utility function. You'll notice I use essentially the same function at each level of reducer composition inside my Redux modules.

        ii.      There is a similar need for actions, but I haven't yet identified a solution. The main need there is a way to namespace actionTypes, so the same Redux module can be mounted in several different places within a single application.

    Your smart container will use the 'mapStateToProps' and 'mapDispatchToProps' methods to hook up Redux. See the Grove reference app's [ui/src/containers/](ui/src/containers/) directory for examples.

    We have adopted the 'duck' modular approach (see ["Best Practices"](docs/BEST_PRACTICES.markdown) for details) to organize Redux code. See [grove-crud-redux](https://project.marklogic.com/repo/users/pmcelwee/repos/grove-crud-redux/browse) for a relatively simple example. Experimentation with other organization schemes is possible, but this has worked well, and I recommend just adopting it for now.

        i.      You should separate your Redux code into its own folder, so it can eventually be extracted as a dependency (so it can be reused with other front-end frameworks). Possibly, your redux module will fit inside an existing module, but that's probably unusual.

    The Redux docs and elsewhere has a lot of information about unit testing actions and reducers. I started doing that, but found it too brittle and tied to the shape of the state object, discouraging refactoring. I find that I often want to refactor the state shape, and also that its shape really should be an implementation detail hidden behind a public API of selectors and actions. I hit on 'integration' tests, which make assertions on selectors and call actions. See the files ending in 'integration.test.js' in [grove-crud-redux](https://project.marklogic.com/repo/users/pmcelwee/repos/grove-crud-redux/browse) and [grove-search-redux](https://project.marklogic.com/repo/projects/NACW/repos/grove-search-redux/browse) for examples.

    At some point, you've got to specify the contract for network calls to the backend. Our goal with this stack is to make this contract, which alternative server implementations will have to fulfill, match the front-end abstractions. At the end of the design, this API will be called in a special kind of Redux action called a 'thunk'. Best practice is to pull this out into an API object, which can be overridden by the consumer.

      NOTE: It would be good to establish a common pattern for default API object that can be overridden. I have done this a few times, and recently have begun to add an optionalArgument at the end of the action function signatures, where you can pass in `{ api: myApiWrapper }`, but formalizing / evaluting this is a TODO.

      We also want a common way to document the contract and provide a test suite for implementations. We are most likely to adopt the OpenAPI Initiative (formerly 'Swagger') as a standard. This is still a TODO.

### Things to Consider

**NOTE: This was written earlier than the section above, and needs review.**

TODO: Do these two sections complement each other?

When developing a new reusable feature for the Grove project (that is, one destined to become part of the framework), there are basically 5 design layers. (These might be important considerations if you are developing something app-specific too, but that's up to you.)

1. UI (React components) and what they need in terms of pieces of information and functions to invoke - if using Redux, they will get the info from "selectors" and the functions will be "action creators" -> but Redux doesn't absolutely need to be used here, any functions / data will do.

    The core components will live inside the ml-treehouse-react project. Less-used components might go inside their own separate component libraries.

2. client-side state - will there be any? If so, how should you model it? The Redux docs will be important guides here. You'll also be crafting the selectors and actions that you'll expose to the UI above. I find it very useful to start by writing tests, asserting the results of selectors before and after calling actions. This can drive your modeling of a good state shape.

    If you are including client-side state, is this a logical extension to an existing Redux module, or will you create a new top-level module?

3. API object and API contract. The API object is a small abstraction to allow users to provide different API interfaces by providing different API objects - I usually build it up iteratively. For example, just 'post' uploaded docs inline in the action creator at first, later pull it out into an object like `{ uploadDoc: () => {...} }`. That will become your default API object, which knows how to call the default backend (probably an endpoint in the Node middle-tier). You then will add a mechanism for providing a different API implementation object.

    The shape of the results returned from the API object is the   first implementation of your API contract. Therefore, the API object is essentially an adapter and should perform any necessary conversions from backend response to the shape of   the API contract expected on the client.

4. Default backend implementation. Currently, this will usually be an endpoint in the default Node middle-tier, which itself calls out to MarkLogic. Other users could create implementations in, eg, a Java middle-tier, or as a MarkLogic REST extension, providing matching API objects as described above.

5. MarkLogic server code. Do you need a REST extension to support the backend implementation? So far, we have not created such extensions as part of the core offering. When we do, I imagine that we will leverage [mlpm](https://github.com/joemfb/mlpm), integrating it with ml-gradle to provision the MarkLogic server.

In addition to these considerations, there is of course the question of packaging. Which features belong together? Which should be in a separate library? Communication among contributors should help to shape such packaging decisions.
