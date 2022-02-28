import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import { FormControl, FormControlLabel, FormHelperText, FormLabel, RadioGroup, TextField, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

class CreateRoomPage extends Component{
    defaultVotes = 2

    constructor(props){
        super(props);
        this.state = {
            guestCanControl: true,
        }

        this.handleGuestCanControlChange = this.handleGuestCanControlChange.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
    }
    

    handleGuestCanControlChange(e){
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleCreateButtonPressed(e){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guest_can_control: this.state.guestCanControl,
            }),
        };
        fetch("/api/create/", requestOptions)
            .then((response) => response.json())
            .then((data) => (this.props.history.push("/room/"+data.code))
            );
    }

    render (){
        return (
            <Grid container xs={12}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create A Room
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                            <FormHelperText>
                                    <div align="center">Guest control music player</div>
                            </FormHelperText>
                            <RadioGroup row defaultValue="true" onChange={this.handleGuestCanControlChange}>
                                <FormControlLabel 
                                    value="true" 
                                    control={<Radio color="primary" />} 
                                    label="Play/Pause"
                                    labelPlacement="bottom"
                                />

                                <FormControlLabel
                                    value="false"
                                    control={<Radio color="secondary" />}
                                    label="No control"
                                    labelPlacement="bottom"
                                />
                            </RadioGroup>
                    </FormControl>
                </Grid>

                {/* <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            require={true}
                            type="number"
                            onChange={this.handleVotesChange}
                            defaultValue={this.defaultVotes}
                            inputProps={{
                                min:1,
                                style:{
                                    textAlign: "center"
                                }
                            }}
                        />
                        <FormHelperText>
                            <div align="center">Votes to skip song</div>
                        </FormHelperText>
                    </FormControl>
                </Grid> */}


                <Grid item xs={12} align="center">
                    <Button 
                        color="secondary" 
                        variant="contained" 
                        onClick={this.handleCreateButtonPressed} >
                        Create Room
                    </Button>
                </Grid>

                <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" to="/" component={Link}>
                        Back
                </Button>
                </Grid>

            </Grid>
        )
        
    }
}

export default withRouter(CreateRoomPage);