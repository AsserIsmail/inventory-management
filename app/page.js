"use client";
import { useState, useEffect } from "react";
import {firestore} from "@/firebase";
import { Box, Typography, Button, TextField, Modal, Stack, IconButton } from "@mui/material";
import { collection, getDoc, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';




export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [fullInventory, setFullInventory] = useState([]);

  const searchItem = async (search) => {
    const filteredInventory = fullInventory.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    setInventory(filteredInventory);
    return filteredInventory;
  }

  const handleSearch = async (e) => {
    if (e === '') {
      setSearchError(false);
      await searchItem(e);
      return;
    }    
    const searchResult = await searchItem(e);

    if (searchResult.length > 0) {
      setSearchError(false);
    } else { 
      setSearchError(true); 
    }
  }

  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory')); 
    // query is a function that takes a collection reference and returns a query object
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setFullInventory(inventoryList);
    setInventory(inventoryList);
  }

  const addItem = async (item) => {
    // const itemLower = item.toLowerCase();
    const itemRef = doc(firestore, 'inventory', item);
    const itemDoc = await getDoc(itemRef);
    if (itemDoc.exists()) {
      const { quantity } = itemDoc.data();
      await updateDoc(itemRef, { quantity: quantity + 1 });
    }
    else {
      await setDoc(itemRef, { quantity: 1 });
    }
    await updateInventory();
  }


  const removeItem = async (item) => {
    const itemRef = doc(firestore, 'inventory', item);
    const itemDoc = await getDoc(itemRef);
    if (itemDoc.exists()) {
      if (itemDoc.data().quantity > 1) {
        const { quantity } = itemDoc.data();
        await updateDoc(itemRef, { quantity: quantity - 1 });
      }
      else {
        await deleteDoc(itemRef);
      }
    }
    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => { setOpen(true); }
  const handleClose = () => { setOpen(false); }

  return (
    <Box width="100vm" height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} bgcolor="#bcaaa4">
        
      <Box width="700px" height="100px" display="flex" justifyContent="center" alignItems="center" gap={2} bgcolor="#424242" color="white" borderRadius={3}>
        <Typography variant="h3" fontFamily="Times New Roman">Inventory Management</Typography>
      </Box>

     
      <Modal open={open} onClose={handleClose}> 
        <Box bgcolor="#bcaaa4" position={"absolute"} top="50%" left="50%" border="2px solid black" p={4} display="flex" flexDirection="column" gap={3} sx={{transform:"translate(-50%, -50%)"}}>
          <Typography variant="h4">Add Item</Typography>

          <Stack width="100%" direction="row" gap={2}>
            <TextField label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            {/* <Button  variant="outlined" endIcon={<AddShoppingCartIcon />}>Add</Button> */}
            <IconButton color="primary" aria-label="add to shopping cart" onClick={() => {addItem(itemName); handleClose(); setItemName('');}}>
              <AddShoppingCartIcon />
            </IconButton>
          </Stack>

        </Box>
      </Modal>


      <Box display="flex" alignItems="center" justifyContent={'space-between'} width="600px" gap={2}>
        <TextField color="secondary" bgcolor="white" id="standard-basic" label="Search" variant="standard" onChange={(e) => handleSearch(e.target.value)}  error={searchError}
          helperText={searchError ? "Error" : ""} focused/>

        <Button onClick={handleOpen} variant="contained" color="secondary">Add Item</Button>
      </Box>

     
      <Box border="1px solid black" borderRadius={3}>
      <Stack width="600px" height="400px" direction="column" spacing={2} overflow="auto">
        {
          inventory.map(({name, quantity}) => (
            <Box key={name} width="100%" display="flex" justifyContent="space-between" alignItems="center" p={2} borderRadius={3} bgcolor="#bdbdbd">
              <Typography variant="h6" color="#333" >{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Stack direction="row" gap={2} spacing={2}>
                <Button onClick={() => addItem(name)} variant="contained" color="success">+</Button>
                <Typography variant="h6" color="#333">{quantity}</Typography>
                <Button onClick={() => removeItem(name)} variant="contained" color="error">-</Button>
              </Stack>
              
            </Box>
          ))
        }

      </Stack>
      </Box>
    </Box>
  );
}
