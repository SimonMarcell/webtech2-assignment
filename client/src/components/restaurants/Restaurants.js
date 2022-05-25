import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import RestaurantCard from "./RestaurantCard";
import ListMealsFromRestaurantDialog from "./dialogs/ListMealsFromRestaurantDialog";
import axios from "axios";
import ResultSnackBar from "../shared/ResultSnackBar";
import DeleteRestaurantAlertDialog from "./dialogs/DeleteRestaurantAlertDialog";
import AddNewRestaurantDialog from "./dialogs/AddNewRestaurantDialog";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import EmptyCollection from "../shared/EmptyCollection";

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
};

class Restaurants extends Component {

    state = {
        restaurants: [],
        snackBarOpen: false,
        snackBarMessage: '',
        snackBarMessageSeverity: 'success',
        restaurantIndexToInteractWith: 0,
        mealsFromRestaurant: [],
        listMealsFromRestaurantDialogOpen: false,
        deleteRestaurantDialogOpen: false,
        addNewRestaurantDialogOpen: false,
        responseArrived: false
    };

    componentDidMount() {
        this.loadRestaurants();
    }

    loadRestaurants = () => {
        axios.get(`http://localhost:8080/listRestaurants`).then(res => {
                if (res.status === 200) {
                    this.setState({restaurants: res.data, responseArrived: true});
                }
            },
            error => {
                this.setState({responseArrived: true});
                console.log(error);
            });
    };

    handleListMealsFromRestaurantButtonClick = (index) => {
        if (this.state.restaurants[index].availableMeals.length === 0) {
            this.setState({
                snackBarMessage: 'There are no meals available in this restaurant at the moment',
                snackBarOpen: true,
                snackBarMessageSeverity: 'info'
            });
        } else {
            this.setState({
                restaurantIndexToInteractWith: index,
                listMealsFromRestaurantDialogOpen: true
            });
        }
    };

    handleCloseListMealsFromRestaurantDialog = () => {
        this.setState({
            listMealsFromRestaurantDialogOpen: false
        })
    };

    fetchMealsFromRestaurant = (meals) => {
        this.setState({
            mealsFromRestaurant: meals
        });
    };

    handleRemoveMealButtonClick = (mealId, index) => {
        axios.get(`http://localhost:8080/removeMealFromRestaurant/` +
            `${this.state.restaurants[this.state.restaurantIndexToInteractWith]._id}/${mealId}`)
            .then(res => {
                if (res.status === 200) {
                    this.state.restaurants[this.state.restaurantIndexToInteractWith].availableMeals.splice(index, 1);
                    this.state.mealsFromRestaurant.splice(index, 1);

                    this.setState({
                        snackBarMessage: res.data.msg,
                        snackBarOpen: true,
                        snackBarMessageSeverity: 'success'
                    });
                } else {
                    this.setState({
                        snackBarMessage: res.data.msg,
                        snackBarOpen: true,
                        snackBarMessageSeverity: 'error'
                    })
                }
            });
    };

    handleCloseSnackBar = () => {
        this.setState({
            snackBarOpen: false
        });
    };

    // BEGIN: DELETE STORE

    handleDeleteRestaurantButtonClick = (index) => {
        this.setState({
            deleteRestaurantDialogOpen: true,
            restaurantIndexToInteractWith: index
        });
    };

    handleCloseDeleteRestaurantDialog = (result) => {
        if (result) {
            let restaurantToInteractWith = this.state.restaurants[this.state.restaurantIndexToInteractWith];
            axios.get(`http://localhost:8080/deleteRestaurant/${restaurantToInteractWith._id}`)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            restaurants: [...this.state.restaurants.filter(
                                restaurant => restaurant._id !== restaurantToInteractWith._id
                            )],
                            snackBarMessage: res.data.msg,
                            snackBarOpen: true,
                            snackBarMessageSeverity: 'success'
                        });
                    }
                });
        }
        this.setState({
            deleteRestaurantDialogOpen: false
        });
    }

    // END: DELETE STORE

    // BEGIN: ADD NEW STORE

    handleOnAddNewRestaurantFabClick = () => {
        this.setState({
            addNewRestaurantDialogOpen: true
        });
    };

    handleCloseAddNewRestaurantDialog = (restaurant) => {
        this.setState({
            addNewRestaurantDialogOpen: false
        });

        if (restaurant !== undefined) {
            axios.post(`http://localhost:8080/addRestaurant`, restaurant)
                .then(res => {
                    if (res.status === 200) {
                        let restaurants = this.state.restaurants;
                        restaurants.push(res.data.restaurant);

                        this.setState({
                            snackBarOpen: true,
                            snackBarMessage: res.data.msg,
                            snackBarMessageSeverity: 'success'
                        });
                    } else if (res.status === 202) {
                        this.setState({
                            snackBarOpen: true,
                            snackBarMessage: res.data.msg,
                            snackBarMessageSeverity: 'error'
                        });
                    }
                });
        }
    }

    // END: ADD NEW STORE

    render() {
        return (
            <div id="restaurants-root">
                <Grid container justifyContent="space-evenly" alignItems="center">
                    {this.state.restaurants.map((restaurant, key) => (
                            <Grid item key={restaurant._id} style={{margin: 10}}>
                                <br/>
                                <RestaurantCard restaurant={restaurant} index={key}
                                           handleListMealsFromRestaurantButtonClick={this.handleListMealsFromRestaurantButtonClick}
                                           fetchMealsFromRestaurant={this.fetchMealsFromRestaurant}
                                           handleDeleteRestaurantButtonClick={this.handleDeleteRestaurantButtonClick}
                                />
                            </Grid>
                        )
                    )}
                </Grid>
                <div id="snackBarDiv">
                    <ResultSnackBar message={this.state.snackBarMessage} open={this.state.snackBarOpen}
                                    onClose={this.handleCloseSnackBar} severity={this.state.snackBarMessageSeverity}/>
                </div>
                <div id="listMealsFromRestaurantDialogDiv">
                    <ListMealsFromRestaurantDialog onClose={this.handleCloseListMealsFromRestaurantDialog}
                                               open={this.state.listMealsFromRestaurantDialogOpen}
                                               meals={this.state.mealsFromRestaurant}
                                               restaurant={this.state.restaurants[this.state.restaurantIndexToInteractWith]}
                                               handleRemoveMealButtonClick={this.handleRemoveMealButtonClick}
                    />
                </div>
                <div id="deleteRestaurantAlertDialogDiv">
                    <DeleteRestaurantAlertDialog onClose={this.handleCloseDeleteRestaurantDialog}
                                            open={this.state.deleteRestaurantDialogOpen}/>
                </div>
                <div id="addNewRestaurantDialogDiv">
                    <AddNewRestaurantDialog onClose={this.handleCloseAddNewRestaurantDialog}
                                       open={this.state.addNewRestaurantDialogOpen}/>
                </div>
                <div id="addNewRestaurantFabDiv">
                    <Tooltip title="Add New Restaurant">
                        <Fab color="secondary" aria-label="add" style={fabStyle}
                             onClick={this.handleOnAddNewRestaurantFabClick}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </div>
                <div id="emptyCollection">
                    {this.state.restaurants.length === 0 ?
                        <EmptyCollection collectionName={"Restaurants"}
                                         responseArrived={this.state.responseArrived}/> : undefined}
                </div>
            </div>
        )
    }
}

export default Restaurants;
