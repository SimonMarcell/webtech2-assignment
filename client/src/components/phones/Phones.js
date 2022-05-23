import React, {Component} from 'react';
import axios from "axios";
import PhoneCard from "./PhoneCard";
import Grid from "@material-ui/core/Grid";
import ResultSnackBar from "../shared/ResultSnackBar";
import AddPhoneToStoreDialog from "./dialogs/AddPhoneToStoreDialog";
import DeletePhoneAlertDialog from "./dialogs/DeletePhoneAlertDialog";
import UpdatePhoneDialog from "./dialogs/UpdatePhoneDialog";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import AddNewPhoneDialog from "./dialogs/AddNewPhoneDialog";
import Tooltip from "@material-ui/core/Tooltip";
import EmptyCollection from "../shared/EmptyCollection";

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
};

class Phones extends Component {

    state = {
        phones: [],
        snackBarOpen: false,
        snackBarMessage: '',
        snackBarMessageSeverity: 'success',
        stores: [],
        addPhoneDialogOpen: false,
        phoneIndexToInteractWith: 0,
        storesToChooseFromToAddPhone: [],
        deletePhoneDialogOpen: false,
        updatePhoneDialogOpen: false,
        addNewPhoneDialogOpen: false,
        responseArrived: false
    };

    componentDidMount() {
        this.loadPhones();
        this.loadStores();
    }

    loadPhones = () => {
        axios.get(`/listPhones`).then(res => {
                if (res.status === 200) {
                    this.setState({phones: res.data, responseArrived: true});
                }
            },
            error => {
                this.setState({responseArrived: true});
                console.log(error);
            });
    };

    loadStores = () => {
        axios.get(`/listStores`).then(res => {
                if (res.status === 200) {
                    this.setState({stores: res.data});
                }
            },
            error => {
                console.log(error);
            });
    };

    handleDeletePhoneButtonClick = (index) => {
        this.setState({
            deletePhoneDialogOpen: true,
            phoneIndexToInteractWith: index
        });
    };

