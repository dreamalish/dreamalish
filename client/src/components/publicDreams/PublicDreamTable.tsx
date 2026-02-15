import React from 'react';
import { DreamType, UserType } from '../../types/CustomTypes';
import DreamCard from '../postIndex/DreamCard';

type AcceptedProps = {
    user: UserType;
    dreams: DreamType[];
    fetchUser: () => void;
};

class PublicDreamTable extends React.Component<AcceptedProps> {

    displayDreams() {
        return [...this.props.dreams].reverse().map((dream, index) => (
            <DreamCard
                key={index}
                user={this.props.user}
                dream={dream}
                fetchUser={this.props.fetchUser}
            />
        ));
    }

    render() {
        return (
            <div>
                <h3>Public Dreams</h3>
                {this.displayDreams()}
            </div>
        );
    }
}

export default PublicDreamTable;
