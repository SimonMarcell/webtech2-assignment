import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import EuroIcon from "@material-ui/icons/Euro";
import InputAdornment from "@material-ui/core/InputAdornment";

export default function UpdatePhoneDialog(props) {
    const {onClose, phone, open} = props;

    const [price, setPrice] = React.useState(0);

    const handleClose = () => {
        onClose();
        setPrice(0);
    };

    const handleSubmit = () => {
        if (price === 0) {
            onClose(phone.price);
        } else {
            onClose(price);
        }
        setPrice(0);
    };

    const onChangePrice = (event) => {
        const {value} = event.target;

        if (value.match('.')) {
            if (value > 0) {
                setPrice(value);
            } else {
                setPrice(-1);
            }
        } else {
            setPrice(-2);
        }

        return null;
    };

    return phone === undefined ? null : (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>Modify Phone</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can modify the phone's price.
                    </DialogContentText>
                    <DialogContentText>
                        Other values can not be modified because<br/>those are immutable.
                    </DialogContentText>
                    <List>
                        <ListItem>
                            <TextField disabled fullWidth variant="outlined" label="Manufacturer"
                                       defaultValue={phone.manufacturer}/>
                        </ListItem>
                        <ListItem>
                            <TextField disabled fullWidth variant="outlined" label="Model"
                                       defaultValue={phone.model}/>
                        </ListItem>
                        <ListItem>
                            <TextField
                                error={price < 0}
                                helperText={price === -1 ? "Price must be greater than 0" : ""
                                || price === -2 ? "Price must digit-only" : ""}
                                type="number"
                                defaultValue={phone.price}
                                onChange={onChangePrice}
                                label="Price"
                                variant="filled"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EuroIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <TextField disabled fullWidth variant="outlined" label="Display Type"
                                       defaultValue={phone.displayType}/>
                        </ListItem>
                        <ListItem>
                            <TextField disabled fullWidth variant="outlined" label="Display Size"
                                       defaultValue={phone.displaySize}/>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={price === -1 || price === -2} color="secondary"
                            variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
