import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'
import { HomePage } from './pages/home-page'
import { ConfirmationPage } from './pages/confirmation-page'
import { RoktContextProvider } from './context/rokt'

function App() {
  return (
    <RoktContextProvider
      tagId={env.ROKT_TAG_ID}
      sandbox={true}
    >
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/confirmation">
            Confirmation
          </Link>
        </nav>

        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/confirmation">
          <ConfirmationPage />
        </Route>
      </Router>
    </RoktContextProvider>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
)
