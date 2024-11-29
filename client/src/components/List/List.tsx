import { Post } from "../../models/post.model";
import Card from "../Card/Card";
import "./List.scss";

interface ListProps {
  data: Post[];
}

const List = ({ data }: ListProps) => {
  return (
    <div className="ui divided items">
      {data.map((post, index) => (
        <Card key={index} post={post} />
      ))}
    </div>
  );
};

export default List;
