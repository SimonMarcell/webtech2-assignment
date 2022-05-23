import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import StoreCard from "./StoreCard";
import ListPhonesFromStoreDialog from "./dialogs/ListPhonesFromStoreDialog";
import axios from "axios";
import ResultSnackBar from "../shared/ResultSnackBar";
import DeleteStoreAlertDialog from "./dialogs/DeleteStoreAlertDialog";
import AddNewStoreDialog from "./dialogs/AddNewStoreDialog";
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

class Stores extends Component {

    state = {
        stores: [],
        snackBarOpen: false,
        snackBarMessage: '',
        snackBarMessageSeverity: 'success',
        storeIndexToInteractWith: 0,
        phonesFromStore: [],
        listPhonesFromStoreDialogOpen: false,
        deleteStoreDialogOpen: false,
        addNewStoreDialogOpen: false,
        responseArrived: false
    };

    componentDidMount() {
        this.loadStores();
    }

    loadStores = () => {
        axios.get(`http://localhost:8080/listStores`).then(res => {
                if (res.status === 200) {
                    this.setState({stores: res.data, responseArrived: true});
                }
            },
            error => {
                this.setState({responseArrived: true});
                console.log(error);
            });
    };

    handleListPhonesFromStoreButtonClick = (index) => {
        if (this.state.stores[index].availablePhones.length === 0) {
            this.setState({
                snackBarMessage: 'There are no phones available in this store at the moment',
                snackBarOpen: true,
                snackBarMessageSeverity: 'info'
            });
        } else {
            this.setState({
                storeIndexToInteractWith: index,
                listPhonesFromStoreDialogOpen: true
            });
        }
    };

    handleCloseListPhonesFromStoreDialog = () => {
        this.setState({
            listPhonesFromStoreDialogOpen: false
        })
    };

    fetchPhonesFromStore = (phones) => {
        this.setState({
            phonesFromStore: phones
        });
    };

    handleRemovePhoneButtonClick = (phoneId, index) => {
        axios.get(`http://localhost:8080/removePhoneFromStore/` +
            `${this.state.stores[this.state.storeIndexToInteractWith]._id}/${phoneId}`)
            .then(res => {
                if (res.status === 200) {
                    this.state.stores[this.state.storeIndexToInteractWith].availablePhones.splice(index, 1);
                    this.state.phonesFromStore.splice(index, 1);

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

    handleDeleteStoreButtonClick = (index) => {
        this.setState({
            deleteStoreDialogOpen: true,
            storeIndexToInteractWith: index
        });
    };

    handleCloseDeleteStoreDialog = (result) => {
        if (result) {
            let storeToInteractWith = this.state.stores[this.state.storeIndexToInteractWith];
            axios.get(`http://localhost:8080/deleteStore/${storeToInteractWith._id}`)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            stores: [...this.state.stores.filter(
                                store => store._id !== storeToInteractWith._id
                            )],
                            snackBarMessage: res.data.msg,
                            snackBarOpen: true,
                            snackBarMessageSeverity: 'success'
                        });
                    }
                });
        }
        this.setState({
            deleteStoreDialogOpen: false
        });
    }

    // END: DELETE STORE

    // BEGIN: ADD NEW STORE

    handleOnAddNewStoreFabClick = () => {
        this.setState({
            addNewStoreDialogOpen: true
        });
    };

    handleCloseAddNewStoreDialog = (store) => {
        this.setState({
            addNewStoreDialogOpen: false
        });

        if (store !== undefined) {
            axios.post(`http://localhost:8080/addStore`, store)
                .then(res => {
                    if (res.status === 200) {
                        let stores = this.state.stores;
                        stores.push(res.data.store);

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
            <div id="stores-root">
                <Grid container justify="space-evenly" alignItems="center">
                    {this.state.stores.map((store, key) => (
                            <Grid item key={store._id} style={{margin: 10}}>
                                <br/>
                                <StoreCard store={store} index={key}
                                           handleListPhonesFromStoreButtonClick={this.handleListPhonesFromStoreButtonClick}
                                           fetchPhonesFromStore={this.fetchPhonesFromStore}
                                           handleDeleteStoreButtonClick={this.handleDeleteStoreButtonClick}
                                />
                            </Grid>
                        )
                    )}
                </Grid>
                <div id="snackBarDiv">
                    <ResultSnackBar message={this.state.snackBarMessage} open={this.state.snackBarOpen}
                                    onClose={this.handleCloseSnackBar} severity={this.state.snackBarMessageSeverity}/>
                </div>
                <div id="listPhonesFromStoreDialogDiv">
                    <ListPhonesFromStoreDialog onClose={this.handleCloseListPhonesFromStoreDialog}
                                               open={this.state.listPhonesFromStoreDialogOpen}
                                               phones={this.state.phonesFromStore}
                                               store={this.state.stores[this.state.storeIndexToInteractWith]}
                                               handleRemovePhoneButtonClick={this.handleRemovePhoneButtonClick}
                    />
                </div>
                <div id="deleteStoreAlertDialogDiv">
                    <DeleteStoreAlertDialog onClose={this.handleCloseDeleteStoreDialog}
                                            open={this.state.deleteStoreDialogOpen}/>
                </div>
                <div id="addNewStoreDialogDiv">
                    <AddNewStoreDialog onClose={this.handleCloseAddNewStoreDialog}
                                       open={this.state.addNewStoreDialogOpen}/>
                </div>
                <div id="addNewStoreFabDiv">
                    <Tooltip title="Add New Store">
                        <Fab color="secondary" aria-label="add" style={fabStyle}
                             onClick={this.handleOnAddNewStoreFabClick}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </div>
                <div id="emptyCollection">
                    {this.state.stores.length === 0 ?
                        <EmptyCollection collectionName={"Stores"}
                                         responseArrived={this.state.responseArrived}/> : undefined}
                </div>
            </div>
        )
    }
}

export default Stores;
