
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
        <Typography variant="h5" component="h3" style={{ wordBreak: "break-all" }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" component="p" style={{ wordBreak: "break-all" }}>
          {message}
        </Typography>
      </Box>
    </Box>
  ));
}
