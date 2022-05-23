import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {blue} from '@material-ui/core/colors';
import FastfoodIcon from "@material-ui/icons/Fastfood";
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export default function ListMealsFromRestaurantDialog(props) {
    const classes = useStyles();
    const {onClose, open, meals, restaurant} = props;

    const handleClose = () => {
        onClose();
    };

    const handleRemoveMealButtonClick = (mealId, index) => {
        props.handleRemoveMealButtonClick(mealId, index);
    };

    return restaurant === undefined ? null : restaurant.availableMeals.length === 0 ? null : (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{restaurant.name}</DialogTitle>
            <List>
                {meals.map((meal, index) => (
                    <ListItem key={meal._id} index={index}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <FastfoodIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={meal.manufacturer} secondary={meal.model}/>
                        <Tooltip title="Remove Meal from Restaurant">
                            <IconButton aria-label="edit"
                                        onClick={() => handleRemoveMealButtonClick(meal._id, index)}>
                                <RemoveCircleOutlineIcon/>
                            </IconButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

ListMealsFromRestaurantDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
