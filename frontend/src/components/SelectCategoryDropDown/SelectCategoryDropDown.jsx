import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@emotion/react';
import './selectCategoryDropDown.css';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const categories = [
    '',
    'Top',
    'Bottom',
    'Shoes',
    'Hat'
];


export default function SelectCategoryDropDown({ uploadedImage, fileData }) {

  const SERVER = import.meta.env.VITE_SERVER;

  const [categoryName, setCategoryName] = React.useState([]);
  const [canSave, setCanSave] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [userID, setUserID] = useState(-1)

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    if (categoryName != '' && fileData != undefined) {
        console.log("Category name:", categoryName)
        console.log("File data:", fileData)
        setCanSave(true)
    }
  }, [categoryName])

  // async function testDataConversion() {
  //   console.log("Filedata in testDataConversion:", fileData[0])

  //   const formData = new FormData();

  //   formData.append("file-to-save", fileData[0]);
  //   console.log("Filedata[0]", fileData[0]);
  
  //   try {
  //     const options = {
  //       method: "POST",
  //       body: formData,
  //       credentials: "include",
  //     };
  
  //     const promise = await fetch(`${SERVER}/testFileConversion`, options);
  //     const response = await promise.json();
  
  //     console.log("Response from testFileConversion:", response);
  //   } catch (error) {
  //     console.log("Error in testFileConversion:", error);
  //   }

  // }


    // if image has been uploaded and we contain it's data, we need to first check if they have a category selected, then
  // we can save the images to AWS and SQL
  async function handleSave() {
    console.log("Filedata in handle save:", fileData[0])

    const formData = new FormData();

    formData.append("file-to-save", fileData[0]);
    console.log("Filedata[0]", fileData[0]);
  
    try {
      const options = {
        method: "POST",
        body: formData,
        credentials: "include",
      };
  
      const promise = await fetch(`${SERVER}/uploadFile`, options);
      const response = await promise.json();
  
      console.log("Response from uploadFile:", response);
      setImageURL(response.url)
    } catch (error) {
      console.log("Error in getting file data:", error);
    }
  }

  async function getUserID() {
    try {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };
      let promise = await fetch(`${SERVER}/getData`, options);
      let response = await promise.json();

      const userEmail = response.data.userinfo.email;


      options = {
        method: 'POST',
        body: JSON.stringify({
          user_email: userEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }

      promise = await fetch(`${SERVER}/getUserID`, options)
      response = await promise.json()

      setUserID(response.user_id)
    } catch (error) {
      console.log("Error in getUserID", error)
    }
  }

  async function saveImageToDB() {
    try {
      console.log("User id is:", userID)
      console.log("category is:", categoryName[0])
      console.log("image url is:", imageURL)

      const options = {
        method: 'POST',
        body: JSON.stringify({
          user_id: userID,
          image_category: categoryName[0],
          image_url: imageURL,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }

      const promise = await fetch(`${SERVER}/saveImageToSQL`, options)
      const response = await promise.json()

      console.log("Response from saveImageToDB:", response)
    } catch (error) {
      console.log("Error in saveImageToDB:", error)
    }
  }

  useEffect(() => {
    if (userID != -1) {
      console.log("IN PRIMARY USE EFFECT")
      saveImageToDB()
      
      setUserID(-1)
      setImageURL('')
    }
  }, [userID])

  useEffect(() => {
    if (imageURL != '') {
      console.log("IMAGE URL IS:", imageURL)
      getUserID()
    }
  }, [imageURL])

  // Once save is pressed, we upload our file data to our database, which returns an image url
  // this then sets the iamge url, which triggers the useEffect which calls getUserID
  // this then sets the user id which triggers the useEffect that finally saves our image to our database
  // then we rest our userID and imageURL values for the next time we upload an image

  return (
    <div className='dropdown-container'>
      <FormControl sx={{ width:'15vw' }}>
        <Select
          value={categoryName}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {categories.map((category) => (
            <MenuItem
              key={category}
              value={category}
            >
              {category}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select Category</FormHelperText>
      </FormControl>
        <br />

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
        disabled={!canSave}
        onClick={handleSave}
      >
        Save Image
      </Button>
    </div>
  );
}