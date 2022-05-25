import React from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import Card from "@material-ui/core/Card";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import CheckIcon from '@material-ui/icons/Check';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import green from "@material-ui/core/colors/green";
import SignIn from "./SignIn";

const useStyles = makeStyles({
    gridTitle: {
        textAlign: "center",
        marginTop: '20px',
        marginLeft: '50px',
        marginRight: '50px'
    },
    gridItem: {
        margin: '20px'
    },
    content: {
        height: 140,
    },
    card: {
        padding: 2,
        textAlign: 'center',
        width: "45vh"
    },
    cardIcon: {
        marginTop: '40px',
        width: '70px',
        height: '70px'
    },
    tick: {
        backgroundColor: green[100],
        color: green[600],
    },
});

export default function Home() {
    const classes = useStyles();

    return (
        <div id="home-root" style={{paddingTop: 50}}>
            <SignIn/>
            <Grid container direction="column" alignItems="center" justify="center">
                <Grid item>
                    <Typography gutterBottom variant="h6" className={classes.gridTitle}>
                        Made by: Marcell Simon (K9IVJV)
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}
