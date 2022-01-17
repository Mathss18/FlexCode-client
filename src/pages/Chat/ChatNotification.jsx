
import { Avatar, Badge, Box, Typography } from '@material-ui/core';
import toast from 'react-hot-toast';


export function notification(title, message, foto='') {
  toast((t) => (
    <Box display="flex">
      <Badge
        className={'user-badge'}
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar alt={'user'} className={'user-photo'} src={foto} sx={{ width: 48, height: 48 }} />
      </Badge>
      <Box display="flex" flexDirection="column" ml="10px" flexWrap="wrap">
        <Typography variant="h6" style={{ wordBreak: "break-word" }}>
          {title}
        </Typography>
        <Typography variant="subtitle2" style={{ wordBreak: "break-word" }}>
          {message}
        </Typography>
      </Box>
    </Box>
  ));
}
