import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";

export default function DeleteStoreAlertDialog(props) {
    const {onClose, open} = props;

    const handleClose = (result) => {
        if (result === true) {
            onClose(true);
        } else {
            onClose(false);
        }
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>{"Are you sure you want to delete this store?"}</DialogTitle>
                <DialogContent>
                    <div>
                        <DialogContentText>
                            It will be deleted from the database and will not be recoverable.
                        </DialogContentText>
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

DeleteStoreAlertDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
