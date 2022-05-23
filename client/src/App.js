import React from 'react';
import Stores from './components/stores/Stores'
import Home from './components/home/Home'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Phones from "./components/phones/Phones";
import Navigation from "./components/navigation/Navigation";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Fab from "@material-ui/core/Fab";
import {CssBaseline} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 'auto',
    bottom: 20,
    left: 20,
    position: 'fixed',
};

function App() {

    const [darkModeEnabled, setDarkModeEnable] = React.useState(true);

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: darkModeEnabled ? 'dark' : 'light',
                    primary: {
                        // light: will be calculated from palette.primary.main,
                        main: darkModeEnabled ? '#f2ec2e' : '#0066ff'
                        // dark: will be calculated from palette.primary.main,
                        // contrastText: will be calculated to contrast with palette.primary.main
                    },
                    secondary: {
                        // light: will be calculated from palette.secondary.main
                        main: darkModeEnabled ? '#f2ec2e' : '#f50057',
                        // dark: will be calculated from palette.secondary.main
                        contrastText: darkModeEnabled ? '#000000' : '#ffffff'
                    }
                }
            }), [darkModeEnabled]);


    const handleChangeDarkMode = () => {
        setDarkModeEnable(!darkModeEnabled)
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <div className="App" style={{marginBottom: "100px"}}>
                    <Navigation tab/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/phones" component={Phones}/>
                        <Route exact path="/stores" component={Stores}/>
                        <Route exact path="*" render={() => (<Redirect to="/"/>)}/>
                    </Switch>
                </div>
            </Router>
            <div id="handleChangeDarkModeDiv">
                <Tooltip title="Toggle Dark Mode On/Off">
                    <Fab aria-label="add" style={fabStyle} onClick={handleChangeDarkMode}>
                        <Brightness4Icon/>
                    </Fab>
                </Tooltip>
            </div>
        </ThemeProvider>
    );
}

export default App;
