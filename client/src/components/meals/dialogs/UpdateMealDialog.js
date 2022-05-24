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

export default function UpdateMealDialog(props) {
    const {onClose, meal, open} = props;

    const [calories, setCalories] = React.useState(0);

    const handleClose = () => {
        onClose();
        setCalories(0);
    };

    const handleSubmit = () => {
        if (calories === 0) {
            onClose(meal.calories);
        } else {
            onClose(calories);
        }
        setCalories(0);
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

        return null;
    };

    return meal === undefined ? null : (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>Modify Meal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can modify the meal's calorie value.
                    </DialogContentText>
                    <DialogContentText>
                        Other values can not be modified because<br/>those are immutable.
                    </DialogContentText>
                    <List>
                        <ListItem>
                            <TextField disabled fullWidth variant="outlined" label="Name"
                                       defaultValue={meal.name}/>
                        </ListItem>
                        <ListItem>
                            <TextField
                                error={calories < 0}
                                helperText={calories === -1 ? "Calories must be greater than 0" : ""
                                || calories === -2 ? "Calories must digit-only" : ""}
                                type="number"
                                defaultValue={meal.calories}
                                onChange={onChangeCalories}
                                label="Calories"
                                variant="filled"
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            kcal
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <TextField disabled fullWidth variant="outlined" label="Type"
                                       defaultValue={meal.type}/>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={calories === -1 || calories === -2} color="secondary"
                            variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
