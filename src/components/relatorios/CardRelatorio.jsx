import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";

export default function CardRelatorio({ title, content, click=()=>{} }) {
  return (
    <Card style={{ maxWidth: 375 }} className="cardBackground">
      <CardActionArea onClick={()=>click()}>
        <CardContent>
          <h2 className="cardText">{title}</h2>
          <p className="cardText">{content}</p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
