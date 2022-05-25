import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from "axios";
import qs from 'qs';


export default function SignIn(props) {

    const {onSubmit} = props;

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if ('signin' === event.nativeEvent.submitter.name) {
            handleSignIn(data.get('username'), data.get('password'))
        } else if ('register' === event.nativeEvent.submitter.name) {
            handleRegister(data.get('username'), data.get('password'))
        }
    };


    function handleSignIn(username, password) {
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({
                username: username,
                password: password,
                grant_type: "password"
            }),
            url: 'http://localhost:8080/oauth/token',
            auth: {
                username: 'application',
                password: 'secret'
            }
        };
        axios(
            options
        ).then(res => {
            if (res.status === 200) {
                console.log(res.data)
                onSubmit(res.data.msg, 'success')
            }
        }).catch(err => {
            onSubmit(err.response.data.msg, 'error')
        })
    }

    function handleRegister(username, password) {
        axios.post(
            `http://localhost:8080/createUser`,
            {
                "username": username,
                "password": password
            }
        ).then(res => {
            if (res.status === 200) {
                onSubmit(res.data.msg, 'success')
            }
        }).catch(err => {
            onSubmit(err.response.data.msg, 'error')
        })
    }


    return (

        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        name="signin"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                    <Button
                        style={{marginTop: 10}}
                        type="submit"
                        name="register"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}