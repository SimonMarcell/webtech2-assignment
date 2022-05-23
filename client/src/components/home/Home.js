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
        <div id="home-root">
            <Grid container direction="column" alignItems="center" justify="center">
                <Grid item>
                    <Typography gutterBottom variant="h3" className={classes.gridTitle}>
                        Made by: Bence Simon (GJE8VX)
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography gutterBottom variant="h3" className={classes.gridItem}>
                        Functions:
                    </Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" alignItems="flex-start" justify="center">
                <Grid item style={{margin: 30}}>
                    <Card className={classes.card}>
                        <CardContent>
                            <div className={classes.content}>
                                <FastfoodIcon className={classes.cardIcon}/>
                            </div>
                            <Typography gutterBottom variant="h5" component="h2">
                                Meals
                            </Typography>
                            <List>
                                <br/>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="List Meals from database"/>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="List Restaurants for each Meal that is available in"/>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Add Meal to database"/>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Modify Meal in database"/>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Delete Meal from database"/>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Add Meal to Restaurant"/>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item style={{margin: 30}}>
                    <Card className={classes.card}>
                        <CardContent>
                            <div className={classes.content}>
                                <RestaurantIcon className={classes.cardIcon}/>
                            </div>
                            <Typography gutterBottom variant="h5" component="h2">
                                Restaurants
                            </Typography>
                            <List>
                                <br/>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="List Restaurants from database"/>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="List available Meals in each Restaurant"/>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={classes.tick}>
                                            <CheckIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Remove Meal from Restaurant"/>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
