import React, {Component} from 'react';
import axios from "axios";
import MealCard from "./MealCard";
import Grid from "@material-ui/core/Grid";
import ResultSnackBar from "../shared/ResultSnackBar";
import AddMealToRestaurantDialog from "./dialogs/AddMealToRestaurantDialog";
import DeleteMealAlertDialog from "./dialogs/DeleteMealAlertDialog";
import UpdateMealDialog from "./dialogs/UpdateMealDialog";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import AddNewMealDialog from "./dialogs/AddNewMealDialog";
import Tooltip from "@material-ui/core/Tooltip";
import EmptyCollection from "../shared/EmptyCollection";
import Cookies from 'js-cookie'

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
};

class Meals extends Component {

    state = {
        meals: [],
        snackBarOpen: false,
        snackBarMessage: '',
        snackBarMessageSeverity: 'success',
        restaurants: [],
        addMealDialogOpen: false,
        mealIndexToInteractWith: 0,
        restaurantsToChooseFromToAddMeal: [],
        deleteMealDialogOpen: false,
        updateMealDialogOpen: false,
        addNewMealDialogOpen: false,
        responseArrived: false
    };

    componentDidMount() {
        this.loadMeals();
        this.loadRestaurants();
    }

    loadMeals = () => {
        axios.get(`listMeals`).then(res => {
                if (res.status === 200) {
                    this.setState({meals: res.data, responseArrived: true});
                }
            },
            error => {
                this.setState({responseArrived: true});
                console.log(error);
            });
    };

    loadRestaurants = () => {
        axios.get(`listRestaurants`).then(res => {
                if (res.status === 200) {
                    this.setState({restaurants: res.data});
                }
            },
            error => {
                console.log(error);
            });
    };

    handleDeleteMealButtonClick = (index) => {
        this.setState({
            deleteMealDialogOpen: true,
            mealIndexToInteractWith: index
        });
    };

