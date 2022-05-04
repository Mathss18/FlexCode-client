import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import BackupIcon from '@mui/icons-material/Backup';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import './drag.css';
import { deleteFromArrayByIndex, formatBytes, moveObjectInArray } from '../utils/functions';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Button, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';

function DragAndDrop({ state, fileType, listFiles, listImages, maxSize = 5242880 }) {
  const [files, setFiles] = state; // Faz uma cópia do state passado, e quando se altera esse state, o state pai também é alterado
  const inputFileRef = useRef();
  const isAllowedFileType = useRef(() => { return true });

  if (fileType !== undefined) {
    switch (fileType) {
      case 'imagem':
        isAllowedFileType.current = (file) => {
          return file && file.type && file.type.match(/^image\//) && file.type != '';
        }
        break
      case 'pdf':
        isAllowedFileType.current = (file) => {
          return file && file.type && file.type.match(/^application\/pdf/) && file.type != '';
        }
        break
      default:
        return true;
    }
  }



  function fileSelected(event) {
    event.preventDefault()
    // === Codigo com File Reader ===
    console.log(event.target.files);
    const filesSelected = Array.from(event.target.files)
    filesSelected.map((file) => {
      const { name, size } = file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const url = reader.result
        const imagem = { nome: name, tamanho: size, url: url }
        if (imagem.tamanho > maxSize) {
          toast.error(`O arquivo ${imagem.nome} é muito grande. O tamanho máximo é de ${formatBytes(maxSize)}`)
          return;
        }

        if (isAllowedFileType.current(file))
          setFiles((prevImages) => [...prevImages, imagem])
        else
          toast.error('Arquivo não é ' + fileType)
      }

    })
  }

  function handleBtnClick() {
    inputFileRef.current.click();
  }

  function changeFavoriteImage(index) {
    console.log(index);
    let newArray = moveObjectInArray(files, index, 0)
    setFiles([...newArray]);
  }

  function deleteFile(index) {
    let newArray = deleteFromArrayByIndex(files, index)
    setFiles([...newArray]);
  }




  const dragEvents = {
    onDragEnter: (event) => {
      event.preventDefault()
    },
    onDragLeave: (event) => {
      event.preventDefault()
    }
    ,
    onDragOver: (event) => {
      event.preventDefault()
    },
    onDrop: (event) => {
      event.preventDefault()
      // === Codigo com File Reader ===
      const files = Array.from(event.dataTransfer.files)
      files.map((file) => {
        const { name, size } = file
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const url = reader.result
          const imagem = { nome: name, tamanho: size, url: url }
          if (isAllowedFileType.current(file))
            setFiles((prevImages) => [...prevImages, imagem])
          else
            toast.error('Arquivo não é ')
        }

      })
      // === Codigo com createObjectURL ===
      // const files = Array.from(event.dataTransfer.files)
      // var uploadedImages = files.map(file => {
      //   const {name, size} = file
      //   if(isAllowedFileType.current(file))
      //     return {name, size, foto: URL.createObjectURL(file)}
      //   else
      //     toast.error('Arquivo não é ')
      // })

      // //remove undefined from array
      // uploadedImages = uploadedImages.filter(image => image != undefined)

      // if(uploadedImages);
      //   setFiles([...files, ...uploadedImages])
    },
  }



  return (

    <div className="dragDropDiv">

      <div className="fileDrop" {...dragEvents}>
        <div className="dragDropText">
          <div className="dragDropLogo">
            <BackupIcon />
          </div>
          <p style={{ margin: 0 }}>Arraste e solte os arquivos aqui</p>
          <p style={{ margin: 0 }}>ou</p>
          <Button onClick={handleBtnClick} variant="outlined" startIcon={<UploadIcon />} className={'btn btn-primary btn-spacing'}>Selecione</Button>
          <input style={{ display: 'none' }} type="file" multiple ref={inputFileRef} onChange={fileSelected} />
        </div>
      </div>

      {listImages && (<div className="imageList">

        <ImageList
          sx={{
            height: '35vh',
            // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
            transform: 'translateZ(0)',
          }}
          rowHeight={300}
          cols={4}
          gap={16}
        >
          {files.map((item, index) => {
            const cols = index == 0 ? 2 : 1;
            const rows = index == 0 ? 2 : 1;

            return (
              <ImageListItem key={index} cols={1} rows={1} className="imageContainer">
                <img
                  style={{ height: '100%' }}
                  className="imageItem"
                  src={item.url}
                  alt={item.nome}
                  loading="lazy"
                />
                <DeleteIcon
                  className="dragDropIconDelete"
                  fontSize="large"
                  sx={{ color: 'white' }}
                  onClick={() => deleteFile(index)}
                />
                <ImageListItemBar
                  sx={{
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  }}
                  title={index == 0 ? 'Imagem Principal' : item.nome}
                  position="top"
                  actionIcon={
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={() => changeFavoriteImage(index)}
                    >
                      {index == 0 ? <StarIcon sx={{ color: 'gold' }} /> : <StarBorderIcon />}
                    </IconButton>
                  }
                  actionPosition="left"
                />
              </ImageListItem>
            );
          })}
        </ImageList>

      </div>)}

      {listFiles && (
        <List style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
        }} dense={true}>
          {files.map((item, index) => {
            return (
              <ListItem key={index}>
                <Tooltip title="Clique para remover" arrow>
                  <ListItemIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => deleteFile(index)}
                  >
                    <AttachFileIcon
                    />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary={item.nome}
                  secondary={formatBytes(item.tamanho)}
                />
              </ListItem>
            )
          })}


        </List>)}



    </div>


  );
}

export default DragAndDrop;