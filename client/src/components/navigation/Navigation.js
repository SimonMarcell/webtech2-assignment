import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Link} from 'react-router-dom';
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";

function HideOnScroll(props) {
    const {children, window} = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({target: window ? window() : undefined});

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

const useStyles = makeStyles({
    nav: {
        margin: 'auto'
    },
    tabLabel: {
        fontSize: '20px'
    },
    navDiv: {
        marginBottom: '50px'
    }
});

export default function NavTabs(props) {
    const classes = useStyles();
    const path = window.location.pathname;
    let refIndex;
    if (path === "/restaurants") {
        refIndex = 2;
    } else if (path === "/meals") {
        refIndex = 1;
    } else {
        refIndex = 0;
    }

    const [value, setValue] = React.useState(refIndex);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <div className={classes.navDiv}>
                <HideOnScroll {...props}>
                    <AppBar color='inherit'>
                        <Tabs className={classes.nav}
                              value={value}
                              onChange={handleChange}
                              centered
                        >
                            <Tab label={<span className={classes.tabLabel}>Home</span>} component={Link} to="/"/>
                            <Tab label={<span className={classes.tabLabel}>Meals</span>} component={Link}
                                 to="/meals"/>
                            <Tab label={<span className={classes.tabLabel}>Restaurants</span>} component={Link}
                                 to="/restaurants"/>
                        </Tabs>
                    </AppBar>
                </HideOnScroll>
            </div>
        </React.Fragment>
    );
}
