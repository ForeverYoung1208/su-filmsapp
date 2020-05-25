import React, { Component, createContext } from 'react';

export const ProfileContext = createContext();

class ProfileState extends Component {
    state = {
        userName: 'John Doe',
        userAge: 23
    }

    render() {
        const { userName, userAge } = this.state;
        const { children } = this.props;

        return (
            <ProfileContext.Provider value={{
                name: userName,
                age: userAge
            }}>
                {children}
            </ProfileContext.Provider>
        );
    }
}

export default ProfileState;
