// import React, { useEffect } from "react";
// import "../AddToInventory/addToInventory.css";
// import { Button } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useState } from "react";
// import { Box } from "@mui/material";
// import heic2any from "heic2any";
// import Alert from "@mui/material/Alert";
// import IconButton from "@mui/material/IconButton";
// import Collapse from "@mui/material/Collapse";
// import CloseIcon from "@mui/icons-material/Close";
// import SelectCategoryDropDown from "../../components/SelectCategoryDropDown/SelectCategoryDropDown";

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

// function AddToInventory() {
//   const [previewURL, setPreviewURL] = useState(null);
//   const [isUploaded, setIsUploaded] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [fileData, setFileData] = useState();

//   const SERVER = import.meta.env.VITE_SERVER;

//   const allowedFileTypes = ["png", "jpeg", "jpg", "heic"]

//   const checkFileType = (fileData) => {
//     let fileType = fileData[0].type
//     fileType = fileType.split("/")[1]
//     if (allowedFileTypes.includes(fileType)) {
//       return true
//     } else {
//       return false
//     }
//   }

//   const handleFileSubmission = async (fileData) => {
//     const safeFileToUpload = checkFileType(fileData)
//     if (safeFileToUpload) {
//       setFileData(fileData)
//       setOpen(false);

//       const file = fileData[0];

//       if (file) {
//         if (file.type === "image/heic") {
//           try {
//             const convertedBlob = await heic2any({
//               blob: file,
//               toType: "image/jpeg",
//             });
//             console.log("ConvertedBlob:", convertedBlob);
//             const url = URL.createObjectURL(convertedBlob);
//             console.log("url:", url);
//             setPreviewURL(url); // use this in <img src={previewUrl} />
//           } catch (error) {
//             console.log("Error in conversion of heic:", error);
//           }
//         } else {
//           const url = URL.createObjectURL(fileData[0]);
//           setPreviewURL(url);
//         }
//       }
//     } else {
//       console.log("CANNOT UPLOAD FILE, IT IS AN INVALID FILE TYPE")
//     }
//   };

//   useEffect(() => {
//     if (previewURL != null) {
//       setIsUploaded(true);
//       setOpen(true);
//       console.log("ISUPLOADED:", isUploaded);
//     }
//   }, [previewURL]);

//   return (
//     <div className="main-container-ATI">
//       <div style={{ width:'30%', display: 'flex', justifyContent:'center', marginLeft: '10%'}}>
//       <SelectCategoryDropDown uploadedImage={isUploaded} fileData={fileData} />
//       </div>

//       <div className="addToInventoryContainer">
//         <h1
//           style={{
//             backgroundColor: "#EBE5C2",
//             padding: "0.5%",
//             border: "solid",
//           }}
//         >
//           Add to your inventory here!
//         </h1>
//         <div className="center-blocks">
//           <Box
//             component="img"
//             sx={{
//               height: 466,
//               width: 700,
//               maxHeight: { xs: 466, md: 334 },
//               maxWidth: { xs: 700, md: 500 },
//               border: "solid black",
//             }}
//             src={previewURL}
//             hidden={!isUploaded}
//           />
//           <Collapse in={open}>
//             <Alert
//               action={
//                 <IconButton
//                   aria-label="close"
//                   color="inherit"
//                   size="small"
//                   onClick={() => {
//                     setOpen(false);
//                   }}
//                 >
//                   <CloseIcon fontSize="inherit" />
//                 </IconButton>
//               }
//               sx={{ mb: 2, backgroundColor: "#EBE5C2", color: "#504B38" }}
//               variant="filled"
//               severity="success"
//             >
//               Successfully displayed image!
//             </Alert>
//           </Collapse>

//           <div
//             style={{
//               width: "50%",
//               height: "10%",
//               marginTop: "auto",
//               marginBottom: "3%",
//             }}
//           >
//             <Button
//               component="label"
//               role={undefined}
//               variant="contained"
//               tabIndex={-1}
//               sx={{
//                 width: "50%",
//                 height: "100%",
//                 backgroundColor: "#EBE5C2",
//                 color: "#504B38",
//               }}
//             >
//               Upload files
//               <VisuallyHiddenInput
//                 type="file"
//                 onChange={(event) => handleFileSubmission(event.target.files)}
//                 multiple
//               />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddToInventory;

import React, { useEffect, useState } from "react";
import "../AddToInventory/addToInventory.css";
import { Button, Box, Alert, IconButton, Collapse } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import heic2any from "heic2any";
import SelectCategoryDropDown from "../../components/SelectCategoryDropDown/SelectCategoryDropDown";

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
  const [isUploaded, setIsUploaded] = useState(true);
  const [open, setOpen] = useState(false);
  const [fileData, setFileData] = useState();

  const SERVER = import.meta.env.VITE_SERVER;

  const allowedFileTypes = ["png", "jpeg", "jpg", "heic"];

  const checkFileType = (fileData) => {
    let fileType = fileData[0].type.split("/")[1];
    return allowedFileTypes.includes(fileType);
  };

  const handleFileSubmission = async (fileData) => {
    const safeFileToUpload = checkFileType(fileData);
    if (safeFileToUpload) {
      setFileData(fileData);
      setOpen(false);

      const file = fileData[0];

      if (file) {
        if (file.type === "image/heic") {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });
            const url = URL.createObjectURL(convertedBlob);
            setPreviewURL(url);
          } catch (error) {
            console.log("Error in conversion of heic:", error);
          }
        } else {
          const url = URL.createObjectURL(file);
          setPreviewURL(url);
        }
      }
    } else {
      console.log("CANNOT UPLOAD FILE, IT IS AN INVALID FILE TYPE");
    }
  };

  useEffect(() => {
    if (previewURL != null) {
      setIsUploaded(true);
      setOpen(true);
    }
  }, [previewURL]);

  return (
    <div className="add-inventory-page">
      <h1 className="add-inventory-title">Add to your inventory</h1>
      <div className="add-inventory-flex">
        <div className="left-column">
          <SelectCategoryDropDown
            uploadedImage={isUploaded}
            fileData={fileData}
          />
          {/* Save button could go here if needed */}
        </div>

        <div className="right-column">
          <Box
            component="img"
            className="preview-img"
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
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2, backgroundColor: "#EBE5C2", color: "#504B38" }}
              variant="filled"
              severity="success"
            >
              Successfully displayed image!
            </Alert>
          </Collapse>

          <div className="upload-button-wrapper">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              sx={{
                width: "100%",
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
      </div>
    </div>
  );
}

export default AddToInventory;
