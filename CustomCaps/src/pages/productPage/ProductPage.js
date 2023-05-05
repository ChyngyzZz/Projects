import React, {useEffect, useState} from 'react';
import style from '../basketPage/css/BasketPage.module.css';
import classes from './css/ProductPage.module.css';
import {useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getProduct} from "../../redux/slice/ProductSlice";
import {ProductsSelect} from "../../redux/slice/ProductsSlice";
import {CircularProgress} from "@mui/material";
import cap1 from '../../media/productPage/cap1.png';
import cap2 from '../../media/productPage/cap2.png';
import cap3 from '../../media/productPage/cap3.png';
import Slider from "../../components/mainPage/slider/Slider";

const ProductPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const products = useSelector(ProductsSelect);
    const product = useSelector(state => state.cap.product);
    const load = useSelector(state => state.cap.load);
    const [size, setSize] = useState([]);
    const [select, setSelect] = useState('');
    const [count, setCount] = useState(1);
    const params = useParams();

    const handleSelect = ({target}) => {
        setSelect(target.textContent);
    };

    const handleBasket = () => {
        const basket = localStorage.getItem("basket");
        basket === null
            ? localStorage.setItem('basket', JSON.stringify([{...product, select: select, count: count}]))
            : JSON.parse(basket).filter(e => e.name === product.name).length === 0
                ? localStorage.setItem('basket', JSON.stringify([...JSON.parse(basket), product]))
                : localStorage.setItem('basket', JSON.stringify([...JSON.parse(basket).filter(e => e.id !== product.id), {...product, select: select, count: count}]))
    };

    useEffect(()=>{
        window.scrollTo({top: 0});
        const s = ['S', 'M', 'L', 'XL'];
        dispatch(getProduct(products.filter(e=> e.name === params.name)[0]));
        !load && product && setSize(s.slice(0, product.size.length));
    },[products, product, location]);
    return (
        <>
            <div className={classes.productPage}>
                {
                    !load ?
                        product ?
                            <>
                                <div className={classes.left}>
                                    <div className={classes.image}>
                                        <img src={product.image} alt="#"/>
                                    </div>
                                    <div className={classes.images}>
                                        <div><img src={cap1} alt=""/></div>
                                        <div><img src={cap2} alt=""/></div>
                                        <div><img src={cap3} alt=""/></div>
                                    </div>
                                </div>
                                <div className={classes.right}>
                                    <div className={classes.top}>
                                        <div className={classes.text}>
                                            <div>
                                                <h2>{product.name}</h2>
                                                <p>{product.description}</p>
                                            </div>
                                        </div>
                                        <div className={classes.sizes}>
                                            <ul>
                                                {
                                                    size.map((e, k) => <li key={k} style={e === select
                                                        ? {border: "1px solid #000"}
                                                        : {border: "1px solid #C4C4C4"}
                                                    } onClick={handleSelect}>{e}</li>)
                                                }
                                            </ul>
                                        </div>
                                        <div className={style.counter}><button onClick={()=>count > 1 && setCount(count-1)}>-</button>
                                            {count}<button onClick={()=>setCount(count+1)}>+</button></div>
                                    </div>
                                    <div className={classes.bottom}>
                                        <span>{product.price}сом</span>
                                        <button onClick={handleBasket}>Добавить в корзину</button>
                                    </div>
                                </div>
                            </>
                            :
                            <div style={{width: '100%', height: 350, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                {'Page not Found!'}
                            </div>
                        :
                        <div className={classes.load}>
                            <CircularProgress/>
                        </div>
                }
            </div>
            <h2 style={{textAlign: "center", marginBottom: 40}}>Похожие товары</h2>
            <Slider/>
        </>
    );
};

export default ProductPage;