import React from "react";
import { DreamType, UserType } from "../../types/CustomTypes";
import PublicDreamTable from "./PublicDreamTable";
import { authFetch } from "../../helper/APIHelper";

type AcceptedProps = {
  user: UserType;
  fetchUser: () => void;
};

type PublicDreamIndexState = {
  dreams: DreamType[];
};

export default class PublicDreamIndex extends React.Component<
  AcceptedProps,
  PublicDreamIndexState
> {
  constructor(props: AcceptedProps) {
    super(props);
    this.state = {
      dreams: []
    };
  }

  componentDidMount() {
    this.fetchPublicDreams();
  }

  fetchPublicDreams() {
    authFetch("/api/dreams/public")
      .then((dreamData: DreamType[]) => {
        this.setState({ dreams: dreamData });
      })
      .catch((err) => {
        console.error("Failed to load public dreams:", err);
      });
  }

  render() {
    return (
      <div>
        <PublicDreamTable
          user={this.props.user}
          dreams={this.state.dreams}
          fetchUser={this.props.fetchUser}
        />
      </div>
    );
  }
}
