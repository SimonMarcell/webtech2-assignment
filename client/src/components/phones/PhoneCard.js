import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import EuroIcon from '@material-ui/icons/Euro';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import StoreIcon from "@material-ui/icons/Store";
import ListItemText from "@material-ui/core/ListItemText";
import {blue} from "@material-ui/core/colors";
import HeightIcon from '@material-ui/icons/Height';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 2,
        textAlign: 'center',
        minWidth: "300px",
        maxWidth: "300px"
    },
    content: {
        height: 140,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    expandText: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px'
    },
    store: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    displaySizeIcon: {
        transform: 'rotate(45deg)',
    },
    smartPhoneIcon: {
        marginTop: '40px',
        width: '70px',
        height: '70px'
    }
}));

export default function PhoneCard(props) {
    const {phone, storesAvailableIn, index} = props;

    const [wrapEnabled, setWrapEnabled] = React.useState(true);

    const fetchStoresPhoneAvailableIn = async () => {
        const fetchStoresPhoneAvailableIn = await fetch(
            `http://localhost:8080/listStoresContainingPhone/${phone._id}`
        );
        const storesAvailableIn = await fetchStoresPhoneAvailableIn.json();
        const stores = await storesAvailableIn;
        props.getStorePhoneAvailableIn(stores, index);
        return storesAvailableIn;
    };

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = async () => {
        if (!expanded) {
            await fetchStoresPhoneAvailableIn();
        }
        setExpanded(!expanded);
        setWrapEnabled(!wrapEnabled);
    };

    const handleAddPhoneButtonClick = async () => {
        const fetch = await fetchStoresPhoneAvailableIn();
        const stores = await fetch;
        props.handleAddPhoneButtonClick(index, stores);
    };

    const handleUpdatePhoneButtonClick = () => {
        props.handleUpdatePhoneButtonClick(index)
    };

    const handleDeletePhoneButtonClick = async () => {
        await fetchStoresPhoneAvailableIn();
        props.handleDeletePhoneButtonClick(index)
    };

    return phone === undefined ? null : (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.content}>
                    <SmartphoneIcon className={classes.smartPhoneIcon}/>
                </div>
                <Typography gutterBottom variant="h5" component="h2" noWrap={wrapEnabled}>
                    {phone.manufacturer} {phone.model}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Add Phone to Store">
                    <IconButton aria-label="delete" onClick={handleAddPhoneButtonClick}>
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Modify Phone">
                    <IconButton aria-label="edit" onClick={handleUpdatePhoneButtonClick}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Phone">
                    <IconButton aria-label="delete" onClick={handleDeletePhoneButtonClick}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography className={classes.expandText}>
                        <EuroIcon/> {phone.price}
                    </Typography>
                    <Typography className={classes.expandText} style={{marginTop: 10}}>
                        <HeightIcon className={classes.displaySizeIcon}/> {phone.displaySize}" {phone.displayType}
                    </Typography>
                    <div>
                        {storesAvailableIn !== undefined && storesAvailableIn.length > 0 &&
                        <div>
                            <Typography className={classes.expandText} style={{marginTop: 20}}>
                                Available in the following stores:
                            </Typography>
                            <List>
                                <br/>
                                {
                                    storesAvailableIn.map((store) => (
                                        <ListItem key={store._id}>
                                            <ListItemAvatar>
                                                <Avatar className={classes.store}>
                                                    <StoreIcon/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={store.name}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </div>
                        }
                    </div>
                </CardContent>
            </Collapse>
        </Card>
    );
}
