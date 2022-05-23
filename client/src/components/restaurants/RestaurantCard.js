import React, {useEffect} from 'react';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import RestaurantIcon from "@material-ui/icons/Restaurant";
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
    restaurantIcon: {
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

export default function MealCard(props) {
    const {restaurant, index} = props;
    const classes = useStyles();

    const [starsToRender, setStarsToRender] = React.useState([]);

    useEffect(() => {
        setStarsToRenderEffect();
    }, []);

    const fetchMealsFromRestaurant = async () => {
        const fetchMealsFromRestaurant = await fetch(
            `http://localhost:8080/listMealsFromRestaurant/${restaurant._id}`
        );
        const mealsFromRestaurant = await fetchMealsFromRestaurant.json();
        const meals = await mealsFromRestaurant;
        props.fetchMealsFromRestaurant(meals);
        return mealsFromRestaurant;
    };

    const setStarsToRenderEffect = () => {
        if (restaurant !== undefined) {
            for (let i = 0; i < parseInt(restaurant.rating); i++) {
                setStarsToRender(array => [...array, i])
            }
        }
    };

    const handleListMealsFromRestaurantButtonClick = async () => {
        await fetchMealsFromRestaurant();
        props.handleListMealsFromRestaurantButtonClick(index);
    };

    const handleDeleteRestaurantButtonClick = () => {
        props.handleDeleteRestaurantButtonClick(index);
    };

    return restaurant === undefined ? null : (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.content}>
                    <RestaurantIcon className={classes.restaurantIcon}/>
                </div>
                <Typography gutterBottom variant="h5" component="h2">
                    {restaurant.name}
                </Typography>
                <br/>
                {
                    starsToRender.map(i => (
                        <StarIcon key={i}/>
                    ))
                }
                <div>
                    <Typography className={classes.locationTitle}>
                        {restaurant.location.zipCode} {restaurant.location.country}
                    </Typography>
                    <Typography>
                        {restaurant.location.town} {restaurant.location.address}
                    </Typography>
                </div>
            </CardContent>
            <CardActions disableSpacing>
                <Button size="small" color="secondary" onClick={handleListMealsFromRestaurantButtonClick}>
                    <Typography>
                        List meals
                    </Typography>
                </Button>
                <Tooltip title="Delete Restaurant">
                    <IconButton aria-label="delete" style={{marginLeft: "auto"}} onClick={handleDeleteRestaurantButtonClick}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}
