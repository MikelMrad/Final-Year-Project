'use client'
import React from 'react';
import NavBar from "../../../modules/NavBar/index";
import StoreItems from "../../../data/products.json"
import StoreItem  from "../../../components/StoreItem/index"
import { Grid2 } from '@mui/material';
import styles from "./style.module.css";

export default function page() {
  return (
    <div>
      <NavBar/>
      <div>
        <Grid2 
        container
        spacing={6}>
        {StoreItems.map(item => (
          <Grid2 size={3}>
            <StoreItem {...item} key={item.id} /> 
          </Grid2>
        ))}
        </Grid2>
      </div>
    </div>
  )
}
