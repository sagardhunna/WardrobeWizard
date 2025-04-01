import React, { useEffect } from "react";
import "../AddToInventory/addToInventory.css";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Box } from "@mui/material";
import heic2any from "heic2any";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "react-bootstrap/Spinner";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddToInventory() {
  const [previewURL, setPreviewURL] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFileSubmission = async (fileData) => {
    setOpen(false)
    console.log("FileData:", fileData);
    console.log("FileData[0].name:", fileData[0].name);
    console.log("FileData[0].size (in bytes):", fileData[0].size);

    const file = fileData[0];

    if (file) {
      if (file.type === "image/heic") {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });
          const url = URL.createObjectURL(convertedBlob);
          setPreviewURL(url); // use this in <img src={previewUrl} />
        } catch (error) {
          console.log("Error in conversion of heic:", error);
        }
      } else {
        const url = URL.createObjectURL(fileData[0]);
        setPreviewURL(url);
      }
    }
  };

  useEffect(() => {
    if (previewURL != null) {
      setIsUploaded(true);
      setOpen(true);
      console.log("ISUPLOADED:", isUploaded);
    }
  }, [previewURL]);

  return (
    <div className="addToInventoryContainer">
      <h1 style={{ backgroundColor: '#EBE5C2', padding: '0.5%', border: 'solid' }}>Add to your inventory here!</h1>
      <Box
        component="img"
        sx={{
          height: 466,
          width: 700,
          maxHeight: { xs: 466, md: 334 },
          maxWidth: { xs: 700, md: 500 },
          border: "solid black",
        }}
        src={previewURL}
        hidden={!isUploaded}
      />
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, backgroundColor: '#EBE5C2', color: '#504B38' }}
          variant="filled"
          severity="success"
        >
          Successfully uploaded image!
        </Alert>
      </Collapse>

      <div
        style={{
          width: "50%",
          height: "10%",
          marginTop: "auto",
          marginBottom: "3%",
        }}
      >
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          sx={{
            width: "50%",
            height: "100%",
            backgroundColor: "#EBE5C2",
            color: "#504B38",
          }}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => handleFileSubmission(event.target.files)}
            multiple
          />
        </Button>
      </div>
    </div>
  );
}

export default AddToInventory;
