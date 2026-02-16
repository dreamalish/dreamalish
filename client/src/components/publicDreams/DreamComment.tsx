import React, { FormEvent } from "react";
import { DreamType, CommentType, UserType } from "../../types/CustomTypes";
import { Modal, Form, FormGroup, Input, Button } from "reactstrap";
import { authFetch } from "../../helper/APIHelper";

type AcceptedProps = {
  dream: DreamType;
  user: UserType;
  setDreamToComment: (dream: DreamType) => void;
};


type DreamCommentState = {
  comment: CommentType;
};

export default class DreamComment extends React.Component<
  AcceptedProps,
  DreamCommentState
> {
  constructor(props: AcceptedProps) {
    super(props);
    this.state = {
      comment: {
        content: "",
        dreamId: this.props.dream.id,
        userId: this.props.user.id
      }
    };
  }

  async handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await authFetch("/api/comments/create", {
        method: "POST",
        body: JSON.stringify(this.state.comment)
      });

      if (res.id) {
        this.props.setDreamToComment({
          category: "",
          content: "",
          isNSFW: false,
          title: "",
          id: 0,
          userId: 0,
          Comments: []
        });
      }
    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  }

  render() {
    return (
      <Modal isOpen={true}>
        <div className="p-3">
          <h4>Comment on {this.props.dream.title}</h4>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <FormGroup>
              <Input
                type="textarea"
                value={this.state.comment.content}
                onChange={(e) => {
                  this.setState({
                    comment: {
                      ...this.state.comment,
                      content: e.target.value
                    }
                  });
                }}
              />
            </FormGroup>

            <Button type="submit">SUBMIT COMMENT</Button>
            <Button
              color="secondary"
              onClick={() =>
                this.props.setDreamToComment({
                  category: "",
                  content: "",
                  isNSFW: undefined,
                  title: "",
                  id: 0,
                  userId: 0,
                  Comments: []
                })
              }
            >
              CANCEL
            </Button>
          </Form>
        </div>
      </Modal>
    );
  }
}
