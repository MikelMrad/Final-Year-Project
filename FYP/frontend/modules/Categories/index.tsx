import React from 'react'
import styles from './style.module.css'
import { Card, CardContent ,CardHeader ,CardMedia} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setFilterCategory } from '@/redux/features/categorySlice';
import categories from "../../data/categories.json"

export default function index() {

  const dispatch = useDispatch();
  const handleFilterChange = (category: string) => {
    dispatch(setFilterCategory(category));
  };

  
  return (
    <div className={styles.container}>
      <h1> Categories</h1>
      <div className={styles.cardContainer}>
      {categories.map((category) => (
        <a href='Category' onClick={() =>handleFilterChange(category.id)}>
          <Card className={styles.card}>
          <CardHeader title={category.label}/>
          <CardMedia
            component="img"
            alt="Product Image"
            image={category.icon}
          />
          <CardContent>
            <p>Shop {category.label}.</p>
          </CardContent>
          </Card>
        </a>
      ))}
      </div>
    </div>
  )
}
