import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";
import PropTypes from "prop-types";
import RestaurantIcon from '@material-ui/icons/Restaurant';

const useStyles = makeStyles({
    restaurant: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export default function DeleteMealAlertDialog(props) {
    const classes = useStyles();
    const {onClose, meal, open} = props;

    const handleClose = (result) => {
        if (result === true) {
            onClose(true);
        } else {
            onClose(false);
        }
    };

    return meal === undefined ? null : (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>{"Are you sure you want to delete this meal?"}</DialogTitle>
                <DialogContent>
                    <div>
                        {meal.restaurantsMealAvailableIn !== undefined && meal.restaurantsMealAvailableIn.length === 0 &&
                        <DialogContentText>
                            It will be deleted from the database and will not be recoverable.
                        </DialogContentText>
                        }
                        {meal.restaurantsMealAvailableIn !== undefined && meal.restaurantsMealAvailableIn.length > 0 &&
                        <div>
                            <DialogContentText>
                                It will be deleted from the database and from the following restaurants as well:
                            </DialogContentText>
                            <List>
                                {meal.restaurantsMealAvailableIn.map((restaurant) => (
                                    <ListItem key={restaurant._id}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.restaurant}>
                                                <RestaurantIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={restaurant.name}/>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleClose(true)} color="secondary" variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

DeleteMealAlertDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
