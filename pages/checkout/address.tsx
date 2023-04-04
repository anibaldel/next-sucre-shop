import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { GetServerSideProps } from 'next'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { cities, jwt } from '../../utils'
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { CartContext } from '../../context/cart/CartContext';

type FormData = {
    firstName : string;
    lastName : string;
    address  : string;
    address2?: string;
    city     : string;
    phone    : string;
}

const getAddressFromCookies = ():FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName : Cookies.get('lastName') || '',
        address  : Cookies.get('address') || '',
        address2 : Cookies.get('address2') || '',
        city     : Cookies.get('city') || 'Sucre',
        phone    : Cookies.get('phone') || '',
    }
}

const AddressPage = () => {
    const router = useRouter();
    const { updateAddress } = useContext(CartContext);
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    // useEffect(()=> {
    //     reset(getAddressFromCookies() );
    // }, [reset]);

    const onSubmitAddress = (data: FormData)=> {
        // console.log(data);
        updateAddress(data);

        router.push('/checkout/summary')
    }
  return (
    <ShopLayout title={'Dirección'} pageDescription={'Confirmar direccion del destino'}>
        <form onSubmit={ handleSubmit( onSubmitAddress) } noValidate>
            <Typography variant='h1' component='h1'>Dirección</Typography>
            <Grid container spacing={ 2 } sx={{ mt:2 }}>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Nombre' 
                        variant='filled'
                        type="name" 
                        fullWidth
                        { ...register('firstName', {
                            required: 'Este campo es requerido',
                        })} 
                        error = {!!errors.firstName}
                        helperText= { errors.firstName?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Apellido' 
                        variant='filled' 
                        fullWidth
                        { ...register('lastName', {
                            required: 'Este campo es requerido',
                        })} 
                        error = {!!errors.lastName}
                        helperText= { errors.lastName?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Dirección' 
                        variant='filled' 
                        fullWidth
                        { ...register('address', {
                            required: 'Este campo es requerido',
                        })} 
                        error = {!!errors.address}
                        helperText= { errors.address?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Dirección 2 *(opcional)' 
                        variant='filled' 
                        fullWidth
                        { ...register('address2')} 
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <FormControl fullWidth>
                        {/* <TextField
                            select
                            variant='filled'
                            label='Ciudad'
                            defaultValue={ Cookies.get('city') || cities[4].code }
                            { ...register('city', {
                                required: 'Este campo es requerido',
                            })} 
                            error = {!!errors.city}
                        >
                            {
                                cities.map(city=>(
                                    <MenuItem
                                        key={ city.code } 
                                        value={ city.code }
                                    >{ city.name } </MenuItem>
                                ))
                            }
                        </TextField> */}
                        <TextField 
                            label='Ciudad' 
                            variant='filled' 
                            fullWidth
                            defaultValue="Sucre"
                            { ...register('city', {
                                required: 'Este campo es requerido',
                            })} 
                            error = {!!errors.city}
                            helperText= { errors.city?.message }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Celular' 
                        variant='filled' 
                        fullWidth
                        { ...register('phone', {
                            required: 'Este campo es requerido',
                        })} 
                        error = {!!errors.phone}
                        helperText= { errors.phone?.message }
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt:5 }} display='flex' justifyContent='center'>
                <Button
                    type="submit" 
                    color="secondary" 
                    className="circular-btn" 
                    size='large'
                >
                    Revisar Pedido
                </Button>
            </Box>
        </form>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//     const { token = '' } = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken( token );
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if( !isValidToken ) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false,
//             }
//         }
//     }

//     return {
//         props: {
            
//         }
//     }
// }

export default AddressPage