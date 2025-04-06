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
    'Hats'
];


export default function SelectCategoryDropDown({ uploadedImage, fileData }) {

  const SERVER = import.meta.env.VITE_SERVER;

  const [categoryName, setCategoryName] = React.useState([]);
  const [canSave, setCanSave] = useState(false);

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

  async function testDataConversion() {
    console.log("Filedata in testDataConversion:", fileData[0])

    const formData = new FormData();

    formData.append("file-to-save", fileData[0]);
    console.log("Filedata[0]", fileData[0]);
  
    try {
      const options = {
        method: "POST",
        body: formData,
        credentials: "include",
      };
  
      const promise = await fetch(`${SERVER}/testFileConversion`, options);
      const response = await promise.json();
  
      console.log("Response from testFileConversion:", response);
    } catch (error) {
      console.log("Error in testFileConversion:", error);
    }

  }


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
    } catch (error) {
      console.log("Error in getting file data:", error);
    }
  }

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
          marginTop: '5%'
        }}
        onClick={testDataConversion}
      >
        Test Data Conversion
      </Button>
    </div>
  );
}