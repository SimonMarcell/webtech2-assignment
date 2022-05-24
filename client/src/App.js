import React from 'react';
import Restaurants from './components/restaurants/Restaurants'
import Home from './components/home/Home'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Meals from "./components/meals/Meals";
import Navigation from "./components/navigation/Navigation";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {CssBaseline} from "@material-ui/core";


function App() {

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: 'dark',
                    primary: {
                        // light: will be calculated from palette.primary.main,
                        main: '#78ec9d'
                        // dark: will be calculated from palette.primary.main,
                        // contrastText: will be calculated to contrast with palette.primary.main
                    },
                    secondary: {
                        // light: will be calculated from palette.secondary.main
                        main: '#78ec9d',
                        // dark: will be calculated from palette.secondary.main
                        contrastText: '#000000'
                    }
                }
            }), []);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <div className="App" style={{marginBottom: "100px"}}>
                    <Navigation tab/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/meals" component={Meals}/>
                        <Route exact path="/restaurants" component={Restaurants}/>
                        <Route exact path="*" render={() => (<Redirect to="/"/>)}/>
                    </Switch>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