    handleCloseDeleteMealDialog = (result) => {
        if (result) {
            let mealToInteractWith = this.state.meals[this.state.mealIndexToInteractWith];
            axios.delete(`deleteMeal`, {
                headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`},
                data: {"mealId": mealToInteractWith._id}
            }).then(res => {
                if (res.status === 200) {
                    this.setState({
                        meals: [...this.state.meals.filter(
                            meal => meal._id !== mealToInteractWith._id
                        )],
                        snackBarMessage: res.data.msg
                    });
                    if (mealToInteractWith.restaurantsMealAvailableIn.length > 0) {
                        this.deleteMealFromRestaurants(mealToInteractWith._id,
                            mealToInteractWith.restaurantsMealAvailableIn);
                    } else {
                        this.setState({
                            snackBarOpen: true,
                            snackBarMessageSeverity: 'success'
                        });
                    }
                }
            }).catch((err) => {
                this.setState({
                    snackBarOpen: true,
                    snackBarMessage: err.response.data.code + ' ' + err.response.data.message,
                    snackBarMessageSeverity: 'error'
                });
            });
        }
        this.setState({
            deleteMealDialogOpen: false
        });
    };

    deleteMealFromRestaurants = (mealId, restaurants) => {
        restaurants.map((restaurant) => (
            this.removeMealFromRestaurant(restaurant._id, mealId)
        ));
    };

    removeMealFromRestaurant = (restaurantId, mealId) => {
        axios.get(`removeMealFromRestaurant/${restaurantId}/${mealId}`,
            {headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}})
            .then(res => {
                if (res.status === 200) {
                    let additionalMessage = ` and from restaurant(${restaurantId}) `;
                    this.setState(prevState => ({
                        snackBarOpen: true,
                        snackBarMessage: prevState.snackBarMessage.concat(additionalMessage),
                        snackBarMessageSeverity: 'success'
                    }));
                }
            });
    };

    handleCloseSnackBar = () => {
        this.setState({
            snackBarOpen: false
        });
    };

    handleAddMealButtonClick = (index) => {
        let myArrayFiltered = this.state.restaurants.slice();
        const restaurantMealAlreadyIn = this.state.meals[index]
            .restaurantsMealAvailableIn.slice();

        for (let i = 0; i < myArrayFiltered.length; i++) {
            for (let j = 0; j < restaurantMealAlreadyIn.length; j++) {
                if (myArrayFiltered[i]._id === restaurantMealAlreadyIn[j]._id) {
                    myArrayFiltered.splice(i, 1)
                }
            }
        }

        if (myArrayFiltered.length === 0) {
            this.setState({
                snackBarOpen: true,
                snackBarMessage: 'Meal is currently present in all available restaurants',
                snackBarMessageSeverity: 'info'
            })
        } else {
            this.setState({
                addMealDialogOpen: true,
                mealIndexToInteractWith: index,
                restaurantsToChooseFromToAddMeal: myArrayFiltered
            });
        }
    };

    handleCloseAddMealDialog = (restaurantId, restaurantName) => {
        this.setState({
            addMealDialogOpen: false
        });

        if (restaurantId !== undefined && restaurantId !== '') {
            this.addMealToRestaurant(restaurantId, restaurantName);
        }
    };

    addMealToRestaurant = (restaurantId, restaurantName) => {
        let mealToInteractWith = this.state.meals[this.state.mealIndexToInteractWith];
        axios.post(`addMealToRestaurant`,
            {
                "mealId": mealToInteractWith._id,
                "restaurantId": restaurantId
            }, {headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}}
        ).then(res => {
            if (res.status === 200) {
                this.setState({
                    snackBarOpen: true,
                    snackBarMessage: res.data.msg,
                    snackBarMessageSeverity: 'success'
                });
                let meals = [...this.state.meals];
                let meal = {...meals[this.state.mealIndexToInteractWith]};

                meal.restaurantsMealAvailableIn.push({_id: restaurantId, name: restaurantName});

                this.setState({meals: meals});
            }
        }).catch((err) => {
            this.setState({
                snackBarOpen: true,
                snackBarMessage: err.response.data.code + ' ' + err.response.data.message,
                snackBarMessageSeverity: 'error'
            });
        });
    };

    getRestaurantMealAvailableIn = (restaurants, index) => {
        let meals = [...this.state.meals];
        let meal = {...meals[index]};

        meal.restaurantsMealAvailableIn = restaurants;
        meals[index] = meal;
        this.setState({meals});
    };

    handleUpdateMealButtonClick = (index) => {
        this.setState({
            mealIndexToInteractWith: index,
            updateMealDialogOpen: true
        });
    };

    handleCloseUpdateMealDialog = (calories) => {
        this.setState({
            updateMealDialogOpen: false
        });

        if (calories !== undefined) {
            let meals = [...this.state.meals];
            let meal = {...meals[this.state.mealIndexToInteractWith]};
            meal.calories = parseInt(calories);
            let mealToSend = {
                meal: {
                    "name": meal.name,
                    "type": meal.type,
                    "calories": meal.calories
                }
            };

            axios.put(`updateMeal/${meal._id}`, mealToSend,
                {
                    headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}
                }).then(res => {
                if (res.status === 200) {
                    this.state.meals[this.state.mealIndexToInteractWith] = meal;
                    this.setState({
                        snackBarOpen: true,
                        snackBarMessage: res.data.msg,
                        snackBarMessageSeverity: 'success'
                    });
                } else if (res.status === 202) {
                    this.setState({
                        snackBarOpen: true,
                        snackBarMessage: res.data.msg,
                        snackBarMessageSeverity: 'info'
                    });
                }
            }).catch((err) => {
                this.setState({
                    snackBarOpen: true,
                    snackBarMessage: err.response.data.code + ' ' + err.response.data.message,
                    snackBarMessageSeverity: 'error'
                });
            });
        }
    };

    handleOnAddMealFabClick = () => {
        this.setState({
            addNewMealDialogOpen: true
        });
    };

    handleCloseAddNewMealDialog = (meal) => {
        this.setState({
            addNewMealDialogOpen: false
        });

        if (meal !== undefined) {
            axios.post(`addMeal`, meal,
                {headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}})
                .then(res => {
                    if (res.status === 200) {
                        let meals = this.state.meals;
                        meals.push(res.data.meal);

                        this.setState({
                            snackBarOpen: true,
                            snackBarMessage: res.data.msg,
                            snackBarMessageSeverity: 'success'
                        });
                    }
                }).catch((err) => {
                this.setState({
                    snackBarOpen: true,
                    snackBarMessage: err.response.data.code + ' ' + err.response.data.message,
                    snackBarMessageSeverity: 'error'
                });
            });
        }
    }
    ;

    render() {
        return (
            <div id="meals-root">
                <Grid container justifyContent="space-evenly" alignItems="center">
                    {this.state.meals.map((meal, key) => (
                            <Grid item key={meal._id} style={{margin: 10}}>
                                <br/>
                                <MealCard meal={meal} index={key}
                                          handleAddMealButtonClick={this.handleAddMealButtonClick}
                                          getRestaurantMealAvailableIn={this.getRestaurantMealAvailableIn}
                                          handleDeleteMealButtonClick={this.handleDeleteMealButtonClick}
                                          handleUpdateMealButtonClick={this.handleUpdateMealButtonClick}
                                          restaurantsAvailableIn={this.state.meals[key].restaurantsMealAvailableIn}
                                />
                            </Grid>
                        )
                    )}
                </Grid>
                <div id="snackBarDiv">
                    <ResultSnackBar message={this.state.snackBarMessage} open={this.state.snackBarOpen}
                                    onClose={this.handleCloseSnackBar}
                                    severity={this.state.snackBarMessageSeverity}/>
                </div>
                <div id="addMealDialogDiv">
                    <AddMealToRestaurantDialog onClose={this.handleCloseAddMealDialog}
                                               open={this.state.addMealDialogOpen}
                                               restaurantsToChooseFrom={this.state.restaurantsToChooseFromToAddMeal}/>
                </div>
                <div id="deleteMealAlertDialogDiv">
                    <DeleteMealAlertDialog onClose={this.handleCloseDeleteMealDialog}
                                           open={this.state.deleteMealDialogOpen}
                                           meal={this.state.meals[this.state.mealIndexToInteractWith]}
                    />
                </div>
                <div id="updateMealAlertDialogDiv">
                    <UpdateMealDialog onClose={this.handleCloseUpdateMealDialog}
                                      open={this.state.updateMealDialogOpen}
                                      meal={this.state.meals[this.state.mealIndexToInteractWith]}
                    />
                </div>
                <div id="addNewMealDialogDiv">
                    <AddNewMealDialog onClose={this.handleCloseAddNewMealDialog}
                                      open={this.state.addNewMealDialogOpen}/>
                </div>
                <div id="addNewMealFabDiv">
                    <Tooltip title="Add New Meal">
                        <Fab color="secondary" aria-label="add" style={fabStyle}
                             onClick={this.handleOnAddMealFabClick}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </div>
                <div id="emptyCollection">
                    {this.state.meals.length === 0 ?
                        <EmptyCollection collectionName={"Meals"}
                                         responseArrived={this.state.responseArrived}/> : undefined}
                </div>
            </div>
        )
    }
}

export default Meals;
