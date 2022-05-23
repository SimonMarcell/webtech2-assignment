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
import RestaurantIcon from "@material-ui/icons/Restaurant";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export default function AddMealToRestaurantDialog(props) {
    const classes = useStyles();
    const {onClose, open, restaurantsToChooseFrom} = props;

    const handleClose = (restaurantId, restaurantName) => {
        // Considering that we got a small amount of restaurants to work with, handling the clicks on the items and closing
        // the dialog can be done the following way to reduce lines of code.
        // Although note, that when processing larger data separate handler should be used instead.
        if (restaurantsToChooseFrom.some(restaurant => restaurant._id === restaurantId)) {
            onClose(restaurantId, restaurantName);
        } else {
            onClose(undefined, undefined);
        }
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle>Select restaurant to add meal in</DialogTitle>
            <List>
                {restaurantsToChooseFrom.map((restaurant) => (
                    <ListItem button onClick={() => handleClose(restaurant._id, restaurant.name)} key={restaurant._id}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <RestaurantIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={restaurant.name}/>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

AddMealToRestaurantDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