    handleCloseDeletePhoneDialog = (result) => {
        if (result) {
            let phoneToInteractWith = this.state.phones[this.state.phoneIndexToInteractWith];
            axios.get(`/deletePhone/${phoneToInteractWith._id}`)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            phones: [...this.state.phones.filter(
                                phone => phone._id !== phoneToInteractWith._id
                            )],
                            snackBarMessage: res.data.msg
                        });
                        if (phoneToInteractWith.storesPhoneAvailableIn.length > 0) {
                            this.deletePhoneFromStores(phoneToInteractWith._id,
                                phoneToInteractWith.storesPhoneAvailableIn);
                        } else {
                            this.setState({
                                snackBarOpen: true,
                                snackBarMessageSeverity: 'success'
                            });
                        }
                    }
                });
        }
        this.setState({
            deletePhoneDialogOpen: false
        });
    };

    deletePhoneFromStores = (phoneId, stores) => {
        stores.map((store) => (
            this.removePhoneFromStore(store._id, phoneId)
        ));
    };

    removePhoneFromStore = (storeId, phoneId) => {
        axios.get(`/removePhoneFromStore/${storeId}/${phoneId}`)
            .then(res => {
                if (res.status === 200) {
                    let additionalMessage = ` and from store(${storeId}) `;
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

    handleAddPhoneButtonClick = (index) => {
        let myArrayFiltered = this.state.stores.slice();
        const storePhoneAlreadyIn = this.state.phones[index]
            .storesPhoneAvailableIn.slice();

        for (let i = 0; i < myArrayFiltered.length; i++) {
            for (let j = 0; j < storePhoneAlreadyIn.length; j++) {
                if (myArrayFiltered[i]._id === storePhoneAlreadyIn[j]._id) {
                    myArrayFiltered.splice(i, 1)
                }
            }
        }

        if (myArrayFiltered.length === 0) {
            this.setState({
                snackBarOpen: true,
                snackBarMessage: 'Phone is currently present in all available stores',
                snackBarMessageSeverity: 'info'
            })
        } else {
            this.setState({
                addPhoneDialogOpen: true,
                phoneIndexToInteractWith: index,
                storesToChooseFromToAddPhone: myArrayFiltered
            });
        }
    };

    handleCloseAddPhoneDialog = (storeId, storeName) => {
        this.setState({
            addPhoneDialogOpen: false
        });

        if (storeId !== undefined && storeId !== '') {
            this.addPhoneToStore(storeId, storeName);
        }
    };

    addPhoneToStore = (storeId, storeName) => {
        let phoneToInteractWith = this.state.phones[this.state.phoneIndexToInteractWith];
        axios.get(`/addPhoneToStore/${storeId}/${phoneToInteractWith._id}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        snackBarOpen: true,
                        snackBarMessage: res.data.msg,
                        snackBarMessageSeverity: 'success'
                    });
                    let phones = [...this.state.phones];
                    let phone = {...phones[this.state.phoneIndexToInteractWith]};

                    phone.storesPhoneAvailableIn.push({_id: storeId, name: storeName});

                    this.setState({phones: phones});
                }
            });
    };

    getStorePhoneAvailableIn = (stores, index) => {
        let phones = [...this.state.phones];
        let phone = {...phones[index]};

        phone.storesPhoneAvailableIn = stores;
        phones[index] = phone;
        this.setState({phones});
    };

    handleUpdatePhoneButtonClick = (index) => {
        this.setState({
            phoneIndexToInteractWith: index,
            updatePhoneDialogOpen: true
        });
    };

    handleCloseUpdatePhoneDialog = (price) => {
        this.setState({
            updatePhoneDialogOpen: false
        });

        if (price !== undefined) {
            let phones = [...this.state.phones];
            let phone = {...phones[this.state.phoneIndexToInteractWith]};
            phone.price = parseInt(price);
            let phoneToSend = {
                phone: {
                    "manufacturer": phone.manufacturer,
                    "model": phone.model,
                    "price": phone.price,
                    "displayType": phone.displayType,
                    "displaySize": phone.displaySize
                }
            };

            axios.put(`/updatePhone/${phone._id}`, phoneToSend)
                .then(res => {
                    if (res.status === 200) {
                        //TODO: do not mutate directly, use setState instead
                        this.state.phones[this.state.phoneIndexToInteractWith] = phone;
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
                });
        }
    };

    // BEGIN: ADD PHONE

    handleOnAddPhoneFabClick = () => {
        this.setState({
            addNewPhoneDialogOpen: true
        });
    };

    handleCloseAddNewPhoneDialog = (phone) => {
        this.setState({
            addNewPhoneDialogOpen: false
        });

        if (phone !== undefined) {
            axios.post(`/addPhone`, phone)
                .then(res => {
                    if (res.status === 200) {
                        let phones = this.state.phones;
                        phones.push(res.data.phone);

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
    };

    // END: ADD PHONE

    render() {
        return (
            <div id="phones-root">
                <Grid container justify="space-evenly" alignItems="center">
                    {this.state.phones.map((phone, key) => (
                            <Grid item key={phone._id} style={{margin: 10}}>
                                <br/>
                                <PhoneCard phone={phone} index={key}
                                           handleAddPhoneButtonClick={this.handleAddPhoneButtonClick}
                                           getStorePhoneAvailableIn={this.getStorePhoneAvailableIn}
                                           handleDeletePhoneButtonClick={this.handleDeletePhoneButtonClick}
                                           handleUpdatePhoneButtonClick={this.handleUpdatePhoneButtonClick}
                                           storesAvailableIn={this.state.phones[key].storesPhoneAvailableIn}
                                />
                            </Grid>
                        )
                    )}
                </Grid>
                <div id="snackBarDiv">
                    <ResultSnackBar message={this.state.snackBarMessage} open={this.state.snackBarOpen}
                                    onClose={this.handleCloseSnackBar} severity={this.state.snackBarMessageSeverity}/>
                </div>
                <div id="addPhoneDialogDiv">
                    <AddPhoneToStoreDialog onClose={this.handleCloseAddPhoneDialog} open={this.state.addPhoneDialogOpen}
                                           storesToChooseFrom={this.state.storesToChooseFromToAddPhone}/>
                </div>
                <div id="deletePhoneAlertDialogDiv">
                    <DeletePhoneAlertDialog onClose={this.handleCloseDeletePhoneDialog}
                                            open={this.state.deletePhoneDialogOpen}
                                            phone={this.state.phones[this.state.phoneIndexToInteractWith]}
                    />
                </div>
                <div id="updatePhoneAlertDialogDiv">
                    <UpdatePhoneDialog onClose={this.handleCloseUpdatePhoneDialog}
                                       open={this.state.updatePhoneDialogOpen}
                                       phone={this.state.phones[this.state.phoneIndexToInteractWith]}
                    />
                </div>
                <div id="addNewPhoneDialogDiv">
                    <AddNewPhoneDialog onClose={this.handleCloseAddNewPhoneDialog}
                                       open={this.state.addNewPhoneDialogOpen}/>
                </div>
                <div id="addNewPhoneFabDiv">
                    <Tooltip title="Add New Phone">
                        <Fab color="secondary" aria-label="add" style={fabStyle}
                             onClick={this.handleOnAddPhoneFabClick}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </div>
                <div id="emptyCollection">
                    {this.state.phones.length === 0 ?
                        <EmptyCollection collectionName={"Phones"}
                                         responseArrived={this.state.responseArrived}/> : undefined}
                </div>
            </div>
        )
    }
}

export default Phones;
