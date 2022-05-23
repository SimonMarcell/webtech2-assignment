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
import SmartphoneIcon from "@material-ui/icons/Smartphone";
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export default function ListPhonesFromStoreDialog(props) {
    const classes = useStyles();
    const {onClose, open, phones, store} = props;

    const handleClose = () => {
        onClose();
    };

    const handleRemovePhoneButtonClick = (phoneId, index) => {
        props.handleRemovePhoneButtonClick(phoneId, index);
    };

    return store === undefined ? null : store.availablePhones.length === 0 ? null : (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{store.name}</DialogTitle>
            <List>
                {phones.map((phone, index) => (
                    <ListItem key={phone._id} index={index}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <SmartphoneIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={phone.manufacturer} secondary={phone.model}/>
                        <Tooltip title="Remove Phone from Store">
                            <IconButton aria-label="edit"
                                        onClick={() => handleRemovePhoneButtonClick(phone._id, index)}>
                                <RemoveCircleOutlineIcon/>
                            </IconButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

ListPhonesFromStoreDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
