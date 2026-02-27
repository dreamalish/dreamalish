import React, { FormEvent } from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Button,
    Modal,
    ModalBody
} from 'reactstrap';

import APIURL from '../../helper/Environment';
import { DreamType } from '../../types/CustomTypes';
import { authFetch } from "../../helper/APIHelper";

type AcceptedProps = {
    dream: DreamType;
    setDreamToEdit: (dream: DreamType | null) => void;
    fetchUser: () => void;
};


type DreamEditState = {
    dream: DreamType;
};

export default class DreamEdit extends React.Component<
    AcceptedProps,
    DreamEditState
> {
    constructor(props: AcceptedProps) {
        super(props);

        this.state = {
            dream: props.dream
        };
    }

    componentDidUpdate(prevProps: AcceptedProps) {
        if (prevProps.dream !== this.props.dream) {
            this.setState({ dream: this.props.dream });
        }
    }

    updateDream = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await authFetch(
                `${APIURL}/api/dreams/update/${this.state.dream.id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ dream: this.state.dream })
                }
            );

            this.props.fetchUser();
            this.props.setDreamToEdit(null); // close modal
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        const { dream } = this.state;

        return (
            <Modal isOpen={true} toggle={() => this.props.setDreamToEdit(null)}>
                <ModalBody>
                    <Button
                        color="secondary"
                        onClick={() => this.props.setDreamToEdit(null)}
                    >
                        CANCEL
                    </Button>

                    <Form onSubmit={this.updateDream}>
                        <h5>Update Dream</h5>

                        <FormGroup>
                            <Label>Title:</Label>
                            <Input
                                value={dream.title}
                                onChange={(e) =>
                                    this.setState({
                                        dream: {
                                            ...dream,
                                            title: e.target.value
                                        }
                                    })
                                }
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Category:</Label>
                            <Input
                                type="select"
                                value={dream.category}
                                onChange={(e) =>
                                    this.setState({
                                        dream: {
                                            ...dream,
                                            category: e.target.value
                                        }
                                    })
                                }
                            >
                                <option value="joy">Joy</option>
                                <option value="despair">Despair</option>
                                <option value="fear">Fear</option>
                                <option value="desire">Desire</option>
                                <option value="love">Love</option>
                                <option value="confusion">Confusion</option>
                                <option value="humiliation">Humiliation</option>
                                <option value="envy">Envy</option>
                                <option value="mundanity">Mundanity</option>
                                <option value="fortune">Fortune</option>
                                <option value="rage">Rage</option>
                                <option value="memory">Memory</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                Content: {dream.content.length}/255
                            </Label>
                            <Input
                                type="textarea"
                                maxLength={255}
                                value={dream.content}
                                onChange={(e) =>
                                    this.setState({
                                        dream: {
                                            ...dream,
                                            content: e.target.value
                                        }
                                    })
                                }
                            />
                        </FormGroup>

                        <FormGroup>
                            <Row>
                                <Col>NSFW?</Col>
                                <Col>
                                    <Input
                                        type="checkbox"
                                        checked={dream.isNSFW}
                                        onChange={() =>
                                            this.setState({
                                                dream: {
                                                    ...dream,
                                                    isNSFW: !dream.isNSFW
                                                }
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </FormGroup>

                        <Button
                            disabled={!dream.title || !dream.content}
                            type="submit"
                            color="primary"
                        >
                            UPDATE
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>
        );
    }
}
