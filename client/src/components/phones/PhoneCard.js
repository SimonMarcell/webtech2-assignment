import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import EuroIcon from '@material-ui/icons/Euro';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import ListItemText from "@material-ui/core/ListItemText";
import {blue} from "@material-ui/core/colors";
import HeightIcon from '@material-ui/icons/Height';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 2,
        textAlign: 'center',
        minWidth: "300px",
        maxWidth: "300px"
    },
    content: {
        height: 140,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    expandText: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px'
    },
    restaurant: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    displaySizeIcon: {
        transform: 'rotate(45deg)',
    },
    smartMealIcon: {
        marginTop: '40px',
        width: '70px',
        height: '70px'
    }
}));

export default function MealCard(props) {
    const {meal, restaurantsAvailableIn, index} = props;

    const [wrapEnabled, setWrapEnabled] = React.useState(true);

    const fetchRestaurantsMealAvailableIn = async () => {
        const fetchRestaurantsMealAvailableIn = await fetch(
            `http://localhost:8080/listRestaurantsContainingMeal/${meal._id}`
        );
        const restaurantsAvailableIn = await fetchRestaurantsMealAvailableIn.json();
        const restaurants = await restaurantsAvailableIn;
        props.getRestaurantMealAvailableIn(restaurants, index);
        return restaurantsAvailableIn;
    };

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = async () => {
        if (!expanded) {
            await fetchRestaurantsMealAvailableIn();
        }
        setExpanded(!expanded);
        setWrapEnabled(!wrapEnabled);
    };

    const handleAddMealButtonClick = async () => {
        const fetch = await fetchRestaurantsMealAvailableIn();
        const restaurants = await fetch;
        props.handleAddMealButtonClick(index, restaurants);
    };

    const handleUpdateMealButtonClick = () => {
        props.handleUpdateMealButtonClick(index)
    };

    const handleDeleteMealButtonClick = async () => {
        await fetchRestaurantsMealAvailableIn();
        props.handleDeleteMealButtonClick(index)
    };

    return meal === undefined ? null : (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.content}>
                    <FastfoodIcon className={classes.smartMealIcon}/>
                </div>
                <Typography gutterBottom variant="h5" component="h2" noWrap={wrapEnabled}>
                    {meal.manufacturer} {meal.model}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Add Meal to Restaurant">
                    <IconButton aria-label="delete" onClick={handleAddMealButtonClick}>
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Modify Meal">
                    <IconButton aria-label="edit" onClick={handleUpdateMealButtonClick}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Meal">
                    <IconButton aria-label="delete" onClick={handleDeleteMealButtonClick}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography className={classes.expandText}>
                        <EuroIcon/> {meal.price}
                    </Typography>
                    <Typography className={classes.expandText} style={{marginTop: 10}}>
                        <HeightIcon className={classes.displaySizeIcon}/> {meal.displaySize}" {meal.displayType}
                    </Typography>
                    <div>
                        {restaurantsAvailableIn !== undefined && restaurantsAvailableIn.length > 0 &&
                        <div>
                            <Typography className={classes.expandText} style={{marginTop: 20}}>
                                Available in the following restaurants:
                            </Typography>
                            <List>
                                <br/>
                                {
                                    restaurantsAvailableIn.map((restaurant) => (
                                        <ListItem key={restaurant._id}>
                                            <ListItemAvatar>
                                                <Avatar className={classes.restaurant}>
                                                    <RestaurantIcon/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={restaurant.name}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </div>
                        }
                    </div>
                </CardContent>
            </Collapse>
        </Card>
    );
}
