import React, { Component } from "react";
import { ButtonGroup, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";


export default class HomePage extends Component {
    constructor(props) {
        super(props);

    }



    render() {
        return (
            <Grid container spacing={5} align="center">
                <Grid item xs={12}>
                    <Typography variant="h3" component="h3">
                        MDZ Pub
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button color="primary" to='/join' component={Link}>
                            Join A Room
                        </Button>
                        <Button color="secondary" to='/create' component={Link}>
                            Create A Room
                        </Button>
                    </ButtonGroup>
                </Grid>

            </Grid>
        );
    }
}