import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../common/Alert';

/** Login form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /companies route
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

const LoginForm = ({ login }) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState([]);
    const [loginSuccess, setLoginSuccess] = useState(false);

    async function handleSubmit(evt) {
        evt.preventDefault();

        let result = await login(formData);
        // console.log("Login result:", result); // Debug the result of the login function
        if (result.success) {
            setLoginSuccess(true); // Trigger success flag
        } else {
            setFormErrors(result.errors);
        }
    }

    useEffect(() => {
        if (loginSuccess) {
            navigate("/characters");
        }
    }, [loginSuccess, navigate]); // Trigger navigation after success

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(l => ({ ...l, [name]: value }));
    }

    return (
        <div className="LoginForm my-4">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h3 className="mb-3">Log In</h3>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    name="username"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            {formErrors.length
                                ? <Alert type="danger" messages={formErrors} />
                                : null}
                            <button
                                className="btn btn-primary float-right my-2"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm