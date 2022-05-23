import React, {useEffect} from 'react';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import StoreIcon from "@material-ui/icons/Store";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import StarIcon from '@material-ui/icons/Star';
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
    root: {
        padding: 2,
        textAlign: 'center',
        width: '45vh'
    },
    content: {
        height: 140,
    },
    storeIcon: {
        marginTop: '40px',
        width: '70px',
        height: '70px'
    },
    locationTitle: {
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '20px',
        marginBottom: '15px'
    }
});

export default function PhoneCard(props) {
    const {store, index} = props;
    const classes = useStyles();

    const [starsToRender, setStarsToRender] = React.useState([]);

    useEffect(() => {
        setStarsToRenderEffect();
    }, []);

    const fetchPhonesFromStore = async () => {
        const fetchPhonesFromStore = await fetch(
            `http://localhost:8080/listPhonesFromStore/${store._id}`
        );
        const phonesFromStore = await fetchPhonesFromStore.json();
        const phones = await phonesFromStore;
        props.fetchPhonesFromStore(phones);
        return phonesFromStore;
    };

    const setStarsToRenderEffect = () => {
        if (store !== undefined) {
            for (let i = 0; i < parseInt(store.rating); i++) {
                setStarsToRender(array => [...array, i])
            }
        }
    };

    const handleListPhonesFromStoreButtonClick = async () => {
        await fetchPhonesFromStore();
        props.handleListPhonesFromStoreButtonClick(index);
    };

    const handleDeleteStoreButtonClick = () => {
        props.handleDeleteStoreButtonClick(index);
    };

    return store === undefined ? null : (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.content}>
                    <StoreIcon className={classes.storeIcon}/>
                </div>
                <Typography gutterBottom variant="h5" component="h2">
                    {store.name}
                </Typography>
                <br/>
                {
                    starsToRender.map(i => (
                        <StarIcon key={i}/>
                    ))
                }
                <div>
                    <Typography className={classes.locationTitle}>
                        {store.location.zipCode} {store.location.country}
                    </Typography>
                    <Typography>
                        {store.location.town} {store.location.address}
                    </Typography>
                </div>
            </CardContent>
            <CardActions disableSpacing>
                <Button size="small" color="secondary" onClick={handleListPhonesFromStoreButtonClick}>
                    <Typography>
                        List phones
                    </Typography>
                </Button>
                <Tooltip title="Delete Store">
                    <IconButton aria-label="delete" style={{marginLeft: "auto"}} onClick={handleDeleteStoreButtonClick}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}
