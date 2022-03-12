import { useMutation } from "@apollo/client";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { LOGIN } from "../queries";
import { Input } from "./Form/Input";

const schema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
});

export const Login = ({ setAccessToken }) => {
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [login, { loading: isLoading, error }] = useMutation(LOGIN);

    const handleLogin = (data) => {
        login({
            variables: {
                input: {
                    email: data.email,
                    password: data.password,
                }
            }
        }).then(response => {
            const { token } = response.data.login;

            setAccessToken(token);
        }).catch(error => { });
    };

    useEffect(() => {
        // make sure there is no token before making requests
        localStorage.removeItem('accessToken');
    }, []);

    return <div className="login">
        <form className="login__form" onSubmit={handleSubmit(handleLogin)}>
            {error && <div className="alert alert-danger">
                Could not login. Wrong e-mail and/or password.
            </div>}

            <h1>Login</h1>

            <Input
                label="E-mail"
                errors={errors}
                {...register('email')}
            />

            <Input
                label="Password"
                type="password"
                errors={errors}
                {...register('password')}
            />

            <button className="btn btn-outline-primary" disabled={isLoading}>
                {isLoading && <FontAwesomeIcon icon={faSpinner} spin />} Login
            </button>
        </form>
    </div>
};