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
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";

const mealTypes = [
    {
        value: 'Main Dish',
        label: 'Main Dish',
    },
    {
        value: 'Side Dish',
        label: 'Side Dish',
    }
];

export default function AddNewMealDialog(props) {
    const {onClose, open} = props;

    const [name, setName] = React.useState();
    const [mealType, setMealType] = React.useState('Main Dish');
    const [calories, setCalories] = React.useState(0);

    const handleClose = () => {
        resetMealValues();
        onClose();
    };

    const handleSubmit = () => {
        const meal = {
            meal: {
                name: name,
                type: mealType,
                calories: Number(calories),
            }
        };
        resetMealValues();
        onClose(meal);
    };

    function resetMealValues() {
        setName(undefined);
        setCalories(0);
        setMealType('Main Dish');
    }


    const onNameChange = (event) => {
        const {value} = event.target;
        setName(value);
    };

    const onChangeCalories = (event) => {
        const {value} = event.target;

        if (value.match('.')) {
            if (value > 0) {
                setCalories(value);
            } else {
                setCalories(-1);
            }
        } else {
            setCalories(-2);
        }
    };

    const onMealTypeChange = (event) => {
        setMealType(event.target.value);
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
                                       helperText={name === '' ? 'Name must not be empty' : ''}
                                       error={name === ''}
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
                                error={calories < 0}
                                helperText={calories === -1 ? "Calories must be greater than 0" : ""
                                || calories === -2 ? "Calories must digit-only" : ""}
                                type="number"
                                onBlur={onChangeCalories}
                                onChange={onChangeCalories}
                                label="Calories"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            kcal
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
                                label="Meal Type"
                                value={mealType}
                                onChange={onMealTypeChange}
                                helperText="Select the desired meal type"
                                variant="outlined"
                                fullWidth
                            >
                                {mealTypes.map((option) => (
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
                        calories <= 0 ||
                        mealType === ''
                    } color="secondary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
