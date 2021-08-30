# React SPA Integration

Integrating Rokt into an SPA requires a bit more consideration when compared to standard multi page applications, this is because single page applications preserve the state between page transitions, operating more like native apps than traditional web sites.

In the case of an SPA, Rokt should be launched once as a singleton and the singleton interacted with when a placement is ready to be rendered. 

We can use React Context to hold a reference to our singleton then with React Hooks, we can obtain and interact with that singleton reference.

## React Context Wrapper

Here is an example of a context provider for Rokt

```jsx
import React, { createContext, useContext, useMemo } from 'react'

export const RoktContext = createContext()
export const RoktContextConsumer = RoktContext.Consumer

export function useRokt() {
  return useContext(RoktContext)
}

export function RoktContextProvider({ children, tagId, sandbox = false, windowRef = window }) {
  // A custom hook that will get the latest Rokt snippet integration
  // and return a Promise that will resolve after Rokt has initialized
  const roktLoaded = useMemo(() => {
    // This is an exploded form of the initialization tag 
    // found on the Rokt documentation website
    return new Promise((resolve) => {
      windowRef._ROKT_ = 'rokt'
      windowRef.rokt = {
        id: tagId,
        lc: [
          // Once loaded, don't select Rokt placements immediately
          rokt => rokt.init({
            skipInitialSelection: true,
            sandbox,
          }),
          // Resolve the Rokt instance
          rokt => resolve(rokt)
        ],
        it: new Date(),
      }
      // Create and load a script tag that contains the Rokt bootstrapper
      const target = windowRef.document.head || windowRef.document.body
      const script = windowRef.document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://apps.rokt.com/wsdk/integrations/snippet.js'
      script.crossOrigin = 'anonymous'
      script.async = true
      target.appendChild(script)
    })
  }, [tagId, sandbox])

  // Expose some public methods from the context for components to consume
  function setAttributes(attributes) {
    roktLoaded.then((rokt) => {
      rokt.setAttributes(attributes)
    })
  }

  function triggerPageChange(pageIdentifier) {
    roktLoaded.then((rokt) => {
      rokt.triggerPageChange({
        pageIdentifier,
      })
    })
  }

  function closeAll() {
    roktLoaded.then((rokt) => {
      rokt.closeAll()
    })
  }

  const roktWrapper = {
    setAttributes,
    triggerPageChange,
    closeAll,
  }

  // Return the context provider
  return <RoktContext.Provider 
    value={roktWrapper}>
    {children}
  </RoktContext.Provider>
}
```

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

On the page that needs to show the Rokt offer, use the Rokt singleton and tell it to trigger a Rokt selection:

```jsx
import React, { useEffect, useRef } from 'react'
import { useRokt } from '../context/rokt'
import { useUserDetails } from '../context/user-details'

// Imagine this is the component for the confirmation page route
export function ConfirmationPage() {
  // Obtain the user details from an internal location
  const userDetails = useUserDetails()
  // Obtain the Rokt singleton
  const rokt = useRokt()
  const placeholderRef = useRef(null)

  useEffect(() => {
    // Return if the target element hasn't rendered
    // Return if the attributes have not arrived
    if (!placeholderRef.current || !userDetails.email) {
      return
    }
    // Set your attributes with the relevant information
    rokt.setAttributes({ email: userDetails.email })
    // Indicate to Rokt that you'd like to begin the selection
    rokt.triggerPageChange('checkout.page')

    // When the page closes, remove all the Rokt placements
    return () => {
      rokt.closeAll()
    }
  }, [placeholderRef.current, rokt])

  return (
    <div>
      <h1>Confirmation Page</h1>
      <div
        ref={placeholderRef}
        id="rokt-placeholder"/>
    </div>
  )
}
```


### License
Please see [LICENSE](/LICENSE)
