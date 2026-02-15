import React from 'react';
import DreamCreate from './DreamCreate';
import { Row, Col } from 'reactstrap';
import DreamTable from './DreamTable';
import { DreamType, UserType } from '../../types/CustomTypes';
import DreamEdit from './DreamEdit';
import CommentTable from './CommentTable';


type AcceptedProps = {
    dreams: DreamType[],
    user: UserType,

    fetchUser: () => void
}

type PostIndexState = {
    dreamToEdit: DreamType,
}

export default class PostIndex extends React.Component<AcceptedProps, PostIndexState> {
    constructor(props: AcceptedProps) {
        super(props);
        this.state = {
            dreamToEdit: {
                content: "",
                category: "joy",
                isNSFW: false,
                title: '',
                Comments: []
            },
            }
        }
        render() {
            return (
                <div className="post">
                    <Row>
                        <Col md="4">
                        <DreamCreate
                 fetchUser={this.props.fetchUser}/>

                        </Col>
                        <Col md="8">
                        <DreamTable
    user={this.props.user}
    fetchUser={this.props.fetchUser}
    dreams={this.props.dreams}
/>

                        </Col>
                        </Row>

                        <Row>
                        <Col md="4">
                        </Col>
                        <Col md="8">
                            <hr/>
                            <h1 id="nd">My Comments</h1>
                            <CommentTable user={this.props.user} Comments={this.props.user.Comments}/>
                        </Col>
                        </Row>
                </div>
            )
        }
    }