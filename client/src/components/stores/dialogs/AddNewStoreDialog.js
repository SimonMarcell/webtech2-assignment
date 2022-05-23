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
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";

const ratings = [
    {
        value: 1,
        label: 1,
    },
    {
        value: 2,
        label: 2,
    },
    {
        value: 3,
        label: 3,
    },
    {
        value: 4,
        label: 4,
    },
    {
        value: 5,
        label: 5,
    },
];

export default function AddNewStoreDialog(props) {
    const {onClose, open} = props;

    const [name, setName] = React.useState();
    const [zipCode, setZipCode] = React.useState("1000");
    const [country, setCountry] = React.useState();
    const [town, setTown] = React.useState();
    const [address, setAddress] = React.useState();
    const [rating, setRating] = React.useState(3);

    const handleClose = () => {
        resetStoreValues();
        onClose();
    };

    const handleSubmit = () => {
        const store = {
            store: {
                name: name,
                location: {
                    zipCode: zipCode,
                    country: country,
                    town: town,
                    address: address
                },
                rating: rating,
                availablePhones: []
            }
        };
        resetStoreValues();
        onClose(store);
    };

    function resetStoreValues() {
        setName(undefined);
        setZipCode(undefined);
        setCountry(undefined);
        setTown(undefined);
        setAddress(undefined);
        setRating(3);
    }

    const onNameChange = (event) => {
        setName(event.target.value);
    };

    const onZipCodeChange = (event) => {
        setZipCode(event.target.value);
    };

    const onCountryChange = (event) => {
        setCountry(event.target.value);
    };

    const onTownChange = (event) => {
        setTown(event.target.value);
    };

    const onAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const onRatingChange = (event) => {
        setRating(event.target.value);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>Add New Store</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can detail the new store's attributes.
                    </DialogContentText>
                    <List>
                        <ListItem>
                            <TextField required
                                       autoComplete="off"
                                       error={name === ''}
                                       helperText={name === '' ? 'Name must not be empty' : ''}
                                       onBlur={onNameChange}
                                       onChange={onNameChange}
                                       label="Name"
                                       variant="outlined"
                                       fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                required
                                error={Number(zipCode) < 1000}
                                helperText={Number(zipCode) < 1000 ? 'ZipCode must be greater or equal than 1000' : ''}
                                onBlur={onZipCodeChange}
                                onChange={onZipCodeChange}
                                label="ZipCode"
                                variant="outlined"
                                fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField required
                                       autoComplete="off"
                                       error={country === ''}
                                       helperText={country === '' ? 'Country must not be empty' : ''}
                                       onBlur={onCountryChange}
                                       onChange={onCountryChange}
                                       label="Country"
                                       variant="outlined"
                                       fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField required
                                       autoComplete="off"
                                       error={town === ''}
                                       helperText={town === '' ? 'Town must not be empty' : ''}
                                       onBlur={onTownChange}
                                       onChange={onTownChange}
                                       label="Town"
                                       variant="outlined"
                                       fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField required
                                       autoComplete="off"
                                       error={address === ''}
                                       helperText={address === '' ? 'Address must not be empty' : ''}
                                       onBlur={onAddressChange}
                                       onChange={onAddressChange}
                                       label="Address"
                                       variant="outlined"
                                       fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                required
                                select
                                label="Rating"
                                value={rating}
                                onChange={onRatingChange}
                                helperText="Select the store's rating"
                                variant="outlined"
                                fullWidth
                            >
                                {ratings.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={
                        name === '' || name === undefined ||
                        zipCode < 1000 || zipCode > 9999 ||
                        country === '' || country === undefined ||
                        town === '' || town === undefined ||
                        address === '' || address === undefined
                    } color="secondary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AddNewStoreDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
