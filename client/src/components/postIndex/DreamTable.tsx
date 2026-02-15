import React from 'react';
import { DreamType, UserType } from '../../types/CustomTypes';
import DreamCard from '../postIndex/DreamCard';
import DreamEdit from './DreamEdit';
import DreamComment from '../publicDreams/DreamComment';
import { authFetch } from '../../helper/APIHelper';

type AcceptedProps = {
    dreams: DreamType[];
    fetchUser: () => void;
    user: UserType;
};

type DreamTableState = {
    dreamToComment: DreamType | null;
    dreamToEdit: DreamType | null;
};


class DreamTable extends React.Component<AcceptedProps, DreamTableState> {
    constructor(props: AcceptedProps) {
        super(props);
        this.state = {
            dreamToComment: null,
            dreamToEdit: null
        };
        
    }

    async deleteDream(dream: DreamType) {
        try {
            await authFetch(`/api/dreams/delete/${dream.id}`, {
                method: "DELETE"
            });

            this.props.fetchUser();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }

    async updateDream(dream: DreamType) {
        try {
            await authFetch(`/api/dreams/update/${dream.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    dream: this.state.dreamToEdit
                })
            });

            this.setState({
                dreamToEdit: {
                    content: "",
                    category: "joy",
                    isNSFW: undefined,
                    title: '',
                    Comments: []
                }
            });

            this.props.fetchUser();
        } catch (err) {
            console.error("Update failed:", err);
        }
    }

    setDreamToComment(dream: DreamType | null) {
        this.setState({ dreamToComment: dream });
    }
    
    setDreamToEdit(dream: DreamType | null) {
        this.setState({ dreamToEdit: dream });
    }
    

    displayDreams() {
        return [...this.props.dreams].reverse().map((dream, index) => (
            <DreamCard
                key={index}
                user={this.props.user}
                dream={dream}
                fetchUser={this.props.fetchUser}
                setDreamToComment={this.setDreamToComment.bind(this)
                }
                deleteDream={() => this.deleteDream(dream)}
                setDreamToEdit={this.setDreamToEdit.bind(this)
                }
            />
        ));
    }

    render() {
        return (
            <div>
                <h3 id="nd">My Dreams</h3>
    
                {this.displayDreams()}
    
                {this.state.dreamToEdit && (
                    <DreamEdit
                        dream={this.state.dreamToEdit}
                        setDreamToEdit={this.setDreamToEdit.bind(this)}
                        fetchUser={this.props.fetchUser}
                    />
                )}
    
                {this.state.dreamToComment && (
                    <DreamComment
                        setDreamToComment={this.setDreamToComment.bind(this)}
                        user={this.props.user}
                        dream={this.state.dreamToComment}
                    />
                )}
            </div>
        );
    }
    
}

export default DreamTable;
