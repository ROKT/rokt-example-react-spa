# React SPA Integration

Integrating Rokt into an SPA requires a bit more consideration when compared to standard multi page applications, this is because single page applications preserve the state between page transitions, operating more like native apps than traditional web sites.

In the case of an SPA, Rokt should be launched once as a singleton and the singleton interacted with when a placement is ready to be rendered. 

We can use React Context to hold a reference to our singleton then with React Hooks, we can obtain and interact with that singleton reference.

## React Context Wrapper

See [an example of a context provider for Rokt](./example/src/context/rokt.jsx) to see how Rokt functionality can be exposed in your application.

## Consuming Context

### Application Root

Wrap your `App` component in this context provider:

```jsx
ReactDOM.render(
  <RoktContextProvider
    tagId="YOUR_ROKT_TAG_ID"
    sandbox={true}>
    <App />
  </RoktContextProvider>
)
```
You have to set `sandbox` to `false` when deploying to production.

### On the Route

On the page that needs to show the Rokt offer, use the Rokt singleton and tell it to trigger a Rokt selection. See [an example implementation of a page triggering Rokt selection](./example/src/pages/confirmation-page.jsx)

### License
Please see [LICENSE](/LICENSE)
