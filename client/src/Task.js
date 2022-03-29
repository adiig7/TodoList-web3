import { List , ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Task.css';

const Task=({taskText, onClick})=>{
    return (
        <div style={{display:"flex",justifyContent:"center"}}>
        <List className="todo__list"> 
            <ListItem  >
                <ListItemAvatar />
                    <ListItemText style={{ color: "white"}} primary={taskText} />
            </ListItem>
                <DeleteIcon fontSize="large" style={{ opacity: 0.7 ,color:"red",marginRight:"10px",cursor:"pointer"}} onClick={onClick}/>
            </List>
        </div>    
    )
};

export default Task;
