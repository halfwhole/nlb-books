import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import Index from './components/Index';
import Records from './components/Records';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar/>
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route path="/records" component={Records}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
