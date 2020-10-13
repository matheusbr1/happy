import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import OrphanetesMap from './pages/OrphanetesMap'

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Landing} />
                <Route path='/app' component={OrphanetesMap} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes