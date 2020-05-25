import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import Input from '../../shared/components/Input/Input';
import Button from '../../shared/components/Button/Button';
import { axiosDB } from '../../shared/utils/axiosInstances';
import './Profile.scss';

const Profile = ({ databaseKey }) => {
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ age, setAge ] = useState('');

    useEffect(() => {
        if (!databaseKey) return;

        axiosDB.get(`users/${databaseKey}.json`)
            .then(response => {
                if (!response.data) return;

                const { firstName, lastName, age } = response.data;

                setFirstName(firstName);
                setLastName(lastName);
                setAge(age);
            })
            .catch(error => {
                console.log('[error]', error);
            });
    }, [databaseKey]);

    const onChangeHandler = e => {
        const { name, value } = e.target;

        if (name === 'firstName') {
            return setFirstName(value);
        }

        if (name === 'lastName') {
            return setLastName(value);
        }

        if (name === 'age') {
            setAge(value);
        }
    };

    const onSubmitHandler = useCallback(e => {
        e.preventDefault();

        console.log('SUBMITTED!');
    }, []);

    return (
        <div className="profile">
            <form className="profile__form">
                <h1 className="profile__title">Profile</h1>

                <div className="profile__fields">
                    <Input
                        wrapperClassName="profile__input-wrapper"
                        className="profile__input"
                        label="First name"
                        name="firstName"
                        value={firstName}
                        onChange={onChangeHandler}
                    />

                    <Input
                        wrapperClassName="profile__input-wrapper"
                        className="profile__input"
                        label="Last name"
                        name="lastName"
                        value={lastName}
                        onChange={onChangeHandler}
                    />

                    <Input
                        wrapperClassName="profile__input-wrapper"
                        className="profile__input"
                        label="Age"
                        name="age"
                        value={age}
                        onChange={onChangeHandler}
                    />
                </div>

                <Button
                    className="button--orange profile__btn"
                    onClick={onSubmitHandler}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default connect(
    state => ({ databaseKey: state.auth.databaseKey })
)(Profile);
