import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import SignIn from "./SignIn";
import ResultSnackBar from "../shared/ResultSnackBar";

class Home extends Component {

    state = {
        snackBarOpen: false,
        snackBarMessage: '',
        snackBarMessageSeverity: 'success',
    }

    handleOnSubmit = (message, severity) => {
        this.setState({
            snackBarOpen: true,
            snackBarMessage: message,
            snackBarMessageSeverity: severity
        });
    }

    handleCloseSnackBar = () => {
        this.setState({
            snackBarOpen: false
        });
    };

    render() {
        return (
            <div id="home-root" style={{paddingTop: 50}}>
                <SignIn onSubmit={this.handleOnSubmit}/>
                <Grid container direction="column" alignItems="center" justifyContent="center">
                    <Grid item>
                        <Typography gutterBottom variant="h6" style={{
                            textAlign: "center",
                            marginTop: '20px',
                            marginLeft: '50px',
                            marginRight: '50px'
                        }}>
                            Made by: Marcell Simon (K9IVJV)
                        </Typography>
                    </Grid>
                </Grid>
                <div id="snackBarDiv">
                    <ResultSnackBar message={this.state.snackBarMessage} open={this.state.snackBarOpen}
                                    onClose={this.handleCloseSnackBar} severity={this.state.snackBarMessageSeverity}/>
                </div>
            </div>
        );
    }
}

export default Home;