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
import StoreIcon from "@material-ui/icons/Store";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export default function AddPhoneToStoreDialog(props) {
    const classes = useStyles();
    const {onClose, open, storesToChooseFrom} = props;

    const handleClose = (storeId, storeName) => {
        // Considering that we got a small amount of stores to work with, handling the clicks on the items and closing
        // the dialog can be done the following way to reduce lines of code.
        // Although note, that when processing larger data separate handler should be used instead.
        if (storesToChooseFrom.some(store => store._id === storeId)) {
            onClose(storeId, storeName);
        } else {
            onClose(undefined, undefined);
        }
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle>Select store to add phone in</DialogTitle>
            <List>
                {storesToChooseFrom.map((store) => (
                    <ListItem button onClick={() => handleClose(store._id, store.name)} key={store._id}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <StoreIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={store.name}/>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

AddPhoneToStoreDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
