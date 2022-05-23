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
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const displayTypes = [
    {
        value: 'OLED',
        label: 'OLED',
    },
    {
        value: 'LCD',
        label: 'LCD',
    }
];

export default function AddNewMealDialog(props) {
    const {onClose, open} = props;

    const [manufacturer, setManufacturer] = React.useState();
    const [model, setModel] = React.useState();
    const [price, setPrice] = React.useState(0);
    const [displayType, setDisplayType] = React.useState('OLED');
    const [displaySize, setDisplaySize] = React.useState(5.8);

    const handleClose = () => {
        resetMealValues();
        onClose();
    };

    const handleSubmit = () => {
        const meal = {
            meal: {
                manufacturer: manufacturer,
                model: model,
                price: Number(price),
                displayType: displayType,
                displaySize: Number(displaySize)
            }
        };
        resetMealValues();
        onClose(meal);
    };

    function resetMealValues() {
        setManufacturer(undefined);
        setModel(undefined);
        setPrice(0);
        setDisplayType('OLED');
        setDisplaySize(5.8);
    }

    const onManufacturerChange = (event) => {
        const {value} = event.target;
        setManufacturer(value);
    };

    const onModelChange = (event) => {
        const {value} = event.target;
        setModel(value);
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
    };

    const onDisplayTypeChange = (event) => {
        setDisplayType(event.target.value);
    };

    const onDisplaySizeChange = (event) => {
        const {value} = event.target;

        if (value.match('.')) {
            if (value > 0) {
                setDisplaySize(value);
            } else {
                setDisplaySize(-1);
            }
        } else {
            setDisplaySize(-2);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>Add New Meal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can detail the new meal's attributes.
                    </DialogContentText>
                    <List>
                        <ListItem>
                            <TextField required
                                       autoComplete="off"
                                       error={manufacturer === ''}
                                       helperText={manufacturer === '' ? 'Manufacturer must not be empty' : ''}
                                       onBlur={onManufacturerChange}
                                       onChange={onManufacturerChange}
                                       label="Manufacturer"
                                       variant="outlined"
                                       fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField required
                                       autoComplete="off"
                                       helperText={model === '' ? 'Model must not be empty' : ''}
                                       error={model === ''}
                                       onBlur={onModelChange}
                                       onChange={onModelChange}
                                       label="Model"
                                       variant="outlined"
                                       fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                required
                                error={price < 0}
                                helperText={price === -1 ? "Price must be greater than 0" : ""
                                || price === -2 ? "Price must digit-only" : ""}
                                type="number"
                                onBlur={onChangePrice}
                                onChange={onChangePrice}
                                label="Price"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EuroIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                required
                                select
                                label="Display Type"
                                value={displayType}
                                onChange={onDisplayTypeChange}
                                helperText="Select the desired display type"
                                variant="outlined"
                                fullWidth
                            >
                                {displayTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </ListItem>
                        <ListItem>
                            <TextField required
                                       error={displaySize < 0}
                                       onBlur={onDisplaySizeChange}
                                       onChange={onDisplaySizeChange}
                                       defaultValue={displaySize}
                                       label="Display Size"
                                       helperText={displaySize === -1 ? "Display size must be greater than 0" : ""
                                       || displaySize === -2 ? "Display size must digit-only" : ""}
                                       type="number"
                                       inputProps={{
                                           step: 0.1
                                       }}
                                       variant="outlined"
                                       fullWidth
                            />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={
                        manufacturer === '' || manufacturer === undefined ||
                        model === '' || model === undefined ||
                        price <= 0 ||
                        displayType === '' ||
                        displaySize <= 0
                    } color="secondary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
