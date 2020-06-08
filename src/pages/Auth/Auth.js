import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../shared/components/Input/Input';
import Button from '../../shared/components/Button/Button';
import { validation } from '../../shared/utils/validation';
import { authenticateUser } from '../../store/actions/auth';
import { axiosAuth, axiosDB } from '../../shared/utils/axiosInstances';
import './Auth.scss';

// const FIREBASE_KEY = 'AIzaSyC3vTcNvrRtCGQAQwVF8fDuMCcwypi2feI';
const FIREBASE_KEY = 'AIzaSyAlF0fCe0MUJCEeCHN40oLADyTH7EBpyFo';

const SIGN_IN = 'Sign In';
const SIGN_UP = 'Sign Up';

const SIGN_IN_FIELDS = ['email', 'password'];
const SIGN_UP_FIELDS = ['firstName', 'lastName', 'age', 'email', 'password', 'confirmPassword'];

const initialState = {
    mode: SIGN_IN,
    firstName: {
        type: 'text',
        name: 'firstName',
        label: 'First name',
        value: '',
        errors: [],
        validationRules: {
            isAlphabetic: /^[a-zA-Z]+$/
        }
    },
    lastName: {
        type: 'text',
        name: 'lastName',
        label: 'Last name',
        value: '',
        errors: [],
        validationRules: {
            isAlphabetic: /^[a-zA-Z]+$/
        }
    },
    age: {
        type: 'number',
        name: 'age',
        label: 'Age',
        value: '',
        errors: [],
        validationRules: {
            isNumeric: /^[0-9]+$/
        }
    },
    email: {
        type: 'email',
        name: 'email',
        label: 'E-mail',
        value: '',
        errors: [],
        validationRules: {
            isEmail: /^[a-z._\-0-9]+@[a-z]+\.[a-z]{2,3}$/
        }
    },
    password: {
        type: 'password',
        name: 'password',
        label: 'Password',
        value: '',
        errors: [],
        validationRules: {
            minLength: 6
        }
    },
    confirmPassword: {
        type: 'password',
        name: 'confirmPassword',
        label: 'Confirm password',
        value: '',
        errors: [],
        validationRules: {
            minLength: 6
        }
    }
};

class Auth extends Component {
    state = initialState;

    onChangeHandler = e => {
        const { name, value } = e.target;

        this.setState({
            [name]: {
                ...this.state[name],
                value
            }
        });
    }

    onBlurHandler = e => {
        const { name } = e.target;

        const errors = this.validate(this.state[name]);

        this.setState({
            [name]: {
                ...this.state[name],
                errors
            }
        });
    }

    validate(field) {
        const { validationRules, value } = field;

        const errors = [];

        for (const ruleName in validationRules) {
            const ruleValue = validationRules[ruleName];

            const validationFunction = validation[ruleName];

            const errorMessage = validationFunction(value.trim(), ruleValue);

            if (!errorMessage) continue;

            errors.push(errorMessage);
        }

        return errors;
    }

    onSubmitHandler = e => {
        e.preventDefault();

        const {
            mode,
            email,
            password,
            firstName,
            lastName,
            age
        } = this.state;

        const user = {
            email: email.value,
            password: password.value,
            returnSecureToken: true
        };

        const url = mode === SIGN_IN ? 'signInWithPassword' : 'signUp';

        axiosAuth.post(`v1/accounts:${url}?key=${FIREBASE_KEY}`, user)
            .then(response => {
                const { authenticateUser } = this.props;
                const { idToken, localId, displayName } = response.data;

                if (mode === SIGN_IN) {
                    return authenticateUser(idToken, localId, displayName);
                }

                const userData = {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    age: +age.value
                };

                axiosDB.post('users.json', userData)
                    .then(response => {
                        const databaseKey = response.data.name;

                        const updatedUserData = {
                            idToken,
                            displayName: databaseKey
                        };

                        axiosAuth.post(`v1/accounts:update?key=${FIREBASE_KEY}`, updatedUserData)
                            .then(() => {
                                authenticateUser(idToken, localId, databaseKey);
                            });
                    });
            })
            .catch(error => {
                console.log('[error]', error);
            });
    }

    switchModeHandler = newMode => {
        const { mode } = this.state;
        
        if (mode === newMode) return;

        this.setState({
            ...initialState,
            mode: newMode
        });
    }

    formIsInvalid(mode) {
        const fieldKeys = mode === SIGN_IN ? SIGN_IN_FIELDS : SIGN_UP_FIELDS;

        let isValid = true;

        for (const fieldKey of fieldKeys) {
            const { errors, value } = this.state[fieldKey];

            isValid = !errors.length && !!value && isValid;
        }

        return !isValid;
    }

    render() {
        const { mode } = this.state;

        const fieldKeys = mode === SIGN_IN ? SIGN_IN_FIELDS : SIGN_UP_FIELDS;

        return (
            <div className="auth">
                <div className="auth__form-wrapper">
                    <div className="auth__tabs">
                        {[SIGN_IN, SIGN_UP].map(authMode => {
                            const tabClasses = ['auth__tab'];

                            if (authMode === mode) {
                                tabClasses.push('auth__tab--active');
                            }

                            return (
                                <button
                                    key={authMode}
                                    type="button"
                                    className={tabClasses.join(' ')}
                                    onClick={() => this.switchModeHandler(authMode)}
                                >
                                    {authMode}
                                </button>
                            );
                        })}
                    </div>

                    <form
                        className="auth__form"
                        autoComplete="off"
                        noValidate
                        onSubmit={this.onSubmitHandler}
                    >
                        {fieldKeys.map(fieldKey => {
                            const {
                                type,
                                name,
                                label,
                                value,
                                errors
                            } = this.state[fieldKey];

                            return (
                                <div key={fieldKey} className="auth__field-wrapper">
                                    <Input
                                        type={type}
                                        name={name}
                                        label={label}
                                        wrapperClassName="auth__input-wrapper"
                                        className="auth__input"
                                        value={value}
                                        onChange={this.onChangeHandler}
                                        onBlur={this.onBlurHandler}
                                    />

                                    {errors.map((error, i) => (
                                        <p key={i} className="auth__error">{error}</p>
                                    ))}
                                </div>
                            );
                        })}

                        <Button
                            type="submit"
                            className="button--orange auth__btn"
                            isDisabled={this.formIsInvalid(mode)}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(
    null,
    { authenticateUser }
)(Auth);
