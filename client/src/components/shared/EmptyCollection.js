import PropTypes from "prop-types";
import React from "react";

export default function EmptyCollection(props) {
    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100px"}}>
            {!props.responseArrived ? undefined :
                <h1>{props.collectionName} collection is currently empty</h1>
            }
        </div>
    );
}

EmptyCollection.propTypes = {
    collectionName: PropTypes.string.isRequired,
    responseArrived: PropTypes.bool.isRequired
};
